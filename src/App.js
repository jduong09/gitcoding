/* eslint-disable prefer-destructuring */
import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
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

  async onLogIn() {
    try {
      const res = await fetch('/auth/login').then(data => data.json()).then(json => json.url);
      console.log(res);
      window.location = res;
    } catch(error) {
      console.log('ERROR: ', error, this.foo);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Home Page
          <img src={logo} className="App-logo" alt="logo" />
          <button type="button" onClick={this.onGetData}>
            Click Me
          </button>
          <button type="button" onClick={this.onCreateUser}>
            Create User
          </button>
          <button type="button" onClick={this.onLogIn}>
            Log In!
          </button>
        </header>
      </div>
    );
  }
}
export default App;
