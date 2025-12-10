import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingDown, IndianRupee, ShoppingBag } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// --- SUB-COMPONENTS (Moved Outside to prevent re-renders) ---

const COLORS = ['#F97316', '#3B82F6', '#EC4899', '#A855F7']; 

// 1. Custom Label
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central"
      className="text-[10px] font-bold"
    >
      {value > 999 ? `${(value/1000).toFixed(1)}k` : value} 
    </text>
  );
};

// 2. Custom Tooltip
const CustomTooltip = ({ active, payload, isCurrency, darkMode }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className={`p-3 rounded-xl shadow-xl border text-sm font-bold z-50 ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
        <p className="mb-1 opacity-70">{data.name}</p>
        <p className="text-lg text-indigo-500">
          {isCurrency ? `₹${data.value.toLocaleString()}` : `${data.value} Units`}
        </p>
      </div>
    );
  }
  return null;
};

// 3. Chart Card Component
const ChartCard = ({ title, totalValue, data, icon: Icon, colorClass, bgClass, isCurrency, darkMode, shouldAnimate }) => (
  <div className={`col-span-1 md:col-span-2 p-6 rounded-3xl border shadow-sm relative overflow-visible flex flex-col sm:flex-row items-center justify-between gap-6 ${
    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
  }`}>
    
    {/* Left: Text Info */}
    <div className="z-10 flex flex-col justify-between h-full w-full sm:w-1/2">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-2 rounded-xl ${bgClass} ${colorClass}`}>
            <Icon size={20} />
          </div>
          <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
        </div>
        <h3 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {isCurrency ? '₹' : ''}{totalValue.toLocaleString()}
        </h3>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
            {entry.name}
          </div>
        ))}
      </div>
    </div>

    {/* Right: Pie Chart */}
    <div className="w-32 h-32 sm:w-40 sm:h-40 relative flex-shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={60} 
            fill="#8884d8"
            dataKey="value"
            isAnimationActive={shouldAnimate} // Only animate on first load
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={darkMode ? '#1f2937' : '#fff'} strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip isCurrency={isCurrency} darkMode={darkMode} />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// 4. Status Card Component
const StatusCard = ({ title, value, icon: Icon, colorClass, bgClass, subTitle, darkMode }) => (
  <div className={`p-5 rounded-3xl border shadow-sm flex flex-col justify-between h-full ${
    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
  }`}>
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2.5 rounded-xl ${bgClass} ${colorClass}`}>
        <Icon size={20} />
      </div>
      {value > 0 && <span className={`text-xs font-bold px-2 py-1 rounded-full ${bgClass} ${colorClass}`}>{value}</span>}
    </div>
    <div>
      <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
      <h3 className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{subTitle}</h3>
    </div>
  </div>
);


// --- MAIN COMPONENT ---

export default function StatsDashboard({ products, darkMode }) {
  
  // State to control animation
  const [shouldAnimate, setShouldAnimate] = useState(true);

  // Turn off animation after 1.5 seconds so it doesn't run again on updates
  useEffect(() => {
    const timer = setTimeout(() => setShouldAnimate(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // --- Data Calculations ---
  const lowStockCount = products.filter(p => p.totalStock <= p.lowStockThreshold && p.totalStock > 0).length;
  const outOfStockCount = products.filter(p => p.totalStock === 0).length;
  const totalCurrentStock = products.reduce((sum, p) => sum + p.totalStock, 0);

  const getPlatformData = () => {
    const platforms = ['Amazon', 'Flipkart', 'Meesho', 'Offline'];
    
    const revenueData = platforms.map(p => ({ name: p, value: 0 }));
    const unitsData = platforms.map(p => ({ name: p, value: 0 }));
    let totalRevenue = 0;
    let totalUnitsSold = 0;

    products.forEach(product => {
      const price = parseFloat(product.price) || 0;
      product.sales.forEach(sale => {
        const platformIndex = platforms.indexOf(sale.platform);
        if (platformIndex !== -1) {
          const saleRevenue = sale.quantity * price;
          revenueData[platformIndex].value += saleRevenue;
          totalRevenue += saleRevenue;

          unitsData[platformIndex].value += sale.quantity;
          totalUnitsSold += sale.quantity;
        }
      });
    });

    return {
      revenueData: revenueData.filter(d => d.value > 0),
      unitsData: unitsData.filter(d => d.value > 0),
      totalRevenue,
      totalUnitsSold
    };
  };

  const { revenueData, unitsData, totalRevenue, totalUnitsSold } = getPlatformData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      <ChartCard 
        title="Total Revenue"
        totalValue={totalRevenue}
        data={revenueData}
        icon={IndianRupee}
        colorClass="text-indigo-500"
        bgClass={darkMode ? 'bg-indigo-500/10' : 'bg-indigo-50'}
        isCurrency={true}
        darkMode={darkMode}
        shouldAnimate={shouldAnimate}
      />

      <ChartCard 
        title="Total Units Sold"
        totalValue={totalUnitsSold}
        data={unitsData}
        icon={ShoppingBag}
        colorClass="text-emerald-500"
        bgClass={darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}
        isCurrency={false}
        darkMode={darkMode}
        shouldAnimate={shouldAnimate}
      />

      <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatusCard 
          title="Current Stock" 
          value={0} 
          subTitle={`${totalCurrentStock} Units`}
          icon={Package} 
          colorClass="text-blue-500" 
          bgClass={darkMode ? 'bg-blue-500/10' : 'bg-blue-50'}
          darkMode={darkMode} 
        />
        <StatusCard 
          title="Low Stock Alert" 
          value={lowStockCount} 
          subTitle={lowStockCount > 0 ? "Action Needed" : "All Good"}
          icon={AlertTriangle} 
          colorClass="text-amber-500" 
          bgClass={darkMode ? 'bg-amber-500/10' : 'bg-amber-50'} 
          darkMode={darkMode}
        />
        <StatusCard 
          title="Out of Stock" 
          value={outOfStockCount} 
          subTitle={outOfStockCount > 0 ? "Critical" : "Healthy"}
          icon={TrendingDown} 
          colorClass="text-rose-500" 
          bgClass={darkMode ? 'bg-rose-500/10' : 'bg-rose-50'} 
          darkMode={darkMode}
        />
      </div>

    </div>
  );
}