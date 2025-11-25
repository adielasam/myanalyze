import React from 'react';
import { OptimizationResult } from '../types';
import ScoreGauge from './ScoreGauge';

interface AnalysisResultsProps {
  result: OptimizationResult;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Top Score Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 flex flex-col items-center justify-center md:col-span-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-600 to-transparent"></div>
            <ScoreGauge score={result.overallScore} label="Viral Potential" size="lg" />
            <div className={`mt-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                result.overallScore >= 80 
                ? 'bg-green-900/30 text-green-400 border-green-800' 
                : 'bg-red-900/30 text-red-400 border-red-800'
            }`}>
                {result.viralPrediction}
            </div>
        </div>
        <div className="md:col-span-2 bg-gradient-to-br from-brand-900 to-gray-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden flex flex-col justify-between border border-brand-800">
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="font-bold text-2xl tracking-tight text-white">Competitor Benchmark</h3>
                    <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono border border-white/10 text-brand-200">
                        vs. Nne's Folktales
                    </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                         <p className="text-brand-300 text-xs font-bold uppercase mb-2 tracking-wide">Pattern Detected</p>
                         <p className="text-xl font-serif font-bold leading-tight mb-6 text-white border-l-2 border-brand-500 pl-4">"{result.competitorAnalysis.viralPatternUsed}"</p>
                         
                         <div className="flex items-center gap-4">
                            <span className="text-4xl font-bold text-white">{result.competitorAnalysis.styleMatchScore}%</span>
                            <div className="flex-1 h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className="h-full bg-brand-500 rounded-full shadow-[0_0_10px_#ff0000]" 
                                    style={{ width: `${result.competitorAnalysis.styleMatchScore}%` }}
                                ></div>
                            </div>
                         </div>
                    </div>
                    <div className="bg-black/30 rounded-xl p-5 backdrop-blur-sm border border-white/5">
                         <p className="text-xs font-bold text-gray-400 uppercase mb-3">Missing Viral Triggers</p>
                         <ul className="space-y-2">
                            {result.competitorAnalysis.missingViralElements.map((item, i) => (
                                <li key={i} className="text-sm flex items-start gap-2 text-gray-300">
                                    <span className="text-brand-500 mt-0.5">⚠️</span> {item}
                                </li>
                            ))}
                         </ul>
                    </div>
                </div>
             </div>
             {/* Abstract Background Graphic */}
             <div className="absolute right-0 bottom-0 w-80 h-80 bg-brand-600 rounded-full blur-[100px] opacity-20 translate-x-1/3 translate-y-1/3"></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Title Feedback */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
          <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
             <h3 className="font-bold text-xl text-white">Title Audit</h3>
             <ScoreGauge score={result.titleScore} label="Impact" size="sm" />
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
                {result.titleFeedback.emotionalHooks.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-900 text-gray-300 text-xs font-bold rounded-full border border-gray-600">
                    #{tag}
                  </span>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <h4 className="text-xs font-bold text-green-500 uppercase mb-3 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Winning
                    </h4>
                    <ul className="list-disc pl-4 space-y-2 text-sm text-gray-400 marker:text-green-500/50">
                        {result.titleFeedback.strengths.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="text-xs font-bold text-red-500 uppercase mb-3 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Losing
                    </h4>
                    <ul className="list-disc pl-4 space-y-2 text-sm text-gray-400 marker:text-red-500/50">
                        {result.titleFeedback.weaknesses.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Feedback */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
          <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
             <h3 className="font-bold text-xl text-white">Visual Audit</h3>
             <ScoreGauge score={result.thumbnailScore} label="CTR" size="sm" />
          </div>
          <div className="space-y-4 text-sm">
             <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                    <span className="font-bold text-gray-500 block text-xs uppercase mb-2">Face & Emotion</span>
                    <p className="text-gray-300 leading-snug">{result.thumbnailFeedback.faceExpressions}</p>
                 </div>
                 <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                    <span className="font-bold text-gray-500 block text-xs uppercase mb-2">Colors</span>
                    <p className="text-gray-300 leading-snug">{result.thumbnailFeedback.colorUsage}</p>
                 </div>
             </div>
             <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                <span className="font-bold text-gray-500 block text-xs uppercase mb-2">Composition Suggestion</span>
                <p className="text-gray-300">{result.thumbnailFeedback.composition}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Suggested Titles - The "Secret Sauce" */}
      <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-2xl ring-1 ring-white/5">
        <h3 className="font-serif text-3xl font-bold mb-8 text-center text-white">
           Viral Alternatives
        </h3>
        
        <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                 <thead>
                     <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-700">
                         <th className="pb-4 pl-4">Proposed Title</th>
                         <th className="pb-4">Strategy</th>
                         <th className="pb-4">Score</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-700/50">
                     {result.suggestions.betterTitles.map((item, i) => (
                         <tr key={i} className="group hover:bg-white/5 transition-colors">
                             <td className="py-5 pl-4 pr-6 align-top">
                                 <span className="text-white font-bold text-lg block mb-1 group-hover:text-brand-500 transition-colors">
                                    {item.title}
                                 </span>
                                 <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-brand-500"></span>
                                    {item.competitorRef}
                                 </span>
                             </td>
                             <td className="py-5 align-top w-1/4">
                                 <span className="inline-block px-2 py-1 bg-gray-900 text-gray-400 text-xs font-semibold rounded border border-gray-700 group-hover:border-brand-900 group-hover:text-brand-400 transition-colors">
                                     {item.strategy}
                                 </span>
                             </td>
                             <td className="py-5 align-top w-20">
                                 <div className="flex items-center gap-1 font-bold text-brand-500 text-lg">
                                     {item.viralScore}
                                     <span className="text-[10px] text-gray-600 font-normal self-end mb-1">/100</span>
                                 </div>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 grid md:grid-cols-2 gap-8">
             <div>
                <h4 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <span>🔥</span> Keyword Power
                </h4>
                <div className="flex flex-wrap gap-2">
                    {result.suggestions.seoKeywords.map((kw, i) => (
                        <span key={i} className="text-sm px-3 py-1.5 bg-gray-900 text-gray-300 font-medium rounded border border-gray-700 hover:border-brand-500 hover:text-white transition cursor-pointer select-all">
                            {kw}
                        </span>
                    ))}
                </div>
             </div>
             <div>
                <h4 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <span>🎨</span> Thumbnail Fix
                </h4>
                <p className="text-sm text-gray-300 bg-gray-900/50 p-5 rounded-xl border-l-2 border-brand-500">
                    {result.suggestions.thumbnailImprovement}
                </p>
             </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;