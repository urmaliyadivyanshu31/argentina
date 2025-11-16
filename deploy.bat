@echo off
REM LoopDrop Distributor - Windows Deployment Script
REM This script sets up everything you need to run the project

setlocal enabledelayedexpansion

echo ╔══════════════════════════════════════════════════════════╗
echo ║     LoopDrop Distributor - Automated Setup Script       ║
echo ║              Token Distribution Made Easy                ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM Step 1: Check Node.js
echo [1/7] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js installed: %NODE_VERSION%
echo.

REM Step 2: Install Dependencies
echo [2/7] Installing dependencies...
echo This may take a few minutes...

echo Installing root dependencies...
call npm install --silent
if errorlevel 1 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

echo Installing contract dependencies...
cd contracts
call npm install --silent
if errorlevel 1 (
    echo ❌ Failed to install contract dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo Installing backend dependencies...
cd backend
call npm install --silent
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo Installing frontend dependencies...
cd frontend
call npm install --silent
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo ✅ All dependencies installed
echo.

REM Step 3: Setup Environment
echo [3/7] Setting up environment configuration...

if not exist .env (
    copy .env.example .env >nul
    echo ✅ Created .env file
    echo.
    echo ⚠️  IMPORTANT: Edit .env and add your PRIVATE_KEY
    echo.
    echo Required configuration:
    echo   - PRIVATE_KEY: Your wallet private key (from MetaMask^)
    echo   - SAFE_ADDRESS: Your Safe multisig address (or use dummy for testing^)
    echo.

    choice /C YN /M "Do you want to edit .env now"
    if errorlevel 2 (
        echo ⚠️  Remember to edit .env before deploying the contract!
    ) else (
        notepad .env
    )
) else (
    echo ✅ .env file already exists
)
echo.

REM Step 4: Compile Smart Contract
echo [4/7] Compiling smart contract...
cd contracts
call npx hardhat compile >nul 2>&1
if errorlevel 1 (
    echo ❌ Failed to compile contract
    cd ..
    pause
    exit /b 1
)
echo ✅ Smart contract compiled successfully
cd ..
echo.

REM Step 5: Deploy Contract (Optional)
echo [5/7] Smart contract deployment
choice /C YN /M "Do you want to deploy the contract to HyperEVM testnet now"

if not errorlevel 2 (
    findstr /C:"PRIVATE_KEY=0x" .env | findstr /V "PRIVATE_KEY=0x..." >nul
    if not errorlevel 1 (
        echo Deploying contract...
        cd contracts
        call npx hardhat run scripts/deploy.js --network hyperevm
        if errorlevel 1 (
            echo ❌ Failed to deploy contract
            echo Please check your .env configuration and try again manually:
            echo   cd contracts ^&^& npx hardhat run scripts/deploy.js --network hyperevm
        ) else (
            echo ✅ Contract deployed successfully
            echo Please copy the contract address to your .env file:
            echo   DISTRIBUTOR_CONTRACT_ADDRESS=0x...
        )
        cd ..
    ) else (
        echo ❌ PRIVATE_KEY not configured in .env
        echo Please edit .env and add your private key, then run:
        echo   cd contracts ^&^& npx hardhat run scripts/deploy.js --network hyperevm
    )
) else (
    echo ⚠️  Skipping deployment. Deploy later with:
    echo   cd contracts ^&^& npx hardhat run scripts/deploy.js --network hyperevm
)
echo.

REM Step 6: Create necessary directories
echo [6/7] Creating necessary directories...
if not exist backend\data mkdir backend\data
if not exist backend\uploads mkdir backend\uploads
echo ✅ Directories created
echo.

REM Step 7: Summary
echo [7/7] Setup Complete!
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                  🎉 SETUP COMPLETE! 🎉                   ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo Next steps:
echo.
echo 1️⃣  Start the application:
echo    npm run dev
echo.
echo 2️⃣  Open your browser:
echo    http://localhost:3000
echo.
echo 3️⃣  Test the flow:
echo    - Download CSV template
echo    - Add test addresses
echo    - Upload and create distribution
echo.
echo 📝 Important files:
echo    - .env (your configuration^)
echo    - README_SIMPLE.md (simple guide^)
echo    - README.md (full documentation^)
echo.
echo 🆘 Need help?
echo    - Check README_SIMPLE.md for troubleshooting
echo    - See QUICK_START.md for 5-minute guide
echo.
echo 🚀 Ready to start? Run: npm run dev
echo.

pause
