"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  ShoppingBag,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  X,
  Eye,
  User,
  MapPin,
  Phone,
  Package,
  Layers,
  Receipt,
  ArrowRight,
  Filter,
} from "lucide-react";

type OrderStatus = "PENDING" | "CONFIRMED" | "DELIVERING" | "DELIVERED" | "CANCELLED";

interface OrderItemData {
  cylinderSize: "5 KG" | "12 KG" | "25 KG" | "45 KG";
  quantity: number;
  unitPrice: number;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerNameBn: string;
  customerPhone: string;
  deliveryAddressBn: string;
  areaBn: string;
  cylinderType: string;
  items: OrderItemData[];
  totalQty: number;
  deliveryDate: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: "CASH" | "BKASH" | "NAGAD";
  paymentStatus: "PAID" | "DUE";
  notes?: string;
  deliveryPersonBn?: string;
}

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-2026-001",
    customerName: "Kamal Hossain",
    customerNameBn: "কামাল হোসেন",
    customerPhone: "01711-234567",
    deliveryAddressBn: "ধানমন্ডি, রোড ২৭, বাড়ি ১২, ঢাকা",
    areaBn: "ধানমন্ডি",
    cylinderType: "12 KG",
    items: [{ cylinderSize: "12 KG", quantity: 2, unitPrice: 1200 }],
    totalQty: 2,
    deliveryDate: "2026-10-15",
    totalAmount: 2400,
    status: "DELIVERING",
    paymentMethod: "BKASH",
    paymentStatus: "PAID",
    notes: "Call before reaching location",
    deliveryPersonBn: "মোঃ সুজন মিয়া",
  },
  {
    id: "ord-2",
    orderNumber: "ORD-2026-002",
    customerName: "Rahim Uddin",
    customerNameBn: "রহিম উদ্দিন",
    customerPhone: "01819-876543",
    deliveryAddressBn: "উত্তরা, সেক্টর ৪, রোড ৭, বাড়ি ১৫",
    areaBn: "উত্তরা",
    cylinderType: "25 KG",
    items: [{ cylinderSize: "25 KG", quantity: 1, unitPrice: 3200 }],
    totalQty: 1,
    deliveryDate: "2026-10-15",
    totalAmount: 3200,
    status: "DELIVERED",
    paymentMethod: "CASH",
    paymentStatus: "PAID",
    notes: "Restaurant back-entrance delivery",
    deliveryPersonBn: "আল-আমিন হোসেন",
  },
  {
    id: "ord-3",
    orderNumber: "ORD-2026-003",
    customerName: "Fatema Khanam",
    customerNameBn: "ফাতেমা খানম",
    customerPhone: "01912-345678",
    deliveryAddressBn: "মিরপুর ১০, ব্লক সি, রোড ২",
    areaBn: "মিরপুর",
    cylinderType: "12 KG",
    items: [{ cylinderSize: "12 KG", quantity: 3, unitPrice: 1200 }],
    totalQty: 3,
    deliveryDate: "2026-10-16",
    totalAmount: 3600,
    status: "PENDING",
    paymentMethod: "CASH",
    paymentStatus: "DUE",
    notes: "Customer available after 2:00 PM",
  },
  {
    id: "ord-4",
    orderNumber: "ORD-2026-004",
    customerName: "Abdul Karim",
    customerNameBn: "আব্দুল করিম",
    customerPhone: "01723-456789",
    deliveryAddressBn: "গুলশান ২, রোড ৫২, ফ্ল্যাট ৪বি",
    areaBn: "গুলশান",
    cylinderType: "45 KG",
    items: [{ cylinderSize: "45 KG", quantity: 2, unitPrice: 5500 }],
    totalQty: 2,
    deliveryDate: "2026-10-15",
    totalAmount: 11000,
    status: "CONFIRMED",
    paymentMethod: "BKASH",
    paymentStatus: "PAID",
    notes: "Commercial heavy cylinder - requires trolley",
    deliveryPersonBn: "আরিফুল ইসলাম",
  },
  {
    id: "ord-5",
    orderNumber: "ORD-2026-005",
    customerName: "Nasrin Akter",
    customerNameBn: "নাসরিন আক্তার",
    customerPhone: "01611-987654",
    deliveryAddressBn: "মোহাম্মদপুর, বাবর রোড, বাড়ি ১৮",
    areaBn: "মোহাম্মদপুর",
    cylinderType: "5 KG",
    items: [{ cylinderSize: "5 KG", quantity: 2, unitPrice: 600 }],
    totalQty: 2,
    deliveryDate: "2026-10-14",
    totalAmount: 1200,
    status: "DELIVERED",
    paymentMethod: "NAGAD",
    paymentStatus: "PAID",
    notes: "Delivered smoothly, empty cylinder received",
    deliveryPersonBn: "মোঃ সুজন মিয়া",
  },
  {
    id: "ord-6",
    orderNumber: "ORD-2026-006",
    customerName: "Tarek Mahmud",
    customerNameBn: "তারেক মাহমুদ",
    customerPhone: "01552-334455",
    deliveryAddressBn: "বনানী, ব্লক ডি, রোড ১১",
    areaBn: "বনানী",
    cylinderType: "12 KG",
    items: [{ cylinderSize: "12 KG", quantity: 4, unitPrice: 1200 }],
    totalQty: 4,
    deliveryDate: "2026-10-16",
    totalAmount: 4800,
    status: "PENDING",
    paymentMethod: "CASH",
    paymentStatus: "DUE",
    notes: "Sweet bakery delivery",
  },
  {
    id: "ord-7",
    orderNumber: "ORD-2026-007",
    customerName: "Shafiqul Alam",
    customerNameBn: "শফিকুল আলম",
    customerPhone: "01788-990011",
    deliveryAddressBn: "ধানমন্ডি, রোড ৮/এ, বাড়ি ২৩",
    areaBn: "ধানমন্ডি",
    cylinderType: "25 KG",
    items: [{ cylinderSize: "25 KG", quantity: 2, unitPrice: 3200 }],
    totalQty: 2,
    deliveryDate: "2026-10-15",
    totalAmount: 6400,
    status: "DELIVERING",
    paymentMethod: "BKASH",
    paymentStatus: "PAID",
    notes: "Dispatched on Van-2",
    deliveryPersonBn: "আল-আমিন হোসেন",
  },
  {
    id: "ord-8",
    orderNumber: "ORD-2026-008",
    customerName: "Selina Begum",
    customerNameBn: "মোছাঃ সেলিনা বেগম",
    customerPhone: "01733-667788",
    deliveryAddressBn: "বাড্ডা, মধ্য বাড্ডা, লিংক রোড",
    areaBn: "বাড্ডা",
    cylinderType: "12 KG",
    items: [{ cylinderSize: "12 KG", quantity: 1, unitPrice: 1200 }],
    totalQty: 1,
    deliveryDate: "2026-10-13",
    totalAmount: 1200,
    status: "CANCELLED",
    paymentMethod: "CASH",
    paymentStatus: "DUE",
    notes: "Cancelled by customer - out of city",
  },
  {
    id: "ord-9",
    orderNumber: "ORD-2026-009",
    customerName: "Zahirul Haque",
    customerNameBn: "জহিরুল হক",
    customerPhone: "01933-221100",
    deliveryAddressBn: "মিরপুর ২, ব্লক এফ, বাড়ি ৪",
    areaBn: "মিরপুর",
    cylinderType: "5 KG",
    items: [{ cylinderSize: "5 KG", quantity: 1, unitPrice: 600 }],
    totalQty: 1,
    deliveryDate: "2026-10-15",
    totalAmount: 600,
    status: "CONFIRMED",
    paymentMethod: "CASH",
    paymentStatus: "DUE",
    notes: "Awaiting delivery person assignment",
    deliveryPersonBn: "আরিফুল ইসলাম",
  },
  {
    id: "ord-10",
    orderNumber: "ORD-2026-010",
    customerName: "Mahmuda Sultana",
    customerNameBn: "মাহমুদা সুলতানা",
    customerPhone: "01622-445566",
    deliveryAddressBn: "মহাখালী ডিওএইচএস, রোড ৩, বাড়ি ৫",
    areaBn: "মহাখালী",
    cylinderType: "12 KG",
    items: [{ cylinderSize: "12 KG", quantity: 2, unitPrice: 1200 }],
    totalQty: 2,
    deliveryDate: "2026-10-14",
    totalAmount: 2400,
    status: "DELIVERED",
    paymentMethod: "BKASH",
    paymentStatus: "PAID",
    notes: "Delivered & verified by customer",
    deliveryPersonBn: "মোঃ সুজন মিয়া",
  },
];

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; labelBn: string; badge: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Pending",
    labelBn: "অপেক্ষমান",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmed",
    labelBn: "নিশ্চিত",
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle2,
  },
  DELIVERING: {
    label: "Delivering",
    labelBn: "ডেলিভারি চলছে",
    badge: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    labelBn: "সম্পন্ন",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    labelBn: "বাতিল",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
    icon: XCircle,
  },
};

const TAB_OPTIONS: { id: "ALL" | OrderStatus; label: string; labelBn: string }[] = [
  { id: "ALL", label: "All Orders", labelBn: "সব" },
  { id: "PENDING", label: "Pending", labelBn: "অপেক্ষমান" },
  { id: "CONFIRMED", label: "Confirmed", labelBn: "নিশ্চিত" },
  { id: "DELIVERING", label: "Delivering", labelBn: "ডেলিভারি চলছে" },
  { id: "DELIVERED", label: "Delivered", labelBn: "সম্পন্ন" },
  { id: "CANCELLED", label: "Cancelled", labelBn: "বাতিল" },
];

const CYLINDER_PRICES: Record<string, number> = {
  "5 KG": 600,
  "12 KG": 1200,
  "25 KG": 3200,
  "45 KG": 5500,
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<"ALL" | OrderStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // New Order Form state
  const [newOrderForm, setNewOrderForm] = useState({
    customerName: "",
    customerNameBn: "",
    customerPhone: "",
    deliveryAddressBn: "",
    areaBn: "ধানমন্ডি",
    cylinderSize: "12 KG" as "5 KG" | "12 KG" | "25 KG" | "45 KG",
    quantity: 1,
    deliveryDate: new Date().toISOString().split("T")[0],
    paymentMethod: "CASH" as "CASH" | "BKASH" | "NAGAD",
    notes: "",
  });

  // Calculate status counts
  const counts = useMemo(() => {
    const res: Record<string, number> = { ALL: orders.length };
    orders.forEach((o) => {
      res[o.status] = (res[o.status] || 0) + 1;
    });
    return res;
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab = activeTab === "ALL" || order.status === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerNameBn.includes(q) ||
        order.customerPhone.includes(q) ||
        order.areaBn.includes(q);

      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  // Handle Create New Order
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderForm.customerNameBn || !newOrderForm.customerPhone) {
      alert("Please provide the customer name and phone.");
      return;
    }

    const unitPrice = CYLINDER_PRICES[newOrderForm.cylinderSize] || 1200;
    const totalAmount = unitPrice * newOrderForm.quantity;
    const orderNum = `ORD-2026-${String(orders.length + 1).padStart(3, "0")}`;

    const newRecord: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerName: newOrderForm.customerName || newOrderForm.customerNameBn,
      customerNameBn: newOrderForm.customerNameBn,
      customerPhone: newOrderForm.customerPhone,
      deliveryAddressBn: newOrderForm.deliveryAddressBn || `${newOrderForm.areaBn}, ঢাকা`,
      areaBn: newOrderForm.areaBn,
      cylinderType: newOrderForm.cylinderSize,
      items: [
        {
          cylinderSize: newOrderForm.cylinderSize,
          quantity: newOrderForm.quantity,
          unitPrice,
        },
      ],
      totalQty: newOrderForm.quantity,
      deliveryDate: newOrderForm.deliveryDate,
      totalAmount,
      status: "PENDING",
      paymentMethod: newOrderForm.paymentMethod,
      paymentStatus: newOrderForm.paymentMethod === "CASH" ? "DUE" : "PAID",
      notes: newOrderForm.notes,
    };

    setOrders([newRecord, ...orders]);
    setIsNewOrderModalOpen(false);
    // Reset form
    setNewOrderForm({
      customerName: "",
      customerNameBn: "",
      customerPhone: "",
      deliveryAddressBn: "",
      areaBn: "ধানমন্ডি",
      cylinderSize: "12 KG",
      quantity: 1,
      deliveryDate: new Date().toISOString().split("T")[0],
      paymentMethod: "CASH",
      notes: "",
    });
  };

  // Change Status Handler from Modal
  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Orders
            </h1>
            <span className="text-xl font-bold text-blue-600 font-bangla">
              / অর্ডার
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Track customer gas cylinder orders, deliveries, and payment statuses /
            অর্ডার তালিকা এবং সরবরাহ পর্যবেক্ষণ
          </p>
        </div>

        <button
          onClick={() => setIsNewOrderModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <Plus className="h-4 w-4" />
          <span>New Order</span>
          <span className="font-bangla font-medium">/ নতুন অর্ডার</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-2 overflow-x-auto pb-1">
          {TAB_OPTIONS.map((tab) => {
            const count = counts[tab.id] || 0;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <span>{tab.label}</span>
                <span className="font-bangla text-xs opacity-75">
                  ({tab.labelBn})
                </span>
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search & Counter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, customer name or phone... / অর্ডার নম্বর বা নাম খুঁজুন"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500">
          Showing <span className="font-semibold text-gray-900">{filteredOrders.length}</span> orders
          {" "}(ক্লিক করে বিস্তারিত দেখুন)
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <th className="px-6 py-4">Order # / ক্রম</th>
                <th className="px-6 py-4">Customer / গ্রাহক</th>
                <th className="px-6 py-4">Cylinder Type / সাইজ</th>
                <th className="px-6 py-4 text-center">Qty / পরিমাণ</th>
                <th className="px-6 py-4">Delivery Date / তারিখ</th>
                <th className="px-6 py-4 text-right">Total Amount / মূল্য</th>
                <th className="px-6 py-4 text-center">Status / অবস্থা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const statusInfo = STATUS_CONFIG[order.status];
                  const StatusIcon = statusInfo.icon;
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="group cursor-pointer hover:bg-blue-50/50 transition-colors"
                    >
                      {/* Order # */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-blue-600 group-hover:underline">
                            {order.orderNumber}
                          </span>
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 font-bangla">
                            {order.areaBn}
                          </span>
                        </div>
                      </td>

                      {/* Customer Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 font-bangla text-sm">
                              {order.customerNameBn}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">
                              {order.customerPhone}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Cylinder Type */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          <Package className="h-3 w-3 text-slate-500" />
                          {order.cylinderType}
                        </span>
                      </td>

                      {/* Quantity */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                          {order.totalQty} pcs
                        </span>
                      </td>

                      {/* Delivery Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <span>{order.deliveryDate}</span>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="font-bold text-gray-900">
                          ৳ {order.totalAmount.toLocaleString()}
                        </div>
                        <span
                          className={`inline-block text-[10px] font-semibold ${
                            order.paymentStatus === "PAID"
                              ? "text-emerald-600"
                              : "text-amber-600"
                          }`}
                        >
                          {order.paymentStatus === "PAID" ? "● Paid" : "○ Due / বকেয়া"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.badge}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          <span>{order.status}</span>
                          <span className="font-bangla font-normal text-[11px]">
                            ({statusInfo.labelBn})
                          </span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                      <ShoppingBag className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-900">
                      No orders found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 font-bangla">
                      এই ফিল্টারে কোন অর্ডার পাওয়া যায়নি। ফিল্টার রিসেট করুন।
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab("ALL");
                        setSearchQuery("");
                      }}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      Reset Filter / সব দেখুন
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 bg-gray-50/50 px-6 py-3.5 sm:flex-row text-xs text-gray-500">
          <div>
            Showing <span className="font-semibold text-gray-800">{filteredOrders.length}</span> of{" "}
            <span className="font-semibold text-gray-800">{orders.length}</span> total orders
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <span>Tip: Click on any row to view full order invoice & dispatch workflow</span>
          </div>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-900 font-mono">
                    {selectedOrder.orderNumber}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      STATUS_CONFIG[selectedOrder.status].badge
                    }`}
                  >
                    {selectedOrder.status} ({STATUS_CONFIG[selectedOrder.status].labelBn})
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Placed on {selectedOrder.deliveryDate} • LPG Order Record
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="mt-5 space-y-4">
              <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-bold text-gray-900 font-bangla text-base">
                      {selectedOrder.customerNameBn}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({selectedOrder.customerName})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono text-gray-600">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <span>{selectedOrder.customerPhone}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 pt-1 text-xs text-gray-700">
                  <MapPin className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className="font-bangla leading-relaxed">
                    {selectedOrder.deliveryAddressBn}
                  </span>
                </div>
                {selectedOrder.deliveryPersonBn && (
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200/60 text-xs text-gray-600">
                    <Truck className="h-3.5 w-3.5 text-purple-600" />
                    <span>Assigned Driver / ডেলিভারিম্যান:</span>
                    <span className="font-semibold text-gray-900 font-bangla">
                      {selectedOrder.deliveryPersonBn}
                    </span>
                  </div>
                )}
              </div>

              {/* Items Breakdown */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-4 py-2.5 text-xs font-bold text-gray-700 uppercase tracking-wider flex justify-between">
                  <span>Item Details / সিলিন্ডার বিবরণ</span>
                  <span>Amount / মূল্য</span>
                </div>
                <div className="p-4 space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-gray-900">
                          {item.cylinderSize} LPG Cylinder
                        </span>
                        <span className="text-xs text-gray-500">
                          × {item.quantity}
                        </span>
                      </div>
                      <div className="font-mono font-semibold text-gray-900">
                        ৳ {(item.quantity * item.unitPrice).toLocaleString()}
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-500">Payment: </span>
                      <span className="text-xs font-semibold uppercase text-gray-800">
                        {selectedOrder.paymentMethod} (
                        {selectedOrder.paymentStatus === "PAID"
                          ? "পরিশোধিত"
                          : "বকেয়া"}
                        )
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">Grand Total: </span>
                      <span className="text-lg font-bold text-blue-700">
                        ৳ {selectedOrder.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 text-xs text-amber-800">
                  <span className="font-bold">Notes: </span>
                  {selectedOrder.notes}
                </div>
              )}

              {/* Quick Status Update Flow */}
              <div className="pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Update Status / স্ট্যাটাস পরিবর্তন করুন:
                </p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {(["PENDING", "CONFIRMED", "DELIVERING", "DELIVERED", "CANCELLED"] as OrderStatus[]).map(
                    (st) => {
                      const isCurr = selectedOrder.status === st;
                      return (
                        <button
                          key={st}
                          onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                          className={`rounded-lg border px-2 py-2 text-xs font-semibold transition-all text-center ${
                            isCurr
                              ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div>{STATUS_CONFIG[st].label}</div>
                          <div className="font-bangla text-[10px] opacity-80">
                            {STATUS_CONFIG[st].labelBn}
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-gray-100 pt-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-gray-100 px-5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
              >
                Close / বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Create New Order
                </h3>
                <p className="text-xs text-gray-500 font-bangla">
                  নতুন সিলিন্ডার অর্ডার বুকিং করুন
                </p>
              </div>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 font-bangla">
                    গ্রাহকের নাম (বাংলা) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.customerNameBn}
                    onChange={(e) =>
                      setNewOrderForm({
                        ...newOrderForm,
                        customerNameBn: e.target.value,
                      })
                    }
                    placeholder="যেমনঃ কামাল হোসেন"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bangla"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newOrderForm.customerPhone}
                    onChange={(e) =>
                      setNewOrderForm({
                        ...newOrderForm,
                        customerPhone: e.target.value,
                      })
                    }
                    placeholder="01711-XXXXXX"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Cylinder Size / সাইজ *
                  </label>
                  <select
                    value={newOrderForm.cylinderSize}
                    onChange={(e) =>
                      setNewOrderForm({
                        ...newOrderForm,
                        cylinderSize: e.target.value as any,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="5 KG">5 KG (৳ 600)</option>
                    <option value="12 KG">12 KG (৳ 1,200) - Standard</option>
                    <option value="25 KG">25 KG (৳ 3,200) - Commercial</option>
                    <option value="45 KG">45 KG (৳ 5,500) - Heavy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Quantity / পরিমাণ *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={newOrderForm.quantity}
                    onChange={(e) =>
                      setNewOrderForm({
                        ...newOrderForm,
                        quantity: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 font-bangla">
                  ডেলিভারি ঠিকানা ও এলাকা *
                </label>
                <input
                  type="text"
                  required
                  value={newOrderForm.deliveryAddressBn}
                  onChange={(e) =>
                    setNewOrderForm({
                      ...newOrderForm,
                      deliveryAddressBn: e.target.value,
                    })
                  }
                  placeholder="যেমনঃ ধানমন্ডি, রোড ২৭, বাড়ি ১২"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bangla"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Delivery Date / তারিখ *
                  </label>
                  <input
                    type="date"
                    required
                    value={newOrderForm.deliveryDate}
                    onChange={(e) =>
                      setNewOrderForm({
                        ...newOrderForm,
                        deliveryDate: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Payment Method / মূল্য পরিশোধ
                  </label>
                  <select
                    value={newOrderForm.paymentMethod}
                    onChange={(e) =>
                      setNewOrderForm({
                        ...newOrderForm,
                        paymentMethod: e.target.value as any,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="CASH">Cash on Delivery (ক্যাশ)</option>
                    <option value="BKASH">bKash (বিকাশ)</option>
                    <option value="NAGAD">Nagad (নগদ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Notes / বিশেষ নির্দেশনা
                </label>
                <textarea
                  rows={2}
                  value={newOrderForm.notes}
                  onChange={(e) =>
                    setNewOrderForm({ ...newOrderForm, notes: e.target.value })
                  }
                  placeholder="Special instructions for delivery team..."
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Price Calculation preview */}
              <div className="rounded-xl bg-blue-50 p-4 border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-blue-700">Estimated Total:</span>
                  <p className="text-xl font-bold text-blue-900">
                    ৳{" "}
                    {(
                      (CYLINDER_PRICES[newOrderForm.cylinderSize] || 1200) *
                      newOrderForm.quantity
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="text-right text-xs text-blue-600 font-bangla">
                  {newOrderForm.quantity} টি {newOrderForm.cylinderSize} সিলিন্ডার
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel / বাতিল
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Confirm Order / অর্ডার নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
