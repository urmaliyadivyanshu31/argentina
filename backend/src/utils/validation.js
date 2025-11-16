import Joi from 'joi';
import { ethers } from 'ethers';

/**
 * Validate Ethereum address
 */
export function isValidAddress(address) {
  return ethers.isAddress(address);
}

/**
 * Validate amount string (must be positive integer in wei)
 */
export function isValidAmount(amount) {
  try {
    const bn = ethers.getBigInt(amount);
    return bn > 0n;
  } catch {
    return false;
  }
}

/**
 * Schema for distribution list validation
 */
export const distributionListSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  type: Joi.string().valid('LOOPDROP', 'LOYALTY').required(),
  tokenAddress: Joi.string().custom((value, helpers) => {
    if (!isValidAddress(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).required(),
  tokenSymbol: Joi.string().min(1).max(10).required(),
  entries: Joi.array().min(1).max(500).items(
    Joi.object({
      address: Joi.string().custom((value, helpers) => {
        if (!isValidAddress(value)) {
          return helpers.error('any.invalid');
        }
        return value;
      }).required(),
      amount: Joi.string().custom((value, helpers) => {
        if (!isValidAmount(value)) {
          return helpers.error('any.invalid');
        }
        return value;
      }).required()
    })
  ).required()
});

/**
 * Validate distribution list object
 */
export function validateDistributionList(data) {
  const { error, value } = distributionListSchema.validate(data, {
    abortEarly: false
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    return { valid: false, errors };
  }

  // Additional validation: check for duplicate addresses
  const addresses = new Set();
  const duplicates = [];

  value.entries.forEach((entry, index) => {
    const normalized = entry.address.toLowerCase();
    if (addresses.has(normalized)) {
      duplicates.push({
        field: `entries[${index}].address`,
        message: `Duplicate address: ${entry.address}`
      });
    }
    addresses.add(normalized);
  });

  if (duplicates.length > 0) {
    return { valid: false, errors: duplicates };
  }

  return { valid: true, value };
}

/**
 * Calculate total amount from entries
 */
export function calculateTotalAmount(entries) {
  return entries.reduce((total, entry) => {
    return total + ethers.getBigInt(entry.amount);
  }, 0n).toString();
}
