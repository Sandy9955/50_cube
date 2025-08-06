const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');
  
  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connectivity...');
    const catalogResponse = await axios.get(`${BASE_URL}/merch/catalog`);
    console.log(`✅ Server is running - Catalog has ${catalogResponse.data.products.length} products`);
    
    // Test 2: Test login
    console.log('\n2. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/signin`, {
      email: 'user@50cube.com',
      password: 'user123'
    });
    console.log('✅ User login successful');
    const userToken = loginResponse.data.token;
    
    // Test 3: Test admin login
    console.log('\n3. Testing admin login...');
    const adminResponse = await axios.post(`${BASE_URL}/auth/signin`, {
      email: 'admin@50cube.com',
      password: 'admin123'
    });
    console.log('✅ Admin login successful');
    const adminToken = adminResponse.data.token;
    
    // Test 4: Test merch quote
    console.log('\n4. Testing merch quote...');
    const product = catalogResponse.data.products[0];
    const quoteResponse = await axios.post(`${BASE_URL}/merch/quote`, {
      productId: product._id || product.id,
      creditsToUse: 1000
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Merch quote successful');
    
    // Test 5: Test admin metrics
    console.log('\n5. Testing admin metrics...');
    const metricsResponse = await axios.get(`${BASE_URL}/admin/metrics`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Admin metrics successful');
    
    // Test 6: Test lanes
    console.log('\n6. Testing lanes...');
    const lanesResponse = await axios.get(`${BASE_URL}/admin/lanes/impact`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✅ Lanes successful - ${lanesResponse.data.lanes.length} lanes found`);
    
    console.log('\n🎉 All API tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI(); 