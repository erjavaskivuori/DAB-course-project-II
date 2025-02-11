import { serve } from "./deps.js";
import * as courseService from "./services/courseService.js";

const handleGetCourses = async () => {
  return Response.json(await courseService.getAllCourses());
};

const handleGetCourse = async (request) => {
  const searchParams = new URL(request.url).searchParams;
  const questions = await courseService.getCourseWithQuestions(searchParams.get("id"));
  const courseData = {
    id: questions[0].course_id,
    title: questions[0].course_title,
    questions: await Promise.all(questions.map(async (q) => ({
          id: q.question_id,
          content: q.question_content,
          last_updated: q.question_last_updated,
          upvoted_by: (await courseService.getUpvotes(q.question_id, "question"))
          .map((u) => u.upvoted_by),
        }))),
  }
  return Response.json(courseData);
};

const handleGetQuestion = async (request) => {
  const searchParams = new URL(request.url).searchParams;
  const answers = await courseService.getQuestionWithAnswers(searchParams.get("id"));
  const questionData = {
    id: answers[0].question_id,
    content: answers[0].question_content,
    answers: await Promise.all(answers.map(async (a) => ({
      id: a.answer_id,
      content: a.answer_content,
      last_updated: a.answer_last_updated,
      upvoted_by: (await courseService.getUpvotes(a.answer_id, "answer"))
      .map((u) => u.upvoted_by),
    }))),
  };
  return Response.json(questionData);
}

const handlePostQuestion = async (request) => {
  const data = await request.json();
  try {
    const questionId = await courseService.postQuestion(data.course, data.question, data.user);

    fetchAndStoreLLMAnswers(data.question, questionId);

    return Response.json({ status: 201 });
  } catch (e) {
    return Response.json({ status: 500 });
  }
};

const handlePostAnswer = async (request) => {
  const data = await request.json();
  try {
    await courseService.postAnswer(data.question, data.answer, data.user);
    return Response.json({ status: 201 });
  } catch (e) {
    return Response.json({ status: 500 });
  }
}

const handlePostUpvote = async (request) => {
  const data = await request.json();
  try {
    await courseService.postUpvote(data.id, data.type, data.user);
    if (data.type === "answer") {
      await courseService.updateAnswer(data.id);
    } else {
      await courseService.updateQuestion(data.id);
    };
    return Response.json({ status: 201 });
  } catch (e) {
    return Response.json({ status: 500 });
  };
};

const fetchAndStoreLLMAnswers = async (question, questionId) => {
  try {
    const answerPromises = [];

    for (let i = 0; i < 3; i++) {
      answerPromises.push(fetchLLMAnswer(question));
    }

    const responses = await Promise.all(answerPromises);

    for (const llmResponseText of responses) {
      const formattedAnswer = `LLM Answer: ${llmResponseText}`;
      await courseService.postAnswer(questionId, formattedAnswer, 1);
    }
  } catch (error) {
    console.error("Error fetching LLM answers:", error);
  }
};

const fetchLLMAnswer = async (question) => {
  try {
    const response = await fetch("http://llm-api:7000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    const LLMApiResponse = await response.json();
    return LLMApiResponse[0]?.generated_text || "No response from LLM";
  } catch (error) {
    console.error("Error in LLM API request:", error);
    return "Error generating response";
  }
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
    pattern: new URLPattern({ pathname: "/question" }),
    method: "GET",
    fn: handleGetQuestion,
  },
  {
    pattern: new URLPattern({ pathname: "/ask-question" }),
    method: "POST",
    fn: handlePostQuestion,
  },
  {
    pattern: new URLPattern({ pathname: "/answer" }),
    method: "POST",
    fn: handlePostAnswer,
  },
  {
    pattern: new URLPattern({ pathname: "/upvote" }),
    method: "POST",
    fn: handlePostUpvote,
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
