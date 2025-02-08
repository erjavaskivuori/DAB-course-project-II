import { sql } from "../database/database.js";

export const getAllCourses = async () => {
  return await sql `SELECT * FROM courses`;
};

export const getCourseWithQuestions = async (courseId) => {
  return await sql`
    SELECT 
      c.id AS course_id,
      c.title AS course_title,
      q.id AS question_id,
      q.content AS question_content,
      q.last_updated AS question_last_updated
    FROM courses c
    LEFT JOIN questions q 
      ON c.id = q.course_id
    WHERE c.id = ${courseId}
    ORDER BY question_last_updated DESC
  `;
};

export const getQuestionWithAnswers = async (questionId) => {
  return await sql`
    SELECT
      q.id AS question_id,
      q.content AS question_content,
      a.id AS answer_id,
      a.content AS answer_content,
      a.last_updated AS answer_last_updated
    FROM questions q
    LEFT JOIN answers a
      ON q.id = a.question_id
    WHERE q.id = ${questionId}
    ORDER BY answer_last_updated DESC
  `;
};

export const getUpvotes = async (objectId, objectType) => {
  return await sql`
    SELECT user_id AS upvoted_by
    FROM upvotes
    WHERE object_id = ${objectId} AND object_type = ${objectType}
  `;
};

export const postQuestion = async (courseId, question, userId) => {
  return await sql`
    INSERT INTO questions (course_id, content, user_id)
    VALUES (${courseId}, ${question}, ${userId})
  `;
};

export const postAnswer = async (questionId, answer, userId) => {
  return await sql`
    INSERT INTO answers (question_id, content, user_id)
    VALUES (${questionId}, ${answer}, ${userId})
  `;
};
