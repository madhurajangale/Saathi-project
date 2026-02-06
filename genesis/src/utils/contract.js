import { ethers } from "ethers";

import FactoryABI from "../abi/GroupFactory.json";
import GroupABI from "../abi/GroupPool.json";

const FACTORY_ADDRESS = "0xBD919B6E8E3bAd96B8Bf6D40313da4144aB31Dd4";

const factoryABI = FactoryABI.abi || FactoryABI;
const groupABI = GroupABI.abi || GroupABI;

export const getSigner = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  return await provider.getSigner();
};

export const getFactoryContract = async () => {
  const signer = await getSigner();

  return new ethers.Contract(
    FACTORY_ADDRESS,
    factoryABI,
    signer
  );
};

export const getGroupContract = async (address) => {
  const signer = await getSigner();

  return new ethers.Contract(
    address,
    groupABI,
    signer
  );
};
