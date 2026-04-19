# סכימות דומיין שפה (Language Domain Schemas) - LearnPlay

מסמך זה מגדיר את המבנה הסטנדרטי של נתוני לימוד שפה (במיוחד אנגלית-עברית) במערכת LearnPlay. כל יצירה של משחקים מבוססי שפה צריכה להיצמד לסכימות הללו כדי להבטיח תאימות עם מנועי המשחק השונים.

## 1. מבנה הנתונים הכללי (Dataset Content)
כל חבילת לימוד שפה מורכבת מהשדות הבאים:
- `extracted_text`: סיכום קצר של התוכן הנלמד.
- `words_hebrew`: רשימת המילים בעברית.
- `words_english`: רשימת המילים באנגלית.
- `sentences`: (אופציונלי) רשימת משפטי דוגמה.
- `schemas`: מערך של מודלי משחק שונים.

---

## 2. מודלי המשחק (Schemas)

### א. מילון זוגות שפות (LANGUAGES_PAIRS_GLOSSARY)
משמש למשחקי זיכרון, התאמה או תרגול בסיסי.
```json
{
  "type": "LANGUAGES_PAIRS_GLOSSARY",
  "items": [
    { "prompt": "apple", "target": "תפוח", "id": "gl_0" }
  ]
}
```

### ב. שאלות אמריקאיות (GENERAL_QUIZ_TERMS / SHORT)
שאלות בחירה מרובה על פירוש מילים.
- `question`: השאלה (למשל "מה הפירוש של X?").
- `correctAnswer`: התשובה הנכונה.
- `distractors`: 3 מסיחים (תשובות שגויות).
```json
{
  "type": "GENERAL_QUIZ_TERMS",
  "items": [
    {
      "question": "What is the translation of 'agree'?",
      "correctAnswer": "להסכים",
      "distractors": ["להגיע", "לסגור", "לגלות"],
      "id": "tq_0"
    }
  ]
}
```

### ג. נכון/לא נכון (SCIENCES_QUIZ_BOOLEAN)
טענות לגבי תרגום או דקדוק.
```json
{
  "type": "SCIENCES_QUIZ_BOOLEAN",
  "items": [
    {
      "statement": "The word 'age' means 'גיל'.",
      "isTrue": true,
      "explanation": "",
      "id": "tf_0"
    }
  ]
}
```

### ד. השלמת משפטים (GENERAL_QUIZ_CLOZE)
השלמת מילה חסרה בתוך משפט (Fill in the blanks).
- `sentence_parts`: מערך של חלקי המשפט לפני ואחרי המילה החסרה.
- `missing_word`: המילה שחסרה.
```json
{
  "type": "GENERAL_QUIZ_CLOZE",
  "items": [
    {
      "sentence_parts": ["The English word for 'happy' is ", "."],
      "missing_word": "glad",
      "distractors": ["sad", "angry"],
      "id": "fb_0"
    }
  ]
}
```

### ה. מיון לקטגוריות (GENERAL_ORDER_CATEGORIZE)
חלוקת מילים לקבוצות (למשל: פעלים, שמות עצם, תארים).
```json
{
  "type": "GENERAL_ORDER_CATEGORIZE",
  "categories": ["Verbs", "Nouns"],
  "items": [
    { "word": "run", "category": "Verbs", "id": "cat_0" },
    { "word": "apple", "category": "Nouns", "id": "cat_1" }
  ]
}
```

### ו. סיפור חי (LANGUAGE_LIVE_STORY)
מקטע קריאה אינטראקטיבי.
- `text`: הטקסט באנגלית.
- `glossary`: מילון של המילים בטקסט עם תרגום והקשר.
```json
{
  "type": "LANGUAGE_LIVE_STORY",
  "items": [
    {
      "title": "A Day at the Park",
      "paragraphs": ["Yesterday I went to the park. I saw a big dog."],
      "glossary": {
        "Yesterday": "אתמול",
        "park": "פארק",
        "saw": "ראיתי"
      },
      "id": "story_0"
    }
  ]
}
```

### ז. בונה משפטים (LANGUAGE_SENTENCE_BUILDER)
תרגול תחביר וסדר מילים.
- `scrambled_words`: מערך המילים בסדר מבולבל.
- `correct_sentence`: המשפט המלא והתקין.
```json
{
  "type": "LANGUAGE_SENTENCE_BUILDER",
  "items": [
    {
      "hebrew_prompt": "אני אוהב לאכול תפוחים",
      "scrambled_words": ["eating", "apples", "I", "love"],
      "correct_sentence": "I love eating apples",
      "id": "sb_0"
    }
  ]
}
```

---

## 3. הנחיות ליצירה (AI Guidelines)
1. **ייחודיות**: לכל פריט (`item`) חייב להיות `id` ייחודי בתוך הסכימה (למשל `gl_0`, `tq_0`).
2. **מסיחים**: המסיחים (`distractors`) צריכים להיות מאותו סוג של התשובה הנכונה (למשל, אם התשובה היא פועל, המסיחים יהיו פעלים אחרים מהרשימה).
3. **עקביות**: התרגומים חייבים להיות זהים בכל הסכימות בתוך אותו Dataset.
4. **שילוב**: מומלץ ליצור לפחות 3 סוגי סכימות לכל חבילת לימוד כדי לאפשר גיוון במשחקים.
