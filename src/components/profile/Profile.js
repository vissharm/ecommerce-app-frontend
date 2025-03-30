import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  makeStyles
} from '@material-ui/core';
import axiosInstance from '../../utils/axiosConfig';
import { getAuthData, setAuthData } from '../../utils/secureStorage';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    maxWidth: 600,
    margin: '0 auto',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  buttonGroup: {
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  error: {
    color: theme.palette.error.main,
    marginBottom: theme.spacing(2),
  },
  disabledField: {
    backgroundColor: theme.palette.action.disabledBackground,
    '& .MuiInputBase-root': {
      color: theme.palette.text.disabled,
    },
  },
}));

const Profile = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    contact: '',
    dob: ''
  });
  const [originalProfile, setOriginalProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/api/users/profile');
      const profileData = response.data;
      setProfile(profileData);
      setOriginalProfile(profileData);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Failed to load profile');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    const { token } = getAuthData();
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow changes to name and email when in editing mode
    if ((name === 'name' || name === 'email') && isEditing) {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put('/api/users/profile', {
        name: profile.name,
        email: profile.email
      });
      
      if (response.data) {
        setProfile(response.data);
        setOriginalProfile(response.data);
        setIsEditing(false);
        setError('');
        
        // Update the auth data with new user information
        const currentAuthData = getAuthData();
        setAuthData({
          ...currentAuthData,
          user: {
            ...currentAuthData.user,
            name: response.data.name,
            email: response.data.email
          }
        });
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleCancel = () => {
    if (originalProfile) {
      setProfile({...originalProfile});
    }
    setIsEditing(false);
    setError('');
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" gutterBottom>
        Profile
      </Typography>
      
      {error && (
        <Typography className={classes.error}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit} className={classes.form}>
        <TextField
          label="Name"
          name="name"
          value={profile.name || ''}
          onChange={handleChange}
          disabled={!isEditing}  // Can be edited when editing
          fullWidth
          variant="outlined"
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={profile.email || ''}
          onChange={handleChange}
          disabled={!isEditing}  // Can be edited when editing
          fullWidth
          variant="outlined"
        />

        <TextField
          label="Contact"
          name="contact"
          value={profile.contact || ''}
          disabled={true}  // Always disabled
          fullWidth
          variant="outlined"
          className={classes.disabledField}
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          label="Date of Birth"
          name="dob"
          type="date"
          value={profile.dob?.split('T')[0] || ''}
          disabled={true}  // Always disabled
          fullWidth
          variant="outlined"
          className={classes.disabledField}
          InputProps={{
            readOnly: true,
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Box className={classes.buttonGroup}>
          {isEditing ? (
            <>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Save
              </Button>
              <Button
                onClick={handleCancel}
                variant="outlined"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              variant="contained"
              color="primary"
            >
              Edit
            </Button>
          )}
        </Box>
      </form>
    </Paper>
  );
};

export default Profile;
