import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Dashboard from './dashboard';

const href = process.env && process.env.NODE_ENV === 'production'
  ? '/auth/logout'
  : 'http://localhost:5000/auth/logout';

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

  static async handleLogOut() {
    try {
      await fetch(`${href}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }).then(response => response.json())
        .then(data => {
          window.location = data.url;
        });
    } catch(error) {
      toast.error(`Error logging out user: ${error}`);
    }
  }
  
  render() {
    const { isAuth, name, pfp } = this.state;
    return (isAuth === true ) ? <Dashboard name={name} pfp={pfp} handleLogOut={User.handleLogOut} /> : <Navigate to='/' />;
  };
}

export default User;