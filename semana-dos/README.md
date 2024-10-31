# Citation Management API

## Overview

This project is a Node.js application that provides a CRUD API for managing citations. It's built with Express.js and uses MongoDB for data persistence. The application is designed with a modular structure, making it easy to maintain and scale.

## Features

- Create, read, update, and delete citations
- CRUD API design
- MongoDB integration using Mongoose ODM
- Environment-aware configuration (development/production)
- Comprehensive test suite

## Prerequisites

- Node.js (v14 or later recommended)
- MongoDB

## Installation

1. Clone the repository:

```
git clone https://github.com/Jachacon12/arquitectura-de-servidores.git
cd semana-dos
```

2. Install dependencies:

```
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

```
NODE_ENV=development
MONGODB_URI=<your-mongodb-connection-string>
```

## Running the Application

To start the server in development mode:

```
npm run dev
```

For production:

```
npm start
```

The server will start on `http://localhost:3000` for development and `http://localhost:8000` for production.

## API Endpoints

- `POST /api/citations`: Create a new citation
- `GET /api/citations`: Retrieve all citations
- `GET /api/citations/:id`: Retrieve a specific citation
- `PUT /api/citations/:id`: Update a specific citation
- `DELETE /api/citations/:id`: Delete a specific citation

## Testing

To run the test suite:

```
npm test
```

## Project Structure

- `server.js`: Main application entry point
- `config/`: Configuration files including database and server setup
- `models/`: MongoDB schema definitions
- `routes/`: API route definitions
- `tests/`: Test files

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.