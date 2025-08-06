const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./server/models/User');
require('dotenv').config();

async function testUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/50cube");
    
    // Clear existing test user
    await User.deleteOne({ email: 'test@50cube.com' });
    
    // Create a test user
    const hashedPassword = await bcrypt.hash('test123', 12);
    const user = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@50cube.com',
      password: hashedPassword,
      credits: 1000,
      isAdmin: false
    });
    
    await user.save();
    console.log('✅ Test user created successfully');
    
    // Test password comparison
    const testUser = await User.findOne({ email: 'test@50cube.com' });
    const isValid = await bcrypt.compare('test123', testUser.password);
    console.log('✅ Password comparison:', isValid);
    
    // Test login
    const loginUser = await User.findOne({ email: 'test@50cube.com' });
    if (!loginUser) {
      console.log('❌ User not found');
      return;
    }
    
    const isPasswordValid = await bcrypt.compare('test123', loginUser.password);
    console.log('✅ Login test:', isPasswordValid);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testUser(); 