import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  CylinderSize,
  CylinderStatus,
  OrderStatus,
  PaymentStatus,
} from "@prisma/client";

// GET /api/reports?type=daily-sales | monthly-sales | cylinder-stock | customer-dues | delivery-performance
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        {
          error: "Query parameter 'type' is required",
          validTypes: [
            "daily-sales",
            "monthly-sales",
            "cylinder-stock",
            "customer-dues",
            "delivery-performance",
          ],
        },
        { status: 400 }
      );
    }

    switch (type) {
      case "daily-sales": {
        const dateParam = searchParams.get("date");
        const targetDate = dateParam ? new Date(dateParam) : new Date();

        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        const orders = await prisma.order.findMany({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
            status: {
              not: OrderStatus.CANCELLED,
            },
          },
          select: {
            id: true,
            totalAmount: true,
            status: true,
          },
        });

        const orderCount = orders.length;
        const totalRevenue = orders.reduce(
          (sum, o) => sum + Number(o.totalAmount),
          0
        );
        const avgOrderValue =
          orderCount > 0 ? Math.round((totalRevenue / orderCount) * 100) / 100 : 0;

        const ordersByStatus = orders.reduce<Record<string, number>>(
          (acc, o) => {
            acc[o.status] = (acc[o.status] || 0) + 1;
            return acc;
          },
          {}
        );

        return NextResponse.json({
          data: {
            date: startOfDay.toISOString().split("T")[0],
            orderCount,
            totalRevenue,
            avgOrderValue,
            ordersByStatus,
          },
        });
      }

      case "monthly-sales": {
        const now = new Date();
        const twelveMonthsAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 11,
          1,
          0,
          0,
          0,
          0
        );

        const orders = await prisma.order.findMany({
          where: {
            createdAt: {
              gte: twelveMonthsAgo,
            },
            status: {
              not: OrderStatus.CANCELLED,
            },
          },
          select: {
            createdAt: true,
            totalAmount: true,
          },
        });

        // Initialize last 12 months map
        const monthsMap: Record<
          string,
          { month: string; orderCount: number; revenue: number }
        > = {};

        for (let i = 11; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
          monthsMap[key] = { month: key, orderCount: 0, revenue: 0 };
        }

        let totalRevenue = 0;
        let totalOrders = 0;

        orders.forEach((o) => {
          const d = new Date(o.createdAt);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
          if (monthsMap[key]) {
            const amount = Number(o.totalAmount);
            monthsMap[key].orderCount += 1;
            monthsMap[key].revenue += amount;
            totalRevenue += amount;
            totalOrders += 1;
          }
        });

        const monthlySales = Object.values(monthsMap).map((m) => ({
          ...m,
          revenue: Math.round(m.revenue * 100) / 100,
        }));

        return NextResponse.json({
          data: {
            months: monthlySales,
            totalRevenue: Math.round(totalRevenue * 100) / 100,
            totalOrders,
          },
        });
      }

      case "cylinder-stock": {
        const cylinderCounts = await prisma.cylinder.groupBy({
          by: ["size", "status"],
          _count: {
            id: true,
          },
        });

        const allSizes = Object.values(CylinderSize);
        const allStatuses = Object.values(CylinderStatus);

        const stockMatrix: Record<
          string,
          Record<string, number> & { total: number }
        > = {};

        allSizes.forEach((size) => {
          stockMatrix[size] = {
            FULL: 0,
            EMPTY: 0,
            IN_USE: 0,
            DAMAGED: 0,
            IN_TRANSIT: 0,
            total: 0,
          };
        });

        const totalByStatus: Record<string, number> = {
          FULL: 0,
          EMPTY: 0,
          IN_USE: 0,
          DAMAGED: 0,
          IN_TRANSIT: 0,
        };

        let grandTotal = 0;

        cylinderCounts.forEach((group) => {
          const count = group._count.id;
          if (stockMatrix[group.size]) {
            stockMatrix[group.size][group.status] = count;
            stockMatrix[group.size].total += count;
          }
          if (totalByStatus[group.status] !== undefined) {
            totalByStatus[group.status] += count;
          }
          grandTotal += count;
        });

        return NextResponse.json({
          data: {
            bySize: stockMatrix,
            byStatus: totalByStatus,
            totalCylinders: grandTotal,
          },
        });
      }

      case "customer-dues": {
        const dueInvoices = await prisma.invoice.findMany({
          where: {
            paymentStatus: {
              in: [PaymentStatus.DUE, PaymentStatus.PARTIAL],
            },
            dueAmount: {
              gt: 0,
            },
          },
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                nameBn: true,
                phone: true,
                area: true,
                address: true,
              },
            },
          },
        });

        const customerMap = new Map<
          string,
          {
            customer: {
              id: string;
              name: string;
              nameBn: string | null;
              phone: string;
              area: string;
              address: string;
            };
            totalDue: number;
            totalPaid: number;
            totalAmount: number;
            invoiceCount: number;
          }
        >();

        let overallOutstanding = 0;

        dueInvoices.forEach((inv) => {
          const custId = inv.customerId;
          const due = Number(inv.dueAmount);
          const paid = Number(inv.paidAmount);
          const total = Number(inv.totalAmount);

          overallOutstanding += due;

          if (!customerMap.has(custId)) {
            customerMap.set(custId, {
              customer: inv.customer,
              totalDue: 0,
              totalPaid: 0,
              totalAmount: 0,
              invoiceCount: 0,
            });
          }

          const c = customerMap.get(custId)!;
          c.totalDue += due;
          c.totalPaid += paid;
          c.totalAmount += total;
          c.invoiceCount += 1;
        });

        const sortedCustomers = Array.from(customerMap.values())
          .map((item) => ({
            ...item,
            totalDue: Math.round(item.totalDue * 100) / 100,
            totalPaid: Math.round(item.totalPaid * 100) / 100,
            totalAmount: Math.round(item.totalAmount * 100) / 100,
          }))
          .sort((a, b) => b.totalDue - a.totalDue);

        return NextResponse.json({
          data: {
            customers: sortedCustomers,
            totalOutstandingDue: Math.round(overallOutstanding * 100) / 100,
            totalDueInvoices: dueInvoices.length,
          },
        });
      }

      case "delivery-performance": {
        const deliveries = await prisma.delivery.findMany({
          include: {
            deliveryPerson: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        });

        const totalDeliveries = deliveries.length;
        let completedDeliveries = 0;
        let inProgressDeliveries = 0;
        let pendingDeliveries = 0;
        let cancelledDeliveries = 0;

        let totalDurationMs = 0;
        let timedDeliveriesCount = 0;

        const staffPerformanceMap = new Map<
          string,
          {
            deliveryPerson: { id: string; name: string; phone: string };
            assignedCount: number;
            completedCount: number;
            totalDurationMs: number;
            timedCount: number;
          }
        >();

        deliveries.forEach((d) => {
          const staffId = d.deliveryPersonId;

          if (!staffPerformanceMap.has(staffId)) {
            staffPerformanceMap.set(staffId, {
              deliveryPerson: d.deliveryPerson,
              assignedCount: 0,
              completedCount: 0,
              totalDurationMs: 0,
              timedCount: 0,
            });
          }

          const staffStats = staffPerformanceMap.get(staffId)!;
          staffStats.assignedCount += 1;

          if (d.status === OrderStatus.DELIVERED) {
            completedDeliveries += 1;
            staffStats.completedCount += 1;
          } else if (d.status === OrderStatus.DELIVERING) {
            inProgressDeliveries += 1;
          } else if (d.status === OrderStatus.PENDING) {
            pendingDeliveries += 1;
          } else if (d.status === OrderStatus.CANCELLED) {
            cancelledDeliveries += 1;
          }

          if (d.startedAt && d.completedAt) {
            const start = new Date(d.startedAt).getTime();
            const end = new Date(d.completedAt).getTime();
            const duration = end - start;

            if (duration >= 0) {
              totalDurationMs += duration;
              timedDeliveriesCount += 1;

              staffStats.totalDurationMs += duration;
              staffStats.timedCount += 1;
            }
          }
        });

        const avgDeliveryTimeMinutes =
          timedDeliveriesCount > 0
            ? Math.round(totalDurationMs / (timedDeliveriesCount * 60 * 1000))
            : 0;

        const avgDeliveryTimeHours =
          timedDeliveriesCount > 0
            ? parseFloat(
                (
                  totalDurationMs /
                  (timedDeliveriesCount * 60 * 60 * 1000)
                ).toFixed(2)
              )
            : 0;

        const staffPerformance = Array.from(staffPerformanceMap.values()).map(
          (sp) => ({
            deliveryPerson: sp.deliveryPerson,
            assignedCount: sp.assignedCount,
            completedCount: sp.completedCount,
            avgDeliveryTimeMinutes:
              sp.timedCount > 0
                ? Math.round(sp.totalDurationMs / (sp.timedCount * 60 * 1000))
                : 0,
          })
        );

        return NextResponse.json({
          data: {
            totalDeliveries,
            completedDeliveries,
            inProgressDeliveries,
            pendingDeliveries,
            cancelledDeliveries,
            avgDeliveryTimeMinutes,
            avgDeliveryTimeHours,
            deliveryPersonsPerformance: staffPerformance,
          },
        });
      }

      default:
        return NextResponse.json(
          {
            error: `Unsupported report type '${type}'`,
            validTypes: [
              "daily-sales",
              "monthly-sales",
              "cylinder-stock",
              "customer-dues",
              "delivery-performance",
            ],
          },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Failed to generate report", details: error.message },
      { status: 500 }
    );
  }
}
