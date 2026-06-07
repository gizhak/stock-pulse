#!/bin/bash

echo "🚀 Stock Pulse Setup Script"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo "✓ npm version: $(npm -v)"

# Create .env file from template if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✓ .env file created. Please fill in your API keys in .env"
else
    echo "✓ .env file already exists"
fi

# Create frontend .env file if it doesn't exist
if [ ! -f frontend/.env ]; then
    echo "📝 Creating frontend/.env file..."
    cp frontend/.env.example frontend/.env
    echo "✓ frontend/.env file created"
else
    echo "✓ frontend/.env file already exists"
fi

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..
echo "✓ Backend dependencies installed"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..
echo "✓ Frontend dependencies installed"

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "📋 Next Steps:"
echo "1. Edit .env file with your API keys:"
echo "   - ANTHROPIC_API_KEY (get from https://console.anthropic.com)"
echo "   - MONGODB_URI (get from https://www.mongodb.com/cloud/atlas)"
echo "   - TELEGRAM_BOT_TOKEN (optional, from @BotFather)"
echo ""
echo "2. Start the backend:"
echo "   cd backend && npm start"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   cd frontend && npm start"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, see README.md"
