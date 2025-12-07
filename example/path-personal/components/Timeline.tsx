import React, { useEffect, useRef, useCallback } from 'react';
import { Post, PostType } from '../types';
import { Clock, MessageCircle, Lock, MoreHorizontal, Sun, Moon, Hash, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

interface TimelineProps {
  posts: Post[];
  onLoadMore: () => void;
  onRefresh: () => void;
  onPostClick: (id: number) => void;
  loading: boolean;
  hasMore: boolean;
  isDarkMode: boolean;
  toggleTheme: () => void;
  selectedTag: string | null;
  onClearTag: () => void;
  onTagClick: (tag: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ 
  posts, onLoadMore, onRefresh, onPostClick, loading, hasMore,
  isDarkMode, toggleTheme, selectedTag, onClearTag, onTagClick
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  // Pull to refresh logic
  const [startY, setStartY] = React.useState(0);
  const [pullDistance, setPullDistance] = React.useState(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && startY > 0) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      if (diff > 0) setPullDistance(Math.min(diff * 0.4, 80));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 60) {
      onRefresh();
    }
    setPullDistance(0);
    setStartY(0);
  };

  return (
    <div 
      className="min-h-screen relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Fixed Red Glass Header */}
      <header className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-path-red/90 dark:bg-path-red/80 backdrop-blur-md z-50 shadow-sm border-b border-white/10 px-4 flex items-center justify-between text-white transition-all">
          <div className="flex items-center w-12">
            {selectedTag && (
              <button 
                onClick={onClearTag} 
                className="p-2 -ml-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Back to feed"
              >
                <ArrowLeft size={24} />
              </button>
            )}
          </div>
          
          <div 
            className="font-serif font-bold text-xl tracking-wider cursor-pointer select-none" 
            onClick={() => window.scrollTo({top:0, behavior:'smooth'})}
          >
             {selectedTag ? `#${selectedTag}` : 'Path'}
          </div>

          <div className="w-12 flex justify-end">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
      </header>

      {/* Pull Indicator */}
      {pullDistance > 0 && (
        <div 
          className="fixed top-20 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-gray-700 text-path-red flex items-center justify-center shadow-lg z-50 transition-transform"
          style={{ transform: `translate(-50%, ${pullDistance}px) rotate(${pullDistance * 3}deg)` }}
        >
          <Clock size={16} />
        </div>
      )}

      {/* Main Content Container */}
      <div className="max-w-xl mx-auto pb-32 pt-28 px-4 relative">
        
        {/* Profile/Hero Section (Clean Design) */}
        <div className="relative text-center mb-12">
          {selectedTag ? (
            <div className="animate-bounce-soft">
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 shadow-inner border border-gray-200 dark:border-gray-700">
                 <Hash size={32} className="text-path-red" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">{posts.length} moments tagged</p>
            </div>
          ) : (
            <div className="animate-bounce-soft">
              <div className="w-24 h-24 mx-auto rounded-full p-1 bg-white dark:bg-gray-800 shadow-xl mb-6 relative z-10">
                <img 
                  src="https://picsum.photos/200/200" 
                  alt="User Avatar" 
                  className="w-full h-full rounded-full object-cover border-4 border-gray-50 dark:border-gray-700"
                />
              </div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">My Life Path</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm tracking-wide font-medium">Collecting moments.</p>
            </div>
          )}
        </div>

        {/* The Vertical Line */}
        <div className="absolute left-8 top-64 bottom-0 w-0.5 bg-path-line dark:bg-path-lineDark -z-10 hidden sm:block"></div>

        {/* Posts */}
        <div className="space-y-8">
          {posts.map((post, index) => {
            const isLast = index === posts.length - 1;
            const isDiary = post.type === PostType.DIARY;
            const isArticle = post.type === PostType.ARTICLE;
            
            return (
              <div 
                key={post.id} 
                ref={isLast ? lastPostRef : null}
                className="relative pl-0 sm:pl-12 group transition-transform hover:-translate-y-1 duration-200"
              >
                {/* Timeline Dot (Desktop only) */}
                <div className={`absolute left-[27px] top-6 w-3 h-3 rounded-full border-2 border-path-bg dark:border-path-dark shadow-sm z-10 hidden sm:block
                  ${isDiary ? 'bg-purple-500' : isArticle ? 'bg-green-500' : 'bg-blue-500'}`}>
                </div>

                {/* Timestamp Floating (Desktop only) */}
                <div className="absolute -left-20 top-5 w-24 text-right pr-4 hidden sm:block">
                  <span className="text-xs font-bold text-path-subtle font-sans">
                    {format(new Date(post.created_at), 'MMM d')}
                  </span>
                  <div className="text-[10px] text-gray-400 dark:text-gray-600">
                    {format(new Date(post.created_at), 'h:mm a')}
                  </div>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-path-cardDark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden relative">
                  
                  {/* Mobile Header (Date) */}
                  <div className="sm:hidden px-4 pt-3 flex items-center text-xs text-path-subtle font-bold uppercase tracking-wider">
                    {format(new Date(post.created_at), 'MMM d • h:mm a')}
                  </div>

                  {/* Clickable Area for Detail */}
                  <div className="cursor-pointer" onClick={() => onPostClick(post.id)}>
                     <div className="p-5">
                        {/* Type Label / Tag */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {isDiary && <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><Lock size={10} /> Diary</span>}
                          {post.tags.map(tag => (
                            <button 
                              key={tag} 
                              onClick={(e) => { e.stopPropagation(); onTagClick(tag); }}
                              className="text-[10px] text-gray-400 dark:text-gray-500 hover:text-path-red dark:hover:text-path-red uppercase tracking-wider font-medium hover:underline"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>

                        {post.title && (
                          <h2 className="text-xl font-serif font-bold text-path-dark dark:text-gray-100 mb-2 leading-tight">
                            {post.title}
                          </h2>
                        )}

                        <div className={`prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 ${isDiary ? 'italic opacity-60' : ''}`}>
                          {isDiary ? 'Private Entry. Tap to unlock...' : (
                            <div className="line-clamp-3">
                              {post.body.replace(/[#*`]/g, '')}
                            </div>
                          )}
                        </div>
                     </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50 dark:bg-black/20 px-5 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4 text-gray-400 text-xs font-medium">
                       <span className="flex items-center gap-1">
                          <MessageCircle size={14} /> {post.comments_count}
                       </span>
                       {isDiary && <span className="text-purple-400">Private</span>}
                    </div>
                    <MoreHorizontal size={16} className="text-gray-300 dark:text-gray-600" />
                  </div>
                </div>
              </div>
            );
          })}
          
          {loading && (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-path-red border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;