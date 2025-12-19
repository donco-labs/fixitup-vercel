import React, { useState } from 'react';
import { Zap, Bot, Loader2, Tag } from 'lucide-react';
import { assessProjectVisibility } from '../utils/aiSimulator';

export default function NewProjectModal({ onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        title: '',
        tags: [], // Multi-select tags
        difficulty: null,
        description: '',
        basePoints: 0,
        failures: [],
        failurePenalties: []
    });

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    // Expanded Tag List
    const availableTags = [
        'Plumbing', 'Electrical', 'Carpentry', 'Painting',
        'Flooring', 'Landscaping', 'HVAC', 'Smart Home',
        'Appliance Repair', 'Furniture Assembly', 'Cleaning',
        'Decorating', 'Security', 'Automotive', 'Drywall',
        'Roofing', 'Masonry', 'Windows & Doors', 'Maintenance'
    ];

    const pointValues = {
        'Trivial': 10,
        'Easy': 25,
        'Medium': 50,
        'Tricky': 75,
        'Hard': 100,
        'Sweaty': 150,
        'Expert': 200,
        'Legendary': 500
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

    const toggleTag = (tag) => {
        if (formData.tags.includes(tag)) {
            setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
        } else {
            setFormData({ ...formData, tags: [...formData.tags, tag] });
        }
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
        if (!formData.difficulty) return 0;
        const base = pointValues[formData.difficulty];
        const penalties = formData.failurePenalties.reduce((sum, p) => sum + p, 0);
        return base + penalties;
    };

    const analyzeProject = async () => {
        if (!formData.title) return;

        setIsAnalyzing(true);
        setAnalysisResult(null);

        try {
            const result = await assessProjectVisibility(formData.title, formData.description);
            setAnalysisResult(result);
            setFormData(prev => ({
                ...prev,
                difficulty: result.difficulty,
                basePoints: pointValues[result.difficulty]
            }));
        } catch (error) {
            console.error("AI Analysis failed", error);
            alert("AI Analysis failed. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.difficulty) return;

        // Ensure at least one tag is selected (or "General")
        const finalTags = formData.tags.length > 0 ? formData.tags : ['General'];

        const projectData = {
            title: formData.title,
            category: finalTags[0], // Keep backward compatibility for older components if needed
            tags: finalTags,
            difficulty: formData.difficulty,
            description: formData.description,
            failures: formData.failures,
            status: 'Completed',
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
                maxHeight: '90vh',
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

                {/* Input Section */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                        Project Name <span style={{ color: '#f44336' }}>*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => {
                            setFormData({ ...formData, title: e.target.value });
                            if (analysisResult) setAnalysisResult(null); // Reset AI if changed
                            if (formData.difficulty) setFormData(prev => ({ ...prev, difficulty: null }));
                        }}
                        placeholder="e.g., Installed new smart doorbell"
                        disabled={isAnalyzing} // Lock input during analysis
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

                {/* Tag Cloud */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                        <Tag size={16} /> Tags (Select all that apply)
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {availableTags.map(tag => {
                            const isSelected = formData.tags.includes(tag);
                            return (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        border: isSelected ? '2px solid #ff6b35' : '1px solid #e0e0e0',
                                        background: isSelected ? '#fff0e6' : 'white',
                                        color: isSelected ? '#e65100' : '#666',
                                        fontSize: '13px',
                                        fontWeight: isSelected ? '600' : '400',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                        Description (Recommended for accurate analysis)
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Tell us details: tools used, complexity, time taken..."
                        disabled={isAnalyzing}
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

                {/* AI Analysis Section */}
                <div style={{ marginBottom: '24px' }}>
                    {!formData.difficulty && !isAnalyzing && (
                        <button
                            onClick={analyzeProject}
                            disabled={!formData.title}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: formData.title ? '#7c4dff' : '#e0e0e0',
                                color: 'white',
                                border: 'none',
                                borderRadius: '16px',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: formData.title ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s',
                                boxShadow: formData.title ? '0 4px 12px rgba(124, 77, 255, 0.3)' : 'none'
                            }}
                        >
                            <Bot size={20} />
                            Analyze Complexity
                        </button>
                    )}

                    {isAnalyzing && (
                        <div style={{
                            width: '100%',
                            padding: '16px',
                            background: '#f8f9fa',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            color: '#666'
                        }}>
                            <Loader2 size={24} className="spin" style={{ animation: 'spin 1s infinite linear' }} />
                            <style>{`@keyframes spin { from {transform:rotate(0deg);} to {transform:rotate(360deg);} }`}</style>
                            <span style={{ fontWeight: '600' }}>AI is analyzing your project...</span>
                        </div>
                    )}

                    {analysisResult && (
                        <div className="slide-up" style={{
                            background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                            borderRadius: '16px',
                            padding: '16px',
                            border: '2px solid #ce93d8',
                            marginBottom: '16px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#7b1fa2' }}>
                                <Bot size={20} />
                                <span style={{ fontWeight: '700', fontSize: '14px' }}>START AI Assessment</span>
                            </div>

                            <div style={{
                                fontSize: '18px',
                                fontWeight: '800',
                                color: '#4a148c',
                                marginBottom: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                Rated: {analysisResult.difficulty}
                                <span style={{
                                    fontSize: '12px',
                                    background: 'rgba(255,255,255,0.5)',
                                    padding: '2px 8px',
                                    borderRadius: '10px'
                                }}>
                                    +{pointValues[analysisResult.difficulty]} pts
                                </span>
                            </div>

                            <p style={{ fontSize: '13px', color: '#6a1b9a', lineHeight: '1.4' }}>
                                "{analysisResult.reasoning}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Failures Section - Only shown after analysis */}
                {formData.difficulty && (
                    <div className="slide-up">
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
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                                color: 'white',
                                fontSize: '18px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
                            }}
                        >
                            Log Project & Earn Points!
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
