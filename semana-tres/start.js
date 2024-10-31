const app = require('./server');
const { startServer } = require('./config/server.config');

if (require.main === module) {
  startServer(app).catch((error) => console.error(error));
}
