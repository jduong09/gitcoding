const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false
  },
  env: {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    DOMAIN: process.env.ISSUER,
    CALLBACK_URL: process.env.CALLBACK_URL,
    PORT: process.env.PORT
  },
});