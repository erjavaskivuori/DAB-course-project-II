<script context="module">
  import { setContext } from "svelte";
  export const update = () => {};
</script>

<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { userUuid } from "../stores/stores.js";
  import UpvoteButton from "./UpvoteButton.svelte";

  export let questionId;
  let answerInput = "";
  let question = {};

  const getQuestion = async () => {
    const response = await fetch(`/api/question?id=${questionId}`);
    question = await response.json();
    console.log(question.answers);
  };

  const postAnswer = async (event) => {
    const user = get(userUuid);
    const data = {
      question: questionId,
      answer: answerInput,
      user: user,
    };
    const response = await fetch("/api/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const jsonData = await response.json();
    console.log(jsonData);
    answerInput = "";
    await getQuestion();
  };

  onMount(() => {
    getQuestion();
  });

  setContext("update", getQuestion);
</script>

<div class="flex w-full h-full flex-row items-center justify-center">
  <div class="sm:max-w-2xl lg:max-w-4xl px-6">
    {#key question}
      {#if question}
        <h1 class="text-3xl my-6">Question: {question.content}</h1>
        <label for="answer">Write your answer:</label>
        <div class="flex flex-row my-3">
          <input bind:value={answerInput}
            type="text"
            id="answer"
            class="block w-full p-2 border border-gray-200 rounded-lg shadow-sm mr-2"/>
          <button on:click={postAnswer}
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1.5 rounded-lg">
            Send
          </button>
        </div>
        <h2 class="text-2xl mt-7 mb-4">Answers:</h2>
        {#if question.answers && question.answers[0].id !== null}
          <ul>
            {#each question.answers as answer (answer.id)}
              <li>
                <div class="flex flex-col items-start justify-between my-4">
                  <p class="block max-w-m p-6 bg-white border border-gray-200 rounded-lg shadow-sm mb-2">
                    {answer.content}
                  </p>
                  <UpvoteButton upvotes={answer.upvoted_by} objectType="answer" objectId={answer.id} />
                </div>
              </li>
            {/each}
          </ul>
        {:else}
          <p>
            No answers yet, be the first to answer!
          </p>
        {/if}
      {/if}
    {/key}
  </div>
</div>