import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  TextField,
  Box,
  Typography,
  MenuItem,
  TablePagination
} from '@mui/material';
import { Edit, Delete, Visibility, Add } from '@mui/icons-material';
import api from '../api/axios';
import toast from 'react-hot-toast';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    position: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, [page, rowsPerPage, filters]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...filters
      };
      
      const res = await api.get('/employees', { params });
      setEmployees(res.data.data);
      setTotal(res.data.pagination.total);
    } catch (error) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        toast.success('Employee deleted successfully');
        fetchEmployees();
      } catch (error) {
        toast.error('Failed to delete employee');
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'terminated': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">Employees</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/employees/new')}
          >
            Add Employee
          </Button>
        </Box>

        {/* Filters */}
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField
            select
            label="Department"
            size="small"
            value={filters.department}
            onChange={(e) => setFilters({...filters, department: e.target.value})}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Engineering">Engineering</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
          </TextField>
          
          <TextField
            select
            label="Status"
            size="small"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="terminated">Terminated</MenuItem>
          </TextField>
          
          <Button variant="outlined" onClick={() => setFilters({department: '', status: '', position: ''})}>
            Clear Filters
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Loading...</TableCell>
                </TableRow>
              ) : employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">No employees found</TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>${employee.salary.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={employee.status}
                        color={getStatusColor(employee.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/employees/${employee._id}`)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => navigate(`/employees/edit/${employee._id}`)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(employee._id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default EmployeeList;