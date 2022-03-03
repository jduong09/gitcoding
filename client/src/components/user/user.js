import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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

      this.setState({ name, pfp });
    } catch(error) {
      toast.error(`Error fetching user info: ${error}`);
    } 
  }
  
  render() {
    const { isAuth, name, pfp } = this.state;
    return (isAuth === true ) ? <Dashboard name={name} pfp={pfp} /> : <Navigate to='/' />;
  };
}

export default User;