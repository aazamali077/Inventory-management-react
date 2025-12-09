import React, { useState, useEffect } from 'react';
import { useInventory } from './hooks/useInventory';
import Header from './components/Header';
import StatsDashboard from './components/StatsDashboard';
import AddProductForm from './components/AddProductForm';
import RecordSaleForm from './components/RecordSaleForm';
import ProductCard from './components/ProductCard';
import { Layers, Package, ShoppingCart, Plus } from 'lucide-react';

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
    connectToLocalFile
  } = useInventory();

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [activeTab, setActiveTab] = useState('overall');
  const [darkMode, setDarkMode] = useState(true);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false); // State for floating button

  const toggleTheme = () => setDarkMode(!darkMode);

  // Scroll Listener to toggle Floating Button
  useEffect(() => {
    const handleScroll = () => {
      // Show button if scrolled down more than 200px
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
    <div className={`min-h-screen p-6 font-sans transition-colors duration-300 relative ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
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

        {/* Main Content Area */}
        <div>
          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? (darkMode ? 'bg-indigo-600 text-white shadow-md transform scale-105' : 'bg-gray-900 text-white shadow-md transform scale-105')
                    : (darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200 hover:text-gray-700')
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Record Sale Form */}
          {products.length > 0 && (
            <RecordSaleForm products={products} onRecordSale={recordSale} darkMode={darkMode} />
          )}

          {/* Add Product Modal */}
          {showAddProduct && (
            <AddProductForm 
              onSave={(data) => { addProduct(data); setShowAddProduct(false); }} 
              onCancel={() => setShowAddProduct(false)} 
              darkMode={darkMode}
            />
          )}

          {/* --- PRODUCT GRID SECTION --- */}
          <div className="space-y-4">
            
            {/* Title Section */}
            {products.length > 0 && (
               <div className="flex items-center gap-2 mb-4">
                 <Layers className={darkMode ? 'text-indigo-400' : 'text-indigo-600'} size={24} />
                 <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Live Products</h2>
                 <span className={`text-sm px-2 py-0.5 rounded-full font-bold ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                   {getFilteredProducts().length}
                 </span>
               </div>
            )}

            {/* The Grid (4 columns) */}
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

      {/* --- FLOATING ACTION BUTTON (Visible on Scroll) --- */}
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