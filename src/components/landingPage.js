import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt} from '@fortawesome/free-solid-svg-icons';

const LandingPage = () => (
  <div>
    <header>
      <h1>LANDING PAGE.</h1>
      <a href="http://localhost:5000/auth/login">
        Sign In 
        <FontAwesomeIcon icon={faSignInAlt} />
      </a>
    </header>
  </div>
);

export default LandingPage;