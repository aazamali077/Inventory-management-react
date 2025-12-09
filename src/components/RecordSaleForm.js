import React, { useState } from 'react';
import { ShoppingCart, Calendar, Hash, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function RecordSaleForm({ products, onRecordSale, darkMode }) {
  const [form, setForm] = useState({
    productId: '', platform: 'Amazon', quantity: 1, date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = () => {
    if (!form.productId) return alert('Please select a product');
    onRecordSale(form);
    setForm(prev => ({ ...prev, quantity: 1, productId: '' })); 
  };

  const platforms = ['Amazon', 'Flipkart', 'Meesho', 'Offline'];

  return (
    <div className={`p-6 rounded-2xl shadow-sm border mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
      
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${darkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
          <ShoppingCart className="text-indigo-500" size={24} />
        </div>
        <div>
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Record New Sale</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Log a transaction to update inventory</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Product</label>
          <div className="relative">
            <select 
              value={form.productId} 
              onChange={(e) => setForm({...form, productId: e.target.value})} 
              className={`w-full p-3 pl-4 pr-10 border rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium ${
                darkMode ? 'bg-gray-900 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}
            >
              <option value="">Choose an item...</option>
              {products.map(p => (
                <option key={p.id} value={p.id} disabled={p.totalStock === 0}>
                  {p.name} — {p.totalStock} left {p.totalStock === 0 ? '(Out of Stock)' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
          </div>
        </div>

        <div className="lg:col-span-4">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Platform</label>
          <div className={`flex p-1 rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => setForm({...form, platform: p})}
                className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                  form.platform === p 
                    ? (darkMode ? 'bg-gray-700 text-indigo-400 shadow-sm' : 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-100')
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Qty</label>
            <div className="relative">
              <input 
                type="number" min="1" value={form.quantity} 
                onChange={(e) => setForm({...form, quantity: e.target.value})} 
                className={`w-full p-3 pl-9 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium ${
                  darkMode ? 'bg-gray-900 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
              <Hash className="absolute left-3 top-3.5 text-gray-400" size={16} />
            </div>
          </div>
          <div className="flex-[1.5]">
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date</label>
            <div className="relative">
              <input 
                type="date" value={form.date} 
                onChange={(e) => setForm({...form, date: e.target.value})} 
                className={`w-full p-3 pl-9 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium text-sm ${
                  darkMode ? 'bg-gray-900 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
              <Calendar className="absolute left-3 top-3.5 text-gray-400" size={16} />
            </div>
          </div>
        </div>

      </div>

      <button 
        onClick={handleSubmit} 
        className={`w-full mt-6 py-3 rounded-xl font-bold transition shadow-lg hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-2 ${
          darkMode ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        <CheckCircle2 size={20} /> Confirm Sale
      </button>

    </div>
  );
}