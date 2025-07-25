// Language
export type LanguageContextType = {
  language: string | null;
  setAppLanguage: (lng: string) => Promise<void>;
  ready: boolean;
  isArabic: () => boolean;
};

export type LanguageCode = "de" | "ar" | "en";

// Gradient
export type UseGradientOptionsType = {
  customGradients?: string[][];
  defaultIndex?: number;
};

// NewsArticle
export type NewsArticlesPreviewType = {
  title: string;
  is_external_link: boolean;
  created_at: string;
};

export type NewsArticlesType = {
  id: number;
  created_at: string;
  language_code: string;
  title: string;
  content: string;
  is_external_link: boolean;
  external_link_url?: string;
  read_time?: string;
  author: string;
  source: string;
  scholar_type: number;
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
  language_code: string;
  image_url?: string[];
  is_pinned: boolean;
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
  emptyTextSize: number;
  emptyIconSize: number;
  emptyGap: number;
  isLarge: boolean;
  isMedium: boolean;
};

export type triggerRefreshFavoritesType = {
  refreshTriggerFavorites: number;
  triggerRefreshFavorites: () => void;
};

// Prayer and Question ButtonLinks
export type PrayerQuestionLinksType = {
  id: number;
  name: string;
  image: any;
  value: string;
};

export type FavoritePrayerFolderType = {
  name: string;
  color: string;
  prayerCount: number;
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
export type QuestionCategoryType = {
  id: number;
  question_category_name: string;
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
  question_category_name: string;
  question_subcategory_name: string;
  language_code: string;
  created_at: string;
};

// PrayerLinks
export type QuestionCategoriesType = {
  id: number;
  name: string;
  image: any;
  value: string;
};

export type SearchResultQAType = {
  id: number;
  title: string;
  question: string;
};

export type CombinedResult =
  | {
      renderId: string;
      type: "question";
      questionId: number;
      title: string;
      question: string;
      question_category_name?: string;
      question_subcategory_name?: string;
    }
  | {
      renderId: string;
      type: "prayer";
      prayerId: number;
      name: string;
      arabic_text?: string;
    }
  | {
      renderId: string;
      type: "podcast";
      podcastId: number;
      podcastEpisodeTitle: string;
      podcastEpisodeDescription?: string;
      podcast: any;
    }
  | {
      renderId: string;
      type: "newsArticle";
      newsArticleId: number;
      newsTitle: string;
      newsSnippet?: string;
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
export type QuestionSubcategoryType = {
  id: number;
  question_subcategory_name: string;
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

// Prayer
export type PrayerType = {
  id: number;
  name: string;
  arabic_title?: string;
  category_id?: number;
  created_at: Date;
  updated_at: Date;
  translated_languages?: string[];
  arabic_text?: string;
  arabic_notes?: string;
  transliteration_text?: string;
  source?: string;
  arabic_introduction?: string;
};

export type PrayerWithTranslationType = {
  id: number;
  prayer_id: number;
  language_code: string;
  translated_introduction?: string;
  translated_text?: string;
  source?: string;
  created_at: Date;
  updated_at: Date;
  translated_notes?: string;
};

export type FullPrayer = PrayerType & {
  translations: PrayerWithTranslationType[];
};

export type PrayerRow = {
  id: number;
  name: string;
  arabic_title?: string;
  category_id?: number;
  arabic_introduction?: string;
  arabic_text?: string;
  arabic_notes?: string;
  transliteration_text?: string;
  source?: string;
  translated_languages: string; // <-- JSON in a TEXT column
  created_at: string;
  updated_at: string;
};

export type PrayerCategoryType = {
  id: number;
  title: string;
  parent_id?: number[];
};

export type PrayerWithCategory = {
  id: number;
  name: string;
  prayer_text: string;
  category_id: number;
};
// ToDoList

export type TodoItemType = {
  id: number;
  text: string;
  completed: boolean;
};

export type TodoListType = {
  todos: TodoItemType[];
  dayIndex: number;
  onToggleTodo: (day: number, id: number) => void;
  onShowDeleteModal: (day: number, id: number) => void;
  onShowAddModal: () => void;
};

export type WeeklyTodosType = {
  [day: number]: TodoItemType[];
};

export type UseWeeklyTodosResult = {
  todosByDay: WeeklyTodosType;
  loading: boolean;
  toggleTodo: (day: number, id: number) => void;
  addTodo: (day: number, text: string) => void;
  deleteTodo: (day: number, id: number) => void;
  undoAllForDay: (day: number) => void;
};

export type WeeklyCalendarSectionType = {
  todosByDay: WeeklyTodosType;
  loading: boolean;
  onToggleTodo: (day: number, id: number) => void;
  onUndoAll: (day: number) => void;
  onShowAddModal: () => void;
  onShowDeleteModal: (day: number, id: number) => void;
  selectedDay: number | null;
  currentDayIndex: number;
  onSelectDay: (day: number) => void;
};

export type AddTodoModalType = {
  visible: boolean;
  onClose: () => void;
  onAdd: (text: string) => void;
  selectedDayName: string;
};

export type TodoToDeleteType = {
  dayIndex: number | null;
  todoId: number | null;
};

// Podcasts
export type PodcastType = {
  id: number;
  title: string;
  description: string;
  filename: string;
  language_code?: string;
  created_at: string;
};

export type PodcastProps = { podcast: PodcastType };
export type PodcastPlayerPropsType = {
  podcast: PodcastType;
};

// Videos
export type VideoType = {
  id: string;
  title: string;
  video_category: string;
  public_id: string;
  created_at: string;
  language_code: string;
};

export type VideoCategoryType = {
  id: string;
  video_category: string;
  language_code: string;
};

// User question
export type QuestionsFromUserType = {
  id: string;
  user_id: string;
  question: string;
  answer?: string;
  status: "Beantwortet" | "Beantwortung steht noch aus" | "Abgelehnt";
  marja: string;
  title: string;
  gender: string;
  age: string;
  internal_url: string[];
  external_url: string[];
  created_at: string;
  approval_status: string;
  has_read_answer: boolean;
  has_read_at: string;
};

// Calender
export type CalendarType = {
  id: number;
  title: string;
  islamic_date: string;
  gregorian_date: Date;
  description: string;
  type: string;
  created_at: Date;
  language_code: string;
};

// Quran

export type QuranSuraType = {
  id: number;
  transliteration: string;
  arabic_title: string;
  german_title: string;
  description: string;
  main_topic: string;
  sura_description: string;
  verse_count: number;
  created_at: string;
  language_code: string;
};
