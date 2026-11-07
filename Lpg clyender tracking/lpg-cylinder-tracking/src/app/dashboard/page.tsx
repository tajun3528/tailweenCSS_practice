export default function DashboardPage() {
  // Demo data - will be replaced with real API calls
  const stats = [
    {
      title: "Today's Orders",
      titleBn: "আজকের অর্ডার",
      value: "12",
      change: "+3 from yesterday",
      color: "blue",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/><path d="m15 9 6-6"/></svg>
      ),
    },
    {
      title: "Today's Deliveries",
      titleBn: "আজকের ডেলিভারি",
      value: "8",
      change: "5 completed",
      color: "green",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
      ),
    },
    {
      title: "Today's Revenue",
      titleBn: "আজকের আয়",
      value: "৳ 24,500",
      change: "+12% from last week",
      color: "emerald",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      ),
    },
    {
      title: "Due Payments",
      titleBn: "বকেয়া পেমেন্ট",
      value: "৳ 15,200",
      change: "7 customers",
      color: "red",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
      ),
    },
  ];

  const recentOrders = [
    { id: "ORD-00045", customer: "কামাল হোসেন", area: "মিরপুর", cylinders: "2x 12 KG", amount: "৳ 2,400", status: "DELIVERING" },
    { id: "ORD-00044", customer: "রহিম উদ্দিন", area: "উত্তরা", cylinders: "1x 25 KG", amount: "৳ 3,200", status: "DELIVERED" },
    { id: "ORD-00043", customer: "ফাতেমা খানম", area: "ধানমন্ডি", cylinders: "3x 12 KG", amount: "৳ 3,600", status: "PENDING" },
    { id: "ORD-00042", customer: "আব্দুল করিম", area: "গুলশান", cylinders: "1x 45 KG", amount: "৳ 5,500", status: "CONFIRMED" },
    { id: "ORD-00041", customer: "নাসরিন আক্তার", area: "মোহাম্মদপুর", cylinders: "2x 5 KG", amount: "৳ 1,200", status: "DELIVERED" },
  ];

  const stockSummary = [
    { size: "5 KG", full: 45, empty: 12, inUse: 30, damaged: 2 },
    { size: "12 KG", full: 120, empty: 35, inUse: 85, damaged: 5 },
    { size: "25 KG", full: 30, empty: 10, inUse: 20, damaged: 1 },
    { size: "45 KG", full: 15, empty: 8, inUse: 12, damaged: 0 },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    DELIVERING: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
    blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100" },
    green: { bg: "bg-green-50", icon: "text-green-600", border: "border-green-100" },
    emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-100" },
    red: { bg: "bg-red-50", icon: "text-red-600", border: "border-red-100" },
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 font-bangla">ড্যাশবোর্ড</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const colors = colorMap[stat.color];
          return (
            <div
              key={stat.title}
              className={`rounded-xl border ${colors.border} ${colors.bg} p-5 transition-shadow hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xs text-gray-400 font-bangla">{stat.titleBn}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="mt-1 text-xs text-gray-500">{stat.change}</p>
                </div>
                <div className={`rounded-lg ${colors.bg} p-2 ${colors.icon}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <a
          href="/dashboard/orders/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          New Order / নতুন অর্ডার
        </a>
        <a
          href="/dashboard/customers/new"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          New Customer / নতুন গ্রাহক
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <p className="text-sm text-gray-500 font-bangla">সাম্প্রতিক অর্ডার</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
                  <th className="px-5 py-3">Order #</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Area</th>
                  <th className="px-5 py-3">Cylinders</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-blue-600">{order.id}</td>
                    <td className="px-5 py-3 text-sm text-gray-900 font-bangla">{order.customer}</td>
                    <td className="px-5 py-3 text-sm text-gray-500 font-bangla">{order.area}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{order.cylinders}</td>
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">{order.amount}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cylinder Stock Summary */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Cylinder Stock</h2>
            <p className="text-sm text-gray-500 font-bangla">সিলিন্ডার স্টক</p>
          </div>
          <div className="p-5 space-y-4">
            {stockSummary.map((item) => (
              <div key={item.size} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{item.size}</span>
                  <span className="text-xs text-gray-500">
                    Total: {item.full + item.empty + item.inUse + item.damaged}
                  </span>
                </div>
                <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-gray-100">
                  <div
                    className="bg-green-500 rounded-l-full"
                    style={{ width: `${(item.full / (item.full + item.empty + item.inUse + item.damaged)) * 100}%` }}
                    title={`Full: ${item.full}`}
                  />
                  <div
                    className="bg-blue-500"
                    style={{ width: `${(item.inUse / (item.full + item.empty + item.inUse + item.damaged)) * 100}%` }}
                    title={`In Use: ${item.inUse}`}
                  />
                  <div
                    className="bg-gray-400"
                    style={{ width: `${(item.empty / (item.full + item.empty + item.inUse + item.damaged)) * 100}%` }}
                    title={`Empty: ${item.empty}`}
                  />
                  {item.damaged > 0 && (
                    <div
                      className="bg-red-500 rounded-r-full"
                      style={{ width: `${(item.damaged / (item.full + item.empty + item.inUse + item.damaged)) * 100}%` }}
                      title={`Damaged: ${item.damaged}`}
                    />
                  )}
                </div>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500" /> Full: {item.full}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-blue-500" /> In Use: {item.inUse}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-gray-400" /> Empty: {item.empty}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Low Stock Alert */}
          <div className="border-t border-gray-200 px-5 py-4">
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
              <p className="text-sm font-medium text-yellow-800">⚠️ Low Stock Alert</p>
              <p className="text-xs text-yellow-600 mt-1">25 KG cylinders running low (30 full remaining)</p>
              <p className="text-xs text-yellow-600 font-bangla">২৫ কেজি সিলিন্ডার কমে যাচ্ছে</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
