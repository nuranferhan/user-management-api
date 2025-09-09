const Joi = require('joi');

// User validation schema
const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters'
  })
});

// User update validation schema (all fields optional)
const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters'
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Please provide a valid email address'
  }),
  password: Joi.string().min(6).optional().messages({
    'string.min': 'Password must be at least 6 characters'
  })
}).min(1).messages({
  'object.min': 'At least one field is required for update'
});

// Validate user creation
const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

// Validate user update
const validateUserUpdate = (req, res, next) => {
  const { error } = userUpdateSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

module.exports = {
  validateUser,
  validateUserUpdate
};