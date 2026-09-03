const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const roles = ['owner', 'admin', 'driver', 'warehouse_manager', 'accountant', 'general_manager'];
    const defaultPassword = 'Password@123'; // The User model hooks will hash this

    for (const role of roles) {
      const email = `${role}@velanx.com`;
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        await User.create({
          name: `${role.replace('_', ' ').toUpperCase()}`,
          email,
          phone: `99999${Math.floor(10000 + Math.random() * 90000)}`, // Random 10-digit phone
          password: defaultPassword,
          role
        });
        console.log(`✅ Created ${role} user: ${email} / ${defaultPassword}`);
      } else {
        console.log(`ℹ️ ${role} user already exists: ${email}`);
      }
    }

    console.log('Done seeding users.');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedUsers();
