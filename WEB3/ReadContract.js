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
none so far
*/
//-------------------- IMPORTED OBJECTS ---------------------//

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
const ABIPath = `${__dirname}/JSON/testABI.json`; //Please always link ABI :)

//---------------------  OUR EXPORTS  ---------------------//
/** This function is for read transactions deployed from our server.
 *
 *  This is a secure means to call tx, since read calls do not
 *  have to be signed by a wallet/privatekey
 *
 *  IF USING TESTNET, ROUTING THE PATH OF ABI.JSON file IS REQUIRED,
 *  TO SAVE ETHERSCAN API CALLS, PLEASE LINK ABI FILE ANYWAYS
 *
 *    TO ROUTE UPDATE ABIPath static variable
 *
 *  IF IT IS NOT WORKING MAKE SURE YOU ARE CONNECTED TO THE RIGHT
 *  NET,
 *    TO CONNECT TO DIFFERENT NET update chain static variable
 *    mainnet  --  rinkeby  -- ropesten  --  kovan
 */
/**
 * @access  public
 *
 * @param {string}   address  REQUIRED    Contract address
 * @param {object}   info    REQUIRED
 *      info = {
 *          methodName: 'MintToken',
 *          args: [argument1, argument2, etc]
 *      }
 * @returns The data from the contract call
 */
const readTX = async (contractAddress, info) => {
    try {
        const web3 = new Web3(netURL);
        let ABI = JSON.parse(await fs.readFile(ABIPath, 'utf8'));
        let isMethodThere = false;
        for (let i = 0; i < ABI.length; i++) {
            if (ABI[i].name === info.methodName) {
                isMethodThere = true;
                break;
            }
        }
        ABI = isMethodThere ? ABI : await getABI(contractAddress, chain);
        const contract = new web3.eth.Contract(ABI, contractAddress);
        let data;
        contract.methods[info.methodName]
            .apply(this, info.args)
            .call((err, res) => {
                if (err) throw err;
                data = res;
                console.log(res);
            });
        return data;
    } catch (e) {
        console.log(e);
    }
};

module.exports = readTX;
