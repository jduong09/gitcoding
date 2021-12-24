/* Functions to help use PKCE
- Securely generating a random string
- Generating the SHA256 hash of that string
*/
const crypto = require('crypto');

// Generate a secure random string using the browser crypto functions
const generateRandomString = () => crypto.randomBytes(43).toString('hex');

module.exports = { generateRandomString };