const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  
  const loanManagerAddress = process.env.LOAN_MANAGER_ADDRESS;
  
  const loanManager = await hre.ethers.getContractAt("LoanManager", loanManagerAddress);

  // Check for a specific address or the current signer
  const addressToCheck = process.argv[2] || signer.address;

  console.log(`\n📊 Borrower Limits for: ${addressToCheck}`);
  console.log("=".repeat(60));

  const [trustScore, maxBorrowLimit, interestRate, safetyFee] = await loanManager.getBorrowerLimits(addressToCheck);

  console.log(`\n  Trust Score:      ${trustScore}`);
  console.log(`  Max Borrow Limit: ${hre.ethers.formatEther(maxBorrowLimit)} ETH`);
  console.log(`  Interest Rate:    ${Number(interestRate) / 100}%`);
  console.log(`  Safety Fee:       ${Number(safetyFee) / 100}%`);

  // Show the tier breakdown
  console.log("\n📋 All Tiers:");
  console.log("=".repeat(60));
  console.log("\n  Trust Score | Max Borrow | Interest | Safety Fee");
  console.log("  " + "-".repeat(50));
  console.log("  90-100      | 10 ETH     | 3%       | 0.5%");
  console.log("  75-89       | 5 ETH      | 5%       | 1%");
  console.log("  60-74       | 2 ETH      | 8%       | 2%");
  console.log("  50-59       | 0.5 ETH    | 12%      | 4%");
  console.log("  40-49       | 0.1 ETH    | 15%      | 6%");
  console.log("  < 40        | Cannot borrow (minimum trust score required)");
  console.log();
}

main().catch(console.error);
