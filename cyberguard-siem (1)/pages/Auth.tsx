
import React, { useState } from 'react';
import { ShieldCheckIcon } from '../components/icons';

interface AuthProps {
  onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd have API calls here.
    // We'll just call onLogin to simulate success.
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-grid-gray-700/[0.2]">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700">
        <div className="text-center">
            <div className="flex justify-center items-center gap-3">
                <ShieldCheckIcon className="h-10 w-10 text-blue-500"/>
                <h1 className="text-4xl font-bold text-gray-100">Cyberguard</h1>
            </div>
            <p className="mt-2 text-gray-400">Your Advanced SIEM Dashboard</p>
        </div>

        <div className="flex justify-center border-b border-gray-700">
          <button
            onClick={() => setIsLoginView(true)}
            className={`px-6 py-2 text-lg font-medium transition-colors duration-300 ${isLoginView ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLoginView(false)}
            className={`px-6 py-2 text-lg font-medium transition-colors duration-300 ${!isLoginView ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'}`}
          >
            Sign Up
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLoginView && (
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input id="username" name="username" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 bg-gray-900 placeholder-gray-500 text-gray-100 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Username" />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required className={`appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 bg-gray-900 placeholder-gray-500 text-gray-100 ${isLoginView ? 'rounded-t-md' : ''} focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`} placeholder="Email address" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className={`appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 bg-gray-900 placeholder-gray-500 text-gray-100 ${isLoginView ? 'rounded-b-md' : ''} focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`} placeholder="Password" />
            </div>
            {!isLoginView && (
                 <div>
                 <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                 <input id="confirm-password" name="confirm-password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 bg-gray-900 placeholder-gray-500 text-gray-100 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Confirm Password" />
               </div>
            )}
          </div>

          {isLoginView && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded bg-gray-700" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400"> Remember me </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-500 hover:text-blue-400"> Forgot your password? </a>
              </div>
            </div>
          )}

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 transition-colors">
              {isLoginView ? 'Sign in' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
