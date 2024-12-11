import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, User, Camera } from 'lucide-react';

import { login } from '../../store/slices/authSlice';
import type { RootState } from '../../store';
import type { AppDispatch } from '../../store';
import TextInput from '../TextInput';
import StyledButton from '../StyledButton';
import ActionContainer from '../ActionContainer';
import GradientDivider from '../GradientDivider';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { error, isLoading } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login({ username, password })).unwrap();
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by Redux
    }
  };

  return (
    <div className="bg-login min-h-screen flex justify-center items-center">
        <ActionContainer>
          <p className="text-center font-bold text-lg mb-4">
            Login
          </p>
          <form onSubmit={handleSubmit}>
            <TextInput 
            className="mb-4"
              label='Username'
              id="username"
              name="username"
              type="text"
              icon='User'
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
            <TextInput 
              label='Password'
              id="password"
              name="password"
              type="password"
              required
              icon='Lock'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            {error && (
              <div className="rounded-md bg-red-100 p-4">
                  <h3 className="text-sm font-medium text-red-800">
                    {error}
                  </h3>
              </div>
            )}
            {/* <GradientDivider className="-mx-8" /> */}
            <StyledButton
              as="button"
              type="submit"
              variant="default"
              size="lg"
              disabled={isLoading}
              className="w-full mt-6"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </StyledButton>
            
          </form>
        </ActionContainer>

    </div>
  );
};