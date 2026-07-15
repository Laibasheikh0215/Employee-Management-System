import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  PersonAdd,
  Logout,
  AccountCircle,
  Settings,
  Home,
  Business,
  Notifications,
  Brightness4,
  Brightness7
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Navigation items
  const navItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Employees', icon: <People />, path: '/employees' },
    { text: 'Add Employee', icon: <PersonAdd />, path: '/employees/new' },
  ];

  // Mobile Drawer
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="primary">
          EMS
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => handleNavigate(item.path)}
            selected={isActive(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><Logout /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  // Notification Menu
  const notificationsMenu = (
    <Menu
      anchorEl={notificationsAnchor}
      open={Boolean(notificationsAnchor)}
      onClose={() => setNotificationsAnchor(null)}
      PaperProps={{
        sx: { width: 320, maxHeight: 400 }
      }}
    >
      <MenuItem>
        <Box>
          <Typography variant="subtitle2">New employee added</Typography>
          <Typography variant="caption" color="textSecondary">2 hours ago</Typography>
        </Box>
      </MenuItem>
      <Divider />
      <MenuItem>
        <Box>
          <Typography variant="subtitle2">Employee updated</Typography>
          <Typography variant="caption" color="textSecondary">3 hours ago</Typography>
        </Box>
      </MenuItem>
      <Divider />
      <MenuItem>
        <Box>
          <Typography variant="subtitle2">Salary processed</Typography>
          <Typography variant="caption" color="textSecondary">1 day ago</Typography>
        </Box>
      </MenuItem>
      <Divider />
      <MenuItem>
        <Typography variant="body2" color="primary" align="center" sx={{ width: '100%' }}>
          View all notifications
        </Typography>
      </MenuItem>
    </Menu>
  );

  // User Menu
  const userMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: { width: 200 }
      }}
    >
      <MenuItem>
        <ListItemIcon>
          <AccountCircle fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={user?.username || 'User'} secondary={user?.role || 'Employee'} />
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Profile Settings" />
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo */}
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                flexGrow: 0,
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 700,
                letterSpacing: '-0.5px',
                mr: 4
              }}
            >
              <Business sx={{ mr: 1 }} />
              EMS
            </Typography>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    color="inherit"
                    startIcon={item.icon}
                    onClick={() => handleNavigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      fontWeight: isActive(item.path) ? 700 : 400,
                      bgcolor: isActive(item.path) ? 'rgba(255,255,255,0.15)' : 'transparent',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}

            {/* Right side icons */}
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton 
                  color="inherit" 
                  onClick={(e) => setNotificationsAnchor(e.currentTarget)}
                >
                  <Badge badgeContent={3} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Dark mode toggle (optional) */}
              <Tooltip title="Toggle theme">
                <IconButton color="inherit">
                  {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Tooltip>

              {/* User Avatar */}
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ 
                    p: 0,
                    border: '2px solid rgba(255,255,255,0.2)',
                    '&:hover': { borderColor: 'rgba(255,255,255,0.5)' }
                  }}
                >
                  <Avatar
                    sx={{ 
                      bgcolor: '#764ba2',
                      width: 40,
                      height: 40,
                      fontSize: '1rem'
                    }}
                  >
                    {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  edge="end"
                  onClick={handleDrawerToggle}
                  sx={{ ml: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better performance on mobile
        }}
      >
        {drawer}
      </Drawer>

      {/* Menus */}
      {userMenu}
      {notificationsMenu}
    </>
  );
};

export default Navbar;