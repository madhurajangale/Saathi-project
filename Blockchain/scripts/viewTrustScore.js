const { ethers } = require("hardhat");

async function main() {
  const TRUST_SCORE_ADDRESS = process.env.TRUST_SCORE_ADDRESS || "0x701400a48b1Fb0C4b76E7f03e58BF9f7071c0353";

  const [signer] = await ethers.getSigners();

  const trustScore = await ethers.getContractAt(
    "TrustScore",
    TRUST_SCORE_ADDRESS,
    signer
  );

  // Check your own trust score
  const myAddress = signer.address;
  const myScore = await trustScore.getScore(myAddress);
  
  console.log("Trust Score Information");
  console.log("======================");
  console.log("Your Address:", myAddress);
  console.log("Your Trust Score:", myScore.toString());
  
  // Optional: Check another address if provided
  const addressToCheck = process.env.CHECK_ADDRESS;
  if (addressToCheck) {
    const otherScore = await trustScore.getScore(addressToCheck);
    console.log("\nOther Address:", addressToCheck);
    console.log("Their Trust Score:", otherScore.toString());
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
