import { useState, useEffect } from 'react';

export const useInventory = () => {
  // 1. AUTOLOAD: Initialize state directly from Local Storage
  const [products, setProducts] = useState(() => {
    try {
      const savedData = localStorage.getItem('inventory_app_data');
      return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
      console.error("Error loading auto-saved data:", error);
      return [];
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  // 2. AUTOSAVE: Write to Local Storage whenever products change
  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem('inventory_app_data', JSON.stringify(products));
    
    // Tiny delay to let the UI show "Saving..."
    const timer = setTimeout(() => setIsSaving(false), 800);
    return () => clearTimeout(timer);
  }, [products]);

  // --- Manual Export (Backup) ---
  const downloadInventoryFile = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- Manual Import (Restore) ---
  const loadInventoryFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loadedData = JSON.parse(e.target.result);
          setProducts(loadedData);
          alert('Backup loaded successfully!');
        } catch (error) {
          alert('Error loading file. Invalid JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  // --- CRUD Operations ---
  const addProduct = (newProduct) => {
    const product = {
      id: Date.now().toString(),
      ...newProduct,
      price: parseFloat(newProduct.price) || 0,
      totalStock: parseInt(newProduct.totalStock) || 0,
      lowStockThreshold: parseInt(newProduct.lowStockThreshold) || 10,
      restockQuantity: parseInt(newProduct.restockQuantity) || 50,
      sales: [],
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const restockProduct = (id) => {
    setProducts(prev => prev.map(product => {
      if (product.id === id) {
        return { ...product, totalStock: product.totalStock + product.restockQuantity };
      }
      return product;
    }));
  };

  const recordSale = (saleData) => {
    setProducts(prev => prev.map(product => {
      if (product.id === saleData.productId) {
        const newStock = product.totalStock - parseInt(saleData.quantity);
        if (newStock < 0) {
          alert('Not enough stock available!');
          return product;
        }
        return {
          ...product,
          totalStock: newStock,
          sales: [...product.sales, {
            id: Date.now().toString(),
            platform: saleData.platform,
            quantity: parseInt(saleData.quantity),
            date: saleData.date,
            timestamp: new Date().toISOString()
          }]
        };
      }
      return product;
    }));
  };

  return {
    products,
    isSaving,
    addProduct,
    updateProduct,
    deleteProduct,
    restockProduct,
    recordSale,
    downloadInventoryFile,
    loadInventoryFile
  };
};