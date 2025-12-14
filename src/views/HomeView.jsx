import React from 'react';
import { Hammer, Award, Wrench } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import StatCard from '../components/StatCard';

export default function HomeView({ projects, userProfile, onShare, onNewProject }) {
    return (
        <div style={{ padding: '20px' }}>
            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '24px'
            }}>
                <StatCard
                    icon={<Hammer size={24} />}
                    value={userProfile?.completedProjects || 0}
                    label="Projects Done"
                    color="#4caf50"
                />
                <StatCard
                    icon={<Award size={24} />}
                    value={userProfile?.badges?.length || 0}
                    label="Badges Earned"
                    color="#2196f3"
                />
            </div>

            {/* Badges Section */}
            {userProfile?.badges && userProfile.badges.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#333', marginBottom: '12px' }}>
                        🏆 Your Badges
                    </h3>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                    }}>
                        {userProfile.badges.map((badge, index) => (
                            <div
                                key={index}
                                className="badge"
                                style={{
                                    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#8b6914',
                                    boxShadow: '0 2px 6px rgba(255, 215, 0, 0.3)',
                                    border: '2px solid #ffa500'
                                }}
                            >
                                {badge}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Projects */}
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#333' }}>Your Projects</h2>
            </div>

            {projects.length === 0 ? (
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '40px 20px',
                    textAlign: 'center',
                    border: '2px dashed #ddd'
                }}>
                    <Wrench size={48} color="#ccc" style={{ marginBottom: '16px' }} />
                    <p style={{ color: '#666', marginBottom: '16px' }}>No projects yet!</p>
                    <button
                        onClick={onNewProject}
                        style={{
                            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px 24px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Log Your First Project
                    </button>
                </div>
            ) : (
                projects.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        onShare={onShare}
                    />
                ))
            )}
        </div>
    );
}
