const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

exports.randomSixDigit = () => {
    return Math.floor(100000 + Math.random() * 900000)
};

exports.replaceNullToBlankString = async (obj) => {
    await Object.keys(obj).forEach(key => {
        if(obj[key] == null){
           obj[key] = "";
        }
    });
    return obj;
};

exports.encryptStringCrypt = async (string_value) => {
    let encryptedString = cryptr.encrypt(string_value);
    return encryptedString;
};

exports.CryptrdecryptStringCrypt = async (string_value) => {
    let decryptedString = cryptr.decrypt(string_value);
    return decryptedString;
};

exports.matchPassword = async (password,encryptedPassword) => { 
     let decryptedString = cryptr.decrypt(encryptedPassword);
     return decryptedString === password; 
};