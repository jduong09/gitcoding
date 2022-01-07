import React from 'react';
import Dashboard from './dashboard';

class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuth: null
    }
  };

  async componentDidMount() {
    await fetch(window.location.pathName)
      .then(data => data.json()).then(message => this.setState({ isAuth: message.isAuthenticated }));
  };

  render() {
    const { isAuth } = this.state;

    return isAuth ? <Dashboard /> : '';
  };
}

export default User;