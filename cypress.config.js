const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    specPattern: 'cypress/e2e/auth_spec.js'
  },
  env: {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    DOMAIN: process.env.ISSUER,
    CALLBACK_URL: process.env.CALLBACK_URL,
    PORT: process.env.PORT,
    AUTH0_username: process.env.AUTH0_username,
    AUTH0_password: process.env.AUTH0_password
  },
});