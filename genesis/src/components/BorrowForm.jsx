import { useEffect, useState } from "react";
import { ethers } from "ethers";
import LoanManagerJSON from "../abi/LoanManager.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_LOAN_MANAGER_ADDRESS;
console.log(CONTRACT_ADDRESS)
export default function BorrowForm() {
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");

  // Load wallet from MetaMask (not localStorage)
  useEffect(() => {
    const loadWallet = async () => {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    };

    loadWallet();
  }, []);

  const handleBorrow = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not installed");
        return;
      }

      if (!CONTRACT_ADDRESS) {
        alert("Contract address missing");
        return;
      }

      // Request wallet
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setWalletAddress(accounts[0]);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const loanManager = new ethers.Contract(
        CONTRACT_ADDRESS,
        LoanManagerJSON.abi,
        signer
      );

      // ETH → wei
      const amountInWei = ethers.parseEther(amount);

      // days → seconds
      const durationInSeconds =
        BigInt(duration) * 24n * 60n * 60n;

      const tx = await loanManager.createLoan(
        amountInWei,
        durationInSeconds
      );

      await tx.wait();

      alert("Loan created successfully 🚀");
    } catch (error) {
      console.error(error);
      alert(error.reason || error.message || "Transaction failed");
    }
  };

  return (
    <div>
      <h2>Borrow Loan</h2>

      <p>
        Wallet:{" "}
        {walletAddress
          ? walletAddress.slice(0, 6) +
            "..." +
            walletAddress.slice(-4)
          : "Not connected"}
      </p>

      <input
        type="number"
        placeholder="Loan Amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="number"
        placeholder="Duration (days)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <button onClick={handleBorrow}>
        Request Loan
      </button>
    </div>
  );
}
