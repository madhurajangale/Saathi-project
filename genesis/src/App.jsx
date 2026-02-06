import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import { checkWalletConnected } from "./utils/metamask";

function App() {
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const initWallet = async () => {
      const address = await checkWalletConnected();
      if (address) setWalletAddress(address);
    };

    initWallet();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts.length > 0 ? accounts[0] : "");
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              walletAddress={walletAddress}
              setWalletAddress={setWalletAddress}
            />
          }
        />
        <Route
          path="/dashboard"
          element={<Home walletAddress={walletAddress} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
