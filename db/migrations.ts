// export const migrationSQL = `
//     PRAGMA journal_mode = WAL;
//     PRAGMA foreign_keys = ON;
//     PRAGMA busy_timeout = 5000;

//     CREATE TABLE IF NOT EXISTS question_categories (
//         question_category_name TEXT PRIMARY KEY
//     );

//     CREATE TABLE IF NOT EXISTS question_subcategories (
//         question_subcategory_name TEXT PRIMARY KEY

//     );
//     CREATE TABLE IF NOT EXISTS questions (
//         id               INTEGER PRIMARY KEY,
//         title            TEXT    NOT NULL,
//         question         TEXT    NOT NULL,
//         answer           TEXT,
//         answer_sistani   TEXT,
//         answer_khamenei  TEXT,
//         question_category_name    TEXT    REFERENCES question_categories(question_category_name) ON DELETE SET NULL,
//         question_subcategory_name TEXT    REFERENCES question_subcategories(question_subcategory_name) ON DELETE SET NULL,
//         created_at       TEXT    DEFAULT CURRENT_TIMESTAMP,
//         language_code    TEXT    NOT NULL
//     );

//     CREATE TABLE IF NOT EXISTS prayer_categories (
//         id        INTEGER PRIMARY KEY,
//         title     TEXT    NOT NULL,
//         parent_id TEXT
//     );

//     CREATE TABLE IF NOT EXISTS prayers (
//         id                   INTEGER PRIMARY KEY,
//         name                 TEXT    NOT NULL,
//         arabic_title         TEXT,
//         category_id          INTEGER REFERENCES prayer_categories(id),
//         arabic_introduction  TEXT,
//         arabic_text          TEXT,
//         arabic_notes         TEXT,
//         transliteration_text TEXT,
//         source               TEXT,
//         translated_languages TEXT,
//         created_at           TEXT    DEFAULT CURRENT_TIMESTAMP,
//         updated_at           TEXT    DEFAULT CURRENT_TIMESTAMP
//     );

//     CREATE TABLE IF NOT EXISTS prayer_translations (
//         id                      INTEGER PRIMARY KEY,
//         prayer_id               INTEGER REFERENCES prayers(id),
//         language_code           TEXT    NOT NULL,
//         translated_introduction TEXT,
//         translated_text         TEXT,
//         translated_notes        TEXT,
//         source                  TEXT,
//         created_at              TEXT    DEFAULT CURRENT_TIMESTAMP,
//         updated_at              TEXT    DEFAULT CURRENT_TIMESTAMP
//     );

//     CREATE TABLE IF NOT EXISTS favorite_questions (
//         id                INTEGER PRIMARY KEY,
//         question_id        INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE UNIQUE,
//         created_at         TEXT    DEFAULT CURRENT_TIMESTAMP
//     );

//     CREATE INDEX IF NOT EXISTS idx_fav_questions_question_id
//         ON favorite_questions(question_id);

//     CREATE TABLE IF NOT EXISTS favorite_prayers (
//         id            INTEGER PRIMARY KEY,
//         prayer_id     INTEGER NOT NULL REFERENCES prayers(id) ON DELETE CASCADE,
//         folder_name   TEXT NOT NULL,
//         folder_color  TEXT NOT NULL,
//         created_at    TEXT    DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE(prayer_id, folder_name)
//     );

//     CREATE TABLE IF NOT EXISTS prayer_folders (
//         name       TEXT PRIMARY KEY,
//         color      TEXT NOT NULL,
//         created_at TEXT DEFAULT CURRENT_TIMESTAMP
//     );

//     CREATE TABLE IF NOT EXISTS calendar (
//         id             INTEGER PRIMARY KEY,
//         title          TEXT NOT NULL,
//         islamic_date   TEXT NOT NULL,
//         gregorian_date TEXT   NOT NULL,
//         description    TEXT NOT NULL,
//         type           TEXT NOT NULL,
//         countdown      INTEGER NOT NULL DEFAULT 1,
//         created_at     TEXT DEFAULT CURRENT_TIMESTAMP,
//         language_code  TEXT NOT NULL
//     );

//     CREATE INDEX IF NOT EXISTS idx_fav_prayers_prayer_id
//         ON favorite_prayers(prayer_id);

//     CREATE INDEX IF NOT EXISTS idx_prayers_category_id
//         ON prayers(category_id);

//     CREATE INDEX IF NOT EXISTS idx_questions_created_at
//         ON questions(created_at);

//     CREATE INDEX IF NOT EXISTS idx_prayers_created_at
//         ON prayers(created_at);

//     CREATE INDEX IF NOT EXISTS idx_questions_cat_sub_created
//     ON questions (question_category_name, question_subcategory_name, created_at);

//     CREATE INDEX IF NOT EXISTS idx_questions_lang
//     ON questions (language_code);

//     CREATE INDEX IF NOT EXISTS idx_questions_title
//     ON questions (title);

//     CREATE INDEX IF NOT EXISTS idx_calendar_lang_date
//     ON calendar (language_code, gregorian_date);

//     CREATE UNIQUE INDEX IF NOT EXISTS ux_prayer_translations_pid_lang
//     ON prayer_translations (prayer_id, language_code);

//     CREATE TABLE IF NOT EXISTS aya_ar (
//     id INTEGER PRIMARY KEY,
//     sura INTEGER NOT NULL,
//     aya  INTEGER NOT NULL,
//     quran_arabic_text TEXT NOT NULL
//     );

//     CREATE UNIQUE INDEX IF NOT EXISTS ux_aya_ar_sura_aya ON aya_ar(sura, aya);

//     CREATE INDEX IF NOT EXISTS idx_aya_ar_sura        ON aya_ar(sura);

//     CREATE TABLE IF NOT EXISTS aya_de (
//     id INTEGER PRIMARY KEY,
//     sura INTEGER NOT NULL,
//     aya  INTEGER NOT NULL,
//     quran_german_text TEXT NOT NULL
//     );

//     CREATE UNIQUE INDEX IF NOT EXISTS ux_aya_de_sura_aya ON aya_de(sura, aya);
//     CREATE INDEX IF NOT EXISTS idx_aya_de_sura        ON aya_de(sura);

//     CREATE TABLE IF NOT EXISTS aya_en (
//     id INTEGER PRIMARY KEY,
//     sura INTEGER NOT NULL,
//     aya  INTEGER NOT NULL,
//     quran_english_text TEXT NOT NULL
//     );

//     CREATE UNIQUE INDEX IF NOT EXISTS ux_aya_en_sura_aya ON aya_en(sura, aya);

//     CREATE INDEX IF NOT EXISTS idx_aya_en_sura        ON aya_en(sura);

//     CREATE TABLE IF NOT EXISTS aya_en_transliteration (
//     id INTEGER PRIMARY KEY,
//     sura INTEGER NOT NULL,
//     aya  INTEGER NOT NULL,
//     quran_transliteration_text TEXT NOT NULL
//     );

//     CREATE UNIQUE INDEX IF NOT EXISTS ux_aya_en_tr_sura_aya ON aya_en_transliteration(sura, aya);

//     CREATE INDEX IF NOT EXISTS idx_aya_en_tr_sura        ON aya_en_transliteration(sura);

//     CREATE TABLE IF NOT EXISTS hizb (
//     id   INTEGER PRIMARY KEY,
//     sura INTEGER NOT NULL,
//     aya  INTEGER NOT NULL
//     );
//     CREATE INDEX IF NOT EXISTS idx_hizb_sura_aya ON hizb(sura, aya);

//     CREATE TABLE IF NOT EXISTS juz (
//     id   INTEGER PRIMARY KEY,
//     sura INTEGER NOT NULL,
//     aya  INTEGER NOT NULL,
//     page INTEGER NOT NULL
//     );

//     CREATE INDEX IF NOT EXISTS idx_juz_page      ON juz(page);

//     CREATE INDEX IF NOT EXISTS idx_juz_sura_aya  ON juz(sura, aya);

//     CREATE TABLE IF NOT EXISTS ruku (
//     id   INTEGER PRIMARY KEY,
//     sura INTEGER NOT NULL,
//     aya  INTEGER NOT NULL
//     );
//     CREATE INDEX IF NOT EXISTS idx_ruku_sura_aya ON ruku(sura, aya);

//     CREATE TABLE IF NOT EXISTS sajda (
//     id   INTEGER PRIMARY KEY,
//     sura INTEGER NOT NULL,
//     aya  INTEGER NOT NULL,
//     type INTEGER
//     );

//     CREATE INDEX IF NOT EXISTS idx_sajda_sura_aya ON sajda(sura, aya);

//     CREATE TABLE IF NOT EXISTS sura (
//     id         INTEGER PRIMARY KEY,
//     label      TEXT    NOT NULL UNIQUE,
//     label_en   TEXT,              -- transliteration
//     label_de   TEXT    NOT NULL UNIQUE,
//     nbAyat     INTEGER NOT NULL,
//     nbWord     INTEGER NOT NULL,
//     nbLetter   INTEGER NOT NULL,
//     orderId    INTEGER NOT NULL,
//     makki      INTEGER NOT NULL,   -- 1 = Makki, 0 = Madani (or however you map)
//     startPage  INTEGER NOT NULL,
//     endPage    INTEGER NOT NULL,
//     ruku       INTEGER
//     );

//     CREATE INDEX IF NOT EXISTS idx_sura_orderId ON sura(orderId);

//     CREATE INDEX IF NOT EXISTS idx_sura_startPage ON sura(startPage);

//     CREATE INDEX IF NOT EXISTS idx_sura_endPage ON sura(endPage);

//     CREATE INDEX IF NOT EXISTS idx_sura_makki ON sura(makki);

//      `;



export const migrationSQL = `
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;         -- harmless even if you have no FKs
  PRAGMA busy_timeout = 5000;

  -- LANGUAGES (keep if you use it in UI; no FKs)
  CREATE TABLE IF NOT EXISTS languages (
    id INTEGER PRIMARY KEY,
    language_code TEXT NOT NULL UNIQUE
  );

  -- CALENDAR Legend (lookup table; no FK)
  CREATE TABLE IF NOT EXISTS calendarLegend (
    id INTEGER PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    legend_type TEXT NOT NULL UNIQUE,
    language_code TEXT NOT NULL 
  );

  -- CALENDAR
  CREATE TABLE IF NOT EXISTS calendar (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    islamic_date TEXT NOT NULL,
    gregorian_date TEXT NOT NULL,
    description TEXT,
    legend_type TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    language_code TEXT NOT NULL
  );
  -- Helpful indexes for common filters/sorts
  CREATE INDEX IF NOT EXISTS idx_calendar_legend_type ON calendar(legend_type);
  CREATE INDEX IF NOT EXISTS idx_calendar_lang_created ON calendar(language_code, created_at);
  CREATE INDEX IF NOT EXISTS idx_calendar_gregorian ON calendar(gregorian_date);

  -- QURAN: AYA TEXT TABLES
  CREATE TABLE IF NOT EXISTS aya_ar (
    id INTEGER PRIMARY KEY,
    sura INTEGER NOT NULL,
    aya INTEGER NOT NULL,
    quran_arabic_text TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_aya_ar_sura_aya ON aya_ar(sura, aya);

  CREATE TABLE IF NOT EXISTS aya_de (
    id INTEGER PRIMARY KEY,
    sura INTEGER NOT NULL,
    aya INTEGER NOT NULL,
    quran_german_text TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_aya_de_sura_aya ON aya_de(sura, aya);

  CREATE TABLE IF NOT EXISTS aya_en (
    id INTEGER PRIMARY KEY,
    sura INTEGER NOT NULL,
    aya INTEGER NOT NULL,
    quran_english_text TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_aya_en_sura_aya ON aya_en(sura, aya);

  CREATE TABLE IF NOT EXISTS aya_en_transliteration (
    id INTEGER PRIMARY KEY,
    sura INTEGER NOT NULL,
    aya INTEGER NOT NULL,
    quran_transliteration_text TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_aya_en_tr_sura_aya ON aya_en_transliteration(sura, aya);

  -- QURAN STRUCTURE TABLES
  CREATE TABLE IF NOT EXISTS hizb (
    id INTEGER PRIMARY KEY,
    sura INTEGER NOT NULL,
    aya INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_hizb_sura_aya ON hizb(sura, aya);

  CREATE TABLE IF NOT EXISTS juz (
    id INTEGER PRIMARY KEY,
    sura INTEGER NOT NULL,
    aya INTEGER NOT NULL,
    page INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_juz_page ON juz(page);
  CREATE INDEX IF NOT EXISTS idx_juz_sura_aya ON juz(sura, aya);

  CREATE TABLE IF NOT EXISTS page (
    id INTEGER PRIMARY KEY,
    sura INTEGER NOT NULL,
    aya INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_page_sura_aya ON page(sura, aya);

  CREATE TABLE IF NOT EXISTS ruku (
    id INTEGER PRIMARY KEY,
    sura INTEGER NOT NULL,
    aya INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_ruku_sura_aya ON ruku(sura, aya);

  CREATE TABLE IF NOT EXISTS sajda (
    id INTEGER PRIMARY KEY,
    sura INTEGER NOT NULL,
    aya INTEGER NOT NULL,
    type INTEGER
  );
  CREATE INDEX IF NOT EXISTS idx_sajda_sura_aya ON sajda(sura, aya);

  CREATE TABLE IF NOT EXISTS sura (
    id INTEGER PRIMARY KEY,
    label TEXT NOT NULL UNIQUE,
    label_en TEXT,
    label_de TEXT NOT NULL UNIQUE,
    nbAyat INTEGER NOT NULL,
    nbWord INTEGER NOT NULL,
    nbLetter INTEGER NOT NULL,
    orderId INTEGER NOT NULL,
    makki INTEGER NOT NULL,
    startPage INTEGER NOT NULL,
    endPage INTEGER NOT NULL,
    ruku INTEGER
  );
  -- order-based navigation
  CREATE INDEX IF NOT EXISTS idx_sura_order ON sura(orderId);
  -- (moved here) page → sura lookups if you use them
  CREATE INDEX IF NOT EXISTS idx_sura_start_end ON sura(startPage, endPage);

  -- PAYPAL
  CREATE TABLE IF NOT EXISTS paypal (
    id INTEGER PRIMARY KEY,
    link TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  -- QUESTIONS
  CREATE TABLE IF NOT EXISTS question_categories (
    id INTEGER PRIMARY KEY,
    category_name TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    language_code TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_question_categories_lang ON question_categories(language_code);
  -- Fast lookups by title (used by getCategoryByTitle)
  CREATE INDEX IF NOT EXISTS idx_question_categories_name ON question_categories(category_name);

  CREATE TABLE IF NOT EXISTS question_subcategories (
    id INTEGER PRIMARY KEY,
    subcategory_name TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    language_code TEXT NOT NULL DEFAULT 'de'
  );
  CREATE INDEX IF NOT EXISTS idx_question_subcategories_lang ON question_subcategories(language_code);

  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY,
    question TEXT NOT NULL,
    title TEXT NOT NULL,
    question_category_name TEXT NOT NULL,
    question_subcategory_name TEXT NOT NULL,
    answer TEXT,
    answer_khamenei TEXT,
    answer_sistani TEXT,
    created_at TEXT NOT NULL,
    language_code TEXT NOT NULL DEFAULT 'de'
  );
  CREATE INDEX IF NOT EXISTS idx_questions_lang ON questions(language_code);
  CREATE INDEX IF NOT EXISTS idx_questions_cat_sub ON questions(question_category_name, question_subcategory_name);
  CREATE INDEX IF NOT EXISTS idx_questions_created ON questions(created_at);
  CREATE INDEX IF NOT EXISTS idx_questions_title ON questions(title);
  
  CREATE TABLE IF NOT EXISTS favorite_questions (
  question_id INTEGER NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

  -- indexes your code will hit
  CREATE UNIQUE INDEX IF NOT EXISTS uq_fav_questions_qid ON favorite_questions(question_id);
  CREATE INDEX IF NOT EXISTS idx_fav_questions_created ON favorite_questions(created_at);

  -- PRAYERS
  CREATE TABLE IF NOT EXISTS prayer_categories (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    parent_id TEXT,               -- JSON string of number[] (PG array)
    language_code TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_prayer_categories_lang ON prayer_categories(language_code);
  -- You'll often hit WHERE title = ? and ORDER BY title
  CREATE INDEX IF NOT EXISTS idx_prayer_categories_title_nocase ON prayer_categories(title COLLATE NOCASE);

  CREATE TABLE IF NOT EXISTS prayers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    arabic_title TEXT,
    category_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    translated_languages TEXT NOT NULL,  -- JSON string of string[]
    arabic_text TEXT,
    arabic_notes TEXT,
    transliteration_text TEXT,
    source TEXT,
    arabic_introduction TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_prayers_category ON prayers(category_id);
  -- Helpful for ORDER BY name lists
  -- Case-insensitive sorts that can use an index
  CREATE INDEX IF NOT EXISTS idx_prayers_name_nocase ON prayers(name COLLATE NOCASE);

  CREATE TABLE IF NOT EXISTS prayer_translations (
    id INTEGER PRIMARY KEY,
    prayer_id INTEGER NOT NULL,
    language_code TEXT NOT NULL,
    translated_introduction TEXT,
    translated_text TEXT,
    source TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    translated_notes TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_prayer_translations_pid ON prayer_translations(prayer_id);
  CREATE INDEX IF NOT EXISTS idx_prayer_translations_lang ON prayer_translations(language_code);
  CREATE INDEX IF NOT EXISTS idx_prayer_translations_pid_lang ON prayer_translations(prayer_id, language_code);

  -- FAVORITES / FOLDERS (used by your helpers)
  CREATE TABLE IF NOT EXISTS prayer_folders (
    name  TEXT PRIMARY KEY,
    color TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS favorite_prayers (
    prayer_id    INTEGER NOT NULL,
    folder_name  TEXT    NOT NULL,
    folder_color TEXT    NOT NULL,
    created_at   TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  -- Indexes your queries will hit
  CREATE INDEX IF NOT EXISTS idx_fav_prayers_prayer_id   ON favorite_prayers(prayer_id);
  CREATE INDEX IF NOT EXISTS idx_fav_prayers_folder      ON favorite_prayers(folder_name, created_at);
  CREATE INDEX IF NOT EXISTS idx_fav_prayers_created     ON favorite_prayers(created_at);
  CREATE INDEX IF NOT EXISTS idx_fav_prayers_prayer_folder ON favorite_prayers(prayer_id, folder_name);

  -- PODCASTS
  CREATE TABLE IF NOT EXISTS podcasts (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    filename TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    language_code TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_podcasts_lang_created ON podcasts(language_code, created_at);

  -- VIDEOS
  CREATE TABLE IF NOT EXISTS video_categories (
    id INTEGER PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    video_category TEXT NOT NULL UNIQUE,
    language_code TEXT NOT NULL DEFAULT 'de'
  );
  CREATE INDEX IF NOT EXISTS idx_video_categories_lang ON video_categories(language_code);

  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title TEXT NOT NULL,
    language_code TEXT NOT NULL,
    public_id TEXT NOT NULL,
    video_category TEXT NOT NULL DEFAULT ''
  );
  CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(video_category);
  CREATE INDEX IF NOT EXISTS idx_videos_lang ON videos(language_code);
  CREATE INDEX IF NOT EXISTS idx_videos_category_created ON videos(video_category, created_at);

  -- VERSIONS
  CREATE TABLE IF NOT EXISTS versions (
    id INTEGER PRIMARY KEY,
    question_data_version TEXT NOT NULL,
    app_version TEXT NOT NULL,
    quran_data_version TEXT,
    prayer_data_version TEXT,
    calendar_data_version TEXT
  );
`;
