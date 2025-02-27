import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          setIsLoggedIn(true);
          const response = await axios.get('http://localhost:5000/api/admin/check', {
            headers: { 'x-auth-token': token }
          });
          setIsAdmin(response.data.isAdmin);
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="w-full">
      <div className="top-strip py-2 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="col1 w-[50%]">
              <p className="text-[14px] font-[500]">
                🚚 Livraison gratuite à partir de 99 DT
              </p>
            </div>
            <div className="col2 flex items-center justify-end">
              <ul>
                <li className="list-none">
                  <Link to="#" className="hover:text-blue-600">Help Center</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="main-header py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src="/Logo.png" alt="ORELEA Logo" className="h-10" />
              <span className="text-2xl font-bold text-[#0066CC]">ORELEA</span>
            </Link>
            
            <div className="search-bar w-[40%]">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
                >
                  🔍
                </button>
              </form>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/cart" className="hover:text-blue-600">🛒 Cart</Link>
              <div className="relative">
                <button 
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="hover:text-blue-600 flex items-center gap-1 focus:outline-none"
                >
                  👤 Account
                </button>
                
                {showAccountMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    {isLoggedIn ? (
                      <>
                        <Link 
                          to="/dashboard" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Dashboard
                        </Link>
                        {isAdmin && (
                          <Link 
                            to="/admin" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Tableau de bord Admin
                          </Link>
                        )}
                        <button 
                          onClick={() => {
                            localStorage.removeItem('token');
                            setIsLoggedIn(false);
                            setIsAdmin(false);
                            setShowAccountMenu(false);
                          }} 
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link 
                          to="/signin" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowAccountMenu(false)}
                        >
                          Sign In
                        </Link>
                        <Link 
                          to="/signup" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowAccountMenu(false)}
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;