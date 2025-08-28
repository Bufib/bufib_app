export const migrationSQL = `
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;
    
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
        parent_id TEXT    
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

    CREATE INDEX IF NOT EXISTS idx_fav_prayers_prayer_id
        ON favorite_prayers(prayer_id);

    CREATE INDEX IF NOT EXISTS idx_prayers_category_id
        ON prayers(category_id);

    CREATE INDEX IF NOT EXISTS idx_questions_created_at
        ON questions(created_at);

    CREATE INDEX IF NOT EXISTS idx_prayers_created_at
        ON prayers(created_at);

    CREATE INDEX IF NOT EXISTS idx_questions_cat_sub_created
    ON questions (question_category_name, question_subcategory_name, created_at);

    CREATE INDEX IF NOT EXISTS idx_questions_lang
    ON questions (language_code);

    CREATE INDEX IF NOT EXISTS idx_questions_title
    ON questions (title);

    CREATE INDEX IF NOT EXISTS idx_calendar_lang_date
    ON calendar (language_code, gregorian_date);

    CREATE UNIQUE INDEX IF NOT EXISTS ux_prayer_translations_pid_lang
    ON prayer_translations (prayer_id, language_code);

    CREATE TABLE IF NOT EXISTS aya_ar (
    id INTEGER PRIMARY KEY,
    sura INTEGER NOT NULL,
    aya  INTEGER NOT NULL,
    quran_arabic_text TEXT NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS ux_aya_ar_sura_aya ON aya_ar(sura, aya);
    
    CREATE INDEX IF NOT EXISTS idx_aya_ar_sura        ON aya_ar(sura);

    CREATE TABLE IF NOT EXISTS aya_de (
    id INTEGER PRIMARY KEY,
    sura INTEGER NOT NULL,
    aya  INTEGER NOT NULL,
    quran_german_text TEXT NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS ux_aya_de_sura_aya ON aya_de(sura, aya);
    CREATE INDEX IF NOT EXISTS idx_aya_de_sura        ON aya_de(sura);

    CREATE TABLE IF NOT EXISTS aya_en (
    id INTEGER PRIMARY KEY,
    sura INTEGER NOT NULL,
    aya  INTEGER NOT NULL,
    "desc" TEXT NOT NULL             
    );

    CREATE UNIQUE INDEX IF NOT EXISTS ux_aya_en_sura_aya ON aya_en(sura, aya);
    
    CREATE INDEX IF NOT EXISTS idx_aya_en_sura        ON aya_en(sura);

    CREATE TABLE IF NOT EXISTS aya_en_transliteration (
    id INTEGER PRIMARY KEY,
    sura INTEGER NOT NULL,
    aya  INTEGER NOT NULL,
    quran_transliteration_text TEXT NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS ux_aya_en_tr_sura_aya ON aya_en_transliteration(sura, aya);
    
    CREATE INDEX IF NOT EXISTS idx_aya_en_tr_sura        ON aya_en_transliteration(sura);

    CREATE TABLE IF NOT EXISTS hizb (
    id   INTEGER PRIMARY KEY,
    sura INTEGER NOT NULL,
    aya  INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_hizb_sura_aya ON hizb(sura, aya);

    CREATE TABLE IF NOT EXISTS juz (
    id   INTEGER PRIMARY KEY,
    sura INTEGER NOT NULL,
    aya  INTEGER NOT NULL,
    page INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_juz_page      ON juz(page);
    
    CREATE INDEX IF NOT EXISTS idx_juz_sura_aya  ON juz(sura, aya);

    CREATE TABLE IF NOT EXISTS ruku (
    id   INTEGER PRIMARY KEY,
    sura INTEGER NOT NULL,
    aya  INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_ruku_sura_aya ON ruku(sura, aya);

    CREATE TABLE IF NOT EXISTS sajda (
    id   INTEGER PRIMARY KEY,
    sura INTEGER NOT NULL,
    aya  INTEGER NOT NULL,
    type INTEGER
    );

    CREATE INDEX IF NOT EXISTS idx_sajda_sura_aya ON sajda(sura, aya);

    CREATE TABLE IF NOT EXISTS sura (
    id         INTEGER PRIMARY KEY,
    label      TEXT    NOT NULL UNIQUE,
    label_en   TEXT,
    label_de   TEXT    NOT NULL UNIQUE,
    nbAyat     INTEGER NOT NULL,
    nbWord     INTEGER NOT NULL,
    nbLetter   INTEGER NOT NULL,
    orderId    INTEGER NOT NULL,
    makki      INTEGER NOT NULL,   -- 1 = Makki, 0 = Madani (or however you map)
    startPage  INTEGER NOT NULL,
    endPage    INTEGER NOT NULL,
    ruku       INTEGER
    );

    CREATE INDEX IF NOT EXISTS idx_sura_orderId   ON sura(orderId);

    CREATE INDEX IF NOT EXISTS idx_sura_startPage ON sura(startPage);

    CREATE INDEX IF NOT EXISTS idx_sura_endPage   ON sura(endPage);

    CREATE INDEX IF NOT EXISTS idx_sura_makki     ON sura(makki);
     `;
