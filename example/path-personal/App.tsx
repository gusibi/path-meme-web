import React, { useEffect, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Post, PostType, User } from './types';
import * as Service from './services/mockGithub';
import Timeline from './components/Timeline';
import PathFab from './components/PathFab';
import Editor from './components/Editor';
import PostDetail from './components/PostDetail';
import TagList from './components/TagList';
import LandingPage from './components/LandingPage';

const App = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // App State
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showTags, setShowTags] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

  // Editor State
  const [editorType, setEditorType] = useState<PostType | null>(null);
  
  // Detail State
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Auth State (Mock)
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Auto-login mock
    Service.login('secret').then(u => setUser(u));
    fetchPosts(1, true);
  }, []);

  const fetchPosts = async (pageNum: number, reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const newPosts = await Service.getPosts(pageNum);
      if (newPosts.length < 20) setHasMore(false);
      
      setPosts(prev => reset ? newPosts : [...prev, ...newPosts]);
      setPage(pageNum);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchPosts(page + 1);
  };

  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    fetchPosts(1, true);
  };

  const handleCreatePost = async (data: { title: string | null; body: string; tags: string[] }) => {
    if (!editorType) return;
    
    const newPost = await Service.createPost({
      title: data.title,
      body: data.body,
      tags: data.tags,
      type: editorType
    });

    setPosts(prev => [newPost, ...prev]);
    setEditorType(null);
  };

  const openPost = async (id: number) => {
    const post = posts.find(p => p.id === id);
    if (post) setSelectedPost(post);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setShowTags(false);
    setSelectedPost(null); // Close detail view if open
    setShowLanding(false); // Ensure we are on timeline
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayedPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter(p => p.tags.includes(selectedTag));
  }, [posts, selectedTag]);

  if (showLanding) {
    return (
      <div className={`${darkMode ? 'dark' : ''}`}>
        <LandingPage onBack={() => setShowLanding(false)} />
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="bg-path-bg dark:bg-path-dark min-h-screen font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300">
        
        {/* Main Feed */}
        <Timeline 
          posts={displayedPosts} 
          onLoadMore={handleLoadMore} 
          onRefresh={handleRefresh}
          onPostClick={openPost}
          loading={loading}
          hasMore={hasMore}
          isDarkMode={darkMode}
          toggleTheme={() => setDarkMode(!darkMode)}
          selectedTag={selectedTag}
          onClearTag={() => setSelectedTag(null)}
          onTagClick={handleTagClick}
          onOpenTags={() => setShowTags(true)}
          onShowAbout={() => setShowLanding(true)}
        />

        {/* Floating Action Button */}
        <PathFab onOpenEditor={setEditorType} />

        {/* Tag List Modal */}
        {showTags && (
          <TagList 
            onClose={() => setShowTags(false)} 
            onSelectTag={handleTagClick} 
          />
        )}

        {/* Editor Modal */}
        {editorType && (
          <Editor 
            type={editorType} 
            onClose={() => setEditorType(null)} 
            onSave={handleCreatePost} 
          />
        )}

        {/* Detail Modal */}
        {selectedPost && (
          <PostDetail 
            post={selectedPost} 
            user={user}
            onClose={() => setSelectedPost(null)}
            onTagClick={handleTagClick}
          />
        )}
      </div>
    </div>
  );
};

export default App;
