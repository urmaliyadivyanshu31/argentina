import { ethers } from 'ethers';
import Safe from '@safe-global/protocol-kit';
import SafeApiKit from '@safe-global/api-kit';

/**
 * Safe Service for creating and managing multisig transactions
 */
export class SafeService {
  constructor(config) {
    this.rpcUrl = config.rpcUrl;
    this.chainId = config.chainId;
    this.safeAddress = config.safeAddress;
    this.signerPrivateKey = config.signerPrivateKey;
    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
    this.distributorContractAddress = config.distributorContractAddress;
  }

  /**
   * Initialize Safe SDK
   */
  async initialize() {
    try {
      const signer = new ethers.Wallet(this.signerPrivateKey, this.provider);

      this.protocolKit = await Safe.default.create({
        provider: this.rpcUrl,
        safeAddress: this.safeAddress,
        signer: this.signerPrivateKey
      });

      // Note: Safe API Kit may not be available for all networks
      // For HyperEVM, we'll use direct contract interaction
      console.log('Safe Protocol Kit initialized');

      return true;
    } catch (error) {
      console.error('Failed to initialize Safe SDK:', error);
      throw new Error(`Safe initialization failed: ${error.message}`);
    }
  }

  /**
   * Create batch distribution transaction data
   */
  createBatchDistributionData(tokenAddress, entries, distributionType) {
    // ABI for the batchDistribute function
    const batchDistributeABI = [
      "function batchDistribute(address token, tuple(address recipient, uint256 amount)[] transfers, string distributionType) returns (bytes32)"
    ];

    const iface = new ethers.Interface(batchDistributeABI);

    // Format transfers array
    const transfers = entries.map(entry => ({
      recipient: entry.address,
      amount: entry.amount
    }));

    // Encode function call
    const data = iface.encodeFunctionData('batchDistribute', [
      tokenAddress,
      transfers,
      distributionType
    ]);

    return data;
  }

  /**
   * Create a Safe transaction for batch distribution
   */
  async createDistributionTransaction(tokenAddress, entries, distributionType) {
    try {
      if (!this.protocolKit) {
        await this.initialize();
      }

      // Create transaction data
      const data = this.createBatchDistributionData(tokenAddress, entries, distributionType);

      // Create Safe transaction
      const safeTransaction = await this.protocolKit.createTransaction({
        transactions: [{
          to: this.distributorContractAddress,
          value: '0',
          data: data
        }]
      });

      // Sign transaction
      const signedTransaction = await this.protocolKit.signTransaction(safeTransaction);

      // Get transaction hash
      const safeTxHash = await this.protocolKit.getTransactionHash(signedTransaction);

      return {
        safeTransaction: signedTransaction,
        safeTxHash,
        data
      };

    } catch (error) {
      console.error('Failed to create Safe transaction:', error);
      throw new Error(`Transaction creation failed: ${error.message}`);
    }
  }

  /**
   * Propose transaction to Safe (for other signers to approve)
   */
  async proposeTransaction(safeTransaction, safeTxHash) {
    try {
      // For networks without Safe API, we return the transaction for manual processing
      // In production, this would use Safe API Kit to propose the transaction

      console.log('Transaction ready for proposal:', safeTxHash);

      return {
        safeTxHash,
        proposalUrl: `https://app.safe.global/transactions/queue?safe=${this.safeAddress}`,
        message: 'Transaction created. Please approve in Safe interface.'
      };

    } catch (error) {
      console.error('Failed to propose transaction:', error);
      throw new Error(`Transaction proposal failed: ${error.message}`);
    }
  }

  /**
   * Execute transaction (if threshold is met)
   */
  async executeTransaction(safeTxHash) {
    try {
      if (!this.protocolKit) {
        await this.initialize();
      }

      const executeTxResponse = await this.protocolKit.executeTransaction(safeTxHash);

      return {
        txHash: executeTxResponse.hash,
        success: true
      };

    } catch (error) {
      console.error('Failed to execute transaction:', error);
      throw new Error(`Transaction execution failed: ${error.message}`);
    }
  }

  /**
   * Get Safe info
   */
  async getSafeInfo() {
    try {
      if (!this.protocolKit) {
        await this.initialize();
      }

      const owners = await this.protocolKit.getOwners();
      const threshold = await this.protocolKit.getThreshold();
      const nonce = await this.protocolKit.getNonce();

      return {
        address: this.safeAddress,
        owners,
        threshold,
        nonce
      };

    } catch (error) {
      console.error('Failed to get Safe info:', error);
      throw new Error(`Failed to get Safe info: ${error.message}`);
    }
  }

  /**
   * Estimate total token amount needed
   */
  calculateTotalAmount(entries) {
    return entries.reduce((total, entry) => {
      return total + ethers.getBigInt(entry.amount);
    }, 0n).toString();
  }
}

export default SafeService;
