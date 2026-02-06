import { useState } from "react";
import { ethers } from "ethers";
import GroupPoolABI from "../abi/GroupPool.json";

const JoinGroup = () => {

  const [groupAddress, setGroupAddress] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  // Connect wallet
  const connectWallet = async () => {

    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const address = await signer.getAddress();
    setWalletAddress(address);
  };

  // Join group
  const joinGroup = async () => {

    try {

      if (!groupAddress) {
        alert("Enter group contract address");
        return;
      }

      await connectWallet();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

     const contract = new ethers.Contract(
  groupAddress,
  GroupPoolABI.abi,
  signer
);


      const tx = await contract.joinGroupAndContribute({
        value: ethers.parseEther("0.01")
      });

      await tx.wait();

      alert("Joined Successfully");

    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">Join Group Pool</h1>

      <input
        type="text"
        placeholder="Enter Group Contract Address"
        value={groupAddress}
        onChange={(e) => setGroupAddress(e.target.value)}
        className="p-3 rounded bg-gray-800 border border-gray-600 w-96 mb-4"
      />

      <button
        onClick={joinGroup}
        className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded"
      >
        Join Group
      </button>

    </div>
  );
};

export default JoinGroup;
