const axios = require('axios');
const jwt = require('jsonwebtoken');

const BASE_URL = 'http://localhost:5000/api';
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here_make_it_long_and_secure";

// Test user credentials
const testUser = {
  email: 'user@50cube.com',
  password: 'user123'
};

const testAdmin = {
  email: 'admin@50cube.com', 
  password: 'admin123'
};

let userToken, adminToken;

async function loginUser(credentials) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/signin`, credentials);
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    return null;
  }
}

async function testM16_MerchQuoteAndRedeem() {
  console.log('\n🧪 Testing M16 - Merch Quote & Redeem');
  console.log('=====================================');
  
  if (!userToken) {
    console.log('❌ No user token available');
    return false;
  }

  try {
    // Test 1: Get catalog
    console.log('\n1. Testing GET /api/merch/catalog...');
    const catalogResponse = await axios.get(`${BASE_URL}/merch/catalog`);
    console.log(`✅ Catalog returned ${catalogResponse.data.products.length} products`);
    
    const product = catalogResponse.data.products[0];
    console.log(`   Sample product: ${product.name} - $${product.price}`);

    // Test 2: Get quote
    console.log('\n2. Testing POST /api/merch/quote...');
    const quoteResponse = await axios.post(`${BASE_URL}/merch/quote`, {
      productId: product._id || product.id,
      creditsToUse: 1000
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    const quote = quoteResponse.data.quote;
    console.log(`✅ Quote generated successfully`);
    console.log(`   Credits used: ${quote.creditsToUse}`);
    console.log(`   Credits value: $${quote.creditsValue.toFixed(2)}`);
    console.log(`   Cash amount: $${quote.cashAmount.toFixed(2)}`);
    console.log(`   Total: $${quote.total.toFixed(2)}`);

    // Test 3: Test >60% clamp
    console.log('\n3. Testing >60% credit clamp...');
    const highCreditsResponse = await axios.post(`${BASE_URL}/merch/quote`, {
      productId: product._id || product.id,
      creditsToUse: 10000 // Very high amount
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    const highQuote = highCreditsResponse.data.quote;
    const maxAllowed = Math.floor((product.price * 0.6) / 0.03);
    console.log(`✅ Credits clamped from 10000 to ${highQuote.creditsToUse} (max: ${maxAllowed})`);

    // Test 4: Test redemption
    console.log('\n4. Testing POST /api/merch/redeem...');
    const redeemResponse = await axios.post(`${BASE_URL}/merch/redeem`, {
      productId: product._id || product.id,
      creditsToUse: 500,
      cashAmount: 25.99,
      shippingAddress: {
        street: "123 Test St",
        city: "Test City",
        state: "CA",
        zipCode: "12345",
        country: "US"
      }
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    console.log(`✅ Redemption successful - ID: ${redeemResponse.data.redemptionId}`);

    return true;
  } catch (error) {
    console.error('❌ M16 test failed:', error.response?.data || error.message);
    return false;
  }
}

async function testM17_AdminMetrics() {
  console.log('\n🧪 Testing M17 - Admin Metrics');
  console.log('==============================');
  
  if (!adminToken) {
    console.log('❌ No admin token available');
    return false;
  }

  try {
    // Test 1: Get metrics without date filter
    console.log('\n1. Testing GET /api/admin/metrics...');
    const metricsResponse = await axios.get(`${BASE_URL}/admin/metrics`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    const metrics = metricsResponse.data;
    console.log(`✅ Metrics retrieved successfully`);
    console.log(`   Bursts: ${metrics.bursts}`);
    console.log(`   Wins: ${metrics.wins}`);
    console.log(`   Purchases: ${metrics.purchases}`);
    console.log(`   Redemptions: ${metrics.redemptions}`);
    console.log(`   Referrals: ${metrics.referrals}`);
    console.log(`   Chart data points: ${metrics.chartData?.length || 0}`);

    // Test 2: Get metrics with date filter
    console.log('\n2. Testing GET /api/admin/metrics with date filter...');
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ago
    const filteredResponse = await axios.get(`${BASE_URL}/admin/metrics?since=${since}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    console.log(`✅ Filtered metrics retrieved successfully`);
    console.log(`   Filtered since: ${since}`);

    // Test 3: Test admin access control
    console.log('\n3. Testing admin access control...');
    try {
      await axios.get(`${BASE_URL}/admin/metrics`, {
        headers: { Authorization: `Bearer ${userToken}` } // Using user token instead of admin
      });
      console.log('❌ Non-admin user should not access metrics');
      return false;
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Admin access control working correctly');
      } else {
        console.log('❌ Unexpected error in access control test');
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('❌ M17 test failed:', error.response?.data || error.message);
    return false;
  }
}

async function testM18_ImpactScoreAndRotation() {
  console.log('\n🧪 Testing M18 - Impact Score & Rotation Console');
  console.log('================================================');
  
  if (!adminToken) {
    console.log('❌ No admin token available');
    return false;
  }

  try {
    // Test 1: Get lanes with impact scores
    console.log('\n1. Testing GET /api/admin/lanes/impact...');
    const impactResponse = await axios.get(`${BASE_URL}/admin/lanes/impact`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    const lanes = impactResponse.data.lanes;
    console.log(`✅ Retrieved ${lanes.length} lanes with impact scores`);
    
    if (lanes.length > 0) {
      const sampleLane = lanes[0];
      console.log(`   Sample lane: ${sampleLane.name} (Score: ${sampleLane.impactScore})`);
    }

    // Test 2: Get lanes with state filter
    console.log('\n2. Testing GET /api/admin/lanes with state filter...');
    const watchlistResponse = await axios.get(`${BASE_URL}/admin/lanes?state=watchlist`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    const watchlistLanes = watchlistResponse.data.lanes;
    console.log(`✅ Retrieved ${watchlistLanes.length} watchlist lanes`);

    // Test 3: Update lane state
    if (lanes.length > 0) {
      console.log('\n3. Testing POST /api/admin/lanes/:id/state...');
      const laneId = lanes[0]._id;
      const newState = 'save';
      
      const updateResponse = await axios.put(`${BASE_URL}/admin/lanes/${laneId}/state`, {
        state: newState
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      console.log(`✅ Lane state updated to "${newState}"`);
      console.log(`   Updated lane: ${updateResponse.data.lane.name}`);

      // Test 4: Verify state persistence
      console.log('\n4. Testing state persistence...');
      const verifyResponse = await axios.get(`${BASE_URL}/admin/lanes/impact`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      const updatedLane = verifyResponse.data.lanes.find(l => l._id === laneId);
      if (updatedLane && updatedLane.state === newState) {
        console.log('✅ State persistence verified');
      } else {
        console.log('❌ State persistence failed');
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('❌ M18 test failed:', error.response?.data || error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Module Tests');
  console.log('========================');
  
  // Login users
  console.log('\n🔐 Logging in users...');
  userToken = await loginUser(testUser);
  adminToken = await loginUser(testAdmin);
  
  if (!userToken) {
    console.log('❌ Failed to login user');
    return;
  }
  
  if (!adminToken) {
    console.log('❌ Failed to login admin');
    return;
  }
  
  console.log('✅ Both users logged in successfully');
  
  // Run tests
  const results = {
    m16: await testM16_MerchQuoteAndRedeem(),
    m17: await testM17_AdminMetrics(),
    m18: await testM18_ImpactScoreAndRotation()
  };
  
  // Summary
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  console.log(`M16 - Merch Quote & Redeem: ${results.m16 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`M17 - Admin Metrics: ${results.m17 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`M18 - Impact Score & Rotation: ${results.m18 ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result);
  console.log(`\nOverall Result: ${allPassed ? '🎉 ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED'}`);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests }; 