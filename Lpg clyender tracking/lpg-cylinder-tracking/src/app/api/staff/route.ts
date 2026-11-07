import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

// GET /api/staff
// List staff/users with role filter, pagination, search, excluding passwords
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    const role = searchParams.get("role");
    const active = searchParams.get("active");
    const search = searchParams.get("search")?.trim();

    const where: Prisma.UserWhereInput = {};

    if (role && Object.values(Role).includes(role as Role)) {
      where.role = role as Role;
    }

    if (active !== null && active !== undefined && active !== "") {
      where.isActive = active === "true";
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { nameBn: { contains: search, mode: "insensitive" } },
      ];
    }

    const [staff, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          nameBn: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              deliveries: true,
              cylinderTransactions: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      data: staff,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { error: "Failed to fetch staff members", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/staff
// Create new staff. Required: name, email, phone, password, role. Hash password with bcrypt before saving.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password, role, nameBn, isActive } = body;

    // Validate required fields
    if (
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !password ||
      !role
    ) {
      return NextResponse.json(
        {
          error:
            "Name, email, phone, password, and role are required fields",
        },
        { status: 400 }
      );
    }

    // Validate role
    if (!Object.values(Role).includes(role as Role)) {
      return NextResponse.json(
        {
          error: `Invalid role. Valid roles are: ${Object.values(Role).join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Validate password length
    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    // Check email and phone uniqueness
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { phone: normalizedPhone }],
      },
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === normalizedEmail) {
        return NextResponse.json(
          { error: "A user with this email already exists" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "A user with this phone number already exists" },
        { status: 409 }
      );
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        nameBn: nameBn?.trim() || null,
        email: normalizedEmail,
        phone: normalizedPhone,
        password: hashedPassword,
        role: role as Role,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
      select: {
        id: true,
        name: true,
        nameBn: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ data: newUser }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating staff:", error);
    return NextResponse.json(
      { error: "Failed to create staff member", details: error.message },
      { status: 500 }
    );
  }
}
