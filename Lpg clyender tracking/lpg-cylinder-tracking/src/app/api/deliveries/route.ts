import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus, Prisma } from "@prisma/client";

// GET /api/deliveries
// List deliveries with filters (?status=PENDING&date=2024-01-01), include order and deliveryPerson info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    const status = searchParams.get("status");
    const date = searchParams.get("date");
    const deliveryPersonId = searchParams.get("deliveryPersonId");

    const where: Prisma.DeliveryWhereInput = {};

    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      where.status = status as OrderStatus;
    }

    if (deliveryPersonId) {
      where.deliveryPersonId = deliveryPersonId;
    }

    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        const startOfDay = new Date(parsedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(parsedDate);
        endOfDay.setHours(23, 59, 59, 999);

        where.assignedAt = {
          gte: startOfDay,
          lte: endOfDay,
        };
      }
    }

    const [deliveries, total] = await Promise.all([
      prisma.delivery.findMany({
        where,
        skip,
        take: limit,
        orderBy: { assignedAt: "desc" },
        include: {
          order: {
            include: {
              customer: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                  address: true,
                  area: true,
                },
              },
              orderItems: {
                include: {
                  cylinder: {
                    select: {
                      id: true,
                      serialNumber: true,
                      size: true,
                      status: true,
                    },
                  },
                },
              },
            },
          },
          deliveryPerson: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.delivery.count({ where }),
    ]);

    return NextResponse.json({
      data: deliveries,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching deliveries:", error);
    return NextResponse.json(
      { error: "Failed to fetch deliveries", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/deliveries
// Create/assign delivery. Required: orderId, deliveryPersonId. Auto-set assignedAt.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, deliveryPersonId, notes } = body;

    // Validate required fields
    if (!orderId || !deliveryPersonId) {
      return NextResponse.json(
        { error: "orderId and deliveryPersonId are required" },
        { status: 400 }
      );
    }

    // Verify order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Verify delivery person exists
    const deliveryPerson = await prisma.user.findUnique({
      where: { id: deliveryPersonId },
    });

    if (!deliveryPerson) {
      return NextResponse.json(
        { error: "Delivery person not found" },
        { status: 404 }
      );
    }

    // Check if delivery already assigned for this order
    const existingDelivery = await prisma.delivery.findUnique({
      where: { orderId },
    });

    if (existingDelivery) {
      return NextResponse.json(
        { error: "A delivery has already been assigned for this order" },
        { status: 409 }
      );
    }

    const delivery = await prisma.$transaction(async (tx) => {
      const newDelivery = await tx.delivery.create({
        data: {
          orderId,
          deliveryPersonId,
          status: OrderStatus.PENDING,
          assignedAt: new Date(),
          notes: notes?.trim() || null,
        },
        include: {
          order: {
            include: {
              customer: true,
              orderItems: true,
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

      // Update order status if it was PENDING
      if (order.status === OrderStatus.PENDING) {
        await tx.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.CONFIRMED },
        });
      }

      return newDelivery;
    });

    return NextResponse.json({ data: delivery }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating delivery:", error);
    return NextResponse.json(
      { error: "Failed to create delivery", details: error.message },
      { status: 500 }
    );
  }
}
