import React, { useState, useEffect } from 'react';
import { Home, Trophy, Users, Plus, Star } from 'lucide-react';
import { storage } from './utils/storage';
import { checkAndAwardBadges } from './utils/gamification';

import NavButton from './components/NavButton';
import NewProjectModal from './components/NewProjectModal';
import ChangelogModal from './components/ChangelogModal';
import HomeView from './views/HomeView';
import LeaderboardView from './views/LeaderboardView';
import CommunityView from './views/CommunityView';

import './index.css';

export default function FixItUpApp() {
    const [currentView, setCurrentView] = useState('home');
    const [userProfile, setUserProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [communityPosts, setCommunityPosts] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [showNewProject, setShowNewProject] = useState(false);
    const [showChangelog, setShowChangelog] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load user data on mount
    useEffect(() => {
        loadUserData();
        loadCommunityData();
        loadLeaderboard();
    }, []);

    const loadUserData = async () => {
        try {
            const profile = await storage.getProfile();

            // Migration: Ensure badges array exists
            if (!profile.badges) {
                profile.badges = [];
                await storage.saveProfile(profile);
            }

            setUserProfile(profile);

            // Load projects first, then recalculate badges if needed
            try {
                const loadedProjects = await storage.getProjects();
                setProjects(loadedProjects);

                // If user has projects but no badges, recalculate
                if (loadedProjects.length > 0 && (!profile.badges || profile.badges.length === 0)) {
                    const updatedBadges = checkAndAwardBadges(profile, loadedProjects);
                    const updatedProfile = { ...profile, badges: updatedBadges };
                    setUserProfile(updatedProfile);
                    await storage.saveProfile(updatedProfile);
                }
            } catch (error) {
                setProjects([]);
            }
        } catch (error) {
            // No profile exists, create new user
            const newProfile = {
                username: 'DIYer' + Math.floor(Math.random() * 1000),
                points: 0,
                level: 1,
                streak: 0,
                completedProjects: 0,
                badges: []
            };
            try {
                await storage.saveProfile(newProfile);
            } catch (storageError) {
                console.log('Could not save new profile:', storageError);
            }
            setUserProfile(newProfile);
            setProjects([]);
        }

        setLoading(false);
    };

    const loadCommunityData = async () => {
        try {
            setCommunityPosts(await storage.getCommunityPosts());
        } catch (error) {
            setCommunityPosts([]);
        }
    };

    const loadLeaderboard = async () => {
        try {
            setLeaderboard(await storage.getLeaderboard());
        } catch (error) {
            setLeaderboard([]);
        }
    };

    const addProject = async (projectData) => {
        try {
            const newProject = {
                ...projectData,
                id: Date.now(),
                date: new Date().toISOString(),
                username: userProfile.username
            };

            const updatedProjects = [newProject, ...projects];
            setProjects(updatedProjects);

            await storage.saveProjects(updatedProjects);

            // Update user profile
            const newPoints = userProfile.points + projectData.points;
            const completedCount = userProfile.completedProjects + 1;

            // Check for badges
            const tempProfile = {
                ...userProfile,
                points: newPoints,
                completedProjects: completedCount
            };
            const newBadges = checkAndAwardBadges(tempProfile, updatedProjects);

            const updatedProfile = {
                ...userProfile,
                points: newPoints,
                completedProjects: completedCount,
                level: Math.floor(newPoints / 100) + 1,
                badges: newBadges
            };
            setUserProfile(updatedProfile);

            await storage.saveProfile(updatedProfile);

            // Update leaderboard
            await updateLeaderboard(updatedProfile);

            setShowNewProject(false);

            // Show badge notification if new badges earned
            if (newBadges.length > (userProfile.badges?.length || 0)) {
                const earnedBadge = newBadges[newBadges.length - 1];
                setTimeout(() => {
                    alert(`🏆 Badge Earned: ${earnedBadge}!`);
                }, 500);
            }
        } catch (error) {
            console.error('Error adding project:', error);
            alert('Error adding project: ' + error.message);
        }
    };

    const updateLeaderboard = async (profile) => {
        try {
            let currentLeaderboard = leaderboard;
            const existingIndex = currentLeaderboard.findIndex(u => u.username === profile.username);

            if (existingIndex >= 0) {
                currentLeaderboard[existingIndex] = profile;
            } else {
                currentLeaderboard.push(profile);
            }

            currentLeaderboard.sort((a, b) => b.points - a.points);
            setLeaderboard(currentLeaderboard);
            await storage.saveLeaderboard(currentLeaderboard);
        } catch (error) {
            console.log('Error updating leaderboard');
        }
    };

    const shareToFeed = async (project, type = 'win') => {
        try {
            // Check if already shared
            if (project.shared) {
                alert('You\'ve already shared this project!');
                return;
            }

            const post = {
                id: Date.now(),
                username: userProfile.username,
                points: userProfile.points,
                level: userProfile.level,
                project: project,
                type: type,
                likes: 0,
                comments: [],
                date: new Date().toISOString()
            };

            const updatedPosts = [post, ...communityPosts].slice(0, 50);
            setCommunityPosts(updatedPosts);
            await storage.saveCommunityPosts(updatedPosts);

            // Mark project as shared
            const updatedProjects = projects.map(p =>
                p.id === project.id ? { ...p, shared: true } : p
            );
            setProjects(updatedProjects);
            await storage.saveProjects(updatedProjects);

            // Show success message
            alert(type === 'win' ? '🎉 Shared your win to the community feed!' : '😅 Shared your epic fail to the community feed!');
        } catch (error) {
            console.error('Error sharing to feed:', error);
            alert('Error sharing to feed. Please try again.');
        }
    };

    const likePost = async (postId) => {
        const updatedPosts = communityPosts.map(post => {
            if (post.id === postId) {
                return { ...post, likes: post.likes + 1 };
            }
            return post;
        });
        setCommunityPosts(updatedPosts);
        await storage.saveCommunityPosts(updatedPosts);
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                fontFamily: '"Space Grotesk", sans-serif',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold'
            }}>
                Loading FixItUp...
            </div>
        );
    }

    return (
        <div style={{
            fontFamily: '"Work Sans", sans-serif',
            maxWidth: '428px',
            margin: '0 auto',
            height: '100vh',
            background: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
                padding: '28px 20px 24px 20px',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '0 0 32px 32px',
                boxShadow: '0 4px 24px rgba(74, 144, 226, 0.2)'
            }}>
                {/* Subtle background pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }}></div>

                {/* Tool illustrations in background */}
                <div style={{
                    position: 'absolute',
                    right: '-20px',
                    top: '10px',
                    opacity: 0.08,
                    fontSize: '120px',
                    transform: 'rotate(15deg)'
                }}>🔧</div>
                <div style={{
                    position: 'absolute',
                    left: '-10px',
                    bottom: '10px',
                    opacity: 0.08,
                    fontSize: '80px',
                    transform: 'rotate(-20deg)'
                }}>🔨</div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Top row: Logo with illustration and Level */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '20px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {/* Stressed homeowner illustration */}
                            <div style={{
                                fontSize: '42px',
                                lineHeight: '1',
                                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))',
                                animation: 'pulse 3s ease-in-out infinite'
                            }}>
                                🏠
                            </div>
                            <div>
                                <div style={{
                                    fontFamily: '"Bebas Neue", cursive',
                                    fontSize: '32px',
                                    letterSpacing: '2px',
                                    fontWeight: 'bold',
                                    lineHeight: '1',
                                    marginBottom: '2px',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.15)'
                                }}>
                                    FIX<span style={{ color: '#ffd54f' }}>IT</span>UP
                                </div>
                                <div style={{
                                    fontSize: '10px',
                                    opacity: 0.85,
                                    fontWeight: '600',
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase'
                                }}>
                                    DIY Homeowner Hub
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(255,255,255,0.25)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '16px',
                            padding: '8px 18px',
                            border: '1px solid rgba(255,255,255,0.3)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{
                                fontSize: '11px',
                                opacity: 0.9,
                                fontWeight: '600',
                                marginBottom: '3px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Level
                            </div>
                            <div style={{
                                fontSize: '22px',
                                fontWeight: '800',
                                lineHeight: '1'
                            }}>
                                {userProfile?.level}
                            </div>
                        </div>
                    </div>

                    {/* Main stats card */}
                    <div style={{
                        background: 'rgba(255,255,255,0.18)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '20px',
                        padding: '18px 20px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)'
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr auto',
                            gap: '20px',
                            alignItems: 'center'
                        }}>
                            {/* Left: User and Points */}
                            <div>
                                <div style={{
                                    fontSize: '13px',
                                    opacity: 0.95,
                                    fontWeight: '600',
                                    marginBottom: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <span style={{ fontSize: '16px' }}>👋</span>
                                    {userProfile?.username}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    gap: '8px'
                                }}>
                                    <div style={{
                                        fontSize: '38px',
                                        fontWeight: '900',
                                        lineHeight: '1',
                                        letterSpacing: '-1px'
                                    }}>
                                        {userProfile?.points}
                                    </div>
                                    <div style={{
                                        fontSize: '13px',
                                        opacity: 0.9,
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Points
                                    </div>
                                </div>
                            </div>

                            {/* Right: Streak */}
                            <div style={{
                                textAlign: 'center',
                                padding: '12px 16px',
                                background: 'linear-gradient(135deg, rgba(255,193,7,0.3) 0%, rgba(255,152,0,0.3) 100%)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.25)',
                                boxShadow: '0 4px 12px rgba(255,152,0,0.15)'
                            }}>
                                <div style={{
                                    fontSize: '28px',
                                    marginBottom: '4px',
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                                }}>
                                    🔥
                                </div>
                                <div style={{
                                    fontSize: '20px',
                                    fontWeight: '900',
                                    lineHeight: '1',
                                    marginBottom: '4px'
                                }}>
                                    {userProfile?.streak}
                                </div>
                                <div style={{
                                    fontSize: '9px',
                                    opacity: 0.95,
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Day Streak
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, overflow: 'auto', paddingBottom: '90px' }}>
                {currentView === 'home' && <HomeView
                    projects={projects}
                    userProfile={userProfile}
                    onShare={shareToFeed}
                    onNewProject={() => setShowNewProject(true)}
                />}
                {currentView === 'leaderboard' && <LeaderboardView leaderboard={leaderboard} currentUser={userProfile} />}
                {currentView === 'community' && <CommunityView posts={communityPosts} onLike={likePost} />}

                {/* Version Footer */}
                <div style={{ textAlign: 'center', margin: '20px', opacity: 0.5 }}>
                    <button
                        onClick={() => setShowChangelog(true)}
                        style={{
                            background: 'none',
                            border: '1px solid #ccc',
                            borderRadius: '12px',
                            padding: '4px 12px',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#666',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <Star size={10} /> v0.3.0-beta • What's New?
                    </button>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '428px',
                background: 'white',
                borderTop: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-around',
                padding: '12px 0',
                zIndex: 100
            }}>
                <NavButton icon={<Home size={24} />} label="Home" active={currentView === 'home'} onClick={() => setCurrentView('home')} />
                <NavButton icon={<Trophy size={24} />} label="Rankings" active={currentView === 'leaderboard'} onClick={() => setCurrentView('leaderboard')} />
                <NavButton icon={<Users size={24} />} label="Community" active={currentView === 'community'} onClick={() => setCurrentView('community')} />
            </div>

            {/* New Project Modal */}
            {showNewProject && (
                <NewProjectModal
                    onClose={() => setShowNewProject(false)}
                    onSubmit={addProject}
                />
            )}

            {/* Changelog Modal */}
            {showChangelog && (
                <ChangelogModal onClose={() => setShowChangelog(false)} />
            )}

            {/* FAB */}
            <button
                onClick={() => setShowNewProject(true)}
                style={{
                    position: 'fixed',
                    bottom: '90px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    zIndex: 99,
                    transition: 'transform 0.2s',
                    animation: 'pulse 2s infinite'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <Plus size={28} />
            </button>
        </div>
    );
}
