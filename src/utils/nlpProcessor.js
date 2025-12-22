// NLP Processing utilities for resume analysis
// Pure JavaScript implementation - no Node.js dependencies

/**
 * Clean and tokenize text
 */
export const tokenizeText = (text) => {
  if (!text) return [];
  
  const cleaned = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Simple word tokenization by splitting on whitespace
  return cleaned.split(/\s+/).filter(token => token.length > 2);
};

/**
 * Extract common technical skills from resume text
 */
const COMMON_SKILLS = {
  // Programming Languages
  javascript: ['javascript', 'js', 'node', 'nodejs'],
  python: ['python', 'python3', 'py'],
  java: ['java', 'jvm'],
  csharp: ['csharp', 'c#', 'dotnet', 'cplus'],
  cpp: ['cpp', 'c++'],
  rust: ['rust'],
  go: ['golang', 'go'],
  typescript: ['typescript', 'ts'],
  
  // Frontend
  react: ['react', 'reactjs', 'react.js'],
  vue: ['vue', 'vuejs'],
  angular: ['angular', 'angularjs'],
  'html/css': ['html', 'css', 'scss', 'sass', 'bootstrap'],
  
  // Backend
  nodejs: ['nodejs', 'express', 'nestjs'],
  python_backend: ['django', 'flask', 'fastapi', 'sqlalchemy'],
  'java_spring': ['spring', 'springboot'],
  dotnet: ['dotnet', 'aspnet'],
  
  // Databases
  postgresql: ['postgresql', 'postgres', 'psql'],
  mysql: ['mysql'],
  mongodb: ['mongodb', 'mongo'],
  redis: ['redis'],
  dynamodb: ['dynamodb'],
  elasticsearch: ['elasticsearch'],
  
  // Cloud & DevOps
  aws: ['aws', 'amazon', 'ec2', 's3'],
  gcp: ['gcp', 'google cloud'],
  azure: ['azure', 'microsoft azure'],
  docker: ['docker', 'dockerize'],
  kubernetes: ['kubernetes', 'k8s'],
  jenkins: ['jenkins'],
  github: ['github', 'git'],
  gitlab: ['gitlab'],
  
  // Data & AI
  tensorflow: ['tensorflow', 'tf'],
  pytorch: ['pytorch'],
  scikit: ['scikit-learn', 'sklearn'],
  pandas: ['pandas'],
  numpy: ['numpy'],
  spark: ['spark', 'apache spark'],
  hadoop: ['hadoop'],
  
  // Testing
  jest: ['jest'],
  pytest: ['pytest'],
  mocha: ['mocha'],
  rspec: ['rspec'],
  
  // Other
  sql: ['sql', 'plsql'],
  api: ['api', 'rest', 'restful', 'graphql'],
  agile: ['agile', 'scrum', 'kanban'],
  microservices: ['microservices'],
  ci_cd: ['cicd', 'ci/cd', 'continuous integration'],
};

/**
 * Extract skills from text
 */
export const extractSkills = (text) => {
  if (!text) return [];
  
  const lowerText = text.toLowerCase();
  const foundSkills = new Set();
  
  Object.entries(COMMON_SKILLS).forEach(([skillCategory, keywords]) => {
    keywords.forEach(keyword => {
      // Escape special regex characters in the keyword
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
      // Use word boundary to avoid partial matches
      try {
        const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
        if (regex.test(lowerText)) {
          foundSkills.add(skillCategory);
        }
      } catch (e) {
        // If regex fails, try simple string matching as fallback
        if (lowerText.includes(keyword.toLowerCase())) {
          foundSkills.add(skillCategory);
        }
      }
    });
  });
  
  return Array.from(foundSkills);
};

/**
 * Extract years of experience from text using regex patterns
 */
export const extractExperience = (text) => {
  if (!text) return 0;
  
  let totalYears = 0;
  let foundExperience = [];
  
  // Try explicit year patterns like "5 years" or "10 yrs"
  const yearMatch = text.match(/(\d+)\s*(?:years?|yrs?)/gi);
  if (yearMatch) {
    const years = yearMatch.map(m => parseInt(m));
    totalYears = Math.max(...years);
    foundExperience.push(totalYears);
  }
  
  // Try date range patterns like "2020-2024"
  const dateMatches = [...text.matchAll(/(\d{4})\s*-\s*(?:(\d{4})|present|today|current)/gi)];
  if (dateMatches.length > 0) {
    dateMatches.forEach(match => {
      const startYear = parseInt(match[1]);
      const endYear = match[2] ? parseInt(match[2]) : new Date().getFullYear();
      const years = endYear - startYear;
      if (years > 0 && years < 60) {
        foundExperience.push(years);
      }
    });
    
    // Sum all experiences if multiple found
    if (foundExperience.length > 0) {
      totalYears = foundExperience.reduce((a, b) => a + b, 0) / foundExperience.length;
    }
  }
  
  return Math.round(totalYears);
};

/**
 * Extract education level
 */
export const extractEducation = (text) => {
  if (!text) return { level: 'unknown', found: [] };
  
  const lowerText = text.toLowerCase();
  
  const educationLevels = {
    phd: {
      keywords: ['phd', 'ph.d', 'doctorate', 'doctoral', 'doctor of philosophy'],
      priority: 5
    },
    masters: {
      keywords: ['masters', 'master\'s', 'msc', 'm.sc', 'mba', 'm.a', 'mag'],
      priority: 4
    },
    bachelors: {
      keywords: ['bachelors', 'bachelor\'s', 'bsc', 'b.sc', 'ba', 'b.a', 'beng', 'b.eng'],
      priority: 3
    },
    diploma: {
      keywords: ['diploma', 'associate', 'ndip', 'higher national'],
      priority: 2
    },
    highschool: {
      keywords: ['high school', 'secondary', 'hs', 'a-level', 'gcse'],
      priority: 1
    },
  };
  
  const found = [];
  let highestLevel = 'unknown';
  let highestPriority = 0;
  
  Object.entries(educationLevels).forEach(([level, data]) => {
    data.keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        found.push(level);
        if (data.priority > highestPriority) {
          highestLevel = level;
          highestPriority = data.priority;
        }
      }
    });
  });
  
  return {
    level: highestLevel,
    found: [...new Set(found)]
  };
};

/**
 * Calculate TF-IDF score for keyword matching
 */
export const calculateTFIDF = (resumeTokens, jobTokens) => {
  if (resumeTokens.length === 0 || jobTokens.length === 0) return 0;
  
  // Calculate Term Frequency in resume
  const tfMap = {};
  resumeTokens.forEach(token => {
    tfMap[token] = (tfMap[token] || 0) + 1;
  });
  
  // Normalize TF
  Object.keys(tfMap).forEach(token => {
    tfMap[token] = tfMap[token] / resumeTokens.length;
  });
  
  // Calculate matches
  const jobSet = new Set(jobTokens);
  let score = 0;
  
  Object.entries(tfMap).forEach(([token, tf]) => {
    if (jobSet.has(token)) {
      // IDF calculation: log(total tokens / frequency in job)
      const jobFreq = jobTokens.filter(t => t === token).length;
      const idf = Math.log(jobTokens.length / jobFreq);
      score += tf * idf;
    }
  });
  
  // Normalize to 0-100
  const maxScore = Math.min(resumeTokens.length, jobTokens.length);
  return Math.min((score / maxScore) * 100, 100);
};

/**
 * Fuzzy match skills between resume and job
 * Pure JavaScript implementation without external dependencies
 */
export const fuzzyMatchSkills = (resumeSkills, requiredSkills) => {
  if (requiredSkills.length === 0) return 100;
  if (resumeSkills.length === 0) return 0;
  
  // Simple similarity function: Levenshtein distance
  const stringSimilarity = (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 100;
    
    const editDistance = getEditDistance(longer, shorter);
    return ((longer.length - editDistance) / longer.length) * 100;
  };
  
  const getEditDistance = (s1, s2) => {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  };
  
  const matched = requiredSkills.filter(required => {
    return resumeSkills.some(resume => {
      const similarity = stringSimilarity(resume.toLowerCase(), required.toLowerCase());
      return similarity > 70; // 70% similarity threshold
    }) ||
    resumeSkills.some(resume => 
      resume.toLowerCase().includes(required.toLowerCase()) ||
      required.toLowerCase().includes(resume.toLowerCase())
    );
  });
  
  return (matched.length / requiredSkills.length) * 100;
};

/**
 * Extract contact information from resume
 */
const hasEmailAddress = (text) => {
  return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi.test(text);
};

const hasPhoneNumber = (text) => {
  return /[+]?[(]?[0-9]{3}[).]?[ ]?[0-9]{3}[-]?[0-9]{4,6}/gi.test(text);
};

/**
 * Extract summary statistics from resume
 */
export const extractResumeSummary = (text) => {
  if (!text) return null;
  
  return {
    skills: extractSkills(text),
    experience: extractExperience(text),
    education: extractEducation(text),
    wordCount: text.split(/\s+/).length,
    hasContact: hasEmailAddress(text),
    hasPhone: hasPhoneNumber(text),
  };
};

const nlpProcessor = {
  tokenizeText,
  extractSkills,
  extractExperience,
  extractEducation,
  calculateTFIDF,
  fuzzyMatchSkills,
  extractResumeSummary,
};

export default nlpProcessor;
