# ToDo-DApp
***Frontend and backend***

## About
The backend implementation of the smart contract along with the frontend app.  
Currently, only hardhat, local node and **goerli testnet** are supported.

## Instructions
To deploy the smart contract, clone this repository and open a terminal in the root directory:

**Step 1:**
```powershell
$ npm install
```
**Step 2:**  
Make sure that the tests are passing.
```powershell
$ npm run test:unit
```
**Step 3:**  
To deploy on goerli testnet,
```powershell
$ npm run deploy:goerli
```

To deploy locally, run the localhost node in another terminal.
```powershell
$ npm run network:localhost
```
Then deploy on localhost node.
```powershell
$ npm run deploy:localhost
```

For more functionality, check out the scripts in `./package.json`.

## Note
Add your own *.env* file with the following:
```env
WALLET_PRIVATE_KEY = <your_wallet_private_key>
API_KEY = <your_etherscan_code_verification_key>
COINMARKETCAP_API_KEY = <your_coinmarketcap_key>
UPDATE_FRONTEND = true
```
