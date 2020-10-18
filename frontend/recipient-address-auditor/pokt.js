const dotenv = require('dotenv');
dotenv.config();

const PocketLib = require('@pokt-network/web3-provider');
const Web3 = require('web3');
const Transaction = require('ethereumjs-tx').Transaction;
const Pocket = PocketLib.Pocket;
const PocketAAT = PocketLib.PocketAAT;
const Configuration = PocketLib.Configuration;
const PocketProvider = PocketLib.PocketProvider;
const HttpProvider = PocketLib.HttpRpcProvider;
const TransactionSigner = PocketLib.TransactionSigner;

// https://docs.pokt.network/docs/web3-provider
// https://docs.pokt.network/docs/pocket-js

const dispatchers = [
  new URL('https://node3.testnet.pokt.network:443'),
  new URL('https://node2.testnet.pokt.network:443'),
];

const AAT = require('./aat.json');

const configuration = new Configuration(
  5,
  1000,
  5,
  4000,
  true,
  undefined,
  undefined,
  undefined,
  undefined,
  false,
);

const appPrivKeyHex = process.env.POKT_A_PRIV.toString('hex');

const blockchain = '0022'; //Eth Rinkeby
/*
  create a transaction signer 
*/
const transactionSigner = {
  // Needs at least 2 accounts in the node to run all tests
  accounts: [
    process.env.POKT_A_ADD.toLowerCase(),
    process.env.POKT_B_ADD.toLowerCase(),
  ],
  /*
     Callback method called to determine wether or not the
     TransactionSigner supports signing transactions for the given addr         */
  hasAddress: async function (address) {
    return transactionSigner.accounts.includes(address.toLowerCase());
  },
  // Update this object with the address - private keys for each account in the same order they are declared
  privateKeys: [process.env.POKT_A_PRIV, process.env.POKT_B_PRIV],
  /*
    Callback method called to generate a serialized signed format
    of the given a Web3.js transaction object
    (https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendtransaction)
    */
  signTransaction: async function (txParams) {
    try {
      const pkString = ethTransactionSigner.privateKeys[0];
      const privateKeyBuffer = Buffer.from(pkString, 'hex');
      const tx = new Transaction(txParams, {
        chain: 'rinkeby',
      });
      tx.sign(privateKeyBuffer);
      return '0x' + tx.serialize().toString('hex');
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};

// /*
// (Optional)
//      Transaction Signer if you dont want to use the transactionSigner object directly.
// */
// const ethTransactionSigner = new TransactionSigner(
//   transactionSigner.accounts,
//   transactionSigner.privateKeys,
//   transactionSigner.hasAddress,
//   transactionSigner.signTransaction,
// );

// /*
// Creates a Pocket relay that takes the following params:
//     - dispatchers: Array holding the initial dispatcher url(s).
//   - rpcProvider: (optional) Provider which will be used to reach out to the Pocket Core RPC interface.
//   - configuration: (optional) Configuration object.
//   - store — (optional) Save data using a Key/Value relationship. This object save information in memory.
// */
const httpProvider = new HttpProvider(dispatchers);
const pocket = new Pocket(dispatchers, httpProvider, configuration);

async function sendRelay() {
  // generate a new client account.
  //   const clientPassphrase = process.env.POKT_B_PASS;
  //   const clientAccount = await pocket.keybase.createAccount(clientPassphrase);
  const clientPassphrase = '1234';
  const clientAccount = await pocket.keybase.createAccount(clientPassphrase);

  /*
      Import application acct: 
        - privateKey: (required) The application accounts private key
        - passphrase: (required) A passphrase to encrypt the private key iin the keybase 
    */
  const importacctA = await pocket.keybase.importAccount(
    process.env.POKT_A_PRIV.toString('hex'),
    'Diglett',
  );
  const unlockAcct = await pocket.keybase.unlockAccount(
    clientAccount.addressHex,
    clientPassphrase,
    0,
  );
  const isUnlocked = await pocket.keybase.isUnlocked(clientAccount.addressHex);
  //   const unlockAcctA = await pocket.keybase.unlockAccount(
  //     process.env.POKT_A_ADD.toString('hex'),
  //     process.env.POKT_A_PASS,
  //     0,
  //   );
  //   const unlockAcctB = await pocket.keybase.unlockAccount(
  //     process.env.POKT_B_ADD.toString('hex'),
  //     process.env.POKT_B_PASS,
  //     0,
  //   );
  //   const importacctB = await pocket.keybase.importAccount(
  //     process.env.POKT_B_PRIV.toString('hex'),
  //     'Diglett',
  //   );

  //optional test to check if it has been unlocked returns true or false.
  //   const isUnlocked = await pocket.keybase.isUnlocked(clientAccount.addressHex);

  /* 
       pocketAAT: Creates a PocketAAT object, and creates the signature using the provided parameters:
        - version: The spec version under which this ATT needs to be interpreted.
        - clientPublicKey: The client wallets address
        - applicationPublicKey: The hexadecimal publicKey of the Application
        - privateKey: private key of the application    
   */

  //   let pocketAAT;
  //   try {
  //     pocketAAT = await PocketAAT.from(
  //       AAT.version,
  //       AAT.client_pub_key.toString('hex'),
  //       AAT.app_pub_key.toString('hex'),
  //       process.env.POKT_A_PRIV,
  //     );
  //   } catch (err) {
  //     console.error(err);
  //   }
  const pocketAAT = PocketAAT.from(
    '0.0.1',
    clientAccount.publicKey.toString('hex'),
    process.env.POKT_A_PUB.toString('hex'),
    appPrivKeyHex,
  );
  /*
   Create the Pocket Provider instance:
      - activeBlockchain: Target blockchain hash
      - pocketAAT: Pocket Authentication Token object.
      - pocket: Pocket instance
      - transactionSigner: Object containing the TransactionSigner interface methods.
 */
  const pocketProvider = new PocketProvider(
    blockchain,
    pocketAAT,
    pocket,
    transactionSigner,
  );

  // inject into Web3:
  const web3Ins = new Web3(pocketProvider);

  // call the web3 getBalance function.
  const ethBal = web3Ins.eth.getBalance(
    '0xC460B40ffa6053fb09b77781bb850aA4C174552d',
  );

  // will return the balance
  console.log(await ethBal);
}

sendRelay();

module.exports = { sendRelay };
