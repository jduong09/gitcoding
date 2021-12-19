import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <button type="button" onClick={this.onGetData}>
            Click Me
          </button>
          <button type="button" onClick={this.onCreateUser}>
            Create User
          </button>
          <a href="http://localhost:5000/auth/login">
            Log me in friend!
          </a>
          <a href="http://localhost:5000/auth/logout">
            Log me out plz!
          </a>
          <p>
            Your
            <FontAwesomeIcon icon={faCoffee} />
            is hot and ready!
          </p>
        </header>
        <Routes>
          <Route path='/users'>
            Hello this is the users route.
          </Route>
          <Route exact path='/'>
            Hello you are home.
          </Route>
        </Routes>
      </div>
    );
  }
}
export default App;
