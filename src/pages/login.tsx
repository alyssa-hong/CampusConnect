import { useState } from 'react';
import { signIn } from 'next-auth/react'; // Import signIn from next-auth
import { useRouter } from 'next/router';
import Link from 'next/link';
import '../styles/Auth.css';

const Login = () => {
  const router = useRouter();

  // State for login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
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
      // Call signIn from next-auth to authenticate the user
      const response = await signIn('credentials', {
        email,
        password,
        redirect: false, // Prevent automatic redirection
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

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="title">Welcome back to Campus Connect!</h1>
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
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Display error message if login fails */}
          {error && <p className="error-text">{error}</p>}

          {/* Submit Button */}
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
  );
};

export default Login;
