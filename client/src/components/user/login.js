import { useEffect } from 'react';

const Login = () => {
  console.log('hit login component');
  useEffect(() => { window.location = 'http://localhost:5000/auth/login'; });
  return null;
};

export default Login;