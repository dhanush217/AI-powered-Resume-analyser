/**
 * ATS Keywords Database for different job roles
 * These keywords are commonly used in Applicant Tracking Systems (ATS)
 * for screening resumes for specific job roles.
 */

const atsKeywords = {
  "Full Stack Developer": [
    // Technical Skills
    "JavaScript", "TypeScript", "React", "Angular", "Vue.js", "Node.js", "Express", 
    "MongoDB", "SQL", "PostgreSQL", "MySQL", "RESTful API", "GraphQL", "Redux", 
    "HTML5", "CSS3", "SASS", "LESS", "Webpack", "Babel", "Git", "GitHub", "GitLab", 
    "CI/CD", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Microservices", 
    "Serverless", "Firebase", "Authentication", "Authorization", "JWT", "OAuth", 
    "Testing", "Jest", "Mocha", "Chai", "Cypress", "Selenium", "TDD", "BDD",
    "Responsive Design", "Mobile-First", "Progressive Web Apps", "WebSockets",
    "Agile", "Scrum", "Kanban", "JIRA", "Confluence", "DevOps", "Full Stack",
    
    // Soft Skills
    "Problem Solving", "Communication", "Teamwork", "Collaboration", "Time Management",
    "Project Management", "Leadership", "Mentoring", "Code Review", "Documentation",
    "Client Interaction", "Requirements Gathering", "System Design", "Architecture",
    "Performance Optimization", "Debugging", "Troubleshooting", "Critical Thinking"
  ],
  
  "Java Developer": [
    // Technical Skills
    "Java", "Spring", "Spring Boot", "Hibernate", "JPA", "Maven", "Gradle", 
    "JUnit", "Mockito", "Microservices", "RESTful API", "SOAP", "XML", "JSON",
    "SQL", "Oracle", "MySQL", "PostgreSQL", "MongoDB", "Cassandra", "Redis",
    "Kafka", "RabbitMQ", "ActiveMQ", "JMS", "Multithreading", "Concurrency",
    "Design Patterns", "OOP", "SOLID", "Clean Code", "TDD", "BDD", "CI/CD",
    "Jenkins", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Git", "GitHub",
    "GitLab", "Bitbucket", "Agile", "Scrum", "Kanban", "JIRA", "Confluence",
    "Java EE", "Servlets", "JSP", "JSF", "Thymeleaf", "Struts", "Log4j", "SLF4J",
    "JVM", "Garbage Collection", "Performance Tuning", "Debugging", "Profiling",
    
    // Soft Skills
    "Problem Solving", "Communication", "Teamwork", "Collaboration", "Time Management",
    "Project Management", "Leadership", "Mentoring", "Code Review", "Documentation",
    "Client Interaction", "Requirements Gathering", "System Design", "Architecture",
    "Performance Optimization", "Debugging", "Troubleshooting", "Critical Thinking"
  ],
  
  "Python Developer": [
    // Technical Skills
    "Python", "Django", "Flask", "FastAPI", "Pyramid", "SQLAlchemy", "ORM",
    "REST API", "GraphQL", "Pytest", "Unittest", "TDD", "BDD", "SQL", "MySQL",
    "PostgreSQL", "MongoDB", "Redis", "Celery", "RabbitMQ", "Kafka", "Docker",
    "Kubernetes", "AWS", "Azure", "GCP", "Git", "GitHub", "GitLab", "CI/CD",
    "Jenkins", "Travis CI", "CircleCI", "Agile", "Scrum", "Kanban", "JIRA",
    "NumPy", "Pandas", "Matplotlib", "Seaborn", "Scikit-learn", "TensorFlow",
    "PyTorch", "Keras", "Data Analysis", "Data Visualization", "Machine Learning",
    "Deep Learning", "NLP", "Computer Vision", "Web Scraping", "Automation",
    "Microservices", "Serverless", "Lambda", "API Gateway", "S3", "DynamoDB",
    
    // Soft Skills
    "Problem Solving", "Communication", "Teamwork", "Collaboration", "Time Management",
    "Project Management", "Leadership", "Mentoring", "Code Review", "Documentation",
    "Client Interaction", "Requirements Gathering", "System Design", "Architecture",
    "Performance Optimization", "Debugging", "Troubleshooting", "Critical Thinking"
  ],
  
  "UI/UX Designer": [
    // Technical Skills
    "UI Design", "UX Design", "User Research", "Wireframing", "Prototyping",
    "User Testing", "Usability Testing", "A/B Testing", "Figma", "Sketch",
    "Adobe XD", "InVision", "Zeplin", "Adobe Photoshop", "Adobe Illustrator",
    "HTML", "CSS", "JavaScript", "Responsive Design", "Mobile Design",
    "Web Design", "App Design", "Information Architecture", "User Flows",
    "Journey Mapping", "Personas", "Storyboarding", "Interaction Design",
    "Visual Design", "Typography", "Color Theory", "Grid Systems", "Accessibility",
    "WCAG", "Design Systems", "Style Guides", "Component Libraries", "Material Design",
    "Human Interface Guidelines", "Bootstrap", "Tailwind CSS", "Animation",
    
    // Soft Skills
    "Creativity", "Problem Solving", "Communication", "Teamwork", "Collaboration",
    "Time Management", "Project Management", "Client Interaction", "Presentation",
    "Empathy", "Critical Thinking", "Attention to Detail", "Adaptability",
    "User-Centered Design", "Design Thinking", "Storytelling", "Feedback Integration"
  ],
  
  "SEO": [
    // Technical Skills
    "Search Engine Optimization", "Keyword Research", "On-Page SEO", "Off-Page SEO",
    "Technical SEO", "Local SEO", "Mobile SEO", "Voice Search Optimization",
    "Google Analytics", "Google Search Console", "Google Tag Manager", "Ahrefs",
    "SEMrush", "Moz", "Screaming Frog", "Rank Tracking", "Backlink Analysis",
    "Competitor Analysis", "Content Optimization", "Meta Tags", "Schema Markup",
    "Structured Data", "XML Sitemaps", "Robots.txt", "Canonical Tags", "301 Redirects",
    "404 Errors", "Page Speed Optimization", "Mobile-Friendly", "Responsive Design",
    "Link Building", "Guest Posting", "Content Marketing", "Social Media Marketing",
    "PPC", "SEM", "Google Ads", "Bing Ads", "Facebook Ads", "Instagram Ads",
    
    // Soft Skills
    "Communication", "Analytical Thinking", "Problem Solving", "Creativity",
    "Time Management", "Project Management", "Client Interaction", "Reporting",
    "Data Analysis", "Strategic Planning", "Adaptability", "Attention to Detail"
  ],
  
  "PROMPT Engineering": [
    // Technical Skills
    "Natural Language Processing", "Machine Learning", "Deep Learning", "AI",
    "GPT", "BERT", "Transformers", "LLMs", "Fine-tuning", "Prompt Design",
    "Context Window", "Token Optimization", "Python", "TensorFlow", "PyTorch",
    "Hugging Face", "OpenAI API", "LangChain", "Vector Databases", "Embeddings",
    "Semantic Search", "RAG", "Retrieval Augmented Generation", "Chain of Thought",
    "Few-Shot Learning", "Zero-Shot Learning", "Instruction Tuning", "RLHF",
    "Reinforcement Learning from Human Feedback", "Evaluation Metrics", "ROUGE",
    "BLEU", "Perplexity", "Hallucination Detection", "Bias Mitigation",
    
    // Soft Skills
    "Critical Thinking", "Problem Solving", "Creativity", "Communication",
    "Attention to Detail", "Analytical Skills", "Research Skills", "Documentation",
    "Technical Writing", "User Empathy", "System Design", "Ethical Considerations"
  ],
  
  "Mechanical Engineering": [
    // Technical Skills
    "CAD", "SolidWorks", "AutoCAD", "CATIA", "Creo", "Fusion 360", "FEA",
    "CFD", "Thermal Analysis", "Structural Analysis", "GD&T", "Tolerance Analysis",
    "Manufacturing Processes", "CNC", "3D Printing", "Additive Manufacturing",
    "Materials Science", "Metallurgy", "Composites", "Thermodynamics", "Fluid Mechanics",
    "Heat Transfer", "Dynamics", "Kinematics", "Robotics", "Control Systems",
    "PLC", "HVAC", "MEP", "Piping", "Product Design", "Design for Manufacturing",
    "Design for Assembly", "Prototyping", "Testing", "Quality Control", "Six Sigma",
    "Lean Manufacturing", "Project Management", "MATLAB", "Python", "LabVIEW",
    
    // Soft Skills
    "Problem Solving", "Communication", "Teamwork", "Collaboration", "Time Management",
    "Project Management", "Leadership", "Attention to Detail", "Analytical Thinking",
    "Critical Thinking", "Innovation", "Creativity", "Technical Writing", "Documentation"
  ],
  
  "Medical": [
    // Technical Skills
    "Patient Care", "Clinical Experience", "Medical Terminology", "Electronic Health Records",
    "EHR", "EMR", "Epic", "Cerner", "Meditech", "Allscripts", "Medical Coding",
    "ICD-10", "CPT", "HCPCS", "Medical Billing", "Insurance Verification",
    "HIPAA", "Patient Confidentiality", "Vital Signs", "Phlebotomy", "Injections",
    "Medication Administration", "Patient Assessment", "Triage", "First Aid",
    "CPR", "BLS", "ACLS", "PALS", "Medical Equipment", "Sterilization", "Autoclave",
    "Patient Scheduling", "Appointment Management", "Medical Office Procedures",
    "Medical Records Management", "Laboratory Procedures", "Specimen Collection",
    
    // Soft Skills
    "Communication", "Empathy", "Compassion", "Attention to Detail", "Time Management",
    "Teamwork", "Collaboration", "Problem Solving", "Critical Thinking", "Adaptability",
    "Stress Management", "Patient Education", "Cultural Sensitivity", "Ethics"
  ],
  
  "HR": [
    // Technical Skills
    "Recruitment", "Talent Acquisition", "Sourcing", "Interviewing", "Onboarding",
    "Employee Relations", "Performance Management", "Compensation", "Benefits",
    "Payroll", "HRIS", "Workday", "SAP SuccessFactors", "ADP", "Oracle HCM",
    "Applicant Tracking Systems", "ATS", "Greenhouse", "Lever", "Taleo", "iCIMS",
    "Employee Engagement", "Retention Strategies", "Training & Development",
    "Learning Management Systems", "LMS", "Succession Planning", "Workforce Planning",
    "HR Analytics", "HR Metrics", "SHRM", "HRCI", "PHR", "SPHR", "SHRM-CP", "SHRM-SCP",
    "Labor Laws", "FLSA", "FMLA", "ADA", "EEOC", "Title VII", "Diversity & Inclusion",
    "DEI", "Conflict Resolution", "Mediation", "Investigations", "Terminations",
    
    // Soft Skills
    "Communication", "Interpersonal Skills", "Confidentiality", "Discretion",
    "Problem Solving", "Decision Making", "Emotional Intelligence", "Empathy",
    "Adaptability", "Organization", "Time Management", "Attention to Detail",
    "Conflict Resolution", "Negotiation", "Leadership", "Teamwork", "Collaboration"
  ]
};

// Helper function to get keywords for a specific job role
const getKeywordsForRole = (role) => {
  return atsKeywords[role] || [];
};

module.exports = {
  atsKeywords,
  getKeywordsForRole
};