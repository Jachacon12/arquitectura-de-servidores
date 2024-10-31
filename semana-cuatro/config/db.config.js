const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Citation = require('../models/citation.model');
const mockCitations = require('../mockData/citationData');

let mongod;

async function connectDB() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Insert mock data
  await Citation.insertMany(mockCitations);
  console.log('Mock data inserted');
}

async function disconnectDB() {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
}

module.exports = { connectDB, disconnectDB };
