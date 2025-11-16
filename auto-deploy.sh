#!/bin/bash

# LoopDrop Automated Deployment Script
# This script checks wallet balance and deploys when funds are available

set -e

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     LoopDrop Distributor - Automated Deployment         ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Your deployment wallet
WALLET="0x7Ff0108B9441b8931e00189313272CdeFfF8ae8c"
RPC_URL="https://rpc.hyperliquid-testnet.xyz/evm"

echo "🔍 Checking wallet balance..."
echo "📍 Wallet: $WALLET"
echo ""

# Check balance
BALANCE_HEX=$(curl -s -X POST $RPC_URL \
  -H "Content-Type: application/json" \
  -d "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"$WALLET\",\"latest\"],\"id\":1}" | \
  grep -o '"result":"[^"]*"' | cut -d'"' -f4)

echo "💰 Current Balance: $BALANCE_HEX"

if [ "$BALANCE_HEX" == "0x0" ]; then
    echo ""
    echo "❌ Wallet has 0 HYPE tokens"
    echo ""
    echo "🎁 Get testnet HYPE tokens from these faucets:"
    echo ""
    echo "1️⃣  Chainstack Faucet (BEST - 1 HYPE every 24h):"
    echo "   https://chainstack.com/hyperliquid-faucet/"
    echo "   → Paste your address: $WALLET"
    echo ""
    echo "2️⃣  Gas.zip Faucet (0.0025 HYPE every 12h):"
    echo "   https://www.gas.zip/faucet/hyperevm"
    echo "   → Paste your address: $WALLET"
    echo ""
    echo "3️⃣  Faucet.trade:"
    echo "   https://faucet.trade/hyperevm-testnet-hype-faucet"
    echo "   → Paste your address: $WALLET"
    echo ""
    echo "⏳ After getting tokens, run this script again:"
    echo "   bash auto-deploy.sh"
    exit 1
fi

echo ""
echo "✅ Wallet has funds! Proceeding with deployment..."
echo ""

# Change to contracts directory
cd "$(dirname "$0")/contracts"

# Deploy contract
echo "🚀 Deploying BatchTokenDistributor to HyperEVM Testnet..."
echo ""

DEPLOY_OUTPUT=$(npx hardhat run scripts/deploy.js --network hyperevm 2>&1)
echo "$DEPLOY_OUTPUT"

# Extract contract address
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -o 'deployed to: 0x[a-fA-F0-9]\{40\}' | grep -o '0x[a-fA-F0-9]\{40\}')

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo ""
    echo "❌ Failed to extract contract address from deployment output"
    exit 1
fi

echo ""
echo "✅ Contract deployed successfully!"
echo "📍 Contract Address: $CONTRACT_ADDRESS"
echo ""

# Update .env file
cd ..
if grep -q "DISTRIBUTOR_CONTRACT_ADDRESS=" .env; then
    # Update existing line (macOS compatible)
    sed -i '' "s|DISTRIBUTOR_CONTRACT_ADDRESS=.*|DISTRIBUTOR_CONTRACT_ADDRESS=$CONTRACT_ADDRESS|" .env
else
    # Add new line
    echo "DISTRIBUTOR_CONTRACT_ADDRESS=$CONTRACT_ADDRESS" >> .env
fi

echo "✅ Updated .env with contract address"
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║              🎉 DEPLOYMENT COMPLETE! 🎉                  ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Deployment Summary:"
echo "   • Contract: BatchTokenDistributor"
echo "   • Address: $CONTRACT_ADDRESS"
echo "   • Network: HyperEVM Testnet (Chain ID: 998)"
echo "   • Deployer: $WALLET"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1️⃣  Restart your backend (if running):"
echo "   The backend will now connect to the deployed contract"
echo ""
echo "2️⃣  (Optional) Create a Safe Multisig:"
echo "   • Visit: https://app.safe.global"
echo "   • Connect to HyperEVM Testnet"
echo "   • Add your address as owner"
echo "   • Update SAFE_ADDRESS in .env"
echo ""
echo "3️⃣  Test the complete flow:"
echo "   • Open: http://localhost:3001"
echo "   • Upload CSV with recipients"
echo "   • Create distribution"
echo "   • Propose to Safe (if configured)"
echo ""
echo "🔗 Useful Links:"
echo "   • Frontend: http://localhost:3001"
echo "   • Backend API: http://localhost:3002"
echo "   • GitHub: https://github.com/urmaliyadivyanshu31/argentina"
echo ""
