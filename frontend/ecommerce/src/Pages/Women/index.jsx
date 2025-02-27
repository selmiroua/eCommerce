import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Women = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Nos Produits</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Image Container */}
            <div className="relative h-56 w-full flex items-center justify-center bg-gray-100">
              {/* Price in Top-Right Corner */}
              <span className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 text-lg font-bold text-blue-600 shadow-sm">
                {product.price} DT
              </span>

              {/* Product Image */}
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                className="h-48 w-48 object-cover object-center rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x400?text=Image+non+disponible';
                }}
              />
            </div>

            {/* Product Details */}
            <div className="p-4 text-center">
              {/* Centered Title */}
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h2>

              {/* Centered Description */}
              <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{product.description}</p>

              {/* Add to Cart Button (Reduced Size) */}
              <button
                className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Women;