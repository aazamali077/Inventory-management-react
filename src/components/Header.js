import React from 'react';
import { Package, Plus, Moon, Sun } from 'lucide-react';

export default function Header({ 
  onAddClick, 
  darkMode, 
  toggleTheme
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className={`text-3xl font-extrabold tracking-tight flex items-center gap-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <Package size={28} />
          </div>
          Inventory<span className="text-indigo-600">Manager</span>
        </h1>
        <p className={`mt-2 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Overview of your stock & sales performance
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2.5 border rounded-xl transition flex items-center justify-center shadow-sm ${
            darkMode 
              ? 'bg-gray-800 border-gray-700 text-yellow-400 hover:bg-gray-700' 
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
          title="Toggle Theme"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Add Product */}
        <button 
          onClick={onAddClick} 
          className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg shadow-indigo-500/30 transform active:scale-95"
        >
          <Plus size={20} /> New Product
        </button>
      </div>
    </div>
  );
}