export const migrationSQL = `
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS question_categories (
        question_category_name TEXT PRIMARY KEY
    );

    CREATE TABLE IF NOT EXISTS question_subcategories (
        question_subcategory_name TEXT PRIMARY KEY

    );
    CREATE TABLE IF NOT EXISTS questions (
        id               INTEGER PRIMARY KEY,
        title            TEXT    NOT NULL,
        question         TEXT    NOT NULL,
        answer           TEXT,
        answer_sistani   TEXT,
        answer_khamenei  TEXT,
        question_category_name    TEXT    REFERENCES question_categories(question_category_name) ON DELETE SET NULL,
        question_subcategory_name TEXT    REFERENCES question_subcategories(question_subcategory_name) ON DELETE SET NULL,
        created_at       TEXT    DEFAULT CURRENT_TIMESTAMP,
        language_code    TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS prayer_categories (
        id        INTEGER PRIMARY KEY,
        title     TEXT    NOT NULL,
        parent_id TEXT    -- JSON array of numeric IDs, no FK
    );

    CREATE TABLE IF NOT EXISTS prayers (
        id                   INTEGER PRIMARY KEY,
        name                 TEXT    NOT NULL,
        arabic_title         TEXT,
        category_id          INTEGER REFERENCES prayer_categories(id),
        arabic_introduction  TEXT,
        arabic_text          TEXT,
        arabic_notes         TEXT,
        transliteration_text TEXT,
        source               TEXT,
        translated_languages TEXT,   
        created_at           TEXT    DEFAULT CURRENT_TIMESTAMP,
        updated_at           TEXT    DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS prayer_translations (
        id                      INTEGER PRIMARY KEY,
        prayer_id               INTEGER REFERENCES prayers(id),
        language_code           TEXT    NOT NULL,
        translated_introduction TEXT,
        translated_text         TEXT,
        translated_notes        TEXT,
        source                  TEXT,
        created_at              TEXT    DEFAULT CURRENT_TIMESTAMP,
        updated_at              TEXT    DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS favorite_questions (  
        id                INTEGER PRIMARY KEY,                                      
        question_id        INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE UNIQUE, 
        created_at         TEXT    DEFAULT CURRENT_TIMESTAMP                                                                   
    );

    CREATE INDEX IF NOT EXISTS idx_fav_questions_question_id 
        ON favorite_questions(question_id);


    CREATE TABLE IF NOT EXISTS favorite_prayers (
        id            INTEGER PRIMARY KEY,
        prayer_id     INTEGER NOT NULL REFERENCES prayers(id) ON DELETE CASCADE,
        folder_name   TEXT NOT NULL,
        folder_color  TEXT NOT NULL,
        created_at    TEXT    DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(prayer_id, folder_name) 
    );

    CREATE TABLE IF NOT EXISTS prayer_folders (
        name       TEXT PRIMARY KEY,
        color      TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS calendar (
        id             INTEGER PRIMARY KEY,
        title          TEXT NOT NULL,
        islamic_date   TEXT NOT NULL,
        gregorian_date TEXT   NOT NULL,
        description    TEXT NOT NULL,
        type           TEXT NOT NULL,
        countdown      INTEGER NOT NULL DEFAULT 1,
        created_at     TEXT DEFAULT CURRENT_TIMESTAMP,
        language_code  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS quran_suras (
        id                INTEGER PRIMARY KEY,
        transliteration   TEXT NOT NULL,
        arabic_title      TEXT NOT NULL,
        german_title      TEXT NOT NULL,
        main_topic        TEXT,
        sura_description  TEXT,
        verse_count       INTEGER NOT NULL,
        created_at        TEXT DEFAULT CURRENT_TIMESTAMP,
        language_code     TEXT NOT NULL
    );


    CREATE TABLE IF NOT EXISTS quran_vers(
        id                INTEGER PRIMARY KEY,
        created_at        TEXT DEFAULT CURRENT_TIMESTAMP,
        sura_number       INTEGER NOT NULL,
        vers_number       INTEGER NOT NULL,
        arabic_text       TEXT NOT NULL,
        german_text       TEXT NOT NULL,
        explanation       TEXT NOT NULL,
        language_code     TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_fav_prayers_prayer_id
        ON favorite_prayers(prayer_id);

    CREATE INDEX IF NOT EXISTS idx_prayers_category_id
        ON prayers(category_id);

    CREATE INDEX IF NOT EXISTS idx_questions_created_at
        ON questions(created_at);

    CREATE INDEX IF NOT EXISTS idx_prayers_created_at
        ON prayers(created_at);

    `;
