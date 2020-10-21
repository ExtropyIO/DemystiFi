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

// An array holding the initial dispatcher url(s). You can use our known dispatcher list found here(https://docs.pokt.network/docs/known-dispatcher-list)
const dispatchers = [
  new URL('https://node3.testnet.pokt.network:443'),
  new URL('https://node2.testnet.pokt.network:443'),
];

/*
(optional)Configuration stores multiple properties used to interact with the Pocket Network. 

   - maxDispatchers - (optional) Maximun amount of dispatchers urls to be stored in rounting table, default 0.
   - maxSessions - (optional) Maximun amount of sessions to be stored for the session manager, default 0.
   - maxConsensusNodes - (optional) Maximun amount of nodes for local consensus, mandatory ODD number, default 0.
   - requestTimeOut - (optional) Maximun timeout for every request in miliseconds, default 0.
   - acceptDisputedResponses - (optional) Accept or reject responses based on having a full consensus, default false.
   - sessionBlockFrequency - (optional) Amount of blocks that need to elapse for a new session to be tumbled, look at https://github.com/pokt-network/pocket-network-genesis for more information
   - blockTime - (optional) Amount of time (in milliseconds) for a new block to be produced in the Pocket Network
   - maxSessionRefreshRetries - (optional) Amount of times to perform a session refresh in case of getting error code 1124 (Invalid Session)
   - validateRelayResponses - (optional) If True the relay responses are validated againt's the relay request information, False will not validate
   - rejectSelfSignedCertificates - (optional) If True the HTTP RPC provider will force certificates to come from CAs, False will allow self signed
*/
const AAT = require('./aat2.json');

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

// application PrivateKey Hex
const appPrivKeyHex = process.env.POKT_C_PRIV;

// blockchain: The specified blockchian ID
const blockchain = '0022'; //Eth Rinkeby

/*
  create a transaction signer 
*/
const transactionSigner = {
  // Needs at least 2 accounts in the node to run all tests
  accounts: [
    process.env.POKT_B_ADD.toLowerCase(),
    process.env.POKT_C_ADD.toLowerCase(),
  ],
  /*
     Callback method called to determine wether or not the
     TransactionSigner supports signing transactions for the given addr         */
  hasAddress: async function (address) {
    return transactionSigner.accounts.includes(address.toLowerCase());
  },
  // Update this object with the address - private keys for each account in the same order they are declared
  privateKeys: [process.env.POKT_B_PRIV, process.env.POKT_C_PRIV],
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

/* 
(Optional)
     Transaction Signer if you dont want to use the transactionSigner object directly.
*/
const ethTransactionSigner = new TransactionSigner(
  transactionSigner.accounts,
  transactionSigner.privateKeys,
  transactionSigner.hasAddress,
  transactionSigner.signTransaction,
);

/*
Creates a Pocket relay that takes the following params:
    - dispatchers: Array holding the initial dispatcher url(s).
  - rpcProvider: (optional) Provider which will be used to reach out to the Pocket Core RPC interface.
  - configuration: (optional) Configuration object.
  - store — (optional) Save data using a Key/Value relationship. This object save information in memory.
*/
const httpProvider = new HttpProvider(dispatchers);
const pocket = new Pocket(dispatchers, httpProvider, configuration);

async function sendRelay() {
  // generate a new client account.
  const clientPassphrase = '1234';
  const clientAccount = await pocket.keybase.createAccount(clientPassphrase);

  /*
    Import application acct: 
      - privateKey: (required) The application accounts private key
      - passphrase: (required) A passphrase to encrypt the private key iin the keybase 
  */
  const importacct = await pocket.keybase.importAccount(
    appPrivKeyHex,
    'Diglett',
  );
  const unlockAcct = await pocket.keybase.unlockAccount(
    clientAccount.addressHex,
    clientPassphrase,
    0,
  );

  //optional test to check if it has been unlocked returns true or false.
  const isUnlocked = await pocket.keybase.isUnlocked(clientAccount.addressHex);

  /* 
     pocketAAT: Creates a PocketAAT object, and creates the signature using the provided parameters:
      - version: The spec version under which this ATT needs to be interpreted.
      - clientPublicKey: The client wallets address
      - applicationPublicKey: The hexadecimal publicKey of the Application
      - privateKey: private key of the application    
 */

  const pocketAAT = PocketAAT.from(
    '0.0.1',
    clientAccount.publicKey.toString('hex'),
    AAT.applicationPublicKey,
    AAT.applicationSignature,
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
  //**** Still in sendRelay()*****

  // call the web3 getBalance function.
  const ethBal = web3Ins.eth.getBalance(
    '0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f',
  );

  // will return the balance
  console.log(await ethBal);
}
sendRelay();
