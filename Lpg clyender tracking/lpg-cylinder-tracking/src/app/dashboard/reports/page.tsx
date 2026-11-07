"use client";

import React, { useState } from "react";

interface MonthlyData {
  month: string;
  monthBn: string;
  revenue: number;
  orders: number;
  target: number;
}

interface StockOverview {
  size: string;
  sizeBn: string;
  full: number;
  inUse: number;
  empty: number;
  damaged: number;
  total: number;
}

interface CustomerDue {
  rank: number;
  name: string;
  nameEn: string;
  phone: string;
  area: string;
  pendingOrders: number;
  lastOrderDate: string;
  dueAmount: number;
}

export default function ReportsPage() {
  // Date range filters
  const [fromDate, setFromDate] = useState<string>("2024-10-01");
  const [toDate, setToDate] = useState<string>("2024-10-15");
  const [quickRange, setQuickRange] = useState<string>("this-month");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleQuickRange = (range: string) => {
    setQuickRange(range);
    const today = "2024-10-15";
    if (range === "today") {
      setFromDate(today);
      setToDate(today);
    } else if (range === "last-7-days") {
      setFromDate("2024-10-08");
      setToDate(today);
    } else if (range === "this-month") {
      setFromDate("2024-10-01");
      setToDate(today);
    } else if (range === "last-30-days") {
      setFromDate("2024-09-15");
      setToDate(today);
    }
  };

  // Demo Monthly Trend
  const monthlyData: MonthlyData[] = [
    { month: "May", monthBn: "মে", revenue: 320000, orders: 180, target: 300000 },
    { month: "Jun", monthBn: "জুন", revenue: 385000, orders: 215, target: 350000 },
    { month: "Jul", monthBn: "জুলাই", revenue: 410000, orders: 230, target: 400000 },
    { month: "Aug", monthBn: "আগস্ট", revenue: 395000, orders: 220, target: 400000 },
    { month: "Sep", monthBn: "সেপ্টেম্বর", revenue: 460000, orders: 255, target: 450000 },
    { month: "Oct (MTD)", monthBn: "অক্টোবর", revenue: 512000, orders: 290, target: 500000 },
  ];

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  // Demo Stock Overview
  const stockData: StockOverview[] = [
    {
      size: "5 KG",
      sizeBn: "৫ কেজি",
      full: 45,
      inUse: 32,
      empty: 18,
      damaged: 2,
      total: 97,
    },
    {
      size: "12 KG",
      sizeBn: "১২ কেজি",
      full: 210,
      inUse: 185,
      empty: 75,
      damaged: 8,
      total: 478,
    },
    {
      size: "25 KG",
      sizeBn: "২৫ কেজি",
      full: 55,
      inUse: 42,
      empty: 22,
      damaged: 3,
      total: 122,
    },
    {
      size: "45 KG",
      sizeBn: "৪৫ কেজি",
      full: 28,
      inUse: 34,
      empty: 14,
      damaged: 1,
      total: 77,
    },
  ];

  // Demo Top 5 Customer Dues
  const topDues: CustomerDue[] = [
    {
      rank: 1,
      name: "মেসার্স ভাই ভাই এন্টারপ্রাইজ",
      nameEn: "Bhai Bhai Enterprise",
      phone: "01730-112233",
      area: "তেজগাঁও শিল্প এলাকা",
      pendingOrders: 3,
      lastOrderDate: "2024-10-12",
      dueAmount: 14000,
    },
    {
      rank: 2,
      name: "মোশাররফ হোসেন",
      nameEn: "Mosharraf Hossain",
      phone: "01844-556677",
      area: "মালিবাগ রেলগেট",
      pendingOrders: 2,
      lastOrderDate: "2024-10-11",
      dueAmount: 4800,
    },
    {
      rank: 3,
      name: "রফিকুল ইসলাম",
      nameEn: "Rafiqul Islam",
      phone: "01923-998877",
      area: "বাড্ডা প্রগতি সরণি",
      pendingOrders: 1,
      lastOrderDate: "2024-10-10",
      dueAmount: 4200,
    },
    {
      rank: 4,
      name: "ফাতেমা খানম",
      nameEn: "Fatema Khanam",
      phone: "01911-223344",
      area: "ধানমন্ডি ২৭",
      pendingOrders: 1,
      lastOrderDate: "2024-10-14",
      dueAmount: 3600,
    },
    {
      rank: 5,
      name: "গ্রীন ভিউ রেস্তোরাঁ",
      nameEn: "Green View Restaurant",
      phone: "01611-778899",
      area: "গুলশান-১",
      pendingOrders: 2,
      lastOrderDate: "2024-10-09",
      dueAmount: 3100,
    },
  ];

  const handleExport = (format: "Excel" | "PDF") => {
    showToast(
      `রিপোর্ট ${format} আকারে ডাউনলোড হচ্ছে... (${format} Export generated successfully)`
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-white shadow-xl animate-fade-in">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header with Title and Export Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <span className="text-xl font-bold text-gray-400">/</span>
            <span className="text-2xl font-bold text-blue-600 font-bangla">রিপোর্ট ও বিশ্লেষণ</span>
          </div>
          <p className="mt-1 text-sm text-gray-500 font-bangla">
            দৈনিক বিক্রয়, সিলিন্ডার স্টক অবস্থা ও বকেয়া বিশ্লেষণের সম্পূর্ণ চিত্র
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleExport("Excel")}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50 transition"
          >
            <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Excel / এক্সেল
          </button>
          <button
            onClick={() => handleExport("PDF")}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Export PDF / পিডিএফ
          </button>
        </div>
      </div>

      {/* Date Range Picker Filter Bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-500 mr-1 font-bangla">সময়কাল:</span>
            {[
              { id: "today", label: "Today / আজ" },
              { id: "last-7-days", label: "Last 7 Days / ৭ দিন" },
              { id: "this-month", label: "This Month / এই মাস" },
              { id: "last-30-days", label: "Last 30 Days / ৩০ দিন" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handleQuickRange(p.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  quickRange === p.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Date inputs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-medium text-gray-500 font-bangla">হতে (From):</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs text-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <span className="text-gray-400">-</span>
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-medium text-gray-500 font-bangla">পর্যন্ত (To):</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs text-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => showToast(`তারিখ অনুযায়ী ফিল্টার প্রয়োগ করা হয়েছে (${fromDate} হতে ${toDate})`)}
              className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 transition"
            >
              Apply / ফিল্টার
            </button>
          </div>
        </div>
      </div>

      {/* 1. Daily Sales Summary Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            1. Daily Sales Summary <span className="text-sm font-normal text-gray-500 font-bangla">/ দৈনিক বিক্রয় সারাংশ</span>
          </h2>
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            📅 {fromDate} - {toDate}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total Orders */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total Orders
              </span>
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">28</p>
            <p className="mt-1 text-xs text-gray-500 font-bangla">মোট অর্ডার সম্পন্ন</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span>↑ +14.2%</span>
              <span className="text-gray-400">vs yesterday</span>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total Revenue
              </span>
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-emerald-600">৳ 48,500</p>
            <p className="mt-1 text-xs text-gray-500 font-bangla">মোট বিক্রয় মূল্য</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span>↑ ৳ 6,200</span>
              <span className="text-gray-400">above daily average</span>
            </div>
          </div>

          {/* Avg Order Value */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Avg Order Value
              </span>
              <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">৳ 1,732</p>
            <p className="mt-1 text-xs text-gray-500 font-bangla">গড় অর্ডার মূল্য</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-600 font-medium">
              <span>~ 1.4 Cylinders</span>
              <span className="text-gray-400">per customer</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Monthly Sales Trend (Div-based Bar Chart) */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              2. Monthly Sales Trend
            </h2>
            <p className="text-xs text-gray-500 font-bangla">
              বিগত ৬ মাসের বিক্রয় ও আয়ের গ্রাফ (Revenue vs Target)
            </p>
          </div>
          <div className="mt-3 sm:mt-0 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-blue-600"></span>
              <span className="text-gray-600">Actual Revenue (আসল আয়)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1 w-3 border-t-2 border-dashed border-emerald-500"></span>
              <span className="text-gray-600">Target (লক্ষ্যমাত্রা)</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Container */}
        <div className="mt-8 pt-4">
          <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-64 border-b border-gray-200 pb-2">
            {monthlyData.map((d, index) => {
              const heightPercent = Math.round((d.revenue / maxRevenue) * 100);
              const isLatest = index === monthlyData.length - 1;

              return (
                <div key={d.month} className="group relative flex flex-col items-center h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-14 hidden group-hover:flex flex-col items-center z-10">
                    <div className="rounded-md bg-gray-900 px-2 py-1 text-[11px] font-medium text-white shadow-lg whitespace-nowrap">
                      ৳ {d.revenue.toLocaleString()} ({d.orders} orders)
                    </div>
                    <div className="h-1 w-2 border-x-4 border-t-4 border-x-transparent border-t-gray-900"></div>
                  </div>

                  {/* Revenue value label */}
                  <span className="mb-2 text-[10px] sm:text-xs font-bold text-gray-700">
                    ৳{(d.revenue / 1000).toFixed(0)}k
                  </span>

                  {/* Bar */}
                  <div className="w-full max-w-[48px] bg-blue-100 rounded-t-lg relative flex flex-col justify-end overflow-hidden" style={{ height: "100%" }}>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isLatest
                          ? "bg-gradient-to-t from-blue-700 to-blue-500 ring-2 ring-blue-400"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  {/* Month Label */}
                  <div className="mt-3 text-center">
                    <p className="text-xs font-bold text-gray-800">{d.month}</p>
                    <p className="text-[10px] text-gray-400 font-bangla">{d.monthBn}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>* অক্টোবর মাসের তথ্য এখন পর্যন্ত চলমান (Month-to-date)</span>
            <span className="font-semibold text-emerald-600">
              সর্বোচ্চ অর্জন: অক্টোবর ৳ ৫,১২,০০০ (Target 102.4%)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Cylinder Stock Overview Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              3. Cylinder Stock Overview
            </h2>
            <p className="text-xs text-gray-500 font-bangla">
              সিলিন্ডার আকার ও অবস্থা অনুযায়ী স্টক বিবরণী
            </p>
          </div>
          {/* Status color legend */}
          <div className="mt-3 sm:mt-0 flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-gray-600">Full / পূর্ণ গ্যাস</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span className="text-gray-600">In-Use / গ্রাহকের কাছে</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
              <span className="text-gray-600">Empty / খালি</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="text-gray-600">Damaged / ত্রুটিপূর্ণ</span>
            </span>
          </div>
        </div>

        {/* Stock Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stockData.map((item) => {
            const fullPct = ((item.full / item.total) * 100).toFixed(1);
            const inUsePct = ((item.inUse / item.total) * 100).toFixed(1);
            const emptyPct = ((item.empty / item.total) * 100).toFixed(1);
            const damagedPct = ((item.damaged / item.total) * 100).toFixed(1);

            return (
              <div
                key={item.size}
                className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-gray-900">{item.size}</span>
                    <span className="ml-2 text-xs font-semibold text-blue-600 font-bangla">
                      ({item.sizeBn})
                    </span>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-gray-700 border border-gray-200">
                    Total: {item.total} Units
                  </span>
                </div>

                {/* Progress Stack */}
                <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    style={{ width: `${fullPct}%` }}
                    className="bg-emerald-500 transition-all"
                    title={`Full: ${item.full} (${fullPct}%)`}
                  />
                  <div
                    style={{ width: `${inUsePct}%` }}
                    className="bg-blue-500 transition-all"
                    title={`In Use: ${item.inUse} (${inUsePct}%)`}
                  />
                  <div
                    style={{ width: `${emptyPct}%` }}
                    className="bg-gray-400 transition-all"
                    title={`Empty: ${item.empty} (${emptyPct}%)`}
                  />
                  <div
                    style={{ width: `${damagedPct}%` }}
                    className="bg-red-500 transition-all"
                    title={`Damaged: ${item.damaged} (${damagedPct}%)`}
                  />
                </div>

                {/* Metric counters */}
                <div className="grid grid-cols-4 gap-2 text-center pt-1">
                  <div className="rounded-lg bg-white p-2 border border-emerald-100 shadow-2xs">
                    <span className="text-[10px] text-emerald-700 font-semibold uppercase">Full</span>
                    <p className="text-sm font-bold text-emerald-800">{item.full}</p>
                    <span className="text-[10px] text-gray-400">{fullPct}%</span>
                  </div>
                  <div className="rounded-lg bg-white p-2 border border-blue-100 shadow-2xs">
                    <span className="text-[10px] text-blue-700 font-semibold uppercase">In Use</span>
                    <p className="text-sm font-bold text-blue-800">{item.inUse}</p>
                    <span className="text-[10px] text-gray-400">{inUsePct}%</span>
                  </div>
                  <div className="rounded-lg bg-white p-2 border border-gray-200 shadow-2xs">
                    <span className="text-[10px] text-gray-600 font-semibold uppercase">Empty</span>
                    <p className="text-sm font-bold text-gray-800">{item.empty}</p>
                    <span className="text-[10px] text-gray-400">{emptyPct}%</span>
                  </div>
                  <div className="rounded-lg bg-white p-2 border border-red-100 shadow-2xs">
                    <span className="text-[10px] text-red-700 font-semibold uppercase">Damaged</span>
                    <p className="text-sm font-bold text-red-800">{item.damaged}</p>
                    <span className="text-[10px] text-gray-400">{damagedPct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: 4. Customer Dues & 5. Delivery Performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 4. Customer Dues List (Top 5) */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  4. Top Customer Dues
                </h2>
                <p className="text-xs text-gray-500 font-bangla">
                  সর্বাধিক বকেয়া থাকা শীর্ষ ৫ গ্রাহকের তালিকা
                </p>
              </div>
              <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 border border-red-200">
                Top 5
              </span>
            </div>

            {/* Dues List */}
            <div className="mt-4 divide-y divide-gray-100">
              {topDues.map((cust) => (
                <div
                  key={cust.rank}
                  className="py-3 flex items-center justify-between hover:bg-gray-50 px-2 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        cust.rank === 1
                          ? "bg-red-600 text-white"
                          : cust.rank === 2
                          ? "bg-amber-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {cust.rank}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 font-bangla">
                        {cust.name}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        {cust.phone} • {cust.area}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-sm font-bold text-red-600">
                        ৳ {cust.dueAmount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {cust.pendingOrders} Orders due
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        showToast(
                          `${cust.name}-এর কাছে SMS তাগাদা পাঠানো হয়েছে (${cust.phone})`
                        )
                      }
                      className="rounded bg-gray-100 p-1.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
                      title="Send SMS Reminder / তাগাদা পাঠান"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>শীর্ষ ৫ গ্রাহকের মোট বকেয়া:</span>
            <span className="font-bold text-red-600">
              ৳ {topDues.reduce((a, b) => a + b.dueAmount, 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* 5. Delivery Performance Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  5. Delivery Performance
                </h2>
                <p className="text-xs text-gray-500 font-bangla">
                  ডেলিভারি গতি ও সময়ানুবর্তিতা বিশ্লেষণ
                </p>
              </div>
              <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                High Efficiency
              </span>
            </div>

            {/* Top 3 Metric Badges */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-blue-50/70 p-3.5 border border-blue-100 text-center">
                <span className="text-[11px] font-semibold text-blue-700 uppercase">
                  Total Deliveries
                </span>
                <p className="mt-1 text-2xl font-black text-gray-900">156</p>
                <span className="text-[10px] text-gray-500 font-bangla">মোট ডেলিভারি</span>
              </div>

              <div className="rounded-xl bg-emerald-50/70 p-3.5 border border-emerald-100 text-center">
                <span className="text-[11px] font-semibold text-emerald-700 uppercase">
                  On-Time Rate
                </span>
                <p className="mt-1 text-2xl font-black text-emerald-700">94.2%</p>
                <span className="text-[10px] text-gray-500 font-bangla">সময়মত সম্পন্ন</span>
              </div>

              <div className="rounded-xl bg-amber-50/70 p-3.5 border border-amber-100 text-center">
                <span className="text-[11px] font-semibold text-amber-700 uppercase">
                  Avg Delivery Time
                </span>
                <p className="mt-1 text-2xl font-black text-gray-900">38m</p>
                <span className="text-[10px] text-gray-500 font-bangla">গড় ডেলিভারি সময়</span>
              </div>
            </div>

            {/* Performance status breakdown */}
            <div className="mt-6 space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-700 mb-1">
                  <span className="font-medium">On-Time Deliveries (সময়মত ডেলিভারি)</span>
                  <span className="font-bold text-emerald-600">147 Orders (94.2%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "94.2%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-700 mb-1">
                  <span className="font-medium">Slightly Delayed (&gt; 45 mins)</span>
                  <span className="font-bold text-amber-600">6 Orders (3.8%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "3.8%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-700 mb-1">
                  <span className="font-medium">Cancelled / Returned</span>
                  <span className="font-bold text-red-600">3 Orders (2.0%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: "2%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-gray-50 p-3 border border-gray-100 flex items-center gap-3">
            <span className="text-xl">🏆</span>
            <div className="text-xs">
              <span className="font-bold text-gray-800">শীর্ষ ডেলিভারি রাইডার: </span>
              <span className="text-gray-600 font-bangla">তারেক মাহমুদ (৬৪টি ডেলিভারি, ৯৮% সন্তুষ্টি)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
