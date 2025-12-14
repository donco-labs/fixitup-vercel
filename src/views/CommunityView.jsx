import React from 'react';
import { Users, Zap, ThumbsUp, MessageCircle } from 'lucide-react';

export default function CommunityView({ posts, onLike }) {
    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#333', marginBottom: '16px' }}>
                Community Feed
            </h2>

            {posts.length === 0 ? (
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '40px 20px',
                    textAlign: 'center',
                    border: '2px dashed #ddd'
                }}>
                    <Users size={48} color="#ccc" style={{ marginBottom: '16px' }} />
                    <p style={{ color: '#666' }}>No posts yet. Be the first to share!</p>
                </div>
            ) : (
                posts.map((post, index) => (
                    <div
                        key={post.id}
                        className="slide-up"
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '16px',
                            marginBottom: '16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            animationDelay: `${index * 0.05}s`
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: '800',
                                fontSize: '16px'
                            }}>
                                {post.username[0].toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '15px', fontWeight: '700', color: '#333' }}>
                                    {post.username}
                                </div>
                                <div style={{ fontSize: '12px', color: '#999' }}>
                                    {new Date(post.date).toLocaleDateString()}
                                </div>
                            </div>
                            <div style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                background: post.type === 'win' ? '#4caf5020' : '#ff980020',
                                color: post.type === 'win' ? '#4caf50' : '#ff9800',
                                fontSize: '13px',
                                fontWeight: '600'
                            }}>
                                {post.type === 'win' ? '🎉 Win' : '😅 Fail'}
                            </div>
                        </div>

                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#333', marginBottom: '8px' }}>
                            {post.project.title}
                        </h3>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                            {post.project.description}
                        </p>

                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            borderRadius: '12px',
                            background: post.project.points >= 0 ? '#4caf5015' : '#f4433615',
                            color: post.project.points >= 0 ? '#4caf50' : '#f44336',
                            fontSize: '16px',
                            fontWeight: '800',
                            marginBottom: '12px'
                        }}>
                            {post.project.points >= 0 ? '+' : ''}{post.project.points}
                            <Zap size={16} fill={post.project.points >= 0 ? '#4caf50' : '#f44336'} />
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '16px',
                            paddingTop: '12px',
                            borderTop: '1px solid #f0f0f0'
                        }}>
                            <button
                                onClick={() => onLike(post.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    cursor: 'pointer',
                                    color: '#666',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    padding: '4px 8px',
                                    borderRadius: '8px',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                            >
                                <ThumbsUp size={16} />
                                {post.likes}
                            </button>
                            <button
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    cursor: 'pointer',
                                    color: '#666',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    padding: '4px 8px',
                                    borderRadius: '8px'
                                }}
                            >
                                <MessageCircle size={16} />
                                Comment
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
