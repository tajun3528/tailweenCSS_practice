import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CylinderSize, OrderStatus, Prisma } from "@prisma/client";

// GET /api/orders
// List orders with filters (?status=PENDING), pagination, include customer and orderItems
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    const status = searchParams.get("status");
    const customerId = searchParams.get("customerId");
    const search = searchParams.get("search")?.trim();

    const where: Prisma.OrderWhereInput = {};

    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      where.status = status as OrderStatus;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { customer: { phone: { contains: search } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              nameBn: true,
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
                  status: true,
                  size: true,
                },
              },
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
            select: {
              id: true,
              invoiceNumber: true,
              totalAmount: true,
              paidAmount: true,
              dueAmount: true,
              paymentStatus: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      data: orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/orders
// Create new order. Required: customerId, items (array of {cylinderSize, quantity, unitPrice}).
// Auto-generate orderNumber (ORD-XXXXX format, incrementing). Auto-calculate totalAmount from items.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, items, deliveryDate, deliveryAddress, notes } = body;

    // Validate required fields
    if (!customerId) {
      return NextResponse.json(
        { error: "customerId is required" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Validate items
    let totalAmount = 0;
    const validatedItems: {
      cylinderSize: CylinderSize;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      cylinderId?: string | null;
    }[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const { cylinderSize, quantity, unitPrice, cylinderId } = item;

      if (!cylinderSize || !Object.values(CylinderSize).includes(cylinderSize as CylinderSize)) {
        return NextResponse.json(
          {
            error: `Invalid cylinderSize at index ${i}. Valid sizes: ${Object.values(
              CylinderSize
            ).join(", ")}`,
          },
          { status: 400 }
        );
      }

      const parsedQty = parseInt(quantity, 10);
      const parsedPrice = parseFloat(unitPrice);

      if (isNaN(parsedQty) || parsedQty <= 0) {
        return NextResponse.json(
          { error: `Item at index ${i} must have a positive integer quantity` },
          { status: 400 }
        );
      }

      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return NextResponse.json(
          { error: `Item at index ${i} must have a valid non-negative unitPrice` },
          { status: 400 }
        );
      }

      const itemTotalPrice = parsedQty * parsedPrice;
      totalAmount += itemTotalPrice;

      validatedItems.push({
        cylinderSize: cylinderSize as CylinderSize,
        quantity: parsedQty,
        unitPrice: parsedPrice,
        totalPrice: itemTotalPrice,
        cylinderId: cylinderId || null,
      });
    }

    // Create order with sequential ORD-XXXXX order number in a transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      const lastOrder = await tx.order.findFirst({
        orderBy: { createdAt: "desc" },
        select: { orderNumber: true },
      });

      let nextNumber = 1;
      if (lastOrder?.orderNumber) {
        const match = lastOrder.orderNumber.match(/ORD-(\d+)/i);
        if (match) {
          nextNumber = parseInt(match[1], 10) + 1;
        } else {
          const count = await tx.order.count();
          nextNumber = count + 1;
        }
      } else {
        const count = await tx.order.count();
        nextNumber = count + 1;
      }

      const orderNumber = `ORD-${String(nextNumber).padStart(5, "0")}`;

      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId,
          status: OrderStatus.PENDING,
          deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
          deliveryAddress: deliveryAddress?.trim() || customer.address,
          totalAmount: new Prisma.Decimal(totalAmount),
          notes: notes?.trim() || null,
          orderItems: {
            create: validatedItems.map((item) => ({
              cylinderSize: item.cylinderSize,
              quantity: item.quantity,
              unitPrice: new Prisma.Decimal(item.unitPrice),
              totalPrice: new Prisma.Decimal(item.totalPrice),
              cylinderId: item.cylinderId,
            })),
          },
        },
        include: {
          customer: true,
          orderItems: {
            include: {
              cylinder: true,
            },
          },
        },
      });

      return createdOrder;
    });

    return NextResponse.json({ data: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order", details: error.message },
      { status: 500 }
    );
  }
}
