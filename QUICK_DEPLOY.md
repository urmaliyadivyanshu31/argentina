# 🚀 QUICK DEPLOYMENT - 3 Steps

## Your Wallet Info
```
Address: 0x7Ff0108B9441b8931e00189313272CdeFfF8ae8c
Seed Phrase: ostrich praise valve under scheme ostrich jump park battle elbow language cave
Network: HyperEVM Testnet (Chain ID: 998)
```

---

## ⚡ Step 1: Get Testnet Tokens (5 minutes)

### Option A: Chainstack Faucet (Recommended - 1 HYPE/24h)
1. Visit: https://chainstack.com/hyperliquid-faucet/
2. Paste: `0x7Ff0108B9441b8931e00189313272CdeFfF8ae8c`
3. Click "Request tokens"
4. Wait ~30 seconds

### Option B: Gas.zip Faucet (0.0025 HYPE/12h)
1. Visit: https://www.gas.zip/faucet/hyperevm
2. Paste: `0x7Ff0108B9441b8931e00189313272CdeFfF8ae8c`
3. Complete captcha
4. Get tokens instantly

---

## 🚀 Step 2: Auto-Deploy Contract (1 command)

```bash
bash auto-deploy.sh
```

**That's it!** The script will:
- ✅ Check your balance
- ✅ Deploy BatchTokenDistributor contract
- ✅ Update .env with contract address
- ✅ Show you the contract address

---

## ✅ Step 3: Test Everything (30 seconds)

1. **Open Frontend**: http://localhost:3001
2. **Download CSV Template**: Click "↓ TEMPLATE" button
3. **Fill CSV** with test data:
   ```csv
   address,amount
   0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0,100000000000000000
   0x5B38Da6a701c568545dCfcB03FcB875f56beddC4,200000000000000000
   ```
4. **Upload and Create Distribution**
5. **See it in the table** ✅

---

## 📊 Current Status

### ✅ Working
- [x] Backend API (http://localhost:3002)
- [x] Frontend UI (http://localhost:3001)
- [x] Database (SQLite)
- [x] Smart contracts compiled
- [x] Wallet configured
- [x] API connection fixed

### ⏳ Pending
- [ ] Get testnet HYPE tokens → **YOU NEED TO DO THIS**
- [ ] Deploy smart contract → **Automated script ready**
- [ ] (Optional) Create Safe multisig

---

## 🎯 After Deployment

### View Your Contract
```
Network: HyperEVM Testnet
Contract: [Will be shown after deployment]
Deployer: 0x7Ff0108B9441b8931e00189313272CdeFfF8ae8c
```

### Test Distribution Flow
1. Upload CSV with recipients
2. Create distribution
3. See it in "PENDING" status
4. Click "Propose" (if Safe configured)
5. View in analytics panel

---

## 🆘 Need Help?

### Balance Check
```bash
curl -X POST https://rpc.hyperliquid-testnet.xyz/evm \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x7Ff0108B9441b8931e00189313272CdeFfF8ae8c","latest"],"id":1}'
```

### Manual Deploy
```bash
cd contracts
npx hardhat run scripts/deploy.js --network hyperevm
```

### Restart Servers
```bash
# Kill all
pkill -f "npm run dev"

# Restart
cd backend && PORT=3002 npm run dev &
cd frontend && npm run dev &
```

---

## 📝 Summary

**Total Time**: ~6 minutes
1. Get tokens from faucet → 5 min
2. Run deployment script → 30 seconds
3. Test the UI → 30 seconds

**Next**: Just run `bash auto-deploy.sh` after getting testnet tokens!
