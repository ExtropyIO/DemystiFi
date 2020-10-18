# DemystiFi MetaMask Plugin

## Proposed functionality includes

- Plugin alerts when interacting with a suspicious contract
- We maintain a db of contracts with a score of their 'health'
- People can report contracts, but they must have evidence (ie a transaction) showing their interaction with the contract
- We can do some analysis of price movements of tokens against social media mentions for evidence of pump / dump scams
- Analyse smart contracts for 'rug pulling' or too much developer control
- Note which contracts haven't been audited
- Plugin should also be aware of ENS names for the contract
  - https://docs.ens.domains/dapp-developer-guide/resolving-names
- Use d3.js for display - e.g. https://observablehq.com/@d3/radial-tidy-tree
- https://duneanalytics.com/ may also be useful
- https://etherscan.io/apis#contracts for analysing smart contracts / checking verification status

## Areas to investigate

Areas to investigate

1. MetaMask plugin (snap) development
   1. Visualising data - Tom
2. Storing/retrieving data (with Textile/Powergate and Graph)
   1. Data schema
   2. Relevant info to store
   3. Tom to review messaging buckets thing
3. Done. Sponsor prizes - Tom
   1. Relevance
4. Website - Kirsty
   1. Reporting facility for community to submit smart contract / project / address
   2. Idea - Token paid for reporting online
   3. Video demo to showcase plugin
5. Pitch - Kirsty
   1. Twitter poll
   2. Desirability / feasibility / viability
   3. Problem facts and figures
   4. Solution
   5. Research market strategy and size
   6. Research competitors - MythX
   7. Amount of funding - research needed
6. Sourcing data
   1. Scanning byte code for repeating patterns
      1a. investigate how to search for malicious code fingerprints.
      1b. Investigate fingerprints patterns and mutations
   2. Some scams: https://boxmining.com/newsletter-11/
   3. integrate public APIs like defiscore
7. Sourcing social media clues and hints
   1. Twitter API
8. EtherScan API (verification of contracts)
9. Done. Github repo - Laurence
10. Smart contract - Laurence
    1. Contract address
    2. Score
    3. ENS
11. GraphQL to query contract and get data from IPNS
12. Snap backend
    1. Query https://cryptoscamdb.org/ API
    2. Query smart contract via GraphQL
    3. Query etherscan
    4.
13. Methods to add data to smart contract
14. Visualisation of data - Vincent
15. Pocket Network - can we use natively instead of infura in backend? - Tom
16. Monetisation
    1. Donations via BATTS or other
    2. Token for reporting scam
    3. Tip a % of tx

Data items

For each scam

wallet address
score
blockchain
URL
origin
smart contract address
token price

---

## Sponsor prizes

- Tellor https://docs.tellor.io/
  - The Tellor Oracle provides a trustless and decentralized alternative for off-chain data.
  1. Best Original project using Tellor - \$1,500 in TRB
  1. Most Creative Use of Tellor - \$1,000 in TRB
- Textile https://docs.textile.io/
  - IPFS and Filecoin storage
  1. 1,500 DAI for the best use of the Mailboxes API for app invites.
- ENS https://docs.ens.domains/
  - A distributed, open, and extensible naming system based on the Ethereum blockchain.
  1. \$150 in ETH to each of the best five projects to integrate ENS
- Chainlink https://chain.link/
  - Decentralized oracle network that provides secure and reliable inputs and outputs for off-chain data for complex smart contracts on any blockchain.
  1. Are creative, applicable, and technically challenging. But more important that those, is that you make something you love!
- Matic Network
  - Layer 2 scaling solution
  1. Most compelling NFT-focused project - \$1,500
- Pocket Network https://pokt.network/
  - Infura alternative
  1. Best app that natively integrates the Pocket Web3 Provider or Pocket-JS
  1. Best application that uses a Pocket Gateway RPC endpoint URL
- Portis https://docs.portis.io/?id=/trust-this-app?id=%f0%9f%9b%a1-trust-this-app
  - NFT = Defi (BTC prize!)
  1. Who can utilize the full potential from the Portis SDK
- The Graph https://thegraph.com/
  - indexing protocol for organising and efficiently accessing data from blockchains and storage networks
  1. The Graph will award 1 prize of 1000 DAI to the best use of a subgraph
  1. The Graph will award 1 prize of 1000 DAI to the best new subgraph on The Graph Explorer
- 0x https://0x.org/api
  - peer-to-peer exchange of assets on the Ethereum blockchain - querying liquidity states
  1. 5 x \$1,000 in ZRX tokens to the best projects that integrate the 0x API
- Marlin https://www.marlin.pro/
  - permission-less caching and relaying protocol providing low-latency access to miners, storage services and popular APIs and indexers like the Graph, Pokt and more
  1. Most compelling DeFi project - \$1,300
