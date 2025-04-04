const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const path = require("path");

const userModelPath = path.join(__dirname, "../../domains/user.model");
const { users } = require("./users");

const User = require(userModelPath);
let mongoServer;

// Connect to the in-memory database
const setupDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);

  // Seed the database with test users
  await User.deleteMany({});
  await User.insertMany(users);
};

// Close database connection
const teardownDB = async () => {
  if (mongoServer) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  }
};

// Clear all data but keep the connection
const clearDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
};

module.exports = {
  setupDB,
  teardownDB,
  clearDB,
};
