"use client";

import React, { useState } from "react";

// Types
interface StaffMember {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleBn: string;
  phone: string;
  email: string;
  status: "Active" | "On Leave" | "Inactive";
  joinedDate: string;
}

interface CylinderPrice {
  id: string;
  size: string;
  sizeBn: string;
  refillPrice: number;
  depositAmount: number;
  effectiveDate: string;
  updatedBy: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "staff" | "prices" | "language">("profile");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Business Profile State
  const [profile, setProfile] = useState({
    businessNameEn: "LPG Tracker Distribution Ltd.",
    businessNameBn: "মেসার্স বিসমিল্লাহ্ গ্যাস ডিস্ট্রিবিউশন",
    ownerName: "মোহাম্মদ রফিকুল ইসলাম",
    email: "contact@lpgtracker.com",
    phone: "01700-123456",
    emergencyPhone: "01811-987654",
    addressEn: "Plot 42, Road 11, Section 10, Mirpur, Dhaka-1216",
    addressBn: "প্লট ৪২, রোড ১১, সেকশন ১০, মিরপুর, ঢাকা-১২১৬",
    tradeLicense: "TRAD/DNCC/029182/2023",
    binNumber: "001928374-0101",
    logoUrl: "",
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("ব্যবসায়িক তথ্য সফলভাবে আপডেট করা হয়েছে (Profile updated successfully)");
  };

  // 2. Staff Management State
  const [staffList, setStaffList] = useState<StaffMember[]>([
    {
      id: "STF-01",
      name: "রফিকুল আলম",
      nameEn: "Rafiqul Alam",
      role: "Branch Manager",
      roleBn: "শাখা ব্যবস্থাপক",
      phone: "01711-234567",
      email: "rafiqul@lpgtracker.com",
      status: "Active",
      joinedDate: "2023-01-15",
    },
    {
      id: "STF-02",
      name: "তারেক মাহমুদ",
      nameEn: "Tarek Mahmud",
      role: "Delivery Staff",
      roleBn: "ডেলিভারি রাইডার",
      phone: "01822-345678",
      email: "tarek@lpgtracker.com",
      status: "Active",
      joinedDate: "2023-06-01",
    },
    {
      id: "STF-03",
      name: "সুমন মিয়া",
      nameEn: "Sumon Mia",
      role: "Store Keeper",
      roleBn: "গুদাম তত্ত্বাবধায়ক",
      phone: "01933-456789",
      email: "sumon@lpgtracker.com",
      status: "On Leave",
      joinedDate: "2023-09-10",
    },
  ]);

  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    nameEn: "",
    role: "Delivery Staff",
    roleBn: "ডেলিভারি রাইডার",
    phone: "",
    email: "",
    status: "Active" as const,
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.phone) return;

    const added: StaffMember = {
      id: `STF-0${staffList.length + 1}`,
      name: newStaff.name,
      nameEn: newStaff.nameEn || newStaff.name,
      role: newStaff.role,
      roleBn:
        newStaff.role === "Branch Manager"
          ? "শাখা ব্যবস্থাপক"
          : newStaff.role === "Delivery Staff"
          ? "ডেলিভারি রাইডার"
          : "স্টোর কিপার",
      phone: newStaff.phone,
      email: newStaff.email || "staff@lpgtracker.com",
      status: newStaff.status,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setStaffList([...staffList, added]);
    setIsAddStaffOpen(false);
    setNewStaff({
      name: "",
      nameEn: "",
      role: "Delivery Staff",
      roleBn: "ডেলিভারি রাইডার",
      phone: "",
      email: "",
      status: "Active",
    });
    showToast(`নতুন কর্মী '${added.name}' সফলভাবে যুক্ত হয়েছে!`);
  };

  const handleToggleStaffStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const nextStatus =
          s.status === "Active"
            ? "On Leave"
            : s.status === "On Leave"
            ? "Inactive"
            : "Active";
        return { ...s, status: nextStatus };
      })
    );
    showToast("কর্মীর স্ট্যাটাস পরিবর্তন করা হয়েছে");
  };

  // 3. Cylinder Prices State
  const [cylinderPrices, setCylinderPrices] = useState<CylinderPrice[]>([
    {
      id: "PRC-5KG",
      size: "5 KG",
      sizeBn: "৫ কেজি",
      refillPrice: 650,
      depositAmount: 1200,
      effectiveDate: "2024-10-01",
      updatedBy: "Admin",
    },
    {
      id: "PRC-12KG",
      size: "12 KG",
      sizeBn: "১২ কেজি",
      refillPrice: 1450,
      depositAmount: 2500,
      effectiveDate: "2024-10-01",
      updatedBy: "Admin",
    },
    {
      id: "PRC-25KG",
      size: "25 KG",
      sizeBn: "২৫ কেজি",
      refillPrice: 3100,
      depositAmount: 4200,
      effectiveDate: "2024-10-01",
      updatedBy: "Admin",
    },
    {
      id: "PRC-45KG",
      size: "45 KG",
      sizeBn: "৪৫ কেজি",
      refillPrice: 5600,
      depositAmount: 7500,
      effectiveDate: "2024-10-01",
      updatedBy: "Admin",
    },
  ]);

  const [editingPrice, setEditingPrice] = useState<CylinderPrice | null>(null);

  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrice) return;

    setCylinderPrices((prev) =>
      prev.map((p) => (p.id === editingPrice.id ? editingPrice : p))
    );
    showToast(`${editingPrice.size} সিলিন্ডারের নতুন মূল্য আপডেট হয়েছে!`);
    setEditingPrice(null);
  };

  // 4. Language & Regional Preferences State
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "bn">("bn");
  const [numeralFormat, setNumeralFormat] = useState<"english" | "bengali">("english");
  const [dateFormat, setDateFormat] = useState<string>("DD/MM/YYYY");
  const [currencySymbol, setCurrencySymbol] = useState<string>("৳ (BDT)");

  const handleSavePreferences = () => {
    showToast("ভাষা ও অঞ্চল সেটিংস সংরক্ষিত হয়েছে (Preferences saved)");
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-white shadow-xl animate-fade-in">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Page Title */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <span className="text-xl font-bold text-gray-400">/</span>
          <span className="text-2xl font-bold text-blue-600 font-bangla">সেটিংস</span>
        </div>
        <p className="mt-1 text-sm text-gray-500 font-bangla">
          ব্যবসায়িক প্রোফাইল, কর্মী তালিকা, সিলিন্ডারের দাম ও সিস্টেম কনফিগারেশন পরিবর্তন করুন
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 bg-white rounded-t-xl px-4 pt-2 shadow-xs">
        <nav className="flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {[
            {
              id: "profile" as const,
              label: "Business Profile",
              labelBn: "ব্যবসায়িক প্রোফাইল",
              icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              ),
            },
            {
              id: "staff" as const,
              label: "Staff Management",
              labelBn: "কর্মী ব্যবস্থাপনা",
              icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ),
            },
            {
              id: "prices" as const,
              label: "Cylinder Prices",
              labelBn: "সিলিন্ডারের মূল্য",
              icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              ),
            },
            {
              id: "language" as const,
              label: "Language & Region",
              labelBn: "ভাষা ও অঞ্চল",
              icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              ),
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center gap-2 border-b-2 py-4 px-1 text-sm font-medium transition ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <span className={isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                <span className="text-xs font-bangla text-gray-400 group-hover:text-gray-500">
                  ({tab.labelBn})
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab 1: Business Profile */}
      {activeTab === "profile" && (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Business Information <span className="text-sm font-normal text-gray-500 font-bangla">/ প্রতিষ্ঠানের তথ্য</span>
              </h2>
              <p className="text-xs text-gray-500 font-bangla">
                চালান এবং ইনভয়েসে প্রদর্শিত প্রতিষ্ঠানের নাম, ঠিকানা ও যোগাযোগের নম্বর
              </p>
            </div>

            {/* Logo Upload Area */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Business Logo / প্রতিষ্ঠানের লোগো
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl border-2 border-dashed border-gray-300 p-6 bg-gray-50/50 hover:bg-gray-50 transition">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-400 text-white font-black text-2xl shadow-md">
                  LPG
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <h4 className="text-sm font-semibold text-gray-800">
                    Upload your business logo / লোগো আপলোড করুন
                  </h4>
                  <p className="text-xs text-gray-500">
                    PNG, JPG or SVG formats up to 2MB (Recommended: 400x400px)
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => showToast("লোগো ফাইল নির্বাচন উইন্ডো খোলা হয়েছে")}
                      className="rounded-lg bg-white border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-100"
                    >
                      Choose File / ফাইল বাছুন
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast("ডিফল্ট লোগো পুনরায় সেট করা হয়েছে")}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Remove / মুছুন
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Business Name (English)
                </label>
                <input
                  type="text"
                  value={profile.businessNameEn}
                  onChange={(e) => setProfile({ ...profile, businessNameEn: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Business Name (বাংলা)
                </label>
                <input
                  type="text"
                  value={profile.businessNameBn}
                  onChange={(e) => setProfile({ ...profile, businessNameBn: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm font-bangla focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Contact Phones & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Official Phone / ফোন নম্বর
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Emergency Contact / জরুরি নম্বর
                </label>
                <input
                  type="text"
                  value={profile.emergencyPhone}
                  onChange={(e) => setProfile({ ...profile, emergencyPhone: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address / ইমেইল
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Business Address (English)
                </label>
                <textarea
                  rows={2}
                  value={profile.addressEn}
                  onChange={(e) => setProfile({ ...profile, addressEn: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Business Address (বাংলা)
                </label>
                <textarea
                  rows={2}
                  value={profile.addressBn}
                  onChange={(e) => setProfile({ ...profile, addressBn: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm font-bangla focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Legal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Trade License No / ট্রেড লাইসেন্স নং
                </label>
                <input
                  type="text"
                  value={profile.tradeLicense}
                  onChange={(e) => setProfile({ ...profile, tradeLicense: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  BIN / VAT Registration No
                </label>
                <input
                  type="text"
                  value={profile.binNumber}
                  onChange={(e) => setProfile({ ...profile, binNumber: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes / তথ্য সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Staff Management */}
      {activeTab === "staff" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Staff Members <span className="text-sm font-normal text-gray-500 font-bangla">/ কর্মরত কর্মচারীবৃন্দ</span>
                </h2>
                <p className="text-xs text-gray-500 font-bangla">
                  ডেলিভারিম্যান, স্টোরকিপার ও ম্যানেজারদের তালিকা ও উপস্থিতি নিয়ন্ত্রণ
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddStaffOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Staff / নতুন কর্মী যোগ করুন
              </button>
            </div>

            {/* Staff List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
                    <th className="px-5 py-3.5">Staff Name / নাম</th>
                    <th className="px-5 py-3.5">Role / পদবি</th>
                    <th className="px-5 py-3.5">Phone / যোগাযোগ</th>
                    <th className="px-5 py-3.5">Joined Date</th>
                    <th className="px-5 py-3.5 text-center">Status / অবস্থা</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {staffList.map((staff) => (
                    <tr key={staff.id} className="hover:bg-gray-50 transition">
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 text-sm">
                            {staff.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bangla font-semibold text-gray-900 text-sm">
                              {staff.name}
                            </h4>
                            <p className="text-xs text-gray-500">{staff.nameEn}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-800">{staff.role}</div>
                        <div className="text-xs text-gray-500 font-bangla">{staff.roleBn}</div>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4">
                        <div className="font-mono text-xs font-medium text-gray-800">{staff.phone}</div>
                        <div className="text-xs text-gray-400">{staff.email}</div>
                      </td>

                      {/* Joined Date */}
                      <td className="px-5 py-4 text-xs text-gray-600 font-mono">
                        {staff.joinedDate}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleToggleStaffStatus(staff.id)}
                          title="Click to toggle status"
                          className="focus:outline-none"
                        >
                          {staff.status === "Active" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200 cursor-pointer hover:bg-emerald-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                              Active / কর্মরত
                            </span>
                          )}
                          {staff.status === "On Leave" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200 cursor-pointer hover:bg-amber-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
                              On Leave / ছুটিতে
                            </span>
                          )}
                          {staff.status === "Inactive" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 border border-gray-200 cursor-pointer hover:bg-gray-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                              Inactive / নিষ্ক্রিয়
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => showToast(`${staff.name}-এর প্রোফাইল এডিটর লোড হয়েছে`)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition"
                            title="Edit Staff"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setStaffList(staffList.filter((s) => s.id !== staff.id));
                              showToast(`${staff.name} তালিকা থেকে অপসারিত হয়েছে`);
                            }}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
                            title="Delete Staff"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Staff Modal */}
          {isAddStaffOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-fade-in">
                <div className="flex items-center justify-between border-b border-gray-200 bg-blue-600 px-6 py-4 text-white">
                  <h3 className="text-base font-bold">Add New Staff / নতুন কর্মী যোগ</h3>
                  <button
                    onClick={() => setIsAddStaffOpen(false)}
                    className="text-blue-100 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddStaff} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Staff Name (বাংলা) *
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: মোঃ জাহিদুল ইসলাম"
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-bangla focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Staff Name (English)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Md. Zahidul Islam"
                      value={newStaff.nameEn}
                      onChange={(e) => setNewStaff({ ...newStaff, nameEn: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Role / পদবি *
                    </label>
                    <select
                      value={newStaff.role}
                      onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Delivery Staff">Delivery Staff (ডেলিভারি রাইডার)</option>
                      <option value="Store Keeper">Store Keeper (স্টোর কিপার)</option>
                      <option value="Branch Manager">Branch Manager (শাখা ব্যবস্থাপক)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Mobile Number / ফোন নম্বর *
                    </label>
                    <input
                      type="text"
                      placeholder="017XX-XXXXXX"
                      value={newStaff.phone}
                      onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsAddStaffOpen(false)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel / বাতিল
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
                    >
                      Save Staff / সংরক্ষণ করুন
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Cylinder Prices */}
      {activeTab === "prices" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Cylinder Price Configuration <span className="text-sm font-normal text-gray-500 font-bangla">/ সিলিন্ডারের দাম তালিকা</span>
                </h2>
                <p className="text-xs text-gray-500 font-bangla">
                  প্রতিটি সিলিন্ডার আকারের গ্যাস রিফিল মূল্য এবং নতুন সিলিন্ডারের জামানত ফি
                </p>
              </div>

              <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-200">
                Official BERC Rate Compliant
              </span>
            </div>

            {/* Price Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
                    <th className="px-5 py-3.5">Cylinder Size / সাইজ</th>
                    <th className="px-5 py-3.5 text-right">Gas Refill Price (৳)</th>
                    <th className="px-5 py-3.5 text-right">New Deposit Fee (৳)</th>
                    <th className="px-5 py-3.5 text-center">Effective Date</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cylinderPrices.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      {/* Cylinder Size */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 font-bold text-xs">
                            🔥
                          </div>
                          <div>
                            <span className="font-bold text-gray-900">{item.size}</span>
                            <span className="ml-2 text-xs font-medium text-gray-500 font-bangla">
                              ({item.sizeBn})
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Refill Price */}
                      <td className="px-5 py-4 text-right">
                        <span className="font-mono text-base font-bold text-gray-900">
                          ৳ {item.refillPrice.toLocaleString()}
                        </span>
                        <p className="text-[11px] text-gray-400 font-bangla">প্রতি রিফিল</p>
                      </td>

                      {/* Deposit Amount */}
                      <td className="px-5 py-4 text-right">
                        <span className="font-mono text-base font-bold text-blue-600">
                          ৳ {item.depositAmount.toLocaleString()}
                        </span>
                        <p className="text-[11px] text-gray-400 font-bangla">নতুন সিলিন্ডার নিরাপত্তা জামানত</p>
                      </td>

                      {/* Effective Date */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-block rounded-md bg-gray-100 px-2.5 py-1 text-xs font-mono font-medium text-gray-700">
                          {item.effectiveDate}
                        </span>
                      </td>

                      {/* Edit Button */}
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setEditingPrice(item)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Edit / পরিবর্তন
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Price Modal */}
          {editingPrice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-fade-in">
                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-900 px-6 py-4 text-white">
                  <div>
                    <h3 className="text-base font-bold">
                      Update Price: {editingPrice.size} ({editingPrice.sizeBn})
                    </h3>
                    <p className="text-xs text-gray-400 font-bangla">সিলিন্ডারের নতুন মূল্য নির্ধারণ করুন</p>
                  </div>
                  <button
                    onClick={() => setEditingPrice(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSavePrice} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Gas Refill Price / রিফিল মূল্য (৳)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-400 font-bold">৳</span>
                      <input
                        type="number"
                        value={editingPrice.refillPrice}
                        onChange={(e) =>
                          setEditingPrice({ ...editingPrice, refillPrice: Number(e.target.value) })
                        }
                        required
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-4 text-sm font-bold text-gray-900 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      New Cylinder Deposit Fee / জামানত ফি (৳)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-400 font-bold">৳</span>
                      <input
                        type="number"
                        value={editingPrice.depositAmount}
                        onChange={(e) =>
                          setEditingPrice({ ...editingPrice, depositAmount: Number(e.target.value) })
                        }
                        required
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-4 text-sm font-bold text-gray-900 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Effective Date / কার্যকরের তারিখ
                    </label>
                    <input
                      type="date"
                      value={editingPrice.effectiveDate}
                      onChange={(e) =>
                        setEditingPrice({ ...editingPrice, effectiveDate: e.target.value })
                      }
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setEditingPrice(null)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel / বাতিল
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
                    >
                      Update Price / মূল্য আপডেট
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Language & Regional Preferences */}
      {activeTab === "language" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Language & Regional Settings <span className="text-sm font-normal text-gray-500 font-bangla">/ ভাষা ও অঞ্চল পছন্দসমূহ</span>
              </h2>
              <p className="text-xs text-gray-500 font-bangla">
                অ্যাপ্লিকেশনের ভাষা, তারিখ ফরম্যাট ও মুদ্রার রূপান্তর পছন্দ নির্ধারণ করুন
              </p>
            </div>

            {/* Language Selection Radio Cards */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                Interface Language / ইন্টারফেসের ভাষা
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bangla */}
                <div
                  onClick={() => setSelectedLanguage("bn")}
                  className={`cursor-pointer rounded-xl border-2 p-4 transition flex items-center justify-between ${
                    selectedLanguage === "bn"
                      ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-500"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700 font-bold text-lg">
                      বাং
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 font-bangla">বাংলা (Bengali)</h4>
                      <p className="text-xs text-gray-500 font-bangla">সম্পূর্ণ ইন্টারফেস বাংলায় প্রদর্শিত হবে</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="language"
                    checked={selectedLanguage === "bn"}
                    onChange={() => setSelectedLanguage("bn")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                {/* English */}
                <div
                  onClick={() => setSelectedLanguage("en")}
                  className={`cursor-pointer rounded-xl border-2 p-4 transition flex items-center justify-between ${
                    selectedLanguage === "en"
                      ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-500"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-lg">
                      EN
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">English (United States)</h4>
                      <p className="text-xs text-gray-500">Display full interface in English</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="language"
                    checked={selectedLanguage === "en"}
                    onChange={() => setSelectedLanguage("en")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Regional Formats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 border-t border-gray-100">
              {/* Currency */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Currency Symbol / মুদ্রা
                </label>
                <select
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="৳ (BDT)">৳ BDT (টাকা)</option>
                  <option value="$ (USD)">$ USD (US Dollar)</option>
                </select>
              </div>

              {/* Number format */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Number Digits / সংখ্যা প্রদর্শন
                </label>
                <select
                  value={numeralFormat}
                  onChange={(e) => setNumeralFormat(e.target.value as "english" | "bengali")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="english">English Digits (1, 2, 3)</option>
                  <option value="bengali">বাংলা সংখ্যা (১, ২, ৩)</option>
                </select>
              </div>

              {/* Date Format */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Date Format / তারিখ ফরম্যাট
                </label>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none font-mono"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (15/10/2024)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (2024-10-15)</option>
                  <option value="DD MMM YYYY">DD MMM YYYY (15 Oct 2024)</option>
                </select>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Preferences / পছন্দ সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
