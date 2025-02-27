import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('Cette semaine');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productStats, setProductStats] = useState({
    total: 0,
    outOfStock: 0,
    lowStock: 0
  });

  const [stats, setStats] = useState({
    ventes: {
      total: '157892.500 DT',
      aujourdhui: '+157892.250 DT',
      cetteSemaine: '+63157.000 DT'
    },
    commandes: {
      total: 1458,
      enAttente: 45,
      enTraitement: 67
    },
    clients: {
      total: 892,
      nouveaux: '+12 cette semaine',
      actifs: '89%'
    },
    produits: {
      total: 0,
      enRupture: '0 produits',
      stockFaible: '0 produits'
    }
  });

  const [salesData, setSalesData] = useState({
    labels: ['01/02', '02/02', '03/02', '04/02', '05/02', '06/02', '07/02'],
    datasets: [
      {
        label: 'Ventes',
        data: [6000, 4500, 7000, 7800, 5500, 8500, 8000],
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4
      },
      {
        label: 'Objectif',
        data: [6000, 6000, 6000, 6000, 6000, 6000, 6000],
        borderColor: 'rgb(34, 197, 94)',
        borderDash: [5, 5],
        tension: 0
      }
    ]
  });

  const [orderStatus] = useState([
    { label: 'En attente', count: 45, percentage: '10%', color: 'bg-yellow-500' },
    { label: 'En traitement', count: 67, percentage: '15%', color: 'bg-blue-500' },
    { label: 'Expédiée', count: 89, percentage: '20%', color: 'bg-purple-500' },
    { label: 'Livrée', count: 234, percentage: '55%', color: 'bg-green-500' }
  ]);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchProductStats();
    fetchOrders();
  }, []);

  const fetchProductStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const products = response.data;
      setProducts(products);

      const stats = {
        total: products.length,
        outOfStock: products.filter(p => p.stock === 0).length,
        lowStock: products.filter(p => p.stock > 0 && p.stock <= 5).length
      };

      setProductStats(stats);
      setLoading(false);

      setStats(prevStats => ({
        ...prevStats,
        produits: {
          total: stats.total,
          enRupture: `${stats.outOfStock} produits`,
          stockFaible: `${stats.lowStock} produits`
        }
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleProductClick = () => {
    navigate('/admin/products');
  };

  const handleOrderClick = () => {
    setShowOrderModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Tableau de bord</h1>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option>Cette semaine</option>
            <option>Ce mois</option>
            <option>Cette année</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Ventes */}
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-gray-500 text-sm">Ventes Totales</h3>
                <p className="text-2xl font-semibold mt-1">{stats.ventes.total}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm">
                <span className="text-green-500">{stats.ventes.aujourdhui}</span>
                <span className="text-gray-500 ml-2">Aujourd'hui</span>
              </div>
              <div className="text-sm">
                <span className="text-green-500">{stats.ventes.cetteSemaine}</span>
                <span className="text-gray-500 ml-2">Cette semaine</span>
              </div>
            </div>
          </div>

          {/* Commandes */}
          <div 
            className="bg-white rounded-lg p-6 shadow cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={handleOrderClick}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-gray-500 text-sm">Commandes</h3>
                <p className="text-2xl font-semibold mt-1">{stats.commandes.total}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm">
                <span className="text-yellow-500">{stats.commandes.enAttente}</span>
                <span className="text-gray-500 ml-2">En attente</span>
              </div>
              <div className="text-sm">
                <span className="text-blue-500">{stats.commandes.enTraitement}</span>
                <span className="text-gray-500 ml-2">En traitement</span>
              </div>
            </div>
          </div>

          {/* Clients */}
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-gray-500 text-sm">Clients</h3>
                <p className="text-2xl font-semibold mt-1">{stats.clients.total}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm">
                <span className="text-green-500">{stats.clients.nouveaux}</span>
                <span className="text-gray-500 ml-2">Nouveaux</span>
              </div>
              <div className="text-sm">
                <span className="text-blue-500">{stats.clients.actifs}</span>
                <span className="text-gray-500 ml-2">Actifs</span>
              </div>
            </div>
          </div>

          {/* Produits */}
          <div 
            className="bg-white rounded-lg p-6 shadow cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={handleProductClick}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-gray-500 text-sm">Produits</h3>
                <p className="text-2xl font-semibold mt-1">{stats.produits.total}</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm">
                <span className="text-red-500">{stats.produits.enRupture}</span>
                <span className="text-gray-500 ml-2">En rupture</span>
              </div>
              <div className="text-sm">
                <span className="text-yellow-500">{stats.produits.stockFaible}</span>
                <span className="text-gray-500 ml-2">Stock faible</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">Évolution des ventes</h3>
          <div className="h-[300px]">
            <Line
              data={salesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      drawBorder: false
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                    align: 'end'
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">État des commandes</h3>
          <div className="space-y-4">
            {orderStatus.map((status, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{status.label}</span>
                  <span className="font-medium">{status.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${status.color} h-2 rounded-full`}
                    style={{ width: status.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Détails des Commandes</h2>
              <button 
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Commande</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{order._id.slice(-6)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.user?.name || 'Client'}</div>
                        <div className="text-sm text-gray-500">{order.user?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.items.map((item, index) => (
                            <div key={index} className="mb-1">
                              {item.product.name} x {item.quantity}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.totalAmount} DT</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'shipped'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {order.status === 'pending' ? 'En attente' :
                           order.status === 'processing' ? 'En traitement' :
                           order.status === 'shipped' ? 'Expédié' : 'Livré'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowOrderModal(false)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => navigate('/admin/orders')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Voir toutes les commandes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
