import React from 'react';

export default function StatCard({ icon, value, label, color }) {
    return (
        <div className="slide-up" style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: `2px solid ${color}20`
        }}>
            <div style={{
                color: color,
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `${color}15`
            }}>
                {icon}
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#333', marginBottom: '4px' }}>
                {value}
            </div>
            <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>{label}</div>
        </div>
    );
}
