import React, {useEffect} from 'react';
import { 
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import axios from 'axios';
import axiosInstance from './utils/axiosConfig';

import { Container } from '@material-ui/core';
import Navbar from './components/layout/Navbar';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import Orders from './components/Orders';
import Notifications from './components/Notifications';
import Products from './components/Products';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/profile/Profile';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socket from './socket';  // Import the shared socket instance

function App() {
  useEffect(() => {
    // const socket = io(process.env.REACT_APP_SOCKET_URL || window.location.origin);

    socket.on('notification', async (data) => {
      console.log('Notification received:', data);
      try {
        const orderData = JSON.parse(data.message);
        
        // Show toast notification without marking as read
        const formattedDate = orderData.lastUpdated 
          ? new Date(orderData.lastUpdated).toLocaleString()
          : new Date().toLocaleString();

        toast.success(`Order ${orderData.orderId} status updated to ${orderData.status}`, {
          position: "top-center",
          autoClose: 5000,
          onClick: () => {
            // Optionally navigate to orders page on click
            window.location.href = '/orders';
          },
          onOpen: async () => {
            try {
              if (orderData.notificationId) {
                await axiosInstance.put(
                  `/api/notifications/markAsRead/${orderData.notificationId}`
                );
                console.log('Notification marked as read:', orderData.notificationId);
                
                // Dispatch event to update notifications list
                window.dispatchEvent(new CustomEvent('notificationUpdate'));
              }
            } catch (err) {
              console.error('Error marking notification as read:', err);
            }
          }
        });

        // Update orders list if needed
        if (window.location.pathname === '/orders') {
          const ordersComponent = document.querySelector('[data-component="orders"]');
          if (ordersComponent) {
            const event = new CustomEvent('orderStatusUpdate', { 
              detail: { 
                orderId: orderData.orderId,
                status: orderData.status,
                lastUpdated: orderData.lastUpdated
              } 
            });
            ordersComponent.dispatchEvent(event);
          }
        }
      } catch (err) {
        console.error('Error processing notification:', err);
      }
    });

    // Add listener for order status updates
    socket.on('orderStatusUpdate', (data) => {
      console.log('Order status update received:', data);
      const ordersComponent = document.querySelector('[data-component="orders"]');
      if (ordersComponent) {
        const event = new CustomEvent('orderStatusUpdate', { 
          detail: { 
            orderId: data.orderId,
            status: data.status,
            lastUpdated: data.lastUpdated
          } 
        });
        ordersComponent.dispatchEvent(event);
      }
    });

    return () => {
      socket.off('notification');
      socket.off('orderStatusUpdate');
    };
  }, []);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Router>
        <div className="App">
          <Navbar />
          <Container style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/products" element={<Products />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Container>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </MuiPickersUtilsProvider>
  );
}

export default App;
