/**
 * RESUME SCORING SYSTEM - TEST CASES & VALIDATION
 * 
 * Run these test cases to verify the accuracy of the scoring system
 */

import { scoreResume, parseJobDescription } from '../utils/resumeScorer';

// ============================================
// TEST DATA SETS
// ============================================

const TEST_CASES = [
  {
    id: 'perfect_match',
    name: 'Perfect Technical Match',
    jobDescription: `
      Senior React Developer
      
      Requirements:
      - 5+ years of experience
      - Expert in React, JavaScript, and TypeScript
      - Experience with Node.js and Express
      - Knowledge of PostgreSQL and MongoDB
      - AWS or cloud platform experience
      - Bachelor's degree in Computer Science
      
      Nice to have:
      - GraphQL experience
      - Docker and Kubernetes
      - Agile/Scrum experience
    `,
    resume: `
      JOHN DOE
      john.doe@email.com | (555) 123-4567
      
      SUMMARY
      Senior React Developer with 6 years of full-stack experience. 
      Expert in JavaScript, TypeScript, and modern web technologies.
      
      SKILLS
      - React, JavaScript, TypeScript, Node.js, Express
      - PostgreSQL, MongoDB, Redis
      - AWS (EC2, S3, Lambda), Docker, Kubernetes
      - GraphQL, REST APIs, Git, GitHub
      - Agile/Scrum, CI/CD pipelines
      
      EXPERIENCE
      Senior React Developer | 2019-2024 (6 years)
      Tech Company Inc.
      - Led development of large-scale React applications
      - Designed and implemented REST and GraphQL APIs with Node.js
      - Managed PostgreSQL and MongoDB databases
      - Deployed applications to AWS
      - Mentored junior developers
      
      EDUCATION
      Bachelor of Science in Computer Science
      University of Technology, 2019
    `,
    expectedRanking: 'EXCELLENT',
    expectedScoreRange: [85, 100],
    explanation: 'Candidate exceeds all requirements with relevant experience and skills'
  },

  {
    id: 'partial_match',
    name: 'Good Technical Match with Minor Gaps',
    jobDescription: `
      Full Stack Developer
      
      Requirements:
      - 3+ years of experience
      - React and JavaScript/TypeScript
      - Node.js and Express
      - PostgreSQL or MongoDB
      - Bachelor's degree
    `,
    resume: `
      JANE SMITH
      jane.smith@email.com | (555) 987-6543
      
      SUMMARY
      Full Stack Developer with 4 years of experience building web applications.
      Strong in React and Node.js.
      
      SKILLS
      - React, JavaScript, HTML, CSS
      - Node.js, Express
      - PostgreSQL, some MongoDB experience
      - Git, Basic Docker knowledge
      
      EXPERIENCE
      Full Stack Developer | 2020-2024 (4 years)
      Web Solutions Ltd.
      - Built multiple React applications
      - Developed REST APIs with Node.js and Express
      - Worked with PostgreSQL databases
      - Version control with Git
      
      EDUCATION
      Bachelor of Science in Information Technology
      City University, 2020
    `,
    expectedRanking: 'STRONG',
    expectedScoreRange: [75, 84],
    explanation: 'Candidate meets requirements well, minor areas for growth'
  },

  {
    id: 'below_requirements',
    name: 'Below Requirements - Entry Level for Senior Role',
    jobDescription: `
      Senior Data Engineer
      
      Requirements:
      - 7+ years of data engineering experience
      - Python expertise
      - Spark and Hadoop
      - AWS or GCP
      - Master's degree in related field
      - Experience with large-scale data pipelines
    `,
    resume: `
      ALEX KUMAR
      alex@email.com | (555) 456-7890
      
      SUMMARY
      Junior Data Analyst with 1.5 years of experience.
      Learning Python and data tools.
      
      SKILLS
      - Python (basics), SQL
      - Excel, Tableau
      - Some experience with Google Cloud Platform
      - Basic statistics
      
      EXPERIENCE
      Data Analyst | 2023-2024 (1.5 years)
      Analytics Startup
      - Created SQL reports
      - Built Tableau dashboards
      - Analyzed business metrics
      
      EDUCATION
      Bachelor of Science in Statistics
      Community College, 2023
    `,
    expectedRanking: 'POOR',
    expectedScoreRange: [15, 40],
    explanation: 'Significant experience gap and missing critical skills'
  },

  {
    id: 'wrong_domain',
    name: 'Wrong Domain - Frontend Dev for Backend Role',
    jobDescription: `
      Backend Engineer - Python
      
      Requirements:
      - 4+ years backend development
      - Python expertise
      - Django or Flask
      - PostgreSQL
      - AWS infrastructure
      - RESTful API design
    `,
    resume: `
      RACHEL TECH
      rachel@email.com
      
      SUMMARY
      Frontend Web Developer specializing in React and Vue.
      
      SKILLS
      - React, Vue, JavaScript, CSS
      - HTML5, Bootstrap, Tailwind CSS
      - Some jQuery experience
      - Figma design tools
      
      EXPERIENCE
      Frontend Developer | 2020-2024 (4 years)
      Design Studio
      - Built responsive React interfaces
      - Created reusable CSS components
      - UI/UX implementation
      
      EDUCATION
      Bootcamp Certificate - Web Development
    `,
    expectedRanking: 'BELOW_AVERAGE',
    expectedScoreRange: [5, 30],
    explanation: 'Completely different technical domain'
  },

  {
    id: 'overqualified',
    name: 'Overqualified Candidate',
    jobDescription: `
      Junior Front-End Developer
      
      Requirements:
      - 1+ year of experience
      - React basics
      - JavaScript
      - HTML/CSS
    `,
    resume: `
      EXPERT DEVELOPER
      expert@email.com
      
      SUMMARY
      Principal Engineer with 12 years of full-stack experience.
      Expert in React, JavaScript, TypeScript, and enterprise architecture.
      
      SKILLS
      - React, Angular, Vue (Expert), JavaScript, TypeScript
      - Node.js, Django, Rails
      - AWS, GCP, Docker, Kubernetes
      - GraphQL, REST APIs
      - System Design, Microservices Architecture
      
      EXPERIENCE
      Principal Engineer | 2015-2024 (10+ years)
      Tech Unicorn Company
      - Led architectural decisions for enterprise applications
      - Mentored teams of engineers
      - Open source contributor
      
      EDUCATION
      Master's in Computer Science, PhD in progress
    `,
    expectedRanking: 'EXCELLENT',
    expectedScoreRange: [85, 100],
    explanation: 'Overqualification is positive - brings valuable expertise'
  },

  {
    id: 'incomplete_resume',
    name: 'Incomplete Resume - Missing Contact Info',
    jobDescription: `
      Software Engineer
      
      Requirements:
      - 3+ years experience
      - Java or Python
      - Bachelor's degree
    `,
    resume: `
      Senior Developer
      
      Experience:
      Worked as developer for 5 years
      Experienced with Java and Python
      
      Education:
      Computer Science degree
    `,
    expectedRanking: 'GOOD',
    expectedScoreRange: [60, 75],
    explanation: 'Good skills match but poor resume quality reduces score'
  }
];

// ============================================
// TEST RUNNER
// ============================================

export const runTests = () => {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║       RESUME SCORING SYSTEM - TEST SUITE                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  let passedTests = 0;
  let failedTests = 0;
  const results = [];

  TEST_CASES.forEach((testCase, index) => {
    console.log(`\nTest ${index + 1}: ${testCase.name}`);
    console.log('─'.repeat(60));

    try {
      const score = scoreResume(testCase.resume, testCase.jobDescription);
      
      const scoresInRange = 
        score.overallScore >= testCase.expectedScoreRange[0] &&
        score.overallScore <= testCase.expectedScoreRange[1];
      
      const rankingCorrect = score.ranking === testCase.expectedRanking;
      const testPassed = scoresInRange && rankingCorrect;

      if (testPassed) {
        console.log('✓ PASSED');
        passedTests++;
      } else {
        console.log('✗ FAILED');
        failedTests++;
      }

      console.log(`\nResults:`);
      console.log(`  Overall Score: ${score.overallScore}/100`);
      console.log(`  Expected Range: ${testCase.expectedScoreRange[0]}-${testCase.expectedScoreRange[1]}`);
      console.log(`  In Range: ${scoresInRange ? '✓ Yes' : '✗ No'}`);
      console.log(`  \nRanking: ${score.ranking}`);
      console.log(`  Expected: ${testCase.expectedRanking}`);
      console.log(`  Match: ${rankingCorrect ? '✓ Yes' : '✗ No'}`);
      
      console.log(`\nScore Breakdown:`);
      console.log(`  Technical: ${score.scores.technical}%`);
      console.log(`  Experience: ${score.scores.experience}%`);
      console.log(`  Education: ${score.scores.education}%`);
      console.log(`  Completeness: ${score.scores.completeness}%`);
      console.log(`  Relevance: ${score.scores.relevance}%`);
      
      console.log(`\nConfidence: ${score.confidence}%`);
      console.log(`Explanation: ${testCase.explanation}`);

      results.push({
        testId: testCase.id,
        testName: testCase.name,
        passed: testPassed,
        actualScore: score.overallScore,
        expectedRange: testCase.expectedScoreRange,
        actualRanking: score.ranking,
        expectedRanking: testCase.expectedRanking,
        confidence: score.confidence
      });

    } catch (error) {
      console.log('✗ ERROR:', error.message);
      failedTests++;
      results.push({
        testId: testCase.id,
        testName: testCase.name,
        passed: false,
        error: error.message
      });
    }
  });

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('TEST SUMMARY');
  console.log('═'.repeat(60));
  console.log(`Total Tests: ${TEST_CASES.length}`);
  console.log(`Passed: ${passedTests} (${Math.round(passedTests / TEST_CASES.length * 100)}%)`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Success Rate: ${Math.round(passedTests / TEST_CASES.length * 100)}%`);
  console.log('═'.repeat(60) + '\n');

  return {
    totalTests: TEST_CASES.length,
    passed: passedTests,
    failed: failedTests,
    successRate: Math.round(passedTests / TEST_CASES.length * 100),
    results
  };
};

// ============================================
// SINGLE TEST RUNNER (for debugging)
// ============================================

export const runSingleTest = (testId) => {
  const testCase = TEST_CASES.find(t => t.id === testId);
  if (!testCase) {
    console.error(`Test with ID '${testId}' not found`);
    return null;
  }

  console.log(`Running: ${testCase.name}\n`);
  const score = scoreResume(testCase.resume, testCase.jobDescription);
  
  console.log('Score Details:');
  console.log(JSON.stringify(score, null, 2));
  
  return score;
};

// Export for use in React components
export default {
  TEST_CASES,
  runTests,
  runSingleTest
};
