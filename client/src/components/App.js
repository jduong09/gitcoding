/* eslint-disable react/no-unused-class-component-methods */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '../css/App.css';
import User from './user/user';
import LandingPage from './landingPage';

class App extends React.Component {
  // TODO: Remove all of user GET/CREATE related code when done testing/implementing
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <Routes>
          <Route exact path='/' element={<LandingPage />} />
          <Route path='/users/:userId' element={<User />} />
        </Routes>
      </div>
    );
  }
}
export default App;
