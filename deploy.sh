#!/bin/bash

# LoopDrop Distributor - Automated Deployment Script
# This script sets up everything you need to run the project

set -e  # Exit on error

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     LoopDrop Distributor - Automated Setup Script       ║"
echo "║              Token Distribution Made Easy                ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check Node.js
echo -e "${BLUE}[1/7] Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found!${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js installed: $NODE_VERSION${NC}"
echo ""

# Step 2: Install Dependencies
echo -e "${BLUE}[2/7] Installing dependencies...${NC}"
echo "This may take a few minutes..."

echo -e "${YELLOW}Installing root dependencies...${NC}"
npm install --silent

echo -e "${YELLOW}Installing contract dependencies...${NC}"
cd contracts && npm install --silent && cd ..

echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd backend && npm install --silent && cd ..

echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd frontend && npm install --silent && cd ..

echo -e "${GREEN}✅ All dependencies installed${NC}"
echo ""

# Step 3: Setup Environment
echo -e "${BLUE}[3/7] Setting up environment configuration...${NC}"

if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANT: Edit .env and add your PRIVATE_KEY${NC}"
    echo ""
    echo "Required configuration:"
    echo "  - PRIVATE_KEY: Your wallet private key (from MetaMask)"
    echo "  - SAFE_ADDRESS: Your Safe multisig address (or use dummy for testing)"
    echo ""

    read -p "Do you want to edit .env now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ${EDITOR:-nano} .env
    else
        echo -e "${YELLOW}⚠️  Remember to edit .env before deploying the contract!${NC}"
    fi
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi
echo ""

# Step 4: Compile Smart Contract
echo -e "${BLUE}[4/7] Compiling smart contract...${NC}"
cd contracts
npx hardhat compile > /dev/null 2>&1
echo -e "${GREEN}✅ Smart contract compiled successfully${NC}"
cd ..
echo ""

# Step 5: Deploy Contract (Optional)
echo -e "${BLUE}[5/7] Smart contract deployment${NC}"
read -p "Do you want to deploy the contract to HyperEVM testnet now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Check if PRIVATE_KEY is set
    if grep -q "PRIVATE_KEY=0x" .env && ! grep -q "PRIVATE_KEY=0x..." .env; then
        echo -e "${YELLOW}Deploying contract...${NC}"
        cd contracts
        CONTRACT_OUTPUT=$(npx hardhat run scripts/deploy.js --network hyperevm 2>&1)
        echo "$CONTRACT_OUTPUT"

        # Extract contract address
        CONTRACT_ADDRESS=$(echo "$CONTRACT_OUTPUT" | grep -oP 'deployed to: \K0x[a-fA-F0-9]{40}' | head -1)

        if [ ! -z "$CONTRACT_ADDRESS" ]; then
            echo -e "${GREEN}✅ Contract deployed: $CONTRACT_ADDRESS${NC}"

            # Update .env with contract address
            cd ..
            if grep -q "DISTRIBUTOR_CONTRACT_ADDRESS=" .env; then
                sed -i.bak "s|DISTRIBUTOR_CONTRACT_ADDRESS=.*|DISTRIBUTOR_CONTRACT_ADDRESS=$CONTRACT_ADDRESS|" .env
            else
                echo "DISTRIBUTOR_CONTRACT_ADDRESS=$CONTRACT_ADDRESS" >> .env
            fi
            echo -e "${GREEN}✅ Updated .env with contract address${NC}"
        else
            echo -e "${RED}❌ Failed to deploy contract${NC}"
            echo "Please check your .env configuration and try again manually:"
            echo "  cd contracts && npx hardhat run scripts/deploy.js --network hyperevm"
        fi
        cd ..
    else
        echo -e "${RED}❌ PRIVATE_KEY not configured in .env${NC}"
        echo "Please edit .env and add your private key, then run:"
        echo "  cd contracts && npx hardhat run scripts/deploy.js --network hyperevm"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping deployment. Deploy later with:${NC}"
    echo "  cd contracts && npx hardhat run scripts/deploy.js --network hyperevm"
fi
echo ""

# Step 6: Create necessary directories
echo -e "${BLUE}[6/7] Creating necessary directories...${NC}"
mkdir -p backend/data backend/uploads
echo -e "${GREEN}✅ Directories created${NC}"
echo ""

# Step 7: Summary
echo -e "${BLUE}[7/7] Setup Complete!${NC}"
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                  🎉 SETUP COMPLETE! 🎉                   ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "1️⃣  Start the application:"
echo "   ${GREEN}npm run dev${NC}"
echo ""
echo "2️⃣  Open your browser:"
echo "   ${GREEN}http://localhost:3000${NC}"
echo ""
echo "3️⃣  Test the flow:"
echo "   - Download CSV template"
echo "   - Add test addresses"
echo "   - Upload and create distribution"
echo ""
echo "📝 Important files:"
echo "   - .env (your configuration)"
echo "   - README_SIMPLE.md (simple guide)"
echo "   - README.md (full documentation)"
echo ""
echo "🆘 Need help?"
echo "   - Check README_SIMPLE.md for troubleshooting"
echo "   - See QUICK_START.md for 5-minute guide"
echo ""
echo "🚀 Ready to start? Run: ${GREEN}npm run dev${NC}"
echo ""
