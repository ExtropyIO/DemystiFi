const { request, gql } = require('graphql-request');

// https://graphql.org/code/#javascript-1
// https://github.com/prisma-labs/graphql-request
async function graphqlReq(address) {
  const endPoint = 'http://127.0.0.1:8081/graphql';

  // Set a single header
  client.setHeader('authorization', 'Bearer MY_TOKEN');

  const query = gql`
    query getInfo($address: String!) {
      Address(public: $address) {
        releaseDate
        history {
          price
          stability
        }
      }
    }
  `;

  const variables = {
    address: address,
  };

  const data = await request(endpoint, query, variables);

  console.log(JSON.stringify(data, undefined, 2));
}

async function auditApi(address) {
  let isScam;
  const response = await fetch(
    `http://127.0.0.1:8081/checkScam/?address=${address}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );

  // fetch(`http://127.0.0.1:8081/checkScam/?address=${address}`, {
  //   method: 'GET',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  // });

  const addressInfo = await response;
  // if(!addressInfo.result) { throw error };

  // let account = accountInfo.result.account;
  // if(!account) { throw error };
  return addressInfo;
}

wallet.onMetaMaskEvent('newUnapprovedTx', async (txMeta) => {
  const { txParams } = txMeta;
  const addressIsUntrustworthy = await auditApi(txParams.to);
  wallet.addAddressAudit({
    address: txParams.to,
    auditor: 'Extropy.io Audits',
    status: addressIsUntrustworthy ? 'warning' : 'approval',
    message: addressIsUntrustworthy
      ? 'The recipient of this transaction is untrustworthy'
      : 'The recipient of this transaction is trustworthy',
  });
});
