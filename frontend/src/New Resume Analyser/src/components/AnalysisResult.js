import React from 'react';
import './AnalysisResult.css';

const AnalysisResult = ({ result }) => {
  const getStarRating = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="analysis-result">
      <h2>Resume Score</h2>
      {result.llmEnhanced && (
        <div className="llm-badge">
          AI Enhanced Analysis
        </div>
      )}
      {result.note && (
        <div className="analysis-note" style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          padding: '10px',
          margin: '10px 0',
          color: '#856404'
        }}>
          <strong>Note:</strong> {result.note}
        </div>
      )}
      <div className="score-circle">
        <span className="score">{result.score}%</span>
      </div>
      <div className="result-details">
        <div className="result-item">
          <span>Skill Match</span>
          <span>{result.skillMatch}</span>
        </div>
        <div className="result-item">
          <span>Action Verbs</span>
          <span className="stars">{getStarRating(result.actionVerbs)}</span>
        </div>
        <div className="result-item">
          <span>Readability</span>
          <span className="stars">{getStarRating(result.readability)}</span>
        </div>
        <div className="result-item">
          <span>Resume Percentile</span>
          <span>{result.resumePercentile}</span>
        </div>
      </div>

      {/* Display LLM-identified strengths if available */}
      {result.llmEnhanced && result.strengths && result.strengths.length > 0 && (
        <div className="llm-section">
          <h3>Resume Strengths</h3>
          <ul className="llm-list">
            {result.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display LLM-identified areas for improvement if available */}
      {result.llmEnhanced && result.improvements && result.improvements.length > 0 && (
        <div className="llm-section">
          <h3>Areas for Improvement</h3>
          <ul className="llm-list">
            {result.improvements.map((improvement, index) => (
              <li key={index}>{improvement}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display matched keywords if available */}
      {result.matchedKeywords && result.matchedKeywords.length > 0 && (
        <div className="keywords-section">
          <h3>Matched Keywords</h3>
          <div className="keywords-container">
            {result.matchedKeywords.map((keyword, index) => (
              <span key={index} className="keyword matched">{keyword}</span>
            ))}
          </div>
        </div>
      )}

      {/* Display missing keywords if available */}
      {result.missingKeywords && result.missingKeywords.length > 0 && (
        <div className="keywords-section">
          <h3>Missing Keywords</h3>
          <p className="missing-keywords-info">Consider adding these keywords to improve your score:</p>
          <div className="keywords-container">
            {result.missingKeywords.map((keyword, index) => (
              <span key={index} className="keyword missing">{keyword}</span>
            ))}
          </div>
        </div>
      )}

      {/* Display LLM-specific suggestions if available, otherwise show generic tips */}
      {result.llmEnhanced && result.suggestions && result.suggestions.length > 0 ? (
        <div className="improvement-tips">
          <h3>AI-Powered Suggestions to Improve Your Resume</h3>
          <ul>
            {result.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="improvement-tips">
          <h3>Tips to Improve Your Resume</h3>
          <ul>
            <li>Add missing keywords relevant to the job role</li>
            <li>Use more action verbs to describe your achievements</li>
            <li>Ensure your resume is easy to read with clear sections</li>
            <li>Tailor your resume specifically for each job application</li>
            <li>Quantify your achievements with numbers and metrics</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;
