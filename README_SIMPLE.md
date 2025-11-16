# LoopDrop Distributor - Simple Guide

## What is This?

A tool that lets you **send tokens to hundreds of people at once** with just a CSV file upload.

Instead of manually sending tokens to 100 people (100 transactions), you upload a CSV and send to all 100 in **one transaction** - saving **60% on gas fees**.

## What We Built

```
┌─────────────────────────────────────────────────┐
│  1. Upload CSV with addresses & amounts         │
│     (Example: Bob gets 100 LOOP)                │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  2. System validates everything                 │
│     (Checks addresses are valid, no duplicates) │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  3. Creates Safe multisig transaction           │
│     (Requires 2 of 3 signatures for security)   │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  4. Execute → Tokens sent to everyone!          │
│     (All in one transaction, saves 60% gas)     │
└─────────────────────────────────────────────────┘
```

## Perfect For

- **LoopDrops**: Distribute LOOP tokens to community members
- **Loyalty Rewards**: Send rewards to loyal holders
- **Airdrops**: Distribute any ERC20 token to multiple wallets

## Why It's Better

| Old Way | This Tool |
|---------|-----------|
| Send 100 separate transactions | Send 1 transaction to 100 people |
| Pay 100x gas fees | Pay 1x gas fee (60% savings!) |
| Risk of errors | Automatic validation |
| No audit trail | Complete history logged |
| Manual spreadsheets | Upload CSV, done |

## What You Get

1. **Smart Contract** - Handles the batch sending on blockchain
2. **Backend API** - Processes CSV files, validates data
3. **Web Interface** - Upload CSV, track distributions
4. **Safe Integration** - Multisig security (requires multiple approvals)

## Quick Start (5 Minutes)

### Option 1: Automated Script (Easiest)

```bash
# Run the setup script
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Setup

```bash
# 1. Install dependencies
npm install
cd contracts && npm install && cd ..
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 2. Configure
cp .env.example .env
# Edit .env with your wallet private key

# 3. Deploy contract
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network hyperevm
# Copy the contract address to .env

# 4. Start
cd ..
npm run dev
```

### Option 3: One-Command Setup (Copy/Paste)

```bash
npm install && cd contracts && npm install && cd ../backend && npm install && cd ../frontend && npm install && cd .. && cp .env.example .env && echo "Now edit .env with your PRIVATE_KEY, then run: npm run dev"
```

## What You Need

1. **Node.js 18+** - https://nodejs.org
2. **Wallet Private Key** - From MetaMask
3. **Testnet Funds** - Free from HyperEVM faucet

## How to Use

1. **Start the app**: `npm run dev`
2. **Open browser**: http://localhost:3000
3. **Download CSV template**
4. **Fill in recipients**:
   ```csv
   address,amount
   0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0,1000000000000000000
   0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed,2000000000000000000
   ```
5. **Upload CSV**
6. **Click "Propose to Safe"**
7. **Get approvals and execute!**

## Environment Variables

Create `.env` file:

```env
# Your wallet private key (REQUIRED)
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# HyperEVM network (use these defaults)
HYPEREVM_RPC_URL=https://api.hyperliquid-testnet.xyz/evm
CHAIN_ID=998

# After deploying contract, add this
DISTRIBUTOR_CONTRACT_ADDRESS=0x...

# Safe wallet (optional for testing)
SAFE_ADDRESS=0x0000000000000000000000000000000000000000

# API settings
PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## File Structure

```
argentina-hack/
├── contracts/           ← Smart contract (blockchain)
├── backend/            ← API server (processes CSV)
├── frontend/           ← Web interface (upload CSV)
├── deploy.sh           ← Automated setup script
└── .env                ← Your configuration
```

## Commands

```bash
# Install everything
npm install

# Start development servers
npm run dev

# Deploy smart contract
cd contracts && npx hardhat run scripts/deploy.js --network hyperevm

# Test contract
cd contracts && npx hardhat test

# Build for production
npm run build
```

## Features

✅ Upload CSV file with addresses and amounts
✅ Validates all addresses automatically
✅ Detects duplicate addresses
✅ Creates Safe multisig transactions
✅ Saves 60%+ on gas fees (batch sending)
✅ Complete audit trail (who sent what, when)
✅ Supports any ERC20 token (LOOP, LEND, etc.)
✅ Clean web interface

## Security

- ✅ All addresses validated before processing
- ✅ Amounts must be positive numbers
- ✅ No duplicate recipients allowed
- ✅ Requires Safe multisig approval (2 of 3 signatures)
- ✅ Complete transaction history logged
- ✅ ReentrancyGuard protection in smart contract

## Gas Savings Example

**Traditional Method:**
- 100 recipients = 100 transactions
- 100 × 65,000 gas = 6,500,000 gas
- Cost: ~$50 (at $0.01 per 65k gas)

**With This Tool:**
- 100 recipients = 1 batch transaction
- 1 × 2,500,000 gas = 2,500,000 gas
- Cost: ~$19 (at $0.01 per 65k gas)
- **Savings: 61.5% ($31)**

## Troubleshooting

**Port already in use?**
```bash
lsof -ti:3001 | xargs kill -9
```

**Missing dependencies?**
```bash
rm -rf node_modules && npm install
```

**Contract deployment failed?**
- Check you have testnet funds
- Verify PRIVATE_KEY in .env starts with 0x
- Make sure you're on HyperEVM testnet

**Frontend can't connect?**
```bash
# Check backend is running
curl http://localhost:3001/health
```

## Support

- Full Documentation: See `README.md`
- Quick Start: See `QUICK_START.md`
- Demo Guide: See `DEMO.md`
- Architecture: See `ARCHITECTURE.md`

## License

MIT License - Free to use and modify

---

**Built for the Looping Collective Hackathon** 🚀

Made with ❤️ to make token distributions easy and secure
