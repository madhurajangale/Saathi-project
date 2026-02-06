import { useEffect, useState } from "react";
import { ethers } from "ethers";
import LoanManagerJSON from "../abi/LoanManager.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_LOAN_MANAGER_ADDRESS;

export default function OpenLoanRequests() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not installed");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      const loanManager = new ethers.Contract(
        CONTRACT_ADDRESS,
        LoanManagerJSON.abi,
        provider
      );

      // ✅ EXACT SAME AS HARDHAT SCRIPT
      const rawLoans = await loanManager.getLoans();

      const formattedLoans = rawLoans
  .filter((loan) => loan.borrower !== ethers.ZeroAddress)
  .map((loan, index) => ({
    loanId: index,

    borrower: loan.borrower,
    lender: loan.lender,

    amountWei: loan.amount,
    amountEth: ethers.formatEther(loan.amount),

    interestRate: (Number(loan.interestRate) / 100).toFixed(2),
    duration: Number(loan.duration),

    createdAt: new Date(
      Number(loan.createdAt) * 1000
    ).toLocaleString(),

    funded: loan.funded,
    repaid: loan.repaid,
    withdrawn: loan.withdrawn,
    defaulted: loan.defaulted, // ✅ NEW
  }));


      setLoans(formattedLoans);
      console.log("Formatted loans:", formattedLoans);
    } catch (err) {
      console.error("Error loading loans:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LEND FUNCTION (UNCHANGED)
  const lendLoan = async (loan) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const loanManager = new ethers.Contract(
        CONTRACT_ADDRESS,
        LoanManagerJSON.abi,
        signer
      );

      const tx = await loanManager.fundLoan(
        loan.loanId,
        { value: loan.amountWei }
      );

      console.log("Transaction sent:", tx.hash);
      await tx.wait();

      alert("✅ Loan funded successfully!");
      loadLoans();
    } catch (err) {
      console.error(err);
      alert(err.reason || "Transaction failed");
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Open Loan Requests (Global)</h2>

      {loading ? (
        <p>Loading loans...</p>
      ) : loans.length === 0 ? (
        <p>No loan requests</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Borrower</th>
              <th>Amount (ETH)</th>
              <th>Interest (%)</th>
              <th>Duration (days)</th>
              <th>Created</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.loanId}>
                <td>{loan.loanId}</td>
                <td>{loan.borrower}</td>
                <td>{loan.amountEth}</td>
                <td>{loan.interestRate}</td>
                <td>{Math.floor(loan.duration / 86400)}</td>
                <td>{loan.createdAt}</td>
                <td>{loan.funded ? "Funded" : "Requested"}</td>
                <td>
                  {!loan.funded && (
                    <button onClick={() => lendLoan(loan)}>
                      Lend
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
