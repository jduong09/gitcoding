import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuth }) =>  isAuth ? children : <Navigate to="/" />

export default ProtectedRoute;