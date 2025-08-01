const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

// Initialize database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT UNIQUE,
    keywords TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});
const path = require('path');
const dotenv = require('dotenv');
const RoleKeywords = require('./models/RoleKeywords');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

// Initialize Google Generative AI
const googleApiKey = process.env.GOOGLE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(googleApiKey);

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to extract text from PDF
const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return '';
  }
};

// Helper function to extract text from DOCX
const extractTextFromDOCX = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    return '';
  }
};

// Helper function to extract text from TXT
const extractTextFromTXT = (buffer) => {
  return buffer.toString('utf8');
};

// Helper function to extract text based on file type
const extractText = async (file) => {
  const fileExtension = file.originalname.split('.').pop().toLowerCase();
  
  switch (fileExtension) {
    case 'pdf':
      return await extractTextFromPDF(file.buffer);
    case 'docx':
      return await extractTextFromDOCX(file.buffer);
    case 'txt':
    case 'rtf':
      return extractTextFromTXT(file.buffer);
    default:
      throw new Error('Unsupported file format');
  }
};

// Helper function to generate a prompt for the LLM
const generateLLMPrompt = (text, jobRole, keywords) => {
  return `
You are an expert ATS (Applicant Tracking System) and resume analyzer. Your task is to analyze the following resume for a ${jobRole} position.

Resume Text:
${text}

Job Role: ${jobRole}

Important Keywords for this role:
${keywords.join(', ')}

Please analyze this resume and provide the following:
1. A score from 0-100 indicating how well the resume matches the job role
2. A list of strengths in the resume
3. A list of areas for improvement
4. Specific suggestions to improve the resume for this job role
5. An assessment of the use of action verbs (score 1-5)
6. An assessment of readability (score 1-5)

Format your response as a JSON object with the following structure:
{
  "score": number,
  "strengths": ["strength1", "strength2", ...],
  "improvements": ["improvement1", "improvement2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...],
  "actionVerbsScore": number,
  "readabilityScore": number
}
`;
};

// Helper function to analyze resume using LLM
const analyzeLLM = async (text, jobRole, keywords) => {
  try {
    // Generate prompt for LLM
    const prompt = generateLLMPrompt(text, jobRole, keywords);
    
    // Get Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Parse the JSON response
    try {
      const parsedResponse = JSON.parse(responseText);
      return {
        llmScore: parsedResponse.score,
        strengths: parsedResponse.strengths || [],
        improvements: parsedResponse.improvements || [],
        suggestions: parsedResponse.suggestions || [],
        llmActionVerbs: parsedResponse.actionVerbsScore || 3,
        llmReadability: parsedResponse.readabilityScore || 3
      };
    } catch (parseError) {
      console.error('Error parsing LLM response:', parseError);
      // Return default values if parsing fails
      return {
        llmScore: 50,
        strengths: [],
        improvements: [],
        suggestions: [],
        llmActionVerbs: 3,
        llmReadability: 3
      };
    }
  } catch (error) {
    console.error('Error analyzing with LLM:', error);
    // Return default values if LLM analysis fails
    return {
      llmScore: 50,
      strengths: [],
      improvements: [],
      suggestions: [],
      llmActionVerbs: 3,
      llmReadability: 3
    };
  }
};

// Helper function to analyze resume text against keywords
// CRUD API Endpoints for Roles/Keywords
app.get('/api/roles', async (req, res) => {
  try {
    const roles = await RoleKeywords.find().sort({ role: 1 });
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).send('Error fetching roles');
  }
});

app.post('/api/roles', async (req, res) => {
  try {
    const { role, keywords } = req.body;
    const newRole = new RoleKeywords({ role, keywords });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(400).send('Error creating role');
  }
});

app.put('/api/roles/:id', async (req, res) => {
  try {
    const updatedRole = await RoleKeywords.findByIdAndUpdate(
      req.params.id,
      { keywords: req.body.keywords },
      { new: true }
    );
    res.json(updatedRole);
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(400).send('Error updating role');
  }
});

app.delete('/api/roles/:id', async (req, res) => {
  try {
    await RoleKeywords.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(400).send('Error deleting role');
  }
});

const analyzeResume = async (text, jobRole) => {
  const roleData = await RoleKeywords.findOne({ role: jobRole });
  const keywords = roleData ? roleData.keywords : [];
  if (!keywords.length) {
    return {
      score: 0,
      skillMatch: '0/0',
      matchedKeywords: [],
      missingKeywords: []
    };
  }
  
  // Convert text to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();
  
  // Find matched keywords
  const matchedKeywords = keywords.filter(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
  
  // Calculate score
  const keywordScore = Math.round((matchedKeywords.length / keywords.length) * 100);
  
  // Find missing keywords (up to 10 for display purposes)
  const missingKeywords = keywords
    .filter(keyword => !lowerText.includes(keyword.toLowerCase()))
    .slice(0, 10);
  
  // Count action verbs (simplified version)
  const actionVerbs = ['achieved', 'improved', 'created', 'developed', 'managed', 
                       'led', 'implemented', 'designed', 'analyzed', 'resolved'];
  const actionVerbCount = actionVerbs.filter(verb => 
    lowerText.includes(verb.toLowerCase())
  ).length;
  
  // Simple readability score (1-5)
  const avgSentenceLength = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    .map(s => s.trim().split(/\s+/).length)
    .reduce((sum, len) => sum + len, 0) / 
    (text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1);
  
  const readabilityScore = avgSentenceLength > 25 ? 3 : 
                          avgSentenceLength > 15 ? 4 : 5;
  
  // Get LLM analysis if API key is provided
  let llmAnalysis = {
    llmScore: 0,
    strengths: [],
    improvements: [],
    suggestions: [],
    llmActionVerbs: 0,
    llmReadability: 0
  };
  
  if (googleApiKey && googleApiKey !== 'your_api_key_here') {
    try {
      llmAnalysis = await analyzeLLM(text, jobRole, keywords);
    } catch (error) {
      console.error('Error in LLM analysis:', error);
    }
  }
  
  // Combine keyword-based and LLM-based scores
  // If LLM analysis is available, use a weighted average
  const score = googleApiKey && googleApiKey !== 'your_api_key_here' 
    ? Math.round((keywordScore * 0.4) + (llmAnalysis.llmScore * 0.6)) 
    : keywordScore;
  
  // Use LLM action verbs and readability scores if available
  const finalActionVerbsScore = googleApiKey && googleApiKey !== 'your_api_key_here' 
    ? llmAnalysis.llmActionVerbs 
    : Math.min(5, actionVerbCount);
  
  const readability = googleApiKey && googleApiKey !== 'your_api_key_here' 
    ? llmAnalysis.llmReadability 
    : readabilityScore;
  
  return {
    score,
    skillMatch: `${matchedKeywords.length}/${keywords.length}`,
    actionVerbs: finalActionVerbsScore,
    readability,
    resumePercentile: `${Math.min(95, score + 5)}%`,
    matchedKeywords,
    missingKeywords,
    strengths: llmAnalysis.strengths,
    improvements: llmAnalysis.improvements,
    suggestions: llmAnalysis.suggestions,
    llmEnhanced: googleApiKey && googleApiKey !== 'your_api_key_here'
  };
};

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    
    const jobRole = req.body.jobRole || '';
    
    // Extract text from the resume
    const text = await extractText(req.file);
    
    // Analyze the resume text against keywords for the selected job role
    const analysisResult = await analyzeResume(text, jobRole);
    
    res.json(analysisResult);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).send('Error analyzing resume');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
