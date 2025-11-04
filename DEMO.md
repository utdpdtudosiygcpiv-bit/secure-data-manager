# 🎬 Demo & Usage Guide

## 🚀 Quick Demo

### Step 1: Start the Server

```bash
npm start
```

You should see:
```
✅ Database initialized
🚀 Data Manager Server running on port 3000
📊 Database: ./data.db
🌐 Open http://localhost:3000 in your browser
```

---

### Step 2: Open the Web Interface

Navigate to: `http://localhost:3000`

You'll see:
- 🔑 API Key input section at the top
- ➕ Add New Entry form
- 🔍 Search bar
- 📊 Data table (empty initially)

---

### Step 3: Set Your API Key

1. Look at your `.env` file to find your API key
2. Enter it in the "API Key" field
3. Click "Save Key"
4. You should see: ✅ "API key saved successfully"

---

### Step 4: Add Your First Entry

Fill in the form:
- **Name**: `My First Entry`
- **Value**: `Hello, Data Manager!`
- **Metadata**: `{"category": "test", "priority": "high"}`

Click "Add Entry"

You should see:
- ✅ "Entry created successfully"
- The entry appears in the table below

---

### Step 5: Try Other Operations

#### Edit an Entry
1. Click "Edit" button on any entry
2. Form fills with current data
3. Modify the fields
4. Click "Update Entry"
5. ✅ "Entry updated successfully"

#### Search
1. Type in the search box
2. Results filter in real-time
3. Try searching for part of a name or value

#### Delete
1. Click "Delete" button
2. Confirm the deletion
3. ✅ "Entry deleted successfully"

---

## 🔌 API Demo

### Using cURL

#### 1. Create an Entry
```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secure-api-key-change-this-in-production" \
  -d '{
    "name": "API Test Entry",
    "value": "Created via cURL",
    "metadata": {"source": "terminal", "timestamp": "2024-01-01"}
  }'
```

**Expected Output:**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-...",
    "name": "API Test Entry",
    "value": "Created via cURL",
    ...
  },
  "message": "Data created successfully"
}
```

#### 2. Get All Entries
```bash
curl http://localhost:3000/api/data \
  -H "X-API-Key: your-secure-api-key-change-this-in-production"
```

#### 3. Search
```bash
curl "http://localhost:3000/api/search?q=API" \
  -H "X-API-Key: your-secure-api-key-change-this-in-production"
```

#### 4. Get Statistics
```bash
curl http://localhost:3000/api/stats \
  -H "X-API-Key: your-secure-api-key-change-this-in-production"
```

---

## 🧪 Testing Demo

Run the automated tests:

```bash
npm test
```

**Expected Output:**
```
🧪 Starting Data Manager API Tests...

==================================================
✅ PASS: GET /api/stats - Should return statistics
✅ PASS: GET /api/data - Should return empty array initially
✅ PASS: POST /api/data - Should create new entry
✅ PASS: GET /api/data/:id - Should get entry by ID
✅ PASS: PUT /api/data/:id - Should update entry
✅ PASS: GET /api/search - Should search entries
✅ PASS: DELETE /api/data/:id - Should delete entry
✅ PASS: GET /api/data/:id - Should return 404 for deleted entry
✅ PASS: Authentication - Should reject invalid API key
==================================================

📊 Test Results:
   ✅ Passed: 9
   ❌ Failed: 0
   📈 Total: 9

🎉 All tests passed!
```

---

## 💡 Use Cases

### 1. Configuration Storage
Store app configurations:
```json
{
  "name": "app_config",
  "value": "production",
  "metadata": {
    "database_url": "...",
    "api_timeout": 5000,
    "max_retries": 3
  }
}
```

### 2. User Preferences
Store user settings:
```json
{
  "name": "user_123_preferences",
  "value": "dark_mode",
  "metadata": {
    "language": "ar",
    "notifications": true,
    "theme": "dark"
  }
}
```

### 3. Cache Storage
Store temporary data:
```json
{
  "name": "cache_weather_cairo",
  "value": "25°C Sunny",
  "metadata": {
    "expires": "2024-01-01T18:00:00Z",
    "source": "weather_api"
  }
}
```

### 4. Log Storage
Store application logs:
```json
{
  "name": "log_error_2024_01_01",
  "value": "Database connection failed",
  "metadata": {
    "level": "error",
    "timestamp": "2024-01-01T12:00:00Z",
    "stack_trace": "..."
  }
}
```

### 5. Feature Flags
Store feature toggles:
```json
{
  "name": "feature_new_ui",
  "value": "enabled",
  "metadata": {
    "rollout_percentage": 50,
    "target_users": ["beta_testers"]
  }
}
```

---

## 🎯 Real-World Scenarios

### Scenario 1: Mobile App Backend
Use Data Manager as a simple backend for a mobile app:
- Store user profiles
- Cache API responses
- Store app settings
- Log user actions

### Scenario 2: IoT Data Collection
Collect data from IoT devices:
- Sensor readings
- Device status
- Configuration updates
- Event logs

### Scenario 3: Microservice Configuration
Centralized config for microservices:
- Service endpoints
- Feature flags
- API keys (encrypted)
- Environment variables

### Scenario 4: Development/Testing
Quick data storage for development:
- Mock data
- Test fixtures
- Temporary storage
- Prototyping

---

## 📊 Performance Tips

1. **Pagination**: Use `limit` and `offset` for large datasets
   ```
   GET /api/data?limit=50&offset=100
   ```

2. **Search Optimization**: Be specific in search queries
   ```
   GET /api/search?q=exact_term
   ```

3. **Metadata**: Keep metadata reasonably sized
   - Good: `{"key": "value"}`
   - Avoid: Storing large files in metadata

4. **Database Backup**: Regular backups of `data.db`
   ```bash
   cp data.db data.db.backup
   ```

---

## 🔧 Troubleshooting Demo

### Test Authentication
```bash
# Should fail (401)
curl http://localhost:3000/api/data \
  -H "X-API-Key: wrong-key"

# Should succeed (200)
curl http://localhost:3000/api/data \
  -H "X-API-Key: your-secure-api-key-change-this-in-production"
```

### Test Rate Limiting
```bash
# Run this 101 times quickly
for i in {1..101}; do
  curl http://localhost:3000/api/stats \
    -H "X-API-Key: your-secure-api-key-change-this-in-production"
done
# After 100 requests, you should get rate limit error
```

### Test Error Handling
```bash
# Missing required field (400)
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secure-api-key-change-this-in-production" \
  -d '{}'

# Non-existent ID (404)
curl http://localhost:3000/api/data/non-existent-id \
  -H "X-API-Key: your-secure-api-key-change-this-in-production"
```

---

## 🎓 Learning Path

1. ✅ **Start the server** - Get it running
2. ✅ **Use the web interface** - Add/edit/delete entries
3. ✅ **Try the API with cURL** - Understand the endpoints
4. ✅ **Run the tests** - See how testing works
5. ✅ **Read the code** - Understand the implementation
6. ✅ **Customize** - Add your own features!

---

**Happy Data Managing! 🚀**

