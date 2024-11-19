import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import '../styles/Auth.css';

interface LoginProps {
  setIsAuthorized: (auth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthorized }) => {
  const router = useRouter();

  const handleLogin = () => {
    setIsAuthorized(true);
    router.push('/home');
  };

  return (
    <>
    <div className='title'>
      <h1>Campus Connect</h1>
    </div>
    <div className="auth-card">
      <h1>Login</h1>
      <div className="input-box">
        <label htmlFor="userName">Username</label>
        <input type="text" id="userName" name="userName" placeholder="Enter your username" />
      </div>
      <div className="input-box">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" />
      </div>
      <button className="auth-button login-button" onClick={handleLogin}>
        Login
      </button>
      <p className="auth-link">
        Don't have an account?{' '}
        <Link href="/signup">Sign Up</Link>
      </p>
    </div>
    </>
  );
};

export default Login;
