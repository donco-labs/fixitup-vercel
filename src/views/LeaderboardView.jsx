import React from 'react';
import { Zap } from 'lucide-react';

export default function LeaderboardView({ leaderboard, currentUser }) {
    const topPerformers = leaderboard.slice(0, 10);
    const loserboard = [...leaderboard].sort((a, b) => a.points - b.points).slice(0, 5);

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#333', marginBottom: '16px' }}>
                🏆 Hall of Fame
            </h2>

            {topPerformers.map((user, index) => (
                <div
                    key={user.username}
                    className="slide-up"
                    style={{
                        background: user.username === currentUser?.username
                            ? 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'
                            : 'white',
                        borderRadius: '16px',
                        padding: '16px',
                        marginBottom: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        animationDelay: `${index * 0.05}s`,
                        border: user.username === currentUser?.username ? '2px solid #ff6b35' : 'none'
                    }}
                >
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: index < 3
                            ? `linear-gradient(135deg, ${['#ffd700', '#c0c0c0', '#cd7f32'][index]} 0%, ${['#ffed4e', '#d7d7d7', '#e6a055'][index]} 100%)`
                            : '#e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: '800',
                        color: index < 3 ? '#333' : '#666',
                        flexShrink: 0
                    }}>
                        {index + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>
                            {user.username}
                            {user.username === currentUser?.username && (
                                <span style={{
                                    marginLeft: '8px',
                                    fontSize: '12px',
                                    color: '#ff6b35',
                                    fontWeight: '600'
                                }}>
                                    (You!)
                                </span>
                            )}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                            Level {user.level} • {user.completedProjects} projects
                        </div>
                    </div>

                    <div style={{
                        fontSize: '20px',
                        fontWeight: '800',
                        color: '#ff6b35',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        {user.points}
                        <Zap size={18} fill="#ff6b35" />
                    </div>
                </div>
            ))}

            <h2 style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#333',
                marginTop: '32px',
                marginBottom: '16px'
            }}>
                😬 Learning Curve
            </h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                Everyone starts somewhere! These brave souls shared their struggles.
            </p>

            {loserboard.map((user, index) => (
                <div
                    key={user.username}
                    className="slide-up"
                    style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '16px',
                        marginBottom: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        animationDelay: `${index * 0.05}s`,
                        opacity: 0.8
                    }}
                >
                    <div style={{
                        fontSize: '32px',
                        flexShrink: 0
                    }}>
                        {['🥴', '😅', '🤦', '💪', '🔧'][index]}
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>
                            {user.username}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                            {user.points} points • Keep going!
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
