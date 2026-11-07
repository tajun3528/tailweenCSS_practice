import { PrismaClient, Role, CylinderSize, CylinderStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cylinderTransaction.deleteMany();
  await prisma.cylinder.deleteMany();
  await prisma.cylinderPrice.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleared existing data");

  // ===== USERS =====
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const deliveryPassword = await bcrypt.hash("delivery123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      nameBn: "অ্যাডমিন ইউজার",
      email: "admin@lpgtracker.com",
      phone: "01700000001",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: "Rahim Khan",
      nameBn: "রহিম খান",
      email: "rahim@lpgtracker.com",
      phone: "01700000002",
      password: hashedPassword,
      role: Role.MANAGER,
    },
  });

  const delivery1 = await prisma.user.create({
    data: {
      name: "Kamal Hossain",
      nameBn: "কামাল হোসেন",
      email: "kamal@lpgtracker.com",
      phone: "01700000003",
      password: deliveryPassword,
      role: Role.DELIVERY_PERSON,
    },
  });

  const delivery2 = await prisma.user.create({
    data: {
      name: "Jamal Uddin",
      nameBn: "জামাল উদ্দিন",
      email: "jamal@lpgtracker.com",
      phone: "01700000004",
      password: deliveryPassword,
      role: Role.DELIVERY_PERSON,
    },
  });

  console.log("✅ Created users");

  // ===== CUSTOMERS =====
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: "Fatema Khanom",
        nameBn: "ফাতেমা খানম",
        phone: "01812345001",
        address: "House 12, Road 5, Dhanmondi",
        addressBn: "বাসা ১২, রোড ৫, ধানমন্ডি",
        area: "Dhanmondi",
        areaBn: "ধানমন্ডি",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Abdul Karim",
        nameBn: "আব্দুল করিম",
        phone: "01812345002",
        address: "Flat 4B, Gulshan Tower, Gulshan-2",
        addressBn: "ফ্ল্যাট ৪বি, গুলশান টাওয়ার, গুলশান-২",
        area: "Gulshan",
        areaBn: "গুলশান",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Nasrin Akter",
        nameBn: "নাসরিন আক্তার",
        phone: "01812345003",
        address: "House 45, Block C, Mirpur-10",
        addressBn: "বাসা ৪৫, ব্লক সি, মিরপুর-১০",
        area: "Mirpur",
        areaBn: "মিরপুর",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Shahidul Islam",
        nameBn: "শহিদুল ইসলাম",
        phone: "01812345004",
        address: "House 8, Sector 7, Uttara",
        addressBn: "বাসা ৮, সেক্টর ৭, উত্তরা",
        area: "Uttara",
        areaBn: "উত্তরা",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Rubina Begum",
        nameBn: "রুবিনা বেগম",
        phone: "01812345005",
        address: "House 22, Mohammadpur",
        addressBn: "বাসা ২২, মোহাম্মদপুর",
        area: "Mohammadpur",
        areaBn: "মোহাম্মদপুর",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Mizanur Rahman",
        nameBn: "মিজানুর রহমান",
        phone: "01812345006",
        address: "Shop 15, Banani Market",
        addressBn: "দোকান ১৫, বনানী মার্কেট",
        area: "Banani",
        areaBn: "বনানী",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Salma Jahan",
        nameBn: "সালমা জাহান",
        phone: "01812345007",
        address: "House 3, Bashundhara R/A",
        addressBn: "বাসা ৩, বসুন্ধরা আ/এ",
        area: "Bashundhara",
        areaBn: "বসুন্ধরা",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Habibur Rahman",
        nameBn: "হাবিবুর রহমান",
        phone: "01812345008",
        address: "House 67, Badda Link Road",
        addressBn: "বাসা ৬৭, বাড্ডা লিংক রোড",
        area: "Badda",
        areaBn: "বাড্ডা",
      },
    }),
  ]);

  console.log("✅ Created customers");

  // ===== CYLINDER PRICES =====
  await Promise.all([
    prisma.cylinderPrice.create({
      data: {
        size: CylinderSize.KG_5,
        price: 600,
        depositAmount: 1500,
        effectiveFrom: new Date("2024-01-01"),
        isActive: true,
      },
    }),
    prisma.cylinderPrice.create({
      data: {
        size: CylinderSize.KG_12,
        price: 1200,
        depositAmount: 2500,
        effectiveFrom: new Date("2024-01-01"),
        isActive: true,
      },
    }),
    prisma.cylinderPrice.create({
      data: {
        size: CylinderSize.KG_25,
        price: 3200,
        depositAmount: 4000,
        effectiveFrom: new Date("2024-01-01"),
        isActive: true,
      },
    }),
    prisma.cylinderPrice.create({
      data: {
        size: CylinderSize.KG_45,
        price: 5500,
        depositAmount: 6000,
        effectiveFrom: new Date("2024-01-01"),
        isActive: true,
      },
    }),
  ]);

  console.log("✅ Created cylinder prices");

  // ===== CYLINDERS =====
  const cylinderData: Array<{
    serialNumber: string;
    size: CylinderSize;
    status: CylinderStatus;
    currentCustomerId?: string;
  }> = [];

  // 5 KG cylinders
  for (let i = 1; i <= 20; i++) {
    cylinderData.push({
      serialNumber: `CYL-05-${String(i).padStart(4, "0")}`,
      size: CylinderSize.KG_5,
      status: i <= 10 ? CylinderStatus.FULL : i <= 15 ? CylinderStatus.EMPTY : CylinderStatus.IN_USE,
      currentCustomerId: i > 15 ? customers[i - 16]?.id : undefined,
    });
  }

  // 12 KG cylinders
  for (let i = 1; i <= 40; i++) {
    cylinderData.push({
      serialNumber: `CYL-12-${String(i).padStart(4, "0")}`,
      size: CylinderSize.KG_12,
      status: i <= 20 ? CylinderStatus.FULL : i <= 30 ? CylinderStatus.EMPTY : CylinderStatus.IN_USE,
      currentCustomerId: i > 30 ? customers[i - 31]?.id : undefined,
    });
  }

  // 25 KG cylinders
  for (let i = 1; i <= 15; i++) {
    cylinderData.push({
      serialNumber: `CYL-25-${String(i).padStart(4, "0")}`,
      size: CylinderSize.KG_25,
      status: i <= 8 ? CylinderStatus.FULL : i <= 12 ? CylinderStatus.EMPTY : CylinderStatus.IN_USE,
      currentCustomerId: i > 12 ? customers[i - 13]?.id : undefined,
    });
  }

  // 45 KG cylinders
  for (let i = 1; i <= 10; i++) {
    cylinderData.push({
      serialNumber: `CYL-45-${String(i).padStart(4, "0")}`,
      size: CylinderSize.KG_45,
      status: i <= 5 ? CylinderStatus.FULL : i <= 8 ? CylinderStatus.EMPTY : CylinderStatus.IN_USE,
      currentCustomerId: i > 8 ? customers[i - 9]?.id : undefined,
    });
  }

  const cylinders = await Promise.all(
    cylinderData.map((c) =>
      prisma.cylinder.create({
        data: {
          serialNumber: c.serialNumber,
          size: c.size,
          status: c.status,
          currentCustomerId: c.currentCustomerId,
        },
      })
    )
  );

  console.log(`✅ Created ${cylinders.length} cylinders`);

  // ===== ORDERS =====
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        orderNumber: "ORD-00001",
        customerId: customers[0].id,
        status: "DELIVERED",
        deliveryDate: new Date("2024-10-10"),
        totalAmount: 2400,
        items: {
          create: [
            { cylinderSize: CylinderSize.KG_12, quantity: 2, unitPrice: 1200, totalPrice: 2400 },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        orderNumber: "ORD-00002",
        customerId: customers[1].id,
        status: "DELIVERED",
        deliveryDate: new Date("2024-10-11"),
        totalAmount: 3200,
        items: {
          create: [
            { cylinderSize: CylinderSize.KG_25, quantity: 1, unitPrice: 3200, totalPrice: 3200 },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        orderNumber: "ORD-00003",
        customerId: customers[2].id,
        status: "DELIVERING",
        deliveryDate: new Date(),
        totalAmount: 3600,
        items: {
          create: [
            { cylinderSize: CylinderSize.KG_12, quantity: 3, unitPrice: 1200, totalPrice: 3600 },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        orderNumber: "ORD-00004",
        customerId: customers[3].id,
        status: "CONFIRMED",
        deliveryDate: new Date(),
        totalAmount: 5500,
        items: {
          create: [
            { cylinderSize: CylinderSize.KG_45, quantity: 1, unitPrice: 5500, totalPrice: 5500 },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        orderNumber: "ORD-00005",
        customerId: customers[4].id,
        status: "PENDING",
        totalAmount: 1200,
        items: {
          create: [
            { cylinderSize: CylinderSize.KG_5, quantity: 2, unitPrice: 600, totalPrice: 1200 },
          ],
        },
      },
    }),
  ]);

  console.log("✅ Created orders");

  // ===== DELIVERIES =====
  await Promise.all([
    prisma.delivery.create({
      data: {
        orderId: orders[0].id,
        deliveryPersonId: delivery1.id,
        status: "DELIVERED",
        assignedAt: new Date("2024-10-10T08:00:00"),
        startedAt: new Date("2024-10-10T09:00:00"),
        completedAt: new Date("2024-10-10T10:30:00"),
      },
    }),
    prisma.delivery.create({
      data: {
        orderId: orders[1].id,
        deliveryPersonId: delivery2.id,
        status: "DELIVERED",
        assignedAt: new Date("2024-10-11T08:00:00"),
        startedAt: new Date("2024-10-11T09:30:00"),
        completedAt: new Date("2024-10-11T11:00:00"),
      },
    }),
    prisma.delivery.create({
      data: {
        orderId: orders[2].id,
        deliveryPersonId: delivery1.id,
        status: "DELIVERING",
        assignedAt: new Date(),
        startedAt: new Date(),
      },
    }),
  ]);

  console.log("✅ Created deliveries");

  // ===== INVOICES & PAYMENTS =====
  const invoice1 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-00001",
      orderId: orders[0].id,
      customerId: customers[0].id,
      totalAmount: 2400,
      paidAmount: 2400,
      dueAmount: 0,
      paymentStatus: "PAID",
      issuedAt: new Date("2024-10-10"),
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: invoice1.id,
      amount: 2400,
      paymentMethod: "CASH",
      paidAt: new Date("2024-10-10"),
    },
  });

  const invoice2 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-00002",
      orderId: orders[1].id,
      customerId: customers[1].id,
      totalAmount: 3200,
      paidAmount: 1500,
      dueAmount: 1700,
      paymentStatus: "PARTIAL",
      issuedAt: new Date("2024-10-11"),
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: invoice2.id,
      amount: 1500,
      paymentMethod: "BKASH",
      transactionId: "BKS12345678",
      paidAt: new Date("2024-10-11"),
    },
  });

  const invoice3 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-00003",
      orderId: orders[2].id,
      customerId: customers[2].id,
      totalAmount: 3600,
      paidAmount: 0,
      dueAmount: 3600,
      paymentStatus: "DUE",
      issuedAt: new Date(),
    },
  });

  console.log("✅ Created invoices & payments");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📋 Login Credentials:");
  console.log("   Admin:    admin@lpgtracker.com / admin123");
  console.log("   Manager:  rahim@lpgtracker.com / admin123");
  console.log("   Delivery: kamal@lpgtracker.com / delivery123");
  console.log("   Delivery: jamal@lpgtracker.com / delivery123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
