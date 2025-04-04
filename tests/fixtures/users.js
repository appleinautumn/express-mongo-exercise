const bcrypt = require('bcrypt');

// Passwords are already hashed to simulate database state
const users = [
  {
    _id: '64a2a343ed43878ae31fb0a5',
    username: 'boss@test.com',
    password: '$2a$12$IyPVaxssAy6LHebVTM8dVeBZLKAJiIIWyR.2oyJslk7zqGL8Hxf1a', // hashed 'boss'
    role: 'admin',
    is_admin: true,
    name: 'boss',
    created_at: new Date('2023-07-03T15:43:51.339Z'),
    updated_at: new Date('2023-07-03T15:43:51.339Z'),
    refresh_token: 'f044851a-e69e-4d5d-8fd2-6ef1bdcc2e89',
    refresh_token_until: new Date('2023-08-02T15:48:08.803Z'),
    is_admin: true
  },
  {
    _id: '64a2a373ed43878ae31fb0bd',
    username: 'alibaba@test.com',
    password: '$2a$12$/zKbWxxizLBOX.E94znyd..CjS9ECiPeUBEqZJ9VBGctJAUOK8gA6', // hashed 'alibaba'
    role: 'user',
    is_admin: false,
    name: 'alibaba',
    created_at: new Date('2023-07-03T15:43:43.595Z'),
    updated_at: new Date('2023-07-03T15:43:43.595Z'),
    refresh_token: '823e2284-763e-453f-98d5-ce443b5d9f08',
    refresh_token_until: new Date('2023-08-02T15:45:25.874Z')
  }
];

// User with unhashed password for testing
const testUserCredentials = {
  admin: {
    username: 'boss@test.com',
    password: 'boss'
  },
  user: {
    username: 'alibaba@test.com',
    password: 'alibaba'
  },
  newUser: {
    username: 'newuser@test.com',
    password: 'password123',
    name: 'New User',
    role: 'user'
  }
};

module.exports = {
  users,
  testUserCredentials
};