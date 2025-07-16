
import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Questionnaire } from './components/Questionnaire';
import { RecommendationPage } from './components/RecommendationPage';
import { UserAnswers } from './types';

type AppState = 'landing' | 'questionnaire' | 'recommendation';

const ShareModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in" aria-modal="true" role="dialog">
    <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-2xl w-full transform transition-all">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-ion-blue">Share This App</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-ion-blue" aria-label="Close modal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div className="space-y-6 text-left">
        <p className="text-ion-gray-dark">
          To share a live version of this app with others, you can use a free tunneling service like <a href="https://ngrok.com/" target="_blank" rel="noopener noreferrer" className="text-ion-blue font-semibold hover:underline">ngrok</a>. It creates a secure, public URL that points to your local web server.
        </p>
        <div>
          <h4 className="font-semibold text-lg text-gray-800 mb-2">Step 1: Run Your Local Server</h4>
          <p className="text-sm text-ion-gray-dark">First, make sure this application's development server is running. It's likely on a specific port, for example, <code>http://localhost:3000</code>.</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg text-gray-800 mb-2">Step 2: Install and Run ngrok</h4>
          <p className="text-sm text-ion-gray-dark">In a new terminal window, run the ngrok command, replacing <code>3000</code> with your server's port number if it's different.</p>
          <pre className="bg-ion-gray-light p-3 rounded-md text-sm text-gray-700 mt-2 font-mono"><code>ngrok http 3000</code></pre>
        </div>
        <div>
          <h4 className="font-semibold text-lg text-gray-800 mb-2">Step 3: Share the URL</h4>
          <p className="text-sm text-ion-gray-dark">Ngrok will provide a public URL (e.g., <code>https://ab12-c3d4-e5f6.ngrok-free.app</code>). Share this link with anyone you want to give access to the app.</p>
        </div>
      </div>
      <div className="mt-8 text-right">
        <button onClick={onClose} className="px-6 py-2 bg-ion-blue text-white font-semibold rounded-md hover:bg-ion-blue-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ion-blue">
          Got It
        </button>
      </div>
    </div>
  </div>
);


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [answers, setAnswers] = useState<UserAnswers | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleStart = () => {
    setAppState('questionnaire');
  };

  const handleComplete = (finalAnswers: UserAnswers) => {
    setAnswers(finalAnswers);
    setAppState('recommendation');
  };

  const handleRestart = () => {
    setAnswers(null);
    setAppState('landing');
  };

  const renderContent = () => {
    switch (appState) {
      case 'landing':
        return <LandingPage onStart={handleStart} />;
      case 'questionnaire':
        return <Questionnaire onComplete={handleComplete} />;
      case 'recommendation':
        return answers ? <RecommendationPage answers={answers} onRestart={handleRestart} /> : <LandingPage onStart={handleStart} />;
      default:
        return <LandingPage onStart={handleStart} />;
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans">
       <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-10">
        <h2 className="text-2xl font-bold text-ion-blue">ION <span className="font-light">CTRM</span></h2>
        <button onClick={() => setIsShareModalOpen(true)} className="flex items-center space-x-2 px-3 py-2 rounded-md bg-white border border-ion-gray-medium hover:bg-ion-gray-light transition-colors text-ion-blue font-semibold shadow-sm" aria-label="Share application">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
           <span>Share</span>
        </button>
      </header>
      {renderContent()}
      {isShareModalOpen && <ShareModal onClose={() => setIsShareModalOpen(false)} />}
    </main>
  );
};

export default App;
