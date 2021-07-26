# Web3-DynamicCalls
Call contract methods on the Ethereum BC effortlessly.

Important files are inside WEB3 folder.

NOTE to use these files you need to configure variables within the .env file

.env
-------------------------------------------------------
ADDRESS_1="0x... your address"

PRIVATE_KEY_1="0x...private key only required for sendTX"

ETHERSCAN_TOKEN=""

INFURA_TOKEN=""

CURRENT_CHAIN="rinkeby"

-------------------------------------------------------

You can change the chain you connect to depending on 
the CURRENT_CHAIN variable
set it to either
mainnet
rinkeby
ropsten
etc...


npm packages I used. 

    "web3": "^1.3.4",
    "@truffle/hdwallet-provider": "^1.0.40",
    "axios": "^0.21.1",
    
    and
    "dotenv" for env variables.
    

