import React, { useRef, useState } from 'react';
import { Post, PostType } from '../types';
import { X, Download, Twitter, Facebook, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

interface ShareModalProps {
  post: Post;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ post, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null, // Transparent background for the canvas
        scale: 2, // Higher resolution
        useCORS: true, // Attempt to load external images
        logging: false
      });
      const link = document.createElement('a');
      link.download = `path-moment-${post.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    } finally {
      setLoading(false);
    }
  };

  const shareText = `Check out this moment on Path Personal: ${post.title || 'My Diary Entry'} #PathPersonal`;
  const shareUrl = window.location.href;

  const handleTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-bounce-soft">
      
      <div className="w-full max-w-sm bg-white dark:bg-path-cardDark rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
           <div className="flex items-center gap-2 text-path-red font-bold font-serif">
             <Share2 size={20} /> Share Moment
           </div>
           <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
             <X size={20} />
           </button>
        </div>

        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-black/40 flex justify-center">
           
           {/* The Capture Target */}
           <div 
             ref={cardRef} 
             className="bg-[#FBF8F5] p-6 shadow-xl rounded-sm w-full relative"
             style={{ minHeight: '300px' }}
           >
              {/* Paper Texture/Style */}
              <div className="flex items-center gap-3 mb-4">
                 <img 
                    src={post.user.avatar_url} 
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm" 
                    crossOrigin="anonymous" 
                    alt="Avatar"
                  />
                 <div>
                    <div className="font-bold text-gray-800 text-lg font-serif">{post.user.username}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                      {format(new Date(post.created_at), 'MMM d, yyyy').toUpperCase()}
                    </div>
                 </div>
              </div>

              {post.title && (
                <h2 className="text-2xl font-serif font-bold text-path-red mb-3 leading-tight">
                  {post.title}
                </h2>
              )}

              <div className="prose prose-sm prose-p:text-gray-700 prose-headings:text-gray-800 font-serif mb-8 line-clamp-[10]">
                 <ReactMarkdown>{post.body}</ReactMarkdown>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between items-center mt-auto">
                 <span className="font-sans font-bold text-gray-400 text-xs tracking-widest">PATH PERSONAL</span>
                 <div className="w-4 h-4 rounded-full bg-path-red"></div>
              </div>
           </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white dark:bg-path-cardDark border-t border-gray-100 dark:border-gray-700 space-y-3">
           <button 
             onClick={handleDownload}
             disabled={loading}
             className="w-full py-3 bg-path-red hover:bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-70"
           >
             {loading ? 'Generating...' : <><Download size={18} /> Save Image</>}
           </button>
           
           <div className="flex gap-3">
             <button 
               onClick={handleTwitterShare}
               className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
             >
               <Twitter size={18} className="text-blue-400" /> Twitter
             </button>
             <button 
               onClick={handleFacebookShare}
               className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
             >
               <Facebook size={18} className="text-blue-600" /> Facebook
             </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ShareModal;
