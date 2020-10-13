const axios = require('axios');
const instance = axios.create({
    method: POST,
});
const https = require('https');
const scam01 = '0xA287F2827342B88AE6f9016fC44e0dD6a246C0b5';

async function postRequest(address) {
    const data = JSON.stringify({
        todo: address,
    });

    const options = {
        hostname: '127.0.0.1',
        port: 8081,
        path: '/checkScam',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
        },
    };

    const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on('data', (d) => {
            let isScam = d === scam01 ? false : true;

            process.stdout.write(d);
        });
    });

    req.on('error', (error) => {
        console.error(error);
    });

    req.write(data);
    req.end();
    return isScam;
}

async function callBackend(address) {
    let isFlagged = await postRequest(address);
    // let something = axios.post('127.0.0.1:8081/', {
    //     params: { data: address },
    // });
    // Send a POST request
    // axios({
    //     method: 'post',
    //     url: 'localhost:8081/listUsers',
    //     data: {
    //         tx: address,
    //     },
    // });
    // let isScam = address === scam01 ? false : true;
    return true;
}

function mockAuditApi(address) {
    return new Promise((resolve) => {
        resolve(callBackend(address));
    });
}

wallet.onMetaMaskEvent('newUnapprovedTx', async (txMeta) => {
    const { txParams } = txMeta;

    const addressIsUntrustworthy = await callBackend(txParams.to);
    wallet.addAddressAudit({
        address: txParams.to,
        auditor: 'Extropy.io',
        status: addressIsUntrustworthy ? 'warning' : 'approval',
        message: addressIsUntrustworthy
            ? 'The recipient of this transaction is untrustworthy'
            : 'The recipient of this transaction is trustworthy',
    });
});
