import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingDown, IndianRupee, ShoppingBag, Trophy, Crown, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// --- SUB-COMPONENTS ---

const COLORS = ['#F97316', '#3B82F6', '#EC4899', '#A855F7']; 

// 1. Custom Label (Pie Chart)
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

// 2. Custom Tooltip (Pie Chart)
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
      <div className="flex flex-wrap gap-3 mt-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
            {entry.name}
          </div>
        ))}
      </div>
    </div>
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
            isAnimationActive={shouldAnimate}
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

// 5. NEW: Top Products Grid (Now Wrapped in a Unified Card)
const TopProductsCard = ({ products, darkMode }) => {
  const rankedProducts = products
    .map(p => ({
      id: p.id,
      name: p.name,
      unitsSold: p.sales.reduce((acc, curr) => acc + curr.quantity, 0),
      revenue: p.sales.reduce((acc, curr) => acc + (curr.quantity * p.price), 0),
    }))
    .filter(p => p.unitsSold > 0)
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 6); // Top 6

  const maxSold = rankedProducts.length > 0 ? rankedProducts[0].unitsSold : 1;

  if (rankedProducts.length === 0) return null;

  return (
    // Main Wrapper Card (Matches Revenue Card Style)
    <div className={`col-span-1 md:col-span-2 lg:col-span-4 p-6 rounded-3xl border shadow-sm ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
    }`}>
      
      {/* Header inside the card */}
      <div className="flex items-center gap-2 mb-6">
        <div className={`p-2 rounded-xl ${darkMode ? 'bg-yellow-500/20 text-yellow-500' : 'bg-yellow-100 text-yellow-600'}`}>
          <Trophy size={20} />
        </div>
        <div>
           <h3 className={`text-lg font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Top Performers</h3>
           <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your highest selling inventory</p>
        </div>
      </div>

      {/* Grid of Inner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rankedProducts.map((product, index) => {
          // Dynamic Styles for Top 3
          const isGold = index === 0;
          const isSilver = index === 1;
          const isBronze = index === 2;
          
          let borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
          let bgGradient = darkMode ? 'bg-gray-900/40' : 'bg-gray-50'; // Subtler inner bg
          let badgeColor = darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500';

          if (isGold) {
            borderColor = 'border-yellow-500/30';
            bgGradient = darkMode ? 'bg-gradient-to-br from-yellow-900/10 to-gray-800' : 'bg-gradient-to-br from-yellow-50 to-white';
            badgeColor = 'bg-yellow-500 text-white shadow-yellow-500/20';
          } else if (isSilver) {
            borderColor = 'border-blue-400/30';
            bgGradient = darkMode ? 'bg-gradient-to-br from-blue-900/10 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-white';
            badgeColor = 'bg-gray-400 text-white';
          } else if (isBronze) {
            borderColor = 'border-orange-600/30';
            bgGradient = darkMode ? 'bg-gradient-to-br from-orange-900/10 to-gray-800' : 'bg-gradient-to-br from-orange-50 to-white';
            badgeColor = 'bg-orange-600 text-white';
          }

          const percent = (product.unitsSold / maxSold) * 100;

          return (
            <div 
              key={product.id} 
              className={`relative p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${bgGradient} ${borderColor}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs shadow-sm ${badgeColor}`}>
                  {isGold ? <Crown size={12} /> : `#${index + 1}`}
                </div>
                {isGold && <Sparkles className="text-yellow-500 animate-pulse" size={14} />}
              </div>

              <h4 className={`font-bold text-sm mb-0.5 truncate ${darkMode ? 'text-white' : 'text-gray-900'}`} title={product.name}>
                {product.name}
              </h4>
              <p className="text-[10px] text-gray-400 mb-3">Rev: ₹{product.revenue.toLocaleString()}</p>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 mb-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    isGold ? 'bg-yellow-500' : isSilver ? 'bg-blue-400' : isBronze ? 'bg-orange-500' : 'bg-indigo-500'
                  }`} 
                  style={{ width: `${percent}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-end">
                <span className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {product.unitsSold}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 pb-1">Units</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function StatsDashboard({ products, darkMode }) {
  
  const [shouldAnimate, setShouldAnimate] = useState(true);

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
      
      {/* 1. REVENUE */}
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

      {/* 2. UNITS */}
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

      {/* 3. TOP PRODUCTS (Now Unified Card) */}
      <TopProductsCard products={products} darkMode={darkMode} />

      {/* 4. STOCK STATUS */}
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