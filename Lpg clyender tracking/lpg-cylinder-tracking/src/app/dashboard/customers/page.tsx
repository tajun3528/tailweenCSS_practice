"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Phone,
  MapPin,
  User,
  ShoppingBag,
  CheckCircle,
  XCircle,
  X,
  AlertCircle,
  Eye,
  Building,
} from "lucide-react";

interface CustomerItem {
  id: string;
  name: string;
  nameBn: string;
  phone: string;
  altPhone?: string;
  address: string;
  addressBn: string;
  area: string;
  areaBn: string;
  totalOrders: number;
  isActive: boolean;
  notes?: string;
  joinedDate: string;
}

const INITIAL_CUSTOMERS: CustomerItem[] = [
  {
    id: "CUST-001",
    name: "Kamal Hossain",
    nameBn: "কামাল হোসেন",
    phone: "01711-234567",
    altPhone: "01811-998877",
    address: "House 12, Road 27, Dhanmondi",
    addressBn: "ধানমন্ডি, রোড ২৭, বাড়ি ১২",
    area: "Dhanmondi",
    areaBn: "ধানমন্ডি",
    totalOrders: 15,
    isActive: true,
    notes: "Regular 12KG customer, prefers morning delivery",
    joinedDate: "2024-01-10",
  },
  {
    id: "CUST-002",
    name: "Rahim Uddin",
    nameBn: "রহিম উদ্দিন",
    phone: "01819-876543",
    address: "House 15, Road 7, Sector 4, Uttara",
    addressBn: "উত্তরা, সেক্টর ৪, রোড ৭, বাড়ি ১৫",
    area: "Uttara",
    areaBn: "উত্তরা",
    totalOrders: 8,
    isActive: true,
    notes: "Restaurant owner - uses 25KG cylinders",
    joinedDate: "2024-02-14",
  },
  {
    id: "CUST-003",
    name: "Fatema Khanam",
    nameBn: "ফাতেমা খানম",
    phone: "01912-345678",
    address: "Block C, Road 2, Mirpur 10",
    addressBn: "মিরপুর ১০, ব্লক সি, রোড ২",
    area: "Mirpur",
    areaBn: "মিরপুর",
    totalOrders: 22,
    isActive: true,
    notes: "VIP customer - priority dispatch",
    joinedDate: "2023-11-05",
  },
  {
    id: "CUST-004",
    name: "Abdul Karim",
    nameBn: "আব্দুল করিম",
    phone: "01723-456789",
    altPhone: "01999-112233",
    address: "Flat 4B, Road 52, Gulshan 2",
    addressBn: "গুলশান ২, রোড ৫২, ফ্ল্যাট ৪বি",
    area: "Gulshan",
    areaBn: "গুলশান",
    totalOrders: 12,
    isActive: true,
    notes: "Commercial kitchen - uses 45KG commercial cylinders",
    joinedDate: "2024-03-01",
  },
  {
    id: "CUST-005",
    name: "Nasrin Akter",
    nameBn: "নাসরিন আক্তার",
    phone: "01611-987654",
    address: "House 18, Babar Road, Mohammadpur",
    addressBn: "মোহাম্মদপুর, বাবর রোড, বাড়ি ১৮",
    area: "Mohammadpur",
    areaBn: "মোহাম্মদপুর",
    totalOrders: 5,
    isActive: true,
    notes: "Uses 5KG compact cylinders",
    joinedDate: "2024-05-20",
  },
  {
    id: "CUST-006",
    name: "Tarek Mahmud",
    nameBn: "তারেক মাহমুদ",
    phone: "01552-334455",
    address: "Block D, Road 11, Banani",
    addressBn: "বনানী, ব্লক ডি, রোড ১১",
    area: "Banani",
    areaBn: "বনানী",
    totalOrders: 18,
    isActive: true,
    notes: "Bakery enterprise, weekly replenishment",
    joinedDate: "2023-09-18",
  },
  {
    id: "CUST-007",
    name: "Selina Begum",
    nameBn: "মোছাঃ সেলিনা বেগম",
    phone: "01733-667788",
    address: "Middle Badda, Link Road",
    addressBn: "বাড্ডা, মধ্য বাড্ডা, লিংক রোড",
    area: "Badda",
    areaBn: "বাড্ডা",
    totalOrders: 3,
    isActive: false,
    notes: "Account temporarily on hold by customer request",
    joinedDate: "2024-06-12",
  },
  {
    id: "CUST-008",
    name: "Rafiqul Islam",
    nameBn: "রফিকুল ইসলাম",
    phone: "01844-112233",
    address: "Chowdhury Bazar, Lalbagh, Old Dhaka",
    addressBn: "লালবাগ, চৌধুরী বাজার, ঢাকা",
    area: "Lalbagh",
    areaBn: "লালবাগ",
    totalOrders: 0,
    isActive: false,
    notes: "New inquiry - awaiting security deposit verification",
    joinedDate: "2024-08-01",
  },
];

const AREAS = [
  { en: "All Areas", bn: "সব এলাকা" },
  { en: "Dhanmondi", bn: "ধানমন্ডি" },
  { en: "Mirpur", bn: "মিরপুর" },
  { en: "Uttara", bn: "উত্তরা" },
  { en: "Gulshan", bn: "গুলশান" },
  { en: "Mohammadpur", bn: "মোহাম্মদপুর" },
  { en: "Banani", bn: "বনানী" },
  { en: "Badda", bn: "বাড্ডা" },
  { en: "Lalbagh", bn: "লালবাগ" },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerItem | null>(null);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    nameBn: "",
    phone: "",
    altPhone: "",
    address: "",
    addressBn: "",
    area: "Dhanmondi",
    areaBn: "ধানমন্ডি",
    notes: "",
    isActive: true,
  });

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        cust.name.toLowerCase().includes(q) ||
        cust.nameBn.includes(q) ||
        cust.phone.includes(q) ||
        (cust.altPhone && cust.altPhone.includes(q)) ||
        cust.addressBn.includes(q) ||
        cust.area.toLowerCase().includes(q);

      const matchesArea =
        selectedArea === "All Areas" || cust.area === selectedArea;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && cust.isActive) ||
        (statusFilter === "INACTIVE" && !cust.isActive);

      return matchesSearch && matchesArea && matchesStatus;
    });
  }, [customers, searchQuery, selectedArea, statusFilter]);

  // Handle Form open for Add
  const handleOpenAdd = () => {
    setFormData({
      name: "",
      nameBn: "",
      phone: "",
      altPhone: "",
      address: "",
      addressBn: "",
      area: "Dhanmondi",
      areaBn: "ধানমন্ডি",
      notes: "",
      isActive: true,
    });
    setIsAddModalOpen(true);
  };

  // Handle Form open for Edit
  const handleOpenEdit = (customer: CustomerItem) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      nameBn: customer.nameBn,
      phone: customer.phone,
      altPhone: customer.altPhone || "",
      address: customer.address,
      addressBn: customer.addressBn,
      area: customer.area,
      areaBn: customer.areaBn,
      notes: customer.notes || "",
      isActive: customer.isActive,
    });
  };

  // Handle Save (Add or Edit)
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.nameBn.trim() || !formData.phone.trim()) {
      alert("Please fill in the customer name and phone number.");
      return;
    }

    const matchedArea = AREAS.find((a) => a.en === formData.area);
    const areaBn = matchedArea ? matchedArea.bn : formData.area;

    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id
            ? {
                ...c,
                name: formData.name,
                nameBn: formData.nameBn,
                phone: formData.phone,
                altPhone: formData.altPhone || undefined,
                address: formData.address,
                addressBn: formData.addressBn,
                area: formData.area,
                areaBn,
                notes: formData.notes,
                isActive: formData.isActive,
              }
            : c
        )
      );
      setEditingCustomer(null);
    } else {
      const newCustomer: CustomerItem = {
        id: `CUST-${String(customers.length + 1).padStart(3, "0")}`,
        name: formData.name,
        nameBn: formData.nameBn,
        phone: formData.phone,
        altPhone: formData.altPhone || undefined,
        address: formData.address,
        addressBn: formData.addressBn,
        area: formData.area,
        areaBn,
        totalOrders: 0,
        isActive: formData.isActive,
        notes: formData.notes,
        joinedDate: new Date().toISOString().split("T")[0],
      };
      setCustomers((prev) => [newCustomer, ...prev]);
      setIsAddModalOpen(false);
    }
  };

  // Handle Delete
  const handleConfirmDelete = () => {
    if (deletingCustomerId) {
      setCustomers((prev) => prev.filter((c) => c.id !== deletingCustomerId));
      setDeletingCustomerId(null);
    }
  };

  const activeCount = customers.filter((c) => c.isActive).length;
  const inactiveCount = customers.filter((c) => !c.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Customers
            </h1>
            <span className="text-xl font-bold text-blue-600 font-bangla">
              / গ্রাহক
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Manage your registered cylinder consumers and delivery addresses /
            গ্রাহক তালিকা এবং ঠিকানা ব্যবস্থাপনা
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <Plus className="h-4 w-4" />
          <span>Add Customer</span>
          <span className="font-bangla font-medium">/ নতুন গ্রাহক</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total Customers / মোট গ্রাহক
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-emerald-700 uppercase tracking-wider">
            Active / সক্রিয়
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-800">{activeCount}</p>
        </div>
        <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-rose-700 uppercase tracking-wider">
            Inactive / নিষ্ক্রিয়
          </p>
          <p className="mt-1 text-2xl font-bold text-rose-800">{inactiveCount}</p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-blue-700 uppercase tracking-wider">
            Areas Covered / এলাকা
          </p>
          <p className="mt-1 text-2xl font-bold text-blue-800">
            {new Set(customers.map((c) => c.area)).size}
          </p>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or phone... / নাম বা ফোন দিয়ে খুঁজুন"
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

        {/* Filter Area & Status */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Area Selector */}
          <div className="relative min-w-[150px]">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              {AREAS.map((area) => (
                <option key={area.en} value={area.en}>
                  {area.en} ({area.bn})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400">
              <Filter className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Status Segmented Buttons */}
          <div className="inline-flex rounded-xl border border-gray-200 bg-gray-100 p-1 text-xs font-medium">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                statusFilter === "ALL"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All / সব
            </button>
            <button
              onClick={() => setStatusFilter("ACTIVE")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                statusFilter === "ACTIVE"
                  ? "bg-white text-emerald-700 font-semibold shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Active / সক্রিয়
            </button>
            <button
              onClick={() => setStatusFilter("INACTIVE")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                statusFilter === "INACTIVE"
                  ? "bg-white text-rose-700 font-semibold shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Inactive / নিষ্ক্রিয়
            </button>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <th className="px-6 py-4">Customer Name / নাম</th>
                <th className="px-6 py-4">Phone / ফোন</th>
                <th className="px-6 py-4">Address / ঠিকানা</th>
                <th className="px-6 py-4">Area / এলাকা</th>
                <th className="px-6 py-4 text-center">Total Orders / মোট অর্ডার</th>
                <th className="px-6 py-4 text-center">Status / অবস্থা</th>
                <th className="px-6 py-4 text-right">Actions / পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="group hover:bg-blue-50/40 transition-colors"
                  >
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm shadow-sm">
                          {customer.nameBn.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 font-bangla text-base">
                            {customer.nameBn}
                          </p>
                          <p className="text-xs text-gray-500 font-normal">
                            {customer.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-gray-700 font-medium font-mono text-xs">
                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                        <span>{customer.phone}</span>
                      </div>
                      {customer.altPhone && (
                        <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                          Alt: {customer.altPhone}
                        </p>
                      )}
                    </td>

                    {/* Address */}
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex items-start gap-1.5 text-gray-800">
                        <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span className="font-bangla leading-tight text-sm">
                          {customer.addressBn}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5 ml-5">
                        {customer.address}
                      </p>
                    </td>

                    {/* Area */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        <Building className="h-3 w-3 text-gray-500" />
                        <span className="font-bangla">{customer.areaBn}</span>
                        <span className="text-[10px] text-gray-400">({customer.area})</span>
                      </span>
                    </td>

                    {/* Total Orders */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                        <ShoppingBag className="h-3 w-3" />
                        <span>{customer.totalOrders}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {customer.isActive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          <span>Active / সক্রিয়</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                          <span>Inactive / নিষ্ক্রিয়</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(customer)}
                          title="Edit Customer"
                          className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingCustomerId(customer.id)}
                          title="Delete Customer"
                          className="rounded-lg p-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                /* Empty State */
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                      <User className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-900">
                      No customers found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 font-bangla">
                      কোন গ্রাহক খুঁজে পাওয়া যায়নি। অনুসন্ধান ফিল্টার পরিবর্তন করুন।
                    </p>
                    <div className="mt-5">
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedArea("All Areas");
                          setStatusFilter("ALL");
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      >
                        Reset Filters / ফিল্টার রিসেট করুন
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 bg-gray-50/50 px-6 py-3.5 sm:flex-row text-xs text-gray-500">
          <div>
            Showing <span className="font-semibold text-gray-800">{filteredCustomers.length}</span> of{" "}
            <span className="font-semibold text-gray-800">{customers.length}</span> customers
            {" "} (<span className="font-bangla">{customers.length} জনের মধ্যে {filteredCustomers.length} জন প্রদর্শিত</span>)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Real-time consumer directory / রিয়েল-টাইম গ্রাহক তালিকা</span>
          </div>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {(isAddModalOpen || editingCustomer) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editingCustomer ? "Edit Customer" : "Add New Customer"}
                </h3>
                <p className="text-xs text-gray-500 font-bangla">
                  {editingCustomer
                    ? "গ্রাহকের তথ্য হালনাগাদ করুন"
                    : "নতুন গ্রাহক নিবন্ধন করুন"}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingCustomer(null);
                }}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Kamal Hossain"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 font-bangla">
                    নাম (বাংলায়) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameBn}
                    onChange={(e) =>
                      setFormData({ ...formData, nameBn: e.target.value })
                    }
                    placeholder="যেমনঃ কামাল হোসেন"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="017XX-XXXXXX"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    Alternative Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.altPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, altPhone: e.target.value })
                    }
                    placeholder="Optional / ঐচ্ছিক"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Area / এলাকা *
                </label>
                <select
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {AREAS.filter((a) => a.en !== "All Areas").map((a) => (
                    <option key={a.en} value={a.en}>
                      {a.en} - {a.bn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 font-bangla">
                  ঠিকানা (বাংলায়) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.addressBn}
                  onChange={(e) =>
                    setFormData({ ...formData, addressBn: e.target.value })
                  }
                  placeholder="যেমনঃ বাড়ি ১২, রোড ২৭, ধানমন্ডি"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bangla"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Address (English)
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="e.g. House 12, Road 27, Dhanmondi"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Special Notes / বিশেষ বিবরণ
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="e.g. Floor 4, elevator available, customer requests 12KG"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="isActive"
                  className="text-xs font-medium text-gray-700"
                >
                  Active Consumer / সক্রিয় গ্রাহক হিসেবে চিহ্নিত করুন
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingCustomer(null);
                  }}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel / বাতিল
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  {editingCustomer ? "Update / সংরক্ষণ" : "Save / যুক্ত করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCustomerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Delete Customer / গ্রাহক মুছুন
                </h3>
                <p className="text-xs text-gray-500 font-bangla">
                  আপনি কি নিশ্চিত যে এই গ্রাহককে মুছে ফেলতে চান?
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-600">
              This action cannot be undone. All customer profile references and delivery history will be archived.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeletingCustomerId(null)}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel / বাতিল
              </button>
              <button
                onClick={handleConfirmDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Delete / নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
