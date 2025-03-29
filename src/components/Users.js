import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText } from '@material-ui/core';

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/users`)
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <List>
        {users.map(user => (
          <ListItem key={user._id}>
            <ListItemText primary={`${user.name} - ${user.email}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default Users;