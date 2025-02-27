import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      {/* Women's Section */}
      <div className="relative w-1/2 overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
          alt="Women's Fashion"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-white text-6xl font-bold tracking-wider mb-8">WOMEN</h2>
          <Link 
            to="/women"
            className="bg-white text-black px-8 py-2 text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300"
          >
            FIND OUT
          </Link>
        </div>
      </div>

      {/* Men's Section */}
      <div className="relative w-1/2 overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1550995694-3f5f4a7e1bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80" 
          alt="Men's Fashion"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-white text-6xl font-bold tracking-wider mb-8">MEN</h2>
          <Link 
            to="/men"
            className="bg-white text-black px-8 py-2 text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300"
          >
            FIND OUT
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;