/* eslint-disable react/no-unused-class-component-methods */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '../css/App.css';
import User from './user/user';
import LandingPage from './landingPage';

class App extends React.Component {
  // TODO: Remove all of user GET/CREATE related code when done testing/implementing
  constructor(props) {
    super(props);

    this.state = { users: [], name: '', newUserAdded: false };
    this.onGetUserData = this.onGetUserData.bind(this);
    this.onCreateUser = this.onCreateUser.bind(this);
    this.onUpdateUserNameInput = this.onUpdateUserNameInput.bind(this);
    this.sendLoginRequest = this.sendLoginRequest.bind(this);
  }

  async onGetUserData() {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        if (data) {
          this.setState({ users: data });
        }
      } else {
        // Fail silently
      }
    } catch (error) {
      // Fail silently
      // console.log('ERROR: ', error);
    }
  }

  async onCreateUser() {
    try {
      const { name } = this.state;
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if(res.ok) {
        // Clear name input
        this.setState({ name: '', newUserAdded: true });
        setTimeout(() => this.setState({ newUserAdded: false }), 2000);
      }
    } catch (error) {
      // console.log('ERROR: ', error);
    }
  }

  onUpdateUserNameInput(e) {
    const name = e.target.value;
    this.setState({ name, newUserAdded: false });
  }

  sendLoginRequest(e) {
    e.preventDefault();
    try {
      // const url = process.env.NODE_ENV === 'production' ? '/auth/login' : 'http://localhost:5000/auth/login';
      fetch('/auth/login');
    } catch (error) {
      // Fail silently
      console.log(error, this);
    }
  };

  render() {
    const { users, name, newUserAdded } = this.state;
    return (
      <div className="App">
        <button type="button" onClick={this.onGetUserData}>
          Get users
        </button>
        {users && users.length ? users.map((user) => <div key={user.name}>{user.name}</div>) : null}
        <div>
          <input onChange={this.onUpdateUserNameInput} type="text" name="name" placeholder="Enter a user name" value={name} />
          <button type="button" onClick={name ? this.onCreateUser : null} disabled={!name}>
            Create User
          </button>
        </div>
        {newUserAdded ? <div>New user successfully added! Click <strong>Get users</strong> to see updated list.</div> : null}
        <Routes>
          <Route exact path='/' element={<LandingPage />} />
          <Route exact path='/users/:userId' element={<User />} /> 
        </Routes>
        <button type="button" onClick={this.sendLoginRequest}>
          Login now pls.
        </button>
      </div>
    );
  }
}
export default App;
