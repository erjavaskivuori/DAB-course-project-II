<script>
  export let questions = [];
</script>
<div>
  <h1>Questions</h1>
  <ul>
    {#each questions as question}
      <li>
        <a href="/questions/{question.id}">{question.content}</a></li>
    {/each}
  </ul>
</div>