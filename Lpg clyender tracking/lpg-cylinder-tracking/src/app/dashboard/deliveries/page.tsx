"use client";

import React, { useState, useMemo } from "react";
import {
  Truck,
  CheckCircle2,
  Clock,
  Play,
  CheckSquare,
  Search,
  Filter,
  User,
  Phone,
  MapPin,
  Calendar,
  Package,
  X,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

type DeliveryStatus = "PENDING" | "DELIVERING" | "DELIVERED" | "CANCELLED";

interface DeliveryRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerNameBn: string;
  customerPhone: string;
  addressBn: string;
  areaBn: string;
  cylinderSize: string;
  cylinderQty: number;
  deliveryPerson: {
    name: string;
    nameBn: string;
    phone: string;
    vehicle: string;
  };
  assignedAt: string;
  timeSlot: string;
  status: DeliveryStatus;
  emptyCollected?: boolean;
  emptySerial?: string;
  paymentAmount: number;
  paymentStatus: "PAID" | "DUE";
  notes?: string;
}

const INITIAL_DELIVERIES: DeliveryRecord[] = [
  {
    id: "del-1",
    orderNumber: "ORD-2026-001",
    customerName: "Kamal Hossain",
    customerNameBn: "কামাল হোসেন",
    customerPhone: "01711-234567",
    addressBn: "ধানমন্ডি, রোড ২৭, বাড়ি ১২, ঢাকা",
    areaBn: "ধানমন্ডি",
    cylinderSize: "12 KG",
    cylinderQty: 2,
    deliveryPerson: {
      name: "Md. Sujon Mia",
      nameBn: "মোঃ সুজন মিয়া",
      phone: "01822-113355",
      vehicle: "ভ্যান-০১ (ঢাকা মেট্রো-ন ১১-২২৩৩)",
    },
    assignedAt: "09:30 AM",
    timeSlot: "Morning (09:00 AM - 12:00 PM)",
    status: "DELIVERING",
    paymentAmount: 2400,
    paymentStatus: "PAID",
    notes: "Call customer before entering alleyway",
  },
  {
    id: "del-2",
    orderNumber: "ORD-2026-002",
    customerName: "Rahim Uddin",
    customerNameBn: "রহিম উদ্দিন",
    customerPhone: "01819-876543",
    addressBn: "উত্তরা, সেক্টর ৪, রোড ৭, বাড়ি ১৫",
    areaBn: "উত্তরা",
    cylinderSize: "25 KG",
    cylinderQty: 1,
    deliveryPerson: {
      name: "Al-Amin Hossain",
      nameBn: "আল-আমিন হোসেন",
      phone: "01944-556677",
      vehicle: "ভ্যান-০২ (ঢাকা মেট্রো-ন ১২-৩৪৫৬)",
    },
    assignedAt: "08:45 AM",
    timeSlot: "Early Morning (08:00 AM - 10:00 AM)",
    status: "DELIVERED",
    emptyCollected: true,
    emptySerial: "LPG-25-00089",
    paymentAmount: 3200,
    paymentStatus: "PAID",
    notes: "Empty 25KG cylinder collected back to warehouse",
  },
  {
    id: "del-3",
    orderNumber: "ORD-2026-004",
    customerName: "Abdul Karim",
    customerNameBn: "আব্দুল করিম",
    customerPhone: "01723-456789",
    addressBn: "গুলশান ২, রোড ৫২, ফ্ল্যাট ৪বি",
    areaBn: "গুলশান",
    cylinderSize: "45 KG",
    cylinderQty: 2,
    deliveryPerson: {
      name: "Ariful Islam",
      nameBn: "আরিফুল ইসলাম",
      phone: "01633-889900",
      vehicle: "পিকআপ ভ্যান-০৩ (ঢাকা মেট্রো-শ ৪৪-৫৫৬৬)",
    },
    assignedAt: "10:15 AM",
    timeSlot: "Mid-day (11:00 AM - 02:00 PM)",
    status: "PENDING",
    paymentAmount: 11000,
    paymentStatus: "PAID",
    notes: "Heavy commercial order - helper assigned",
  },
  {
    id: "del-4",
    orderNumber: "ORD-2026-007",
    customerName: "Shafiqul Alam",
    customerNameBn: "শফিকুল আলম",
    customerPhone: "01788-990011",
    addressBn: "ধানমন্ডি, রোড ৮/এ, বাড়ি ২৩",
    areaBn: "ধানমন্ডি",
    cylinderSize: "25 KG",
    cylinderQty: 2,
    deliveryPerson: {
      name: "Md. Sujon Mia",
      nameBn: "মোঃ সুজন মিয়া",
      phone: "01822-113355",
      vehicle: "ভ্যান-০১ (ঢাকা মেট্রো-ন ১১-২২৩৩)",
    },
    assignedAt: "11:00 AM",
    timeSlot: "Afternoon (12:00 PM - 03:00 PM)",
    status: "DELIVERING",
    paymentAmount: 6400,
    paymentStatus: "PAID",
    notes: "Requires cylinder installation and leak safety test",
  },
  {
    id: "del-5",
    orderNumber: "ORD-2026-009",
    customerName: "Zahirul Haque",
    customerNameBn: "জহিরুল হক",
    customerPhone: "01933-221100",
    addressBn: "মিরপুর ২, ব্লক এফ, বাড়ি ৪",
    areaBn: "মিরপুর",
    cylinderSize: "5 KG",
    cylinderQty: 1,
    deliveryPerson: {
      name: "Russell Ahmed",
      nameBn: "রাসেল আহমেদ",
      phone: "01755-442211",
      vehicle: "মোটরসাইকেল-০১ (ঢাকা মেট্রো-হ ৩৩-৪৪৩৩)",
    },
    assignedAt: "11:30 AM",
    timeSlot: "Afternoon (02:00 PM - 05:00 PM)",
    status: "PENDING",
    paymentAmount: 600,
    paymentStatus: "DUE",
    notes: "Collect cash on delivery ৳ 600",
  },
  {
    id: "del-6",
    orderNumber: "ORD-2026-005",
    customerName: "Nasrin Akter",
    customerNameBn: "নাসরিন আক্তার",
    customerPhone: "01611-987654",
    addressBn: "মোহাম্মদপুর, বাবর রোড, বাড়ি ১৮",
    areaBn: "মোহাম্মদপুর",
    cylinderSize: "5 KG",
    cylinderQty: 2,
    deliveryPerson: {
      name: "Al-Amin Hossain",
      nameBn: "আল-আমিন হোসেন",
      phone: "01944-556677",
      vehicle: "ভ্যান-০২ (ঢাকা মেট্রো-ন ১২-৩৪৫৬)",
    },
    assignedAt: "09:00 AM",
    timeSlot: "Morning (09:00 AM - 11:00 AM)",
    status: "DELIVERED",
    emptyCollected: true,
    emptySerial: "LPG-05-00192",
    paymentAmount: 1200,
    paymentStatus: "PAID",
    notes: "Customer signed acknowledgement slip",
  },
];

const DELIVERY_PERSONS = [
  { en: "All Drivers", bn: "সবাই" },
  { en: "Md. Sujon Mia", bn: "মোঃ সুজন মিয়া" },
  { en: "Al-Amin Hossain", bn: "আল-আমিন হোসেন" },
  { en: "Ariful Islam", bn: "আরিফুল ইসলাম" },
  { en: "Russell Ahmed", bn: "রাসেল আহমেদ" },
];

const STATUS_METADATA: Record<
  DeliveryStatus,
  { label: string; labelBn: string; badge: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Pending",
    labelBn: "অপেক্ষমান",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Clock,
  },
  DELIVERING: {
    label: "Delivering",
    labelBn: "বহনরত / পথে আছে",
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
    icon: AlertCircle,
  },
};

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(INITIAL_DELIVERIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("All Drivers");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Modal for Complete & Collect Empty
  const [completingDelivery, setCompletingDelivery] = useState<DeliveryRecord | null>(null);
  const [emptySerialInput, setEmptySerialInput] = useState("");
  const [emptyCollectedCheck, setEmptyCollectedCheck] = useState(true);

  // Summary Metrics
  const summary = useMemo(() => {
    return {
      total: deliveries.length,
      pending: deliveries.filter((d) => d.status === "PENDING").length,
      delivering: deliveries.filter((d) => d.status === "DELIVERING").length,
      delivered: deliveries.filter((d) => d.status === "DELIVERED").length,
    };
  }, [deliveries]);

  // Filtered deliveries
  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((d) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.orderNumber.toLowerCase().includes(q) ||
        d.customerName.toLowerCase().includes(q) ||
        d.customerNameBn.includes(q) ||
        d.customerPhone.includes(q) ||
        d.addressBn.includes(q) ||
        d.deliveryPerson.nameBn.includes(q);

      const matchesDriver =
        selectedDriver === "All Drivers" ||
        d.deliveryPerson.name === selectedDriver ||
        d.deliveryPerson.nameBn === selectedDriver;

      const matchesStatus =
        selectedStatus === "ALL" || d.status === selectedStatus;

      return matchesSearch && matchesDriver && matchesStatus;
    });
  }, [deliveries, searchQuery, selectedDriver, selectedStatus]);

  // Action: Start Delivery
  const handleStartDelivery = (id: string) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: "DELIVERING" as DeliveryStatus } : d
      )
    );
  };

  // Open Complete Delivery Modal
  const handleOpenCompleteModal = (item: DeliveryRecord) => {
    setCompletingDelivery(item);
    setEmptySerialInput(`LPG-${item.cylinderSize.replace(" ", "")}-00${Math.floor(100 + Math.random() * 900)}`);
    setEmptyCollectedCheck(true);
  };

  // Confirm Complete Delivery + Collect Empty
  const handleConfirmComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingDelivery) return;

    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === completingDelivery.id
          ? {
              ...d,
              status: "DELIVERED" as DeliveryStatus,
              emptyCollected: emptyCollectedCheck,
              emptySerial: emptyCollectedCheck ? emptySerialInput : undefined,
              paymentStatus: "PAID",
            }
          : d
      )
    );
    setCompletingDelivery(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Deliveries
            </h1>
            <span className="text-xl font-bold text-blue-600 font-bangla">
              / ডেলিভারি
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Today's delivery dispatch schedule, driver routes, and cylinder returns /
            আজকের ডেলিভারি শিডিউল ও খালি সিলিন্ডার সংগ্রহ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-3.5 py-2 text-xs font-semibold text-blue-700">
            <Calendar className="h-4 w-4" />
            <span>Today / আজ: 15 Oct 2026</span>
          </div>
        </div>
      </div>

      {/* Today's Delivery Schedule Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total Today */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Today's Total / মোট শিডিউল
            </span>
            <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{summary.total}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Assigned deliveries</p>
        </div>

        {/* Pending Dispatch */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Pending / অপেক্ষমান
            </span>
            <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-900">{summary.pending}</p>
          <p className="text-[11px] text-amber-700 font-bangla mt-0.5">গুদামে প্রস্তুত হচ্ছে</p>
        </div>

        {/* In Transit */}
        <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-800">
              In Transit / পথে আছে
            </span>
            <div className="rounded-xl bg-purple-100 p-2 text-purple-700">
              <Truck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-900">{summary.delivering}</p>
          <p className="text-[11px] text-purple-700 font-bangla mt-0.5">ভ্যানে বহনরত</p>
        </div>

        {/* Completed */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Delivered / সম্পন্ন
            </span>
            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-900">{summary.delivered}</p>
          <p className="text-[11px] text-emerald-700 font-bangla mt-0.5">গ্রাহকের কাছে পৌঁছানো সম্পন্ন</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, customer, address or driver... / খুঁজুন"
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

        {/* Filter Driver & Status */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Driver Selector */}
          <div className="relative min-w-[170px]">
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-3 pr-8 text-xs font-medium text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              {DELIVERY_PERSONS.map((dp) => (
                <option key={dp.en} value={dp.en}>
                  {dp.bn} ({dp.en})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400">
              <Filter className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Status Selector */}
          <div className="relative min-w-[140px]">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-3 pr-8 text-xs font-medium text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="ALL">All Status / সব অবস্থা</option>
              <option value="PENDING">Pending / অপেক্ষমান</option>
              <option value="DELIVERING">Delivering / পথে আছে</option>
              <option value="DELIVERED">Delivered / সম্পন্ন</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400">
              <Filter className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Deliveries Schedule Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <th className="px-6 py-4">Order # / ক্রম</th>
                <th className="px-6 py-4">Customer / গ্রাহক</th>
                <th className="px-6 py-4">Delivery Address / ঠিকানা</th>
                <th className="px-6 py-4">Delivery Person / সরবরাহকারী</th>
                <th className="px-6 py-4">Time Slot / সময়</th>
                <th className="px-6 py-4 text-center">Status / অবস্থা</th>
                <th className="px-6 py-4 text-right">Actions / পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredDeliveries.length > 0 ? (
                filteredDeliveries.map((delivery) => {
                  const statusInfo = STATUS_METADATA[delivery.status];
                  const StatusIcon = statusInfo.icon;
                  return (
                    <tr
                      key={delivery.id}
                      className="group hover:bg-blue-50/40 transition-colors"
                    >
                      {/* Order # and Item size */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-mono text-sm font-bold text-blue-600">
                          {delivery.orderNumber}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium mt-0.5">
                          <Package className="h-3 w-3 text-gray-400" />
                          <span>
                            {delivery.cylinderQty}x {delivery.cylinderSize}
                          </span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 font-bangla text-sm">
                              {delivery.customerNameBn}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">
                              {delivery.customerPhone}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="px-6 py-4 max-w-xs">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bangla text-xs text-gray-800 leading-tight">
                              {delivery.addressBn}
                            </span>
                            <span className="ml-1 rounded bg-gray-100 px-1 py-0.2 text-[10px] text-gray-500 font-bangla">
                              {delivery.areaBn}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Delivery Person (Bangla names) */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                            <Truck className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 font-bangla text-xs">
                              {delivery.deliveryPerson.nameBn}
                            </p>
                            <p className="text-[11px] text-gray-500 font-mono">
                              {delivery.deliveryPerson.phone}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Assigned At / Time Slot */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                        <div className="flex items-center gap-1 font-medium text-gray-800">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span>{delivery.assignedAt}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {delivery.timeSlot}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.badge}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          <span>{delivery.status}</span>
                          <span className="font-bangla font-normal text-[11px]">
                            ({statusInfo.labelBn})
                          </span>
                        </span>
                        {delivery.emptyCollected && (
                          <div className="text-[10px] text-emerald-600 font-bangla mt-1 font-medium flex items-center justify-center gap-0.5">
                            <CheckSquare className="h-3 w-3" />
                            খালি সিলিন্ডার গৃহীত
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {delivery.status === "PENDING" && (
                          <button
                            onClick={() => handleStartDelivery(delivery.id)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            <span>Start Delivery</span>
                            <span className="font-bangla font-normal">/ শুরু</span>
                          </button>
                        )}

                        {delivery.status === "DELIVERING" && (
                          <button
                            onClick={() => handleOpenCompleteModal(delivery)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                          >
                            <CheckSquare className="h-3.5 w-3.5" />
                            <span>Mark Complete + Empty</span>
                            <span className="font-bangla font-normal">/ সম্পন্ন</span>
                          </button>
                        )}

                        {delivery.status === "DELIVERED" && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Completed / সম্পন্ন</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                      <Truck className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-900">
                      No deliveries scheduled
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 font-bangla">
                      এই ফিল্টারে কোন ডেলিভারি শিডিউল পাওয়া যায়নি।
                    </p>
                    <button
                      onClick={() => {
                        setSelectedDriver("All Drivers");
                        setSelectedStatus("ALL");
                        setSearchQuery("");
                      }}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      Reset Filters / ফিল্টার পরিষ্কার করুন
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
            Showing <span className="font-semibold text-gray-800">{filteredDeliveries.length}</span> of{" "}
            <span className="font-semibold text-gray-800">{deliveries.length}</span> deliveries for today
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bangla">ডেলিভারিম্যান জিপিএস ট্র্যাকার সক্রিয়</span>
          </div>
        </div>
      </div>

      {/* Mark Complete + Collect Empty Modal */}
      {completingDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Complete Delivery & Collect Empty
                </h3>
                <p className="text-xs text-gray-500 font-bangla">
                  ডেলিভারি সম্পন্ন করুন এবং খালি সিলিন্ডার জমা নিন
                </p>
              </div>
              <button
                onClick={() => setCompletingDelivery(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmComplete} className="mt-4 space-y-4">
              <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100 text-xs space-y-1">
                <div className="flex justify-between font-mono font-bold text-blue-600">
                  <span>Order: {completingDelivery.orderNumber}</span>
                  <span>Amount: ৳ {completingDelivery.paymentAmount.toLocaleString()}</span>
                </div>
                <div className="text-gray-800 font-bangla font-semibold pt-1">
                  গ্রাহক: {completingDelivery.customerNameBn}
                </div>
                <div className="text-gray-500 font-bangla">
                  ঠিকানা: {completingDelivery.addressBn}
                </div>
              </div>

              {/* Checkbox for empty collected */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="emptyCollect"
                    checked={emptyCollectedCheck}
                    onChange={(e) => setEmptyCollectedCheck(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <label
                      htmlFor="emptyCollect"
                      className="text-xs font-bold text-emerald-900"
                    >
                      Empty Cylinder Collected / খালি সিলিন্ডার ফেরত নেওয়া হয়েছে
                    </label>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Verify that the return cylinder valve is shut and seal intact
                    </p>
                  </div>
                </div>

                {emptyCollectedCheck && (
                  <div className="mt-3 pt-2 border-t border-emerald-200">
                    <label className="block text-xs font-semibold text-emerald-800 font-mono mb-1">
                      Return Cylinder Serial # / সিরিয়াল নম্বর
                    </label>
                    <input
                      type="text"
                      required
                      value={emptySerialInput}
                      onChange={(e) => setEmptySerialInput(e.target.value)}
                      placeholder="e.g. LPG-12-00481"
                      className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-mono font-bold text-emerald-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase"
                    />
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-blue-50 p-3 border border-blue-100 text-xs text-blue-800 flex items-center justify-between">
                <span>Payment Collection:</span>
                <span className="font-bold">
                  ৳ {completingDelivery.paymentAmount.toLocaleString()} (Cash / Received)
                </span>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => setCompletingDelivery(null)}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel / বাতিল
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  Confirm & Complete / নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
