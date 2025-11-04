#!/bin/bash

echo "🚀 Starting Data Manager..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --no-bin-links
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Creating default .env file..."
    cat > .env << EOF
PORT=3000
API_KEY=change-this-secure-key-$(date +%s)
NODE_ENV=development
DB_PATH=./data.db
EOF
    echo "✅ Created .env file with random API key"
    echo ""
fi

echo "🔑 Your API Key (from .env):"
grep "API_KEY=" .env
echo ""

echo "Starting server..."
node server.js

