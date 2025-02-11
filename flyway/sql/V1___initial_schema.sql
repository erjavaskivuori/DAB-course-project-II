CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses (id),
  content TEXT NOT NULL,
  user_id TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions (id),
  content TEXT NOT NULL,
  user_id TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE UPVOTE_OBJECT AS ENUM ('question', 'answer');

CREATE TABLE upvotes (
  id SERIAL PRIMARY KEY,
  object_id INTEGER,
  object_type UPVOTE_OBJECT NOT NULL,
  user_id TEXT NOT NULL
);

CREATE INDEX idx_questions_course_id_last_updated ON questions(course_id, last_updated);
CREATE INDEX idx_answers_question_id_last_updated ON answers(question_id, last_updated);
CREATE UNIQUE INDEX idx_unique_upvote ON upvotes(user_id, object_id, object_type);
