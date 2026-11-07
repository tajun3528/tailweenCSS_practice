import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CylinderSize, CylinderStatus, Prisma } from "@prisma/client";

// GET /api/cylinders
// List cylinders with filters (?size=KG_12&status=FULL), pagination, include current customer info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    const size = searchParams.get("size");
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim();
    const customerId = searchParams.get("customerId");

    const where: Prisma.CylinderWhereInput = {};

    if (size && Object.values(CylinderSize).includes(size as CylinderSize)) {
      where.size = size as CylinderSize;
    }

    if (status && Object.values(CylinderStatus).includes(status as CylinderStatus)) {
      where.status = status as CylinderStatus;
    }

    if (customerId) {
      where.currentCustomerId = customerId;
    }

    if (search) {
      where.serialNumber = { contains: search, mode: "insensitive" };
    }

    const [cylinders, total] = await Promise.all([
      prisma.cylinder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
              area: true,
            },
          },
        },
      }),
      prisma.cylinder.count({ where }),
    ]);

    return NextResponse.json({
      data: cylinders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching cylinders:", error);
    return NextResponse.json(
      { error: "Failed to fetch cylinders", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/cylinders
// Create new cylinder. Required: serialNumber, size. Validate serial number uniqueness.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serialNumber, size, status, currentCustomerId, notes } = body;

    // Validate required fields
    if (!serialNumber?.trim() || !size) {
      return NextResponse.json(
        { error: "Serial number and size are required" },
        { status: 400 }
      );
    }

    // Validate size enum
    if (!Object.values(CylinderSize).includes(size as CylinderSize)) {
      return NextResponse.json(
        {
          error: `Invalid cylinder size. Valid sizes are: ${Object.values(
            CylinderSize
          ).join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !Object.values(CylinderStatus).includes(status as CylinderStatus)) {
      return NextResponse.json(
        {
          error: `Invalid cylinder status. Valid statuses are: ${Object.values(
            CylinderStatus
          ).join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate serial number uniqueness
    const existingCylinder = await prisma.cylinder.findUnique({
      where: { serialNumber: serialNumber.trim() },
    });

    if (existingCylinder) {
      return NextResponse.json(
        { error: "Cylinder with this serial number already exists" },
        { status: 409 }
      );
    }

    // If currentCustomerId is provided, check customer existence
    if (currentCustomerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: currentCustomerId },
      });
      if (!customer) {
        return NextResponse.json(
          { error: "Assigned customer not found" },
          { status: 404 }
        );
      }
    }

    const cylinder = await prisma.cylinder.create({
      data: {
        serialNumber: serialNumber.trim(),
        size: size as CylinderSize,
        status: (status as CylinderStatus) || CylinderStatus.EMPTY,
        currentCustomerId: currentCustomerId || null,
        notes: notes?.trim() || null,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            area: true,
          },
        },
      },
    });

    return NextResponse.json({ data: cylinder }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating cylinder:", error);
    return NextResponse.json(
      { error: "Failed to create cylinder", details: error.message },
      { status: 500 }
    );
  }
}
