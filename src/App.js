/* eslint-disable prefer-destructuring */
import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onGetData = this.onGetData.bind(this);
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

  // Don't forget to put clisent_id into .env for good practice.
  // Authorization and token_endpoint maybe too?
  // eslint-disable-next-line class-methods-use-this
  async onSignIn(e) {
    // prevent default functionality of onClick event
    e.preventDefault();

    try {
      const response = await fetch('/auth/login').then((data) => data.json());
      window.location = response.url;
    } catch (error) {
      console.log(error);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getToken(e) {
    e.preventDefault();
    const q = window.location.search.substring(1);
    console.log(q);
    const segments = q.split('&').map((s) => s.split('='));
    const queryString = {};
    // eslint-disable-next-line no-return-assign
    segments.forEach((s) => queryString[s[0]] = s[1]);

    try {
      await fetch(`/token?code=${queryString.code}&state=${queryString.state}`).then((data) => data.json()).then((res) => console.log(res));
    } catch (error) {
      console.log(error);
    }
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
          <button type="button" onClick={this.getToken}>
            Get Token
          </button>
        </header>
      </div>
    );
  }
}
export default App;
