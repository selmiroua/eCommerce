import React from 'react';

const Men = () => {
  const products = [
    {
      id: 1,
      name: "Costume Modern Fit",
      price: "299.99 €",
      image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
      id: 2,
      name: "Ensemble Casual",
      price: "89.99 €",
      image: "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
    },
    {
      id: 3,
      name: "Veste en Cuir",
      price: "199.99 €",
      image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Collection Homme</h1>
      
      {/* Categories */}
      <div className="flex justify-center gap-6 mb-12">
        <button className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-black">NOUVEAUTÉS</button>
        <button className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-black">COSTUMES</button>
        <button className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-black">VESTES</button>
        <button className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-black">PANTALONS</button>
        <button className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-black">ACCESSOIRES</button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <div key={product.id} className="group cursor-pointer">
            <div className="relative overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                AJOUTER AU PANIER
              </button>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-medium">{product.name}</h3>
              <p className="text-gray-600">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Men;