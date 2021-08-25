const mongoose = require('mongoose')

const mongoDbUri = process.env.MONGODB_URI

if (!mongoDbUri) {
  console.error('MongoDB connection string missing!')
  process.exit(1)
}

mongoose.connect(mongoDbUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})

const db = mongoose.connection

db.on('error', err => {
  console.error('MongoDB error: ' + err.message)
  process.exit(1)
})

db.once('open', () => console.log('MongoDB connection established.'))
