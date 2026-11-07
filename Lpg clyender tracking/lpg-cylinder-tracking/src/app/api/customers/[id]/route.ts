import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CylinderStatus } from "@prisma/client";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/customers/[id]
// Get customer by ID with orders and cylinders in use
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          include: {
            orderItems: {
              include: {
                cylinder: true,
              },
            },
            delivery: {
              include: {
                deliveryPerson: {
                  select: {
                    id: true,
                    name: true,
                    phone: true,
                  },
                },
              },
            },
            invoice: {
              include: {
                payments: true,
              },
            },
          },
        },
        cylinders: {
          where: {
            status: CylinderStatus.IN_USE,
          },
        },
        _count: {
          select: {
            orders: true,
            cylinders: true,
            invoices: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: customer });
  } catch (error: any) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/customers/[id]
// Update customer fields
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();

    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const {
      name,
      nameBn,
      phone,
      altPhone,
      address,
      addressBn,
      area,
      areaBn,
      notes,
      isActive,
    } = body;

    // If phone number is being changed, ensure it's not already in use by another customer
    if (phone && phone.trim() !== existingCustomer.phone) {
      const phoneExists = await prisma.customer.findUnique({
        where: { phone: phone.trim() },
      });

      if (phoneExists) {
        return NextResponse.json(
          { error: "Phone number is already in use by another customer" },
          { status: 409 }
        );
      }
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(nameBn !== undefined && { nameBn: nameBn ? nameBn.trim() : null }),
        ...(phone !== undefined && { phone: phone.trim() }),
        ...(altPhone !== undefined && { altPhone: altPhone ? altPhone.trim() : null }),
        ...(address !== undefined && { address: address.trim() }),
        ...(addressBn !== undefined && { addressBn: addressBn ? addressBn.trim() : null }),
        ...(area !== undefined && { area: area.trim() }),
        ...(areaBn !== undefined && { areaBn: areaBn ? areaBn.trim() : null }),
        ...(notes !== undefined && { notes: notes ? notes.trim() : null }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return NextResponse.json({ data: updatedCustomer });
  } catch (error: any) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/customers/[id]
// Soft delete customer (set isActive = false)
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const deactivatedCustomer = await prisma.customer.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      data: {
        message: "Customer deactivated successfully",
        customer: deactivatedCustomer,
      },
    });
  } catch (error: any) {
    console.error("Error deactivating customer:", error);
    return NextResponse.json(
      { error: "Failed to deactivate customer", details: error.message },
      { status: 500 }
    );
  }
}
