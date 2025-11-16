import csv from 'csv-parser';
import { createReadStream } from 'fs';
import { ethers } from 'ethers';

/**
 * Parse CSV file and convert to distribution list format
 * Expected CSV format:
 * address,amount
 * 0x123...,1000000000000000000
 * 0x456...,2000000000000000000
 */
export async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const entries = [];
    const errors = [];
    let lineNumber = 1;

    createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim().toLowerCase()
      }))
      .on('data', (row) => {
        lineNumber++;

        try {
          const address = row.address?.trim();
          const amount = row.amount?.trim();

          // Validate address
          if (!address) {
            errors.push({
              line: lineNumber,
              field: 'address',
              value: address,
              error: 'Address is required'
            });
            return;
          }

          if (!ethers.isAddress(address)) {
            errors.push({
              line: lineNumber,
              field: 'address',
              value: address,
              error: 'Invalid Ethereum address'
            });
            return;
          }

          // Validate amount
          if (!amount) {
            errors.push({
              line: lineNumber,
              field: 'amount',
              value: amount,
              error: 'Amount is required'
            });
            return;
          }

          let amountBigInt;
          try {
            amountBigInt = ethers.getBigInt(amount);
            if (amountBigInt <= 0n) {
              throw new Error('Amount must be greater than 0');
            }
          } catch (err) {
            errors.push({
              line: lineNumber,
              field: 'amount',
              value: amount,
              error: `Invalid amount: ${err.message}`
            });
            return;
          }

          entries.push({
            address: ethers.getAddress(address), // Normalize to checksum address
            amount: amountBigInt.toString()
          });

        } catch (err) {
          errors.push({
            line: lineNumber,
            error: `Unexpected error: ${err.message}`
          });
        }
      })
      .on('end', () => {
        if (errors.length > 0) {
          reject({
            message: 'CSV parsing failed with errors',
            errors,
            parsedEntries: entries.length
          });
        } else {
          resolve(entries);
        }
      })
      .on('error', (err) => {
        reject({
          message: 'Failed to read CSV file',
          error: err.message
        });
      });
  });
}

/**
 * Generate sample CSV template
 */
export function generateCSVTemplate() {
  return `address,amount
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0,1000000000000000000
0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed,2000000000000000000
0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359,1500000000000000000`;
}
