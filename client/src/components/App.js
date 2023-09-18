/* eslint-disable react/no-unused-class-component-methods */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import '../toast.scss';
import '../css/App.css';
import User from './user/user';
import LandingPage from './landingPage';
import NotFound from './notFound';
import ProtectedRoute from '../utils/protectedRoute';

const App = () => (
  <div className="App h-100">
    <Routes>
      <Route exact path='/' element={<LandingPage />} />
      <Route
        path='/users/:userId'
        element={
          <ProtectedRoute>
            <User />
          </ProtectedRoute>
        }
      />
      <Route path='/*' element={<NotFound />} />
    </Routes>
    <ToastContainer position="top-right" />
  </div>
);

export default App;