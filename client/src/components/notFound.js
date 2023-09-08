import React from 'react';
import { Link } from 'react-router-dom';

// TODO: Add some icons/styling
const NotFound = () => (
  <div>
    <header>
      <h1>404. Sorry, the page you are looking for doesn&apos;t exist.</h1>
      <Link to="/">Go Home</Link>
    </header>
  </div>
);

export default NotFound;