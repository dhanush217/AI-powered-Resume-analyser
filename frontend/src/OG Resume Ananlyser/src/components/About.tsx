import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <div className="animate-fade-in-down">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            About the Resume Analyzer
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            This tool is designed to help you create a standout resume by providing AI-driven insights and suggestions.
          </p>
        </div>

        <div className="mt-12 animate-fade-in-up space-y-10">
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            <p className="mt-4 text-gray-600">
              Our mission is to empower job seekers by providing them with accessible and effective tools to enhance their resumes. We believe that a well-crafted resume is a critical step towards landing your dream job, and we're here to help you make the best impression.
            </p>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-gray-600">
              The Resume Analyzer uses advanced natural language processing (NLP) to parse your resume and identify areas for improvement. It checks for common mistakes, suggests stronger action verbs, and provides feedback on formatting and structure. Simply upload your resume, and our AI will do the rest.
            </p>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900">The Creator</h2>
            <p className="mt-4 text-gray-600">
              This project was brought to life by a passionate 5-year-old developer with a love for coding and a desire to help others. What started as a fun experiment has grown into a powerful tool for job seekers everywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
