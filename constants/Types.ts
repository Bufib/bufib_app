
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
  externalLink: boolean;
};

export type NewsArticlesType = {
  id: number;
  createdAt: string;
  title: string;
  content: string;
  externalLink: boolean;
};

// News
export type News = {
  id: number;
  createdAt: string;
  images_url?: string[];
  title_arabic?: string;
  content_arabic?: string;
  title_english?: string;
  content_english?: string;
  title_german?: string;
  content_german?: string;
  external_url?: string[];
  internal_url?: string[];
};

