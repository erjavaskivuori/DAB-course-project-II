<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { userUuid } from "../stores/stores.js";
  import UpvoteButton from "./UpvoteButton.svelte";

  export let courseId;
  let course;
  let questionInput = "";

  const getCourse = async () => {
    const response = await fetch(`/api/course?id=${courseId}`);
    course = await response.json();
    console.log(course);
  };

  const postQuestion = async () => {
    const user = get(userUuid);
    const data = {
      user: user,
      course: courseId,
      question: questionInput,
    };
    const response = await fetch("/api/ask-question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const jsonData = await response.json();
    console.log(jsonData);
    questionInput = "";
    getCourse();
  };

  onMount(() => {
    getCourse();
  });
</script>

<div class="px-6">
  {#if course}
    <h1 class="text-3xl my-6">{course.title}</h1>
    <label for="question">Ask a question:</label>
    <div class="flex flex-row my-3">
      <input bind:value={questionInput}
        type="text"
        id="question"
        class="block w-full p-2 border border-gray-200 rounded-lg shadow-sm mr-2" />
      <button on:click={postQuestion}
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1.5 rounded-lg">
        Send
      </button>
    </div>
    <h2 class="text-xl mt-7 mb-4">Questions:</h2>
    {#if course.questions}
      <ul>
        {#each course.questions as question (question.id)}
          <li>
            <div class="flex flex-col items-start justify-between my-4">
              <a href="/questions/{question.id}" class="block max-w-m p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 mb-2">
                {question.content}
              </a>
              <UpvoteButton upvotes={question.upvoted_by} />
            </div>
          </li>
        {/each}
      </ul>
    {:else}
      <p>
        No questions yet, be the first to ask!
      </p>
    {/if}
  {/if}
</div>