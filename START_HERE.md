# 🚀 START HERE - LoopDrop Distributor

## What Is This?

A tool that sends tokens to hundreds of people at once using just a CSV file.

**Problem:** Sending tokens to 100 people = 100 transactions = expensive
**Solution:** Upload CSV → Send to all 100 in 1 transaction = **60% cheaper**

---

## ⚡ Quick Start (Copy & Paste)

### Windows Users:
```bash
deploy.bat
```

### Mac/Linux Users:
```bash
chmod +x deploy.sh && ./deploy.sh
```

**That's it!** The script does everything automatically.

---

## What You Need (3 Things)

1. **Node.js 18+** → Download: https://nodejs.org
2. **Wallet Private Key** → Get from MetaMask
3. **5 minutes** → That's all!

---

## Step-by-Step

### 1️⃣ Run Setup Script

**Windows:**
```bash
deploy.bat
```

**Mac/Linux:**
```bash
./deploy.sh
```

Script will:
- ✅ Install all dependencies
- ✅ Create configuration file (.env)
- ✅ Ask for your wallet private key
- ✅ Deploy smart contract (optional)

### 2️⃣ Add Your Private Key

When prompted, add your MetaMask private key to `.env`:

```env
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
```

**How to get it:**
1. Open MetaMask
2. Click account menu → Account Details
3. Click "Show Private Key"
4. Copy and paste

### 3️⃣ Start the App

**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
./start.sh
```

### 4️⃣ Open Browser

Go to: **http://localhost:3000**

---

## How to Use

```
1. Download CSV template
      ↓
2. Fill with addresses & amounts
      ↓
3. Upload CSV file
      ↓
4. Click "Create Distribution"
      ↓
5. Click "Propose to Safe"
      ↓
6. Get approvals & execute!
      ↓
   Tokens sent! 🎉
```

---

## Example CSV

```csv
address,amount
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0,1000000000000000000
0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed,2000000000000000000
0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359,1500000000000000000
```

(Amounts are in wei: 1000000000000000000 = 1 token)

---

## What Gets Installed

- **Smart Contract** (Solidity) - Handles blockchain transactions
- **Backend API** (Node.js) - Processes CSV files
- **Web Interface** (Next.js) - Upload & manage distributions

**Total size:** ~500MB
**Install time:** ~5 minutes

---

## Troubleshooting

### "Node.js not found"
```bash
# Download and install from:
https://nodejs.org
```

### "Permission denied" (Mac/Linux)
```bash
chmod +x deploy.sh start.sh
```

### "Port already in use"
```bash
# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3001 | xargs kill -9
```

### Contract deployment failed
- Make sure you have testnet funds
- Check private key starts with `0x`
- Verify you're on HyperEVM testnet

---

## Commands Cheat Sheet

```bash
# Setup (first time only)
./deploy.sh         # Mac/Linux
deploy.bat          # Windows

# Start the app
./start.sh          # Mac/Linux
start.bat           # Windows

# Deploy contract manually
cd contracts
npx hardhat run scripts/deploy.js --network hyperevm

# Start manually (if scripts fail)
npm run dev
```

---

## What You Can Do

✅ Send tokens to 500 people at once
✅ Save 60%+ on gas fees
✅ Validate all addresses automatically
✅ Track distribution history
✅ Use Safe multisig for security
✅ Support any ERC20 token

---

## File Structure

```
argentina-hack/
├── deploy.sh/bat       ← Run this first!
├── start.sh/bat        ← Run this to start
├── .env                ← Your config (created by deploy script)
├── contracts/          ← Smart contract
├── backend/            ← API server
└── frontend/           ← Web interface
```

---

## Need More Help?

📖 **Simple Guide:** `README_SIMPLE.md`
📖 **Full Docs:** `README.md`
📖 **Script Guide:** `SCRIPT_GUIDE.md`
📖 **Quick Start:** `QUICK_START.md`

---

## Security

✅ All addresses validated
✅ Duplicate detection
✅ Safe multisig required
✅ Complete audit trail
✅ ReentrancyGuard protection

**Never share your .env file or private key!**

---

## After Setup

Once running, you'll see:

```
Backend API: http://localhost:3001
Frontend UI: http://localhost:3000
```

Open http://localhost:3000 and start distributing! 🎉

---

## One-Liner Install (Advanced)

**Windows PowerShell:**
```powershell
git clone YOUR_REPO && cd argentina-hack && deploy.bat
```

**Mac/Linux:**
```bash
git clone YOUR_REPO && cd argentina-hack && chmod +x deploy.sh && ./deploy.sh
```

---

## Support

**Issues?** Check troubleshooting section above
**Questions?** See README_SIMPLE.md
**Errors?** Check you have Node.js 18+

---

**Ready? Run the script and you're live in 5 minutes! 🚀**

**Windows:** `deploy.bat`
**Mac/Linux:** `./deploy.sh`
