const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || './data.db';
let db;
let SQL;

async function init() {
  SQL = await initSqlJs();

  // Load existing database or create new one
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS data_entries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      value TEXT,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  saveDatabase();
  console.log('✅ Database initialized');
}

function saveDatabase() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function getAll(limit = 100, offset = 0) {
  const stmt = db.prepare('SELECT * FROM data_entries ORDER BY created_at DESC LIMIT ? OFFSET ?');
  stmt.bind([limit, offset]);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function getById(id) {
  const stmt = db.prepare('SELECT * FROM data_entries WHERE id = ?');
  stmt.bind([id]);
  const result = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return result;
}

function search(query) {
  const searchTerm = `%${query}%`;
  const stmt = db.prepare('SELECT * FROM data_entries WHERE name LIKE ? OR value LIKE ? ORDER BY created_at DESC');
  stmt.bind([searchTerm, searchTerm]);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function create(data) {
  const { id, name, value, metadata } = data;
  try {
    db.run(`
      INSERT INTO data_entries (id, name, value, metadata)
      VALUES (?, ?, ?, ?)
    `, [id, name, value, metadata]);
    saveDatabase();
    return true;
  } catch (error) {
    console.error('Create error:', error);
    return false;
  }
}

function update(id, data) {
  const { name, value, metadata } = data;
  try {
    db.run(`
      UPDATE data_entries
      SET name = ?, value = ?, metadata = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, value, metadata, id]);
    saveDatabase();
    return true;
  } catch (error) {
    console.error('Update error:', error);
    return false;
  }
}

function deleteById(id) {
  try {
    db.run('DELETE FROM data_entries WHERE id = ?', [id]);
    saveDatabase();
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}

function getCount() {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM data_entries');
  stmt.step();
  const result = stmt.getAsObject();
  stmt.free();
  return result.count;
}

module.exports = {
  init,
  getAll,
  getById,
  search,
  create,
  update,
  deleteById,
  getCount
};

