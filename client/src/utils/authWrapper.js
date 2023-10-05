import React, { useState, useEffect } from 'react';
import Login from '../components/user/login';
import User from '../components/user/user';

const ProtectedRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(false);
  
  useEffect(() => {
    fetch('/auth/checkAuth')
      .then(data => data.json())
      .then(resp => setUser(resp.authenticated))
      .then(() => setIsLoggedIn(true));
  }, []);

  if (!isLoggedIn) {
    return <div>Loading...</div>;
  }

  return (
    user ? <User /> : <Login />
  );
};

export default ProtectedRoute;