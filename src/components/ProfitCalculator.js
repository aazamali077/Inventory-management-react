import React, { useState, useEffect } from 'react';
import { Calculator, X, TrendingUp, DollarSign } from 'lucide-react';

export default function ProfitCalculator({ isOpen, onClose, darkMode }) {
  const [activeTab, setActiveTab] = useState('profit'); 
  const [values, setValues] = useState({
    costPrice: '',
    sellingPrice: '',
    ads: 0,
    packaging: 0,
    rto: 0, 
    gst: 12, 
    misc: 0,
    desiredProfit: ''
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  useEffect(() => {
    const { costPrice, sellingPrice, ads, packaging, rto, gst, misc, desiredProfit } = values;
    const cp = parseFloat(costPrice) || 0;
    const expenses = parseFloat(ads) + parseFloat(packaging) + parseFloat(rto) + parseFloat(misc);

    if (activeTab === 'profit') {
      const sp = parseFloat(sellingPrice) || 0;
      if (sp > 0 && cp > 0) {
        const gstAmount = sp - (sp / (1 + (gst / 100)));
        const totalCost = cp + expenses + gstAmount;
        const netProfit = sp - totalCost;
        const margin = (netProfit / sp) * 100;

        setResult({ 
          value: netProfit.toFixed(2), 
          label: 'Net Profit', 
          isGood: netProfit > 0,
          details: `GST: ₹${gstAmount.toFixed(2)} | Margin: ${margin.toFixed(1)}%`
        });
      } else {
        setResult(null);
      }
    } else {
      const profit = parseFloat(desiredProfit) || 0;
      if (cp > 0 && profit > 0) {
        const baseCost = cp + expenses + profit;
        const suggestedSP = baseCost * (1 + (gst / 100));
        setResult({ 
          value: suggestedSP.toFixed(2), 
          label: 'Suggested Selling Price', 
          isGood: true,
          details: `Break-even: ₹${(baseCost * (1+(gst/100)) - profit).toFixed(2)}`
        });
      } else {
        setResult(null);
      }
    }
  }, [values, activeTab]);

  // REMOVED: if (!isOpen) return null; -> Now we keep it mounted for animation

  return (
    // Outer Container: Handles positioning and visibility
    <div className={`fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:justify-start sm:pl-24 p-4 pointer-events-none transition-all duration-300 ${
      isOpen ? 'opacity-100 visible' : 'opacity-0 invisible delay-200'
    }`}>
      
      {/* Inner Card: Handles the Slide/Scale (Wrap/Unwrap) Animation */}
      <div 
        className={`w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden border transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) origin-bottom-left ${
          darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        } ${
          isOpen 
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
            : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
        }`}
      >
        
        {/* Header */}
        <div className={`p-5 flex justify-between items-center border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-indigo-600 text-white'}`}>
          <div className="flex items-center gap-2">
            <Calculator size={20} className={darkMode ? 'text-indigo-400' : 'text-white'} />
            <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-white'}`}>Profit Calculator</h3>
          </div>
          <button 
            onClick={onClose} 
            className={`p-1 rounded-full transition ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-indigo-500 text-white'}`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex p-1 m-4 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <button
            onClick={() => setActiveTab('profit')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'profit' 
                ? (darkMode ? 'bg-indigo-600 text-white shadow' : 'bg-white text-indigo-600 shadow ring-1 ring-gray-200')
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Find Net Profit
          </button>
          <button
            onClick={() => setActiveTab('price')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'price' 
                ? (darkMode ? 'bg-indigo-600 text-white shadow' : 'bg-white text-indigo-600 shadow ring-1 ring-gray-200')
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Find Selling Price
          </button>
        </div>

        {/* Inputs Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 pt-0 custom-scrollbar max-h-[50vh]">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">Cost Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-xs">₹</span>
                  <input type="number" name="costPrice" value={values.costPrice} onChange={handleChange} className={`w-full pl-6 p-2 rounded-lg border text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`} placeholder="0" />
                </div>
              </div>

              {activeTab === 'profit' ? (
                <div className="col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-1 block">Selling Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-xs">₹</span>
                    <input type="number" name="sellingPrice" value={values.sellingPrice} onChange={handleChange} className={`w-full pl-6 p-2 rounded-lg border text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-800 border-indigo-500/50 text-white' : 'bg-white border-indigo-300'}`} placeholder="0" />
                  </div>
                </div>
              ) : (
                <div className="col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1 block">Desired Profit</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-xs">₹</span>
                    <input type="number" name="desiredProfit" value={values.desiredProfit} onChange={handleChange} className={`w-full pl-6 p-2 rounded-lg border text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 ${darkMode ? 'bg-gray-800 border-emerald-500/50 text-white' : 'bg-white border-emerald-300'}`} placeholder="0" />
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs font-bold text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-1 mt-4">Expenses Per Unit</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Ads Cost', name: 'ads' },
                { label: 'Packaging', name: 'packaging' },
                { label: 'Misc', name: 'misc' },
                { label: 'Est. RTO Loss', name: 'rto' },
                { label: 'GST %', name: 'gst' },
              ].map((field) => (
                <div key={field.name} className={`${field.name === 'gst' || field.name === 'rto' ? 'col-span-1.5' : 'col-span-1'}`}>
                  <label className="text-[10px] font-bold text-gray-500 mb-1 block">{field.label}</label>
                  <input 
                    type="number" 
                    name={field.name} 
                    value={values[field.name]} 
                    onChange={handleChange} 
                    className={`w-full p-2 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-indigo-500 ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Result Footer */}
        <div className={`p-6 border-t ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
          {result ? (
            <div className="flex justify-between items-center animate-in slide-in-from-bottom duration-300">
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{result.label}</p>
                <h2 className={`text-3xl font-extrabold ${result.isGood ? 'text-emerald-500' : 'text-red-500'}`}>
                  ₹{result.value}
                </h2>
                <p className="text-[10px] font-medium text-gray-400 mt-1">{result.details}</p>
              </div>
              <div className={`p-3 rounded-full ${result.isGood ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {activeTab === 'profit' ? <TrendingUp size={24} /> : <DollarSign size={24} />}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 text-sm py-2">
              Enter values to see result
            </div>
          )}
        </div>

      </div>
    </div>
  );
}