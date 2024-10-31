const { connectDB, disconnectDB } = require('./db.config');

let server;

async function startServer(app) {
  if (!app) {
    throw new Error('Express app is required to start the server');
  }
  await connectDB();

  const port = process.env.NODE_ENV === 'production' ? 8000 : 3000;

  return new Promise((resolve) => {
    server = app.listen(port, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function stopServer() {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await disconnectDB();
}

module.exports = { startServer, stopServer };
