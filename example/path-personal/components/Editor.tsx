import React, { useState, useRef } from 'react';
import { PostType } from '../types';
import { X, Save, Tag, Bold, Italic, Link, Quote, Code, List, Image as ImageIcon, Eye, Edit3, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isUploading, setIsUploading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDiary = type === PostType.DIARY;
  const showTitle = type !== PostType.TEXT && !isDiary; 

  const handleSubmit = async () => {
    if (!body.trim()) return;
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 500));
    onSave({
      title: showTitle ? title : null,
      body,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    });
    setIsSaving(false);
  };

  const insertText = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = `${before}${prefix}${selection}${suffix}${after}`;
    setBody(newText);
    
    // Reset focus and selection
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64 = reader.result as string;
        // Insert markdown image syntax
        const imgMarkdown = `\n![${file.name}](${base64})\n`;
        const textarea = textareaRef.current;
        if(textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            setBody(text.substring(0, start) + imgMarkdown + text.substring(end));
        } else {
            setBody(prev => prev + imgMarkdown);
        }
        setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const colorTheme = isDiary ? 'border-purple-500 text-purple-600 dark:text-purple-400' : type === PostType.ARTICLE ? 'border-green-500 text-green-600 dark:text-green-400' : 'border-blue-500 text-blue-600 dark:text-blue-400';
  const btnColor = isDiary ? 'bg-purple-500' : type === PostType.ARTICLE ? 'bg-green-500' : 'bg-blue-500';
  const activeTabClass = "border-b-2 border-path-red text-gray-900 dark:text-white font-bold";
  const inactiveTabClass = "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200";

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-path-cardDark sm:bg-path-bg sm:dark:bg-path-dark flex flex-col animate-bounce-soft">
      {/* Header */}
      <div className="bg-white dark:bg-path-cardDark border-b border-gray-100 dark:border-gray-800 px-4 h-16 flex items-center justify-between sticky top-0 shadow-sm z-10">
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

      {/* Main Container */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-3xl mx-auto w-full p-0 sm:p-6">
        
        {/* Input Area Wrapper */}
        <div className="flex-1 flex flex-col bg-transparent sm:bg-white sm:dark:bg-path-cardDark sm:rounded-xl sm:shadow-sm sm:border sm:border-gray-100 sm:dark:border-gray-800 overflow-hidden">
            
            {/* Top Meta Area */}
            <div className="p-4 sm:px-6 sm:pt-6 pb-2">
                {isDiary && (
                    <div className="mb-4 text-xl font-serif font-bold text-purple-400 opacity-60 select-none">
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                )}
                
                {showTitle && (
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-2xl font-serif font-bold text-gray-800 dark:text-gray-100 placeholder-gray-300 border-none focus:ring-0 bg-transparent mb-2 p-0"
                        autoFocus
                    />
                )}
            </div>

            {/* Toolbar & Tabs */}
            <div className="flex flex-col border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-black/20">
                {/* Tabs */}
                <div className="flex px-4 pt-2 gap-4 text-sm">
                    <button 
                        onClick={() => setActiveTab('write')}
                        className={`pb-2 px-1 transition-colors flex items-center gap-2 ${activeTab === 'write' ? activeTabClass : inactiveTabClass}`}
                    >
                        <Edit3 size={14} /> Write
                    </button>
                    <button 
                        onClick={() => setActiveTab('preview')}
                        className={`pb-2 px-1 transition-colors flex items-center gap-2 ${activeTab === 'preview' ? activeTabClass : inactiveTabClass}`}
                    >
                        <Eye size={14} /> Preview
                    </button>
                </div>

                {/* Formatting Tools (Only visible in Write mode) */}
                {activeTab === 'write' && (
                    <div className="px-4 py-2 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar border-t border-gray-100 dark:border-gray-800">
                        <ToolButton icon={<Bold size={16} />} onClick={() => insertText('**', '**')} tooltip="Bold" />
                        <ToolButton icon={<Italic size={16} />} onClick={() => insertText('*', '*')} tooltip="Italic" />
                        <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
                        <ToolButton icon={<Quote size={16} />} onClick={() => insertText('> ')} tooltip="Quote" />
                        <ToolButton icon={<Code size={16} />} onClick={() => insertText('`', '`')} tooltip="Code" />
                        <ToolButton icon={<List size={16} />} onClick={() => insertText('- ')} tooltip="List" />
                        <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
                        <ToolButton icon={<Link size={16} />} onClick={() => insertText('[', '](url)')} tooltip="Link" />
                        <ToolButton 
                            icon={isUploading ? <Loader2 size={16} className="animate-spin"/> : <ImageIcon size={16} />} 
                            onClick={handleImageClick} 
                            tooltip="Image" 
                        />
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                        />
                    </div>
                )}
            </div>

            {/* Editor / Preview Content */}
            <div className="flex-1 relative overflow-y-auto">
                {activeTab === 'write' ? (
                    <textarea
                        ref={textareaRef}
                        placeholder="What's happening? (Markdown is supported)"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="w-full h-full p-4 sm:p-6 text-base leading-relaxed text-gray-700 dark:text-gray-300 placeholder-gray-300 border-none focus:ring-0 bg-transparent resize-none font-sans"
                    />
                ) : (
                    <div className="w-full h-full p-4 sm:p-6 prose prose-lg dark:prose-invert max-w-none">
                        {body ? <ReactMarkdown>{body}</ReactMarkdown> : <span className="text-gray-400 italic">Nothing to preview</span>}
                    </div>
                )}
            </div>

            {/* Footer: Tags */}
            <div className="p-3 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
               <Tag size={16} className="text-gray-400" />
               <input
                 type="text"
                 placeholder="Add tags (comma separated)..."
                 value={tags}
                 onChange={(e) => setTags(e.target.value)}
                 className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-600 dark:text-gray-400 placeholder-gray-400"
               />
            </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Toolbar
const ToolButton = ({ icon, onClick, tooltip }: { icon: React.ReactNode, onClick: () => void, tooltip: string }) => (
    <button 
        onClick={onClick}
        title={tooltip}
        className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-path-red transition-colors"
    >
        {icon}
    </button>
);

export default Editor;