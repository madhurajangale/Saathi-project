const hre = require("hardhat");

async function main() {
  const GroupFactory = await hre.ethers.getContractFactory("GroupPoolFactory");
  const groupFactory = await GroupFactory.deploy();
 await groupFactory.waitForDeployment?.();  

  console.log("GroupFactory deployed to:",  groupFactory.target ?? groupFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
