import React from 'react';
import { Navigate } from 'react-router-dom';
import Dashboard from './dashboard';

class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuth: false,
    }
  }

  componentDidMount() {
    fetch(window.location.pathname)
    .then(data => data.json())
    .then(message => this.setState({ isAuth: message.isAuthenticated }));
  }

  render() {
    const { isAuth } = this.state;
    return (isAuth === true ) ? <Dashboard /> : <Navigate to='/' />;
  };
}

export default User;