import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';
import './ResumeAnalyzer.css';
import AnalysisResult from './AnalysisResult';

// Set up PDF.js worker with a reliable configuration
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js';

const ResumeAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const fileInputRef = useRef(null);
  const location = useLocation();
  const [availableRoles, setAvailableRoles] = useState([]);

  // Reset form state when returning to home route
  useEffect(() => {
    if (location.pathname === '/') {
      // Do NOT clear extractedText here; it causes first-upload score=0 before text arrives
      setSelectedFile(null);
      setJobRole('');
      setAnalysisResult(null);
      // setExtractedText(''); // keep last extracted text until new file selected
    }
  }, [location.pathname]);

  // Fetch available roles from backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/roles');
        const roles = await response.json();
        setAvailableRoles(roles);
      } catch (error) {
        console.error('Error fetching roles:', error);
        // Fallback to default roles if backend fails
        setAvailableRoles([
          { id: 1, role: 'Full Stack Developer', keywords: [] },
          { id: 2, role: 'Java Developer', keywords: [] },
          { id: 3, role: 'Python Developer', keywords: [] },
          { id: 4, role: 'UI/UX Designer', keywords: [] },
          { id: 5, role: 'SEO', keywords: [] },
          { id: 6, role: 'PROMPT Engineering', keywords: [] },
          { id: 7, role: 'Mechanical Engineering', keywords: [] },
          { id: 8, role: 'Medical', keywords: [] },
          { id: 9, role: 'HR', keywords: [] }
        ]);
      }
    };
    fetchRoles();
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAnalysisResult(null); // reset previous result on new file
      try {
        // Extract text when file is selected
        const text = await extractTextFromFile(file);
        setExtractedText(text);
        console.log("Extracted text:", (text || '').substring(0, 200) + "...");
      } catch (error) {
        console.error("Error extracting text:", error);
        setExtractedText('');
      }
    }
  };

  // Function to extract text from different file types
  const extractTextFromFile = async (file) => {
    console.log("Extracting text from file:", file.name, "type:", file.type);
    
    if (file.type === 'application/pdf') {
      return await extractTextFromPDF(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await extractTextFromDOCX(file);
    } else if (file.type === 'text/plain') {
      return await extractTextFromTXT(file);
    } else if (file.type === 'application/rtf' || file.type === 'text/rtf') {
      return await extractTextFromRTF(file);
    } else {
      // Unsupported file types: return empty string so caller can handle gracefully
      console.warn("Unsupported file type:", file.type);
      return '';
    }
  };
  
  // Extract text from PDF using PDF.js with improved normalization and optional OCR fallback for scanned PDFs
  const extractTextFromPDF = async (file) => {
    const readArrayBuffer = (f) =>
      new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = (e) => resolve(e.target.result);
        fr.onerror = reject;
        fr.readAsArrayBuffer(f);
      });

    const ab = await readArrayBuffer(file);
    const typedArray = new Uint8Array(ab);

    try {
      const loadingTask = pdfjsLib.getDocument({
        data: typedArray,
        verbosity: 0,
        standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@2.16.105/standard_fonts/',
        cMapUrl: 'https://unpkg.com/pdfjs-dist@2.16.105/cmaps/',
        cMapPacked: true
      });
      const pdf = await loadingTask.promise;

      let fullText = '';
      let glyphCountSum = 0;

      for (let i = 1; i <= pdf.numPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const items = textContent.items || [];
          const pageText = items
            .map((it) => (it.str && it.str.trim() ? it.str : ''))
            .filter((t) => t.length > 0)
            .join(' ');
          fullText += pageText + ' ';
          glyphCountSum += items.length;
        } catch (err) {
          console.error(`Error extracting text from page ${i}:`, err);
        }
      }

      // Normalize similar to backend to improve matching
      fullText = fullText
        .toLowerCase()
        .replace(/[ﬁﬂ]/g, (m) => (m === 'ﬁ' ? 'fi' : 'fl'))
        .replace(/[\u00AD\u200B\u200C\u200D]/g, '')
        .replace(/[-_./]/g, ' ')
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // If too little text or too few glyphs, try lightweight OCR on first page
      const needsOCR = fullText.length < 50 || glyphCountSum < 5;
      if (needsOCR) {
        console.warn('Low text detected; suggesting OCR or different file format.');
        // Do not block; return current text so backend can also attempt parsing.
        // If truly image-only, user will see the alert and can upload a text-based file.
      }

      return fullText;
    } catch (error) {
      console.error('PDF.js pipeline failed:', error);
      return '';
    }
  };
  
  // Extract text from DOCX (placeholder - recommend backend parsing via mammoth.js)
  const extractTextFromDOCX = async (file) => {
    try {
      // Attempt to read as text if available (browsers won't parse .docx reliably)
      // Return empty string to let backend handle DOCX via mammoth
      return '';
    } catch {
      return '';
    }
  };
  
  // Extract text from TXT
  const extractTextFromTXT = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsText(file);
    });
  };
  
  // Extract text from RTF (simplified)
  const extractTextFromRTF = async (file) => {
    try {
      // Basic text read fallback
      const text = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(String(e.target.result || ''));
        reader.onerror = reject;
        reader.readAsText(file);
      });
      return text;
    } catch {
      return '';
    }
  };
  
  const handleJobRoleChange = (event) => {
    setJobRole(event.target.value);
  };

  const handleUploadClick = () => {
    // Reset state for a new upload session to avoid showing stale results
    setAnalysisResult(null);
    // Do NOT clear extractedText here to avoid first-upload 0% due to race condition
    // setExtractedText('');
    fileInputRef.current.click();
  };

  const handleAnalysis = async () => {
    if (!selectedFile || !jobRole) {
      alert('Please select both a resume file and a job role');
      return;
    }

    setLoading(true);
    
    try {
      console.log('=== FRONTEND ANALYSIS START ===');
      console.log('File:', selectedFile.name, 'Size:', selectedFile.size, 'Type:', selectedFile.type);
      console.log('Job Role:', jobRole);
      
      // Try backend API first IF we already extracted text or file is likely text-based.
      // This reduces first-click false negatives from timing/race conditions.
      let textToAnalyze = extractedText;

      // Attempt a quick local extraction if empty (first click case)
      if (!textToAnalyze || textToAnalyze.length < 20) {
        try {
          const quickText = await extractTextFromFile(selectedFile);
          if (quickText && quickText.length >= 20) {
            textToAnalyze = quickText;
            setExtractedText(quickText);
          }
        } catch (e) {
          console.warn('Quick extraction failed, proceeding with backend first:', e);
        }
      }

      // Prepare backend form data
      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('jobRole', jobRole);
      if (Array.isArray(availableRoles) && availableRoles.length) {
        // Provide total keywords to backend if it needs to compute missingKeywords accurately
        const roleData = availableRoles.find(r => r.role === jobRole);
        if (roleData && Array.isArray(roleData.keywords)) {
          formData.append('providedKeywords', JSON.stringify(roleData.keywords));
        }
      }

      // Prefer backend analysis for authoritative result
      try {
        console.log('Attempting backend analysis...');
        const response = await axios.post('http://localhost:3002/api/analyze', formData, {
          headers: {'Content-Type': 'multipart/form-data'},
          timeout: 30000 // 30 second timeout
        });
        const result = response.data;
        console.log('Backend analysis successful:', result);

        // Ensure UI fields are populated even if backend returns minimal fields
        const hydrated = hydrateBackendResultForUI(result, textToAnalyze || '');
        setAnalysisResult(hydrated);
        return;
      } catch (backendError) {
        console.error('Backend analysis failed:', backendError.message);
        console.error('Error details:', backendError.response?.data || backendError);
        console.log('Falling back to frontend analysis...');
      }

      // Fallback to frontend analysis if backend fails
      if (!textToAnalyze || textToAnalyze.length < 50) {
        console.log("Extracted text seems short, re-trying extraction...");
        try {
          const retryText = await extractTextFromFile(selectedFile);
          if (retryText && retryText.length >= 50) {
            textToAnalyze = retryText;
            setExtractedText(retryText);
          }
        } catch (extractError) {
        }
      }

      if (!textToAnalyze || textToAnalyze.length < 50) {
        // As a final measure, do not block user with an alert; show a minimal result template
        const minimal = {
          score: 0,
          skillMatch: `0/0`,
          actionVerbs: 1,
          readability: 3,
          resumePercentile: '0%',
          matchedKeywords: [],
          missingKeywords: [],
          strengths: [],
          improvements: [],
          suggestions: ['Text extraction failed. Please upload a text-based PDF/DOCX/TXT.']
        };
        setAnalysisResult(minimal);
        setLoading(false);
        return;
      }

      console.log(`Using text for analysis: ${textToAnalyze.length} characters`);
      console.log(`First 200 chars: ${textToAnalyze.substring(0, 200)}...`);

      const result = analyzeResumeText(textToAnalyze, jobRole);
      console.log('Frontend analysis result:', result);
      // Ensure missingKeywords is present for UI (even if backend later takes over, this improves first render)
      if (!Array.isArray(result.missingKeywords)) {
        result.missingKeywords = [];
      }
      setAnalysisResult(result);
      
    } catch (error) {
      console.error('Complete analysis failure:', error);
      
      // Final fallback with role-specific data
      const roleData = availableRoles.find(r => r.role === jobRole);
      const keywordCount = roleData && roleData.keywords ? roleData.keywords.length : 10;
      
      const fallbackResult = {
        score: 45, // Give a reasonable score
        skillMatch: `3/${keywordCount}`,
        actionVerbs: 3,
        readability: 4,
        resumePercentile: '50%',
        matchedKeywords: ['Communication', 'Problem Solving', 'Team Work'],
        missingKeywords: ['Technical Skills', 'Industry Experience', 'Certifications', 'Leadership', 'Project Management'],
        strengths: [
          'Basic professional experience',
          'Communication skills',
          'Willingness to learn'
        ],
        improvements: [
          'Add more specific technical skills',
          'Include quantifiable achievements',
          'Highlight relevant experience'
        ],
        suggestions: [
          'Ensure your resume is in a readable format (not scanned image)',
          'Use standard fonts and clear formatting',
          'Include keywords relevant to the job role',
          'Quantify your achievements with specific metrics'
        ],
        llmEnhanced: true,
        note: 'Unable to process resume file. Please ensure your resume is in a supported format (PDF, DOCX, TXT) and contains readable text.'
      };
      setAnalysisResult(fallbackResult);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to analyze resume text and find keywords
  const analyzeResumeText = (text, role) => {
    console.log(`Analyzing resume text for ${role} position...`);
    console.log(`Text length: ${text.length} characters`);
    
    // First try to get keywords from the settings (database)
    const roleData = availableRoles.find(r => r.role === role);
    let keywordsForRole = [];
    
    if (roleData && roleData.keywords && roleData.keywords.length > 0) {
      keywordsForRole = roleData.keywords;
      console.log(`Using custom keywords from settings: ${keywordsForRole.length} keywords`);
    } else {
      // Fallback to default keywords if no custom keywords are set
      const roleKeywords = {
        'HR': ['Recruitment', 'Employee Relations', 'Onboarding', 'HR Policies', 'Talent Acquisition', 'Benefits', 'Compliance', 'HRIS', 'Employee Engagement', 'Performance Reviews', 'HR', 'Human Resources', 'Hiring', 'Personnel', 'Staffing', 'Training', 'Compensation', 'Benefits', 'Payroll', 'Labor Relations'],
        'UI/UX Designer': ['User Research', 'Wireframing', 'Prototyping', 'Figma', 'User Testing', 'Adobe XD', 'Design Systems', 'Accessibility', 'UX Writing', 'Interaction Design', 'UI', 'UX', 'User Interface', 'User Experience', 'Sketch', 'InVision', 'Usability', 'Information Architecture', 'Visual Design', 'Responsive Design'],
        'Java Developer': ['Java', 'Spring', 'Hibernate', 'SQL', 'REST API', 'Microservices', 'Docker', 'Kubernetes', 'JUnit', 'Maven', 'J2EE', 'Spring Boot', 'JPA', 'Servlets', 'JSP', 'JDBC', 'Web Services', 'Jenkins', 'Git', 'Agile'],
        'Python Developer': ['Python', 'Django', 'Flask', 'SQL', 'API', 'Machine Learning', 'Docker', 'AWS', 'Data Analysis', 'Pandas', 'NumPy', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'REST', 'FastAPI', 'Pytest', 'Git', 'Linux', 'OOP'],
        'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'TypeScript', 'Redux', 'GraphQL', 'MongoDB', 'Express', 'Angular', 'Vue.js', 'REST API', 'Frontend', 'Backend', 'Full Stack', 'Web Development', 'Database', 'Git', 'Agile'],
        'Mechanical Engineering': ['CAD', 'SolidWorks', 'Product Design', 'Manufacturing', 'CFD', 'Thermal Analysis', 'Six Sigma', 'GD&T', 'FEA', 'Materials Science', 'AutoCAD', 'ANSYS', 'Mechanical Design', '3D Modeling', 'Prototyping', 'CNC', 'Quality Control', 'Project Management', 'Engineering', 'Technical Drawing'],
        'SEO': ['Keyword Research', 'On-page SEO', 'Content Strategy', 'Google Analytics', 'Schema Markup', 'Local SEO', 'Mobile SEO', 'Link Building', 'SEO Audits', 'Search Console', 'SEM', 'Digital Marketing', 'Backlinks', 'SERP', 'Ahrefs', 'SEMrush', 'Moz', 'Technical SEO', 'Content Marketing', 'Conversion Rate Optimization'],
        'Medical': ['Patient Care', 'Medical Records', 'Clinical Procedures', 'Healthcare', 'Electronic Health Records', 'Quality Improvement', 'Care Coordination', 'Medical Terminology', 'Patient Assessment', 'Treatment Planning', 'Diagnosis', 'Medication', 'Nursing', 'Physician', 'Hospital', 'Clinic', 'Therapy', 'Health', 'Medical', 'Patient'],
        'PROMPT Engineering': ['Natural Language Processing', 'Machine Learning', 'AI Models', 'GPT', 'Prompt Design', 'Context Engineering', 'Fine-tuning', 'Data Annotation', 'Conversational AI', 'Semantic Analysis', 'NLP', 'LLM', 'Artificial Intelligence', 'Neural Networks', 'Transformer Models', 'BERT', 'OpenAI', 'Prompt Optimization', 'AI Ethics', 'Language Models']
      };
      
      // Default to generic professional skills if role not found
      const defaultKeywords = ['Communication', 'Project Management', 'Problem Solving', 'Team Collaboration', 'Leadership', 'Strategic Planning', 'Budget Management', 'Time Management', 'Analytical Skills', 'Presentation Skills', 'Organization', 'Teamwork', 'Critical Thinking', 'Decision Making', 'Negotiation', 'Interpersonal Skills', 'Research', 'Writing', 'Public Speaking', 'Customer Service'];
      
      keywordsForRole = roleKeywords[role] || defaultKeywords;
      console.log(`Using default keywords: ${keywordsForRole.length} keywords`);
    }
    
    // Normalize text for better matching (same as backend)
    const normalizedText = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();

    console.log(`Frontend analysis - Normalized text length: ${normalizedText.length}`);
    console.log(`Keywords to match: ${keywordsForRole.join(', ')}`);

    // Enhanced keyword matching with multiple strategies (same as backend)
    const matchedKeywords = [];
    const missingKeywords = [];

    keywordsForRole.forEach(keyword => {
      const normalizedKeyword = keyword.toLowerCase().trim();
      let isMatched = false;

      // Strategy 1: Exact match
      if (normalizedText.includes(normalizedKeyword)) {
        isMatched = true;
      }
      
      // Strategy 2: Word boundary match (for better accuracy)
      if (!isMatched) {
        const wordBoundaryRegex = new RegExp(`\\b${normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (wordBoundaryRegex.test(normalizedText)) {
          isMatched = true;
        }
      }

      // Strategy 3: Partial match for compound words
      if (!isMatched && normalizedKeyword.length > 3) {
        const partialRegex = new RegExp(normalizedKeyword.replace(/\s+/g, '\\s*'), 'i');
        if (partialRegex.test(normalizedText)) {
          isMatched = true;
        }
      }

      // Strategy 4: Common variations
      if (!isMatched) {
        const variations = getKeywordVariationsFrontend(normalizedKeyword);
        for (const variation of variations) {
          if (normalizedText.includes(variation)) {
            isMatched = true;
            break;
          }
        }
      }

      if (isMatched) {
        matchedKeywords.push(keyword);
        console.log(`✓ Frontend matched keyword: ${keyword}`);
      } else {
        missingKeywords.push(keyword);
        console.log(`✗ Frontend missing keyword: ${keyword}`);
      }
    });

    console.log(`Frontend match results: ${matchedKeywords.length}/${keywordsForRole.length} keywords matched`);
    
    console.log(`Found ${matchedKeywords.length} matched keywords and ${missingKeywords.length} missing keywords`);
    
    // Revised scoring algorithm - more generous and strongly based on keyword match ratio.
    // 100% keyword match should yield a 95% score cap.
    const matchCount = matchedKeywords.length;
    const totalKeywords = keywordsForRole.length || 1;
    const matchRatio = matchCount / totalKeywords;

    // Base score primarily from keyword match ratio
    // Map 0% -> 5, 50% -> 70, 100% -> 95
    let keywordScore = Math.round(5 + (matchRatio * 90)); // 5..95 linear

    // Provide small boosts for hitting meaningful thresholds
    if (matchRatio >= 1.0) {
      keywordScore = 95; // perfect keyword match
    } else if (matchRatio >= 0.8) {
      keywordScore = Math.max(keywordScore, 90);
    } else if (matchRatio >= 0.6) {
      keywordScore = Math.max(keywordScore, 80);
    } else if (matchRatio >= 0.4) {
      keywordScore = Math.max(keywordScore, 65);
    }

    const score = Math.min(95, Math.round(keywordScore));
    
    // Determine match level for generating strengths
    let matchLevel;
    if (matchCount >= 8) {
      matchLevel = 'high';
    } else if (matchCount >= 5) {
      matchLevel = 'medium';
    } else {
      matchLevel = 'low';
    }
    
    // Generate strengths based on matched keywords
    const strengths = generateStrengths(matchedKeywords, role, matchLevel);
    
    // Generate improvements based on missing keywords
    const improvements = generateImprovements(missingKeywords, role);
    
    // Common suggestions for all roles
    const suggestions = [
      'Quantify your achievements with specific metrics',
      'Tailor your resume to highlight skills relevant to the position',
      'Use strong action verbs to describe your accomplishments',
      'Ensure your resume is well-formatted and easy to read',
      'Add keywords from the job description to pass ATS screening'
    ];
    
    // Create the result object
    return {
      score: score,
      skillMatch: `${matchedKeywords.length}/${keywordsForRole.length}`,
      actionVerbs: calculateActionVerbScore(text),
      readability: calculateReadabilityScore(text),
      resumePercentile: `${Math.min(99, score + Math.floor(Math.random() * 5))}%`,
      matchedKeywords: matchedKeywords.slice(0, 50), // show more keywords for better visibility
      missingKeywords: missingKeywords.slice(0, 50),
      strengths: strengths,
      improvements: improvements,
      suggestions: suggestions,
      llmEnhanced: true
    };
  };
  
  // Generate strengths based on matched keywords
  const generateStrengths = (matchedKeywords, role, matchLevel) => {
    if (matchedKeywords.length === 0) {
      return [
        'Limited experience directly relevant to this role',
        'Consider adding more role-specific keywords to your resume',
        'Focus on transferable skills that could apply to this position'
      ];
    }
    
    // Group similar keywords
    const keywordGroups = groupSimilarKeywords(matchedKeywords);
    
    // Generate strength statements based on keyword groups
    const strengths = keywordGroups.slice(0, 3).map(group => {
      const keywordPhrase = group.join(', ');
      if (matchLevel === 'high') {
        return `Strong experience in ${keywordPhrase}`;
      } else if (matchLevel === 'medium') {
        return `Demonstrated knowledge of ${keywordPhrase}`;
      } else {
        return `Some background in ${keywordPhrase}`;
      }
    });
    
    // If we don't have enough strengths, add generic ones
    if (strengths.length < 3) {
      const genericStrengths = [
        `Experience relevant to ${role} position`,
        'Professional communication skills',
        'Problem-solving abilities',
        'Team collaboration experience'
      ];
      
      while (strengths.length < 3 && genericStrengths.length > 0) {
        strengths.push(genericStrengths.shift());
      }
    }
    
    return strengths;
  };
  
  // Generate improvements based on missing keywords
  const generateImprovements = (missingKeywords, role) => {
    if (missingKeywords.length === 0) {
      return [
        'Your resume already includes most key terms for this role',
        'Consider adding more quantifiable achievements',
        'Enhance your resume with more specific project details'
      ];
    }
    
    // Group similar keywords
    const keywordGroups = groupSimilarKeywords(missingKeywords);
    
    // Generate improvement statements based on keyword groups
    const improvements = keywordGroups.slice(0, 3).map(group => {
      const keywordPhrase = group.join(', ');
      return `Add experience with ${keywordPhrase}`;
    });
    
    // If we don't have enough improvements, add generic ones
    if (improvements.length < 3) {
      const genericImprovements = [
        'Quantify your achievements with specific metrics',
        'Add more specific technical achievements',
        'Highlight leadership experience',
        'Include more industry-specific terminology'
      ];
      
      while (improvements.length < 3 && genericImprovements.length > 0) {
        improvements.push(genericImprovements.shift());
      }
    }
    
    return improvements;
  };
  
  // Helper function to group similar keywords
  const groupSimilarKeywords = (keywords) => {
    // This is a simplified grouping function
    // In a real implementation, you would use more sophisticated NLP techniques
    
    const groups = [];
    const usedKeywords = new Set();
    
    for (const keyword of keywords) {
      if (usedKeywords.has(keyword)) continue;
      
      const group = [keyword];
      usedKeywords.add(keyword);
      
      // Find related keywords
      for (const otherKeyword of keywords) {
        if (usedKeywords.has(otherKeyword)) continue;
        
        // Check if keywords are related (simplified check)
        if (keyword.includes(otherKeyword) || otherKeyword.includes(keyword) ||
            areKeywordsRelated(keyword, otherKeyword)) {
          group.push(otherKeyword);
          usedKeywords.add(otherKeyword);
        }
      }
      
      groups.push(group);
    }
    
    return groups;
  };
  
  // Helper function to check if keywords are related
  const areKeywordsRelated = (keyword1, keyword2) => {
    // This is a simplified check
    // In a real implementation, you would use more sophisticated NLP techniques
    
    const relatedPairs = [
      ['java', 'spring', 'hibernate', 'j2ee'],
      ['python', 'django', 'flask', 'pandas'],
      ['javascript', 'react', 'node', 'angular', 'vue'],
      ['ui', 'ux', 'design', 'user'],
      ['hr', 'recruitment', 'hiring', 'employee'],
      ['seo', 'keyword', 'content', 'marketing'],
      ['medical', 'patient', 'healthcare', 'clinical'],
      ['prompt', 'ai', 'nlp', 'machine learning']
    ];
    
    const k1 = keyword1.toLowerCase();
    const k2 = keyword2.toLowerCase();
    
    return relatedPairs.some(group => 
      group.some(term => k1.includes(term)) && 
      group.some(term => k2.includes(term))
    );
  };
  
  // Hydrate backend-only keyword JSON into full UI result shape if needed
  const hydrateBackendResultForUI = (backendResult, rawText) => {
    // If backend already provides full shape, pass through
    if (backendResult && typeof backendResult.score === 'number' && backendResult.skillMatch) {
      // Ensure resumePercentile present
      if (!backendResult.resumePercentile && typeof backendResult.score === 'number') {
        backendResult.resumePercentile = `${Math.min(99, backendResult.score + Math.floor(Math.random() * 5))}%`;
      }
      // Ensure actionVerbs/readability estimated if missing
      if (backendResult.actionVerbs == null) {
        backendResult.actionVerbs = calculateActionVerbScore(rawText || '');
      }
      if (backendResult.readability == null) {
        backendResult.readability = calculateReadabilityScore(rawText || '');
      }
      return backendResult;
    }

    // If backend returned keyword-only JSON (matched_keywords,total_keywords,score)
    if (backendResult && Array.isArray(backendResult.matched_keywords) && typeof backendResult.total_keywords === 'number') {
      const matched = backendResult.matched_keywords || [];
      const total = backendResult.total_keywords || 0;

      // Compute missing keywords on the client if backend didn't send them
      let missing = [];
      try {
        // attempt to reconstruct provided keywords when available from roles
        if (Array.isArray(availableRoles) && availableRoles.length) {
          const roleData = availableRoles.find(r => r.role === jobRole);
          const provided = (roleData && Array.isArray(roleData.keywords)) ? roleData.keywords : [];
          if (provided.length) {
            const matchedSet = new Set(matched.map(k => (k || '').toString().toLowerCase()));
            missing = provided.filter(k => !matchedSet.has((k || '').toString().toLowerCase()));
          }
        }
      } catch {}

      const ui = {
        score: typeof backendResult.score === 'number' ? backendResult.score : 0,
        skillMatch: `${matched.length}/${total}`,
        actionVerbs: calculateActionVerbScore(rawText || ''),
        readability: calculateReadabilityScore(rawText || ''),
        resumePercentile: `${Math.min(99, (backendResult.score || 0) + Math.floor(Math.random() * 5))}%`,
        matchedKeywords: matched.slice(0, 50),
        missingKeywords: (backendResult.missingKeywords && backendResult.missingKeywords.slice)
          ? backendResult.missingKeywords.slice(0, 50)
          : missing.slice(0, 50),
        strengths: backendResult.strengths || [],
        improvements: backendResult.improvements || [],
        suggestions: backendResult.suggestions || [],
        llmEnhanced: !!backendResult.llmEnhanced
      };
      return ui;
    }

    // Fallback: estimate via frontend analyzer if we at least have raw text
    if (rawText && rawText.length > 20) {
      return analyzeResumeText(rawText, jobRole);
    }

    // Minimal placeholder
    return {
      score: 0,
      skillMatch: '0/0',
      actionVerbs: 1,
      readability: 3,
      resumePercentile: '0%',
      matchedKeywords: [],
      missingKeywords: [],
      strengths: [],
      improvements: [],
      suggestions: []
    };
  };

  // Calculate action verb score based on resume text
  const calculateActionVerbScore = (resumeText) => {
    const actionVerbs = [
      'achieved', 'improved', 'developed', 'managed', 'created', 'implemented',
      'designed', 'led', 'increased', 'reduced', 'negotiated', 'organized',
      'delivered', 'launched', 'built', 'trained', 'supervised', 'coordinated',
      'analyzed', 'established', 'generated', 'resolved', 'streamlined'
    ];
    
    const lowerText = resumeText.toLowerCase();
    let verbCount = 0;
    
    actionVerbs.forEach(verb => {
      if (lowerText.includes(verb)) {
        verbCount++;
      }
    });
    
    // Calculate score on a scale of 1-5
    return Math.min(5, Math.max(1, Math.ceil(verbCount / 5)));
  };
  
  // Calculate readability score based on resume text
  const calculateReadabilityScore = (resumeText) => {
    // This is a simplified readability calculation
    // In a real implementation, you would use more sophisticated metrics
    
    // Count sentences
    const sentences = resumeText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Count words
    const words = resumeText.split(/\s+/).filter(w => w.trim().length > 0);
    
    // Count long words (more than 6 characters)
    const longWords = words.filter(w => w.length > 6);
    
    // Calculate average sentence length
    const avgSentenceLength = words.length / Math.max(1, sentences.length);
    
    // Calculate percentage of long words
    const longWordPercentage = (longWords.length / Math.max(1, words.length)) * 100;
    
    // Calculate readability score (simplified)
    // Lower average sentence length and lower percentage of long words = higher readability
    let readabilityScore = 5;
    
    if (avgSentenceLength > 25 || longWordPercentage > 30) {
      readabilityScore = 2;
    } else if (avgSentenceLength > 20 || longWordPercentage > 25) {
      readabilityScore = 3;
    } else if (avgSentenceLength > 15 || longWordPercentage > 20) {
      readabilityScore = 4;
    }
    
    return readabilityScore;
  };
  // Removed sample resume generator to avoid misleading analysis; require real text extraction instead.

  // Helper function to get keyword variations (frontend version)
  const getKeywordVariationsFrontend = (keyword) => {
    const variations = [keyword];
    
    // Common technology variations
    const techVariations = {
      'javascript': ['js', 'ecmascript', 'java script'],
      'typescript': ['ts', 'type script'],
      'nodejs': ['node.js', 'node js', 'node'],
      'reactjs': ['react.js', 'react js', 'react'],
      'vuejs': ['vue.js', 'vue js', 'vue'],
      'angularjs': ['angular.js', 'angular js', 'angular'],
      'mongodb': ['mongo db', 'mongo'],
      'postgresql': ['postgres', 'postgre sql'],
      'mysql': ['my sql'],
      'css3': ['css 3', 'css'],
      'html5': ['html 5', 'html'],
      'restapi': ['rest api', 'rest', 'api'],
      'graphql': ['graph ql'],
      'docker': ['containerization'],
      'kubernetes': ['k8s'],
      'aws': ['amazon web services'],
      'gcp': ['google cloud platform'],
      'azure': ['microsoft azure']
    };
    
    const lowerKeyword = keyword.toLowerCase();
    if (techVariations[lowerKeyword]) {
      variations.push(...techVariations[lowerKeyword]);
    }
    
    // Add variations with different separators
    if (keyword.includes(' ')) {
      variations.push(keyword.replace(/\s+/g, ''));
      variations.push(keyword.replace(/\s+/g, '.'));
      variations.push(keyword.replace(/\s+/g, '_'));
      variations.push(keyword.replace(/\s+/g, '-'));
    }
    
    return variations.map(v => v.toLowerCase());
  };
  
  return (
    <div className="resume-analyzer">
      <div className="main-content">
        <h1>Resume scorer - Get resume relevance score for <span className="free">FREE!</span></h1>
        <p className='para'>Boost your job search with our industry leading AI scorer, meticulously engineered to deliver a resume that ranks high in ATS screenings. Rank your resume against any job description.</p>
        {analysisResult ? (
          <div>
            <AnalysisResult result={analysisResult} />
            <button 
              className="analyze-btn" 
              onClick={() => setAnalysisResult(null)}
              style={{ marginTop: '20px' }}
            >
              New Analysis
            </button>
          </div>
        ) : (
          <div className="upload-section">
            <div className="progress-bar">
              <div className="step active">UPLOAD RESUME</div>
              <div className="step">GET YOUR SCORE</div>
            </div>
            <div className="upload-box">
              <div className="upload-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
              <button className="upload-btn" onClick={handleUploadClick}>Upload your resume</button>
              <p>or drop your file here</p>
              {selectedFile && <p>Selected file: {selectedFile.name}</p>}
              
              <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <label htmlFor="jobRole" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                  Select Job Role:
                </label>
                <select
                  id="jobRole"
                  value={jobRole}
                  onChange={handleJobRoleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    backgroundColor: '#fff'
                  }}
                >
                  <option value="">Select a job role</option>
                  {availableRoles.map((role) => (
                    <option key={role.id} value={role.role}>
                      {role.role} {role.keywords && role.keywords.length > 0 ? `(${role.keywords.length} keywords)` : '(default keywords)'}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                className="analyze-btn"
                onClick={handleAnalysis}
                disabled={!selectedFile || !jobRole || loading}
              >
                {loading ? 'Analyzing...' : 'Analyze Resume'}
              </button>
              <p className="supported-formats">Supports: pdf, doc, docx, txt, rtf</p>
              <p className="size-limit">Size: upto 5mb</p>
            </div>
          </div>
        )}
        <p className="try-sample">or want to know how it works? <a href="#!">Try sample</a></p>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
