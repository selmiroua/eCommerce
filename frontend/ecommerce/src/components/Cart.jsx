import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="p-4">
        <p className="text-center text-gray-500">Votre panier est vide</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Votre Panier</h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item._id} className="flex items-center space-x-4 border-b pb-4">
            <img
              src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/80'} // Fallback image
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-gray-500">{item.price} DT</p>
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="px-2 py-1 bg-gray-100 rounded"
                  disabled={item.quantity <= 1} // Disable button if quantity is 1
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-100 rounded"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{(item.price * item.quantity).toFixed(2)} DT</p>
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 text-sm mt-2"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-4">
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{cartTotal.toFixed(2)} DT</span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Passer la commande
        </button>
      </div>
    </div>
  );
};

export default Cart;