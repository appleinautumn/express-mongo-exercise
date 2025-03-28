const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const { authenticated, isAdmin } = require('../../middlewares/authenticated');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('http-errors');

describe('Authentication Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {},
      user: null,
    };
    res = {};
    next = jest.fn();

    // Reset mocks
    jwt.verify.mockReset();
    createError.mockReset();
    createError.mockImplementation((code, message) => {
      const error = new Error(message);
      error.code = code;
      error.statusCode = code;
      return error;
    });
  });

  describe('authenticated', () => {
    test('should pass with valid token', async () => {
      // Setup
      const token = 'valid.jwt.token';
      const decoded = { sub: 'userId', is_admin: false };
      req.headers.authorization = `Bearer ${token}`;

      // Mock jwt.verify to call callback with decoded token
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, decoded);
      });

      // Execute
      await authenticated(req, res, next);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET, expect.any(Function));
      expect(req.user).toEqual({ id: decoded.sub, is_admin: decoded.is_admin });
      expect(next).toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledTimes(1);
    });

    test('should fail without Authorization header', async () => {
      // Setup
      createError.mockReturnValue({ message: 'Invalid credentials.' });

      // Execute
      await authenticated(req, res, next);

      // Assert
      expect(createError).toHaveBeenCalledWith(401, 'Invalid credentials.');
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Invalid credentials.' })
      );
      expect(next).toHaveBeenCalledTimes(1);
    });

    test('should fail with malformed Authorization header', async () => {
      // Setup
      req.headers.authorization = 'InvalidFormat';
      createError.mockReturnValue({ message: 'Invalid credentials.' });

      // Execute
      await authenticated(req, res, next);

      // Assert
      expect(createError).toHaveBeenCalledWith(401, 'Invalid credentials.');
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Invalid credentials.' })
      );
    });

    test('should fail with invalid token', async () => {
      // Setup
      req.headers.authorization = 'Bearer invalid.token';
      createError.mockReturnValue({ message: 'Failed to authenticate token.' });

      // Mock jwt.verify to call callback with error
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error('Invalid token'), null);
      });

      // Execute
      await authenticated(req, res, next);

      // Assert
      expect(jwt.verify).toHaveBeenCalled();
      expect(createError).toHaveBeenCalledWith(401, 'Failed to authenticate token.');
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Failed to authenticate token.' })
      );
    });
  });

  describe('isAdmin', () => {
    test('should pass with admin user', () => {
      // Setup
      req.user = { id: 'adminId', is_admin: true };

      // Execute
      isAdmin(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith();
    });

    test('should fail with non-admin user', () => {
      // Setup
      req.user = { id: 'userId', is_admin: false };
      createError.mockReturnValue({ message: 'Forbidden.' });

      // Execute
      expect(() => {
        isAdmin(req, res, next);
      }).toThrow();

      // Assert
      expect(createError).toHaveBeenCalledWith(403, 'Forbidden.');
    });

    test('should fail without is_admin property', () => {
      // Setup
      req.user = { id: 'userId' }; // Missing is_admin
      createError.mockReturnValue({ message: 'Forbidden.' });

      // Execute
      expect(() => {
        isAdmin(req, res, next);
      }).toThrow();

      // Assert
      expect(createError).toHaveBeenCalledWith(403, 'Forbidden.');
    });
  });
});
