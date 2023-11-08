const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/index.js',
    specPattern: 'cypress/e2e/'
  },
  experimentalModifyObstructiveThirdPartyCode: true,
  env: {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    DOMAIN: process.env.ISSUER,
    CALLBACK_URL: process.env.CALLBACK_URL,
    PORT: process.env.PORT,
    AUTH0_USERNAME: process.env.AUTH0_USERNAME,
    AUTH0_PASSWORD: process.env.AUTH0_PASSWORD,
    AUTH0_USER_UUID: process.env.AUTH0_USER_UUID
  },
  defaultCommandTimeout: 10000
});