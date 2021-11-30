/* Functions to help use PKCE
- Securely generating a random string
- Generating the SHA256 hash of that string
*/
const crypto = require('crypto');

// Generate a secure random string using the browser crypto functions
const generateRandomString = () => crypto.randomBytes(20).toString('hex');

// Calculate the SHA256 hash of the input text
// Returns a promise that resolves to an ArrayBuffer.
const hash = (input) => {
  console.log(input);
  const hashedInput = crypto.createHash(input);
  console.log(hashedInput);
  return hashedInput;
};

// Base64-urlencodes the input string
const base64urlencode = (str) => (
  btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
);

// Return the base64-urlended sha256 hash for the PKCE Challenge
const pkceChallengeFromVerifier = async (v) => {
  const hashed = await hash(v);
  return base64urlencode(hashed);
};

module.exports = { generateRandomString, pkceChallengeFromVerifier };
