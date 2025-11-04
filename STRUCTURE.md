# 📁 Project Structure - Data Manager

## Directory Tree

```
data-manager/
│
├── 📄 server.js              # Main Express server
├── 📄 database.js            # SQLite database layer
├── 📄 test.js                # API tests
├── 📄 package.json           # Dependencies & scripts
├── 📄 .env                   # Environment variables (API Key)
├── 📄 .gitignore            # Git ignore rules
├── 📄 start.sh              # Quick start script
│
├── 📁 routes/
│   └── 📄 api.js            # API endpoints & authentication
│
├── 📁 public/               # Frontend files
│   ├── 📄 index.html        # Main HTML page
│   ├── 📄 style.css         # Styling (dark theme)
│   └── 📄 app.js            # Frontend JavaScript
│
├── 📁 node_modules/         # Dependencies (auto-generated)
│
├── 📄 data.db               # SQLite database (auto-generated)
│
└── 📚 Documentation/
    ├── 📄 README.md         # Full documentation
    ├── 📄 QUICK_START_AR.md # Quick start guide (Arabic)
    ├── 📄 API_EXAMPLES.md   # API usage examples
    └── 📄 STRUCTURE.md      # This file
```

---

## 🔧 Core Files

### server.js
- Express server setup
- Middleware configuration (CORS, Helmet, Rate Limiting)
- Static file serving
- Error handling
- Database initialization

### database.js
- SQL.js wrapper
- CRUD operations (Create, Read, Update, Delete)
- Search functionality
- Database persistence to file

### routes/api.js
- API endpoint definitions
- API key authentication middleware
- Request validation
- Response formatting

---

## 🎨 Frontend Files

### public/index.html
- Clean, semantic HTML structure
- Form for adding/editing entries
- Data table display
- Search functionality
- Toast notifications

### public/style.css
- Dark theme design (#0a0a0a background)
- Neon green accents (#00ff88)
- Responsive layout
- Smooth animations
- Mobile-friendly

### public/app.js
- API communication
- Form handling
- Table rendering
- Search with debouncing
- Local storage for API key
- Toast notifications

---

## 🧪 Testing

### test.js
- 9 comprehensive tests
- API endpoint testing
- Authentication testing
- CRUD operation validation
- Error handling verification

**Test Coverage:**
- ✅ GET /api/stats
- ✅ GET /api/data
- ✅ POST /api/data
- ✅ GET /api/data/:id
- ✅ PUT /api/data/:id
- ✅ DELETE /api/data/:id
- ✅ GET /api/search
- ✅ 404 handling
- ✅ Authentication

---

## 📊 Database Schema

### Table: data_entries

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key (UUID) |
| name | TEXT | Entry name (required) |
| value | TEXT | Entry value (optional) |
| metadata | TEXT | JSON metadata (optional) |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

---

## 🔐 Security Layers

1. **API Key Authentication** (routes/api.js)
   - Header-based authentication
   - Middleware protection

2. **Rate Limiting** (server.js)
   - 100 requests per 15 minutes per IP
   - Prevents abuse

3. **Helmet.js** (server.js)
   - XSS protection
   - Clickjacking prevention
   - Content Security Policy

4. **CORS** (server.js)
   - Cross-origin request control

5. **Input Validation** (routes/api.js)
   - Required field checking
   - Data sanitization

6. **SQL Injection Protection** (database.js)
   - Parameterized queries
   - No string concatenation

---

## 🔄 Data Flow

### Creating an Entry

```
User Input (Frontend)
    ↓
app.js → handleSubmit()
    ↓
POST /api/data (with API Key)
    ↓
routes/api.js → authenticateApiKey()
    ↓
routes/api.js → POST handler
    ↓
database.js → create()
    ↓
SQL.js → INSERT query
    ↓
data.db (file saved)
    ↓
Response → Frontend
    ↓
Table updated + Toast notification
```

### Reading Entries

```
Page Load / Refresh Button
    ↓
app.js → loadData()
    ↓
GET /api/data (with API Key)
    ↓
routes/api.js → authenticateApiKey()
    ↓
routes/api.js → GET handler
    ↓
database.js → getAll()
    ↓
SQL.js → SELECT query
    ↓
Response → Frontend
    ↓
app.js → renderTable()
    ↓
DOM updated with data
```

---

## 🚀 Startup Sequence

1. Load environment variables (.env)
2. Initialize Express app
3. Configure middleware (Helmet, CORS, Rate Limit)
4. Set up body parsers
5. Configure static file serving
6. Mount API routes
7. Initialize SQL.js
8. Load/create database file
9. Create tables if not exist
10. Start HTTP server
11. Listen on configured port

---

## 💾 Database Persistence

- **In-Memory**: SQL.js runs in memory for speed
- **File Sync**: Every write operation saves to `data.db`
- **On Startup**: Loads existing `data.db` if present
- **Backup**: Simply copy `data.db` file

---

## 🎯 Key Features Implementation

### Search
- Real-time search with 300ms debounce
- Searches in both `name` and `value` fields
- SQL LIKE queries with wildcards

### Pagination
- Configurable limit and offset
- Returns total count and hasMore flag
- Default: 100 entries per page

### Metadata
- Stored as JSON string
- Flexible schema
- Can store any valid JSON

### Timestamps
- Auto-generated on creation
- Auto-updated on modification
- SQLite CURRENT_TIMESTAMP

---

## 🔧 Configuration

All configuration in `.env`:

```env
PORT=3000                    # Server port
API_KEY=your-key            # Authentication key
NODE_ENV=development        # Environment
DB_PATH=./data.db          # Database file path
```

---

## 📦 Dependencies

### Production
- **express**: Web framework
- **sql.js**: SQLite for JavaScript
- **cors**: Cross-origin support
- **helmet**: Security headers
- **express-rate-limit**: Rate limiting
- **dotenv**: Environment variables
- **uuid**: Unique ID generation

### Development
- **nodemon**: Auto-reload on changes

---

## 🎨 Design System

### Colors
```css
--bg-primary: #0a0a0a      /* Main background */
--bg-secondary: #1a1a1a    /* Cards/sections */
--bg-tertiary: #2a2a2a     /* Inputs/hover */
--text-primary: #e0e0e0    /* Main text */
--text-secondary: #a0a0a0  /* Secondary text */
--accent: #00ff88          /* Primary actions */
--accent-hover: #00cc6a    /* Hover state */
--danger: #ff4444          /* Delete actions */
--border: #333             /* Borders */
```

### Typography
- Font: Segoe UI, system fonts
- Monospace: Courier New (for code/metadata)

### Spacing
- Container: max-width 1400px
- Padding: 20px standard
- Gap: 10-20px between elements

---

**Built with ❤️ for simplicity and security**

