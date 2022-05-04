import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-typechain";
import "solidity-coverage";
import "hardhat-gas-reporter";

const privateKey = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000"; // this is to avoid hardhat error

import network from "./network.json";

const enableGasReport = !!process.env.ENABLE_GAS_REPORT;
const enableProduction = process.env.COMPILE_MODE === "production";

module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: enableGasReport || enableProduction,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      blockGasLimit: 10000000,
    },
    mainnet: {
      url: network.mainnet.rpc,
      accounts: [privateKey],
    },
    rinkeby: {
      url: network.rinkeby.rpc,
      accounts: [privateKey],
    },
    matic: {
      url: network.matic.rpc,
      accounts: [privateKey],
    },
    matic_test: {
      url: network.matic_test.rpc,
      accounts: [privateKey],
    },
    bsc: {
      url: network.bsc.rpc,
      accounts: [privateKey],
    },
    bsc_test: {
      url: network.bsc_test.rpc,
      accounts: [privateKey],
    },
    shibuya: {
      url: network.shibuya.rpc,
      accounts: [privateKey],
    },
    shiden: {
      url: network.shiden.rpc,
      accounts: [privateKey],
    },
    aurora_test: {
      url: network.aurora_test.rpc,
      accounts: [privateKey],
    },
    rinkarby: {
      url: network.rinkarby.rpc,
      accounts: [privateKey],
    },
    avalanch_fuji: {
      url: network.avalanch_fuji.rpc,
      accounts: [privateKey],
    },
    optimistic_kovan: {
      url: network.optimistic_kovan.rpc,
      accounts: [privateKey],
    },
    boba_rinkeby: {
      url: network.boba_rinkeby.rpc,
      accounts: [privateKey],
    },
    metis_stardust: {
      url: network.metis_stardust.rpc,
      accounts: [privateKey],
    },
    oasis_testnet: {
      url: network.oasis_testnet.rpc,
      accounts: [privateKey],
    },
    astar: {
      url: network.astar.rpc,
      accounts: [privateKey],
    },
    fantom_test: {
      url: network.fantom_test.rpc,
      accounts: [privateKey],
    },
    fantom: {
      url: network.fantom.rpc,
      accounts: [privateKey],
    },
    forge_test: {
      url: network.forge_test.rpc,
      accounts: [privateKey],
    },
    avalanch_c: {
      url: network.avalanch_c.rpc,
      accounts: [privateKey],
    },
    harmony_test: {
      url: network.harmony_test.rpc,
      accounts: [privateKey],
    },
    ontology_test: {
      url: network.ontology_test.rpc,
      accounts: [privateKey],
    },
    heco_test: {
      url: network.heco_test.rpc,
      accounts: [privateKey],
    },
    cronos_test: {
      url: network.cronos_test.rpc,
      accounts: [privateKey],
    },
    moonbase: {
      url: network.moonbase.rpc,
      accounts: [privateKey],
    },
    celo_alfajores: {
      url: network.celo_alfajores.rpc,
      accounts: [privateKey],
    },
    sokol: {
      url: network.sokol.rpc,
      accounts: [privateKey],
    },
    bittorrent_donau: {
      url: network.bittorrent_donau.rpc,
      accounts: [privateKey],
    },
    meter_test: {
      url: network.meter_test.rpc,
      accounts: [privateKey],
    },
    aurora: {
      url: network.aurora.rpc,
      accounts: [privateKey],
    },
    telos_test: {
      url: network.telos_test.rpc,
      accounts: [privateKey],
    },
    klaytn_test: {
      url: network.klaytn_test.rpc,
      accounts: [privateKey],
    },
    velas_test: {
      url: network.velas_test.rpc,
      accounts: [privateKey],
    },
    arbitrum: {
      url: network.arbitrum.rpc,
      accounts: [privateKey],
    },
    lappsnet: {
      url: network.lappsnet.rpc,
      accounts: [privateKey],
    },
    evmos_test: {
      url: network.evmos_test.rpc,
      accounts: [privateKey],
    },
    gu_sandbox: {
      url: network.gu_sandbox.rpc,
      accounts: [privateKey],
    },
    hsc: {
      url: network.hsc.rpc,
      accounts: [privateKey],
    },
    fuse: {
      url: network.fuse.rpc,
      accounts: [privateKey],
    },
    iotex_test: {
      url: network.iotex_test.rpc,
      accounts: [privateKey],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
  gasReporter: {
    enable: enableGasReport,
    currency: "JPY",
    outputFile: process.env.CI ? "gas-report.txt" : undefined,
  },
};
