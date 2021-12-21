import React from 'react';
import { Navigate } from 'react-router-dom';

class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuth: true,
    }
  }

  componentDidMount() {
    fetch(window.location.pathname)
    .then(data => data.json())
    .then(message => {
      console.log(message.isAuthenticated);
      this.setState({ isAuth: message.isAuthenticated })
    });
  }

  render() {
    const { isAuth } = this.state;
    console.log(isAuth);
    if (isAuth === true) {
      return (
        <h1>Hello you are authenticated</h1>
      )
    }

    return <Navigate to='/' />;
  };
}

export default User;