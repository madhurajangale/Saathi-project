async function main() {
  // Deploy TrustScore first
  const TrustScore = await ethers.getContractFactory("TrustScore");
  const trustScore = await TrustScore.deploy();
  await trustScore.waitForDeployment();

  const trustScoreAddress = await trustScore.getAddress();
  console.log("TrustScore deployed to:", trustScoreAddress);

  // Deploy LendingPool with TrustScore address
  const LendingPool = await ethers.getContractFactory("LendingPool");
  const lendingPool = await LendingPool.deploy(trustScoreAddress);
  await lendingPool.waitForDeployment();

  console.log("LendingPool deployed to:", await lendingPool.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
