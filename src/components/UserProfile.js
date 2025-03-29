import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button,
  makeStyles 
} from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import axiosInstance from '../utils/axiosConfig';
import { getAuthData } from '../utils/secureStorage';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(2, 0),
  },
  paper: {
    padding: theme.spacing(3),
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
  },
  textField: {
    width: '100%',
  }
}));

function UserProfile() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    contact: '',
    dob: null
  });
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const { token } = getAuthData();
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/api/users/profile');
      setProfile(response.data);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Failed to fetch profile');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Only send name and email in the update request
      const updateData = {
        name: profile.name,
        email: profile.email
      };
      await axiosInstance.put('/api/users/profile', updateData);
      setError('');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <Paper className={classes.paper}>
      <Typography variant="h5" gutterBottom>
        User Profile
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <form className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              className={classes.textField}
              label="Name"
              name="name"
              value={profile.name || ''}
              disabled={!isEditing}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={classes.textField}
              label="Email"
              name="email"
              value={profile.email || ''}
              disabled={!isEditing}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={classes.textField}
              label="Contact"
              name="contact"
              value={profile.contact || ''}
              disabled={!isEditing}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <DatePicker
              className={classes.textField}
              label="Date of Birth"
              value={profile.dob ? new Date(profile.dob) : null}
              disabled={!isEditing}
              onChange={(date) => setProfile({ ...profile, dob: date })}
              format="MM/dd/yyyy"
              inputVariant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>
        <div className={classes.buttonGroup}>
          {isEditing ? (
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  className={classes.submit}
                >
                  Save Changes
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => setIsEditing(false)}
                  className={classes.submit}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsEditing(true)}
              className={classes.submit}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </form>
    </Paper>
  );
}

export default UserProfile;


