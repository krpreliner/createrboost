const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Membership = require('./models/Membership');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Membership.deleteMany();

    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@ironedgegym.com',
      password: 'password123',
      role: 'admin',
      phone: '6202356575'
    });
    
    // The password will be hashed automatically by the pre-save hook in User model
    const createdAdmin = await adminUser.save();

    const sampleUsers = [
      {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        password: 'password123',
        role: 'user',
        phone: '9876543210',
        membershipStatus: 'active'
      },
      {
        name: 'Priya Singh',
        email: 'priya@example.com',
        password: 'password123',
        role: 'user',
        phone: '8765432109',
        membershipStatus: 'active'
      },
      {
        name: 'Amit Kumar',
        email: 'amit@example.com',
        password: 'password123',
        role: 'user',
        phone: '7654321098',
        membershipStatus: 'inactive'
      }
    ];

    for (const sample of sampleUsers) {
      const user = new User(sample);
      await user.save();
    }
    
    // Get the first user we just created to attach the membership to
    const createdUsers = await User.find({ role: 'user' });

    // Create a membership for Rahul
    const membership1 = new Membership({
      user: createdUsers[0]._id,
      planName: 'Elite',
      duration: 'yearly',
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      price: 40000,
      status: 'active',
      paymentStatus: 'completed',
      paymentMethod: 'Credit Card'
    });

    await membership1.save();

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
