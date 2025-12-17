import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/products';

export const useInventory = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => { fetchProducts(); }, []);

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
        return true; // Success
      }
    } catch (error) {
      console.error("Error adding product:", error);
      return false;
    }
  };

  const updateProductInBackend = async (id, updatedFields) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
      return true;
    } catch (error) {
      console.error("Error updating product:", error);
      return false;
    }
  };

  const updateProduct = (updatedProduct) => {
    return updateProductInBackend(updatedProduct.id, updatedProduct);
  };

  const deleteProduct = async (id) => {
    // Note: window.confirm removed. UI handles it now.
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  };

  const restockProduct = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return false;
    const updatedData = { totalStock: product.totalStock + product.restockQuantity };
    return updateProductInBackend(id, updatedData);
  };

  const recordSale = (saleData) => {
    const product = products.find(p => p.id === saleData.productId);
    if (!product) return false;

    const newStock = product.totalStock - parseInt(saleData.quantity);
    if (newStock < 0) return 'low_stock'; // Special return for error handling

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

    return updateProductInBackend(saleData.productId, updatedData);
  };

  const deleteSale = async (productId, saleId) => {
     // Note: window.confirm removed. UI handles it now.
    try {
      const response = await fetch(`${API_URL}/${productId}/sales/${saleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedProductData = await response.json();
        const fixedProduct = { ...updatedProductData, id: updatedProductData._id };
        setProducts(prev => prev.map(p => p.id === productId ? fixedProduct : p));
        return true;
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
      return false;
    }
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    restockProduct,
    recordSale,
    deleteSale
  };
};