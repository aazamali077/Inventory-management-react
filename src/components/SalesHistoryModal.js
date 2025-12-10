import React, { useState } from 'react';
import { X, Trash2, Calendar, Search } from 'lucide-react';

export default function SalesHistoryModal({ products, onClose, onDeleteSale, darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Flatten all sales into one big list
  const allSales = products.flatMap(product => 
    product.sales.map(sale => ({
      ...sale,
      productName: product.name,
      productId: product.id,
      price: product.price // to calculate revenue
    }))
  );

  // 2. Sort by Date (Newest first)
  const sortedSales = allSales.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 3. Filter
  const filteredSales = sortedSales.filter(sale => 
    sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className={`w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className={`p-6 border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div>
            <h3 className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sales History</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>View and manage all recorded transactions</p>
          </div>
          <button onClick={onClose} className={`p-2 rounded-full transition ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by product name or platform..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 p-2.5 rounded-xl outline-none border transition ${
                darkMode ? 'bg-gray-900 border-gray-600 text-white focus:border-indigo-500' : 'bg-white border-gray-200 focus:border-indigo-500'
              }`}
            />
          </div>
        </div>

        {/* Table Header */}
        <div className={`grid grid-cols-12 gap-4 p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          <div className="col-span-4">Product</div>
          <div className="col-span-2">Platform</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2 text-center">Qty / Rev</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredSales.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
              <Calendar size={48} className="mb-2" />
              <p>No sales records found.</p>
            </div>
          ) : (
            filteredSales.map((sale) => (
              <div 
                key={sale.id} // Sale ID is unique
                className={`grid grid-cols-12 gap-4 p-4 items-center border-b transition hover:bg-opacity-50 ${
                  darkMode ? 'border-gray-800 hover:bg-gray-800 text-gray-300' : 'border-gray-50 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {/* Product Name */}
                <div className="col-span-4 font-medium truncate" title={sale.productName}>
                  {sale.productName}
                </div>

                {/* Platform Badge */}
                <div className="col-span-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    sale.platform === 'Amazon' ? 'bg-orange-100 text-orange-700' :
                    sale.platform === 'Flipkart' ? 'bg-blue-100 text-blue-700' :
                    sale.platform === 'Meesho' ? 'bg-pink-100 text-pink-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {sale.platform}
                  </span>
                </div>

                {/* Date */}
                <div className="col-span-2 text-sm">
                  {sale.date}
                </div>

                {/* Stats */}
                <div className="col-span-2 text-center">
                  <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{sale.quantity} Units</div>
                  <div className="text-xs text-emerald-500 font-bold">₹{(sale.quantity * sale.price).toLocaleString()}</div>
                </div>

                {/* Action */}
                <div className="col-span-2 text-right">
                  <button 
                    onClick={() => onDeleteSale(sale.productId, sale.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete Record (Restore Stock)"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}