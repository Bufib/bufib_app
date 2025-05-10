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
  languageCode: string
  title: string;
  content: string;
  isExternalLink: boolean;
  externalLink?: string;
  readTime?: string
};

// News
export type NewsType = {
  id: number;
  createdAt: string;
  languageCode: string
  title: string;
  content: string;
  imagesUrl?: string[];
  externalUrls?: string[];
  internalUrls?: string[];
};

export type NewsCardType = {
  title: string;
  content: string;
  createdAt: string; 
};


// General
export type Sizes = {
  elementSize: number;
  fontSize: number;
  iconSize: number;
  imageSize: number;
  gap: number;
}


// Answers table
export type AnswerType = {
  id: number;
  questionId: number;
  scholarAnsweredQuestion: string;
  scholarName: string;
  internalUrl?: string[];
  answerText?: string;
  answerStatus: string;
  updatedAt?: string;
  createdAt: string;
};

// Answer Status lookup
export type AnswerStatusType = {
  id: number;
  answerStatus: string;
  createdAt: string;
};

// Categories
export type CategoryType = {
  id: number;
  categoryName: string;
  createdAt: string;
};

// Languages lookup
export type LanguageType = {
  id: number;
  languageCode: string;
};

// PayPal link info
export type PayPalType = {
  id: number;
  link: string;
  createdAt: string;
};

// Pending Notifications
export type PendingNotificationType = {
  id: number;
  title?: string;
  body?: string;
  expoPushToken: string;
  userId: string;
  createdAt: string;
};

// Sent Push Notifications log
export type PushNotificationType = {
  id: number;
  title: string;
  body: string;
  createdAt: string;
};

// Questions (existing Q&A)
export type QuestionType = {
  id: number;
  title: string;
  question: string;
  answer?: string;
  answerSistani?: string;
  answerKhamenei?: string;
  categoryName: string;
  subcategoryName: string;
  languageCode: string;
  createdAt: string;
};


export type SearchResultQAType = {
  id: number;
  title: string;
  question: string;
 
};
// Roles lookup
export type RoleType = {
  id: number;
  role: string;
  createdAt: string;
};

// Scholar Answered Status lookup
export type ScholarAnsweredStatusType = {
  id: number;
  status: string;
  createdAt: string;
};

// Scholar Names & Roles
export type ScholarNameType = {
  id: number;
  name: string;
  role: string;
  createdAt: string;
};

// Statuses for Questions lookup
export type StatusForQuestionType = {
  id: number;
  statusCode: string;
  createdAt: string;
};

// Subcategories
export type SubcategoryType = {
  id: number;
  subcategoryName: string;
  createdAt: string;
};

// User-submitted Questions
export type UserQuestionType = {
  id: number;
  title: string;
  question: string;
  status: string;
  username?: string;
  gender: string;
  age: number;
  marja: string;
  userId: string;
  internalUrl?: string[];
  externalUrl?: string[];
  answer?: string;
  updateAnsweredAt?: string;
  createdAt: string;
};

// Expo Push Tokens per User
export type UserTokenType = {
  id: number;
  expoPushToken: string;
  userId: string;
  createdAt: string;
};

// Application Users
export type UserType = {
  id: number;
  userId: string;
  username: string;
  role: string;
  email: string;
  createdAt: string;
};

// Versioning info
export type VersionType = {
  id: number;
  qAndAVersion: string;
  prayerVersion: string;
  appVersion: string;
};


