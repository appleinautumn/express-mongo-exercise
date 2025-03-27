# Express Mongo Exercise

A RESTful API service built with Express.js and MongoDB demonstrating user authentication with JWT and refresh tokens.

## Features

- **Authentication** - JWT-based authentication with refresh tokens
- **Role-based Access Control** - Admin and regular user roles
- **User Management** - CRUD operations for users (admin only)
- **Profile Management** - Users can view their profile
- **API Security** - Protected routes and secure password storage

### Demo Credentials

|     Username     | Password | Role  |
| :--------------: | :------: | :---: |
|  boss@test.com   |   boss   | admin |
| alibaba@test.com | alibaba  | user  |

Flowchart of the use cases: https://whimsical.com/sejutacitatest-EsJNQMbPuHHxou7oxve1kc

## Requirements

This project is developed with:

- Node 22
- MongoDB 8.0
- npm or yarn

Dependencies:

- express: ^4.18.2
- mongoose: ^7.3.1
- jsonwebtoken: ^9.0.0
- bcrypt: ^5.1.0
- dotenv: ^16.3.1
- http-errors: ^2.0.0
- cors: ^2.8.5
- uuid: ^9.0.0
- luxon: ^3.3.0

## Installation

Clone the project

```bash
git clone git@github.com:appleinautumn/express-mongo-exercise.git
```

Go to the project directory

```bash
cd express-mongo-exercise
```

Install dependencies

```bash
npm install
```

Set up environment variables by copying the example file

```bash
cp .env.example .env
```

## Environment Variables

Create a `.env` file with the following variables:

```
# Server configuration
PORT=3000
NODE_ENV=development

# MongoDB configuration
MONGODB_URI=mongodb://localhost:27017/express_mongo_exercise

# JWT configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d
REFRESH_TOKEN_EXPIRATION=30d
```

Make sure to replace placeholder values with your actual configuration.

## Database Setup

Create a MongoDB database. To import the seed data from `data` directory, go to project root directory and run:

```bash
mongoimport --db=express_mongo_exercise --collection=users --type=json --file=data/users.json
```

## Testing

The project uses Jest for testing with the following test suites:

- Unit tests for middleware functions
- Integration tests for API endpoints
- Authentication tests

Run the tests with:

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

Test coverage report will be generated in the `coverage` directory.

## Project Structure

```
/
├── app.js              # Express app configuration
├── server.js           # Entry point for starting the server
├── db.js               # Database connection setup
├── data/               # Seed data
│   └── users.json      # User seed data
├── domains/            # Business logic
│   ├── admin.controller.js  # Admin controller
│   ├── login.controller.js  # Authentication controller
│   ├── user.controller.js   # User controller
│   └── user.model.js        # User model definition
├── middlewares/        # Middleware functions
│   └── authenticated.js     # JWT authentication middleware
├── routes/             # API routes
│   └── index.js        # Route definitions
├── postman/            # Postman collection for testing
├── requests.http       # HTTP request examples
└── Dockerfile          # Docker configuration
```

## Deployment

### Without Docker

Follow the Installation instruction above and then start the server:

```bash
npm start
```

### With Docker

Build the image

```bash
docker build -t express-mongo-exercise .
```

Run the container

```bash
docker run -d --name express-mongo-exercise1 -p 3001:3000 --network=host --env-file=.env express-mongo-exercise
```

## API Documentation

### Authentication Endpoints

#### Login

```
POST /api/v1/login
```

Request body:

```json
{
  "username": "example@test.com",
  "password": "password"
}
```

Response:

```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "823e2284-763e-453f-98d5-ce443b5d9f08"
  }
}
```

#### Refresh Token

```
POST /api/v1/refresh-token
```

Request body:

```json
{
  "refresh_token": "823e2284-763e-453f-98d5-ce443b5d9f08"
}
```

Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:

```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "new-refresh-token-uuid"
  }
}
```

### User Endpoints

#### Get User Profile

```
GET /api/v1/profile
```

Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:

```json
{
  "data": {
    "_id": "64a2a373ed43878ae31fb0bd",
    "username": "alibaba@test.com",
    "name": "alibaba",
    "role": "user",
    "created_at": "2023-07-03T15:43:43.595Z",
    "updated_at": "2023-07-03T15:43:43.595Z"
  }
}
```

### Admin Endpoints

#### List All Users

```
GET /api/admin/v1/users
```

Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:

```json
{
  "data": [
    {
      "_id": "64a2a343ed43878ae31fb0a5",
      "username": "boss@test.com",
      "name": "boss",
      "role": "admin",
      "is_admin": true,
      "created_at": "2023-07-03T15:43:51.339Z",
      "updated_at": "2023-07-03T15:43:51.339Z"
    },
    {
      "_id": "64a2a373ed43878ae31fb0bd",
      "username": "alibaba@test.com",
      "name": "alibaba",
      "role": "user",
      "created_at": "2023-07-03T15:43:43.595Z",
      "updated_at": "2023-07-03T15:43:43.595Z"
    }
  ]
}
```

#### Get User by ID

```
GET /api/admin/v1/users/:userId
```

Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:

```json
{
  "data": {
    "_id": "64a2a343ed43878ae31fb0a5",
    "username": "boss@test.com",
    "name": "boss",
    "role": "admin",
    "is_admin": true,
    "created_at": "2023-07-03T15:43:51.339Z",
    "updated_at": "2023-07-03T15:43:51.339Z"
  }
}
```

#### Create User (Admin only)

```
POST /api/admin/v1/users
```

Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Request body:

```json
{
  "username": "newuser@test.com",
  "password": "password",
  "name": "New User",
  "role": "user"
}
```

#### Update User (Admin only)

```
PUT /api/admin/v1/users/:userId
```

Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Request body:

```json
{
  "username": "updated@test.com",
  "name": "Updated Name",
  "role": "user"
}
```

#### Delete User (Admin only)

```
DELETE /api/admin/v1/users/:userId
```

Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check your connection string in the .env file
   - Verify network connectivity to the database server

2. **Authentication Issues**

   - JWT token expired: Ensure you're using a valid token
   - Refresh token invalid: Make sure you're using the correct refresh token
   - Permission denied: Check if your user has the required role (admin vs user)

3. **API Request Errors**
   - 400 Bad Request: Check your request body format
   - 401 Unauthorized: Make sure you're including the Authorization header
   - 403 Forbidden: Verify you have permission for the requested resource
   - 404 Not Found: Ensure the resource exists and the URL is correct
   - 500 Server Error: Check server logs for more information

## License

This project is licensed under the ISC License.
