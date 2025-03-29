import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  makeStyles,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Check, Close } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 'calc(100vh - 64px)', // Subtract navbar height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  paper: {
    width: '100%',
    maxWidth: 400,
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1.5),
  },
  error: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
    width: '100%',
    textAlign: 'center',
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  validationList: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
  },
  validationItem: {
    padding: theme.spacing(0.5),
  },
  validIcon: {
    color: theme.palette.success.main,
  },
  invalidIcon: {
    color: theme.palette.error.main,
  },
}));

const Register = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    contact: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const passwordCriteria = {
    minLength: password => password.length >= 8,
    hasUppercase: password => /[A-Z]/.test(password),
    hasLowercase: password => /[a-z]/.test(password),
    hasNumber: password => /[0-9]/.test(password),
    hasSpecial: password => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const failedCriteria = Object.entries(passwordCriteria)
        .filter(([_, testFn]) => !testFn(formData.password))
        .map(([key]) => key);
      
      if (failedCriteria.length > 0) {
        newErrors.password = 'Password does not meet requirements';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const formattedData = {
        ...formData,
        dob: formData.dob ? new Date(formData.dob).toISOString() : null
      };

      const response = await axios.post('/api/users/register', formattedData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || 'Registration failed';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        <Typography component="h1" variant="h5">
          Create Account
        </Typography>
        
        {errors.submit && (
          <Box className={classes.error}>
            {errors.submit}
          </Box>
        )}

        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />

          {/* Password requirements list */}
          <Box className={classes.validationList}>
            <Typography variant="subtitle2" gutterBottom>
              Password Requirements:
            </Typography>
            <List dense>
              {Object.entries({
                'At least 8 characters': passwordCriteria.minLength,
                'Contains uppercase letter': passwordCriteria.hasUppercase,
                'Contains lowercase letter': passwordCriteria.hasLowercase,
                'Contains number': passwordCriteria.hasNumber,
                'Contains special character': passwordCriteria.hasSpecial,
              }).map(([label, testFn]) => (
                <ListItem key={label} className={classes.validationItem}>
                  <ListItemIcon>
                    {testFn(formData.password) ? (
                      <Check className={classes.validIcon} />
                    ) : (
                      <Close className={classes.invalidIcon} />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={label} />
                </ListItem>
              ))}
            </List>
          </Box>

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="dob"
            label="Date of Birth"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.dob}
            onChange={handleChange}
            error={!!errors.dob}
            helperText={errors.dob}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="contact"
            label="Contact Number"
            type="tel"
            value={formData.contact}
            onChange={handleChange}
            error={!!errors.contact}
            helperText={errors.contact}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </Button>

          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Already have an account?{' '}
              <Link to="/login" className={classes.link}>
                Login
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;




