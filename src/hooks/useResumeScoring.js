// Custom hook for resume scoring operations
import { useState, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { scoreResume } from '../utils/resumeScorer';

export const useResumeScoring = () => {
  const [scoring, setScoring] = useState(false);
  const [error, setError] = useState(null);
  const [scores, setScores] = useState({});

  /**
   * Score a single resume against a job
   */
  const scoreApplication = useCallback(async (applicationId, resumeText, jobDescription) => {
    // Allow scoring even with minimal data
    if (!resumeText) {
      setError('Resume text is required');
      return null;
    }

    // If no job description, use a default one based on common job titles
    let finalJobDescription = jobDescription || 'Software Engineer position';

    try {
      setScoring(true);
      setError(null);

      // Calculate score
      const scoreData = scoreResume(resumeText, finalJobDescription);

      // Format the response to match what the UI expects
      const formattedScore = {
        overallScore: scoreData.overallScore,
        scores: scoreData.scores,
        ranking: scoreData.ranking,
        confidence: scoreData.confidence,
        breakdown: scoreData.breakdown,
        metadata: scoreData.metadata
      };

      // Try to save to database (optional - if table exists)
      try {
        const { error: dbError } = await supabase
          .from('application_scores')
          .upsert({
            application_id: applicationId,
            overall_score: scoreData.overallScore,
            technical_score: scoreData.scores.technical,
            experience_score: scoreData.scores.experience,
            education_score: scoreData.scores.education,
            completeness_score: scoreData.scores.completeness,
            relevance_score: scoreData.scores.relevance,
            ranking: scoreData.ranking,
            confidence: scoreData.confidence,
            matched_skills: scoreData.breakdown.matchedSkills,
            missing_skills: scoreData.breakdown.missingSkills,
            experience_diff: scoreData.breakdown.experienceDiff,
            education_match: scoreData.breakdown.educationMatch,
            keyword_matches: scoreData.breakdown.keywordMatches,
            metadata: scoreData.metadata,
            scored_at: new Date().toISOString()
          }, {
            onConflict: 'application_id'
          });
        
        if (dbError && dbError.code !== 'PGRST116') {
          console.warn('Could not save to database:', dbError);
        }
      } catch (dbErr) {
        // Database not available - that's okay, scores work in memory
        console.log('Database save skipped (table may not exist yet)');
      }

      // Update local state with formatted score
      setScores(prev => ({
        ...prev,
        [applicationId]: formattedScore
      }));

      return formattedScore;
    } catch (err) {
      const errorMsg = err.message || 'Error scoring resume';
      setError(errorMsg);
      console.error('Scoring error:', err);
      return null;
    } finally {
      setScoring(false);
    }
  }, []);

  /**
   * Score multiple applications for a job
   */
  const scoreJob = useCallback(async (jobId, applications) => {
    if (!applications || applications.length === 0) {
      setError('No applications to score');
      return null;
    }

    try {
      setScoring(true);
      setError(null);

      // Fetch job details for description
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('description, title, requirements')
        .eq('id', jobId)
        .single();

      if (jobError || !jobData) {
        throw new Error('Could not fetch job details');
      }

      const jobDescription = jobData.description || jobData.requirements || jobData.title;

      // Score all applications
      const scoredApplications = [];
      for (const app of applications) {
        const scoreData = await scoreApplication(app.id, app.resume_text, jobDescription);
        if (scoreData) {
          scoredApplications.push({
            ...app,
            score: scoreData
          });
        }
      }

      // Sort by score
      scoredApplications.sort((a, b) => 
        (b.score?.overallScore || 0) - (a.score?.overallScore || 0)
      );

      return scoredApplications;
    } catch (err) {
      const errorMsg = err.message || 'Error scoring applications';
      setError(errorMsg);
      console.error('Batch scoring error:', err);
      return null;
    } finally {
      setScoring(false);
    }
  }, [scoreApplication]);

  /**
   * Fetch previously scored applications
   */
  const fetchScores = useCallback(async (applicationIds) => {
    try {
      setScoring(true);
      const { data, error: dbError } = await supabase
        .from('application_scores')
        .select('*')
        .in('application_id', applicationIds);

      if (dbError) {
        console.error('Error fetching scores:', dbError);
        return {};
      }

      // Transform to map
      const scoresMap = {};
      data?.forEach(score => {
        scoresMap[score.application_id] = {
          overallScore: score.overall_score,
          scores: {
            technical: score.technical_score,
            experience: score.experience_score,
            education: score.education_score,
            completeness: score.completeness_score,
            relevance: score.relevance_score
          },
          ranking: score.ranking,
          confidence: score.confidence,
          breakdown: {
            matchedSkills: score.matched_skills,
            missingSkills: score.missing_skills,
            experienceDiff: score.experience_diff,
            educationMatch: score.education_match,
            keywordMatches: score.keyword_matches
          },
          metadata: score.metadata,
          scoredAt: score.scored_at
        };
      });

      setScores(prev => ({ ...prev, ...scoresMap }));
      return scoresMap;
    } catch (err) {
      console.error('Error fetching scores:', err);
      return {};
    } finally {
      setScoring(false);
    }
  }, []);

  /**
   * Get cached score
   */
  const getScore = useCallback((applicationId) => {
    return scores[applicationId] || null;
  }, [scores]);

  /**
   * Clear cached scores
   */
  const clearScores = useCallback(() => {
    setScores({});
    setError(null);
  }, []);

  return {
    scoring,
    error,
    scores,
    scoreApplication,
    scoreJob,
    fetchScores,
    getScore,
    clearScores
  };
};

export default useResumeScoring;
