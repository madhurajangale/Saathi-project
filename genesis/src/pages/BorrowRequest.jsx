import { useEffect, useState } from "react";
import { ethers } from "ethers";
import LoanManagerJSON from "../abi/LoanManager.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_LOAN_MANAGER_ADDRESS;
const TRUST_SCORE_ADDRESS = import.meta.env.VITE_TRUST_SCORE_ADDRESS;

export default function OpenLoanRequests() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

const styles = {
    containerr: {
        height: "100vh",
        backgroundColor: "#0f172a", // Dark Blue-Gray
    },
    container: {
      marginTop: "40px",
      padding: "24px",
      backgroundColor: "#050a14", // Deep Black/Blue
      borderRadius: "16px",
      color: "#e2e8f0",
      fontFamily: "'Inter', sans-serif",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      border: "1px solid #1e293b"
    },
    header: {
      fontSize: "24px",
      fontWeight: "600",
      marginBottom: "20px",
      color: "#60a5fa", // Bright Blue accent
      letterSpacing: "-0.025em"
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0 8px",
      textAlign: "left"
    },
    th: {
      padding: "12px 16px",
      color: "#94a3b8",
      fontSize: "13px",
      textTransform: "uppercase",
      fontWeight: "700",
      borderBottom: "1px solid #1e293b"
    },
    tr: {
      backgroundColor: "#0f172a", // Dark Blue-Gray
      transition: "transform 0.2s ease",
    },
    td: {
      padding: "16px",
      fontSize: "14px",
      borderTop: "1px solid #1e293b",
      borderBottom: "1px solid #1e293b"
    },
    address: {
      fontFamily: "monospace",
      backgroundColor: "#1e293b",
      padding: "4px 8px",
      borderRadius: "6px",
      color: "#38bdf8"
    },
    badge: (status) => ({
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "600",
      backgroundColor: status === 'Active' ? "#064e3b" : "#1e293b",
      color: status === 'Active' ? "#34d399" : "#94a3b8",
      border: `1px solid ${status === 'Active' ? "#059669" : "#334155"}`
    }),
    btn: (bg) => ({
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "13px",
      transition: "opacity 0.2s",
      backgroundColor: bg,
      color: "white",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
    }),
    emptyState: {
      textAlign: "center",
      padding: "40px",
      color: "#64748b"
    }
  };

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

      // Fetch trust scores for all unique borrowers
      const trustScoreContract = new ethers.Contract(
        TRUST_SCORE_ADDRESS,
        ["function getScore(address) view returns (uint256)"],
        provider
      );

      const formattedLoans = await Promise.all(
        rawLoans
          .filter((loan) => loan.borrower !== ethers.ZeroAddress)
          .map(async (loan, index) => {
            // Fetch trust score for this borrower
            const trustScore = await trustScoreContract.getScore(loan.borrower);
            
            return {
              loanId: index,
              borrower: loan.borrower,
              lender: loan.lender,
              amountWei: loan.amount,
              amountEth: ethers.formatEther(loan.amount),
              interestRate: (Number(loan.interestRate) / 100).toFixed(2),
              safetyFee: (Number(loan.safetyFee) / 100).toFixed(2),
              duration: Number(loan.duration),
              createdAt: new Date(Number(loan.createdAt) * 1000).toLocaleString(),
              funded: loan.funded,
              repaid: loan.repaid,
              withdrawn: loan.withdrawn,
              defaulted: loan.defaulted,
              trustScore: Number(trustScore),
            };
          })
      );


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

  // 🔥 WITHDRAW FUNCTION (BORROWER ONLY)
  const withdrawLoan = async (loan) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      if (userAddress.toLowerCase() !== loan.borrower.toLowerCase()) {
        alert("❌ Only the borrower can withdraw this loan.");
        return;
      }

      const loanManager = new ethers.Contract(
        CONTRACT_ADDRESS,
        LoanManagerJSON.abi,
        signer
      );

      const tx = await loanManager.withdrawLoan(loan.loanId);
      console.log("Withdraw transaction sent:", tx.hash);
      await tx.wait();

      alert("✅ Funds withdrawn successfully!");
      loadLoans();
    } catch (err) {
      console.error(err);
      alert(err.reason || "Transaction failed");
    }
  };

  // 🔥 REPAY FUNCTION (BORROWER ONLY)
  const repayLoan = async (loan) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      if (userAddress.toLowerCase() !== loan.borrower.toLowerCase()) {
        alert("❌ Only the borrower can repay this loan.");
        return;
      }

      const loanManager = new ethers.Contract(
        CONTRACT_ADDRESS,
        LoanManagerJSON.abi,
        signer
      );

      const repaymentAmount = await loanManager.calculateRepayment(loan.loanId);
      const tx = await loanManager.repayLoan(loan.loanId, { value: repaymentAmount });
      console.log("Repay transaction sent:", tx.hash);
      await tx.wait();

      alert("✅ Loan repaid successfully!");
      loadLoans();
    } catch (err) {
      console.error(err);
      alert(err.reason || "Transaction failed");
    }
  };

  // Helper to get loan status text
  const getLoanStatus = (loan) => {
    if (loan.repaid) return "Repaid";
    if (loan.withdrawn) return "Active";
    if (loan.funded) return "Funded (Withdraw)";
    return "Requested";
  };

  return (
    <div className="containerr">
    <div style={styles.container}>
      <h2 style={styles.header}>Open Loan Requests (Global)</h2>

      {loading ? (
        <div style={styles.emptyState}>
          <div className="spinner">Loading loans...</div>
        </div>
      ) : loans.length === 0 ? (
        <p style={styles.emptyState}>No loan requests found in the smart contract.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Loan ID</th>
                <th style={styles.th}>Borrower</th>
                <th style={styles.th}>Trust Score</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Interest</th>
                <th style={styles.th}>Safety Fee</th>
                <th style={styles.th}>Duration</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.loanId} style={styles.tr}>
                  <td style={{ ...styles.td, borderLeft: "1px solid #1e293b", borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" }}>
                    #{loan.loanId}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.address}>
                      {loan.borrower.slice(0, 6)}...{loan.borrower.slice(-4)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "700",
                      backgroundColor: loan.trustScore >= 75 ? "#064e3b" : loan.trustScore >= 50 ? "#854d0e" : "#7f1d1d",
                      color: loan.trustScore >= 75 ? "#34d399" : loan.trustScore >= 50 ? "#fbbf24" : "#f87171",
                      border: `1px solid ${loan.trustScore >= 75 ? "#059669" : loan.trustScore >= 50 ? "#ca8a04" : "#dc2626"}`
                    }}>
                      {loan.trustScore}
                    </span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: '700', color: '#fff' }}>
                    {loan.amountEth} <span style={{ color: '#60a5fa', fontSize: '11px' }}>ETH</span>
                  </td>
                  <td style={styles.td}>{loan.interestRate}%</td>
                  <td style={styles.td}>{loan.safetyFee}%</td>
                  <td style={styles.td}>{Math.floor(loan.duration / 86400)} Days</td>
                  <td style={styles.td}>
                    <span style={styles.badge(getLoanStatus(loan))}>
                      {getLoanStatus(loan)}
                    </span>
                  </td>
                  <td style={{ ...styles.td, borderRight: "1px solid #1e293b", borderTopRightRadius: "8px", borderBottomRightRadius: "8px", textAlign: 'right' }}>
                    
                    {!loan.funded && (
                      <button 
                        onClick={() => lendLoan(loan)} 
                        style={styles.btn("#2563eb")}
                        onMouseOver={(e) => e.target.style.opacity = '0.8'}
                        onMouseOut={(e) => e.target.style.opacity = '1'}
                      >
                        Lend Funds
                      </button>
                    )}

                    {loan.funded && !loan.withdrawn && !loan.repaid && (
                      <button 
                        onClick={() => withdrawLoan(loan)} 
                        style={styles.btn("#10b981")}
                      >
                        Withdraw
                      </button>
                    )}

                    {loan.withdrawn && !loan.repaid && (
                      <button 
                        onClick={() => repayLoan(loan)} 
                        style={styles.btn("#3b82f6")}
                      >
                        Repay Loan
                      </button>
                    )}

                    {loan.repaid && (
                      <span style={{ color: '#10b981', fontWeight: '600' }}>
                        <i style={{ marginRight: '4px' }}>✓</i> Settled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  );
}
