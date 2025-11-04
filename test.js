require('dotenv').config();
const http = require('http');

const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

let testsPassed = 0;
let testsFailed = 0;
let createdId = null;

// Helper function to make API requests
function apiRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: `/api${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    resolve({ status: res.statusCode, data: response });
                } catch (error) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// Test helper
function test(name, fn) {
    return fn()
        .then(() => {
            console.log(`✅ PASS: ${name}`);
            testsPassed++;
        })
        .catch(error => {
            console.error(`❌ FAIL: ${name}`);
            console.error(`   Error: ${error.message}`);
            testsFailed++;
        });
}

// Run tests
async function runTests() {
    console.log('\n🧪 Starting Data Manager API Tests...\n');
    console.log('='.repeat(50));

    // Test 1: Get stats
    await test('GET /api/stats - Should return statistics', async () => {
        const { status, data } = await apiRequest('GET', '/stats');
        if (status !== 200) throw new Error(`Expected 200, got ${status}`);
        if (!data.success) throw new Error('Response not successful');
        if (typeof data.stats.totalEntries !== 'number') throw new Error('Invalid stats format');
    });

    // Test 2: Get all data (empty)
    await test('GET /api/data - Should return empty array initially', async () => {
        const { status, data } = await apiRequest('GET', '/data');
        if (status !== 200) throw new Error(`Expected 200, got ${status}`);
        if (!data.success) throw new Error('Response not successful');
        if (!Array.isArray(data.data)) throw new Error('Data is not an array');
    });

    // Test 3: Create new entry
    await test('POST /api/data - Should create new entry', async () => {
        const newData = {
            name: 'Test Entry',
            value: 'Test Value',
            metadata: { test: true }
        };
        const { status, data } = await apiRequest('POST', '/data', newData);
        if (status !== 201) throw new Error(`Expected 201, got ${status}`);
        if (!data.success) throw new Error('Response not successful');
        if (!data.data.id) throw new Error('No ID returned');
        createdId = data.data.id;
    });

    // Test 4: Get entry by ID
    await test('GET /api/data/:id - Should get entry by ID', async () => {
        if (!createdId) throw new Error('No created ID available');
        const { status, data } = await apiRequest('GET', `/data/${createdId}`);
        if (status !== 200) throw new Error(`Expected 200, got ${status}`);
        if (!data.success) throw new Error('Response not successful');
        if (data.data.name !== 'Test Entry') throw new Error('Wrong entry returned');
    });

    // Test 5: Update entry
    await test('PUT /api/data/:id - Should update entry', async () => {
        if (!createdId) throw new Error('No created ID available');
        const updateData = {
            name: 'Updated Entry',
            value: 'Updated Value',
            metadata: { updated: true }
        };
        const { status, data } = await apiRequest('PUT', `/data/${createdId}`, updateData);
        if (status !== 200) throw new Error(`Expected 200, got ${status}`);
        if (!data.success) throw new Error('Response not successful');
        if (data.data.name !== 'Updated Entry') throw new Error('Entry not updated');
    });

    // Test 6: Search entries
    await test('GET /api/search - Should search entries', async () => {
        const { status, data } = await apiRequest('GET', '/search?q=Updated');
        if (status !== 200) throw new Error(`Expected 200, got ${status}`);
        if (!data.success) throw new Error('Response not successful');
        if (!Array.isArray(data.data)) throw new Error('Data is not an array');
        if (data.data.length === 0) throw new Error('No results found');
    });

    // Test 7: Delete entry
    await test('DELETE /api/data/:id - Should delete entry', async () => {
        if (!createdId) throw new Error('No created ID available');
        const { status, data } = await apiRequest('DELETE', `/data/${createdId}`);
        if (status !== 200) throw new Error(`Expected 200, got ${status}`);
        if (!data.success) throw new Error('Response not successful');
    });

    // Test 8: Verify deletion
    await test('GET /api/data/:id - Should return 404 for deleted entry', async () => {
        if (!createdId) throw new Error('No created ID available');
        const { status } = await apiRequest('GET', `/data/${createdId}`);
        if (status !== 404) throw new Error(`Expected 404, got ${status}`);
    });

    // Test 9: Invalid API key
    await test('Authentication - Should reject invalid API key', async () => {
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: '/api/data',
            method: 'GET',
            headers: {
                'X-API-Key': 'invalid-key'
            }
        };
        
        const { status } = await new Promise((resolve) => {
            const req = http.request(options, (res) => {
                resolve({ status: res.statusCode });
            });
            req.end();
        });
        
        if (status !== 401) throw new Error(`Expected 401, got ${status}`);
    });

    console.log('='.repeat(50));
    console.log(`\n📊 Test Results:`);
    console.log(`   ✅ Passed: ${testsPassed}`);
    console.log(`   ❌ Failed: ${testsFailed}`);
    console.log(`   📈 Total: ${testsPassed + testsFailed}`);
    
    if (testsFailed === 0) {
        console.log('\n🎉 All tests passed!\n');
        process.exit(0);
    } else {
        console.log('\n⚠️  Some tests failed!\n');
        process.exit(1);
    }
}

// Wait for server to be ready
setTimeout(runTests, 2000);

