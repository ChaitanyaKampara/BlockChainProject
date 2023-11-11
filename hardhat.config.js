require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  networks:{
    hardhat:{},
    sepolia:{
      url: "https://eth-sepolia.g.alchemy.com/v2/uLj_olWrBwOBssNM27S84v5DEC0u1R_F",
      accounts:[`0x${"a20b4c417b249247883975a89aa8ab7716fb9c40d74bdf850c173c316c96d35e"}`,],
    },
  },
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
};
