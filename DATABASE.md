# Database Schema and Design Decisions

## Schema Overview
The database schema consists of four four tables: courses, questions, answers and upvotes. The schema is structured to balance normalization for data integrity while allowing denormalization where needed to optimize performance.

### Tables

#### 1. Courses
Stores the list of courses available.
```sql
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL
);
```

#### 2. Questions
Stores questions related to a specific course.
```sql
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses (id),
  content TEXT NOT NULL,
  user_id TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. Answers
Stores answers related to specific questions.
```sql
CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions (id),
  content TEXT NOT NULL,
  user_id TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. Upvotes
Tracks upvotes for both questions and answers.
```sql
CREATE TYPE UPVOTE_OBJECT AS ENUM ('question', 'answer');

CREATE TABLE upvotes (
  id SERIAL PRIMARY KEY,
  object_id INTEGER,
  object_type UPVOTE_OBJECT NOT NULL,
  user_id TEXT NOT NULL
);
```

---

## Indexing Decisions
Indexes were  chosen to optimize query performance and reduce lookup times for frequently accessed data.

### Primary indexes (Automatically Created)
Each table uses a `SERIAL PRIMARY KEY`, which automatically creates a B-Tree index for fast lookups by primary key:
- `courses_pkey (id)`
- `questions_pkey (id)`
- `answers_pkey (id)`
- `upvotes_pkey (id)`

### Secondary indexes

#### 1. Optimizing Course-based Question Lookups
```sql
CREATE INDEX idx_questions_course_id_last_updated ON questions(course_id, last_updated);
```
- Justification: This index speeds up queries that retrieve questions for a specific course while ordering them by `last_updated`.

- Queries often need to filter by `course_id` and sort by `last_updated`, so a multicolumn index improves performance.

#### 2. Optimizing Question-based Answer Lookups
```sql
CREATE INDEX idx_answers_question_id_last_updated ON answers(question_id, last_updated);
```
- Justification: This index helps fetch answers for a question while ensuring the most recent answers are retrieved first.

- Queries often need to filter by `question_id` and sort by `last_updated`, so a multicolumn index improves performance.

#### 3. Optimizing Upvote Lookups
```sql
CREATE INDEX idx_upvotes_object_id_object_type ON upvotes(object_id, object_type);
```
- Justification: Since `upvotes` applies to both `questions` and `answers`, filtering by `object_id` and `object_type` ensures efficient lookups.

- The multicolumn index speeds up counting and retrieving upvotes for a specific entity type.

---

## Denormalization Decisions

While the schema remains mostly normalized for data integrity, some denormalization decisions were made for performance reasons:

1. Only one table for upvotes
   - Instead of creating separate `question_upvotes` and `answer_upvotes` tables, there is a single `upvotes` table with an `object_type` ENUM.
   - Benefit: Simpler querying (and upvotes to answers or questions are handled by same functions on the application level which makes to logic simpler)
   - Trade-Off: Requires ensuring `object_id` is valid for its `object_type` at the application level.

2. Storing `last_updated` in Questions and Answers
   - `last_updated` is stored as a column and is updated when someone upvotes the question or answer.
   - Benefit: Queries that sort by `last_updated` are significantly faster. No need to separately compare upvote or creation times.
   - Trade-Off: The application must update this field explicitly.

