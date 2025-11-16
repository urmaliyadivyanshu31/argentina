// Use in-memory database for demo (better-sqlite3 compilation issues on Windows)
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// In-memory database stores
const distributions_store = new Map();
const entries_store = new Map();
const audit_store = [];
let entry_id = 1;
let audit_id = 1;

const db = {
  exec: () => {},
  close: () => {}
};

// Create tables for audit trail
db.exec(`
  CREATE TABLE IF NOT EXISTS distributions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    token_address TEXT NOT NULL,
    token_symbol TEXT NOT NULL,
    total_recipients INTEGER NOT NULL,
    total_amount TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    safe_tx_hash TEXT,
    executed_tx_hash TEXT,
    created_by TEXT,
    CONSTRAINT valid_type CHECK (type IN ('LOOPDROP', 'LOYALTY')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'proposed', 'executing', 'executed', 'failed'))
  );

  CREATE TABLE IF NOT EXISTS distribution_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    distribution_id TEXT NOT NULL,
    recipient_address TEXT NOT NULL,
    amount TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    tx_hash TEXT,
    error TEXT,
    FOREIGN KEY (distribution_id) REFERENCES distributions(id)
  );

  CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    distribution_id TEXT,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TEXT NOT NULL,
    user_address TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_distributions_status ON distributions(status);
  CREATE INDEX IF NOT EXISTS idx_distributions_created_at ON distributions(created_at);
  CREATE INDEX IF NOT EXISTS idx_distribution_entries_dist_id ON distribution_entries(distribution_id);
  CREATE INDEX IF NOT EXISTS idx_audit_log_dist_id ON audit_log(distribution_id);
`);

// In-memory prepared statements
export const insertDistribution = {
  run: (id, name, type, token_address, token_symbol, total_recipients, total_amount, status, created_at, created_by) => {
    distributions_store.set(id, {
      id, name, type, token_address, token_symbol, total_recipients,
      total_amount, status, created_at, created_by,
      safe_tx_hash: null, executed_tx_hash: null
    });
  }
};

export const insertDistributionEntry = {
  run: (distribution_id, recipient_address, amount) => {
    const id = entry_id++;
    entries_store.set(`${distribution_id}-${id}`, {
      id, distribution_id, recipient_address, amount,
      status: 'pending', tx_hash: null, error: null
    });
  }
};

export const updateDistributionStatus = {
  run: (status, safe_tx_hash, executed_tx_hash, id) => {
    const dist = distributions_store.get(id);
    if (dist) {
      dist.status = status;
      if (safe_tx_hash) dist.safe_tx_hash = safe_tx_hash;
      if (executed_tx_hash) dist.executed_tx_hash = executed_tx_hash;
    }
  }
};

export const insertAuditLog = {
  run: (distribution_id, action, details, timestamp, user_address) => {
    audit_store.push({
      id: audit_id++, distribution_id, action, details, timestamp, user_address
    });
  }
};

export const getDistribution = {
  get: (id) => distributions_store.get(id) || null
};

export const getDistributions = {
  all: (limit, offset) => {
    return Array.from(distributions_store.values())
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(offset, offset + limit);
  }
};

export const getDistributionEntries = {
  all: (distribution_id) => {
    return Array.from(entries_store.values())
      .filter(e => e.distribution_id === distribution_id);
  }
};

export const getAuditLog = {
  all: (distribution_id) => {
    return audit_store
      .filter(log => log.distribution_id === distribution_id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
};

export const getAllAuditLogs = {
  all: (limit, offset) => {
    return audit_store
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(offset, offset + limit);
  }
};

export default db;
