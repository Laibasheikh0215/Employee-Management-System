// Add this if you want a profile page
import React from 'react';
import { Container, Paper, Typography, Box, Avatar, Grid, Chip } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={4}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: '#764ba2',
              fontSize: '3rem',
              mr: 3
            }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4">{user?.username}</Typography>
            <Typography variant="body1" color="textSecondary">
              {user?.email}
            </Typography>
            <Chip 
              label={user?.role || 'Employee'} 
              color="primary" 
              size="small" 
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">Username</Typography>
            <Typography variant="body1">{user?.username}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">Email</Typography>
            <Typography variant="body1">{user?.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">Role</Typography>
            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
              {user?.role || 'Employee'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">Member Since</Typography>
            <Typography variant="body1">
              {new Date(user?.createdAt).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;