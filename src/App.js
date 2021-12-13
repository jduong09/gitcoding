/* eslint-disable prefer-destructuring */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    library.add(faCoffee);
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

  /*
  // eslint-disable-next-line class-methods-use-this
  async onLogIn() {
    try {
      const response = await fetch('/auth/login');

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  */

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
          <a href='http://localhost:5000/auth/login'>
            Log In!
          </a>
        </header>
        Your <FontAwesomeIcon icon="coffee" /> is hot and ready!
      </div>
    );
  }
}
export default App;
