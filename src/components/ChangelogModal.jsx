import React from 'react';
import { Sparkles, X, Tag, Zap, Smile, Calendar, AlertTriangle, History, Box, Layout, Home } from 'lucide-react';
import { CHANGELOG } from '../data/changelog';

const IconMap = {
    Sparkles, Tag, Zap, Smile, Calendar, AlertTriangle, History, Box, Layout, Home
};

export default function ChangelogModal({ onClose }) {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div className="slide-up" style={{
                background: 'white',
                borderRadius: '24px',
                width: '90%',
                maxWidth: '450px',
                maxHeight: '85vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #7c4dff 0%, #651fff 100%)',
                    padding: '24px',
                    color: 'white',
                    position: 'relative',
                    flexShrink: 0
                }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={24} color="#ffd700" />
                        What's New
                    </h2>
                    <p style={{ opacity: 0.9, fontSize: '14px' }}>Version History</p>

                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white'
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div style={{ padding: '24px', overflowY: 'auto' }}>
                    {CHANGELOG.map((release, index) => (
                        <div key={release.version} style={{ marginBottom: '32px', borderLeft: index !== CHANGELOG.length - 1 ? '2px solid #f0f0f0' : 'none', paddingLeft: '20px', marginLeft: '4px', position: 'relative' }}>

                            {/* Timeline Dot */}
                            <div style={{
                                position: 'absolute',
                                left: '-5px',
                                top: '0',
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: index === 0 ? '#651fff' : '#e0e0e0',
                                border: '2px solid white'
                            }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#333' }}>v{release.version}</h3>
                                <span style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>{release.date}</span>
                            </div>
                            <h4 style={{ fontSize: '14px', color: '#651fff', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {release.title}
                            </h4>

                            {release.features.map((feature, fIndex) => {
                                const Icon = IconMap[feature.icon] || Sparkles;
                                return (
                                    <div key={fIndex} style={{ marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <Icon size={16} color={index === 0 ? '#651fff' : '#888'} />
                                            <span style={{ fontSize: '15px', fontWeight: '700', color: '#444' }}>{feature.title}</span>
                                        </div>
                                        <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', margin: 0, paddingLeft: '24px' }}>
                                            {feature.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    ))}

                    <button
                        onClick={onClose}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#f5f5f5',
                            color: '#333',
                            fontSize: '15px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            marginTop: '12px'
                        }}
                    >
                        Awesome!
                    </button>
                </div>
            </div>
        </div>
    );
}
