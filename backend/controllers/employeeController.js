const Employee = require('../models/Employee');

// @desc    Create employee
// @route   POST /api/employees
// @access  Private
exports.createEmployee = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const employee = await Employee.create(req.body);
    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
exports.getEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.department) filter.department = req.query.department;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.position) filter.position = req.query.position;

    const sort = {};
    if (req.query.sortBy) {
      sort[req.query.sortBy] = req.query.order === 'desc' ? -1 : 1;
    }

    const employees = await Employee.find(filter)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .populate('createdBy', 'username email');

    const total = await Employee.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: employees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('createdBy', 'username email');
    
    if (!employee) {
      return res.status(404).json({ 
        success: false,
        message: 'Employee not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
exports.updateEmployee = async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ 
        success: false,
        message: 'Employee not found' 
      });
    }

    employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ 
        success: false,
        message: 'Employee not found' 
      });
    }

    await employee.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};