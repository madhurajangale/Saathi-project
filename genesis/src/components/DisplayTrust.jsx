import { useEffect, useState } from "react";
import { ethers } from "ethers";
import TrustScoreJSON from "../abi/TrustScore.json";

const TRUST_SCORE_ADDRESS = import.meta.env.VITE_TRUST_SCORE_ADDRESS;

export default function TrustScoreCard() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [trustScore, setTrustScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not installed");
        return;
      }

      // Get connected wallet
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length === 0) {
        setLoading(false);
        return;
      }

      const user = accounts[0];
      setWalletAddress(user);

      await loadTrustScore(user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTrustScore = async (user) => {
    const provider = new ethers.BrowserProvider(window.ethereum);

    const trustScoreContract = new ethers.Contract(
      TRUST_SCORE_ADDRESS,
      TrustScoreJSON.abi,
      provider
    );

    const score = await trustScoreContract.getScore(user);
    setTrustScore(Number(score));
  };

  if (loading) {
    return <p className="text-xs text-slate-500">Loading trust score...</p>;
  }

  if (!walletAddress) {
    return (
      <p className="text-xs text-slate-500">
        Connect wallet to view trust score
      </p>
    );
  }

  return (
    <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
      <p className="text-xs text-slate-400">Your Trust Score</p>

      <p
        className={`text-2xl font-bold ${
          trustScore >= 70
            ? "text-green-400"
            : trustScore >= 40
            ? "text-yellow-400"
            : "text-red-400"
        }`}
      >
        {trustScore}
      </p>

      <p className="text-[10px] text-slate-500 mt-1">
        Based on repayment history
      </p>
    </div>
  );
}
