import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/orders/[id]
// Get order by ID with customer, items, delivery, invoice details
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
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
                email: true,
                role: true,
              },
            },
          },
        },
        invoice: {
          include: {
            payments: {
              orderBy: { paidAt: "desc" },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ data: order });
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id]
// Update order status. When status changes to CONFIRMED, auto-create an Invoice with invoiceNumber (INV-XXXXX).
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, deliveryDate, deliveryAddress, notes } = body;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        invoice: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
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

    const isTransitioningToConfirmed =
      status === OrderStatus.CONFIRMED &&
      existingOrder.status !== OrderStatus.CONFIRMED &&
      !existingOrder.invoice;

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // If transitioning to CONFIRMED, generate invoice
      if (isTransitioningToConfirmed) {
        const lastInvoice = await tx.invoice.findFirst({
          orderBy: { createdAt: "desc" },
          select: { invoiceNumber: true },
        });

        let nextInvoiceNumber = 1;
        if (lastInvoice?.invoiceNumber) {
          const match = lastInvoice.invoiceNumber.match(/INV-(\d+)/i);
          if (match) {
            nextInvoiceNumber = parseInt(match[1], 10) + 1;
          } else {
            const count = await tx.invoice.count();
            nextInvoiceNumber = count + 1;
          }
        } else {
          const count = await tx.invoice.count();
          nextInvoiceNumber = count + 1;
        }

        const invoiceNumber = `INV-${String(nextInvoiceNumber).padStart(5, "0")}`;

        await tx.invoice.create({
          data: {
            invoiceNumber,
            orderId: id,
            customerId: existingOrder.customerId,
            totalAmount: existingOrder.totalAmount,
            paidAmount: 0,
            dueAmount: existingOrder.totalAmount,
            paymentStatus: PaymentStatus.DUE,
            issuedAt: new Date(),
          },
        });
      }

      const orderUpdated = await tx.order.update({
        where: { id },
        data: {
          ...(status !== undefined && { status: status as OrderStatus }),
          ...(deliveryDate !== undefined && {
            deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
          }),
          ...(deliveryAddress !== undefined && {
            deliveryAddress: deliveryAddress ? deliveryAddress.trim() : null,
          }),
          ...(notes !== undefined && { notes: notes ? notes.trim() : null }),
        },
        include: {
          customer: true,
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
      });

      return orderUpdated;
    });

    return NextResponse.json({ data: updatedOrder });
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id]
// Only if status is PENDING
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (existingOrder.status !== OrderStatus.PENDING) {
      return NextResponse.json(
        {
          error: `Cannot delete order: status is ${existingOrder.status}. Only PENDING orders can be deleted.`,
        },
        { status: 400 }
      );
    }

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({
      data: { message: "Order deleted successfully" },
    });
  } catch (error: any) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to delete order", details: error.message },
      { status: 500 }
    );
  }
}
