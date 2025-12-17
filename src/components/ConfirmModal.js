import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, darkMode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={onCancel}>
      <div 
        className={`w-full max-w-sm rounded-2xl shadow-2xl p-6 transform scale-100 transition-all ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
            <AlertTriangle size={24} />
          </div>
          <h3 className={`text-lg font-extrabold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{message}</p>
          
          <div className="flex gap-3 w-full">
            <button 
              onClick={onCancel}
              className={`flex-1 py-2.5 rounded-xl font-bold transition ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 shadow-lg transition"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}