import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET /api/customers
// List all customers with pagination (?page=1&limit=10), search (?search=name_or_phone),
// filter by area (?area=xxx) and status (?active=true/false). Include order count.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim();
    const area = searchParams.get("area")?.trim();
    const active = searchParams.get("active");

    const where: Prisma.CustomerWhereInput = {};

    if (active !== null && active !== undefined && active !== "") {
      where.isActive = active === "true";
    }

    if (area) {
      where.area = { contains: area, mode: "insensitive" };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { nameBn: { contains: search, mode: "insensitive" } },
        { altPhone: { contains: search } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              orders: true,
              cylinders: true,
            },
          },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return NextResponse.json({
      data: customers,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/customers
// Create new customer. Required: name, phone, address, area.
// Optional: nameBn, addressBn, areaBn, altPhone, notes. Validate phone uniqueness.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, address, area, nameBn, addressBn, areaBn, altPhone, notes } = body;

    // Validate required fields
    if (!name?.trim() || !phone?.trim() || !address?.trim() || !area?.trim()) {
      return NextResponse.json(
        { error: "Name, phone, address, and area are required" },
        { status: 400 }
      );
    }

    // Validate phone uniqueness
    const existingCustomer = await prisma.customer.findUnique({
      where: { phone: phone.trim() },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: "Customer with this phone number already exists" },
        { status: 409 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        area: area.trim(),
        nameBn: nameBn?.trim() || null,
        addressBn: addressBn?.trim() || null,
        areaBn: areaBn?.trim() || null,
        altPhone: altPhone?.trim() || null,
        notes: notes?.trim() || null,
        isActive: true,
      },
    });

    return NextResponse.json({ data: customer }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer", details: error.message },
      { status: 500 }
    );
  }
}
