const version = require("nodemon/lib/version");

module.exports = {

  compilers: {
    solc: {
      version: "0.8.0",
    }
  },
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {

    "development": {
      network_id: "*",
      host: "127.0.0.1",
      port: 8545
    },
  }
};
