import React from 'react';

export default function NavButton({ icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                color: active ? '#ff6b35' : '#999',
                transition: 'color 0.2s',
                padding: '8px 16px'
            }}
        >
            {icon}
            <span style={{ fontSize: '11px', fontWeight: '600' }}>{label}</span>
        </button>
    );
}
