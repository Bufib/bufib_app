// Language
export type LanguageContextType = {
  language: string | null;
  setAppLanguage: (lng: string) => Promise<void>;
  ready: boolean;
};
// Gradient
export type UseGradientOptionsType = {
  customGradients?: string[][];
  defaultIndex?: number;
};

// NewsArticle
export type NewsArticlesPreviewType = {
  title: string;
  isExternalLink: boolean;
};

export type NewsArticlesType = {
  id: number;
  createdAt: string;
  title: string;
  content: string;
  isExternalLink: boolean;
  externalLink?: string;
};

// News
export type News = {
  id: number;
  createdAt: string;
  imagesUrl: string[];
  title: string;
  content: string;
  externalUrls?: string[];
  internalUrls?: string[];
};
