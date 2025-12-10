import React, { useState, useEffect } from 'react';
import { useInventory } from './hooks/useInventory';
import Header from './components/Header';
import StatsDashboard from './components/StatsDashboard';
import AddProductForm from './components/AddProductForm';
import SalesHistoryModal from './components/SalesHistoryModal';
import RecordSaleModal from './components/RecordSaleModal';
import ProductCard from './components/ProductCard';
import { Layers, Package, ShoppingCart, Plus, History, ClipboardList, TrendingUp } from 'lucide-react';

export default function InventoryManagement() {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    restockProduct, 
    recordSale, 
    downloadInventoryFile, 
    loadInventoryFile,
    isSaving,
    fileHandle,
    isFileSystemSupported,
    connectToLocalFile,
    deleteSale
  } = useInventory();

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showRecordSale, setShowRecordSale] = useState(false);
  const [activeTab, setActiveTab] = useState('overall');
  const [darkMode, setDarkMode] = useState(true);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingBtn(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'amazon': return products.filter(p => p.sales.some(s => s.platform === 'Amazon'));
      case 'flipkart': return products.filter(p => p.sales.some(s => s.platform === 'Flipkart'));
      case 'meesho': return products.filter(p => p.sales.some(s => s.platform === 'Meesho'));
      case 'low': return products.filter(p => p.totalStock <= p.lowStockThreshold);
      case 'out': return products.filter(p => p.totalStock === 0);
      default: return products;
    }
  };

  const tabs = [
    { id: 'overall', label: 'All Products' },
    // { id: 'amazon', label: 'Amazon' },
    // { id: 'flipkart', label: 'Flipkart' },
    // { id: 'meesho', label: 'Meesho' },
    { id: 'low', label: 'Low Stock' },
    { id: 'out', label: 'Out of Stock' },
  ];

  return (
    <div className={`min-h-screen p-6 font-sans relative ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <Header 
          onDownload={downloadInventoryFile} 
          onLoad={loadInventoryFile} 
          onAddClick={() => setShowAddProduct(true)} 
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          isSaving={isSaving}
          fileHandle={fileHandle}
          isFileSystemSupported={isFileSystemSupported}
          onConnectFile={connectToLocalFile}
        />

        {/* Stats */}
        <StatsDashboard products={products} darkMode={darkMode} />

        {/* --- NEW ACTION BAR (Between Stats and Filters) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Record Sale - Big Action Card */}
            <button 
              onClick={() => setShowRecordSale(true)}
              className={`relative overflow-hidden group p-4 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-left flex items-center justify-between ${
                darkMode 
                  ? 'bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border-emerald-500/30 hover:border-emerald-400/50' 
                  : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-300'
              }`}
            >
              <div>
                <h3 className={`text-lg font-extrabold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                   Record Sale
                </h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>Log a new transaction instantly</p>
              </div>
              <div className={`p-3 rounded-full shadow-lg ${darkMode ? 'bg-emerald-600 text-white' : 'bg-emerald-500 text-white'}`}>
                 <ClipboardList size={24} />
              </div>
            </button>

            {/* Sales History - Big Action Card */}
            <button 
              onClick={() => setShowHistory(true)}
              className={`relative overflow-hidden group p-4 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-left flex items-center justify-between ${
                darkMode 
                  ? 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-500/30 hover:border-indigo-400/50' 
                  : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 hover:border-indigo-300'
              }`}
            >
               <div>
                <h3 className={`text-lg font-extrabold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                   Sales History
                </h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>View and manage past records</p>
              </div>
              <div className={`p-3 rounded-full shadow-lg ${darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'}`}>
                 <History size={24} />
              </div>
            </button>

        </div>


        {/* Main Content Area */}
        <div>
          
          {/* TABS (Filters) - Now separated from buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 p-1 no-scrollbar w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap border ${
                    activeTab === tab.id 
                      ? (darkMode ? 'bg-gray-100 text-gray-900 border-gray-100 shadow-md transform scale-105' : 'bg-gray-900 text-white border-gray-900 shadow-md transform scale-105')
                      : (darkMode ? 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-gray-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-800')
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Live Count Badge (Moved here) */}
            {products.length > 0 && (
                <div className={`hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
                    <Layers size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Total Items: {getFilteredProducts().length}</span>
                </div>
            )}
          </div>

          {/* --- MODALS --- */}
          {showRecordSale && (
            <RecordSaleModal 
              products={products} 
              onRecordSale={recordSale} 
              onClose={() => setShowRecordSale(false)}
              darkMode={darkMode} 
            />
          )}

          {showAddProduct && (
            <AddProductForm 
              onSave={(data) => { addProduct(data); setShowAddProduct(false); }} 
              onCancel={() => setShowAddProduct(false)} 
              darkMode={darkMode}
            />
          )}

          {showHistory && (
            <SalesHistoryModal 
              products={products}
              onClose={() => setShowHistory(false)}
              onDeleteSale={deleteSale}
              darkMode={darkMode}
            />
          )}

          {/* --- PRODUCT GRID --- */}
          <div className="space-y-4">
            
            {getFilteredProducts().length === 0 ? (
              <div className={`text-center py-16 rounded-3xl border border-dashed ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  {activeTab === 'overall' ? <Package className="text-gray-400" size={32} /> : <ShoppingCart className="text-gray-400" size={32} />}
                </div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>No products found</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {activeTab === 'overall' ? "Get started by adding your first product." : `No items found in ${activeTab}.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {getFilteredProducts().map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onUpdate={updateProduct}
                    onDelete={deleteProduct}
                    onRestock={restockProduct}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddProduct(true)}
        className={`fixed bottom-8 right-8 p-4 rounded-full shadow-2xl z-40 transition-all duration-300 transform flex items-center gap-2 font-bold ${
          showFloatingBtn 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-20 opacity-0 pointer-events-none'
        } ${darkMode ? 'bg-indigo-500 text-white hover:bg-indigo-400' : 'bg-gray-900 text-white hover:bg-black'}`}
      >
        <Plus size={24} />
        <span className="hidden md:inline">Add Product</span>
      </button>

    </div>
  );
}