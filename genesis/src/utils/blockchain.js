import { ethers } from "ethers";

import GroupPoolABI from "../abi/GroupPool.json";
import GroupPoolFactoryABI from "../abi/GroupFactory.json";

import LoanFactoryABI from "../abi/LoanFactory.json";
import LoanContractABI from "../abi/LoanContract.json";


// ---------- DEPLOYED ADDRESSES ----------
export const FACTORY_ADDRESS = "0xBD919B6E8E3bAd96B8Bf6D40313da4144aB31Dd4";
export const LOAN_FACTORY_ADDRESS = "0x8aE4A49aB9bF152eFC96beFea7f1cCFd4b6339AC";


// ---------- WALLET ----------
let provider;
let signer;

export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return;
  }

  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();

  return signer;
};


// ---------- GROUP FACTORY ----------
export const getGroupFactoryContract = async () => {

  if (!signer) await connectWallet();

  return new ethers.Contract(
    FACTORY_ADDRESS,
    GroupPoolFactoryABI.abi,
    signer
  );
};


// ---------- INDIVIDUAL GROUP POOL ----------
export const getGroupPoolContract = async (poolAddress) => {

  if (!signer) await connectWallet();

  return new ethers.Contract(
    poolAddress,
    GroupPoolABI.abi,
    signer
  );
};


// ---------- LOAN FACTORY ----------
export const getLoanFactoryContract = async () => {

  if (!signer) await connectWallet();

  return new ethers.Contract(
    LOAN_FACTORY_ADDRESS,
    LoanFactoryABI.abi,
    signer
  );
};


// ---------- INDIVIDUAL LOAN ----------
export const getLoanContract = async (loanAddress) => {

  if (!signer) await connectWallet();

  return new ethers.Contract(
    loanAddress,
    LoanContractABI.abi,
    signer
  );
};
