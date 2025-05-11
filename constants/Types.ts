// Language
export type LanguageContextType = {
  language: string | null;
  set_app_language: (lng: string) => Promise<void>;
  ready: boolean;
};
// Gradient
export type UseGradientOptionsType = {
  custom_gradients?: string[][];
  default_index?: number;
};

// NewsArticle
export type NewsArticlesPreviewType = {
  title: string;
  is_external_link: boolean;
};

export type NewsArticlesType = {
  id: number;
  created_at: string;
  language_code: string;
  title: string;
  content: string;
  is_external_link: boolean;
  external_link?: string;
  read_time?: string;
};

// News
export type NewsType = {
  id: number;
  created_at: string;
  title: string;
  content: string;
  images_url?: string[];
  external_urls?: string[];
  internal_urls?: string[];
};

export type NewsCardType = {
  title: string;
  content: string;
  created_at: string;
};

// General
export type Sizes = {
  elementSize: number;
  fontSize: number;
  iconSize: number;
  imageSize: number;
  gap: number;
};

// Answers table
export type AnswerType = {
  id: number;
  question_id: number;
  scholar_answered_question: string;
  scholar_nme: string;
  internal_url?: string[];
  answer_text?: string;
  answer_status: string;
  updated_at?: string;
  created_at: string;
};

// Answer Status lookup
export type AnswerStatusType = {
  id: number;
  answer_status: string;
  created_at: string;
};

// Categories
export type CategoryType = {
  id: number;
  category_name: string;
  created_at: string;
};

// Languages lookup
export type LanguageType = {
  id: number;
  language_code: string;
};

// PayPal link info
export type PayPalType = {
  id: number;
  link: string;
  created_at: string;
};

// Pending Notifications
export type PendingNotificationType = {
  id: number;
  title?: string;
  body?: string;
  expo_push_token: string;
  user_id: string;
  created_at: string;
};

// Sent Push Notifications log
export type PushNotificationType = {
  id: number;
  title: string;
  body: string;
  created_at: string;
};

// Questions (existing Q&A)
export type QuestionType = {
  id: number;
  title: string;
  question: string;
  answer?: string;
  answer_sistani?: string;
  answer_khamenei?: string;
  category_name: string;
  subcategory_name: string;
  language_code: string;
  created_at: string;
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
  created_at: string;
};

// Scholar Answered Status lookup
export type ScholarAnsweredStatusType = {
  id: number;
  status: string;
  created_at: string;
};

// Scholar Names & Roles
export type ScholarNameType = {
  id: number;
  name: string;
  role: string;
  created_at: string;
};

// Statuses for Questions lookup
export type StatusForQuestionType = {
  id: number;
  statusCode: string;
  created_at: string;
};

// Subcategories
export type SubcategoryType = {
  id: number;
  subcategory_name: string;
  created_at: string;
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
  user_id: string;
  internal_url?: string[];
  external_url?: string[];
  answer?: string;
  update_answered_at?: string;
  created_at: string;
};

// Expo Push Tokens per User
export type UserTokenType = {
  id: number;
  expo_push_token: string;
  user_id: string;
  created_at: string;
};

// Application Users
export type UserType = {
  id: number;
  user_id: string;
  username: string;
  role: string;
  email: string;
  created_at: string;
};

// Versioning info
export type VersionType = {
  id: number;
  database_version: string;
  appVersion: string;
};
