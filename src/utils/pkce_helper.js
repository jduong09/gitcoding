/* Functions to help use PKCE
- Securely generating a random string
- Generating the SHA256 hash of that string
*/

// Generate a secure random string using the browser crypto functions
export const generateRandomString = () => {
  const array = new Uint32Array(28);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => (`0${dec.toString(16)}`).substr(-2)).join('');
};

// Calculate the SHA256 hash of the input text
// Returns a promise that resolves to an ArrayBuffer.
const sha256 = (input) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  return window.crypto.subtle.digest('SHA-256', data);
};

// Base64-urlencodes the input string
const base64urlencode = (str) => (
  btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
);

// Return the base64-urlended sha256 hash for the PKCE Challenge
export const pkceChallengeFromVerifier = async (v) => {
  const hashed = await sha256(v);
  return base64urlencode(hashed);
};
