import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import {
  People,
  PersonAdd,
  Work,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Business,
  Schedule,
  CheckCircle,
  Cancel,
  ArrowForward
} from '@mui/icons-material';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    departments: 0,
    totalSalary: 0,
    recentEmployees: [],
    departmentStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all employees
      const employeesRes = await api.get('/employees', { params: { limit: 100 } });
      const employees = employeesRes.data.data;
      
      // Calculate statistics
      const activeEmployees = employees.filter(emp => emp.status === 'active');
      const departments = [...new Set(employees.map(emp => emp.department))];
      const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
      
      // Department statistics
      const deptStats = {};
      departments.forEach(dept => {
        const deptEmps = employees.filter(emp => emp.department === dept);
        deptStats[dept] = {
          count: deptEmps.length,
          salary: deptEmps.reduce((sum, emp) => sum + emp.salary, 0)
        };
      });
      
      // Recent employees (last 5)
      const recentEmployees = employees
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      // Recent activity (mock data - you can replace with actual activity log)
      const activity = [
        { id: 1, action: 'New employee added', user: 'Admin', time: '2 hours ago', type: 'add' },
        { id: 2, action: 'Employee updated', user: 'Manager', time: '3 hours ago', type: 'update' },
        { id: 3, action: 'Employee deleted', user: 'Admin', time: '5 hours ago', type: 'delete' },
        { id: 4, action: 'Salary updated', user: 'HR', time: '1 day ago', type: 'update' },
        { id: 5, action: 'New employee added', user: 'Manager', time: '2 days ago', type: 'add' }
      ];
      
      setStats({
        totalEmployees: employees.length,
        activeEmployees: activeEmployees.length,
        departments: departments.length,
        totalSalary: totalSalary,
        recentEmployees: recentEmployees,
        departmentStats: deptStats
      });
      setRecentActivity(activity);
      
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {loading ? <CircularProgress size={24} /> : value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Box>
            <Typography variant="h4" gutterBottom>
              Welcome back, {user?.username || 'User'}! 👋
            </Typography>
            <Typography variant="body1">
              Here's what's happening with your employees today
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => navigate('/employees/new')}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }}
          >
            Add Employee
          </Button>
        </Box>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={<People />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Employees"
            value={stats.activeEmployees}
            icon={<CheckCircle />}
            color="#2e7d32"
            subtitle={`${stats.totalEmployees > 0 ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100) : 0}% of total`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Departments"
            value={stats.departments}
            icon={<Business />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Salary"
            value={`$${stats.totalSalary.toLocaleString()}`}
            icon={<AttachMoney />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      {/* Charts and Activity */}
      <Grid container spacing={3}>
        {/* Recent Employees */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Recent Employees</Typography>
              <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate('/employees')}>
                View All
              </Button>
            </Box>
            <List>
              {stats.recentEmployees.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No employees added yet" />
                </ListItem>
              ) : (
                stats.recentEmployees.map((employee, index) => (
                  <React.Fragment key={employee._id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      button
                      onClick={() => navigate(`/employees/${employee._id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#1976d2' }}>
                          {employee.firstName[0]}{employee.lastName[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${employee.firstName} ${employee.lastName}`}
                        secondary={`${employee.position} • ${employee.department}`}
                      />
                      <Chip
                        label={employee.status}
                        size="small"
                        color={employee.status === 'active' ? 'success' : employee.status === 'inactive' ? 'warning' : 'error'}
                      />
                    </ListItem>
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: activity.type === 'add' ? '#2e7d32' : 
                                  activity.type === 'delete' ? '#d32f2f' : '#ed6c02'
                        }}
                      >
                        {activity.type === 'add' ? <PersonAdd /> : 
                         activity.type === 'delete' ? <Cancel /> : <Work />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.action}
                      secondary={`By ${activity.user} • ${activity.time}`}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Department Statistics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Department Overview
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(stats.departmentStats).map(([dept, data]) => (
                <Grid item xs={12} sm={6} md={3} key={dept}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {dept}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Employees
                          </Typography>
                          <Typography variant="h6">{data.count}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Salary
                          </Typography>
                          <Typography variant="h6">${(data.salary / 1000).toFixed(1)}K</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;