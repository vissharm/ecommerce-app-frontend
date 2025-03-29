import React from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Avatar } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import { getAuthData, clearAuthData } from '../../utils/secureStorage';

function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user } = getAuthData();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    clearAuthData();
    handleMenuClose();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          E-commerce App
        </Typography>
        
        {user?.name ? (
          <>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/orders">
              Orders
            </Button>
            <Button color="inherit" component={Link} to="/notifications">
              Notifications
            </Button>
            <Button color="inherit" component={Link} to="/products">
              Products
            </Button>
            
            <Button
              color="inherit"
              onClick={handleMenuOpen}
              startIcon={
                <Avatar
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  style={{ width: 24, height: 24 }}
                />
              }
            >
              {user.name}
            </Button>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;





