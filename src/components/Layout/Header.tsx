import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Camera, LogOut, User } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import type { RootState, AppDispatch } from '../../store';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-neutral-50 shadow-md fixed top-0 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Camera className="h-8 w-8 text-blue-500" />
            <span className="ml-2 text-xl font-bold">
              Instant<span className="text-blue-500">Photo</span>Gallery
            </span>
          </div>

          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="" />
                <span className="">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className=""
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};