import { useEffect } from 'react';

const Login = () => {
  useEffect(() => { window.location = 'http://localhost:5000/auth/login'; });
  return null;
};

export default Login;