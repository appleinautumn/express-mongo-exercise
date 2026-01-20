# Express Mongo Exercise - QWEN Context

## Project Overview

This is a RESTful API service built with Express.js and MongoDB that demonstrates user authentication with JWT and refresh tokens. The project implements a complete authentication system with role-based access control, allowing for both regular users and administrators with different permission levels.

### Key Technologies
- **Backend Framework**: Express.js (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with refresh tokens
- **Testing**: Jest for unit and integration testing
- **Containerization**: Docker support
- **Password Hashing**: bcrypt
- **Environment Configuration**: dotenv

### Architecture
- **Model-View-Controller (MVC)** pattern with domain-focused controllers
- **RESTful API** design with versioned endpoints
- **Middleware-based** authentication and authorization
- **Environment-based** configuration management

## Project Structure

```
/
├── app.js                    # Express app configuration
├── server.js                 # Entry point for starting the server
├── db.js                     # Database connection setup
├── data/                     # Seed data
│   └── users.json            # User seed data
├── domains/                  # Business logic
│   ├── admin.controller.js   # Admin controller
│   ├── login.controller.js   # Authentication controller
│   ├── user.controller.js    # User controller
│   └── user.model.js         # User model definition
├── middlewares/              # Middleware functions
│   └── authenticated.js      # JWT authentication middleware
├── routes/                   # API routes
│   └── index.js              # Route definitions
├── postman/                  # Postman collection for testing
├── requests.http             # HTTP request examples
├── tests/                    # Test files
│   ├── integration/          # Integration tests
│   ├── unit/                 # Unit tests
│   └── test-setup.js         # Test environment setup
├── .env.example             # Environment variable template
├── Dockerfile               # Docker configuration
├── package.json             # Dependencies and scripts
├── README.md                # Project documentation
└── jest.config.js           # Jest configuration
```

## Building and Running

### Prerequisites
- Node.js 22+
- MongoDB 8.0+
- npm or yarn

### Development Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
3. Configure your `.env` file with appropriate values:
   ```
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/express_mongo_exercise
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRATION=7d
   REFRESH_TOKEN_EXPIRATION=30d
   ```

4. Import seed data to MongoDB:
   ```bash
   mongoimport --db=express_mongo_exercise --collection=users --type=json --file=data/users.json
   ```

### Available Scripts
- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Docker Deployment
- Build the image: `docker build -t express-mongo-exercise .`
- Run the container: `docker run -d --name express-mongo-exercise1 -p 3001:3000 --network=host --env-file=.env express-mongo-exercise`

## API Endpoints

### Authentication Endpoints
- `POST /api/v1/login` - User login with username/password
- `POST /api/v1/refresh-token` - Refresh JWT access token

### User Endpoints (authenticated users)
- `GET /api/v1/profile` - Get current user's profile

### Admin Endpoints (admin role required)
- `GET /api/admin/v1/users` - List all users
- `POST /api/admin/v1/users` - Create a new user
- `GET /api/admin/v1/users/:id` - Get user by ID
- `PUT /api/admin/v1/users/:id` - Update user by ID
- `DELETE /api/admin/v1/users/:id` - Delete user by ID

## Development Conventions

### Authentication Flow
1. Users authenticate with username/password to receive an access token and refresh token
2. Access tokens expire after a configured period (typically 7 days)
3. Refresh tokens allow renewal of access tokens without re-authentication
4. Admin endpoints require both authentication and admin role verification

### Error Handling
- Standardized error responses with consistent format
- HTTP status codes properly mapped to error conditions
- Detailed error messages for debugging in development mode

### Testing Practices
- Unit tests for middleware functions
- Integration tests for API endpoints
- Authentication and authorization tests
- Test coverage reports generated with Jest

### Security Measures
- Passwords are hashed using bcrypt
- JWT tokens with configurable expiration
- Refresh tokens with UUIDs and time limits
- Role-based access control for protected resources
- Input validation and sanitization

## Key Components

### User Model
- Fields: username (unique), name, password (hashed), is_admin, refresh_token, refresh_token_until
- Uses Mongoose for MongoDB interaction
- Includes timestamps for creation and updates

### Authentication Middleware
- `authenticated` middleware validates JWT tokens
- `isAdmin` middleware checks for admin role
- Both return appropriate HTTP status codes for unauthorized access

### Controllers
- **login.controller.js**: Handles authentication and token management
- **user.controller.js**: Manages user profile operations
- **admin.controller.js**: Implements admin-specific user management functions

## Testing Strategy

The project uses Jest for comprehensive testing:
- Unit tests for individual functions and middleware
- Integration tests for API endpoints
- Mock database setup for isolated testing
- Coverage reports to track test completeness

Test files are organized in the `/tests/` directory with separate folders for unit and integration tests.

## Environment Configuration

The application supports different environments (development, test, production) through environment variables:
- Database connection strings
- JWT secrets and expiration times
- Port configurations
- Logging levels

## Troubleshooting

Common issues and solutions:
1. **MongoDB Connection Error**: Verify MongoDB is running and connection string is correct
2. **Authentication Issues**: Check JWT token validity and refresh token management
3. **API Request Errors**: Verify proper headers, request format, and user permissions
4. **Testing Failures**: Ensure test environment is properly configured with test database