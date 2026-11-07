import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CylinderStatus, OrderStatus } from "@prisma/client";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/deliveries/[id]
// Get delivery details with order, customer, delivery person
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    const delivery = await prisma.delivery.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            customer: true,
            orderItems: {
              include: {
                cylinder: true,
              },
            },
            invoice: {
              include: {
                payments: true,
              },
            },
          },
        },
        deliveryPerson: {
          select: {
            id: true,
            name: true,
            nameBn: true,
            phone: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!delivery) {
      return NextResponse.json(
        { error: "Delivery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: delivery });
  } catch (error: any) {
    console.error("Error fetching delivery:", error);
    return NextResponse.json(
      { error: "Failed to fetch delivery", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/deliveries/[id]
// Update delivery status (start delivery = set startedAt, complete = set completedAt and update order status to DELIVERED)
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, startedAt, completedAt, notes, deliveryPersonId } = body;

    const existingDelivery = await prisma.delivery.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            orderItems: true,
          },
        },
      },
    });

    if (!existingDelivery) {
      return NextResponse.json(
        { error: "Delivery not found" },
        { status: 404 }
      );
    }

    if (status && !Object.values(OrderStatus).includes(status as OrderStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status. Valid statuses: ${Object.values(
            OrderStatus
          ).join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (deliveryPersonId) {
      const personExists = await prisma.user.findUnique({
        where: { id: deliveryPersonId },
      });
      if (!personExists) {
        return NextResponse.json(
          { error: "Delivery person not found" },
          { status: 404 }
        );
      }
    }

    // Determine timestamp updates
    let updatedStartedAt: Date | undefined | null = undefined;
    let updatedCompletedAt: Date | undefined | null = undefined;
    let targetOrderStatus: OrderStatus | undefined = undefined;

    const isStarting =
      status === OrderStatus.DELIVERING ||
      (startedAt && !existingDelivery.startedAt);

    const isCompleting =
      status === OrderStatus.DELIVERED ||
      (completedAt && !existingDelivery.completedAt);

    if (isStarting) {
      updatedStartedAt = startedAt
        ? new Date(startedAt)
        : existingDelivery.startedAt || new Date();
      targetOrderStatus = OrderStatus.DELIVERING;
    }

    if (isCompleting) {
      if (!existingDelivery.startedAt && !updatedStartedAt) {
        updatedStartedAt = new Date();
      }
      updatedCompletedAt = completedAt ? new Date(completedAt) : new Date();
      targetOrderStatus = OrderStatus.DELIVERED;
    }

    if (status === OrderStatus.CANCELLED) {
      targetOrderStatus = OrderStatus.CANCELLED;
    }

    const updatedDelivery = await prisma.$transaction(async (tx) => {
      // 1. Update delivery
      const delivery = await tx.delivery.update({
        where: { id },
        data: {
          ...(status !== undefined && { status: status as OrderStatus }),
          ...(updatedStartedAt !== undefined && { startedAt: updatedStartedAt }),
          ...(updatedCompletedAt !== undefined && {
            completedAt: updatedCompletedAt,
          }),
          ...(notes !== undefined && { notes: notes ? notes.trim() : null }),
          ...(deliveryPersonId !== undefined && { deliveryPersonId }),
        },
        include: {
          order: {
            include: {
              customer: true,
              orderItems: {
                include: {
                  cylinder: true,
                },
              },
            },
          },
          deliveryPerson: {
            select: {
              id: true,
              name: true,
              phone: true,
              role: true,
            },
          },
        },
      });

      // 2. Synchronize order status if applicable
      if (targetOrderStatus) {
        await tx.order.update({
          where: { id: existingDelivery.orderId },
          data: { status: targetOrderStatus },
        });
      }

      // 3. If delivery completed, assign cylinders to customer and update cylinder status to IN_USE
      if (isCompleting && existingDelivery.order) {
        for (const item of existingDelivery.order.orderItems) {
          if (item.cylinderId) {
            await tx.cylinder.update({
              where: { id: item.cylinderId },
              data: {
                status: CylinderStatus.IN_USE,
                currentCustomerId: existingDelivery.order.customerId,
              },
            });
          }
        }
      }

      return delivery;
    });

    return NextResponse.json({ data: updatedDelivery });
  } catch (error: any) {
    console.error("Error updating delivery:", error);
    return NextResponse.json(
      { error: "Failed to update delivery", details: error.message },
      { status: 500 }
    );
  }
}
