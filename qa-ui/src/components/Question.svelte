<script>
  import { onMount } from "svelte";
  export let questionId;

  let question;
  const getQuestion = async () => {
    const response = await fetch(`/api/question?id=${questionId}`);
    question = await response.json();
    console.log(question);
  };

  onMount(() => {
    getQuestion();
  });
</script>

<div>
  {#if question}
    <h1>{question.content}</h1>
    {#if question.answers}
      <h2>Answers</h2>
      <ul>
        {#each question.answers as answer}
          <li>{answer.content}</li>
        {/each}
      </ul>
    {/if}
  {/if}
</div>