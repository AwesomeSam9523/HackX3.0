#!/bin/bash

echo "🚀 Starting Hackathon Backend..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Please create one based on .env.example"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Push database schema
echo "🗄️  Pushing database schema..."
npm run db:push

# Seed database
echo "🌱 Seeding database..."
npm run db:seed

# Start development server
echo "🎯 Starting development server..."
npm run dev
