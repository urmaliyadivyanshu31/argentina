@echo off
REM LoopDrop Distributor - Windows Quick Start Script
REM Starts all services

echo 🚀 Starting LoopDrop Distributor...
echo.

REM Check if .env exists
if not exist .env (
    echo ❌ .env file not found!
    echo Run deploy.bat first to set up the project
    pause
    exit /b 1
)

REM Check if contract is deployed
findstr /C:"DISTRIBUTOR_CONTRACT_ADDRESS=0x" .env | findstr /V "DISTRIBUTOR_CONTRACT_ADDRESS=0x..." >nul
if errorlevel 1 (
    echo ⚠️  Warning: Smart contract not deployed yet
    echo.
    choice /C YN /M "Deploy contract now"
    if not errorlevel 2 (
        cd contracts
        call npx hardhat run scripts/deploy.js --network hyperevm
        cd ..
        echo.
        echo Please update .env with the contract address, then run this script again
        pause
        exit /b 0
    )
)

REM Create necessary directories
if not exist backend\data mkdir backend\data
if not exist backend\uploads mkdir backend\uploads

REM Start the application
echo Starting backend and frontend...
echo.
echo Backend API: http://localhost:3001
echo Frontend UI: http://localhost:3000
echo.
echo Press Ctrl+C to stop all services
echo.

npm run dev
