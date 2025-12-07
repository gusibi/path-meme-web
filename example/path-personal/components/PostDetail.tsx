import React, { useState, useEffect } from 'react';
import { Post, Comment, PostType } from '../types';
import { checkDiaryPassword, getComments, addComment } from '../services/mockGithub';
import { ArrowLeft, Send, Lock, Calendar, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import ShareModal from './ShareModal';

interface PostDetailProps {
  post: Post;
  user: any;
  onClose: () => void;
  onTagClick: (tag: string) => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, user, onClose, onTagClick }) => {
  const [isLocked, setIsLocked] = useState(post.type === PostType.DIARY && !user?.is_owner);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (!isLocked) {
      loadComments();
    }
  }, [isLocked]);

  const loadComments = async () => {
    setLoadingComments(true);
    const data = await getComments(post.id);
    setComments(data);
    setLoadingComments(false);
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = await checkDiaryPassword(password);
    if (valid) {
      setIsLocked(false);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment = await addComment(post.id, newComment, user || { username: 'Guest', avatar_url: 'https://picsum.photos/50' });
    setComments([...comments, comment]);
    setNewComment('');
  };

  if (isLocked) {
    return (
      <div className="fixed inset-0 z-50 bg-path-bg dark:bg-path-dark flex flex-col items-center justify-center p-6 text-gray-800 dark:text-gray-100">
        <button onClick={onClose} className="absolute top-6 left-6 p-2 text-gray-500 dark:text-gray-400"><ArrowLeft /></button>
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6 text-purple-500">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-serif font-bold mb-2">Private Diary</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-center">This entry is locked. Please enter the password.</p>
        
        <form onSubmit={handleUnlock} className="w-full max-w-xs">
          <input
            type="password"
            placeholder="Password (try: 1234)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 mb-4"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <button type="submit" className="w-full bg-purple-500 text-white font-bold py-3 rounded-lg shadow hover:bg-purple-600 transition-colors">
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-path-cardDark flex flex-col overflow-hidden animate-bounce-soft">
      {/* Nav */}
      <div className="h-16 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 sticky top-0 bg-white/90 dark:bg-path-cardDark/90 backdrop-blur-md z-10">
        <div className="flex items-center">
            <button onClick={onClose} className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <ArrowLeft />
            </button>
            <div className="ml-4 flex items-center gap-3">
            <img src={post.user.avatar_url} className="w-8 h-8 rounded-full" />
            <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{post.user.username}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">{format(new Date(post.created_at), 'MMMM d, yyyy')}</span>
            </div>
            </div>
        </div>
        
        {/* Share Button */}
        <button 
            onClick={() => setShowShare(true)}
            className="p-2 text-path-red hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
        >
            <Share2 size={22} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {post.type === PostType.DIARY && (
            <div className="flex items-center gap-2 text-purple-500 mb-6 font-bold text-sm tracking-wide uppercase">
              <Calendar size={14} /> Diary Entry
            </div>
          )}
          
          {post.title && (
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>
          )}

          <div className="prose prose-lg dark:prose-invert prose-red max-w-none text-gray-700 dark:text-gray-300 font-serif leading-relaxed">
            <ReactMarkdown>{post.body}</ReactMarkdown>
          </div>

          <div className="mt-8 flex gap-2 flex-wrap">
            {post.tags.map(t => (
               <button 
                key={t} 
                onClick={() => onTagClick(t)}
                className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full text-xs font-medium hover:bg-path-red hover:text-white dark:hover:bg-path-red dark:hover:text-white transition-colors"
               >
                 #{t}
               </button>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-gray-800 min-h-[40vh] py-8 px-4">
          <div className="max-w-2xl mx-auto">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
               Comments ({comments.length})
             </h3>
             
             <div className="space-y-6 mb-8">
               {comments.map(c => (
                 <div key={c.id} className="flex gap-3">
                   <img src={c.user.avatar_url} className="w-8 h-8 rounded-full mt-1 border border-white dark:border-gray-700 shadow-sm" />
                   <div className="bg-white dark:bg-gray-800 p-3 rounded-xl rounded-tl-none shadow-sm text-sm border border-gray-100 dark:border-gray-700 flex-1">
                      <div className="font-bold text-gray-800 dark:text-gray-200 mb-1 flex justify-between">
                        {c.user.username}
                        <span className="text-gray-300 font-normal text-xs">{format(new Date(c.created_at), 'h:mm a')}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{c.body}</p>
                   </div>
                 </div>
               ))}
             </div>

             <form onSubmit={handlePostComment} className="relative">
               <input
                 type="text"
                 placeholder="Write a comment..."
                 value={newComment}
                 onChange={e => setNewComment(e.target.value)}
                 className="w-full pl-4 pr-12 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-path-red focus:ring-path-red shadow-sm"
               />
               <button 
                type="submit"
                disabled={!newComment.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-path-red text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-red-600 transition-colors"
               >
                 <Send size={14} />
               </button>
             </form>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShare && (
          <ShareModal 
            post={post} 
            onClose={() => setShowShare(false)} 
          />
      )}
    </div>
  );
};

export default PostDetail;
