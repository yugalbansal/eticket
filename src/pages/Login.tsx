import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Wallet, UserCog, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { connectMetaMask } from '../utils/web3';
import { useAuthStore, validateAdminPassword, validateOrganizerPassword } from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleAuth, setShowRoleAuth] = useState<'admin' | 'organizer' | null>(null);
  const [rolePassword, setRolePassword] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (email && password) {
        const mockUser = {
          id: '1',
          email: email,
          name: email.split('@')[0],
          role: 'user',
          tickets: []
        };
        
        login(mockUser);
        toast.success(`Welcome back, ${mockUser.name}!`);
        navigate('/dashboard');
      } else {
        throw new Error('Please enter both email and password');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetaMaskLogin = async () => {
    try {
      const address = await connectMetaMask();
      login({ 
        id: address, 
        address, 
        name: `${address.slice(0, 6)}...${address.slice(-4)}`,
        role: 'user',
        tickets: []
      });
      toast.success('Connected with MetaMask!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  const handleRoleAuth = (role: 'admin' | 'organizer') => {
    setShowRoleAuth(role);
    setRolePassword('');
  };

  const handleRoleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showRoleAuth === 'admin' && validateAdminPassword(rolePassword)) {
      login({
        id: 'admin',
        name: 'Admin User',
        role: 'admin',
        tickets: []
      });
      navigate('/admin');
    } else if (showRoleAuth === 'organizer' && validateOrganizerPassword(rolePassword)) {
      login({
        id: 'organizer',
        name: 'Event Organizer',
        role: 'organizer',
        tickets: []
      });
      navigate('/organizer');
    } else {
      toast.error('Invalid password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to access your account</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
          {showRoleAuth ? (
            <form onSubmit={handleRoleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enter {showRoleAuth === 'admin' ? 'Admin' : 'Organizer'} Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={rolePassword}
                    onChange={(e) => setRolePassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setShowRoleAuth(null)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back
                </button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleEmailLogin} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Signing in...' : 'Sign in with Email'}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <button
                    onClick={handleMetaMaskLogin}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Wallet className="h-5 w-5 mr-2" />
                    Connect with MetaMask
                  </button>
                  
                  <button
                    onClick={() => handleRoleAuth('admin')}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <UserCog className="h-5 w-5 mr-2" />
                    Login as Admin
                  </button>
                  
                  <button
                    onClick={() => handleRoleAuth('organizer')}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Login as Organizer
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => navigate('/signup')}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;