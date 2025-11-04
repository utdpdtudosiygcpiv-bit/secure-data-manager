const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');

// Middleware for API key authentication
function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized: Invalid or missing API key' 
    });
  }
  
  next();
}

// Apply authentication to all routes
router.use(authenticateApiKey);

// GET /api/data - Get all data entries
router.get('/data', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const data = db.getAll(limit, offset);
    const total = db.getCount();
    
    res.json({
      success: true,
      data: data,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/data/:id - Get data by ID
router.get('/data/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = db.getById(id);
    
    if (!data) {
      return res.status(404).json({ 
        success: false, 
        error: 'Data not found' 
      });
    }
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/search - Search data
router.get('/search', (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ 
        success: false, 
        error: 'Search query is required' 
      });
    }
    
    const results = db.search(q);
    
    res.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST /api/data - Create new data entry
router.post('/data', (req, res) => {
  try {
    const { name, value, metadata } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name is required' 
      });
    }
    
    const id = uuidv4();
    const metadataStr = metadata ? JSON.stringify(metadata) : null;
    
    const created = db.create({
      id,
      name,
      value: value || null,
      metadata: metadataStr
    });
    
    if (created) {
      const newData = db.getById(id);
      res.status(201).json({
        success: true,
        data: newData,
        message: 'Data created successfully'
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create data' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// PUT /api/data/:id - Update data entry
router.put('/data/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, value, metadata } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name is required' 
      });
    }
    
    const existing = db.getById(id);
    if (!existing) {
      return res.status(404).json({ 
        success: false, 
        error: 'Data not found' 
      });
    }
    
    const metadataStr = metadata ? JSON.stringify(metadata) : null;
    
    const updated = db.update(id, {
      name,
      value: value || null,
      metadata: metadataStr
    });
    
    if (updated) {
      const updatedData = db.getById(id);
      res.json({
        success: true,
        data: updatedData,
        message: 'Data updated successfully'
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update data' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// DELETE /api/data/:id - Delete data entry
router.delete('/data/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = db.getById(id);
    if (!existing) {
      return res.status(404).json({ 
        success: false, 
        error: 'Data not found' 
      });
    }
    
    const deleted = db.deleteById(id);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Data deleted successfully'
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to delete data' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/stats - Get statistics
router.get('/stats', (req, res) => {
  try {
    const total = db.getCount();
    
    res.json({
      success: true,
      stats: {
        totalEntries: total
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;

