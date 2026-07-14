const express = require('express');
const router =express.Router();

const{
    createEmployee,
    getEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/:id')
.get(getEmployee)
.put(authorize('admin', 'manager'), updateEmployee)
.delete(authorize('admin'), deleteEmployee);

module.exports= router;

