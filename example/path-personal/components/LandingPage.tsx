import React from 'react';
import { ArrowLeft, Github, Database, Lock, PenTool, Layout, Heart, Server } from 'lucide-react';

interface LandingPageProps {
  onBack: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-path-bg dark:bg-path-dark text-gray-800 dark:text-gray-100 font-sans animate-bounce-soft overflow-y-auto">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-path-cardDark/80 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-serif font-bold text-xl text-path-red">Path Personal</div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-path-red dark:hover:text-path-red transition-colors"
          >
            <ArrowLeft size={18} /> Back to App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-path-red rounded-[2rem] mx-auto mb-8 shadow-xl shadow-red-200 dark:shadow-none flex items-center justify-center text-white">
            <Heart size={40} fill="currentColor" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-gray-900 dark:text-white leading-tight">
            Your Digital Life, <br/>
            <span className="text-path-red">Archived on GitHub.</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed mb-10">
            A personal timeline application that revives the beautiful design of Path, 
            using GitHub Issues as a serverless CMS for your memories, diaries, and thoughts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onBack} className="px-8 py-4 bg-path-red text-white rounded-full font-bold text-lg shadow-lg hover:bg-red-600 transition-all active:scale-95 w-full sm:w-auto">
              Launch App
            </button>
            <a 
              href="https://github.com/your-username/path-personal" 
              target="_blank" 
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-full font-bold text-lg hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Github size={20} /> Star on GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Feature Grid */}
      <section className="py-20 bg-white dark:bg-path-cardDark">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Layout size={32} />}
              title="Classic Design"
              description="A pixel-perfect recreation of the beloved Path UI/UX, focusing on simplicity, warmth, and personal connection."
            />
            <FeatureCard 
              icon={<Database size={32} />}
              title="GitHub Backend"
              description="No database required. Every post, comment, and tag is stored securely as an Issue in your private GitHub Repository."
            />
            <FeatureCard 
              icon={<Lock size={32} />}
              title="Private Diaries"
              description="Write personal thoughts with confidence. Diary entries are locked behind a password, keeping your secrets safe."
            />
             <FeatureCard 
              icon={<PenTool size={32} />}
              title="Markdown Editor"
              description="Write articles with full Markdown support. Add lists, quotes, code blocks, and images easily."
            />
             <FeatureCard 
              icon={<Server size={32} />}
              title="Serverless"
              description="Runs entirely in the browser. Uses the GitHub API for all data operations. Zero infrastructure to maintain."
            />
             <FeatureCard 
              icon={<Github size={32} />}
              title="Open Source"
              description="The code is fully open source. Fork it, customize it, and deploy your own personal timeline in minutes."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto">
           <h2 className="text-3xl font-serif font-bold text-center mb-12">How it works</h2>
           <div className="space-y-8">
              <Step number="01" title="Connect GitHub" desc="Log in with your GitHub Token. The app connects directly to your specified repository." />
              <Step number="02" title="Create Issues" desc="When you post, the app creates a new Issue. Labels are used for tags, and the body is stored as Markdown." />
              <Step number="03" title="Comments & Interaction" desc="GitHub Issue comments are used for the discussion thread on each post." />
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center bg-gray-50 dark:bg-black/20">
        <div className="font-serif font-bold text-gray-300 dark:text-gray-600 text-2xl mb-4">Path Personal</div>
        <p className="text-gray-400 text-sm">
          Designed & Built with ❤️ for the memory of Path.
        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="flex flex-col gap-4">
    <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-path-red flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold font-serif">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
      {description}
    </p>
  </div>
);

const Step = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
  <div className="flex gap-6 items-start">
    <span className="text-4xl font-black text-gray-200 dark:text-gray-800 font-serif leading-none mt-1">{number}</span>
    <div>
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-gray-500 dark:text-gray-400">{desc}</p>
    </div>
  </div>
);

export default LandingPage;
