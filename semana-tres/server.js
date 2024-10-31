const express = require('express');
const routes = require('./config/routes.config');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

require('./config/db.config');

// Middleware
app.use(express.json());

app.use(errorMiddleware);

// Routes
app.use('/api', routes);

module.exports = app;
