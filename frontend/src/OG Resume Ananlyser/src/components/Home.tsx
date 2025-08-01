import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center">
      <div className="animate-fade-in-down">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
          Welcome to the <span className="text-indigo-600">Resume Analyzer</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl md:text-2xl">
          Effortlessly improve your resume with AI-powered analysis and suggestions.
        </p>
      </div>
      <div className="mt-10 animate-fade-in-up">
        <Link
          to="/analyze"
          className="transform rounded-full bg-indigo-600 px-8 py-4 text-lg font-medium text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
        >
          Analyze Your Resume
        </Link>
      </div>
    </div>
  );
};

export default Home;
