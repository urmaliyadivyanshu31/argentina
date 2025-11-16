// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BatchTokenDistributor
 * @notice Gas-optimized batch token distribution contract for LoopDrops and Loyalty Rewards
 * @dev Designed to be used with Safe multisig wallets for secure token distributions
 */
contract BatchTokenDistributor is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Events for audit trail
    event BatchDistribution(
        address indexed token,
        address indexed executor,
        uint256 totalRecipients,
        uint256 totalAmount,
        bytes32 indexed distributionId,
        string distributionType
    );

    event SingleTransfer(
        address indexed token,
        address indexed recipient,
        uint256 amount,
        bytes32 indexed distributionId
    );

    event DistributionFailed(
        address indexed token,
        address indexed recipient,
        uint256 amount,
        bytes32 indexed distributionId,
        string reason
    );

    // Struct for batch transfer data (gas optimization)
    struct Transfer {
        address recipient;
        uint256 amount;
    }

    // Distribution metadata for audit trail
    struct DistributionMetadata {
        address token;
        address executor;
        uint256 timestamp;
        uint256 totalRecipients;
        uint256 totalAmount;
        string distributionType; // "LOOPDROP" or "LOYALTY"
        bool completed;
    }

    // Mapping to track distributions
    mapping(bytes32 => DistributionMetadata) public distributions;

    // Array to keep track of all distribution IDs
    bytes32[] public distributionIds;

    /**
     * @notice Batch distribute ERC20 tokens to multiple recipients
     * @param token Address of the ERC20 token to distribute
     * @param transfers Array of recipient addresses and amounts
     * @param distributionType Type of distribution ("LOOPDROP" or "LOYALTY")
     * @return distributionId Unique identifier for this distribution
     */
    function batchDistribute(
        address token,
        Transfer[] calldata transfers,
        string calldata distributionType
    ) external nonReentrant returns (bytes32 distributionId) {
        require(transfers.length > 0, "No transfers specified");
        require(transfers.length <= 500, "Too many transfers in one batch");
        require(token != address(0), "Invalid token address");

        IERC20 tokenContract = IERC20(token);
        uint256 totalAmount = 0;

        // Calculate total amount and validate inputs
        for (uint256 i = 0; i < transfers.length; i++) {
            require(transfers[i].recipient != address(0), "Invalid recipient address");
            require(transfers[i].amount > 0, "Amount must be greater than 0");
            totalAmount += transfers[i].amount;
        }

        // Generate unique distribution ID
        distributionId = keccak256(
            abi.encodePacked(
                block.timestamp,
                msg.sender,
                token,
                totalAmount,
                distributionType
            )
        );

        // Check allowance and balance
        require(
            tokenContract.allowance(msg.sender, address(this)) >= totalAmount,
            "Insufficient allowance"
        );
        require(
            tokenContract.balanceOf(msg.sender) >= totalAmount,
            "Insufficient balance"
        );

        // Store distribution metadata
        distributions[distributionId] = DistributionMetadata({
            token: token,
            executor: msg.sender,
            timestamp: block.timestamp,
            totalRecipients: transfers.length,
            totalAmount: totalAmount,
            distributionType: distributionType,
            completed: false
        });
        distributionIds.push(distributionId);

        // Execute transfers
        uint256 successfulTransfers = 0;
        for (uint256 i = 0; i < transfers.length; i++) {
            // Use safeTransferFrom - reverts on failure
            tokenContract.safeTransferFrom(
                msg.sender,
                transfers[i].recipient,
                transfers[i].amount
            );

            emit SingleTransfer(
                token,
                transfers[i].recipient,
                transfers[i].amount,
                distributionId
            );
            successfulTransfers++;
        }

        distributions[distributionId].completed = true;

        emit BatchDistribution(
            token,
            msg.sender,
            successfulTransfers,
            totalAmount,
            distributionId,
            distributionType
        );

        return distributionId;
    }

    /**
     * @notice Get distribution details by ID
     * @param distributionId The distribution ID to query
     * @return Distribution metadata
     */
    function getDistribution(bytes32 distributionId)
        external
        view
        returns (DistributionMetadata memory)
    {
        return distributions[distributionId];
    }

    /**
     * @notice Get total number of distributions
     * @return Total count of distributions
     */
    function getDistributionCount() external view returns (uint256) {
        return distributionIds.length;
    }

    /**
     * @notice Get distribution ID by index
     * @param index Index in the distributionIds array
     * @return Distribution ID
     */
    function getDistributionIdByIndex(uint256 index) external view returns (bytes32) {
        require(index < distributionIds.length, "Index out of bounds");
        return distributionIds[index];
    }
}
