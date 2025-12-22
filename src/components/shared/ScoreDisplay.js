// Resume Score Display Component
import React from 'react';
import { getRankingRecommendation } from '../../utils/resumeScorer';
import './ScoreDisplay.css';

export const ScoreDisplay = ({ score, size = 'medium', showBreakdown = true }) => {
  if (!score) {
    return (
      <div className="score-display score-display--empty">
        <span>No score available</span>
      </div>
    );
  }

  const recommendation = getRankingRecommendation(score);
  const sizeClass = `score-display--${size}`;

  return (
    <div className={`score-display ${sizeClass}`}>
      <div className="score-display__main">
        <div className="score-display__circle" style={{ borderColor: recommendation.color }}>
          <div className="score-display__number" style={{ color: recommendation.color }}>
            {score.overallScore}
          </div>
          <div className="score-display__label">Score</div>
        </div>

        <div className="score-display__info">
          <div className="score-display__ranking" style={{ color: recommendation.color }}>
            {score.ranking}
          </div>
          <div className="score-display__message">
            {recommendation.message}
          </div>
          <div className="score-display__confidence">
            Confidence: {score.confidence || 0}%
          </div>
        </div>
      </div>

      {showBreakdown && size !== 'small' && (
        <div className="score-display__breakdown">
          <div className="breakdown-item">
            <span className="breakdown-label">Technical Match</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${score.scores.technical}%` }}
              />
            </div>
            <span className="breakdown-value">{score.scores.technical}%</span>
          </div>

          <div className="breakdown-item">
            <span className="breakdown-label">Experience</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${score.scores.experience}%` }}
              />
            </div>
            <span className="breakdown-value">{score.scores.experience}%</span>
          </div>

          <div className="breakdown-item">
            <span className="breakdown-label">Education</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${score.scores.education}%` }}
              />
            </div>
            <span className="breakdown-value">{score.scores.education}%</span>
          </div>

          <div className="breakdown-item">
            <span className="breakdown-label">Profile Completeness</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${score.scores.completeness}%` }}
              />
            </div>
            <span className="breakdown-value">{score.scores.completeness}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const ScoreDetailedView = ({ score }) => {
  if (!score) {
    return <div className="score-detailed score-detailed--empty">No scoring data</div>;
  }

  const recommendation = getRankingRecommendation(score);
  
  // Safely access scores
  const scores = score.scores || {};
  const breakdown = score.breakdown || {};

  return (
    <div className="score-detailed">
      <div className="score-detailed__header" style={{ borderLeftColor: recommendation.color }}>
        <h3>Resume Score Analysis</h3>
      </div>

      <div className="score-detailed__content">
        {/* Overall Score */}
        <div className="detailed-section">
          <h4>Overall Assessment</h4>
          <div className="score-row">
            <span>Overall Score</span>
            <span style={{ color: recommendation.color, fontWeight: 'bold', fontSize: '1.1rem' }}>
              {score.overallScore}/100
            </span>
          </div>
          <div className="score-row">
            <span>Ranking</span>
            <span style={{ color: recommendation.color, fontWeight: '600' }}>
              {score.ranking}
            </span>
          </div>
          <div className="score-row">
            <span>Recommendation</span>
            <span style={{ color: recommendation.color }}>
              {recommendation.action}
            </span>
          </div>
          <div className="score-row">
            <span>Scoring Confidence</span>
            <span>{score.confidence}%</span>
          </div>
        </div>

        {/* Scoring Breakdown */}
        <div className="detailed-section">
          <h4>Score Breakdown</h4>
          <div className="score-breakdown">
            <div className="breakdown-item detailed">
              <div className="breakdown-header">
                <span>Technical Skills Match</span>
                <span className="score-value">{scores.technical || 0}%</span>
              </div>
              <div className="progress-bar large">
                <div 
                  className="progress-fill" 
                  style={{ width: `${scores.technical || 0}%` }}
                />
              </div>
              <p className="breakdown-note">
                Skills and keyword matching against job requirements
              </p>
            </div>

            <div className="breakdown-item detailed">
              <div className="breakdown-header">
                <span>Experience Match</span>
                <span className="score-value">{scores.experience || 0}%</span>
              </div>
              <div className="progress-bar large">
                <div 
                  className="progress-fill" 
                  style={{ width: `${scores.experience || 0}%` }}
                />
              </div>
              <p className="breakdown-note">
                {score.metadata?.candidateExperience || 'Unknown'} years vs {score.metadata?.requiredExperience || 'N/A'} years required
              </p>
            </div>

            <div className="breakdown-item detailed">
              <div className="breakdown-header">
                <span>Education Match</span>
                <span className="score-value">{scores.education || 0}%</span>
              </div>
              <div className="progress-bar large">
                <div 
                  className="progress-fill" 
                  style={{ width: `${scores.education || 0}%` }}
                />
              </div>
              <p className="breakdown-note">
                {score.metadata?.candidateEducation || 'Unknown'} vs {score.metadata?.requiredEducation || 'N/A'} required
              </p>
            </div>

            <div className="breakdown-item detailed">
              <div className="breakdown-header">
                <span>Profile Completeness</span>
                <span className="score-value">{scores.completeness || 0}%</span>
              </div>
              <div className="progress-bar large">
                <div 
                  className="progress-fill" 
                  style={{ width: `${scores.completeness || 0}%` }}
                />
              </div>
              <p className="breakdown-note">
                Contact information and resume format quality
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="detailed-section">
          <h4>Detailed Analysis</h4>
          <div className="analysis-grid">
            {breakdown.matchedSkills?.length > 0 && (
              <div className="analysis-item success">
                <strong>✓ Matched Skills ({breakdown.matchedSkills.length})</strong>
                <div className="skills-list">
                  {breakdown.matchedSkills.map((skill, idx) => (
                    <span key={idx} className="skill-tag skill-tag--matched">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {breakdown.missingSkills?.length > 0 && (
              <div className="analysis-item warning">
                <strong>✗ Missing Skills ({breakdown.missingSkills.length})</strong>
                <div className="skills-list">
                  {breakdown.missingSkills.map((skill, idx) => (
                    <span key={idx} className="skill-tag skill-tag--missing">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="analysis-item">
              <strong>📊 Keywords Found</strong>
              <p>{breakdown.keywordMatches || 0} relevant keywords matched</p>
            </div>

            <div className="analysis-item">
              <strong>📅 Experience Gap</strong>
              <p>
                {breakdown.experienceDiff > 0 ? '+' : ''}{breakdown.experienceDiff || 0} years
                {breakdown.experienceDiff > 0 ? ' (overqualified)' : breakdown.experienceDiff < 0 ? ' (underqualified)' : ' (meeting requirement)'}
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="detailed-section">
          <h4>Recommendations</h4>
          <div className="recommendation-box" style={{ borderLeftColor: recommendation.color }}>
            <p>{recommendation.message}</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
              Suggested action: <strong>{recommendation.action}</strong>
            </p>
          </div>
        </div>

        {/* Scoring Metadata */}
        <div className="detailed-section metadata">
          <h4>Scoring Information</h4>
          <p style={{ fontSize: '0.85rem', color: '#999' }}>
            Scored at: {score.metadata?.scoredAt ? new Date(score.metadata.scoredAt).toLocaleString() : 'N/A'}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#999' }}>
            Resume word count: {score.metadata?.resumeWordCount || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
