import express from 'express';
import SafeService from '../services/safeService.js';

const router = express.Router();

/**
 * GET /api/safe/info
 * Get Safe wallet information
 */
router.get('/info', async (req, res) => {
  try {
    const safeService = new SafeService({
      rpcUrl: process.env.HYPEREVM_RPC_URL,
      chainId: parseInt(process.env.CHAIN_ID || '998'),
      safeAddress: process.env.SAFE_ADDRESS,
      signerPrivateKey: process.env.PRIVATE_KEY,
      distributorContractAddress: process.env.DISTRIBUTOR_CONTRACT_ADDRESS
    });

    const info = await safeService.getSafeInfo();

    res.json({
      success: true,
      data: info
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/safe/execute/:safeTxHash
 * Execute a Safe transaction (if threshold is met)
 */
router.post('/execute/:safeTxHash', async (req, res) => {
  try {
    const safeService = new SafeService({
      rpcUrl: process.env.HYPEREVM_RPC_URL,
      chainId: parseInt(process.env.CHAIN_ID || '998'),
      safeAddress: process.env.SAFE_ADDRESS,
      signerPrivateKey: process.env.PRIVATE_KEY,
      distributorContractAddress: process.env.DISTRIBUTOR_CONTRACT_ADDRESS
    });

    const result = await safeService.executeTransaction(req.params.safeTxHash);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
