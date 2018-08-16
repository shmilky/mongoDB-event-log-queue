const basicAuth = require('express-basic-auth');

module.exports = basicAuth({
    users: { 'admin': '1111' },
    challenge: true
});