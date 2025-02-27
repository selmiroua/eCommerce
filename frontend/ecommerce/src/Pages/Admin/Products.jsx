import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaSave, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    stock: '',
    brand: '',
    color: '',
    size: '',
    featured: false,
    discount: '0'
  });
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const categories = {
    women: ['Robes', 'Pantalons', 'Accessoires', 'Chaussures'],
    men: ['T-shirts', 'Pantalons', 'Accessoires', 'Chaussures'],
  };

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching products...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login first');
      }

      const response = await axios.get('http://localhost:5000/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        // Prevent caching
        params: {
          _t: new Date().getTime()
        }
      });

      console.log('Received products:', response.data);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.response?.data?.message || error.message || 'Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: {
          'x-auth-token': token
        }
      });

      // Remove the product from the local state
      setProducts(products.filter(p => p._id !== productId));
      toast.success('Produit supprimé avec succès');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression du produit');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        editingProduct,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        }
      );

      // Update the product in the local state
      setProducts(products.map(p => 
        p._id === editingProduct._id ? response.data : p
      ));

      setIsEditModalOpen(false);
      setEditingProduct(null);
      toast.success('Produit mis à jour avec succès');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du produit');
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('L\'image est trop grande. Maximum 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.onerror = () => {
        toast.error('Erreur lors de la lecture de l\'image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simuler un délai

      if (selectedProduct) {
        const updatedProducts = products.map(p => 
          p._id === selectedProduct._id 
            ? { ...formData, _id: selectedProduct._id, images: imagePreview.length ? imagePreview : selectedProduct.images }
            : p
        );

        setProducts(updatedProducts);
        showNotification('Produit modifié avec succès');
      } else {
        const newProduct = {
          ...formData,
          _id: String(Date.now()),
          images: imagePreview.length ? imagePreview : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format']
        };
        setProducts([...products, newProduct]);
        showNotification('Produit ajouté avec succès');
      }
      
      resetForm();
    } catch (error) {
      showNotification('Erreur lors de l\'enregistrement', 'error');
    }
    setLoading(false);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setShowForm(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      subCategory: '',
      stock: '',
      brand: '',
      color: '',
      size: '',
      featured: false,
      discount: '0'
    });
    setImages([]);
    setImagePreview([]);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <button
          onClick={() => navigate('/admin/products/add')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          <FaPlus /> Nouveau Produit
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="w-64">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full border rounded-md py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Toutes les catégories</option>
            <option value="women">Femmes</option>
            <option value="men">Hommes</option>
          </select>
        </div>
      </div>

      {/* Notification avec animation */}
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transform transition-all duration-500 ${
          notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        } text-white max-w-md animate-fade-in-down`}>
          <div className="flex items-center">
            {notification.type === 'error' ? (
              <FaTimes className="mr-2" />
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {notification.message}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
  {filteredProducts.map((product) => (
    <tr key={product._id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-20 w-20">
            {product.image ? (
              <img
                className="h-20 w-20 object-cover rounded-md"
                src={`http://localhost:5000${product.image}`} // Use absolute URL
                alt={product.name}
                onError={(e) => {
                  console.error('Image load error:', e);
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x400?text=Image+non+disponible';
                }}
              />
            ) : (
              <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded-md">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">{product.name}</td>
      <td className="px-6 py-4">${product.price}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {product.stock}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-1">
          <div>{product.category}</div>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => handleEdit(product)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Modifier
          </button>
          <button
            onClick={() => handleDelete(product._id)}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">Modifier le produit</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={editingProduct.description}
                  onChange={handleEditInputChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prix</label>
                  <input
                    type="number"
                    name="price"
                    value={editingProduct.price}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={editingProduct.stock}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                <select
                  name="category"
                  value={editingProduct.category}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="robes">Robes</option>
                  <option value="pantalons">Pantalons</option>
                  <option value="accessoires">Accessoires</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <div className="mt-1 flex items-center space-x-4">
                  {editingProduct.image && (
                    <img
                      src={editingProduct.image}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="mt-1 block w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
