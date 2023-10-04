import React, { useState, useEffect } from 'react';
// import { Outlet } from 'react-router-dom';
import Login from '../components/user/login';
import User from '../components/user/user';

const ProtectedRoute = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch('/auth/checkAuth')
      .then(data => data.json())
      .then(resp => setUser(resp.authenticated));
    console.log('i fire once');
  }, []);

  console.log(user);

  return (
    user ? <User /> : <Login />
  );
};

export default ProtectedRoute;