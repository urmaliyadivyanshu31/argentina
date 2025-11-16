#!/bin/bash

# LoopDrop Distributor - Quick Start Script
# Starts all services

set -e

echo "🚀 Starting LoopDrop Distributor..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Run ./deploy.sh first to set up the project"
    exit 1
fi

# Check if contract is deployed
if ! grep -q "DISTRIBUTOR_CONTRACT_ADDRESS=0x" .env || grep -q "DISTRIBUTOR_CONTRACT_ADDRESS=0x..." .env; then
    echo "⚠️  Warning: Smart contract not deployed yet"
    echo ""
    read -p "Deploy contract now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd contracts
        npx hardhat run scripts/deploy.js --network hyperevm
        cd ..
        echo ""
        echo "Please update .env with the contract address, then run this script again"
        exit 0
    fi
fi

# Create necessary directories
mkdir -p backend/data backend/uploads

# Start the application
echo "Starting backend and frontend..."
echo ""
echo "Backend API: http://localhost:3001"
echo "Frontend UI: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

npm run dev
