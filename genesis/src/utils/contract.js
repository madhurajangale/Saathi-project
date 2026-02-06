import GroupPoolFactoryABI from "../abi/GroupFactory.json";
import GroupPoolABI from "../abi/GroupPool.json";
import { ethers } from "ethers";
// Replace with your deployed factory contract address
const FACTORY_ADDRESS = "0xBD919B6E8E3bAd96B8Bf6D40313da4144aB31Dd4";
export const getProvider = () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }
  return new ethers.BrowserProvider(window.ethereum);
};
export const getSigner = async () => {
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
};
export const getFactoryContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(FACTORY_ADDRESS, GroupPoolFactoryABI.abi, signer);
};
export const getGroupPoolContract = async (address) => {
  const signer = await getSigner();
  return new ethers.Contract(address, GroupPoolABI.abi, signer);
};
export const connectWallet = async () => {
  const signer = await getSigner();
  const address = await signer.getAddress();
  return { address, signer };
};
