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
  makeStyles
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useSharedStyles } from '../styles/shared';

function Products() {
  const sharedClasses = useSharedStyles();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });

  useEffect(() => {
    // Fetch both products and orders
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          axiosInstance.get('/api/products'),
          axiosInstance.get('/api/orders/orders')
        ]);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  // Calculate remaining stock for each product
  const calculateRemainingStock = (productId, totalStock) => {
    const orderedQuantity = orders
      .filter(order => order.productId === productId && order.status !== 'Cancelled')
      .reduce((sum, order) => sum + order.quantity, 0);
    return totalStock - orderedQuantity;
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewProduct({ name: '', description: '', price: '', stock: '' });
  };

  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/products', newProduct);
      handleClose();
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom color="primary">
        Products
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        className={sharedClasses.addButton}
      >
        Add Product
      </Button>
      <TableContainer component={Paper} className={sharedClasses.tableContainer}>
        <Table className={sharedClasses.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Total Stock</TableCell>
              <TableCell align="right">Remaining Stock</TableCell>
              <TableCell align="right">Orders Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const remainingStock = calculateRemainingStock(product._id, product.stock);
              const orderCount = orders.filter(
                order => order.productId === product._id && order.status !== 'Cancelled'
              ).length;
              
              return (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell align="right">${product.price}</TableCell>
                  <TableCell align="right">{product.stock}</TableCell>
                  <TableCell 
                    align="right"
                    style={{ 
                      color: remainingStock < 10 ? 'red' : 'inherit',
                      fontWeight: remainingStock < 10 ? 'bold' : 'normal'
                    }}
                  >
                    {remainingStock}
                  </TableCell>
                  <TableCell align="right">{orderCount}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Product Name"
            type="text"
            fullWidth
            value={newProduct.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={newProduct.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={newProduct.price}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="stock"
            label="Stock"
            type="number"
            fullWidth
            value={newProduct.stock}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Products;
