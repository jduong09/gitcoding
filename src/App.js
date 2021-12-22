/* eslint-disable react/no-unused-class-component-methods */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import User from './components/user';
import LandingPage from './components/landingPage';

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

  /*
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
  */

  render() {
    return (
      <div className="App">
        {/* <button type="button" onClick={this.onGetData}>
            Click Me
          </button>
          <button type="button" onClick={this.onCreateUser}>
            Create User
          </button> */}
        <Routes>
          <Route exact path='/' element={<LandingPage />} />
          <Route path='/users/:userId' element={<User />} />
        </Routes>
      </div>
    );
  }
}
export default App;
