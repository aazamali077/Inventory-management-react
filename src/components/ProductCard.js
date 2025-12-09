import React, { useState } from 'react';
import { Edit2, Trash2, Save, AlertTriangle, Plus, Tag } from 'lucide-react';

export default function ProductCard({ product, onUpdate, onDelete, onRestock, darkMode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(product);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const getPlatformSales = (platform) => product.sales.filter(s => s.platform === platform).reduce((sum, s) => sum + s.quantity, 0);
  const totalSold = product.sales.reduce((sum, s) => sum + s.quantity, 0);
  const totalRevenue = totalSold * (parseFloat(product.price) || 0);

  // Styling helpers
  const inputClass = `p-2 border rounded-lg w-full text-sm ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`;
  const isLowStock = product.totalStock <= product.lowStockThreshold && product.totalStock > 0;
  const isOutOfStock = product.totalStock === 0;

  // --- EDIT MODE ---
  if (isEditing) {
    return (
      <div className={`border-2 rounded-2xl p-4 shadow-xl flex flex-col gap-3 relative z-10 ${darkMode ? 'bg-gray-800 border-indigo-500' : 'bg-white border-indigo-100'}`}>
        <h4 className={`font-bold text-sm ${darkMode ? 'text-indigo-400' : 'text-indigo-900'}`}>Edit Product</h4>
        <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className={inputClass} placeholder="Name" />
        <input type="text" value={editData.sku} onChange={(e) => setEditData({...editData, sku: e.target.value})} className={inputClass} placeholder="SKU" />
        <div className="grid grid-cols-2 gap-2">
          <input type="number" value={editData.price} onChange={(e) => setEditData({...editData, price: parseFloat(e.target.value)})} className={inputClass} placeholder="Price" />
          <input type="number" value={editData.totalStock} onChange={(e) => setEditData({...editData, totalStock: parseInt(e.target.value)})} className={inputClass} placeholder="Stock" />
        </div>
        <div className="flex gap-2 mt-2">
          <button onClick={() => setIsEditing(false)} className={`flex-1 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium flex justify-center items-center gap-1"><Save size={14} /> Save</button>
        </div>
      </div>
    );
  }

  // --- VIEW MODE (Fixed Backgrounds) ---
  
  // Logic: We rely on BORDERS to show status, keeping the background SOLID to prevent glitches.
  let borderClass = darkMode ? 'border-gray-700' : 'border-gray-100'; // Default
  if (isOutOfStock) borderClass = darkMode ? 'border-red-600' : 'border-red-300';
  else if (isLowStock) borderClass = darkMode ? 'border-amber-600' : 'border-amber-300';

  return (
    <div className={`flex flex-col h-full rounded-2xl p-5 border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group relative ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } ${borderClass}`}>
      
      {/* 1. Header: Name & Menu */}
      <div className="flex justify-between items-start mb-3">
        <h3 className={`font-bold text-lg leading-tight line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`} title={product.name}>
          {product.name}
        </h3>
        <div className="flex gap-1 -mr-2">
          <button onClick={() => setIsEditing(true)} className={`p-1.5 rounded-lg transition ${darkMode ? 'text-gray-500 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`}><Edit2 size={16} /></button>
          <button onClick={() => onDelete(product.id)} className={`p-1.5 rounded-lg transition ${darkMode ? 'text-gray-500 hover:text-red-400 hover:bg-gray-700' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}><Trash2 size={16} /></button>
        </div>
      </div>

      {/* 2. Sub-header: SKU & Category */}
      <div className="flex items-center gap-2 mb-4 text-xs font-medium">
        <span className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
          {product.sku}
        </span>
        <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Tag size={12} /> {product.category}
        </span>
      </div>

      {/* 3. Alerts (Using solid badges instead of full card tint) */}
      {(isLowStock || isOutOfStock) && (
        <div className={`mb-4 px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-bold ${
          isOutOfStock 
            ? (darkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-700')
            : (darkMode ? 'bg-amber-900 text-amber-100' : 'bg-amber-100 text-amber-700')
        }`}>
          <AlertTriangle size={14} />
          {isOutOfStock ? 'Out of Stock!' : 'Low Stock Warning'}
        </div>
      )}

      {/* 4. Main Stats (Stock & Revenue) */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">In Stock</p>
          <p className={`text-xl font-extrabold ${isOutOfStock ? 'text-red-500' : (darkMode ? 'text-white' : 'text-gray-900')}`}>
            {product.totalStock}
          </p>
        </div>
        <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Revenue</p>
          <p className="text-xl font-extrabold text-emerald-500">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 5. Platform Grid (Footer) */}
      <div className="mt-auto">
        <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Platform Sales</p>
        <div className="grid grid-cols-4 gap-1 text-center">
          <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className="text-[9px] text-gray-400">Amz</p>
            <p className={`font-bold text-xs ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{getPlatformSales('Amazon')}</p>
          </div>
          <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className="text-[9px] text-gray-400">Flip</p>
            <p className={`font-bold text-xs ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{getPlatformSales('Flipkart')}</p>
          </div>
          <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className="text-[9px] text-gray-400">Mee</p>
            <p className={`font-bold text-xs ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{getPlatformSales('Meesho')}</p>
          </div>
          <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className="text-[9px] text-gray-400">Off</p>
            <p className={`font-bold text-xs ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{getPlatformSales('Offline')}</p>
          </div>
        </div>
      </div>

      {/* 6. Restock Overlay */}
      {(isLowStock || isOutOfStock) && (
        <button 
          onClick={() => onRestock(product.id)} 
          className={`mt-4 w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition shadow-md ${
            darkMode ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          <Plus size={16} /> Restock ({product.restockQuantity})
        </button>
      )}

    </div>
  );
}