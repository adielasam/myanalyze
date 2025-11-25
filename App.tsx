import React, { useState } from 'react';
import { UploadedImage, AnalysisState, ChannelAnalysisState } from './types';
import ThumbnailUpload from './components/ThumbnailUpload';
import AnalysisResults from './components/AnalysisResults';
import { analyzeContent, analyzeChannel } from './services/geminiService';

type Tab = 'optimizer' | 'spy';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('optimizer');
  
  // Optimizer State
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisState>({
    isLoading: false, result: null, error: null,
  });

  // Channel Spy State
  const [channelName, setChannelName] = useState('');
  const [channelAnalysis, setChannelAnalysis] = useState<ChannelAnalysisState>({
    isLoading: false, result: null, error: null
  });

  const handleAnalyzeContent = async () => {
    if (!title && !image) {
        setAnalysis(prev => ({ ...prev, error: "Please provide at least a title or a thumbnail." }));
        return;
    }
    setAnalysis({ isLoading: true, result: null, error: null });
    try {
      const result = await analyzeContent(title, image ? image.base64 : null);
      setAnalysis({ isLoading: false, result, error: null });
    } catch (err: any) {
      setAnalysis({ isLoading: false, result: null, error: err.message || "Analysis failed." });
    }
  };

  const handleAnalyzeChannel = async (name?: string) => {
    const targetName = name || channelName;
    if (!targetName) return;
    
    // If analyzing a suggestion, update the input too
    if (name) setChannelName(name);

    setChannelAnalysis({ isLoading: true, result: null, error: null });
    try {
      const result = await analyzeChannel(targetName);
      setChannelAnalysis({ isLoading: false, result, error: null });
    } catch (err: any) {
      setChannelAnalysis({ isLoading: false, result: null, error: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20 font-sans selection:bg-brand-500 selection:text-white">
      {/* Navbar */}
      <nav className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-600 rounded flex items-center justify-center text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-white">GriotFlow</h1>
          </div>
          <div className="hidden md:flex gap-1 text-sm font-bold tracking-wide">
             <button 
                onClick={() => setActiveTab('optimizer')} 
                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'optimizer' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
             >
                Video Optimizer
             </button>
             <button 
                onClick={() => setActiveTab('spy')} 
                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'spy' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
             >
                Channel Spy
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        
        {/* Tab Switcher (Mobile) */}
        <div className="md:hidden flex p-1 bg-gray-800 rounded-xl mb-8 border border-gray-700">
            <button 
                onClick={() => setActiveTab('optimizer')}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'optimizer' ? 'bg-brand-600 shadow-lg text-white' : 'text-gray-400'}`}
            >
                Optimizer
            </button>
            <button 
                onClick={() => setActiveTab('spy')}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'spy' ? 'bg-brand-600 shadow-lg text-white' : 'text-gray-400'}`}
            >
                Channel Spy
            </button>
        </div>

        {activeTab === 'optimizer' ? (
        // OPTIMIZER VIEW
        <div className="grid lg:grid-cols-12 gap-10 items-start animate-fade-in-up">
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                    <span className="w-1 h-6 bg-brand-500 rounded-full shadow-[0_0_10px_#ff0000]"></span>
                    CONTENT INPUT
                </h2>
                
                <div className="mb-6">
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Video Title</label>
                    <textarea
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Why the Tortoise has a cracked shell..."
                        className="w-full p-4 text-lg border border-gray-600 bg-gray-900 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition min-h-[120px] resize-none placeholder-gray-600 text-white font-serif"
                    />
                </div>

                <div className="mb-8">
                    <ThumbnailUpload image={image} onImageChange={setImage} />
                </div>

                <button
                    onClick={handleAnalyzeContent}
                    disabled={analysis.isLoading || (!title && !image)}
                    className={`
                        w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all duration-200
                        flex items-center justify-center gap-2 uppercase tracking-widest border
                        ${analysis.isLoading 
                            ? 'bg-gray-700 border-gray-600 cursor-not-allowed text-gray-400' 
                            : 'bg-brand-600 border-brand-500 text-white hover:bg-brand-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] active:scale-95'}
                    `}
                >
                    {analysis.isLoading ? 'Analyzing...' : 'Generate Report'}
                </button>
                
                {analysis.error && (
                    <div className="mt-4 p-4 bg-brand-900/30 text-red-200 text-sm rounded-xl border border-brand-900/50 font-medium">
                        {analysis.error}
                    </div>
                )}
            </div>
          </div>

          <div className="lg:col-span-8">
            {analysis.result ? (
                <AnalysisResults result={analysis.result} />
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-800 rounded-3xl bg-gray-800/50 min-h-[500px]">
                    <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-inner border border-gray-700">
                        <span className="text-5xl opacity-30">📊</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Awaiting Content</h3>
                    <p className="text-gray-500 max-w-sm">
                        Input your title and thumbnail to unlock viral insights.
                    </p>
                </div>
            )}
          </div>
        </div>
        ) : (
        // CHANNEL SPY VIEW
        <div className="max-w-5xl mx-auto animate-fade-in-up pb-20">
            <div className="text-center mb-12">
                <h2 className="font-serif text-5xl font-bold text-white mb-4">Spy on Success.</h2>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto">Analyze any channel to uncover their <span className="text-brand-500 font-bold">Winning Formula</span> and find your next viral topic.</p>
            </div>

            <div className="max-w-2xl mx-auto mb-16">
                <div className="bg-gray-800 p-2 rounded-full shadow-2xl border border-gray-700 flex items-center transition-all focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
                    <input 
                        type="text"
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        placeholder="Enter Channel Name (e.g. Nne's Folktales)"
                        className="flex-1 p-4 bg-transparent outline-none text-lg text-white placeholder-gray-600 pl-8 font-medium"
                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeChannel()}
                    />
                    <button 
                        onClick={() => handleAnalyzeChannel()}
                        disabled={channelAnalysis.isLoading || !channelName}
                        className="bg-brand-600 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                    >
                        {channelAnalysis.isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : 'Analyze'}
                    </button>
                </div>
                <div className="flex justify-center gap-3 mt-6 text-xs font-medium uppercase tracking-wider">
                    <span className="text-gray-500 py-1">Trending:</span>
                    <button onClick={() => handleAnalyzeChannel("Nne's Folktales")} className="text-gray-300 hover:text-brand-400 hover:bg-gray-800 bg-gray-800/50 px-3 py-1 rounded border border-gray-700 transition-colors">Nne's Folktales</button>
                    <button onClick={() => handleAnalyzeChannel("African Animation")} className="text-gray-300 hover:text-brand-400 hover:bg-gray-800 bg-gray-800/50 px-3 py-1 rounded border border-gray-700 transition-colors">African Animation</button>
                </div>
                {channelAnalysis.error && (
                    <div className="mt-6 text-center bg-red-900/20 border border-red-900/50 text-red-200 p-3 rounded-lg text-sm">{channelAnalysis.error}</div>
                )}
            </div>

            {channelAnalysis.result && (
                <div className="animate-fade-in-up space-y-8">
                    {/* Key Metrics */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl relative overflow-hidden group border border-gray-700">
                            <h3 className="text-brand-500 font-bold uppercase text-xs tracking-widest mb-4">The Winning Formula</h3>
                            <p className="text-2xl font-serif font-bold leading-snug relative z-10 text-white">{channelAnalysis.result.winningFormula}</p>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
                            <div className="mt-8 pt-6 border-t border-gray-700">
                                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Audience Craving</p>
                                <p className="text-sm text-gray-300 italic">"{channelAnalysis.result.audienceCraving}"</p>
                            </div>
                        </div>
                        <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-xl">
                            <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                High Retention Moments
                            </h3>
                            <ul className="space-y-4">
                                {channelAnalysis.result.mostRewatchedPatterns.map((pat, i) => (
                                    <li key={i} className="flex items-start gap-4 text-gray-300 font-medium group">
                                        <span className="bg-gray-900 text-gray-500 border border-gray-700 w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold shrink-0 group-hover:border-brand-500 group-hover:text-brand-500 transition-colors">
                                            {i+1}
                                        </span>
                                        <span className="py-1">{pat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* What to Create Next */}
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5">
                        <div className="bg-gradient-to-r from-brand-900 to-gray-900 p-10 text-white relative overflow-hidden">
                             <div className="relative z-10">
                                 <h3 className="text-3xl font-bold font-serif mb-2 flex items-center gap-3">
                                    What to Create Next
                                    <span className="bg-white/10 text-xs font-sans font-bold px-2 py-1 rounded backdrop-blur-md uppercase tracking-wide border border-white/10">AI Predicted</span>
                                 </h3>
                                 <p className="text-white/60 max-w-xl">
                                    Top 3 content gaps with high viral potential based on current supply/demand analysis.
                                 </p>
                             </div>
                             <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600 rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                        </div>
                        <div className="divide-y divide-gray-700">
                            {channelAnalysis.result.contentGaps.map((idea, i) => (
                                <div key={i} className="p-8 hover:bg-gray-800/80 transition group bg-gray-800">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="md:w-5/12">
                                            <div className="aspect-video bg-gray-950 rounded-xl shadow-inner border border-gray-800 flex items-center justify-center text-center p-6 relative overflow-hidden group-hover:border-brand-900/50 transition-colors">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                <p className="text-sm text-gray-300 font-medium italic relative z-10">
                                                    {idea.thumbnailIdea}
                                                </p>
                                                <div className="absolute top-3 left-3 bg-brand-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg z-10 uppercase tracking-wide">
                                                    Gap Identified
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:w-7/12 flex flex-col justify-center">
                                            <h4 className="text-2xl font-bold text-white mb-3 font-serif leading-tight group-hover:text-brand-500 transition-colors">
                                                "{idea.title}"
                                            </h4>
                                            <div className="flex items-start gap-3 mb-8">
                                                <span className="text-green-400 bg-green-900/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border border-green-900/30 shrink-0 mt-1">Logic</span>
                                                <p className="text-gray-400 text-sm leading-relaxed">{idea.reason}</p>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    setTitle(idea.title);
                                                    setActiveTab('optimizer');
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className="self-start bg-white text-gray-900 px-6 py-3 rounded-lg font-bold text-sm hover:bg-brand-500 hover:text-white transition-all flex items-center gap-2 shadow-lg transform active:scale-95 duration-200"
                                            >
                                                Optimize This Idea &rarr;
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
        )}
      </main>
    </div>
  );
};

export default App;