import { useEffect, useState } from "react";
import { ethers } from "ethers";
import LoanManagerJSON from "../abi/LoanManager.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_LOAN_MANAGER_ADDRESS;
console.log(CONTRACT_ADDRESS)
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

      // ✅ READ ALL LOANS (GLOBAL STATE)
      const rawLoans = await loanManager.getLoans();
     console.log(rawLoans)
      // ✅ Format + filter only requested loans
      const formattedLoans = rawLoans.map((loan, index) => {
  console.log("Loan raw:", loan); // still Proxy, but usable

  return {
    loanId: index,
    borrower: loan[0],
    lender: loan[1],
    amount: ethers.formatEther(loan[2]),
    interestRate: (Number(loan[3]) / 100).toFixed(2),
    duration: Number(loan[4]),
    funded: loan[5],
    withdrawn: loan[6],
    repaid: loan[7],
  };
});


      setLoans(formattedLoans);
      console.log(loans)
    } catch (err) {
      console.error("Error loading loans:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Open Loan Requests (Global)</h2>

      {loading ? (
        <p>Loading loans...</p>
      ) : loans.length === 0 ? (
        <p>No open loan requests</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Borrower</th>
              <th>Amount (ETH)</th>
              <th>Interest (%)</th>
              <th>Duration (days)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.loanId}>
                <td>{loan.loanId}</td>
                <td>{loan.borrower}</td>
                <td>{loan.amount}</td>
                <td>{loan.interestRate}</td>
                <td>{Math.floor(loan.duration / 86400)}</td>
                <td>Requested</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
