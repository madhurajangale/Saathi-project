import { useState } from "react";
import { ethers } from "ethers";
import { Users, Wallet } from "lucide-react";
import GroupPoolABI from "../abi/GroupPool.json";

const JoinGroup = () => {
  const [groupAddress, setGroupAddress] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // 🔹 Connect Wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Install MetaMask");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);
      return signer;
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Join Group Pool
  const joinGroup = async () => {
    try {
      if (!groupAddress) {
        alert("Enter group contract address");
        return;
      }

      setLoading(true);
      setStatus("Joining group...");

      const signer = await connectWallet();

      const contract = new ethers.Contract(
        groupAddress,
        GroupPoolABI.abi,
        signer
      );

      const tx = await contract.joinGroupAndContribute({
        value: ethers.parseEther("0.01"),
      });

      await tx.wait();

      setStatus("✅ Successfully joined group!");
      alert("Joined Group Successfully!");

    } catch (err) {
      console.error(err);
      setStatus("❌ Transaction Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-200 px-6">

      {/* Card */}
      <div className="w-full max-w-lg bg-gradient-to-br from-slate-900/70 to-slate-950/70 border border-slate-800 rounded-3xl p-10 shadow-2xl backdrop-blur-xl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg">
            <Users className="text-white" size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-bold">Join Group Pool</h2>
            <p className="text-slate-400 text-sm">
              Enter pool address to become a member
            </p>
          </div>
        </div>

        {/* Wallet Badge */}
        <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2 mb-6">
          <Wallet size={16} />
          <span className="text-sm">
            {walletAddress
              ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
              : "Wallet Not Connected"}
          </span>
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="Enter Group Contract Address"
          value={groupAddress}
          onChange={(e) => setGroupAddress(e.target.value)}
          className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 outline-none mb-6"
        />

        {/* Join Button */}
        <button
          onClick={joinGroup}
          disabled={loading}
          className="w-full py-4 bg-white text-slate-950 font-bold rounded-xl
                     hover:bg-slate-200 transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          {loading ? "Joining..." : "Join Group"}
        </button>

        {/* Status */}
        {status && (
          <p className="mt-6 text-center text-sm text-slate-300">
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default JoinGroup;
