import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, PenTool, Type, BookLock } from 'lucide-react';
import { PostType } from '../types';

interface PathFabProps {
  onOpenEditor: (type: PostType) => void;
}

const PathFab: React.FC<PathFabProps> = ({ onOpenEditor }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Animation variants for the child buttons
  const menuVariants = {
    hidden: { opacity: 0, scale: 0.5, x: 0, y: 0 },
    visible: (custom: number) => {
      // Calculate position on a quarter circle
      // Radius of expansion
      const radius = 90;
      // Angles: 0 is right, -90 is up. We want roughly -90 to -180 range relative to button center?
      // Actually Path is bottom-left usually, or bottom-right.
      // Assuming Bottom-Right placement: we need angles between 180 (left) and 270 (up).
      // Let's do: Top(-90deg), Top-Left(-135deg), Left(-180deg) relative to the button
      const angle = [270, 225, 180][custom] * (Math.PI / 180); 
      // Adjust for coordinate system
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      return {
        opacity: 1,
        scale: 1,
        x,
        y,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: custom * 0.05
        }
      };
    },
    exit: { opacity: 0, scale: 0.5, x: 0, y: 0, transition: { duration: 0.2 } }
  };

  const buttonClass = "absolute bottom-0 right-0 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white cursor-pointer hover:brightness-110 active:scale-95 transition-all";

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-2 right-2 w-0 h-0">
            {/* Diary Button (Top) */}
            <motion.button
              custom={0}
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => { toggleMenu(); onOpenEditor(PostType.DIARY); }}
              className={`${buttonClass} bg-purple-500`}
              title="Write Diary"
            >
              <BookLock size={20} />
            </motion.button>

            {/* Text Button (Middle) */}
            <motion.button
              custom={1}
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => { toggleMenu(); onOpenEditor(PostType.TEXT); }}
              className={`${buttonClass} bg-blue-500`}
              title="Post Text"
            >
              <Type size={20} />
            </motion.button>

             {/* Article Button (Left) */}
             <motion.button
              custom={2}
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => { toggleMenu(); onOpenEditor(PostType.ARTICLE); }}
              className={`${buttonClass} bg-green-500`}
              title="Write Article"
            >
              <PenTool size={20} />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <motion.button
        onClick={toggleMenu}
        animate={{ rotate: isOpen ? 45 : 0 }}
        className="w-16 h-16 bg-path-red rounded-full shadow-2xl flex items-center justify-center text-white z-50 relative focus:outline-none"
        whileTap={{ scale: 0.9 }}
      >
        <Plus size={32} strokeWidth={3} />
      </motion.button>
    </div>
  );
};

export default PathFab;
