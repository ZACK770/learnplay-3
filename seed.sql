
-- Seed initial game engines
INSERT INTO game_engines (type, name, description, thumbnail, author_id, game_schema, rating, plays_count)
VALUES 
('match', 'Card Match', 'A classic memory match game with cards.', 'https://picsum.photos/seed/cards/800/450', 'dev-user', '{}', 4.8, 1205),
('trivia', 'AI Trivia Blast', 'Fast-paced trivia generated from your content.', 'https://picsum.photos/seed/trivia/800/450', 'dev-user', '{}', 4.9, 4504),
('uav-intercept', 'UAV Command', 'Intercept incoming tokens in a high-stakes sky battle.', 'https://picsum.photos/seed/uav/800/450', 'dev-user', '{}', 4.7, 850);

-- Seed initial datasets
INSERT INTO datasets (title, description, domain, content, game_type, author_id, is_public)
VALUES 
('English Vocabulary', 'Basic everyday words in English and Hebrew.', 'Languages', '{"words_english": ["Apple", "House", "Book"], "words_hebrew": ["תפוח", "בית", "ספר"]}', 'match', 'dev-user', true),
('Science Quiz', 'Physics and Biology fundamentals.', 'Science', '{"questions": [{"q": "What is H2O?", "a": "Water"}]}', 'trivia', 'dev-user', true);
