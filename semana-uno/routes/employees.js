const express = require('express');
const router = express.Router();
const employees = require('../data/employees.json');
const validateEmployeeSchema = require('../middleware/validateEmployee');

async function saveToDatabase(newData, database) {
  // This is just a placeholder implementation
  database.push(newData);
  return newData;
}

/**
 * Handles the POST request to add a new employee.
 *
 * @param {string} path - The route path, in this case '/'.
 * @param {Function} validateEmployeeSchema - Middleware function to validate the employee schema.
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing the employee data.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves when the response has been sent.
 */
router.post('/', validateEmployeeSchema, async (req, res) => {
  try {
    const savedEmployee = await saveToDatabase(req.body, employees);
    res.status(201).json({ message: 'Employee added successfully', data: savedEmployee });
  } catch (error) {
    res.status(500).json({ error: 'Error saving employee', details: error.message });
  }
});

/**
 * Retrieves employees based on pagination or badge filtering.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.query - Query parameters from the request URL.
 * @param {number} [req.query.page] - The page number for pagination.
 * @param {string} [req.query.badges] - The badge to filter employees by.
 * @param {Object} res - Express response object.
 * @returns {void} Sends a JSON response with the filtered employees or all employees if no filters are applied.
 */
router.get('/', (req, res) => {
  const page = parseInt(req.query.page);
  const badges = req.query.badges;

  if (Number.isInteger(page) && page > 0) {
    const limit = 2;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const employeesOnPage = employees.slice(startIndex, endIndex);
    res.json(employeesOnPage);
  } else if (badges) {
    const badgesEmployees = employees.filter((e) => e.badges.includes(badges));
    res.json(badgesEmployees);
  } else {
    res.json(employees);
  }
});

/**
 * Retrieves the oldest employee from the employees array.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void} Sends a JSON response containing the oldest employee's data.
 */
router.get('/oldest', (req, res) => {
  const oldestEmployee = employees.reduce((oldest, current) => (current.age > oldest.age ? current : oldest));
  res.json(oldestEmployee);
});

/**
 * Retrieves all employees with 'user' privileges.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void} Sends a JSON response with an array of employees having 'user' privileges.
 */
router.get('/user', (req, res) => {
  const userEmployees = employees.filter((e) => e.privileges === 'user');
  res.json(userEmployees);
});

/**
 * Retrieves an employee by their name.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.name - The name of the employee to find.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with either the employee data or an error message.
 */
router.get('/:name', (req, res) => {
  const { name } = req.params;
  const employee = employees.find((e) => e.name.toLowerCase() === name.toLowerCase());

  if (employee) {
    res.json(employee);
  } else {
    res.status(404).json({ code: 'not_found', message: 'Employee not found' });
  }
});

module.exports = router;
