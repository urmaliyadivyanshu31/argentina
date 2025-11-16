/**
 * @typedef {Object} DistributionEntry
 * @property {string} address - Recipient wallet address
 * @property {string} amount - Token amount (in wei or smallest unit)
 */

/**
 * @typedef {Object} DistributionList
 * @property {string} id - Unique distribution ID
 * @property {string} name - Distribution name
 * @property {string} type - "LOOPDROP" or "LOYALTY"
 * @property {string} tokenAddress - ERC20 token contract address
 * @property {string} tokenSymbol - Token symbol (LOOP, LEND, etc.)
 * @property {DistributionEntry[]} entries - List of recipients and amounts
 * @property {number} totalRecipients - Total number of recipients
 * @property {string} totalAmount - Total amount to distribute
 * @property {string} status - "pending" | "proposed" | "executed" | "failed"
 * @property {string} createdAt - ISO timestamp
 * @property {string} [safeTxHash] - Safe transaction hash if proposed
 * @property {string} [executedTxHash] - Blockchain transaction hash if executed
 */

/**
 * @typedef {Object} SafeTransaction
 * @property {string} to - Contract address
 * @property {string} data - Encoded transaction data
 * @property {string} value - ETH value (usually "0")
 */

export {};
