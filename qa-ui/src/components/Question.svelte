<script>
  import { onMount } from "svelte";
  export let questionId;

  let question;
  const getQuestion = async () => {
    const response = await fetch(`/api/question?id=${questionId}`);
    question = await response.json();
    console.log(question.answers);
  };

  onMount(() => {
    getQuestion();
  });
</script>

<div class="flex w-full h-full flex-row items-center justify-center">
  <div class="sm:max-w-2xl lg:max-w-4xl px-6">
    {#if question}
      <h1 class="text-3xl my-6">Question: {question.content}</h1>
      <form action="">
        <label for="question">Write your answer:</label>
        <div class="flex flex-row my-3">
          <input type="text" id="question" name="question" class="block w-full p-2 border border-gray-200 rounded-lg shadow-sm mr-2" />
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1.5 rounded-lg">Send</button>
        </div>
      </form>
      <h2 class="text-2xl mt-7 mb-4">Answers:</h2>
      {#if question.answers && question.answers[0].id !== null}
        <ul>
          {#each question.answers as answer}
            <li class="block max-w-m p-6 bg-white border border-gray-200 rounded-lg shadow-sm my-3">
              {answer.content}
            </li>
          {/each}
        </ul>
      {:else}
        <p>
          No answers yet, be the first to answer!
        </p>
      {/if}
    {/if}
  </div>
</div>