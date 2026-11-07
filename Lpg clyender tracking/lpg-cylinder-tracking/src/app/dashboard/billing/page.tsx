"use client";

import React, { useState } from "react";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  orderId: string;
  customerName: string;
  customerNameEn: string;
  customerPhone: string;
  customerArea: string;
  date: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: "PAID" | "PARTIAL" | "DUE";
  paymentMethod: string;
  items: InvoiceItem[];
}

const initialInvoices: Invoice[] = [
  {
    id: "INV-2024-001",
    orderId: "ORD-00045",
    customerName: "কামাল হোসেন",
    customerNameEn: "Kamal Hossain",
    customerPhone: "01712-345678",
    customerArea: "মিরপুর-১০, ঢাকা",
    date: "2024-10-15",
    dueDate: "2024-10-15",
    totalAmount: 2400,
    paidAmount: 2400,
    dueAmount: 0,
    status: "PAID",
    paymentMethod: "bKash",
    items: [
      { description: "12 KG LPG Refill (Bashundhara)", quantity: 2, unitPrice: 1200, total: 2400 },
    ],
  },
  {
    id: "INV-2024-002",
    orderId: "ORD-00044",
    customerName: "রহিম উদ্দিন",
    customerNameEn: "Rahim Uddin",
    customerPhone: "01819-876543",
    customerArea: "উত্তরা সেক্টর ৭, ঢাকা",
    date: "2024-10-14",
    dueDate: "2024-10-21",
    totalAmount: 3200,
    paidAmount: 2000,
    dueAmount: 1200,
    status: "PARTIAL",
    paymentMethod: "Cash",
    items: [
      { description: "25 KG LPG Refill (Omera)", quantity: 1, unitPrice: 3200, total: 3200 },
    ],
  },
  {
    id: "INV-2024-003",
    orderId: "ORD-00043",
    customerName: "ফাতেমা খানম",
    customerNameEn: "Fatema Khanam",
    customerPhone: "01911-223344",
    customerArea: "ধানমন্ডি ২৭, ঢাকা",
    date: "2024-10-14",
    dueDate: "2024-10-17",
    totalAmount: 3600,
    paidAmount: 0,
    dueAmount: 3600,
    status: "DUE",
    paymentMethod: "Pending",
    items: [
      { description: "12 KG LPG Refill (Beximco)", quantity: 3, unitPrice: 1200, total: 3600 },
    ],
  },
  {
    id: "INV-2024-004",
    orderId: "ORD-00042",
    customerName: "আব্দুল করিম",
    customerNameEn: "Abdul Karim",
    customerPhone: "01678-901234",
    customerArea: "গুলশান-২, ঢাকা",
    date: "2024-10-13",
    dueDate: "2024-10-13",
    totalAmount: 5500,
    paidAmount: 5500,
    dueAmount: 0,
    status: "PAID",
    paymentMethod: "Nagad",
    items: [
      { description: "45 KG Commercial LPG (Jamuna)", quantity: 1, unitPrice: 5500, total: 5500 },
    ],
  },
  {
    id: "INV-2024-005",
    orderId: "ORD-00041",
    customerName: "নাসরিন আক্তার",
    customerNameEn: "Nasrin Akter",
    customerPhone: "01552-334455",
    customerArea: "মোহাম্মদপুর, ঢাকা",
    date: "2024-10-13",
    dueDate: "2024-10-13",
    totalAmount: 1200,
    paidAmount: 1200,
    dueAmount: 0,
    status: "PAID",
    paymentMethod: "Cash",
    items: [
      { description: "5 KG Small LPG (TotalGaz)", quantity: 2, unitPrice: 600, total: 1200 },
    ],
  },
  {
    id: "INV-2024-006",
    orderId: "ORD-00040",
    customerName: "মেসার্স ভাই ভাই এন্টারপ্রাইজ",
    customerNameEn: "Bhai Bhai Enterprise",
    customerPhone: "01730-112233",
    customerArea: "তেজগাঁও শিল্প এলাকা, ঢাকা",
    date: "2024-10-12",
    dueDate: "2024-10-25",
    totalAmount: 24000,
    paidAmount: 10000,
    dueAmount: 14000,
    status: "PARTIAL",
    paymentMethod: "bKash",
    items: [
      { description: "12 KG LPG Refill (Bashundhara)", quantity: 15, unitPrice: 1200, total: 18000 },
      { description: "New Cylinder Deposit (Bashundhara 12KG)", quantity: 3, unitPrice: 2000, total: 6000 },
    ],
  },
  {
    id: "INV-2024-007",
    orderId: "ORD-00039",
    customerName: "মোশাররফ হোসেন",
    customerNameEn: "Mosharraf Hossain",
    customerPhone: "01844-556677",
    customerArea: "মালিবাগ রেলগেট, ঢাকা",
    date: "2024-10-11",
    dueDate: "2024-10-18",
    totalAmount: 8800,
    paidAmount: 4000,
    dueAmount: 4800,
    status: "PARTIAL",
    paymentMethod: "Cash",
    items: [
      { description: "12 KG LPG Refill (Omera)", quantity: 4, unitPrice: 1200, total: 4800 },
      { description: "25 KG LPG Refill (Omera)", quantity: 1, unitPrice: 4000, total: 4000 },
    ],
  },
  {
    id: "INV-2024-008",
    orderId: "ORD-00038",
    customerName: "রফিকুল ইসলাম",
    customerNameEn: "Rafiqul Islam",
    customerPhone: "01923-998877",
    customerArea: "বাড্ডা, ঢাকা",
    date: "2024-10-10",
    dueDate: "2024-10-15",
    totalAmount: 4200,
    paidAmount: 0,
    dueAmount: 4200,
    status: "DUE",
    paymentMethod: "Pending",
    items: [
      { description: "12 KG LPG Refill (Beximco)", quantity: 2, unitPrice: 1200, total: 2400 },
      { description: "Gas Regulator & High Pressure Hose", quantity: 1, unitPrice: 1800, total: 1800 },
    ],
  },
];

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Payment Recording Modal State
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [trxId, setTrxId] = useState<string>("");
  const [paymentNote, setPaymentNote] = useState<string>("");

  // Print Invoice Modal State
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);

  // Success Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus =
      statusFilter === "ALL" || inv.status === statusFilter;
    const matchesSearch =
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.includes(searchQuery) ||
      inv.customerNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerPhone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  // Summary statistics
  const totalRevenue = invoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalDue = invoices.reduce((acc, curr) => acc + curr.dueAmount, 0);
  const thisMonthRevenue = 128400; // Demo calculated current month

  // Handle opening payment modal
  const handleOpenPaymentModal = (invoice: Invoice) => {
    setPaymentModalInvoice(invoice);
    setPaymentAmount(invoice.dueAmount);
    setPaymentMethod("Cash");
    setTrxId("");
    setPaymentNote("");
  };

  // Submit payment
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice || paymentAmount <= 0) return;

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== paymentModalInvoice.id) return inv;

        const newPaid = Math.min(inv.totalAmount, inv.paidAmount + paymentAmount);
        const newDue = Math.max(0, inv.totalAmount - newPaid);
        const newStatus =
          newDue === 0 ? "PAID" : newPaid > 0 ? "PARTIAL" : "DUE";

        return {
          ...inv,
          paidAmount: newPaid,
          dueAmount: newDue,
          status: newStatus,
          paymentMethod: paymentMethod,
        };
      })
    );

    showToast(
      `পেমেন্ট সফলভাবে সংরক্ষিত হয়েছে (৳ ${paymentAmount.toLocaleString()} via ${paymentMethod})`
    );
    setPaymentModalInvoice(null);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-white shadow-lg transition-all animate-bounce">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
            <span className="text-xl font-bold text-gray-400">/</span>
            <span className="text-2xl font-bold text-blue-600 font-bangla">বিলিং ও চালান</span>
          </div>
          <p className="mt-1 text-sm text-gray-500 font-bangla">
            ইনভয়েস তৈরি, গ্রাহকের বকেয়া ও পেমেন্ট রেকর্ড ব্যবস্থাপনা করুন
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (invoices.length > 0) setPrintInvoice(invoices[0]);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Sample / নমুনা প্রিন্ট
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-800">
                Total Revenue
              </p>
              <p className="text-xs text-blue-600 font-bangla">মোট আয়</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                ৳ {totalRevenue.toLocaleString()}
              </p>
              <span className="mt-1 inline-flex items-center text-xs font-medium text-blue-700">
                ↑ +8.4% from last month
              </span>
            </div>
            <div className="rounded-xl bg-blue-600 p-3 text-white shadow-sm">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Collected */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Total Collected
              </p>
              <p className="text-xs text-emerald-600 font-bangla">মোট সংগৃহীত</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                ৳ {totalCollected.toLocaleString()}
              </p>
              <span className="mt-1 inline-flex items-center text-xs font-medium text-emerald-700">
                ● {((totalCollected / totalRevenue) * 100).toFixed(1)}% Collection Rate
              </span>
            </div>
            <div className="rounded-xl bg-emerald-600 p-3 text-white shadow-sm">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Due */}
        <div className="rounded-xl border border-red-100 bg-red-50/70 p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-red-800">
                Total Due
              </p>
              <p className="text-xs text-red-600 font-bangla">মোট বকেয়া</p>
              <p className="mt-2 text-2xl font-bold text-red-600">
                ৳ {totalDue.toLocaleString()}
              </p>
              <span className="mt-1 inline-flex items-center text-xs font-medium text-red-600">
                ⚠️ {invoices.filter((i) => i.dueAmount > 0).length} Invoices pending
              </span>
            </div>
            <div className="rounded-xl bg-red-600 p-3 text-white shadow-sm">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* This Month Revenue */}
        <div className="rounded-xl border border-purple-100 bg-purple-50/70 p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-800">
                This Month Revenue
              </p>
              <p className="text-xs text-purple-600 font-bangla">চলতি মাসের আয়</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                ৳ {thisMonthRevenue.toLocaleString()}
              </p>
              <span className="mt-1 inline-flex items-center text-xs font-medium text-purple-700">
                📅 October 2024
              </span>
            </div>
            <div className="rounded-xl bg-purple-600 p-3 text-white shadow-sm">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
                statusFilter === "ALL"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All / সব ({invoices.length})
            </button>
            <button
              onClick={() => setStatusFilter("PAID")}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
                statusFilter === "PAID"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              PAID / পরিশোধিত ({invoices.filter((i) => i.status === "PAID").length})
            </button>
            <button
              onClick={() => setStatusFilter("PARTIAL")}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
                statusFilter === "PARTIAL"
                  ? "bg-yellow-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              PARTIAL / আংশিক ({invoices.filter((i) => i.status === "PARTIAL").length})
            </button>
            <button
              onClick={() => setStatusFilter("DUE")}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
                statusFilter === "DUE"
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              DUE / বকেয়া ({invoices.filter((i) => i.status === "DUE").length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search invoice, customer, order... / খুঁজুন"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bangla"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <th className="px-5 py-3.5">Invoice #</th>
                <th className="px-5 py-3.5">Order #</th>
                <th className="px-5 py-3.5">Customer / গ্রাহক</th>
                <th className="px-5 py-3.5 text-right">Total (৳)</th>
                <th className="px-5 py-3.5 text-right">Paid (৳)</th>
                <th className="px-5 py-3.5 text-right">Due (৳)</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-center">Actions / পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500 font-bangla">
                    কোন ইনভয়েস পাওয়া যায়নি (No invoices found)
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-blue-50/40 transition-colors">
                    {/* Invoice ID */}
                    <td className="px-5 py-4 font-mono font-medium text-blue-600">
                      {inv.id}
                      <p className="text-[11px] text-gray-400 font-sans">{inv.date}</p>
                    </td>

                    {/* Order ID */}
                    <td className="px-5 py-4 font-mono text-xs text-gray-700">
                      <span className="rounded bg-gray-100 px-2 py-1 text-gray-800">
                        {inv.orderId}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="font-bangla font-semibold text-gray-900">
                        {inv.customerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {inv.customerPhone} • {inv.customerArea}
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="px-5 py-4 text-right font-medium text-gray-900">
                      ৳ {inv.totalAmount.toLocaleString()}
                    </td>

                    {/* Paid Amount */}
                    <td className="px-5 py-4 text-right font-medium text-emerald-600">
                      ৳ {inv.paidAmount.toLocaleString()}
                    </td>

                    {/* Due Amount */}
                    <td className="px-5 py-4 text-right font-medium">
                      <span
                        className={
                          inv.dueAmount > 0
                            ? "font-semibold text-red-600"
                            : "text-gray-400"
                        }
                      >
                        ৳ {inv.dueAmount.toLocaleString()}
                      </span>
                    </td>

                    {/* Payment Status Badge */}
                    <td className="px-5 py-4 text-center">
                      {inv.status === "PAID" && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                          PAID
                        </span>
                      )}
                      {inv.status === "PARTIAL" && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-yellow-200 bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-600"></span>
                          PARTIAL
                        </span>
                      )}
                      {inv.status === "DUE" && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                          DUE
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {inv.dueAmount > 0 && (
                          <button
                            onClick={() => handleOpenPaymentModal(inv)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 transition"
                            title="Record Payment / পেমেন্ট রেকর্ড"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Record Payment
                          </button>
                        )}

                        <button
                          onClick={() => setPrintInvoice(inv)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition shadow-sm"
                          title="Print Invoice / ইনভয়েস প্রিন্ট"
                        >
                          <svg className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                          Print
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer info */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-5 py-3 text-xs text-gray-500">
          <div>
            Showing <span className="font-semibold">{filteredInvoices.length}</span> of{" "}
            <span className="font-semibold">{invoices.length}</span> Invoices
          </div>
          <div className="font-bangla">
            মোট বকেয়া তালিকাভুক্ত: <span className="font-bold text-red-600">৳ {totalDue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-emerald-600 px-6 py-4 text-white">
              <div>
                <h3 className="text-lg font-bold">Record Payment / পেমেন্ট গ্রহণ</h3>
                <p className="text-xs text-emerald-100 font-bangla">
                  ইনভয়েস #{paymentModalInvoice.id} • {paymentModalInvoice.customerName}
                </p>
              </div>
              <button
                onClick={() => setPaymentModalInvoice(null)}
                className="rounded-lg p-1 text-emerald-100 hover:bg-emerald-700 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleRecordPayment} className="p-6 space-y-5">
              {/* Invoice Summary Row */}
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-gray-50 p-3 text-center border border-gray-200">
                <div>
                  <span className="text-[11px] text-gray-500">Total Bill</span>
                  <p className="text-sm font-bold text-gray-900">৳ {paymentModalInvoice.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500">Already Paid</span>
                  <p className="text-sm font-bold text-emerald-600">৳ {paymentModalInvoice.paidAmount.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[11px] text-red-500 font-medium">Current Due</span>
                  <p className="text-sm font-bold text-red-600">৳ {paymentModalInvoice.dueAmount.toLocaleString()}</p>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Payment Method / পেমেন্ট মাধ্যম
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Cash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Cash")}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition ${
                      paymentMethod === "Cash"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold ring-2 ring-emerald-500"
                        : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="text-xl">💵</span>
                    <span className="mt-1 text-xs">Cash / নগদ</span>
                  </button>

                  {/* bKash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bKash")}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition ${
                      paymentMethod === "bKash"
                        ? "border-pink-600 bg-pink-50 text-pink-800 font-semibold ring-2 ring-pink-500"
                        : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="text-xl">📱</span>
                    <span className="mt-1 text-xs">bKash / বিকাশ</span>
                  </button>

                  {/* Nagad */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Nagad")}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition ${
                      paymentMethod === "Nagad"
                        ? "border-orange-600 bg-orange-50 text-orange-800 font-semibold ring-2 ring-orange-500"
                        : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="text-xl">💳</span>
                    <span className="mt-1 text-xs">Nagad / নগদ</span>
                  </button>
                </div>
              </div>

              {/* Amount to pay */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Payment Amount / জমার পরিমাণ (৳)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 font-bold">৳</span>
                  <input
                    type="number"
                    max={paymentModalInvoice.dueAmount}
                    min={1}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    required
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-4 text-base font-bold text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs text-gray-500 font-bangla">
                  <span>সর্বোচ্চ গ্রহণীয়: ৳ {paymentModalInvoice.dueAmount.toLocaleString()}</span>
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(paymentModalInvoice.dueAmount)}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Pay Full Due / সম্পূর্ণ পরিশোধ
                  </button>
                </div>
              </div>

              {/* TrxID for Digital */}
              {(paymentMethod === "bKash" || paymentMethod === "Nagad") && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Transaction ID / TrxID (লেনদেন নম্বর)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BK89X002A1"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase font-mono"
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Payment Note / মন্তব্য (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paid at store counter / দোকানে পরিশোধ"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bangla"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel / বাতিল
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm Payment / নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Invoice Modal */}
      {printInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden my-8">
            {/* Top Modal Controls */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-800 px-6 py-3 text-white">
              <span className="text-sm font-medium">Invoice Preview / চালান প্রিভিউ</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print / প্রিন্ট করুন
                </button>
                <button
                  onClick={() => setPrintInvoice(null)}
                  className="rounded-lg p-1 text-gray-300 hover:text-white transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Area */}
            <div className="p-8 print:p-0 font-sans" id="printable-invoice">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-gray-200 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg">
                      LPG
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-gray-900 tracking-tight">
                        LPG TRACKER DISTRIBUTOR
                      </h2>
                      <p className="text-xs text-gray-600 font-bangla font-semibold">
                        মেসার্স বিসমিল্লাহ্ গ্যাস ডিস্ট্রিবিউটর
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    House 42, Road 11, Mirpur-10, Dhaka-1216 <br />
                    Phone: 01700-123456 • Bin: 001928374-0101
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block rounded-md bg-blue-50 px-3 py-1 font-mono text-sm font-bold text-blue-700 border border-blue-200">
                    {printInvoice.id}
                  </span>
                  <p className="mt-2 text-xs text-gray-500">
                    Order Ref: <span className="font-semibold">{printInvoice.orderId}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Date: <span className="font-semibold">{printInvoice.date}</span>
                  </p>
                  <div className="mt-2">
                    {printInvoice.status === "PAID" && (
                      <span className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800">
                        PAID / পরিশোধিত
                      </span>
                    )}
                    {printInvoice.status === "PARTIAL" && (
                      <span className="inline-block rounded bg-yellow-100 px-2 py-0.5 text-xs font-bold text-yellow-800">
                        PARTIAL / আংশিক
                      </span>
                    )}
                    {printInvoice.status === "DUE" && (
                      <span className="inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800">
                        DUE / বকেয়া
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div className="mt-6 rounded-lg bg-gray-50 p-4 border border-gray-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Bill To / গ্রাহকের বিবরণ
                </span>
                <div className="mt-1 flex flex-col sm:flex-row sm:justify-between">
                  <div>
                    <h4 className="font-bangla font-bold text-base text-gray-900">
                      {printInvoice.customerName} ({printInvoice.customerNameEn})
                    </h4>
                    <p className="text-xs text-gray-600 font-bangla">{printInvoice.customerArea}</p>
                    <p className="text-xs text-gray-600">Mobile: {printInvoice.customerPhone}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 text-left sm:text-right">
                    <span className="text-xs text-gray-500">Payment Mode:</span>
                    <p className="text-xs font-bold text-gray-800">{printInvoice.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mt-6">
                <table className="w-full text-left text-xs border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-2.5">#</th>
                      <th className="px-4 py-2.5">Item & Description / বিবরণ</th>
                      <th className="px-4 py-2.5 text-center">Qty</th>
                      <th className="px-4 py-2.5 text-right">Unit Price</th>
                      <th className="px-4 py-2.5 text-right">Total (৳)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {printInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {item.description}
                        </td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">৳ {item.unitPrice.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-semibold">
                          ৳ {item.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Calculation */}
              <div className="mt-6 flex justify-end">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-100 text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold">৳ {printInvoice.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100 text-gray-600">
                    <span>Delivery Charge:</span>
                    <span className="font-semibold">৳ 0</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-sm font-bold text-gray-900 border-b border-gray-200">
                    <span>Total Amount (মোট):</span>
                    <span>৳ {printInvoice.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 text-emerald-700 font-semibold">
                    <span>Paid (পরিশোধিত):</span>
                    <span>৳ {printInvoice.paidAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 text-red-600 font-bold border-t border-gray-200 pt-1">
                    <span>Due Amount (বকেয়া):</span>
                    <span>৳ {printInvoice.dueAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Footer Terms & Signature */}
              <div className="mt-12 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4 items-end text-xs text-gray-500">
                <div>
                  <p className="font-semibold text-gray-700">শর্তাবলী / Terms:</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] font-bangla text-gray-500">
                    <li>খালি সিলিন্ডার নিরাপদে হস্তান্তর করুন।</li>
                    <li>সিলিন্ডারের কোনো লিকেজ বা ক্রুটি থাকলে সাথে সাথে জানান।</li>
                  </ul>
                </div>
                <div className="text-right">
                  <div className="inline-block border-t border-gray-400 pt-1 px-8 text-center text-xs text-gray-600 font-bangla">
                    অনুমোদিত স্বাক্ষর (Authorized Signature)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
