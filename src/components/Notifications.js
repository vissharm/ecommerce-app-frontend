import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSharedStyles } from '../styles/shared';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { format } from 'date-fns';
import axiosInstance from '../utils/axiosConfig';

const useStyles = makeStyles((theme) => ({
  notificationRow: {
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      transform: 'translateX(5px)',
    },
    '&.unread': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
    }
  },
  messageCell: {
    maxWidth: '400px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '& strong': {
      color: theme.palette.primary.main,
      marginRight: theme.spacing(1),
    }
  },
  headerCell: {
    fontWeight: 600,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:first-child': {
      borderTopLeftRadius: theme.spacing(1),
    },
    '&:last-child': {
      borderTopRightRadius: theme.spacing(1),
    }
  },
  readChip: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
    fontWeight: 500,
    '&:hover': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.common.white,
    }
  },
  unreadChip: {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
    fontWeight: 500,
    '&:hover': {
      backgroundColor: theme.palette.warning.main,
      color: theme.palette.common.white,
    }
  },
  noNotifications: {
    textAlign: 'center',
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    '& svg': {
      fontSize: 48,
      color: theme.palette.action.disabled,
    }
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
  },
  dateCell: {
    whiteSpace: 'nowrap',
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
  deleteButton: {
    color: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.light,
      color: theme.palette.error.dark,
    }
  }
}));

function Notifications() {
  const classes = useStyles();
  const sharedClasses = useSharedStyles();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/api/notifications/notifications');
      
      const sortedNotifications = Array.isArray(res.data) 
        ? res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];
      setNotifications(sortedNotifications);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load notifications');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchNotifications();

    const handleUpdate = () => {
      console.log('Notification update event received');
      fetchNotifications();
    };

    window.addEventListener('notificationUpdate', handleUpdate);
    
    return () => {
      window.removeEventListener('notificationUpdate', handleUpdate);
    };
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axiosInstance.put(`/api/notifications/markAsRead/${notificationId}`);

      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleDelete = async (notificationId, event) => {
    event.stopPropagation(); // Prevent row click event
    
    try {
      await axiosInstance.delete(`/api/notifications/delete/${notificationId}`);
      
      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification._id !== notificationId)
      );
      
    } catch (err) {
      console.error('Error deleting notification:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div>
      <Box display="flex" alignItems="center" mb={3}>
        <NotificationsActiveIcon color="primary" style={{ marginRight: 16 }} />
        <Typography variant="h4" color="primary">
          Notifications
        </Typography>
      </Box>

      {loading ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : notifications.length === 0 ? (
        <Paper className={classes.noNotifications}>
          <NotificationsActiveIcon />
          <Typography variant="h6">No notifications yet</Typography>
          <Typography variant="body2">
            New notifications will appear here
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} className={sharedClasses.tableContainer}>
          <Table className={sharedClasses.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerCell}>Message</TableCell>
                <TableCell className={classes.headerCell}>Order ID</TableCell>
                <TableCell className={classes.headerCell} align="center">Status</TableCell>
                <TableCell className={classes.headerCell} align="right">Date</TableCell>
                <TableCell className={classes.headerCell} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow 
                  key={notification._id}
                  className={`${classes.notificationRow} ${!notification.read ? 'unread' : ''}`}
                  onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                >
                  <TableCell className={classes.messageCell}>
                    <strong>{notification.read ? 'Read:' : 'New!'}</strong>
                    {notification.message}
                  </TableCell>
                  <TableCell>{notification.orderId}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={notification.read ? "Read" : "Unread"}
                      className={notification.read ? classes.readChip : classes.unreadChip}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right" className={classes.dateCell}>
                    {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Delete notification">
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleDelete(notification._id, e)}
                        className={classes.deleteButton}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default Notifications;
