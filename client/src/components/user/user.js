import React from 'react';
import { Navigate } from 'react-router-dom';
import Dashboard from './dashboard';

class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuth: true,
      name: '',
      pfp: ''
    };
  }

  async componentDidMount() {
    try {
      const response = await fetch(`${window.location.pathname}/userInfo`);

      const userInfo = await response.json();
      const { name, pfp } = userInfo;
      console.log(name, pfp);

      this.setState({ name, pfp });
    } catch(error) {
      console.log('Error: ', error);
    } 
  }
  
  render() {
    const { isAuth, name, pfp } = this.state;
    return (isAuth === true ) ? <Dashboard name={name} pfp={pfp} /> : <Navigate to='/' />;
  };
}

export default User;