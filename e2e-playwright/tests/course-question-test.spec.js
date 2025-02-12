const { test, expect } = require("@playwright/test");

test("Main page lists all available courses", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector("//h1[text()='Courses']");
  const courses = await page.getByTestId("course").all();
  expect(courses).toHaveLength(4);
});

test("User can click on a course to see related questions and their upvotes", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector("//h1[text()='Courses']");
  await page.getByText("Designing and Building Scalable Web Applications").click();

  await page.waitForSelector("//h1[text()='Designing and Building Scalable Web Applications']")
  const questions = await page.getByTestId("question").count();
  const upvotes = await page.getByTestId("upvote").count();
  expect(parseInt(questions)).toBe(parseInt(upvotes));
});

test("If course has no questions, user will see a message", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector("//h1[text()='Courses']");
  await page.getByText("Full Stack Open").click();

  await page.waitForSelector("//h1[text()='Full Stack Open']")
  const noQuestionsMessage = await page.getByTestId("no-questions").textContent();
  expect(noQuestionsMessage).toBe("No questions yet, be the first to ask!");
});

test("User can upvote a question and the count will increase and question will move up", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Software Development Process").click();
  await page.waitForSelector("//h1[text()='Software Development Process']");

  const thirdQuestion = await page.getByTestId("question").nth(2).textContent();
  const upvoteButton = page.getByTestId("upvote").nth(2);
  const upvoteCount = await page.getByTestId("upvote-count").nth(2).textContent();

  await upvoteButton.click();

  await page.waitForLoadState("networkidle");
  const newFirstQuestion = await page.getByTestId("question").nth(0).textContent();
  const newUpvoteCount = await page.getByTestId("upvote-count").nth(0).textContent();

  expect(newFirstQuestion).toBe(thirdQuestion);
  expect(parseInt(newUpvoteCount)).toBeGreaterThan(parseInt(upvoteCount));
});

test("User can add a question and there will be three LLM answers to it", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Software Development Process").click();
  await page.waitForSelector("//h1[text()='Software Development Process']");

  const questionInput = page.getByTestId("question-input");
  const submitButton = page.getByTestId("submit-question");

  const question = "What is the software development process?"
  await questionInput.fill(question);
  await submitButton.click();

  await page.waitForLoadState("networkidle");
  const newQuestion = page.getByTestId("question").nth(0)
  const newQuestionText = await newQuestion.textContent();
  expect(newQuestionText).toBe(question);

  await newQuestion.click();
  const locatorWithQuestion = `//h1[contains(text(), 'Question: ${question}')]`;
  await page.waitForSelector(locatorWithQuestion);
  while (await page.getByTestId("answer").count() < 3) {
    await page.reload();
    await page.waitForTimeout(1000);
    await page.waitForSelector(locatorWithQuestion);
  }
  const answers = await page.getByTestId("answer").all();
  expect(answers).toHaveLength(3);
});

test("User can open question page and add an answer to the question", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Software Development Process").click();
  await page.waitForSelector("//h1[text()='Software Development Process']");

  const question = page.getByTestId("question").nth(0);
  const questionText = await question.textContent();
  await question.click();

  const locatorWithQuestion = `//h1[contains(text(), 'Question: ${questionText}')]`;
  await page.waitForSelector(locatorWithQuestion);
  const answerInput = page.getByTestId("answer-input");
  const submitButton = page.getByTestId("submit-answer");

  await answerInput.fill("Test answer.");
  await submitButton.click();

  await page.waitForLoadState("networkidle");
  const answerText = await (page.getByTestId("answer").first()).textContent();
  expect(answerText).toBe("Test answer.");
});

test("At most twenty answers are displayed on the question page", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Software Architectures").click();
  await page.waitForSelector("//h1[text()='Software Architectures']");

  const question = page.getByTestId("question").nth(0);
  const questionText = await question.textContent();
  await question.click();

  const locatorWithQuestion = `//h1[contains(text(), 'Question: ${questionText}')]`;
  await page.waitForSelector(locatorWithQuestion);
  const answerInput = page.getByTestId("answer-input");
  const submitButton = page.getByTestId("submit-answer");

  for (let i = 0; i < 30; i++) {
    await answerInput.fill(`Test answer ${i}.`);
    await submitButton.click();
    await page.waitForLoadState("networkidle");
  }

  const answers = await page.getByTestId("answer").all();
  expect(answers).toHaveLength(20);
});