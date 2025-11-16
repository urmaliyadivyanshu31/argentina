// In-memory database for demo purposes (replacement for SQLite)
// This stores data in memory - will be lost on restart

// In-memory stores
const distributions = new Map();
const distribution_entries = new Map();
const audit_logs = [];

// Auto-increment ID
let entryIdCounter = 1;
let auditIdCounter = 1;

// Mock prepared statements
export const insertDistribution = {
  run: (id, name, type, token_address, token_symbol, total_recipients, total_amount, status, created_at, created_by) => {
    distributions.set(id, {
      id,
      name,
      type,
      token_address,
      token_symbol,
      total_recipients,
      total_amount,
      status,
      created_at,
      created_by,
      safe_tx_hash: null,
      executed_tx_hash: null
    });
    return { changes: 1 };
  }
};

export const insertDistributionEntry = {
  run: (distribution_id, recipient_address, amount) => {
    const id = entryIdCounter++;
    const key = `${distribution_id}-${id}`;
    distribution_entries.set(key, {
      id,
      distribution_id,
      recipient_address,
      amount,
      status: 'pending',
      tx_hash: null,
      error: null
    });
    return { changes: 1 };
  }
};

export const updateDistributionStatus = {
  run: (status, safe_tx_hash, executed_tx_hash, id) => {
    const dist = distributions.get(id);
    if (dist) {
      dist.status = status;
      if (safe_tx_hash) dist.safe_tx_hash = safe_tx_hash;
      if (executed_tx_hash) dist.executed_tx_hash = executed_tx_hash;
      return { changes: 1 };
    }
    return { changes: 0 };
  }
};

export const insertAuditLog = {
  run: (distribution_id, action, details, timestamp, user_address) => {
    const id = auditIdCounter++;
    audit_logs.push({
      id,
      distribution_id,
      action,
      details,
      timestamp,
      user_address
    });
    return { changes: 1 };
  }
};

export const getDistribution = {
  get: (id) => {
    return distributions.get(id) || null;
  }
};

export const getDistributions = {
  all: (limit, offset) => {
    const allDists = Array.from(distributions.values());
    return allDists
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(offset, offset + limit);
  }
};

export const getDistributionEntries = {
  all: (distribution_id) => {
    return Array.from(distribution_entries.values())
      .filter(entry => entry.distribution_id === distribution_id);
  }
};

export const getAuditLog = {
  all: (distribution_id) => {
    return audit_logs
      .filter(log => log.distribution_id === distribution_id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
};

export const getAllAuditLogs = {
  all: (limit, offset) => {
    return audit_logs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(offset, offset + limit);
  }
};

// Mock database object
const db = {
  exec: () => {},
  close: () => {}
};

export default db;

console.log('📦 Using in-memory database (data will be lost on restart)');
