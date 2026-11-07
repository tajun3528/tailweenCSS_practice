import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CylinderSize, CylinderStatus, TransactionType } from "@prisma/client";

interface RouteParams {
  params: {
    id: string;
  };
}

function inferTransactionType(
  fromStatus: CylinderStatus,
  toStatus: CylinderStatus
): TransactionType {
  if (toStatus === CylinderStatus.DAMAGED) {
    return TransactionType.DAMAGE;
  }
  if (fromStatus === CylinderStatus.DAMAGED) {
    return TransactionType.REPAIR;
  }
  if (toStatus === CylinderStatus.FULL && fromStatus === CylinderStatus.EMPTY) {
    return TransactionType.REFILL;
  }
  if (
    toStatus === CylinderStatus.IN_USE ||
    toStatus === CylinderStatus.IN_TRANSIT
  ) {
    return TransactionType.DISPATCH;
  }
  if (
    toStatus === CylinderStatus.EMPTY &&
    fromStatus === CylinderStatus.IN_USE
  ) {
    return TransactionType.RETURN;
  }
  return TransactionType.REFILL;
}

// GET /api/cylinders/[id]
// Get cylinder by ID with transaction history
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    const cylinder = await prisma.cylinder.findUnique({
      where: { id },
      include: {
        customer: true,
        transactions: {
          orderBy: { createdAt: "desc" },
          include: {
            performedBy: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!cylinder) {
      return NextResponse.json(
        { error: "Cylinder not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: cylinder });
  } catch (error: any) {
    console.error("Error fetching cylinder:", error);
    return NextResponse.json(
      { error: "Failed to fetch cylinder", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/cylinders/[id]
// Update cylinder (status, currentCustomerId, notes).
// When status changes, auto-create a CylinderTransaction record.
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();

    const existingCylinder = await prisma.cylinder.findUnique({
      where: { id },
    });

    if (!existingCylinder) {
      return NextResponse.json(
        { error: "Cylinder not found" },
        { status: 404 }
      );
    }

    const {
      status,
      currentCustomerId,
      notes,
      size,
      performedById,
      transactionType,
      transactionNotes,
    } = body;

    // Validate size if provided
    if (size && !Object.values(CylinderSize).includes(size as CylinderSize)) {
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
    if (
      status &&
      !Object.values(CylinderStatus).includes(status as CylinderStatus)
    ) {
      return NextResponse.json(
        {
          error: `Invalid cylinder status. Valid statuses are: ${Object.values(
            CylinderStatus
          ).join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Check if customer exists if currentCustomerId is being updated to a non-null value
    if (currentCustomerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: currentCustomerId },
      });
      if (!customer) {
        return NextResponse.json(
          { error: "Customer not found" },
          { status: 404 }
        );
      }
    }

    const statusChanged = status && status !== existingCylinder.status;

    // Execute in transaction if status changes so cylinder and transaction record stay in sync
    const updatedCylinder = await prisma.$transaction(async (tx) => {
      let resolvedUserId = performedById;

      if (statusChanged) {
        if (resolvedUserId) {
          const userExists = await tx.user.findUnique({
            where: { id: resolvedUserId },
          });
          if (!userExists) {
            resolvedUserId = null;
          }
        }

        // Fallback to the first active user if performedById was not provided or invalid
        if (!resolvedUserId) {
          const firstUser = await tx.user.findFirst({
            where: { isActive: true },
            select: { id: true },
          });
          resolvedUserId = firstUser?.id;
        }

        if (resolvedUserId) {
          const txType: TransactionType =
            transactionType &&
            Object.values(TransactionType).includes(
              transactionType as TransactionType
            )
              ? (transactionType as TransactionType)
              : inferTransactionType(
                  existingCylinder.status,
                  status as CylinderStatus
                );

          await tx.cylinderTransaction.create({
            data: {
              cylinderId: id,
              type: txType,
              fromStatus: existingCylinder.status,
              toStatus: status as CylinderStatus,
              performedById: resolvedUserId,
              notes:
                transactionNotes?.trim() ||
                notes?.trim() ||
                `Status changed from ${existingCylinder.status} to ${status}`,
            },
          });
        }
      }

      const updated = await tx.cylinder.update({
        where: { id },
        data: {
          ...(size !== undefined && { size: size as CylinderSize }),
          ...(status !== undefined && { status: status as CylinderStatus }),
          ...(currentCustomerId !== undefined && {
            currentCustomerId: currentCustomerId || null,
          }),
          ...(notes !== undefined && {
            notes: notes ? notes.trim() : null,
          }),
        },
        include: {
          customer: true,
          transactions: {
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
              performedBy: {
                select: {
                  id: true,
                  name: true,
                  role: true,
                },
              },
            },
          },
        },
      });

      return updated;
    });

    return NextResponse.json({ data: updatedCylinder });
  } catch (error: any) {
    console.error("Error updating cylinder:", error);
    return NextResponse.json(
      { error: "Failed to update cylinder", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/cylinders/[id]
// Only if status is EMPTY and not assigned to any customer
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    const cylinder = await prisma.cylinder.findUnique({
      where: { id },
    });

    if (!cylinder) {
      return NextResponse.json(
        { error: "Cylinder not found" },
        { status: 404 }
      );
    }

    if (cylinder.status !== CylinderStatus.EMPTY) {
      return NextResponse.json(
        {
          error: `Cannot delete cylinder: status is ${cylinder.status}. Only EMPTY cylinders can be deleted.`,
        },
        { status: 400 }
      );
    }

    if (cylinder.currentCustomerId !== null) {
      return NextResponse.json(
        {
          error:
            "Cannot delete cylinder: cylinder is currently assigned to a customer.",
        },
        { status: 400 }
      );
    }

    await prisma.cylinder.delete({
      where: { id },
    });

    return NextResponse.json({
      data: { message: "Cylinder deleted successfully" },
    });
  } catch (error: any) {
    console.error("Error deleting cylinder:", error);
    return NextResponse.json(
      { error: "Failed to delete cylinder", details: error.message },
      { status: 500 }
    );
  }
}
