import { serve } from "./deps.js";
import * as courseService from "./services/courseService.js";

const handleGetCourses = async () => {
  return Response.json(await courseService.getAllCourses());
};

const handleGetCourse = async (request) => {
  const searchParams = new URL(request.url).searchParams;
  const course = await courseService.getCourse(searchParams.get("id"));
  const courseData = {
    id: course[0].id,
    title: course[0].title,
  }
  return Response.json(courseData);
};

const handlePostAnswer = async (request) => {
  const data = await request.json();

  const response = await fetch("http://llm-api:7000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
};

const urlMapping = [
  {
    pattern: new URLPattern({ pathname: "/courses" }),
    method: "GET",
    fn: handleGetCourses,
  },
  {
    pattern: new URLPattern({ pathname: "/course" }),
    method: "GET",
    fn: handleGetCourse,
  },
  {
    pattern: new URLPattern({ pathname: "/llm-answer" }),
    method: "POST",
    fn: handlePostAnswer,
  },
];

const handleRequest = async (request) => {
  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url)
  );

  if (!mapping) {
    return new Response("Not found", { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);
  try {
    return await mapping.fn(request, mappingResult);
  } catch (e) {
    console.error(e);
    return new Response(e.stack, { status: 500 })
  }
};

const portConfig = { port: 7777, hostname: "0.0.0.0" };
serve(handleRequest, portConfig);
