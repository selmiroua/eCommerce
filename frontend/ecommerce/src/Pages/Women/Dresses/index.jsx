import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../../components/ProductCard';

const Dresses = () => {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedCategories, setSelectedCategories] = useState({
    style: [],
    fabric: [],
    occasion: [],
    type: []
  });
  const [activeFilters, setActiveFilters] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const categories = {
    style: {
      name: 'Style',
      items: ['Hijab', 'Non-Hijab']
    },
    fabric: {
      name: 'Tissu',
      items: ['Satin', 'Soie', 'Coton', 'Velours', 'Mousseline']
    },
    occasion: {
      name: 'Occasion',
      items: ['Soirée', 'Mariage', 'Casual', 'Fête']
    },
    type: {
      name: 'Type',
      items: ['Longue', 'Mi-longue', 'Courte', 'Abaya']
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, selectedSize]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products', {
        params: {
          category: 'dresses',
          style: selectedCategories.style,
          fabric: selectedCategories.fabric,
          occasion: selectedCategories.occasion,
          type: selectedCategories.type,
          size: selectedSize || undefined
        }
      });
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleCategoryClick = (category, item) => {
    setSelectedCategories(prev => {
      const newCategories = { ...prev };
      if (newCategories[category].includes(item)) {
        newCategories[category] = newCategories[category].filter(i => i !== item);
      } else {
        newCategories[category] = [...newCategories[category], item];
      }
      return newCategories;
    });
  };

  const handleSizeClick = (size) => {
    setSelectedSize(prev => prev === size ? '' : size);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Filters Section */}
        <div className="w-1/4 space-y-6">
          {/* Size Filter */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Taille</h3>
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <button
                  key={size}
                  onClick={() => handleSizeClick(size)}
                  className={`px-3 py-1 border rounded-md ${
                    selectedSize === size
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filters */}
          {Object.entries(categories).map(([key, category]) => (
            <div key={key} className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-3">{category.name}</h3>
              <div className="space-y-2">
                {category.items.map(item => (
                  <label key={item} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories[key].includes(item)}
                      onChange={() => handleCategoryClick(key, item)}
                      className="mr-2"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Products Grid */}
        <div className="w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dresses;
