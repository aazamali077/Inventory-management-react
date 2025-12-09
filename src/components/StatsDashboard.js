import React from 'react';
import { Package, BarChart3, AlertTriangle, TrendingDown, IndianRupee, ShoppingCart, ShoppingBag, Truck, Store } from 'lucide-react';

export default function StatsDashboard({ products, darkMode }) {
  const lowStockCount = products.filter(p => p.totalStock <= p.lowStockThreshold && p.totalStock > 0).length;
  const outOfStockCount = products.filter(p => p.totalStock === 0).length;
  const totalUnits = products.reduce((sum, p) => sum + p.totalStock, 0);

  const getTotalRevenue = () => {
    let totalRevenue = 0;
    products.forEach(product => {
      const price = parseFloat(product.price) || 0;
      const totalSold = product.sales.reduce((sum, sale) => sum + sale.quantity, 0);
      totalRevenue += (totalSold * price);
    });
    return totalRevenue;
  };

  const getPlatformStats = (platformName) => {
    let totalUnits = 0;
    let totalRevenue = 0;
    products.forEach(product => {
      const price = parseFloat(product.price) || 0;
      const productSales = product.sales.filter(sale => sale.platform === platformName);
      const units = productSales.reduce((sum, sale) => sum + sale.quantity, 0);
      totalUnits += units;
      totalRevenue += (units * price);
    });
    return { totalUnits, totalRevenue };
  };

  const totalRevenue = getTotalRevenue();
  const amazonStats = getPlatformStats('Amazon');
  const flipkartStats = getPlatformStats('Flipkart');
  const meeshoStats = getPlatformStats('Meesho');
  const offlineStats = getPlatformStats('Offline');

  const StatCard = ({ title, value, colorClass, icon: Icon, subTitle, bgClass, darkBgClass }) => (
    <div className={`p-5 rounded-2xl border shadow-sm hover:shadow-md transition duration-200 h-full flex flex-col justify-between ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${darkMode ? darkBgClass : bgClass}`}>
          <Icon className={colorClass} size={20} />
        </div>
        {subTitle && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${darkMode ? darkBgClass : bgClass} ${colorClass}`}>
            {subTitle}
          </span>
        )}
      </div>
      <div>
        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{title}</p>
        <h3 className={`text-xl font-extrabold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`} title={value}>{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Inventory */}
      <div className="flex flex-col gap-4">
        <h2 className={`text-lg font-bold flex items-center gap-2 px-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          <Package size={20} className="text-gray-400" /> Inventory Overview
        </h2>
        <div className="grid grid-cols-2 gap-4 h-full">
          <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} colorClass="text-indigo-500" bgClass="bg-indigo-50" darkBgClass="bg-indigo-500/10" icon={IndianRupee} />
          <StatCard title="Total Stock" value={totalUnits} colorClass="text-emerald-500" bgClass="bg-emerald-50" darkBgClass="bg-emerald-500/10" icon={BarChart3} subTitle={`${products.length} Items`} />
          <StatCard title="Low Stock" value={lowStockCount} colorClass="text-amber-500" bgClass="bg-amber-50" darkBgClass="bg-amber-500/10" icon={AlertTriangle} subTitle={lowStockCount > 0 ? "Check" : "Good"} />
          <StatCard title="Out of Stock" value={outOfStockCount} colorClass="text-rose-500" bgClass="bg-rose-50" darkBgClass="bg-rose-500/10" icon={TrendingDown} subTitle="Critical" />
        </div>
      </div>

      {/* Sales */}
      <div className="flex flex-col gap-4">
        <h2 className={`text-lg font-bold flex items-center gap-2 px-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          <ShoppingCart size={20} className="text-gray-400" /> Sales By Platform
        </h2>
        <div className="grid grid-cols-2 gap-4 h-full">
          <StatCard title="Amazon" value={`₹${amazonStats.totalRevenue.toLocaleString()}`} colorClass="text-orange-500" bgClass="bg-orange-50" darkBgClass="bg-orange-500/10" icon={ShoppingCart} subTitle={`${amazonStats.totalUnits} Units`} />
          <StatCard title="Flipkart" value={`₹${flipkartStats.totalRevenue.toLocaleString()}`} colorClass="text-blue-500" bgClass="bg-blue-50" darkBgClass="bg-blue-500/10" icon={ShoppingBag} subTitle={`${flipkartStats.totalUnits} Units`} />
          <StatCard title="Meesho" value={`₹${meeshoStats.totalRevenue.toLocaleString()}`} colorClass="text-pink-500" bgClass="bg-pink-50" darkBgClass="bg-pink-500/10" icon={Truck} subTitle={`${meeshoStats.totalUnits} Units`} />
          <StatCard title="Offline Store" value={`₹${offlineStats.totalRevenue.toLocaleString()}`} colorClass="text-purple-500" bgClass="bg-purple-50" darkBgClass="bg-purple-500/10" icon={Store} subTitle={`${offlineStats.totalUnits} Units`} />
        </div>
      </div>
    </div>
  );
}