// Resume Scoring Engine - Accurate HR-focused scoring
import {
  tokenizeText,
  extractSkills,
  calculateTFIDF,
  fuzzyMatchSkills,
  extractResumeSummary
} from './nlpProcessor';

/**
 * Parse job description to extract requirements
 */
export const parseJobDescription = (jobDescription) => {
  if (!jobDescription) {
    return {
      tokens: [],
      skills: [],
      requiredExperience: 0,
      requiredEducation: 'bachelors'
    };
  }

  const lowerDesc = jobDescription.toLowerCase();
  
  // Extract required experience
  let requiredExperience = 0;
  const expMatch = jobDescription.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/i);
  if (expMatch) {
    requiredExperience = parseInt(expMatch[1]);
  }

  // Extract minimum education requirement
  let requiredEducation = 'highschool';
  if (lowerDesc.includes('phd') || lowerDesc.includes('doctorate')) {
    requiredEducation = 'phd';
  } else if (lowerDesc.includes('master') || lowerDesc.includes('mba')) {
    requiredEducation = 'masters';
  } else if (lowerDesc.includes('bachelor') || lowerDesc.includes('degree')) {
    requiredEducation = 'bachelors';
  }

  return {
    tokens: tokenizeText(jobDescription),
    skills: extractSkills(jobDescription),
    requiredExperience,
    requiredEducation,
    fullText: jobDescription
  };
};

/**
 * Education level ranking for comparison
 */
const educationRanking = {
  unknown: 0,
  highschool: 1,
  diploma: 2,
  bachelors: 3,
  masters: 4,
  phd: 5
};

/**
 * Calculate education match score
 */
const calculateEducationScore = (candidateEducation, requiredEducation) => {
  const candidateRank = educationRanking[candidateEducation.level] || 0;
  const requiredRank = educationRanking[requiredEducation] || 0;

  // Exact match: 100
  // Higher than required: 95
  // One level below: 70
  // Two levels below: 40
  // Three+ levels below: 0

  if (candidateRank === requiredRank) return 100;
  if (candidateRank > requiredRank) return 95;
  
  const diff = requiredRank - candidateRank;
  if (diff === 1) return 70;
  if (diff === 2) return 40;
  return 0;
};

/**
 * Calculate experience match score
 */
const calculateExperienceScore = (candidateExperience, requiredExperience) => {
  // More experience is better but overqualification doesn't help much
  
  if (requiredExperience === 0) return 100;
  if (candidateExperience === 0) return 0;

  const ratio = candidateExperience / requiredExperience;

  // Exact match: 100
  // 10% more: 100
  // 50% more: 95
  // 100% more (2x): 90
  // Half required: 50
  // Less than required: proportional

  if (ratio >= 1.1) return Math.min(100, 90 + (ratio - 1.1) * 10);
  if (ratio >= 0.5) return 50 + ratio * 50;
  return ratio * 50;
};

/**
 * Calculate technical match score using multiple methods
 */
const calculateTechnicalScore = (resumeSkills, requiredSkills, resumeTokens, jobTokens) => {
  // Equal weight to skill matching and keyword matching
  const skillScore = fuzzyMatchSkills(resumeSkills, requiredSkills);
  const keywordScore = calculateTFIDF(resumeTokens, jobTokens);

  // Weighted average: 60% skills, 40% keywords
  return skillScore * 0.6 + keywordScore * 0.4;
};

/**
 * MAIN SCORING FUNCTION - Multi-dimensional accurate scoring
 */
export const scoreResume = (resumeText, jobDescription, weights = {}) => {
  // Default weights for HR accuracy
  const defaultWeights = {
    technical: 0.35,      // Skills and keywords match
    experience: 0.25,     // Years of experience match
    education: 0.20,      // Education level match
    completeness: 0.15,   // Resume completeness (contact info, formatting)
    relevance: 0.05       // General relevance signals
  };

  const finalWeights = { ...defaultWeights, ...weights };

  // Validate inputs
  if (!resumeText || typeof resumeText !== 'string') {
    return {
      overallScore: 0,
      scores: { technical: 0, experience: 0, education: 0, completeness: 0, relevance: 0 },
      breakdown: { message: 'Invalid resume text' },
      ranking: 'UNRANKED',
      confidence: 0
    };
  }

  // Parse job requirements
  const jobReqs = parseJobDescription(jobDescription);

  // Extract resume data
  const resumeData = extractResumeSummary(resumeText);
  const resumeTokens = tokenizeText(resumeText);

  let scores = {};

  // 1. TECHNICAL SCORE (Skills + Keywords)
  scores.technical = calculateTechnicalScore(
    resumeData.skills,
    jobReqs.skills,
    resumeTokens,
    jobReqs.tokens
  );

  // 2. EXPERIENCE SCORE
  scores.experience = calculateExperienceScore(
    resumeData.experience,
    jobReqs.requiredExperience
  );

  // 3. EDUCATION SCORE
  scores.education = calculateEducationScore(
    resumeData.education,
    jobReqs.requiredEducation
  );

  // 4. COMPLETENESS SCORE (Professional indicators)
  const completenessIndicators = [
    resumeData.hasContact ? 50 : 0,
    resumeData.hasPhone ? 30 : 0,
    resumeData.wordCount > 200 ? 20 : 0
  ];
  scores.completeness = Math.min(100, completenessIndicators.reduce((a, b) => a + b, 0));

  // 5. RELEVANCE SCORE (Industry terms, keywords)
  const relevanceKeywords = ['professional', 'experienced', 'skilled', 'development', 'project'];
  const relevanceMatches = relevanceKeywords.filter(kw => 
    resumeText.toLowerCase().includes(kw)
  ).length;
  scores.relevance = Math.min(100, (relevanceMatches / relevanceKeywords.length) * 100);

  // Calculate weighted overall score
  const overallScore = 
    scores.technical * finalWeights.technical +
    scores.experience * finalWeights.experience +
    scores.education * finalWeights.education +
    scores.completeness * finalWeights.completeness +
    scores.relevance * finalWeights.relevance;

  // Determine ranking
  let ranking = 'UNRANKED';
  if (overallScore >= 85) ranking = 'EXCELLENT';
  else if (overallScore >= 75) ranking = 'STRONG';
  else if (overallScore >= 60) ranking = 'GOOD';
  else if (overallScore >= 45) ranking = 'FAIR';
  else if (overallScore >= 30) ranking = 'POOR';
  else ranking = 'BELOW_AVERAGE';

  // Calculate confidence (0-100) based on data quality
  // More lenient scoring - base confidence of 40% if any analysis happened
  let confidence = 40; // Base confidence if we analyzed anything
  
  if (resumeData.hasContact) confidence += 15;
  if (jobReqs.skills.length > 0) confidence += 15;
  if (resumeData.education.level !== 'unknown') confidence += 15;
  if (resumeData.experience > 0) confidence += 10;
  if (resumeData.wordCount > 300) confidence += 5;
  if (resumeData.wordCount > 100) confidence += 5;
  
  confidence = Math.min(100, confidence);

  // Create detailed breakdown
  const breakdown = {
    matchedSkills: resumeData.skills.filter(s => jobReqs.skills.includes(s)),
    missingSkills: jobReqs.skills.filter(s => !resumeData.skills.includes(s)),
    experienceDiff: resumeData.experience - jobReqs.requiredExperience,
    educationMatch: educationRanking[resumeData.education.level] >= educationRanking[jobReqs.requiredEducation] ? 'meets' : 'below',
    hasFullContact: resumeData.hasContact && resumeData.hasPhone,
    keywordMatches: resumeTokens.filter(t => jobReqs.tokens.includes(t)).length
  };

  return {
    overallScore: Math.round(overallScore * 100) / 100,
    scores: Object.keys(scores).reduce((acc, key) => {
      acc[key] = Math.round(scores[key] * 100) / 100;
      return acc;
    }, {}),
    breakdown,
    ranking,
    confidence: Math.round(confidence),
    metadata: {
      resumeWordCount: resumeData.wordCount,
      candidateExperience: resumeData.experience,
      candidateEducation: resumeData.education.level,
      requiredExperience: jobReqs.requiredExperience,
      requiredEducation: jobReqs.requiredEducation,
      scoredAt: new Date().toISOString()
    }
  };
};

/**
 * Batch score multiple resumes against a job
 */
export const batchScoreResumes = (resumes, jobDescription, weights) => {
  return resumes.map(resume => ({
    ...resume,
    score: scoreResume(resume.text, jobDescription, weights)
  })).sort((a, b) => b.score.overallScore - a.score.overallScore);
};

/**
 * Get ranking recommendations
 */
export const getRankingRecommendation = (score) => {
  const recommendations = {
    'EXCELLENT': {
      color: '#2E7D32',
      message: 'Strong match - Highly recommended for interview',
      action: 'INTERVIEW'
    },
    'STRONG': {
      color: '#0288D1',
      message: 'Good match - Suitable for interview',
      action: 'INTERVIEW'
    },
    'GOOD': {
      color: '#F57C00',
      message: 'Acceptable match - Consider for interview',
      action: 'CONSIDER'
    },
    'FAIR': {
      color: '#FBC02D',
      message: 'Limited match - May need screening',
      action: 'SCREEN'
    },
    'POOR': {
      color: '#E64A19',
      message: 'Weak match - Consider rejecting',
      action: 'REJECT'
    },
    'BELOW_AVERAGE': {
      color: '#C41E3A',
      message: 'Does not meet minimum requirements',
      action: 'REJECT'
    },
    'UNRANKED': {
      color: '#999',
      message: 'Unable to rank - Check resume quality',
      action: 'REVIEW'
    }
  };

  return recommendations[score.ranking] || recommendations['UNRANKED'];
};

const resumeScorer = {
  parseJobDescription,
  scoreResume,
  batchScoreResumes,
  getRankingRecommendation
};

export default resumeScorer;
