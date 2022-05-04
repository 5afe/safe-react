import * as fs from "fs";
import * as path from "path";
import hre, { ethers } from "hardhat";
import { NetworkName } from "./types";

export const filePath = "../network.json";
export const networkName = hre.network.name == "hardhat" ? "localhost" : <NetworkName>hre.network.name;

export const gasPrice = process.env.GAS_PRICE ? parseInt(process.env.GAS_PRICE) : 1000000000; //1 gwei

export const readFileAsJson = () => {
  const configsBuffer = fs.readFileSync(path.join(__dirname, filePath));
  return JSON.parse(configsBuffer.toString());
};

export const updateJson = (contractName: string, address: string) => {
  const contractNameLowerString = contractName.toLowerCase();
  networkName != "localhost" && console.log("json update for", contractNameLowerString);
  const configs = readFileAsJson();
  configs[networkName][contractNameLowerString] = address;
  fs.writeFileSync(path.join(__dirname, filePath), JSON.stringify(configs));
  networkName != "localhost" && console.log("json updated");
};

export const deployFactory = async () => {
  const contractName = "Chocofactory";
  const Contract = await ethers.getContractFactory(contractName);
  const contract = await Contract.deploy(contractName, "1", { gasPrice });
  networkName != "localhost" && console.log(contractName, "deployed at", contract.address);
  updateJson(contractName, contract.address);
  return contract;
};

export const deployMold = async () => {
  const contractName = "Chocomold";
  const Contract = await ethers.getContractFactory(contractName);
  const contract = await Contract.deploy({
    gasPrice,
  });
  networkName != "localhost" && console.log(contractName, "deployed at", contract.address);
  updateJson(contractName, contract.address);
  return contract;
};
