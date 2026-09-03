const mongoose = require('mongoose');
require('dotenv').config();

const fix = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const result = await db.collection('users').updateMany({}, { $set: { isActive: true } });
    console.log("Updated users:", result.modifiedCount);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
fix();
