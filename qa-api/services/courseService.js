import { sql } from "../database/database.js";

const getAllCourses = async () => {
  return await sql `SELECT * FROM courses`;
};

const getCourseWithQuestions = async (courseId) => {
  return await sql`
    SELECT 
      courses.id AS course_id,
      courses.title AS course_title,
      questions.id AS question_id,
      questions.content AS question_content,
      questions.last_updated AS question_last_updated
    FROM courses
    LEFT JOIN questions ON courses.id = questions.course_id
    WHERE courses.id = ${courseId}
  `;
};

const getQuestionWithAnswers = async (questionId) => {
  return await sql`
    SELECT 
      questions.id AS question_id,
      questions.content AS question_content,
      answers.id AS answer_id,
      answers.content AS answer_content,
      answers.last_updated AS answer_last_updated
    FROM questions
    LEFT JOIN answers ON questions.id = answers.question_id
    WHERE questions.id = ${questionId}
  `;
};

export { getAllCourses, getCourseWithQuestions, getQuestionWithAnswers };