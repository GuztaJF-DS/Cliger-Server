const randtoken = require('rand-token');

function GenerateConfirmToken() {
    return randtoken.generate(6, '0123456789');
}

module.exports = GenerateConfirmToken;
