# 🔌 API Examples - Data Manager

## Base URL
```
http://localhost:3000/api
```

## Authentication
All requests require API Key in header:
```
X-API-Key: your-api-key-here
```

---

## 📋 Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/data` | Get all entries |
| GET | `/data/:id` | Get entry by ID |
| POST | `/data` | Create new entry |
| PUT | `/data/:id` | Update entry |
| DELETE | `/data/:id` | Delete entry |
| GET | `/search?q=term` | Search entries |
| GET | `/stats` | Get statistics |

---

## 1️⃣ Create Entry

**Request:**
```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "name": "User Profile",
    "value": "John Doe",
    "metadata": {
      "email": "john@example.com",
      "age": 30
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "User Profile",
    "value": "John Doe",
    "metadata": "{\"email\":\"john@example.com\",\"age\":30}",
    "created_at": "2024-01-01 12:00:00",
    "updated_at": "2024-01-01 12:00:00"
  },
  "message": "Data created successfully"
}
```

---

## 2️⃣ Get All Entries

**Request:**
```bash
curl http://localhost:3000/api/data?limit=10&offset=0 \
  -H "X-API-Key: your-api-key"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "User Profile",
      "value": "John Doe",
      "metadata": "{\"email\":\"john@example.com\"}",
      "created_at": "2024-01-01 12:00:00",
      "updated_at": "2024-01-01 12:00:00"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "offset": 0,
    "hasMore": false
  }
}
```

---

## 3️⃣ Get Entry by ID

**Request:**
```bash
curl http://localhost:3000/api/data/550e8400-e29b-41d4-a716-446655440000 \
  -H "X-API-Key: your-api-key"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "User Profile",
    "value": "John Doe",
    "metadata": "{\"email\":\"john@example.com\"}",
    "created_at": "2024-01-01 12:00:00",
    "updated_at": "2024-01-01 12:00:00"
  }
}
```

---

## 4️⃣ Update Entry

**Request:**
```bash
curl -X PUT http://localhost:3000/api/data/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "name": "User Profile Updated",
    "value": "Jane Doe",
    "metadata": {
      "email": "jane@example.com",
      "age": 28
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "User Profile Updated",
    "value": "Jane Doe",
    "metadata": "{\"email\":\"jane@example.com\",\"age\":28}",
    "created_at": "2024-01-01 12:00:00",
    "updated_at": "2024-01-01 13:00:00"
  },
  "message": "Data updated successfully"
}
```

---

## 5️⃣ Search Entries

**Request:**
```bash
curl "http://localhost:3000/api/search?q=Profile" \
  -H "X-API-Key: your-api-key"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "User Profile Updated",
      "value": "Jane Doe",
      "metadata": "{\"email\":\"jane@example.com\"}",
      "created_at": "2024-01-01 12:00:00",
      "updated_at": "2024-01-01 13:00:00"
    }
  ],
  "count": 1
}
```

---

## 6️⃣ Delete Entry

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/data/550e8400-e29b-41d4-a716-446655440000 \
  -H "X-API-Key: your-api-key"
```

**Response:**
```json
{
  "success": true,
  "message": "Data deleted successfully"
}
```

---

## 7️⃣ Get Statistics

**Request:**
```bash
curl http://localhost:3000/api/stats \
  -H "X-API-Key: your-api-key"
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalEntries": 42
  }
}
```

---

## ❌ Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized: Invalid or missing API key"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Data not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "error": "Name is required"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## 🔒 Security Notes

- Always use HTTPS in production
- Keep your API key secret
- Rate limit: 100 requests per 15 minutes per IP
- All inputs are validated and sanitized

