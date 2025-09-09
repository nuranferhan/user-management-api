# User Management API

A RESTful API for managing users with authentication, validation, and middleware implementation.

## Project Structure

```
user-management-api/
├── package.json              # Dependencies and scripts
├── server.js                 # Main server file
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
├── README.md                # Project documentation
├── routes/
│   └── users.js             # User route definitions
├── controllers/
│   └── userController.js    # Business logic for users
└── middleware/
    ├── auth.js              # JWT authentication middleware
    ├── validation.js        # Input validation middleware
    ├── logging.js           # Request logging middleware
    └── errorHandler.js      # Error handling middleware
```

## Features

- Complete CRUD operations (GET, POST, PUT, DELETE)
- Input validation using Joi
- JWT authentication middleware
- Request logging middleware
- Error handling middleware
- Password hashing with bcrypt
- Security headers with Helmet
- CORS support

## API Endpoints

### Authentication
- `POST /api/users/login` - Login user

### User Management (Protected Routes)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (Public)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Health Check
- `GET /health` - Check API status

## Validation Rules

- **Name**: 2-50 characters, required
- **Email**: Valid email format, required, unique
- **Password**: Minimum 6 characters, required

## Middleware

1. **Logging Middleware**: Logs all incoming requests with timestamp, method, URL, and response time
2. **Authentication Middleware**: Validates JWT tokens for protected routes
3. **Validation Middleware**: Validates request data using Joi schemas
4. **Error Handler**: Centralized error handling with proper HTTP status codes

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Security headers with Helmet
- CORS configuration
- Request rate limiting considerations

## Development Notes

This project was developed with assistance from GitHub Copilot for:
- Code debugging and optimization
- Middleware implementation
- Error handling patterns
- Security best practices

## Technologies Used

- Node.js
- Express.js
- JSON Web Tokens (JWT)
- bcryptjs for password hashing
- Joi for validation
- Helmet for security
- CORS for cross-origin requests
