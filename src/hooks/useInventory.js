import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/products';

export const useInventory = () => {
  const [products, setProducts] = useState([]);

  // ... existing fetchProducts ...
  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const formattedData = data.map(item => ({ ...item, id: item._id }));
      setProducts(formattedData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  
  useEffect(() => { fetchProducts(); }, []);

  // ... existing addProduct, updateProduct, deleteProduct, restockProduct ...
  
  // (Keep your existing functions here: addProduct, updateProduct, deleteProduct, etc.)
  // I am hiding them to save space, but DO NOT DELETE THEM.

  const addProduct = async (newProduct) => { /* ... existing code ... */ };
  const updateProduct = (updatedProduct) => { /* ... existing code ... */ };
  const deleteProduct = async (id) => { /* ... existing code ... */ };
  const restockProduct = (id) => { /* ... existing code ... */ };

  // ... existing recordSale ...
  const recordSale = (saleData) => {
    const product = products.find(p => p.id === saleData.productId);
    if (!product) return;

    const newStock = product.totalStock - parseInt(saleData.quantity);
    if (newStock < 0) return alert('Not enough stock!');

    const newSaleEntry = {
      id: Date.now().toString(),
      platform: saleData.platform,
      quantity: parseInt(saleData.quantity),
      date: saleData.date,
      timestamp: new Date().toISOString()
    };

    const updatedData = {
      totalStock: newStock,
      sales: [...product.sales, newSaleEntry]
    };

    // Helper to update backend
    const updateBackend = async () => {
        try {
            await fetch(`${API_URL}/${saleData.productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });
            // Update local state
            setProducts(prev => prev.map(p => p.id === saleData.productId ? { ...p, ...updatedData } : p));
        } catch (err) { console.error(err); }
    };
    updateBackend();
  };

  // --- NEW: DELETE SALE FUNCTION ---
  const deleteSale = async (productId, saleId) => {
    if (!window.confirm('Are you sure you want to delete this sale record? Stock will be restored.')) return;

    try {
      const response = await fetch(`${API_URL}/${productId}/sales/${saleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // The server returns the updated product with stock restored
        const updatedProductData = await response.json();
        // Fix _id to id mapping for the single item
        const fixedProduct = { ...updatedProductData, id: updatedProductData._id };
        
        // Update state
        setProducts(prev => prev.map(p => p.id === productId ? fixedProduct : p));
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
      alert("Failed to delete sale");
    }
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    restockProduct,
    recordSale,
    deleteSale // Export the new function
  };
};