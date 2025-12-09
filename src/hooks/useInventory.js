import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/products';

export const useInventory = () => {
  const [products, setProducts] = useState([]);

  // --- 1. FETCH (GET) ---
  useEffect(() => {
    fetchProducts();
  }, []);

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

  // --- 2. ADD (POST) ---
  const addProduct = async (newProduct) => {
    try {
      const productPayload = {
        ...newProduct,
        price: parseFloat(newProduct.price) || 0,
        totalStock: parseInt(newProduct.totalStock) || 0,
        lowStockThreshold: parseInt(newProduct.lowStockThreshold) || 10,
        restockQuantity: parseInt(newProduct.restockQuantity) || 50,
        sales: []
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload),
      });

      if (response.ok) {
        fetchProducts(); 
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // --- 3. UPDATE (PUT) ---
  const updateProductInBackend = async (id, updatedFields) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      // Optimistic Update
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const updateProduct = (updatedProduct) => {
    updateProductInBackend(updatedProduct.id, updatedProduct);
  };

  // --- 4. DELETE (DELETE) ---
  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // --- 5. RESTOCK ---
  const restockProduct = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const updatedData = { 
      totalStock: product.totalStock + product.restockQuantity 
    };
    
    updateProductInBackend(id, updatedData);
  };

  // --- 6. RECORD SALE ---
  const recordSale = (saleData) => {
    const product = products.find(p => p.id === saleData.productId);
    if (!product) return;

    const newStock = product.totalStock - parseInt(saleData.quantity);
    if (newStock < 0) {
      alert('Not enough stock available!');
      return;
    }

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

    updateProductInBackend(saleData.productId, updatedData);
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    restockProduct,
    recordSale
  };
};