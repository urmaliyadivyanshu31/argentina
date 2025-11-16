# 🚀 DEPLOYMENT GUIDE - LoopDrop Distributor

## Your Deployment Wallet

**Address**: `0x7Ff0108B9441b8931e00189313272CdeFfF8ae8c`
**Network**: HyperEVM Testnet (Chain ID: 998)
**Current Balance**: 0 HYPE (needs funding)

---

## Step 1: Get Testnet HYPE Tokens

### Option A: HyperEVM Testnet Faucet
1. Visit the HyperEVM testnet faucet (check HyperEVM docs for latest faucet URL)
2. Enter your address: `0x7Ff0108B9441b8931e00189313272CdeFfF8ae8c`
3. Request testnet HYPE tokens

### Option B: Add HyperEVM to MetaMask and Use Faucet
1. **Add HyperEVM Testnet to MetaMask**:
   - Network Name: `HyperEVM Testnet`
   - RPC URL: `https://rpc.hyperliquid-testnet.xyz/evm`
   - Chain ID: `998`
   - Currency Symbol: `HYPE`
   - Block Explorer: (if available)

2. **Import Your Wallet**:
   - Open MetaMask
   - Click "Import Account"
   - Select "Seed Phrase"
   - Enter: `ostrich praise valve under scheme ostrich jump park battle elbow language cave`
   - Your address should be: `0x7Ff0108B9441b8931e00189313272CdeFfF8ae8c`

3. **Get Tokens from Faucet**:
   - Use MetaMask to request testnet tokens
   - Or visit faucet website and connect MetaMask

### Option C: Bridge from Another Testnet (if available)
Check HyperEVM documentation for any bridging options from other testnets.

---

## Step 2: Deploy Smart Contract

Once you have testnet HYPE tokens (at least 0.001 HYPE):

```bash
cd /Users/divyanshu/argentina-hack/contracts
npx hardhat run scripts/deploy.js --network hyperevm
```

**Expected Output**:
```
Deploying BatchTokenDistributor...
✅ BatchTokenDistributor deployed to: 0x...

Next steps:
1. Add this address to your .env file as DISTRIBUTOR_CONTRACT_ADDRESS
2. Verify the contract (optional): npx hardhat verify --network hyperevm 0x...
3. Ensure your Safe multisig has approved this contract to spend tokens
```

---

## Step 3: Update Configuration

The deployment script will show you the contract address. Update your `.env`:

```bash
DISTRIBUTOR_CONTRACT_ADDRESS=0x... # paste the deployed address here
```

---

## Step 4: Create Safe Multisig (Optional but Recommended)

1. Visit Safe wallet: https://app.safe.global
2. Connect to HyperEVM Testnet
3. Create new Safe wallet
4. Add owner addresses (including `0x7Ff0108B9441b8931e00189313272CdeFfF8ae8c`)
5. Set threshold (e.g., 2 of 3)
6. Deploy Safe
7. Copy Safe address and update `.env`:
   ```
   SAFE_ADDRESS=0x... # your Safe multisig address
   ```

---

## Step 5: Verify Everything Works

### Backend Health Check
```bash
curl http://localhost:3002/health
```

### Frontend Load
```
Open browser: http://localhost:3001
```

### Test API Connection
```bash
curl http://localhost:3002/api/distributions
```

---

## Quick Deploy Command (After Getting Testnet Tokens)

```bash
# From project root
cd contracts && \
npx hardhat run scripts/deploy.js --network hyperevm && \
echo "✅ Deployment complete! Update DISTRIBUTOR_CONTRACT_ADDRESS in .env"
```

---

## Troubleshooting

### "Insufficient funds" error
- **Solution**: Get more testnet HYPE tokens from faucet
- **Required**: ~0.001 HYPE for deployment

### "Invalid JSON-RPC response"
- **Solution**: Check RPC URL is correct: `https://rpc.hyperliquid-testnet.xyz/evm`
- **Backup**: Try alternative RPC if available

### Contract deployment fails
- **Check**: Wallet has enough HYPE
- **Check**: RPC endpoint is responding
- **Check**: Network is HyperEVM Testnet (Chain ID 998)

---

## Current Configuration Status

✅ Wallet configured: `0x7Ff0108B9441b8931e00189313272CdeFfF8ae8c`
✅ Private key set in `.env`
✅ Smart contracts compiled
✅ Backend running on port 3002
✅ Frontend running on port 3001
✅ Frontend API URL fixed to point to backend
❌ Testnet tokens needed
❌ Contract not deployed yet
❌ Safe multisig not configured (using dummy address)

---

## Once Deployed - Complete Flow Test

1. **Download CSV Template**
   - Click "↓ TEMPLATE" button
   - Add recipient addresses and amounts

2. **Upload Distribution**
   - Fill in distribution name
   - Select type (LOOPDROP/LOYALTY)
   - Enter token address and symbol
   - Upload CSV file
   - Click "CREATE DISTRIBUTION"

3. **Propose to Safe**
   - Distribution appears in table with "PENDING" status
   - Click "Propose" button
   - Transaction sent to Safe multisig
   - Status updates to "PROPOSED"

4. **Execute in Safe**
   - Go to Safe wallet UI
   - Review and approve transaction
   - Execute when threshold met
   - Status updates to "EXECUTED"

---

## Support & Resources

- **HyperEVM Docs**: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm
- **Safe Docs**: https://docs.safe.global
- **Project Repo**: https://github.com/urmaliyadivyanshu31/argentina
