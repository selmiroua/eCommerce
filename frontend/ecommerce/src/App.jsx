import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AdminRoute from './components/AdminRoute';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cart from './components/Cart';

// Page imports
import Home from './Pages/Home';
import SignIn from './Pages/Home/SignIn';
import SignUp from './Pages/Home/SignUp';
import ForgotPassword from './Pages/Home/ForgotPassword';
import ResetPassword from './Pages/Home/ResetPassword';
import Women from './Pages/Women/index';
import Men from './Pages/Men';
import Dashboard from './Pages/Admin/Dashboard';
import Products from './Pages/Admin/Products';
import Orders from './Pages/Admin/Orders';
import Customers from './Pages/Admin/Customers';
import AdminRegister from './Pages/Admin/Register';
import AddProduct from './Pages/Admin/AddProduct';
import Dresses from './Pages/Women/Dresses';
import ClientDashboard from './Pages/Client/Dashboard';
import CartPage from './Pages/Cart';

function App() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow">
              <div className="App">
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/women" element={<Women />} />
                  <Route path="/women/dresses" element={<Dresses />} />
                  <Route path="/men" element={<Men />} />
                  <Route path="/cart" element={<CartPage />} />

                  {/* Admin Routes */}
                  <Route path="/admin/*" element={
                    <AdminRoute>
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="products" element={<Products />} />
                        <Route path="products/add" element={<AddProduct />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="customers" element={<Customers />} />
                        <Route path="register" element={<AdminRegister />} />
                        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                      </Routes>
                    </AdminRoute>
                  } />

                  {/* Client Routes */}
                  <Route path="/client/*" element={
                    <Routes>
                      <Route path="dashboard" element={<ClientDashboard />} />
                      <Route path="*" element={<Navigate to="/client/dashboard" replace />} />
                    </Routes>
                  } />

                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;