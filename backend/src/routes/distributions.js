import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { parseCSV, generateCSVTemplate } from '../utils/csvParser.js';
import { validateDistributionList, calculateTotalAmount } from '../utils/validation.js';
import {
  insertDistribution,
  insertDistributionEntry,
  updateDistributionStatus,
  insertAuditLog,
  getDistribution,
  getDistributions,
  getDistributionEntries,
  getAuditLog,
  getAllAuditLogs
} from '../db/database.js';
import SafeService from '../services/safeService.js';
import { unlink } from 'fs/promises';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

/**
 * GET /api/distributions
 * Get all distributions with pagination
 */
router.get('/', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const distributions = getDistributions.all(limit, offset);

    res.json({
      success: true,
      data: distributions,
      pagination: {
        limit,
        offset
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/distributions/:id
 * Get distribution details by ID
 */
router.get('/:id', (req, res) => {
  try {
    const distribution = getDistribution.get(req.params.id);

    if (!distribution) {
      return res.status(404).json({
        success: false,
        error: 'Distribution not found'
      });
    }

    const entries = getDistributionEntries.all(req.params.id);
    const auditLog = getAuditLog.all(req.params.id);

    res.json({
      success: true,
      data: {
        ...distribution,
        entries,
        auditLog
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/distributions/upload-csv
 * Upload CSV file and create distribution
 */
router.post('/upload-csv', upload.single('file'), async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    filePath = req.file.path;

    const { name, type, tokenAddress, tokenSymbol } = req.body;

    // Validate required fields
    if (!name || !type || !tokenAddress || !tokenSymbol) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, type, tokenAddress, tokenSymbol'
      });
    }

    // Parse CSV
    const entries = await parseCSV(filePath);

    // Create distribution object for validation
    const distributionData = {
      name,
      type,
      tokenAddress,
      tokenSymbol,
      entries
    };

    // Validate
    const validation = validateDistributionList(distributionData);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: validation.errors
      });
    }

    // Calculate totals
    const totalAmount = calculateTotalAmount(entries);
    const distributionId = uuidv4();

    // Save to database
    insertDistribution.run(
      distributionId,
      name,
      type,
      tokenAddress,
      tokenSymbol,
      entries.length,
      totalAmount,
      'pending',
      new Date().toISOString(),
      req.body.createdBy || 'system'
    );

    // Save entries
    const insertEntries = entries.map(entry =>
      insertDistributionEntry.run(distributionId, entry.address, entry.amount)
    );

    // Log action
    insertAuditLog.run(
      distributionId,
      'CREATED',
      `Distribution created from CSV upload: ${entries.length} recipients`,
      new Date().toISOString(),
      req.body.createdBy || 'system'
    );

    res.json({
      success: true,
      data: {
        id: distributionId,
        name,
        type,
        tokenAddress,
        tokenSymbol,
        totalRecipients: entries.length,
        totalAmount,
        status: 'pending'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.errors || null
    });
  } finally {
    // Clean up uploaded file
    if (filePath) {
      try {
        await unlink(filePath);
      } catch (err) {
        console.error('Failed to delete uploaded file:', err);
      }
    }
  }
});

/**
 * POST /api/distributions/create
 * Create distribution from JSON
 */
router.post('/create', async (req, res) => {
  try {
    const { name, type, tokenAddress, tokenSymbol, entries } = req.body;

    // Validate
    const validation = validateDistributionList(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: validation.errors
      });
    }

    // Calculate totals
    const totalAmount = calculateTotalAmount(entries);
    const distributionId = uuidv4();

    // Save to database
    insertDistribution.run(
      distributionId,
      name,
      type,
      tokenAddress,
      tokenSymbol,
      entries.length,
      totalAmount,
      'pending',
      new Date().toISOString(),
      req.body.createdBy || 'system'
    );

    // Save entries
    entries.forEach(entry =>
      insertDistributionEntry.run(distributionId, entry.address, entry.amount)
    );

    // Log action
    insertAuditLog.run(
      distributionId,
      'CREATED',
      `Distribution created: ${entries.length} recipients`,
      new Date().toISOString(),
      req.body.createdBy || 'system'
    );

    res.json({
      success: true,
      data: {
        id: distributionId,
        name,
        type,
        tokenAddress,
        tokenSymbol,
        totalRecipients: entries.length,
        totalAmount,
        status: 'pending'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/distributions/:id/propose
 * Create Safe multisig transaction for distribution
 */
router.post('/:id/propose', async (req, res) => {
  try {
    const distribution = getDistribution.get(req.params.id);

    if (!distribution) {
      return res.status(404).json({
        success: false,
        error: 'Distribution not found'
      });
    }

    if (distribution.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: `Cannot propose distribution with status: ${distribution.status}`
      });
    }

    const entries = getDistributionEntries.all(req.params.id);

    // Initialize Safe service
    const safeService = new SafeService({
      rpcUrl: process.env.HYPEREVM_RPC_URL,
      chainId: parseInt(process.env.CHAIN_ID || '998'),
      safeAddress: process.env.SAFE_ADDRESS,
      signerPrivateKey: process.env.PRIVATE_KEY,
      distributorContractAddress: process.env.DISTRIBUTOR_CONTRACT_ADDRESS
    });

    // Create Safe transaction
    const { safeTxHash, data } = await safeService.createDistributionTransaction(
      distribution.token_address,
      entries.map(e => ({ address: e.recipient_address, amount: e.amount })),
      distribution.type
    );

    // Update distribution status
    updateDistributionStatus.run('proposed', safeTxHash, null, req.params.id);

    // Log action
    insertAuditLog.run(
      req.params.id,
      'PROPOSED',
      `Safe transaction created: ${safeTxHash}`,
      new Date().toISOString(),
      req.body.proposedBy || 'system'
    );

    res.json({
      success: true,
      data: {
        distributionId: req.params.id,
        safeTxHash,
        status: 'proposed',
        message: 'Transaction proposed to Safe multisig'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/distributions/template/csv
 * Download CSV template
 */
router.get('/template/csv', (req, res) => {
  const template = generateCSVTemplate();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=distribution-template.csv');
  res.send(template);
});

/**
 * GET /api/audit-logs
 * Get all audit logs
 */
router.get('/audit/logs', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const logs = getAllAuditLogs.all(limit, offset);

    res.json({
      success: true,
      data: logs,
      pagination: {
        limit,
        offset
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
