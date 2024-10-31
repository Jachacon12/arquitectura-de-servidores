# Employee API Server

This project is an Express.js server that provides an API for managing employee data.

## Features

- RESTful API for employee management
- Supports both development and production environments
- CORS enabled
- JSON Certainly! I'll create a README.md file for your project based on the information we have. Here's a template that you can use as a starting point:

# Employee Management API

This project is an Express.js-based API for managing employee data. It provides endpoints for retrieving, adding, and filtering employee information.

## Features

- Get a list of employees with pagination and filtering options
- Retrieve the oldest employee
- Get an employee by name
- Add a new employee
- CORS support
- Environment-based port configuration (development/production)

## Prerequisites

- Node.js (version 12.x or higher recommended)
- npm (comes with Node.js)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/Jachacon12/arquitectura-de-servidores.git
   cd semana-uno
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Usage

### Development Mode

To run the server in development mode (port 3000):

```
npm dev
```

### Production Mode

To run the server in production mode (port 8000):

```
npm run start
```

## API Endpoints

- `GET /api/employees`: Get a list of employees

  - Query Parameters:
    - `page`: Page number (default: 1)
    - `badges`: Comma-separated list of badges to filter employees by
    - `user`: Filter employees by user privileges (default: false)

- `GET /api/employees/oldest`: Get the oldest employee

- `GET /api/employees/:name`: Get an employee by name

- `POST /api/employees`: Add a new employee

For detailed API documentation, please refer to the JSDoc comments in the source code or generate API documentation using the following command:

```
npm run generate-docs
```

## Configuration

The server port is determined by the `NODE_ENV` environment variable:

- Development: Port 3000 (default)
- Production: Port 8000
