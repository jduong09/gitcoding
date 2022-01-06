import React from 'react';
import { Navigate } from 'react-router-dom';
import Dashboard from './dashboard';

const User = ({ isAuth }) => (
  isAuth === false ? <Navigate to='/' /> : <Dashboard />
)

export default User;