import React, { useState, useEffect } from 'react';
import { Home, Trophy, Users, Plus, Wrench, Hammer, Award, Zap, TrendingDown, Camera, MessageCircle, ThumbsUp } from 'lucide-react';

export default function FixItUpApp() {
  const [currentView, setCurrentView] = useState('home');
  const [userProfile, setUserProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showNewProject, setShowNewProject] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user data on mount
  useEffect(() => {
    loadUserData();
    loadCommunityData();
    loadLeaderboard();
  }, []);

  const loadUserData = async () => {
    try {
      const profileResult = await window.storage.get('user-profile');
      const profile = JSON.parse(profileResult.value);
      
      // Migration: Ensure badges array exists
      if (!profile.badges) {
        profile.badges = [];
        await window.storage.set('user-profile', JSON.stringify(profile));
      }
      
      setUserProfile(profile);
      
      // Load projects first, then recalculate badges if needed
      try {
        const projectsResult = await window.storage.get('user-projects');
        const loadedProjects = JSON.parse(projectsResult.value);
        setProjects(loadedProjects);
        
        // If user has projects but no badges, recalculate
        if (loadedProjects.length > 0 && (!profile.badges || profile.badges.length === 0)) {
          const updatedBadges = checkAndAwardBadges(profile, loadedProjects);
          const updatedProfile = { ...profile, badges: updatedBadges };
          setUserProfile(updatedProfile);
          await window.storage.set('user-profile', JSON.stringify(updatedProfile));
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
        await window.storage.set('user-profile', JSON.stringify(newProfile));
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
      const postsResult = await window.storage.get('community-posts', true);
      setCommunityPosts(JSON.parse(postsResult.value));
    } catch (error) {
      setCommunityPosts([]);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const leaderResult = await window.storage.get('leaderboard', true);
      setLeaderboard(JSON.parse(leaderResult.value));
    } catch (error) {
      setLeaderboard([]);
    }
  };

  const checkAndAwardBadges = (profile, allProjects) => {
    const newBadges = [...(profile.badges || [])];
    
    // First Project badge
    if (profile.completedProjects === 1 && !newBadges.includes('First Steps')) {
      newBadges.push('First Steps');
    }
    
    // 10 Projects badge
    if (profile.completedProjects === 10 && !newBadges.includes('Handy Helper')) {
      newBadges.push('Handy Helper');
    }
    
    // 25 Projects badge
    if (profile.completedProjects === 25 && !newBadges.includes('DIY Pro')) {
      newBadges.push('DIY Pro');
    }
    
    // 50 Projects badge
    if (profile.completedProjects === 50 && !newBadges.includes('Master Builder')) {
      newBadges.push('Master Builder');
    }
    
    // Point milestones
    if (profile.points >= 100 && !newBadges.includes('Century Club')) {
      newBadges.push('Century Club');
    }
    
    if (profile.points >= 500 && !newBadges.includes('Point Powerhouse')) {
      newBadges.push('Point Powerhouse');
    }
    
    if (profile.points >= 1000 && !newBadges.includes('Legendary')) {
      newBadges.push('Legendary');
    }
    
    // Category expert badges (5 projects in same category)
    const categories = {};
    allProjects.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    
    Object.entries(categories).forEach(([cat, count]) => {
      if (count >= 5 && !newBadges.includes(`${cat} Expert`)) {
        newBadges.push(`${cat} Expert`);
      }
    });
    
    // Perfect project (no failures)
    const lastProject = allProjects[0];
    if (lastProject && (!lastProject.failures || lastProject.failures.length === 0) && !newBadges.includes('Flawless')) {
      newBadges.push('Flawless');
    }
    
    // Completed an Expert difficulty project
    if (lastProject && lastProject.difficulty === 'Expert' && !newBadges.includes('Expert Tackle')) {
      newBadges.push('Expert Tackle');
    }
    
    return newBadges;
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
      
      try {
        await window.storage.set('user-projects', JSON.stringify(updatedProjects));
      } catch (storageError) {
        // Storage error, but continue
      }

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
      
      try {
        await window.storage.set('user-profile', JSON.stringify(updatedProfile));
      } catch (storageError) {
        // Storage error, but continue
      }

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
      await window.storage.set('leaderboard', JSON.stringify(currentLeaderboard), true);
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
      await window.storage.set('community-posts', JSON.stringify(updatedPosts), true);
      
      // Mark project as shared
      const updatedProjects = projects.map(p => 
        p.id === project.id ? { ...p, shared: true } : p
      );
      setProjects(updatedProjects);
      await window.storage.set('user-projects', JSON.stringify(updatedProjects));
      
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
    await window.storage.set('community-posts', JSON.stringify(updatedPosts), true);
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700;800&family=Bebas+Neue&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes shine {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .slide-up {
          animation: slideUp 0.4s ease-out;
        }

        .project-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .project-card:active {
          transform: scale(0.98);
        }

        .badge {
          transition: transform 0.3s;
        }

        .badge:hover {
          transform: rotate(10deg) scale(1.1);
        }

        .shine {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 200% 100%;
          animation: shine 2s infinite;
        }
      `}</style>

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
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: '80px' }}>
        {currentView === 'home' && <HomeView 
          projects={projects} 
          userProfile={userProfile}
          onShare={shareToFeed}
          onNewProject={() => setShowNewProject(true)}
        />}
        {currentView === 'leaderboard' && <LeaderboardView leaderboard={leaderboard} currentUser={userProfile} />}
        {currentView === 'community' && <CommunityView posts={communityPosts} onLike={likePost} />}
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

function NavButton({ icon, label, active, onClick }) {
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

function HomeView({ projects, userProfile, onShare, onNewProject }) {
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

function StatCard({ icon, value, label, color }) {
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

function ProjectCard({ project, index, onShare }) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (type) => {
    setIsSharing(true);
    await onShare(project, type);
    setIsSharing(false);
  };

  return (
    <div 
      className="project-card slide-up"
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: `2px solid ${project.points >= 0 ? '#4caf50' : '#f44336'}20`,
        animationDelay: `${index * 0.1}s`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#333', marginBottom: '4px' }}>
            {project.title}
          </h3>
          <p style={{ fontSize: '13px', color: '#666' }}>{project.category}</p>
        </div>
        <div style={{
          fontSize: '24px',
          fontWeight: '800',
          color: project.points >= 0 ? '#4caf50' : '#f44336',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {project.points >= 0 ? '+' : ''}{project.points}
          <Zap size={20} fill={project.points >= 0 ? '#4caf50' : '#f44336'} />
        </div>
      </div>

      {project.description && (
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
          {project.description}
        </p>
      )}

      {project.failures && project.failures.length > 0 && (
        <div style={{
          background: '#fff3e0',
          borderRadius: '8px',
          padding: '8px 12px',
          marginBottom: '12px',
          fontSize: '13px',
          color: '#e65100'
        }}>
          <strong>Oops:</strong> {project.failures.join(', ')}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#999' }}>
        <span>{new Date(project.date).toLocaleDateString()}</span>
        <span>•</span>
        <span>{project.difficulty}</span>
      </div>

      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
        {project.shared ? (
          <div style={{
            flex: 1,
            background: '#e0e0e0',
            color: '#999',
            border: 'none',
            borderRadius: '8px',
            padding: '8px',
            fontSize: '13px',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            ✓ Shared to Community
          </div>
        ) : (
          <button
            onClick={() => handleShare(project.points >= 0 ? 'win' : 'fail')}
            disabled={isSharing}
            style={{
              flex: 1,
              background: isSharing ? '#ccc' : (project.points >= 0 ? '#4caf50' : '#ff9800'),
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: isSharing ? 'not-allowed' : 'pointer',
              opacity: isSharing ? 0.7 : 1
            }}
          >
            {isSharing 
              ? 'Sharing...' 
              : (project.points >= 0 ? '🎉 Share Win' : '😅 Share Epic Fail')
            }
          </button>
        )}
      </div>
    </div>
  );
}

function LeaderboardView({ leaderboard, currentUser }) {
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

function CommunityView({ posts, onLike }) {
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

function NewProjectModal({ onClose, onSubmit }) {
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