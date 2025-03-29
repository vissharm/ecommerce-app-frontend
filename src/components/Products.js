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
import { toast } from 'react-toastify';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/products', {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock)
      });
      
      // Add the new product to the existing products list
      setProducts(prevProducts => [...prevProducts, response.data]);
      
      handleClose();
      toast.success('Product added successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error adding product');
    }
  };

  // Separate function for fetching products data
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
      toast.error('Error fetching data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        <form onSubmit={handleSubmit}>
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
              required
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
              required
              inputProps={{ min: "0", step: "0.01" }}
            />
            <TextField
              margin="dense"
              name="stock"
              label="Stock"
              type="number"
              fullWidth
              value={newProduct.stock}
              onChange={handleChange}
              required
              inputProps={{ min: "0", step: "1" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button 
              type="submit"
              disabled={!newProduct.name || !newProduct.price || !newProduct.stock}
            >
              Add Product
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default Products;
