"use client";

import React, { useState, useMemo } from "react";
import {
  Package,
  CheckCircle,
  AlertOctagon,
  Clock,
  Truck,
  Plus,
  Search,
  Filter,
  X,
  Layers,
  Archive,
  RefreshCw,
  Building,
  User,
  ShieldAlert,
  ArrowUpDown,
} from "lucide-react";

type CylinderStatus = "FULL" | "EMPTY" | "IN_USE" | "DAMAGED" | "IN_TRANSIT";
type CylinderSize = "5 KG" | "12 KG" | "25 KG" | "45 KG";

interface CylinderItem {
  id: string;
  serialNumber: string;
  size: CylinderSize;
  status: CylinderStatus;
  currentCustomer?: {
    name: string;
    nameBn: string;
    areaBn: string;
    phone: string;
  };
  location: string;
  locationBn: string;
  lastUpdated: string;
  notes?: string;
}

const INITIAL_CYLINDERS: CylinderItem[] = [
  {
    id: "cyl-1",
    serialNumber: "LPG-12-00842",
    size: "12 KG",
    status: "IN_USE",
    currentCustomer: {
      name: "Kamal Hossain",
      nameBn: "কামাল হোসেন",
      areaBn: "ধানমন্ডি",
      phone: "01711-234567",
    },
    location: "Customer Premises (Dhanmondi)",
    locationBn: "গ্রাহকের ঠিকানা (ধানমন্ডি)",
    lastUpdated: "2 hours ago",
    notes: "Delivered via Order #ORD-2026-001",
  },
  {
    id: "cyl-2",
    serialNumber: "LPG-12-00843",
    size: "12 KG",
    status: "FULL",
    location: "Main Warehouse - Rack B3",
    locationBn: "প্রধান গুদাম - র্যাক বি৩",
    lastUpdated: "1 day ago",
    notes: "Safety inspected & refilled",
  },
  {
    id: "cyl-3",
    serialNumber: "LPG-25-00120",
    size: "25 KG",
    status: "IN_USE",
    currentCustomer: {
      name: "Rahim Uddin",
      nameBn: "রহিম উদ্দিন",
      areaBn: "উত্তরা",
      phone: "01819-876543",
    },
    location: "Customer Premises (Uttara)",
    locationBn: "গ্রাহকের ঠিকানা (উত্তরা)",
    lastUpdated: "4 hours ago",
    notes: "Commercial kitchen active usage",
  },
  {
    id: "cyl-4",
    serialNumber: "LPG-05-00311",
    size: "5 KG",
    status: "EMPTY",
    location: "Main Warehouse - Return Bay",
    locationBn: "প্রধান গুদাম - রিটার্ন এরিয়া",
    lastUpdated: "3 days ago",
    notes: "Collected from customer, queued for refill",
  },
  {
    id: "cyl-5",
    serialNumber: "LPG-45-00045",
    size: "45 KG",
    status: "IN_TRANSIT",
    currentCustomer: {
      name: "Abdul Karim",
      nameBn: "আব্দুল করিম",
      areaBn: "গুলশান",
      phone: "01723-456789",
    },
    location: "Delivery Van-03 (Gulshan Route)",
    locationBn: "ডেলিভারি ভ্যান-০৩ (গুলশান রুট)",
    lastUpdated: "30 mins ago",
    notes: "Driver: Ariful Islam",
  },
  {
    id: "cyl-6",
    serialNumber: "LPG-12-00912",
    size: "12 KG",
    status: "DAMAGED",
    location: "Maintenance Center - Gazipur",
    locationBn: "মেরামত কেন্দ্র - গাজীপুর",
    lastUpdated: "5 days ago",
    notes: "Defective valve reported, pending replacement",
  },
  {
    id: "cyl-7",
    serialNumber: "LPG-12-00955",
    size: "12 KG",
    status: "FULL",
    location: "Main Warehouse - Rack A1",
    locationBn: "প্রধান গুদাম - র্যাক এ১",
    lastUpdated: "Just now",
    notes: "Ready for dispatch",
  },
  {
    id: "cyl-8",
    serialNumber: "LPG-25-00188",
    size: "25 KG",
    status: "IN_USE",
    currentCustomer: {
      name: "Tarek Mahmud",
      nameBn: "তারেক মাহমুদ",
      areaBn: "বনানী",
      phone: "01552-334455",
    },
    location: "Customer Premises (Banani)",
    locationBn: "গ্রাহকের ঠিকানা (বনানী)",
    lastUpdated: "Yesterday",
    notes: "Delivered to bakery",
  },
  {
    id: "cyl-9",
    serialNumber: "LPG-05-00402",
    size: "5 KG",
    status: "FULL",
    location: "Main Warehouse - Rack C2",
    locationBn: "প্রধান গুদাম - র্যাক সি২",
    lastUpdated: "2 days ago",
    notes: "Sealed & certified",
  },
  {
    id: "cyl-10",
    serialNumber: "LPG-45-00052",
    size: "45 KG",
    status: "EMPTY",
    location: "Main Warehouse - Holding Dock",
    locationBn: "প্রধান গুদাম - হোল্ডিং ডক",
    lastUpdated: "1 day ago",
    notes: "Heavy commercial cylinder awaiting refill convoy",
  },
];

const STATUS_METADATA: Record<
  CylinderStatus,
  {
    label: string;
    labelBn: string;
    badge: string;
    dot: string;
    icon: React.ElementType;
  }
> = {
  FULL: {
    label: "Full",
    labelBn: "পূর্ণ",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircle,
  },
  EMPTY: {
    label: "Empty",
    labelBn: "খালি",
    badge: "bg-gray-100 text-gray-700 border-gray-300",
    dot: "bg-gray-400",
    icon: Archive,
  },
  IN_USE: {
    label: "In Use",
    labelBn: "ব্যবহৃত",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    icon: Package,
  },
  DAMAGED: {
    label: "Damaged",
    labelBn: "ক্ষতিগ্রস্ত",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
    icon: ShieldAlert,
  },
  IN_TRANSIT: {
    label: "In Transit",
    labelBn: "বহনরত",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
    icon: Truck,
  },
};

const SIZES: CylinderSize[] = ["5 KG", "12 KG", "25 KG", "45 KG"];

export default function CylindersPage() {
  const [cylinders, setCylinders] = useState<CylinderItem[]>(INITIAL_CYLINDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSize, setSelectedSize] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCylinder, setSelectedCylinder] = useState<CylinderItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    serialNumber: "",
    size: "12 KG" as CylinderSize,
    status: "FULL" as CylinderStatus,
    location: "Main Warehouse - Rack A",
    locationBn: "প্রধান গুদাম",
    notes: "",
  });

  // Summary counts
  const summary = useMemo(() => {
    return {
      total: cylinders.length,
      full: cylinders.filter((c) => c.status === "FULL").length,
      empty: cylinders.filter((c) => c.status === "EMPTY").length,
      inUse: cylinders.filter((c) => c.status === "IN_USE").length,
      damaged: cylinders.filter((c) => c.status === "DAMAGED").length,
    };
  }, [cylinders]);

  // Filtered cylinders
  const filteredCylinders = useMemo(() => {
    return cylinders.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.serialNumber.toLowerCase().includes(q) ||
        (c.currentCustomer &&
          (c.currentCustomer.name.toLowerCase().includes(q) ||
            c.currentCustomer.nameBn.includes(q) ||
            c.currentCustomer.areaBn.includes(q))) ||
        c.locationBn.includes(q);

      const matchesSize = selectedSize === "ALL" || c.size === selectedSize;
      const matchesStatus = selectedStatus === "ALL" || c.status === selectedStatus;

      return matchesSearch && matchesSize && matchesStatus;
    });
  }, [cylinders, searchQuery, selectedSize, selectedStatus]);

  // Handle Add Cylinder
  const handleAddCylinder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serialNumber.trim()) {
      alert("Please enter a valid serial number.");
      return;
    }

    const newCylinder: CylinderItem = {
      id: `cyl-${Date.now()}`,
      serialNumber: formData.serialNumber.toUpperCase().trim(),
      size: formData.size,
      status: formData.status,
      location: formData.location,
      locationBn: formData.locationBn,
      lastUpdated: "Just now",
      notes: formData.notes,
    };

    setCylinders([newCylinder, ...cylinders]);
    setIsAddModalOpen(false);
    setFormData({
      serialNumber: "",
      size: "12 KG",
      status: "FULL",
      location: "Main Warehouse - Rack A",
      locationBn: "প্রধান গুদাম",
      notes: "",
    });
  };

  // Quick Status Update
  const handleQuickStatusChange = (cylId: string, newStatus: CylinderStatus) => {
    setCylinders((prev) =>
      prev.map((c) =>
        c.id === cylId
          ? {
              ...c,
              status: newStatus,
              lastUpdated: "Just now",
              currentCustomer: newStatus === "IN_USE" ? c.currentCustomer : undefined,
            }
          : c
      )
    );
    if (selectedCylinder && selectedCylinder.id === cylId) {
      setSelectedCylinder((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              lastUpdated: "Just now",
              currentCustomer: newStatus === "IN_USE" ? prev.currentCustomer : undefined,
            }
          : null
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Cylinders
            </h1>
            <span className="text-xl font-bold text-blue-600 font-bangla">
              / সিলিন্ডার
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Real-time LPG cylinder inventory, lifecycle tracking, and maintenance /
            সিলিন্ডার স্টক ও অবস্থান ট্র্যাকিং
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <Plus className="h-4 w-4" />
          <span>Add Cylinder</span>
          <span className="font-bangla font-medium">/ সিলিন্ডার যুক্ত করুন</span>
        </button>
      </div>

      {/* 5 Summary Cards at Top */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {/* Total Stock */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Stock / মোট
            </span>
            <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{summary.total}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">All sizes combined</p>
        </div>

        {/* Full */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Full / পূর্ণ
            </span>
            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-900">{summary.full}</p>
          <p className="text-[11px] text-emerald-700 font-bangla mt-0.5">সরবরাহের জন্য প্রস্তুত</p>
        </div>

        {/* Empty */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
              Empty / খালি
            </span>
            <div className="rounded-xl bg-gray-200 p-2 text-gray-700">
              <Archive className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-800">{summary.empty}</p>
          <p className="text-[11px] text-gray-500 font-bangla mt-0.5">রিফিলিং প্রয়োজন</p>
        </div>

        {/* In Use */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-800">
              In Use / ব্যবহৃত
            </span>
            <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-900">{summary.inUse}</p>
          <p className="text-[11px] text-blue-700 font-bangla mt-0.5">গ্রাহকের কাছে আছে</p>
        </div>

        {/* Damaged */}
        <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">
              Damaged / ত্রুটিপূর্ণ
            </span>
            <div className="rounded-xl bg-rose-100 p-2 text-rose-700">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-900">{summary.damaged}</p>
          <p className="text-[11px] text-rose-700 font-bangla mt-0.5">মেরামত প্রয়োজন</p>
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
            placeholder="Search by serial #, customer name... / সিরিয়াল নম্বর দিয়ে খুঁজুন"
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

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Size Filter */}
          <div className="relative min-w-[130px]">
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-3 pr-8 text-xs font-medium text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="ALL">All Sizes / সব সাইজ</option>
              <option value="5 KG">5 KG Cylinder</option>
              <option value="12 KG">12 KG Cylinder</option>
              <option value="25 KG">25 KG Cylinder</option>
              <option value="45 KG">45 KG Cylinder</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400">
              <Filter className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[140px]">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-3 pr-8 text-xs font-medium text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="ALL">All Status / সব অবস্থা</option>
              <option value="FULL">Full / পূর্ণ</option>
              <option value="EMPTY">Empty / খালি</option>
              <option value="IN_USE">In Use / ব্যবহৃত</option>
              <option value="DAMAGED">Damaged / ক্ষতিগ্রস্ত</option>
              <option value="IN_TRANSIT">In Transit / বহনরত</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400">
              <Filter className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Cylinders Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <th className="px-6 py-4">Serial Number / নম্বর</th>
                <th className="px-6 py-4">Size / সাইজ</th>
                <th className="px-6 py-4 text-center">Status / অবস্থা</th>
                <th className="px-6 py-4">Current Customer / বর্তমান গ্রাহক</th>
                <th className="px-6 py-4">Location / অবস্থান</th>
                <th className="px-6 py-4">Last Updated / আপডেট</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredCylinders.length > 0 ? (
                filteredCylinders.map((cyl) => {
                  const meta = STATUS_METADATA[cyl.status];
                  const Icon = meta.icon;
                  return (
                    <tr
                      key={cyl.id}
                      className="group hover:bg-blue-50/40 transition-colors"
                    >
                      {/* Serial Number */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-gray-900">
                            {cyl.serialNumber}
                          </span>
                        </div>
                      </td>

                      {/* Size */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-800">
                          <Package className="h-3.5 w-3.5 text-gray-500" />
                          <span>{cyl.size}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${meta.badge}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                          <span>{cyl.status}</span>
                          <span className="font-bangla font-normal text-[11px]">
                            ({meta.labelBn})
                          </span>
                        </span>
                      </td>

                      {/* Current Customer */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cyl.currentCustomer ? (
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">
                              <User className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 font-bangla text-xs">
                                {cyl.currentCustomer.nameBn}
                              </p>
                              <p className="text-[11px] text-gray-500">
                                {cyl.currentCustomer.areaBn} • {cyl.currentCustomer.phone}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 font-bangla">
                            — (গুদামজাত)
                          </span>
                        )}
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4 max-w-xs text-xs text-gray-600">
                        <p className="font-bangla text-gray-800 font-medium truncate">
                          {cyl.locationBn}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">{cyl.location}</p>
                      </td>

                      {/* Last Updated */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span>{cyl.lastUpdated}</span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedCylinder(cyl)}
                          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-2xs"
                        >
                          Update / বিবরণ
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                      <Package className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-900">
                      No cylinders match criteria
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 font-bangla">
                      কোন সিলিন্ডার খুঁজে পাওয়া যায়নি। ফিল্টার রিসেট করুন।
                    </p>
                    <button
                      onClick={() => {
                        setSelectedSize("ALL");
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
            Showing <span className="font-semibold text-gray-800">{filteredCylinders.length}</span> of{" "}
            <span className="font-semibold text-gray-800">{cylinders.length}</span> cylinders
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bangla text-gray-600">সব সিলিন্ডার বিআরটিএ ও বিস্ফোরক পরিদপ্তর অনুমোদিত</span>
          </div>
        </div>
      </div>

      {/* Quick Cylinder Details & Status Change Modal */}
      {selectedCylinder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 font-mono">
                  {selectedCylinder.serialNumber}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedCylinder.size} Cylinder • {selectedCylinder.locationBn}
                </p>
              </div>
              <button
                onClick={() => setSelectedCylinder(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl bg-gray-50 p-3 text-xs space-y-1.5 border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">Current Status:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedCylinder.status} ({STATUS_METADATA[selectedCylinder.status].labelBn})
                  </span>
                </div>
                {selectedCylinder.currentCustomer && (
                  <div className="flex justify-between pt-1 border-t border-gray-200">
                    <span className="text-gray-500 font-bangla">গ্রাহক:</span>
                    <span className="font-bold font-bangla text-gray-900">
                      {selectedCylinder.currentCustomer.nameBn} (
                      {selectedCylinder.currentCustomer.areaBn})
                    </span>
                  </div>
                )}
                {selectedCylinder.notes && (
                  <div className="pt-1 text-gray-600 italic">
                    Note: {selectedCylinder.notes}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Change Status / স্ট্যাটাস হালনাগাদ করুন:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["FULL", "EMPTY", "IN_USE", "DAMAGED", "IN_TRANSIT"] as CylinderStatus[]).map(
                    (st) => {
                      const isCurr = selectedCylinder.status === st;
                      const m = STATUS_METADATA[st];
                      return (
                        <button
                          key={st}
                          onClick={() => handleQuickStatusChange(selectedCylinder.id, st)}
                          className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                            isCurr
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className={`h-2 w-2 rounded-full ${m.dot}`} />
                          <span>{st}</span>
                          <span className="font-bangla font-normal text-[11px] text-gray-500">
                            ({m.labelBn})
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-gray-100 pt-3">
              <button
                onClick={() => setSelectedCylinder(null)}
                className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
              >
                Close / বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Cylinder Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Register New Cylinder
                </h3>
                <p className="text-xs text-gray-500 font-bangla">
                  নতুন সিলিন্ডার ইনভেন্টরিতে যুক্ত করুন
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCylinder} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 font-mono">
                  Serial Number * (সিরিয়াল নম্বর)
                </label>
                <input
                  type="text"
                  required
                  value={formData.serialNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, serialNumber: e.target.value })
                  }
                  placeholder="e.g. LPG-12-00999"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase font-mono font-medium"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Cylinder Size / সাইজ *
                  </label>
                  <select
                    value={formData.size}
                    onChange={(e) =>
                      setFormData({ ...formData, size: e.target.value as CylinderSize })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {SIZES.map((s) => (
                      <option key={s} value={s}>
                        {s} Cylinder
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Initial Status / প্রাথমিক অবস্থা *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as CylinderStatus,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="FULL">FULL / পূর্ণ (Refilled)</option>
                    <option value="EMPTY">EMPTY / খালি</option>
                    <option value="DAMAGED">DAMAGED / ক্ষতিগ্রস্ত</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 font-bangla">
                  গুদাম / সংরক্ষণ অবস্থান
                </label>
                <input
                  type="text"
                  value={formData.locationBn}
                  onChange={(e) =>
                    setFormData({ ...formData, locationBn: e.target.value })
                  }
                  placeholder="যেমনঃ প্রধান গুদাম - র্যাক এ২"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bangla"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Notes / বিবরণ
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Tare weight, tare test date, valve model..."
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel / বাতিল
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Save Cylinder / সংরক্ষণ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
