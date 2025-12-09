import React, { useState } from 'react';
import { X } from 'lucide-react';

// ✅ FIX: Defined OUTSIDE the main component to prevent focus loss
const InputField = ({ label, type = "text", value, onChange, placeholder, darkMode }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition font-medium ${
        darkMode 
          ? 'bg-gray-900 border-gray-700 text-white focus:bg-gray-800' 
          : 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white'
      }`}
    />
  </div>
);

export default function AddProductForm({ onSave, onCancel, darkMode }) {
  const [formData, setFormData] = useState({
    name: '', sku: '', category: 'Bedsheets', price: '',
    totalStock: 0, lowStockThreshold: 10, restockQuantity: 50
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.sku) return alert('Please fill in product name and SKU');
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className={`rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={`px-8 py-6 border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <h3 className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Add New Product</h3>
          <button onClick={onCancel} className={`p-2 rounded-full transition ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'}`}><X size={24} /></button>
        </div>

        {/* Form Body */}
        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <InputField 
                  label="Product Name" 
                  value={formData.name} 
                  onChange={(e) => handleChange('name', e.target.value)} 
                  placeholder="e.g. King Size Cotton Sheet" 
                  darkMode={darkMode} // Passing darkMode prop
                />
            </div>
            
            <InputField 
              label="SKU ID" 
              value={formData.sku} 
              onChange={(e) => handleChange('sku', e.target.value)} 
              darkMode={darkMode}
            />
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
              <select 
                value={formData.category} 
                onChange={(e) => handleChange('category', e.target.value)} 
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition font-medium ${
                  darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              >
                <option value="Bedsheets">Bedsheets</option>
                <option value="Pillow Covers">Pillow Covers</option>
                <option value="Curtains">Curtains</option>
                <option value="Towels">Towels</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <InputField label="Price (₹)" type="number" placeholder="0.00" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} darkMode={darkMode} />
            <InputField label="Initial Stock" type="number" value={formData.totalStock} onChange={(e) => handleChange('totalStock', e.target.value)} darkMode={darkMode} />
            <InputField label="Low Stock Limit" type="number" value={formData.lowStockThreshold} onChange={(e) => handleChange('lowStockThreshold', e.target.value)} darkMode={darkMode} />
            <InputField label="Restock Qty" type="number" value={formData.restockQuantity} onChange={(e) => handleChange('restockQuantity', e.target.value)} darkMode={darkMode} />
          </div>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t flex justify-end gap-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
          <button onClick={onCancel} className={`px-6 py-2.5 font-bold rounded-xl transition ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}>Cancel</button>
          <button onClick={handleSubmit} className="px-6 py-2.5 bg-indigo-600 text-white font-bold hover:bg-indigo-700 rounded-xl shadow-lg transition transform active:scale-95">Add Product</button>
        </div>

      </div>
    </div>
  );
}