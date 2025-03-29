import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { DateTimePicker } from '@material-ui/pickers';
import socket from '../socket';  // Import the shared socket instance
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSharedStyles } from '../styles/shared';

function Orders() {
  const sharedClasses = useSharedStyles();
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState('');  // Removed userId state
  const [quantity, setQuantity] = useState('');
  const [orderDate, setOrderDate] = useState(new Date());
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid - will be handled by axiosInstance interceptor
        return;
      }
      // Handle other errors
    }
  };

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        throw new Error('User not found');
      }
      
      const response = await axiosInstance.get(`/api/orders/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid - will be handled by axiosInstance interceptor
        return;
      }
      // Handle other errors
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();

    // Listen for order status updates
    const handleOrderUpdate = (event) => {
      console.log('Order update received:', event.detail);
      const { orderId, status, lastUpdated } = event.detail;
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, status, lastUpdated: new Date(lastUpdated) }
            : order
        )
      );
    };

    // Listen for both custom event and socket event
    const orderComponent = document.querySelector('[data-component="orders"]');
    if (orderComponent) {
      orderComponent.addEventListener('orderStatusUpdate', handleOrderUpdate);
    }

    // Listen for socket.io events directly
    // const socket = io(process.env.REACT_APP_SOCKET_URL || window.location.origin);
    
    socket.on('orderStatusUpdate', (data) => {
      console.log('Socket orderStatusUpdate received:', data);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === data.orderId 
            ? { ...order, status: data.status, lastUpdated: new Date(data.lastUpdated) }
            : order
        )
      );
    });

    socket.on('notification', (data) => {
      console.log('Socket notification received:', data);
      try {
        const orderData = JSON.parse(data.message);
        if (orderData.status && orderData.orderId) {
          // Update orders list
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order._id === orderData.orderId 
                ? { ...order, status: orderData.status, lastUpdated: new Date(orderData.lastUpdated) }
                : order
            )
          );

          // Show toast notification
          const formattedDate = orderData.lastUpdated 
            ? new Date(orderData.lastUpdated).toLocaleString()
            : new Date().toLocaleString();

          // Trigger notification update
          const notificationsComponent = document.querySelector('[data-component="notifications"]');
          if (notificationsComponent) {
            notificationsComponent.dispatchEvent(new CustomEvent('notificationUpdate'));
          }
        }
      } catch (err) {
        console.error('Error processing notification:', err);
        toast.error('Error processing notification');
      }
    });

    return () => {
      // Cleanup
      if (orderComponent) {
        orderComponent.removeEventListener('orderStatusUpdate', handleOrderUpdate);
      }
      socket.off('orderStatusUpdate');
      socket.off('notification');
      socket.disconnect();
    };
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Reset form fields when closing
    setProductId('');
    setQuantity('');
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    const newOrder = { 
      productId, 
      quantity: parseInt(quantity, 10),
      orderDate: orderDate.toISOString(),
      status: 'Pending'
    };

    axiosInstance.post('/api/orders/create', newOrder)
      .then(res => {
        setOrders([...orders, res.data]);
        handleClose();
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <div data-component="orders">
      <Typography variant="h4" gutterBottom color="primary">
        Orders
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        className={sharedClasses.addButton}
      >
        Add New Order
      </Button>

      <TableContainer component={Paper} className={sharedClasses.tableContainer}>
        <Table className={sharedClasses.table}>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Available Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => {
              const product = products.find(p => p._id === order.productId);
              return (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{product ? product.name : order.productId}</TableCell>
                  <TableCell align="right">{order.quantity}</TableCell>
                  <TableCell align="right">{product ? product.stock : 'N/A'}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleString()}</TableCell>
                  <TableCell>{new Date(order.lastUpdated).toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="xs" // Controls the maximum width of the dialog
        fullWidth={false} // Prevents the dialog from taking full width
      >
        <DialogTitle>Create New Order</DialogTitle>
        <DialogContent className={sharedClasses.dialogContent}>
          <form onSubmit={handleCreateOrder} className={sharedClasses.form}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Product</InputLabel>
              <Select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                {products.map((product) => (
                  <MenuItem key={product._id} value={product._id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              className={sharedClasses.textField}
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              variant="outlined"
              size="small"
              required
              InputProps={{ inputProps: { min: 1 } }}
            />
            <DateTimePicker
              label="Order Date"
              inputVariant="outlined"
              value={orderDate}
              onChange={setOrderDate}
              size="small"
              className={sharedClasses.textField}
              format="yyyy/MM/dd HH:mm"
            />
          </form>
        </DialogContent>
        <DialogActions className={sharedClasses.dialogActions}>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={handleCreateOrder} 
            color="primary" 
            variant="contained"
          >
            Create Order
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Orders;
