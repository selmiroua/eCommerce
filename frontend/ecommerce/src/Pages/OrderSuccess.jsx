import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-bold mb-4">Commande passée avec succès!</h2>
      <button
        onClick={() => navigate('/')}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Retour à l'accueil
      </button>
    </div>
  );
};

export default OrderSuccess;