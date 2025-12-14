import React, { useState } from 'react';
import { Zap } from 'lucide-react';

export default function NewProjectModal({ onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        title: '',
        category: 'Plumbing',
        difficulty: 'Easy',
        description: '',
        basePoints: 25,
        failures: [],
        failurePenalties: []
    });

    const categories = ['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Flooring', 'Landscaping', 'HVAC', 'Other'];
    const difficulties = ['Easy', 'Medium', 'Hard', 'Expert'];

    const pointValues = {
        'Easy': 25,
        'Medium': 50,
        'Hard': 100,
        'Expert': 200
    };

    const failurePenalties = {
        'Forgot tool': -5,
        'Dead battery': -8,
        'Wrong part': -10,
        'Broke something': -15,
        'Called professional': -20,
        'Trip to hardware store': -5,
        'Started over': -12
    };

    const addFailure = (failure, penalty) => {
        setFormData({
            ...formData,
            failures: [...formData.failures, failure],
            failurePenalties: [...formData.failurePenalties, penalty]
        });
    };

    const removeFailure = (index) => {
        setFormData({
            ...formData,
            failures: formData.failures.filter((_, i) => i !== index),
            failurePenalties: formData.failurePenalties.filter((_, i) => i !== index)
        });
    };

    const calculateTotalPoints = () => {
        const base = pointValues[formData.difficulty];
        const penalties = formData.failurePenalties.reduce((sum, p) => sum + p, 0);
        return base + penalties;
    };

    const handleSubmit = async () => {
        if (!formData.title) return;

        const projectData = {
            title: formData.title,
            category: formData.category,
            difficulty: formData.difficulty,
            description: formData.description,
            failures: formData.failures,
            points: calculateTotalPoints()
        };

        await onSubmit(projectData);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 1000,
            animation: 'slideUp 0.3s ease-out'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '24px 24px 0 0',
                width: '100%',
                maxHeight: '85vh',
                overflow: 'auto',
                padding: '24px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#333' }}>
                        Log New Project
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: '#f5f5f5',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer',
                            fontSize: '20px',
                            color: '#666'
                        }}
                    >
                        ×
                    </button>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                        Project Name
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Installed new door lock"
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '12px',
                            border: '2px solid #e0e0e0',
                            fontSize: '16px',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                border: '2px solid #e0e0e0',
                                fontSize: '16px',
                                fontFamily: 'inherit',
                                background: 'white'
                            }}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                            Difficulty
                        </label>
                        <select
                            value={formData.difficulty}
                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                border: '2px solid #e0e0e0',
                                fontSize: '16px',
                                fontFamily: 'inherit',
                                background: 'white'
                            }}
                        >
                            {difficulties.map(diff => (
                                <option key={diff} value={diff}>{diff} (+{pointValues[diff]})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                        Description (optional)
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Tell us about your project..."
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '12px',
                            border: '2px solid #e0e0e0',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            minHeight: '80px',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                        Add Failures/Setbacks (optional)
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                        {Object.entries(failurePenalties).map(([failure, penalty]) => (
                            <button
                                key={failure}
                                onClick={() => addFailure(failure, penalty)}
                                style={{
                                    background: '#fff3e0',
                                    border: '2px solid #ff9800',
                                    borderRadius: '8px',
                                    padding: '8px 12px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#e65100',
                                    cursor: 'pointer'
                                }}
                            >
                                {failure} ({penalty})
                            </button>
                        ))}
                    </div>

                    {formData.failures.length > 0 && (
                        <div style={{
                            background: '#ffebee',
                            borderRadius: '12px',
                            padding: '12px',
                            marginTop: '12px'
                        }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#c62828', marginBottom: '8px' }}>
                                Your Setbacks:
                            </div>
                            {formData.failures.map((failure, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '6px'
                                }}>
                                    <span style={{ fontSize: '13px', color: '#666' }}>
                                        {failure} ({formData.failurePenalties[index]} pts)
                                    </span>
                                    <button
                                        onClick={() => removeFailure(index)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#c62828',
                                            cursor: 'pointer',
                                            fontSize: '18px'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '14px', color: '#1565c0', marginBottom: '8px', fontWeight: '600' }}>
                        Total Points
                    </div>
                    <div style={{
                        fontSize: '48px',
                        fontWeight: '800',
                        color: calculateTotalPoints() >= 0 ? '#4caf50' : '#f44336',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        {calculateTotalPoints() >= 0 ? '+' : ''}{calculateTotalPoints()}
                        <Zap size={40} fill={calculateTotalPoints() >= 0 ? '#4caf50' : '#f44336'} />
                    </div>
                </div>

                <button
                    onClick={async () => {
                        await handleSubmit();
                    }}
                    disabled={!formData.title}
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '12px',
                        border: 'none',
                        background: formData.title
                            ? 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)'
                            : '#e0e0e0',
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: '700',
                        cursor: formData.title ? 'pointer' : 'not-allowed',
                        boxShadow: formData.title ? '0 4px 12px rgba(255, 107, 53, 0.3)' : 'none'
                    }}
                >
                    Log Project & Earn Points!
                </button>
            </div>
        </div>
    );
}
