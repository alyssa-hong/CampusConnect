import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import '../styles/Auth.css';

interface LoginProps {
  setIsAuthorized: (auth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthorized }) => {
  const router = useRouter();

  // State for login inputs
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  // State for errors and messages
  const [errors, setErrors] = useState<{ userName?: string; password?: string }>({});
  const [message, setMessage] = useState('');

  // Validate a single field
  const validateField = (name: string, value: string) => {
    let error = '';

    if (name === 'userName') {
      if (!value) error = 'Username is required.';
    } else if (name === 'password') {
      if (!value) error = 'Password is required.';
    }

    return error;
  };

  // Handle input changes with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the field value
    if (name === 'userName') setUserName(value);
    if (name === 'password') setPassword(value);

    // Validate the field and update errors
    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  // Handle form submission
  const handleLogin = async () => {
    setErrors({});
    setMessage('');
  
    // Validate inputs (example)
    if (!userName || !password) {
      setMessage('Both username and password are required.');
      return;
    }
  
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // handle successful login (e.g., redirect)
        setIsAuthorized(true);
        router.push('/home');
      } else {
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred. Please try again.');
    }
  };
  
  return (
    <>
      <div className="title">
        <h1>Welcome back to Campus Connect!</h1>
      </div>
      <div className="auth-card">
        <h1>Login</h1>
        <div className="input-box">
          <label htmlFor="userName">Username</label>
          <input
            type="text"
            id="userName"
            name="userName"
            placeholder="Enter your username"
            value={userName}
            onChange={handleChange}
          />
          {errors.userName && <p className="error-text">{errors.userName}</p>}
        </div>
        <div className="input-box">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={handleChange}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>
        <button className="auth-button login-button" onClick={handleLogin}>
          Login
        </button>
        {message && <p className="message-text">{message}</p>}
        <p className="auth-link">
          Don't have an account? <Link href="/signup">Sign Up</Link>
        </p>
      </div>
    </>
  );
};

export default Login;
