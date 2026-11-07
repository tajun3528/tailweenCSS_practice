import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentMethod, PaymentStatus, Prisma } from "@prisma/client";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/invoices/[id]/payments
// List payments for an invoice
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      select: {
        id: true,
        invoiceNumber: true,
        totalAmount: true,
        paidAmount: true,
        dueAmount: true,
        paymentStatus: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    const payments = await prisma.payment.findMany({
      where: { invoiceId: id },
      orderBy: { paidAt: "desc" },
    });

    return NextResponse.json({
      data: payments,
      meta: { invoice },
    });
  } catch (error: any) {
    console.error("Error fetching invoice payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/invoices/[id]/payments
// Record a payment. Required: amount, paymentMethod. Optional: transactionId (for bKash/Nagad), notes.
// Auto-update invoice paidAmount, dueAmount, and paymentStatus.
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { amount, paymentMethod, transactionId, notes, paidAt } = body;

    // Validate invoice exists
    const invoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    // Validate amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Validate payment method
    if (
      !paymentMethod ||
      !Object.values(PaymentMethod).includes(paymentMethod as PaymentMethod)
    ) {
      return NextResponse.json(
        {
          error: `Invalid payment method. Valid methods: ${Object.values(
            PaymentMethod
          ).join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Calculate updated amounts
    const currentPaid = Number(invoice.paidAmount);
    const totalAmount = Number(invoice.totalAmount);
    const newPaidAmount = currentPaid + parsedAmount;
    const newDueAmount = Math.max(0, totalAmount - newPaidAmount);

    let newPaymentStatus: PaymentStatus = PaymentStatus.PARTIAL;
    if (newPaidAmount >= totalAmount) {
      newPaymentStatus = PaymentStatus.PAID;
    } else if (newPaidAmount <= 0) {
      newPaymentStatus = PaymentStatus.DUE;
    }

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          invoiceId: id,
          amount: new Prisma.Decimal(parsedAmount),
          paymentMethod: paymentMethod as PaymentMethod,
          transactionId: transactionId?.trim() || null,
          notes: notes?.trim() || null,
          paidAt: paidAt ? new Date(paidAt) : new Date(),
        },
      });

      const updatedInvoice = await tx.invoice.update({
        where: { id },
        data: {
          paidAmount: new Prisma.Decimal(newPaidAmount),
          dueAmount: new Prisma.Decimal(newDueAmount),
          paymentStatus: newPaymentStatus,
        },
      });

      return { payment, invoice: updatedInvoice };
    });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error: any) {
    console.error("Error recording payment:", error);
    return NextResponse.json(
      { error: "Failed to record payment", details: error.message },
      { status: 500 }
    );
  }
}
