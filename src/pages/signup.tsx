import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import '../styles/Auth.css';

interface SignupProps {
  setIsAuthorized: (auth: boolean) => void;
}

const Signup: React.FC<SignupProps> = ({ setIsAuthorized }) => {
  const router = useRouter();

  // State for signup inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for errors and messages
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    userName?: string;
    email?: string;
    password?: string;
  }>({});
  const [message, setMessage] = useState('');

  // General field validation function
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
      case 'userName':
        return value ? '' : `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
      case 'email':
        return value
          ? /\S+@\S+\.\S+/.test(value)
            ? ''
            : 'Please enter a valid email address.'
          : 'Email is required.';
      case 'password':
        return value
          ? value.length < 6
            ? 'Password must be at least 6 characters long.'
            : ''
          : 'Password is required.';
      default:
        return '';
    }
  };

  // Handle input changes with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the field value
    if (name === 'firstName') setFirstName(value);
    if (name === 'lastName') setLastName(value);
    if (name === 'userName') setUserName(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);

    // Validate the field and update errors
    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  // Handle form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
  
    const newErrors = {
      firstName: validateField('firstName', firstName),
      lastName: validateField('lastName', lastName),
      userName: validateField('userName', userName),
      email: validateField('email', email),
      password: validateField('password', password),
    };
  
    if (Object.values(newErrors).some((error) => error !== '')) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, userName, email, password }),
      });
  
      const data = await res.json();
      console.log(data); // Add this for debugging
  
      if (res.ok) {
        setIsAuthorized(true);
        router.push('/login'); // Redirect to home
      } else {
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('An error occurred. Please try again.');
    }
  };
  

  return (
    <>
      <div className="auth-card">
      <div className="title">
        <h1>Welcome to Campus Connect!</h1>
      </div>
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="input-box">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter your first name"
              value={firstName}
              onChange={handleChange}
            />
            {errors.firstName && <p className="error-text">{errors.firstName}</p>}
          </div>
          <div className="input-box">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
              value={lastName}
              onChange={handleChange}
            />
            {errors.lastName && <p className="error-text">{errors.lastName}</p>}
          </div>
          <div className="input-box">
            <label htmlFor="userName">Username</label>
            <input
              type="text"
              id="userName"
              name="userName"
              placeholder="Choose a username"
              value={userName}
              onChange={handleChange}
            />
            {errors.userName && <p className="error-text">{errors.userName}</p>}
          </div>
          <div className="input-box">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className="input-box">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Choose a password"
              value={password}
              onChange={handleChange}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
          <button className="auth-button signup-button" type="submit">
            Sign Up
          </button>
        </form>
        {message && <p className="message-text">{message}</p>}
        <p className="auth-link">
          Already have an account?{' '}
          <Link href="/login">Login</Link>
        </p>
      </div>
    </>
  );
};

export default Signup;
