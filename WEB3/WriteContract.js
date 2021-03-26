/***************************************************************  
 *                      ContractCall.js
 * Author: Dillon Krotz
 * 
 * This file provides dynamic web3 functions for calling 
 * contract methods.
 * 
    ⣿⣿⣿⣿⡿⠟⠛⠛⠛⠛⠉⠉⠙⠛⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠟⠂⠀
    ⣿⣿⣯⣤⣤⣶⣶⣶⣶⣿⣿⣿⣿⣿⣿⣶⣾⣿⣿⣿⣿⣿⣿⣿⣏⠀⣀⣀⡀⠀
    ⣿⣿⣿⣿⣿⣿⣿⡿⠿⠟⠛⠛⠿⠟⠉⠉⠉⢻⣿⣿⣿⡿⠟⠛⢉⣼⣿⣿⣿⠀
    ⣿⣿⣿⣿⣭⣤⣴⣶⣿⣿⠃⠀⠀⢀⣀⣤⣶⣿⣿⣿⣿⡇⠀⠀⣩⣤⣤⠀⠀⠀
    ⣿⣿⣿⣿⣿⣿⣟⠛⠛⠛⠛⢋⣩⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⠛⠛⠃⠀⠀⠀
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣤⣤⣤⣄⠀
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢿⣿⡿⢿⣿⣿⣿⣿⣿⣿⠃
    ⠿⠿⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣭⣁⣀⡀⠀⠀⠀⠀⠀⢠⣾⣿⣿⠏⠀
    ⠀⠀⠀⠀⠀⠀⠉⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⣤⣈⡻⠋⠁⠀⠀
    ⣰⣶⣶⣶⣶⣶⣶⣿⣿⣿⣿⣿⣿⣿⡿⠿⠿⠿⠛⠛⠛⠛⠛⠛⠛⠩⠀⠀⠀⠀
    ⣿⣿⣿⣿⣿⣿⠉⠉⠉⣿⣿⡶⠶⠶⢶⠿⠿⠛⠛⠛⠛⠛⠛⣻⣿⠃⠀⠀⠀⠀
    ⠛⠛⣿⣿⣿⣿⣷⡀⠀⠈⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠋⠀⠀⠀⠀⠀⠀
    ⢠⣾⣿⣿⣿⣿⣿⠿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀⠀⠀⠀⠀⠀
    ⠄⠙⠛⠿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠞⠋⠀


FUTURE TO DO's 
-
Instead of console logging txHash, store it in
database/.txtFolder
-
Same with the errors caught in the catch blocks, store in 
database/.txtFolder
-
Clean up try catch blocks.

*/
//-------------------- IMPORTED OBJECTS ---------------------//

const Provider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const fs = require('fs').promises;
const dotenv = require('dotenv');
dotenv.config();

//--------------------- LOCAL  IMPORTS ----------------------//

const getABI = require('./GetAbi.js');

//-------------------- STATIC VARIABLES --------------------//

const chain = process.env.CURRENT_CHAIN;
const infuraToken = process.env.INFURA_TOKEN;
const netURL = `https://${chain}.infura.io/v3/${infuraToken}`;
const ABIPath = `${__dirname}/JSON/testABI.json`; //Please always link ABI
const wallet = process.env.ADDRESS_1;
const privateKey = process.env.PRIVATE_KEY_1;

//---------------------  OUR EXPORTS  ---------------------//

/** This function is for WRITE transactions deployed from our server.
 *
 *  This is unsecure and should never be allowed to be invoked client side
 *  since it signs transactions with our companies address
 *
 *  To get it to work, you need to paste the companies eth address/private key in
 *  a secure .env file.
 * ----------------- .env FORMAT: ----------------------
 *  ADDRESS_1=0x828c2F0Aa9A014eD06e965cB41b284fed6B587A6
 *  PRIVATE_KEY_1="0x the private key"
 * -----------------------------------------------------
 *  IF USING TESTNET, ROUTING THE PATH OF ABI.JSON file IS REQUIRED,
 *  TO SAVE ETHERSCAN API CALLS, PLEASE LINK ABI FILE ANYWAYS
 *
 *  TO ROUTE UPDATE ABIPath static variable
 *
 *  IF IT IS NOT WORKING MAKE SURE YOU ARE CONNECTED TO THE RIGHT
 *  NET, IF NOT SIMPLY CHANGE CHAIN STATIC VARIABLE TO
 *  mainnet  --  rinkeby  -- ropesten  --  kovan
 */
/**
 * @access  public --- well only if we call it from our servers
 *
 * @param {string}   address  REQUIRED    Contract address
 * @param {object}   info    REQUIRED
 *      info = {
 *          methodName: 'MintToken',
 *          args: [argument1, argument2, etc]
 *      }
 */
const writeTX = async (contractAddress, info) => {
    try {
        const provider = new Provider(privateKey, netURL);
        const web3 = new Web3(provider);
        let ABI = JSON.parse(await fs.readFile(ABIPath, 'utf8'));
        let isMethodThere = false;
        for (let i = 0; i < ABI.length; i++) {
            if (ABI[i].name === info.methodName) {
                isMethodThere = true;
                break;
            }
        }
        ABI = isMethodThere ? ABI : getABI(contractAddress, chain);
        const myContract = new web3.eth.Contract(ABI, contractAddress);
        const receipt = await myContract.methods[info.methodName]
            .apply(this, info.args)
            .send({ from: wallet });
        console.log(`Transaction hash: ${receipt.transactionHash}`); // route to database
    } catch (e) {
        console.log(e);
    } // errors will be logged in database eventually
};

module.exports = writeTX;
