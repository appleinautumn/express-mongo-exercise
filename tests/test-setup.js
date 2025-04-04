// Setup environment variables for tests
process.env.JWT_SECRET = 'test_jwt_secret_key';
process.env.JWT_EXPIRATION = '1h';
process.env.REFRESH_TOKEN_EXPIRATION = '7d';
process.env.NODE_ENV = 'test';