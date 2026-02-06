import { useEffect, useState } from "react";
import { ethers } from "ethers";
import LoanManagerJSON from "../abi/LoanManager.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_LOAN_MANAGER_ADDRESS;

const PendingRepayments = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length === 0) return;

      const user = accounts[0].toLowerCase();
      setWalletAddress(user);

      await loadPendingLoans(user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingLoans = async (user) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const loanManager = new ethers.Contract(
      CONTRACT_ADDRESS,
      LoanManagerJSON.abi,
      provider
    );

    const rawLoans = await loanManager.getLoans();

    const formatted = rawLoans
      .map((loan, index) => ({
        loanId: index,
        borrower: loan[0].toLowerCase(),
        lender: loan[1],
        amountWei: loan[2],
        amountEth: ethers.formatEther(loan[2]),
        interestRate: (Number(loan[3]) / 100).toFixed(2),
        duration: Number(loan[4]),
        funded: loan[5],
        withdrawn: loan[6],
        repaid: loan[7],
      }))
      console.log(formatted)
      const format=formatted.filter(
        (loan) =>
          loan.borrower === user &&
          loan.funded === false &&
          loan.withdrawn === true &&
          loan.repaid === false
      );
    console.log(format)
    setPendingLoans(formatted);
  };

  const repayLoan = async (loan) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const loanManager = new ethers.Contract(
        CONTRACT_ADDRESS,
        LoanManagerJSON.abi,
        signer
      );

      const tx = await loanManager.repayLoan(
        loan.loanId,
        { value: loan.amountWei }
      );

      await tx.wait();
      alert("✅ Loan repaid successfully");

      await loadPendingLoans(walletAddress);
    } catch (err) {
      console.error(err);
      alert(err.reason || "Repayment failed");
    }
  };

  if (loading) {
    return <p className="text-xs text-slate-500">Loading repayments...</p>;
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Pending Repayments</h3>

      {pendingLoans.length === 0 ? (
        <p className="text-xs text-slate-500">
          No pending repayments 🎉
        </p>
      ) : (
        pendingLoans.map((loan) => (
          <div
            key={loan.loanId}
            className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center mb-4"
          >
            <div>
              <p className="text-sm font-medium">
                Personal Loan #{loan.loanId}
              </p>
              <p className="text-xs text-slate-500">
                Due in {Math.floor(loan.duration / 86400)} days
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold">
                {loan.amountEth} ETH
              </p>
              <button
                className="text-[10px] font-bold text-blue-400"
                onClick={() => repayLoan(loan)}
              >
                Repay Now
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PendingRepayments;
