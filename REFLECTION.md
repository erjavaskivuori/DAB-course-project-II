TODO: There is a brief description of the application in REFLECTION.md that highlights key design decisions for the application. The document also contains a reflection of possible improvements that should be done to improve the performance of the application.

# Key design decisions

## Basic functionalities

The project contains functionalities required for passing:

- Users are identified with an id that is stored locally

- Users can create questions and answers. Three LLM answers are automatically generated for each question.

- Users can upvote questions and answers

- At most there are 20 questions and answers shown to user

## Technical details

Astro's server-side rendering (SSR) is used to dynamically generate course and question pages. This allows dynamically generating page for new questions (and courses though more can't be created by user). The routes are e.g. `/courses/1` and `/questions/2`.

One thing to note is, that SSR requires an adpter and I chose Deno for this purpose. Server-side rendering is also taken into account in nginx production configurations and in the UI's production Dockerfile.

When course or question data is fetched from the server, it is done with one API call and single SQL-query. For example, when course page is opened, the fetched course data includes also twenty latests or most recently upvoted questions and the upvotes. This reduces database round trips. Same kind of logic is used when question page is opened.

The UI is minimalistic and is styled with Tailwind. The same upvote button element with its finctionalities is used for both questions and answers. Upvotes also use the same backend functionality regardless of the object (answer or question).

# Improvements

- Some kind of queueing system should be used for generating the LLM answers. This wasn't required and I didn't have time to implement it either but current solution can cause issues if there are large amount of questions created at the same time. For the same reason there could be more replicas of llm-api in real use.

- Posting question was one of the API calls that had the worst performance (see K6 results). This is most likely related to the previous improvement suggestion. Making the API call to llm-api causes significant latency compared to posting answer which otherwise performs exactly same tasks. This could possibly also be fixed with queueing functionality.

- Currently questions and answers are fetched again on every change. This causes unnessary data transfer when the change is e.g. one upvote. Maybe for small changes, such as giving one upvote, the state (user upvoted and count increased by 1) could be stored on the client and bigger updates would trigger full fetch from the server.

- Course and Question pages have some duplicate logic and that could be refactored.