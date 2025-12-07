import React, { useState } from 'react';
import { PostType } from '../types';
import { X, Save, Tag } from 'lucide-react';

interface EditorProps {
  type: PostType;
  onClose: () => void;
  onSave: (data: { title: string | null; body: string; tags: string[] }) => void;
}

const Editor: React.FC<EditorProps> = ({ type, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isDiary = type === PostType.DIARY;
  const showTitle = type !== PostType.TEXT && !isDiary; // Diary auto-titles, Text has no title

  const handleSubmit = async () => {
    if (!body.trim()) return;
    setIsSaving(true);
    
    // Simulate processing
    await new Promise(r => setTimeout(r, 500));
    
    onSave({
      title: showTitle ? title : null,
      body,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    });
    setIsSaving(false);
  };

  const colorTheme = isDiary ? 'border-purple-500 text-purple-600 dark:text-purple-400' : type === PostType.ARTICLE ? 'border-green-500 text-green-600 dark:text-green-400' : 'border-blue-500 text-blue-600 dark:text-blue-400';
  const btnColor = isDiary ? 'bg-purple-500' : type === PostType.ARTICLE ? 'bg-green-500' : 'bg-blue-500';

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-path-cardDark sm:bg-path-bg sm:dark:bg-path-dark flex flex-col animate-bounce-soft">
      {/* Header */}
      <div className="bg-white dark:bg-path-cardDark border-b border-gray-100 dark:border-gray-800 px-4 h-16 flex items-center justify-between sticky top-0 shadow-sm">
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <X size={24} />
        </button>
        <span className={`font-serif font-bold capitalize ${colorTheme.split(' ')[1]}`}>
          New {type}
        </span>
        <button 
          onClick={handleSubmit} 
          disabled={isSaving || !body.trim()}
          className={`px-4 py-2 rounded-full text-white text-sm font-bold flex items-center gap-2 shadow-md hover:brightness-110 disabled:opacity-50 transition-all ${btnColor}`}
        >
          {isSaving ? 'Saving...' : <><Save size={16} /> Post</>}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-2xl mx-auto w-full">
        
        {showTitle && (
          <input
            type="text"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-serif font-bold text-gray-800 dark:text-gray-100 placeholder-gray-300 border-none focus:ring-0 bg-transparent mb-6 p-0"
            autoFocus
          />
        )}

        {isDiary && (
          <div className="mb-6 text-2xl font-serif font-bold text-purple-400 opacity-50 select-none">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        )}

        <textarea
          placeholder="What's on your mind? (Markdown supported)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full h-[60vh] text-lg leading-relaxed text-gray-700 dark:text-gray-300 placeholder-gray-300 border-none focus:ring-0 bg-transparent p-0 resize-none font-sans"
        />

        {/* Tag Input */}
        <div className="mt-8 flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-4">
           <Tag size={18} className="text-gray-400" />
           <input
             type="text"
             placeholder="Add tags (comma separated)..."
             value={tags}
             onChange={(e) => setTags(e.target.value)}
             className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-600 dark:text-gray-400 placeholder-gray-300"
           />
        </div>
      </div>
    </div>
  );
};

export default Editor;
