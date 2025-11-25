export interface TitleSuggestion {
  title: string;
  viralScore: number;
  strategy: string; // e.g., "Curiosity Gap", "Negative Urgency"
  competitorRef: string; // e.g., "Matches Nne's 'Big Mistake' pattern"
}

export interface OptimizationResult {
  overallScore: number;
  titleScore: number;
  thumbnailScore: number;
  titleFeedback: {
    strengths: string[];
    weaknesses: string[];
    emotionalHooks: string[];
  };
  thumbnailFeedback: {
    composition: string;
    textOverlay: string;
    colorUsage: string;
    faceExpressions: string;
  };
  suggestions: {
    betterTitles: TitleSuggestion[];
    seoKeywords: string[];
    thumbnailImprovement: string;
  };
  competitorAnalysis: {
    styleMatchScore: number;
    viralPatternUsed: string; 
    missingViralElements: string[];
  };
  viralPrediction: string;
}

export interface ContentGap {
  title: string;
  reason: string;
  thumbnailIdea: string;
}

export interface ChannelAnalysisResult {
  channelName: string;
  niche: string;
  winningFormula: string;
  mostRewatchedPatterns: string[];
  contentGaps: ContentGap[];
  audienceCraving: string;
}

export interface AnalysisState {
  isLoading: boolean;
  result: OptimizationResult | null;
  error: string | null;
}

export interface ChannelAnalysisState {
  isLoading: boolean;
  result: ChannelAnalysisResult | null;
  error: string | null;
}

export interface UploadedImage {
  file: File;
  previewUrl: string;
  base64: string;
}