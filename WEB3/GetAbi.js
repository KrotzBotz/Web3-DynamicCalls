/***************************************************************  
 *                      GetAbi.js
 * Author: Dillon Krotz
 * 
 * This file pulls ABI from a contract addres on the mainnet
 * and returns it as a javascript object
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
none yet
*/

//-------------------- IMPORTED OBJECTS ---------------------//

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

//-------------------- STATIC VARIABLES --------------------//

const apiToken = process.env.ETHERSCAN_TOKEN;

//---------------------  OUR EXPORTS  ---------------------//
/**
 * @access     private
 *
 * @param {string}   address  REQUIRED    Contract address
 * @param {string}   chain    REQUIRED    The chains name 'mainnet', 'rinkeby', 'ropsten'

 * @return {object}  returns the contracts abi as an object
 */
const getABI = async (address, chain) => {
    const testnet = chain === 'mainnet' ? '' : `-${chain}`;
    const stuff = await axios.get(
        `https://api${testnet}.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${apiToken}`
    );
    if (stuff.data.status === '1') return JSON.parse(stuff.data.result);
};

module.exports = getABI;
