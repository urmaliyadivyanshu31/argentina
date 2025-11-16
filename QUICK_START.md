# Quick Start Guide - LoopDrop Distributor

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- HyperEVM wallet with some funds
- (Optional) Safe multisig wallet

## Step-by-Step Setup

### 1. Install Dependencies (2 min)

```bash
# Clone the repo (if not already done)
cd argentina-hack

# Install root dependencies
npm install

# Install contract dependencies
cd contracts && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Configure Environment (1 min)

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
# Minimum required:
# - HYPEREVM_RPC_URL (default is fine for testnet)
# - PRIVATE_KEY (your wallet private key)
# - SAFE_ADDRESS (can be dummy for testing)
```

**Minimal .env for testing:**
```env
PORT=3001
HYPEREVM_RPC_URL=https://api.hyperliquid-testnet.xyz/evm
CHAIN_ID=998
SAFE_ADDRESS=0x0000000000000000000000000000000000000000
PRIVATE_KEY=your_private_key_here
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Deploy Smart Contract (1 min)

```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network hyperevm
```

Copy the contract address and add to `.env`:
```env
DISTRIBUTOR_CONTRACT_ADDRESS=0x... # paste address here
```

### 4. Start Application (1 min)

```bash
# From root directory
npm run dev
```

This starts both backend (port 3001) and frontend (port 3000).

### 5. Access & Test

- Open http://localhost:3000
- Download CSV template
- Upload sample distribution
- See it appear in the list!

## Quick Test

### Option A: Use UI

1. Go to http://localhost:3000
2. Click "Download Template"
3. Edit CSV with test addresses:
   ```csv
   address,amount
   0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0,1000000000000000000
   0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed,2000000000000000000
   ```
4. Upload with distribution details
5. See distribution created!

### Option B: Use API

```bash
# Health check
curl http://localhost:3001/health

# Get distributions
curl http://localhost:3001/api/distributions

# Download template
curl http://localhost:3001/api/distributions/template/csv > template.csv
```

## Common Issues

### Port already in use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or change port in .env
PORT=3002
```

### Contract deployment fails
- Check you have HyperEVM testnet funds
- Verify HYPEREVM_RPC_URL is correct
- Check PRIVATE_KEY format (should start with 0x)

### Frontend can't connect to backend
- Verify backend is running: `curl http://localhost:3001/health`
- Check NEXT_PUBLIC_API_URL in .env
- Clear browser cache and refresh

### Database errors
```bash
# Backend creates database automatically, but if issues:
rm -rf backend/data
# Restart backend - will recreate
```

## Development Tips

### Run services separately

```bash
# Terminal 1 - Backend only
cd backend
npm run dev

# Terminal 2 - Frontend only
cd frontend
npm run dev

# Terminal 3 - Watch contract changes
cd contracts
npx hardhat watch compilation
```

### View logs

```bash
# Backend logs
cd backend
npm run dev # Outputs to console

# Database inspection
sqlite3 backend/data/distributions.db
> SELECT * FROM distributions;
> .exit
```

### Reset everything

```bash
# Stop all services (Ctrl+C)

# Clear database
rm -rf backend/data/*.db

# Clear uploads
rm -rf backend/uploads/*

# Restart
npm run dev
```

## Next Steps

1. **Configure Safe Multisig**
   - Create Safe wallet on HyperEVM
   - Add Safe address to .env
   - Test proposing transactions

2. **Approve Tokens**
   - Your Safe needs to approve the distributor contract
   - For each token you want to distribute

3. **Create Real Distribution**
   - Prepare real recipient list
   - Upload and propose
   - Get multisig approvals
   - Execute!

## Getting Help

- Check README.md for full documentation
- See DEMO.md for demo guide
- Review code comments for implementation details

Happy distributing! 🚀
