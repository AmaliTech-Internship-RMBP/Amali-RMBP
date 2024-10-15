import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import rmbpLogo from '../assets/logo.svg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://16.171.19.134:8000/api/signin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      navigate('/chat');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google Sign-In clicked');
  };

  return (
    <div className="flex bg-gradient-to-tr from-othergreen via-olive to-olive flex-col items-center justify-center min-h-screen bg-gray-700 p-4" >
      <div className="flex flex-col items-center mb-8">
        <img src={rmbpLogo} alt="rmbpLogo" className="h-16" />
        <p className="text-[#fff] text-center mt-2">Access to generative AI in your local language</p>
      </div>
      
      <div className="w-[350px] bg-[#fff] rounded-lg shadow-lg">
        <h2 className="text-2xl  rounded border-b shadow shadow-olive py-3 font-bold text-center text-olive mb-6">LOGIN</h2>
        <form onSubmit={handleSubmit} className="space-y-4 p-3 w-full">
          <div>
            <label htmlFor="username" className="block text-md font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-md font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              placeholder="Enter password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center bg-olive text-[#fff] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-teal-600 hover:bg-[#fff] hover:text-olive focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account? <a href="/signup" className="underline font-medium ">Sign up</a>
        </p>

        <div className="mt-3">
          <div className="relative">
                    <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-teal-100 text-gray-500">OR</span>
            </div>
          </div>
          <button
            onClick={handleGoogleSignIn}
            className="mb-6 mx-auto mt-4 flex justify-center items-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <img src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" alt="Google logo" className="w-5 h-5 mr-2" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;