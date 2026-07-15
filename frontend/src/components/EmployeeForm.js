import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  MenuItem,
  Alert
} from '@mui/material';
import api from '../api/axios';
import toast from 'react-hot-toast';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: '',
    status: 'active',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const res = await api.get(`/employees/${id}`);
      const employee = res.data.data;
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        position: employee.position,
        department: employee.department,
        salary: employee.salary,
        status: employee.status,
        address: employee.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      });
    } catch (error) {
      toast.error('Failed to fetch employee');
      navigate('/employees');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Convert salary to number
      const dataToSubmit = {
        ...formData,
        salary: parseFloat(formData.salary)
      };

      if (id) {
        await api.put(`/employees/${id}`, dataToSubmit);
        toast.success('Employee updated successfully');
      } else {
        await api.post('/employees', dataToSubmit);
        toast.success('Employee created successfully');
      }
      navigate('/employees');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save employee');
      toast.error('Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  const departments = ['Engineering', 'HR', 'Marketing', 'Finance', 'Sales', 'Operations'];
  const positions = ['Developer', 'Manager', 'Designer', 'Analyst', 'Coordinator', 'Director'];
  const statuses = ['active', 'inactive', 'terminated'];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          {id ? 'Edit Employee' : 'Add New Employee'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
              >
                {positions.map((pos) => (
                  <MenuItem key={pos} value={pos}>{pos}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Address
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Zip Code"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box mt={3} display="flex" gap={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => navigate('/employees')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Employee'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EmployeeForm;