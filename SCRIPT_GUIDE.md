# Deployment Scripts Guide

This project includes automated scripts to make setup as easy as possible.

## 📜 Available Scripts

### 1. **deploy.sh / deploy.bat** (Main Setup Script)
**What it does:**
- ✅ Checks Node.js is installed
- ✅ Installs all dependencies (contracts, backend, frontend)
- ✅ Creates .env configuration file
- ✅ Compiles smart contract
- ✅ Optionally deploys contract to HyperEVM
- ✅ Creates necessary directories

**When to use:** First time setup

**How to run:**

**Mac/Linux:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
```bash
deploy.bat
```

---

### 2. **start.sh / start.bat** (Quick Start Script)
**What it does:**
- ✅ Checks if environment is configured
- ✅ Verifies contract is deployed
- ✅ Creates data directories
- ✅ Starts backend and frontend servers

**When to use:** Every time you want to start the app

**How to run:**

**Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
```

**Windows:**
```bash
start.bat
```

---

## 🎯 Quick Start (3 Steps)

### Step 1: Run Setup Script

**Mac/Linux:**
```bash
./deploy.sh
```

**Windows:**
```bash
deploy.bat
```

This will:
1. Install everything
2. Create .env file
3. Ask you to add your private key
4. Optionally deploy the smart contract

### Step 2: Configure Environment

Edit `.env` file and add:
```env
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_FROM_METAMASK
```

### Step 3: Start the App

**Mac/Linux:**
```bash
./start.sh
```

**Windows:**
```bash
start.bat
```

Open http://localhost:3000 🎉

---

## 🔧 What Each Script Does

### deploy.sh / deploy.bat

```
[1/7] Check Node.js ✓
[2/7] Install dependencies ✓
[3/7] Setup .env file ✓
[4/7] Compile contract ✓
[5/7] Deploy contract (optional) ✓
[6/7] Create directories ✓
[7/7] Show summary ✓
```

### start.sh / start.bat

```
[1/3] Check .env exists ✓
[2/3] Verify contract deployed ✓
[3/3] Start services ✓
```

---

## 📝 Manual Alternative

If you prefer manual setup:

```bash
# 1. Install dependencies
npm install
cd contracts && npm install && cd ..
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 2. Configure
cp .env.example .env
# Edit .env with your PRIVATE_KEY

# 3. Deploy contract
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network hyperevm
# Copy contract address to .env

# 4. Start
cd ..
npm run dev
```

---

## 🐛 Troubleshooting Scripts

### "Permission denied" on Mac/Linux

```bash
chmod +x deploy.sh start.sh
```

### Script shows errors

**Check Node.js version:**
```bash
node --version  # Should be 18 or higher
```

**Clean install:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Manual run if scripts fail

**Deploy contract manually:**
```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network hyperevm
```

**Start manually:**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

---

## 🎬 Script Workflow

### First Time Setup

```
User runs: ./deploy.sh
   ↓
Install dependencies (5 min)
   ↓
Create .env file
   ↓
User adds PRIVATE_KEY
   ↓
Compile smart contract
   ↓
Deploy to HyperEVM (optional)
   ↓
Copy contract address to .env
   ↓
✅ Ready to use!
```

### Subsequent Runs

```
User runs: ./start.sh
   ↓
Check configuration
   ↓
Start backend + frontend
   ↓
Open http://localhost:3000
   ↓
✅ App running!
```

---

## 💡 Tips

**Speed up deployment:**
```bash
# Run with default options (no prompts)
./deploy.sh < /dev/null
```

**Check what script will do without running:**
```bash
cat deploy.sh  # View the script
```

**Stop services:**
```bash
# Press Ctrl+C in the terminal where start.sh is running
```

**Restart:**
```bash
# Stop with Ctrl+C, then run ./start.sh again
```

---

## 🔐 Security Note

The scripts will:
- ✅ Create .env from template
- ✅ Never commit .env to git
- ✅ Ask before deploying contract
- ✅ Show clear warnings

**Never share your .env file or PRIVATE_KEY!**

---

## 📦 What Gets Installed

### Root
- concurrently (run multiple commands)

### Contracts
- hardhat (smart contract framework)
- @openzeppelin/contracts (security)
- @nomicfoundation/hardhat-toolbox (tools)

### Backend
- express (web server)
- @safe-global/protocol-kit (Safe integration)
- ethers (blockchain library)
- better-sqlite3 (database)
- csv-parser (CSV processing)
- joi (validation)

### Frontend
- next (React framework)
- react (UI library)
- tailwindcss (styling)
- ethers (blockchain library)
- axios (HTTP client)

**Total install time:** ~5 minutes
**Total disk space:** ~500MB

---

## ✅ Success Indicators

Script completed successfully if you see:

```
╔══════════════════════════════════════════════════════════╗
║                  🎉 SETUP COMPLETE! 🎉                   ║
╚══════════════════════════════════════════════════════════╝
```

App running successfully if you see:

```
🚀 LoopDrop Distribution API running on port 3001
📊 Health check: http://localhost:3001/health
```

---

## 🆘 Get Help

If scripts fail:
1. Check README_SIMPLE.md
2. Check QUICK_START.md
3. Try manual setup (see above)
4. Check Node.js version: `node --version`
5. Check for error messages in terminal

**Most common issue:** Node.js version too old (need 18+)

---

Built to make deployment painless! 🚀
