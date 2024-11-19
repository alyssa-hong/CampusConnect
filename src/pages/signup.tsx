import React, {useState} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import '../styles/Auth.css';

interface SignupProps {
  setIsAuthorized: (auth: boolean) => void;
}

const Signup: React.FC<SignupProps> = ({ setIsAuthorized }) => {
  const router = useRouter();

    //const handleSignup = () => {
    //setIsAuthorized(true);
    //router.push('/home');

  //What the user has to fill out for the signup page
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sends error messages
  const [errors, setErrors] = useState<{ userName?: string; email?: string; password?: string }>({});

  // Validate a single field
  const validateField = (name: string, value: string) => {
    let error = '';

    if (name === 'userName') {
      if (!value) error = 'Username is required.';
    } else if (name === 'email') {
      if (!value) error = 'Email is required.';
      else if (!/\S+@\S+\.\S+/.test(value)) error = 'Please enter a valid email address.';
    } else if (name === 'password') {
      if (!value) error = 'Password is required.';
      else if (value.length < 6) error = 'Password must be at least 6 characters long.';
    }

    return error;
  };

  // Handle input changes with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the field value
    if (name === 'userName') setUserName(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);

    // Validate the field and update errors
    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSignup = () => {
    // Reset errors
    setErrors({});

    // Validate all fields
    const newErrors: { userName?: string; email?: string; password?: string } = {
      userName: validateField('userName', userName),
      email: validateField('email', email),
      password: validateField('password', password),
    };

    // If there are validation errors, set them and prevent form submission
    if (Object.values(newErrors).some((error) => error !== '')) {
      setErrors(newErrors);
      return;
    }

    // If validation passes, proceed
    setIsAuthorized(true);
    router.push('/home');
  };

  return (
    <>
      <div className="title">
        <h1>Welcome to Campus Connect!</h1>
      </div>
      <div className="auth-card">
        <h1>Sign Up</h1>
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
        <button className="auth-button signup-button" onClick={handleSignup}>
          Sign Up
        </button>
        <p className="auth-link">
          Already have an account?{' '}
          <Link href="/login">Login</Link>
        </p>
      </div>
    </>
  );
};

export default Signup;