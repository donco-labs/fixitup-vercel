import React from 'react';
import { Sparkles, X, Tag, Zap, Smile } from 'lucide-react';

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
                maxWidth: '400px',
                maxHeight: '80vh',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #7c4dff 0%, #651fff 100%)',
                    padding: '24px',
                    color: 'white',
                    position: 'relative'
                }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={24} color="#ffd700" />
                        What's New
                    </h2>
                    <p style={{ opacity: 0.9, fontSize: '14px' }}>Latest updates in v0.3.0-beta</p>

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

                <div style={{ padding: '24px', overflowY: 'auto', maxHeight: '500px' }}>

                    {/* Feature 1 */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <div style={{ background: '#e3f2fd', color: '#2196f3', padding: '6px', borderRadius: '8px' }}>
                                <Zap size={20} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>AI Project Analysis</h3>
                        </div>
                        <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', marginLeft: '36px' }}>
                            No more guessing! Our new AI scans your project description to automatically assign points and complexity.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <div style={{ background: '#fff3e0', color: '#ff9800', padding: '6px', borderRadius: '8px' }}>
                                <Tag size={20} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>Multi-Tag Support</h3>
                        </div>
                        <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', marginLeft: '36px' }}>
                            Projects aren't one-dimensional. Now you can tag them with "Smart Home", "Electrical", "Assembly", and 15+ others!
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <div style={{ background: '#f3e5f5', color: '#9c27b0', padding: '6px', borderRadius: '8px' }}>
                                <Smile size={20} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>Whimsical Levels</h3>
                        </div>
                        <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', marginLeft: '36px' }}>
                            Added new difficulty tiers including <strong>Trivial</strong> (10 pts), <strong>Sweaty</strong> (150 pts), and the coveted <strong>Legendary</strong> (500 pts)!
                        </p>
                    </div>

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
                        Got it, let's build!
                    </button>
                </div>
            </div>
        </div>
    );
}
