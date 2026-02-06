import { BrowserProvider } from "ethers";

export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("MetaMask is not installed");
    return null;
  }

  try {
    // Request account access
    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    return {
      provider,
      signer,
      address
    };
  } catch (error) {
    console.error("Wallet connection failed:", error);
    return null;
  }
};
