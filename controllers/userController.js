const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory storage (replace with database in production)
let users = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@example.com', 
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    createdAt: new Date().toISOString()
  }
];
let nextId = 2;

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET all users
const getAllUsers = (req, res) => {
  try {
    const userList = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }));
    
    res.json({
      success: true,
      count: userList.length,
      data: userList
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// GET user by ID
const getUserById = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
    
    res.json({ success: true, data: userData });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// POST create user
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const newUser = {
      id: nextId++,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    // Return user without password
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt
    };
    
    res.status(201).json({ 
      success: true, 
      message: 'User created successfully',
      data: userData 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// POST login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// PUT update user
const updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email, password } = req.body;
    
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Check if email is being changed and already exists
    if (email && email !== users[userIndex].email) {
      const emailExists = users.find(u => u.email === email && u.id !== id);
      if (emailExists) {
        return res.status(400).json({ success: false, error: 'Email already exists' });
      }
    }
    
    // Update user fields
    if (name) users[userIndex].name = name;
    if (email) users[userIndex].email = email;
    if (password) {
      users[userIndex].password = await bcrypt.hash(password, 10);
    }
    
    users[userIndex].updatedAt = new Date().toISOString();
    
    const userData = {
      id: users[userIndex].id,
      name: users[userIndex].name,
      email: users[userIndex].email,
      createdAt: users[userIndex].createdAt,
      updatedAt: users[userIndex].updatedAt
    };
    
    res.json({ 
      success: true, 
      message: 'User updated successfully',
      data: userData 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// DELETE user
const deleteUser = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    users.splice(userIndex, 1);
    
    res.json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser,
  deleteUser
};