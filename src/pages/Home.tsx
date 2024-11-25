import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Shield, Zap } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="relative overflow-hidden">
        <div className="relative pt-6 pb-16 sm:pb-24">
          <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Share Your Moments</span>
                <span className="block text-indigo-600">With Facial Recognition</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Upload, organize, and share your photos with advanced facial recognition technology.
                Keep your memories safe and easily accessible.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-24">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div className="text-center">
                  <div className="flex justify-center">
                    <Camera className="h-12 w-12 text-indigo-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Smart Organization
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Automatically organize your photos with AI-powered facial recognition
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center">
                    <Zap className="h-12 w-12 text-indigo-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Lightning Fast
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Upload and process your photos with incredible speed
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center">
                    <Shield className="h-12 w-12 text-indigo-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Secure Storage
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Your photos are encrypted and stored safely
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};