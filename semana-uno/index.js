const express = require('express');
const app = express();
const employeesRouter = require('./routes/employees');

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

// Determine the port based on the environment
const port = process.env.NODE_ENV === 'production' ? 8000 : 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Employee routes
 * @name employees
 * @route {GET} /api/employees
 * @apiDescription Get a list of employees
 * @apiParam {Number} [page] Page number (default: 1)
 * @apiParam {String} [badges] Comma-separated list of badges to filter employees by
 * @apiParam {Boolean} [user] Filter employees by user privileges (default: false)
 *
 * @route {GET} /api/employees/oldest
 * @apiDescription Get the oldest employee
 *
 * @route {GET} /api/employees/:name
 * @apiDescription Get an employee by name
 *
 * @route {POST} /api/employees
 * @apiDescription Add a new employee
 */
app.use('/api/employees', employeesRouter);

/**
 * Middleware to handle CORS
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/**
 * Middleware to handle errors
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

/**
 * @api {get} / Root endpoint
 * @apiName GetRoot
 * @apiGroup Root
 * @apiSuccess {Object} response Welcome message
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Welcome to our API! go to /api/employees for more information"
 *     }
 */
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to our API! go to /api/employees for more information' });
});

/**
 * Start the Express server
 */
let server;

const startServer = () => {
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      const actualPort = server.address().port;
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${actualPort}`);
      resolve(server);
    });

    server.on('error', (err) => {
      reject(err);
    });
  });
};

const stopServer = () => {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => {
        console.log('Server stopped');
        resolve();
      });
    } else {
      resolve();
    }
  });
};

// Only start the server if this file is run directly (not required as a module)
if (require.main === module) {
  const port = process.env.NODE_ENV === 'production' ? 8000 : 3000;
  startServer(port);
}
module.exports = { app, startServer, stopServer };
