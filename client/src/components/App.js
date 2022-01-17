/* eslint-disable react/no-unused-class-component-methods */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/App.css';
import User from './user/user';
import LandingPage from './landingPage';

const App = () =>  (
  <div className="App">
    <Routes>
      <Route exact path='/' element={<LandingPage />} />
      <Route path='/users/:userId' element={<User />} />
    </Routes>
    <ToastContainer />
  </div>
);

export default App;
