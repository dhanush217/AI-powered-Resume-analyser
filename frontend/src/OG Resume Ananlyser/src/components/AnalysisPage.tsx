import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as pdfjs from 'pdfjs-dist';

// Set the worker source for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const AnalysisPage = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const loadingTask = pdfjs.getDocument(arrayBuffer);
        const pdf = await loadingTask.promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(' ');
          text += pageText + '\n';
        }
        setResumeText(text);
      } catch (error) {
        console.error('Error parsing PDF:', error);
        setFeedback('Failed to parse the PDF. Please ensure it is a valid file.');
      }
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
  });

  const handleAnalyze = async () => {
    setLoading(true);
    setFeedback('');
    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: resumeText, jobDescription }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setFeedback('Sorry, something went wrong. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 animate-fade-in-down text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Analyze Your Resume
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Upload your resume and the job description to get instant feedback.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Resume</h2>
              <div
                {...getRootProps()}
                className={`flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors duration-300 ${
                  isDragActive
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-300 bg-gray-50 hover:border-indigo-400'
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-center">
                  <p className="text-lg font-semibold text-indigo-600">
                    Drag and drop your resume here
                  </p>
                  <p className="mt-1 text-sm text-gray-500">or click to select a file</p>
                  <p className="mt-2 text-xs text-gray-400">PDF files only</p>
                </div>
              </div>
              <textarea
                id="resume-text"
                rows={10}
                className="w-full rounded-xl border-2 border-gray-300 p-4 text-sm shadow-inner transition-shadow duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                placeholder="Your resume text will appear here after uploading..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Job Description</h2>
              <textarea
                id="job-description"
                rows={16}
                className="w-full rounded-xl border-2 border-gray-300 p-4 text-sm shadow-inner transition-shadow duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-center border-t-2 border-dashed border-gray-200 pt-8">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!resumeText || !jobDescription || loading}
              className="inline-flex transform items-center justify-center rounded-full bg-indigo-600 px-10 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                'Get Feedback'
              )}
            </button>
          </div>
          {feedback && (
            <div className="mt-8 animate-fade-in-up border-t-2 border-dashed border-gray-200 pt-8">
              <h3 className="text-center text-2xl font-bold text-gray-800">Analysis Results</h3>
              <div className="prose-md prose-indigo mx-auto mt-4 max-w-none rounded-xl bg-gray-50 p-6 shadow-inner">
                <p className="whitespace-pre-wrap text-gray-700">{feedback}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
