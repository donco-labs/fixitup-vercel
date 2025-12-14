import React, { useState } from 'react';
import { Zap } from 'lucide-react';

export default function ProjectCard({ project, index, onShare }) {
    const [isSharing, setIsSharing] = useState(false);

    const handleShare = async (type) => {
        setIsSharing(true);
        await onShare(project, type);
        setIsSharing(false);
    };

    return (
        <div
            className="project-card slide-up"
            style={{
                background: 'white',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: `2px solid ${project.points >= 0 ? '#4caf50' : '#f44336'}20`,
                animationDelay: `${index * 0.1}s`
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#333', marginBottom: '4px' }}>
                        {project.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#666' }}>{project.category}</p>
                </div>
                <div style={{
                    fontSize: '24px',
                    fontWeight: '800',
                    color: project.points >= 0 ? '#4caf50' : '#f44336',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    {project.points >= 0 ? '+' : ''}{project.points}
                    <Zap size={20} fill={project.points >= 0 ? '#4caf50' : '#f44336'} />
                </div>
            </div>

            {project.description && (
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                    {project.description}
                </p>
            )}

            {project.failures && project.failures.length > 0 && (
                <div style={{
                    background: '#fff3e0',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    marginBottom: '12px',
                    fontSize: '13px',
                    color: '#e65100'
                }}>
                    <strong>Oops:</strong> {project.failures.join(', ')}
                </div>
            )}

            <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#999' }}>
                <span>{new Date(project.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{project.difficulty}</span>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                {project.shared ? (
                    <div style={{
                        flex: 1,
                        background: '#e0e0e0',
                        color: '#999',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        textAlign: 'center'
                    }}>
                        ✓ Shared to Community
                    </div>
                ) : (
                    <button
                        onClick={() => handleShare(project.points >= 0 ? 'win' : 'fail')}
                        disabled={isSharing}
                        style={{
                            flex: 1,
                            background: isSharing ? '#ccc' : (project.points >= 0 ? '#4caf50' : '#ff9800'),
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: isSharing ? 'not-allowed' : 'pointer',
                            opacity: isSharing ? 0.7 : 1
                        }}
                    >
                        {isSharing
                            ? 'Sharing...'
                            : (project.points >= 0 ? '🎉 Share Win' : '😅 Share Epic Fail')
                        }
                    </button>
                )}
            </div>
        </div>
    );
}
