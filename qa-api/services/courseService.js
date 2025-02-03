import { sql } from "../database/database.js";

const getAllCourses = async () => {
  return await sql `SELECT * FROM courses`;
};

const getCourse = async (courseId) => {
  return await sql `SELECT * FROM courses WHERE id = ${courseId}`;
}

const getCourseQuestions = async (courseId) => {
  return await sql `SELECT * FROM questions WHERE course_id = ${courseId}`;
};

export { getAllCourses, getCourse, getCourseQuestions };