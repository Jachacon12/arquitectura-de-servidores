const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mockCitations = require('../mockData/citationData');

async function startServer() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri, {
    dbName: 'citationsDB',
  });
  console.log('Connected to Database');

  const db = mongoose.connection;
  await db.collection('citations').insertMany(mockCitations);
  console.log('Mock data inserted');

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Connection to MongoDB closed');
    await mongod.stop();
    console.log('Server stopped');
    process.exit(0);
  });

  return mongod; // Return the mongod instance for potential use outside this function
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
