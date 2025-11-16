const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BatchTokenDistributor", function () {
  let distributor;
  let token;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // Deploy a mock ERC20 token for testing
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    token = await MockERC20.deploy("Mock Token", "MOCK", ethers.parseEther("1000000"));

    // Deploy BatchTokenDistributor
    const BatchTokenDistributor = await ethers.getContractFactory("BatchTokenDistributor");
    distributor = await BatchTokenDistributor.deploy();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await distributor.getAddress()).to.be.properAddress;
    });
  });

  describe("Batch Distribution", function () {
    it("Should distribute tokens to multiple recipients", async function () {
      const amount1 = ethers.parseEther("100");
      const amount2 = ethers.parseEther("200");
      const amount3 = ethers.parseEther("300");

      const transfers = [
        { recipient: addr1.address, amount: amount1 },
        { recipient: addr2.address, amount: amount2 },
        { recipient: addr3.address, amount: amount3 },
      ];

      // Approve distributor to spend tokens
      const totalAmount = amount1 + amount2 + amount3;
      await token.approve(await distributor.getAddress(), totalAmount);

      // Execute batch distribution
      await distributor.batchDistribute(
        await token.getAddress(),
        transfers,
        "LOOPDROP"
      );

      // Verify balances
      expect(await token.balanceOf(addr1.address)).to.equal(amount1);
      expect(await token.balanceOf(addr2.address)).to.equal(amount2);
      expect(await token.balanceOf(addr3.address)).to.equal(amount3);
    });

    it("Should emit BatchDistribution event", async function () {
      const amount = ethers.parseEther("100");
      const transfers = [{ recipient: addr1.address, amount }];

      await token.approve(await distributor.getAddress(), amount);

      await expect(
        distributor.batchDistribute(
          await token.getAddress(),
          transfers,
          "LOYALTY"
        )
      ).to.emit(distributor, "BatchDistribution");
    });

    it("Should revert with empty transfers array", async function () {
      await expect(
        distributor.batchDistribute(
          await token.getAddress(),
          [],
          "LOOPDROP"
        )
      ).to.be.revertedWith("No transfers specified");
    });

    it("Should revert with insufficient allowance", async function () {
      const amount = ethers.parseEther("100");
      const transfers = [{ recipient: addr1.address, amount }];

      // Don't approve - should fail
      await expect(
        distributor.batchDistribute(
          await token.getAddress(),
          transfers,
          "LOOPDROP"
        )
      ).to.be.revertedWith("Insufficient allowance");
    });
  });

  describe("Distribution Tracking", function () {
    it("Should track distribution count", async function () {
      const amount = ethers.parseEther("100");
      const transfers = [{ recipient: addr1.address, amount }];

      await token.approve(await distributor.getAddress(), amount);
      await distributor.batchDistribute(
        await token.getAddress(),
        transfers,
        "LOOPDROP"
      );

      expect(await distributor.getDistributionCount()).to.equal(1);
    });
  });
});

// Mock ERC20 contract for testing
// This would typically be in a separate file
const mockERC20Code = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }
}
`;
