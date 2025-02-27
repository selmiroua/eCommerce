import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/customers', {
        headers: { 'x-auth-token': token }
      });
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/admin/customers/${userId}/block`,
        { isBlocked },
        { headers: { 'x-auth-token': token } }
      );
      fetchCustomers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Gestion des clients</h1>

      {/* Customers List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commandes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {customer.purchaseHistory.length} commandes
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    customer.isBlocked
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {customer.isBlocked ? 'Bloqué' : 'Actif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedCustomer(customer)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Détails
                  </button>
                  <button
                    onClick={() => handleBlockUser(customer._id, !customer.isBlocked)}
                    className={`${
                      customer.isBlocked
                        ? 'text-green-600 hover:text-green-900'
                        : 'text-red-600 hover:text-red-900'
                    }`}
                  >
                    {customer.isBlocked ? 'Débloquer' : 'Bloquer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Détails du client</h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Customer Info */}
              <div>
                <h3 className="font-bold mb-2">Information personnelle</h3>
                <p>Nom: {selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                <p>Email: {selectedCustomer.email}</p>
                <p>Date d'inscription: {new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                <p>Dernière connexion: {selectedCustomer.lastLogin ? new Date(selectedCustomer.lastLogin).toLocaleString() : 'Jamais'}</p>
              </div>

              {/* Purchase History */}
              <div>
                <h3 className="font-bold mb-2">Historique des commandes</h3>
                {selectedCustomer.purchaseHistory.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="text-left">N° Commande</th>
                        <th className="text-left">Date</th>
                        <th className="text-left">Montant</th>
                        <th className="text-left">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCustomer.purchaseHistory.map((order) => (
                        <tr key={order._id}>
                          <td className="py-2">{order.invoiceNumber}</td>
                          <td className="py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="py-2">{order.totalAmount.toFixed(2)} €</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                              order.status === 'delivered' ? 'bg-green-800 text-white' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">Aucune commande</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
