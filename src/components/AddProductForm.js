import React, { useState, useEffect } from 'react';
import { Package, X, CheckCircle2, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function AddProductForm({ onSave, onCancel, initialData = null, darkMode }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Bedsheets',
    price: '',
    totalStock: '',
    lowStockThreshold: 10,
    image: '' // Stores Base64 string
  });

  const [error, setError] = useState('');

  // Pre-fill form if editing existing product
  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id, // Keep ID for updates
        name: initialData.name,
        sku: initialData.sku,
        category: initialData.category,
        price: initialData.price,
        totalStock: initialData.totalStock,
        lowStockThreshold: initialData.lowStockThreshold,
        image: initialData.image || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- IMAGE HANDLING LOGIC ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Check Size (Max 1MB = 1048576 bytes)
    if (file.size > 1048576) {
      alert("File is too large! Please choose an image under 1MB.");
      return;
    }

    // 2. Convert to Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.onerror = () => {
      alert("Failed to read file");
    };
  };

  const removeImage = () => {
    setFormData({ ...formData, image: '' });
  };
  // ----------------------------

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sku || !formData.price) {
      setError('Please fill all required fields');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4" onClick={onCancel}>
      <div 
        className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className={`p-6 border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
              <Package className="text-indigo-500" size={24} />
            </div>
            <div>
              <h3 className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {initialData ? 'Edit Product' : 'Add New Product'}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {initialData ? 'Update details or change image' : 'Fill in the details below'}
              </p>
            </div>
          </div>
          <button onClick={onCancel} className={`p-2 rounded-full transition ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          
          {/* --- IMAGE UPLOAD SECTION --- */}
          <div className="mb-6 flex flex-col items-center">
             <div className={`relative w-32 h-32 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all group ${
               formData.image 
                 ? (darkMode ? 'border-indigo-500' : 'border-indigo-500') 
                 : (darkMode ? 'border-gray-700 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400')
             }`}>
               
               {formData.image ? (
                 <>
                   <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                   {/* Remove Button Overlay */}
                   <button 
                     type="button"
                     onClick={removeImage}
                     className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                   >
                     <Trash2 size={24} />
                   </button>
                 </>
               ) : (
                 <div className="text-center pointer-events-none">
                   <ImageIcon className={`mx-auto mb-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} size={24} />
                   <span className={`text-[10px] font-bold uppercase ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>Add Image</span>
                 </div>
               )}

               {/* Invisible Input */}
               {!formData.image && (
                 <input 
                   type="file" 
                   accept="image/*" 
                   onChange={handleImageUpload} 
                   className="absolute inset-0 opacity-0 cursor-pointer"
                 />
               )}
             </div>
             <p className="text-[10px] text-gray-500 mt-2 font-medium">Max size: 1MB</p>
          </div>
          {/* --------------------------- */}

          <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} placeholder="e.g. Cotton King Sheet" />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">SKU Code</label>
                <input type="text" name="sku" value={formData.sku} onChange={handleChange} className={`w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} placeholder="e.g. BEDS-001" />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className={`w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                  <option>Bedsheets</option>
                  <option>Curtains</option>
                  <option>Towels</option>
                  <option>Pillows</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Selling Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className={`w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} placeholder="0.00" />
              </div>

              {/* Total Stock */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Initial Stock</label>
                <input type="number" name="totalStock" value={formData.totalStock} onChange={handleChange} className={`w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} placeholder="0" />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t flex justify-end gap-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
          <button onClick={onCancel} className={`px-6 py-2.5 font-bold rounded-xl transition ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}>
            Cancel
          </button>
          <button 
            type="submit"
            form="product-form"
            className={`px-6 py-2.5 rounded-xl font-bold transition shadow-lg hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-2 ${
              darkMode ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            <CheckCircle2 size={20} /> {initialData ? 'Update Product' : 'Save Product'}
          </button>
        </div>

      </div>
    </div>
  );
}