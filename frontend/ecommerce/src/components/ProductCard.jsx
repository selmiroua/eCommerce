import React from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    try {
      console.log('Adding to cart:', product); // Debugging line
      addToCart(product);
      toast.success(`${product.name} added to cart!`, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error(`Failed to add ${product.name} to cart.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (!product) {
    return null;
  }

  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/300x400';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={imageUrl}
        alt={product.name}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mt-1">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-gray-900">{product.price} DT</span>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;