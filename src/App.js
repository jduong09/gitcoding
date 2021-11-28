import React from 'react';
import logo from './logo.svg';
import './App.css';
import { generateRandomString, pkceChallengeFromVerifier } from './utils/pkce_helper';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onGetData = this.onGetData.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
  }

  async onGetData() {
    try {
      const res = await fetch('/api');
      console.log('RES:', res);
      const data = await res.json();
      console.log('DATA: ', data);
    } catch (error) {
      console.log('ERROR: ', error, this.foo);
    }
  }

  async onCreateUser() {
    try {
      const res = await fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'jduong' }),
      });
      console.log('RES: ', res);
    } catch (error) {
      console.log('ERROR: ', error, this.foo);
    }
  }

  async onSignIn(e) {
    // prevent default functionality of onClick event
    e.preventDefault();

    // Configure application and authorization server details
    const config = {
      client_id: '0oa2w7lue0U6fnn3N5d7',
      redirect_uri: 'https://localhost:3000/',
      authorization_endpoint: 'https://dev-88956181.okta.com/oauth2/default/v1/authorize',
      token_endpoint: 'https://dev-88956181.okta.com/oauth2/default/v1/token',
      request_scopes: 'openid',
    };

    // Create and store a random "state" value
    const state = generateRandomString.bind(this);
    localStorage.setItem('pkce_state', state);

    // Create and store a new PKCE code_verifier (the plaintext random secret)
    const codeVerifier = generateRandomString.bind(this);
    localStorage.setItem('pkce_code_verifier', codeVerifier);

    const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);

    const url = `${config.authorization_endpoint}?response_type=code&client_id=${encodeURIComponent(config.client_id)}&state=${encodeURIComponent(state)}&scope=${encodeURIComponent(config.request_scopes)}&redirect_uri=${encodeURIComponent(config.redirect_uri)}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`;

    // Redirect to the authorization server
    window.location = url;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit
            <code>src/App.js</code>
            and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button type="button" onClick={this.onGetData}>
            Click Me
          </button>
          <button type="button" onClick={this.onCreateUser}>
            Create User
          </button>
          <button type="button" onClick={this.onSignIn}>
            Click to Sign In
          </button>
        </header>
      </div>
    );
  }
}
export default App;
