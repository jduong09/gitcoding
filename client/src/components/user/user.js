import React from 'react';
import { Navigate } from 'react-router-dom';
import Dashboard from './dashboard';

class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuth: null,
    }
  }

  async componentDidMount() {
    const response = await fetch(window.location.pathname)
    .then(data => data.json())
    .then(message => message.isAuthenticated);

    this.setState({ isAuth: response });
  }

  render() {
    const { isAuth } = this.state;
    return (isAuth === false ) ? <Navigate to='/' /> : <Dashboard />;
  };
}

export default User;