import React from 'react';
import { Package, Trash2, Plus, Edit2, Image as ImageIcon } from 'lucide-react';

export default function ProductCard({ product, onUpdate, onDelete, onRestock, onEdit, darkMode }) {
  
  const isLowStock = product.totalStock <= product.lowStockThreshold;
  const isOutOfStock = product.totalStock === 0;

  return (
    <div className={`group relative rounded-3xl p-5 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
      darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-100 hover:border-indigo-100'
    }`}>
      
      {/* --- HEADER: Image & Actions --- */}
      <div className="flex justify-between items-start mb-4">
        
        {/* Product Image or Placeholder */}
        <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <Package className={darkMode ? 'text-gray-500' : 'text-gray-400'} size={28} />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* EDIT BUTTON */}
          <button 
            onClick={() => onEdit(product)} 
            className={`p-2 rounded-xl transition ${
              darkMode ? 'bg-gray-700 text-blue-400 hover:bg-blue-900/30' : 'bg-gray-100 text-blue-600 hover:bg-blue-100'
            }`}
            title="Edit Product"
          >
            <Edit2 size={16} />
          </button>

          {/* DELETE BUTTON */}
          <button 
            onClick={() => onDelete(product.id)} 
            className={`p-2 rounded-xl transition ${
              darkMode ? 'bg-gray-700 text-red-400 hover:bg-red-900/30' : 'bg-gray-100 text-red-600 hover:bg-red-100'
            }`}
            title="Delete Product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div>
        <h3 className={`font-bold text-lg mb-1 truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{product.name}</h3>
        <p className={`text-xs font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>SKU: {product.sku}</p>
        
        <div className="flex justify-between items-center mb-4">
          <span className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{product.price}</span>
          <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
            isOutOfStock ? 'bg-red-100 text-red-700' :
            isLowStock ? 'bg-amber-100 text-amber-700' :
            (darkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700')
          }`}>
            {isOutOfStock ? 'No Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
          </div>
        </div>
      </div>

      {/* Stock Footer */}
      <div className={`pt-4 border-t flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <div>
          <span className={`block text-2xl font-black ${isOutOfStock ? 'text-red-500' : (darkMode ? 'text-white' : 'text-gray-900')}`}>
            {product.totalStock}
          </span>
          <span className="text-[10px] text-gray-400 font-bold uppercase">Units Left</span>
        </div>

        <button 
          onClick={() => onRestock(product.id)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            darkMode ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          <Plus size={14} /> Restock
        </button>
      </div>
      
    </div>
  );
}