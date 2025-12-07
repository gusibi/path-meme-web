import React, { useEffect, useState } from 'react';
import { X, Hash, ChevronRight } from 'lucide-react';
import { getAllTags } from '../services/mockGithub';

interface TagListProps {
  onClose: () => void;
  onSelectTag: (tag: string) => void;
}

const TagList: React.FC<TagListProps> = ({ onClose, onSelectTag }) => {
  const [tags, setTags] = useState<{name: string, count: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTags().then(data => {
      setTags(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-path-dark flex flex-col animate-bounce-soft">
      {/* Header */}
      <div className="h-16 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 sticky top-0 bg-white/90 dark:bg-path-dark/90 backdrop-blur-md z-10">
         <span className="font-serif font-bold text-xl text-gray-800 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-path-red flex items-center justify-center text-white">
              <Hash size={16} />
            </div>
            All Tags
         </span>
         <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
           <X size={20} />
         </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50 dark:bg-transparent">
         {loading ? (
             <div className="flex justify-center py-12">
               <div className="w-8 h-8 border-2 border-path-red border-t-transparent rounded-full animate-spin"></div>
             </div>
         ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
                 {tags.map(tag => (
                     <button 
                        key={tag.name}
                        onClick={() => onSelectTag(tag.name)}
                        className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-path-cardDark border border-gray-100 dark:border-gray-800 hover:border-path-red dark:hover:border-path-red hover:shadow-md transition-all group text-left"
                     >
                        <div className="flex items-center gap-3">
                           <span className="text-gray-300 dark:text-gray-600 group-hover:text-path-red transition-colors">
                              <Hash size={18} />
                           </span>
                           <span className="font-bold text-gray-700 dark:text-gray-200 text-lg capitalize">
                              {tag.name}
                           </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="bg-gray-100 dark:bg-black/30 px-2.5 py-1 rounded-md text-xs text-gray-500 dark:text-gray-400 font-bold tabular-nums">
                             {tag.count}
                          </span>
                          <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
                        </div>
                     </button>
                 ))}
             </div>
         )}
      </div>
    </div>
  )
}

export default TagList;
