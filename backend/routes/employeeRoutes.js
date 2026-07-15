const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Routes
router.route('/')
  .get(employeeController.getEmployees)
  .post(authorize('admin', 'manager'), employeeController.createEmployee);

router.route('/:id')
  .get(employeeController.getEmployee)
  .put(authorize('admin', 'manager'), employeeController.updateEmployee)
  .delete(authorize('admin'), employeeController.deleteEmployee);

module.exports = router;