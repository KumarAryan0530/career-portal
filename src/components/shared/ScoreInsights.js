// AI-Powered Score Insights Component
// Shows detailed, actionable recommendations for recruiters

import React from 'react';

const styles = {
  container: {
    background: '#f8f9fa',
    padding: '1rem',
    borderRadius: '12px',
    marginTop: '1rem',
    border: '1px solid #e0e0e0'
  },
  title: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  insightGrid: {
    display: 'grid',
    gap: '0.75rem'
  },
  insight: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-start',
    padding: '0.75rem',
    background: '#fff',
    borderRadius: '8px',
    borderLeft: '3px solid #C41E3A'
  },
  insightIcon: {
    fontSize: '1.25rem',
    marginTop: '0.125rem',
    flexShrink: 0
  },
  insightContent: {
    flex: 1
  },
  insightLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '0.25rem'
  },
  insightText: {
    fontSize: '0.85rem',
    color: '#666',
    lineHeight: '1.4'
  },
  skillTag: {
    display: 'inline-block',
    background: '#E8F5E9',
    color: '#2E7D32',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    marginRight: '0.5rem',
    marginTop: '0.25rem'
  },
  missingSkillTag: {
    background: '#FFEBEE',
    color: '#C41E3A'
  },
  recommendation: {
    padding: '0.75rem',
    background: '#FFF8E1',
    borderLeft: '3px solid #FBC02D',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: '#5D4037',
    marginTop: '0.75rem'
  }
};

const ScoreInsights = ({ score, job }) => {
  if (!score) return null;

  const {
    overallScore,
    technicalScore,
    experienceScore,
    educationScore,
    completenessScore,
    ranking,
    keyMatches = [],
    missingSkills = [],
    confidenceLevel = 0
  } = score;

  // Generate AI insights based on scoring
  const generateInsights = () => {
    const insights = [];

    // Strength insights
    if (technicalScore >= 85) {
      insights.push({
        type: 'strength',
        icon: '⭐',
        label: 'Exceptional Technical Skills',
        text: `Candidate has strong technical alignment (${technicalScore}/100). Well-matched on required technologies.`
      });
    }

    if (experienceScore >= 80) {
      insights.push({
        type: 'strength',
        icon: '📈',
        label: 'Relevant Experience',
        text: `Experience level matches job requirements (${experienceScore}/100). Has practical background in the field.`
      });
    }

    if (educationScore >= 80) {
      insights.push({
        type: 'strength',
        icon: '🎓',
        label: 'Strong Educational Background',
        text: `Education aligns with role requirements (${educationScore}/100). Formal qualifications in place.`
      });
    }

    // Gap insights
    if (technicalScore < 70) {
      insights.push({
        type: 'gap',
        icon: '⚠️',
        label: 'Skills Gap Detected',
        text: `Some technical skills are missing. May require training in specialized areas.`
      });
    }

    if (experienceScore < 60) {
      insights.push({
        type: 'gap',
        icon: '📊',
        label: 'Limited Experience',
        text: `Candidate has less experience than ideal. Good for entry-level roles or mentorship.`
      });
    }

    if (completenessScore < 70) {
      insights.push({
        type: 'gap',
        icon: '📝',
        label: 'Incomplete Resume',
        text: `Resume missing key sections. May not have provided full professional history.`
      });
    }

    // Ranking recommendation
    if (ranking === 'EXCELLENT') {
      insights.push({
        type: 'recommendation',
        icon: '🎯',
        label: 'Top Priority Candidate',
        text: `This is an excellent match. Recommend moving to interview stage. High confidence in success.`
      });
    } else if (ranking === 'STRONG') {
      insights.push({
        type: 'recommendation',
        icon: '✓',
        label: 'Strong Fit',
        text: `Good match for the role. Recommend review before moving to next stage.`
      });
    } else if (ranking === 'GOOD') {
      insights.push({
        type: 'recommendation',
        icon: '→',
        label: 'Viable Candidate',
        text: `Meets basic requirements. Compare with other candidates to make final decision.`
      });
    } else if (overallScore < 60) {
      insights.push({
        type: 'recommendation',
        icon: '⏸️',
        label: 'Likely Poor Fit',
        text: `May not meet role requirements. Consider if willing to invest in training.`
      });
    }

    // Confidence insight
    if (confidenceLevel < 70) {
      insights.push({
        type: 'note',
        icon: '💡',
        label: 'Lower Confidence Score',
        text: `Some uncertainty in scoring. Resume may have unusual format. Manual review recommended.`
      });
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <span>🤖</span>
        <span>AI Insights & Recommendations</span>
      </div>
      
      <div style={styles.insightGrid}>
        {insights.map((insight, idx) => (
          <div key={idx} style={styles.insight}>
            <div style={styles.insightIcon}>{insight.icon}</div>
            <div style={styles.insightContent}>
              <div style={styles.insightLabel}>{insight.label}</div>
              <div style={styles.insightText}>{insight.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Matches */}
      {keyMatches && keyMatches.length > 0 && (
        <div style={styles.recommendation}>
          <strong>✓ Matched Skills: </strong>
          <div style={{ marginTop: '0.5rem' }}>
            {keyMatches.slice(0, 8).map((skill, idx) => (
              <span key={idx} style={styles.skillTag}>
                {skill}
              </span>
            ))}
            {keyMatches.length > 8 && (
              <span style={styles.skillTag}>
                +{keyMatches.length - 8} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {missingSkills && missingSkills.length > 0 && (
        <div style={styles.recommendation}>
          <strong>✕ Missing/Weak Skills: </strong>
          <div style={{ marginTop: '0.5rem' }}>
            {missingSkills.slice(0, 5).map((skill, idx) => (
              <span key={idx} style={{ ...styles.skillTag, ...styles.missingSkillTag }}>
                {skill}
              </span>
            ))}
            {missingSkills.length > 5 && (
              <span style={{ ...styles.skillTag, ...styles.missingSkillTag }}>
                +{missingSkills.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* HR Action Items */}
      <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#E3F2FD', borderRadius: '8px', fontSize: '0.85rem', color: '#1565C0' }}>
        <strong>💼 Suggested Next Step:</strong>
        {overallScore >= 85 && ' Schedule interview immediately'}
        {overallScore >= 75 && overallScore < 85 && ' Review background and schedule interview'}
        {overallScore >= 60 && overallScore < 75 && ' Compare with other candidates'}
        {overallScore < 60 && ' Consider for alternative roles or pass'}
      </div>
    </div>
  );
};

export default ScoreInsights;
