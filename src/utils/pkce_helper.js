/* Functions to help use PKCE
- Securely generating a random string
- Generating the SHA256 hash of that string
*/
const crypto = require('crypto');
const base64url = require('base64url');

// Generate a secure random string using the browser crypto functions
const generateRandomString = () => crypto.randomBytes(43).toString('hex');

// Calculate the SHA256 hash of the input text
// Returns a promise that resolves to an ArrayBuffer.
const hash = (input) => {
  const hashedInput = crypto.createHash('sha256').update(input).digest('base64');
  return hashedInput;
};

// Return the base64-urlended sha256 hash for the PKCE Challenge
const pkceChallengeFromVerifier = async (v) => {
  const hashed = await hash(v);
  return base64url.fromBase64(hashed);
};

module.exports = { generateRandomString, pkceChallengeFromVerifier };
