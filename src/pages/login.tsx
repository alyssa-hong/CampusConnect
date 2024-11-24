import { useState } from 'react';
import { signIn } from 'next-auth/react'; // Import signIn from next-auth
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../styles/Auth.css';

const Login = () => {
  const router = useRouter();

  // State for login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for toggling password visibility
  
  // State for handling error messages and loading state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error state
    setIsLoading(true);

    const credentials = { email, password };

    try {
      const response = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      // If the response contains an error, display the error message
      if (response?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        // If login is successful, redirect the user to the home page
        router.push('/home');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <div className="title">
        <h1>Welcome back to Campus Connect!</h1>
      </div>
      <div className="auth-container">
        <div className="auth-card">
          <h2>Login</h2>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="input-box">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="input-box">
              <label htmlFor="password">Password</label>
              <div className="password-container">
                <input
                  type={passwordVisible ? 'text' : 'password'} // Change input type based on visibility state
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                  aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                >
                  <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            {/* Display error message if login fails */}
            {error && <p className="error-text">{error}</p>}

            <button
              type="submit"
              className="auth-button login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Link to the signup page */}
          <p className="auth-link">
            Don't have an account?{' '}
            <Link href="/signup" className="signup-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
