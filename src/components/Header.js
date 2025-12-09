import React from 'react';
import { Package, Download, Upload, Plus, Moon, Sun, CheckCircle2 } from 'lucide-react';

export default function Header({ 
  onDownload, 
  onLoad, 
  onAddClick, 
  darkMode, 
  toggleTheme,
  isSaving
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
        
        {/* Status Indicator */}
        <div className={`mt-2 font-medium flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>Overview of your stock & sales performance</span>
          <span className="mx-2 text-gray-300">|</span>
          {isSaving ? (
            <span className="text-indigo-500 flex items-center gap-1 text-sm font-bold animate-pulse">
              Saving...
            </span>
          ) : (
            <span className="text-emerald-500 flex items-center gap-1 text-sm font-bold">
              <CheckCircle2 size={14} /> Auto-Save Active
            </span>
          )}
        </div>
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

        {/* Backup (Export) */}
        <button 
          onClick={onDownload} 
          className={`px-4 py-2.5 border font-semibold rounded-xl transition flex items-center gap-2 shadow-sm ${
            darkMode 
              ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700' 
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
          title="Download a backup copy to your computer"
        >
          <Download size={18} /> <span className="hidden sm:inline">Backup</span>
        </button>
        
        {/* Restore (Import) */}
        <label className={`px-4 py-2.5 border font-semibold rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer ${
            darkMode 
              ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700' 
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
          title="Restore data from a backup file"
        >
          <Upload size={18} /> <span className="hidden sm:inline">Restore</span>
          <input type="file" accept=".json" onChange={onLoad} className="hidden" />
        </label>

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