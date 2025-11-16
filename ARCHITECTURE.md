# System Architecture - LoopDrop Distributor

## Overview

The LoopDrop Distributor is a full-stack application designed for secure, automated token distribution using Safe multisig wallets and gas-optimized batch transfers.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
│                      (Next.js + React)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Upload     │  │ Distribution │  │  Safe Info   │        │
│  │   Component  │  │    List      │  │   Panel      │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐         │
│  │              API Client Library                   │         │
│  │        (Axios + ethers.js integration)            │         │
│  └──────────────────────────────────────────────────┘         │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST API
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Backend Layer                           │
│                    (Node.js + Express)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │   Routes    │  │  Services   │  │   Utils     │           │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤           │
│  │ /distributions│ │ SafeService │  │ CSV Parser  │           │
│  │ /safe       │  │             │  │ Validation  │           │
│  │ /audit      │  │             │  │             │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐         │
│  │            Database Layer (SQLite)                │         │
│  ├──────────────────────────────────────────────────┤         │
│  │ • distributions table                             │         │
│  │ • distribution_entries table                      │         │
│  │ • audit_log table                                 │         │
│  └──────────────────────────────────────────────────┘         │
└────────────────────────┬────────────────────────────────────────┘
                         │ Safe SDK / Web3
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Blockchain Layer                             │
│                    (HyperEVM Network)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────┐         │
│  │              Safe Multisig Wallet                 │         │
│  │  • Multi-signature approval                       │         │
│  │  • Transaction proposals                          │         │
│  │  • Signature collection                           │         │
│  └──────────────────────────────────────────────────┘         │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────┐         │
│  │        BatchTokenDistributor Contract             │         │
│  │  • Gas-optimized batch transfers                  │         │
│  │  • Event logging for audit trail                  │         │
│  │  • Security validations                           │         │
│  └──────────────────────────────────────────────────┘         │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────┐         │
│  │          ERC20 Tokens (LOOP, LEND, etc.)          │         │
│  └──────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend Layer

**Technology**: Next.js 14, React 18, Tailwind CSS

**Components**:
- `UploadCSV`: Handles file upload and distribution creation
- `DistributionsList`: Displays all distributions with status
- `SafeInfo`: Shows Safe wallet information
- API Client: Axios-based HTTP client with ethers.js integration

**Responsibilities**:
- User interface for distribution management
- CSV file validation (client-side)
- Status visualization
- Safe multisig information display

### 2. Backend Layer

**Technology**: Node.js, Express, SQLite

#### API Routes
- `POST /api/distributions/upload-csv`: Upload CSV and create distribution
- `POST /api/distributions/create`: Create distribution from JSON
- `GET /api/distributions`: List all distributions
- `GET /api/distributions/:id`: Get distribution details
- `POST /api/distributions/:id/propose`: Propose to Safe multisig
- `GET /api/safe/info`: Get Safe wallet information

#### Services

**SafeService**:
- Initialize Safe Protocol Kit
- Create multisig transactions
- Encode batch distribution calls
- Handle transaction proposals

#### Utilities

**CSV Parser**:
- Parse uploaded CSV files
- Validate addresses (checksum)
- Validate amounts
- Error reporting with line numbers

**Validation**:
- Joi schema validation
- Ethereum address validation
- Amount validation (positive BigInt)
- Duplicate address detection

#### Database

**Tables**:
```sql
distributions (
  id, name, type, token_address, token_symbol,
  total_recipients, total_amount, status,
  created_at, safe_tx_hash, executed_tx_hash
)

distribution_entries (
  id, distribution_id, recipient_address,
  amount, status, tx_hash, error
)

audit_log (
  id, distribution_id, action, details,
  timestamp, user_address
)
```

### 3. Blockchain Layer

#### Safe Multisig Wallet
- Multi-signature wallet for secure fund management
- Configurable threshold (e.g., 2-of-3)
- Transaction proposal and approval flow
- Integration via Safe Protocol Kit

#### BatchTokenDistributor Contract

**Key Features**:
- Gas-optimized batch transfers (60%+ savings)
- Reentrancy protection
- Input validation
- Event emission for audit trail

**Main Function**:
```solidity
function batchDistribute(
    address token,
    Transfer[] calldata transfers,
    string calldata distributionType
) external nonReentrant returns (bytes32)
```

**Events**:
- `BatchDistribution`: Emitted on successful batch
- `SingleTransfer`: Emitted for each transfer
- `DistributionFailed`: Emitted on transfer failure

## Data Flow

### Creating a Distribution

```
1. User uploads CSV
   ↓
2. Frontend validates file format
   ↓
3. Backend receives CSV
   ↓
4. CSV Parser extracts addresses & amounts
   ↓
5. Validation Service checks:
   - Valid Ethereum addresses
   - Positive amounts
   - No duplicates
   ↓
6. Create distribution record in DB
   ↓
7. Create distribution entries in DB
   ↓
8. Log action in audit_log
   ↓
9. Return distribution ID to frontend
   ↓
10. Display in distributions list
```

### Proposing to Safe

```
1. User clicks "Propose to Safe"
   ↓
2. Backend fetches distribution entries
   ↓
3. SafeService creates transaction data
   ↓
4. Encode batchDistribute function call
   ↓
5. Create Safe transaction
   ↓
6. Sign transaction with proposer key
   ↓
7. Get Safe transaction hash
   ↓
8. Update distribution status to "proposed"
   ↓
9. Log action in audit_log
   ↓
10. Return Safe tx hash to frontend
```

### Executing Distribution

```
1. Safe owners review transaction
   ↓
2. Required signatures collected
   ↓
3. Transaction executed from Safe
   ↓
4. Safe calls BatchTokenDistributor
   ↓
5. Contract validates inputs
   ↓
6. Contract executes batch transfers
   ↓
7. Tokens transferred to recipients
   ↓
8. Events emitted for audit trail
   ↓
9. Frontend shows updated status
```

## Security Considerations

### Input Validation
- **CSV Parser**: Validates each line, rejects invalid data
- **Backend**: Joi schema validation for all inputs
- **Smart Contract**: Validates addresses, amounts, allowances

### Access Control
- **Safe Multisig**: Requires threshold signatures
- **Smart Contract**: Only Safe can execute distributions
- **Backend**: API key authentication (can be added)

### Error Handling
- **Graceful Failures**: Transactions continue even if one recipient fails
- **Event Logging**: Failed transfers logged in events
- **Database Transactions**: Atomic operations for data integrity

### Audit Trail
- **Database Logs**: All actions recorded with timestamps
- **Blockchain Events**: Immutable on-chain record
- **Distribution Tracking**: Complete history of status changes

## Gas Optimization

### Batch Transfers
- Single transaction for multiple recipients
- Saves 60%+ compared to individual transfers
- Reduces network congestion

### Example Gas Comparison
```
Individual Transfers (100 recipients):
100 transactions × 65,000 gas = 6,500,000 gas

Batch Transfer (100 recipients):
1 transaction × ~2,500,000 gas = 2,500,000 gas

Savings: ~61.5%
```

## Scalability

### Current Limits
- 500 recipients per batch (gas limit protection)
- 5MB CSV file size limit
- SQLite database (suitable for thousands of distributions)

### Future Improvements
- PostgreSQL for production scale
- Queue system for large distributions
- Background job processing
- Horizontal scaling with load balancer

## Dependencies

### Frontend
- next@14.1.0
- react@18.2.0
- ethers@6.10.0
- axios@1.6.5
- tailwindcss@3.4.1

### Backend
- express@4.18.2
- @safe-global/protocol-kit@3.0.0
- ethers@6.10.0
- better-sqlite3@9.3.0
- joi@17.12.0

### Smart Contracts
- @openzeppelin/contracts@5.0.1
- hardhat@2.19.5

## Deployment Architecture

### Development
```
Local Machine
├── Frontend (localhost:3000)
├── Backend (localhost:3001)
└── Local SQLite DB
```

### Production (Recommended)
```
Vercel/Netlify (Frontend)
    ↓ API calls
AWS/DigitalOcean (Backend)
├── Node.js API
├── PostgreSQL
└── Redis (caching)
    ↓ Blockchain calls
HyperEVM Network
├── Safe Multisig
├── BatchTokenDistributor
└── ERC20 Tokens
```

## Monitoring & Observability

### Recommended Tools
- **Frontend**: Vercel Analytics, Sentry
- **Backend**: Winston logger, DataDog
- **Blockchain**: Etherscan-like explorer for HyperEVM
- **Database**: SQLite browser / PostgreSQL admin

### Key Metrics
- Distributions created per day
- Average proposal time
- Gas costs per distribution
- Success/failure rates
- API response times

---

This architecture provides a secure, scalable foundation for automated token distribution while maintaining flexibility for future enhancements.
