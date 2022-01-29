import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const href = process && process.env && process.env.NODE_ENV === 'production'
  ? '/auth/login'
  : 'http://localhost:5000/auth/login';

const LandingPage = () => (
  <div>
    <header>
      <h1>LANDING PAGE.</h1>
      <a href={href}>
        Sign In 
        <FontAwesomeIcon icon={faSignInAlt} />
      </a>
    </header>
  </div>
);

export default LandingPage;