<script>
  import { onMount } from "svelte";
  export let courseId;

  let course;
  const getCourse = async () => {
    const response = await fetch(`/api/course?id=${courseId}`);
    course = await response.json();
    console.log(course);
  };

  onMount(() => {
    getCourse();
  });
</script>

<div class="px-6">
  {#if course}
    <h1 class="text-3xl my-6">{course.title}</h1>
    <form action="">
      <label for="question">Ask a question:</label>
      <div class="flex flex-row my-3">
        <input type="text" id="question" name="question" class="block w-full p-2 border border-gray-200 rounded-lg shadow-sm mr-2" />
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1.5 rounded-lg">Send</button>
      </div>
    </form>
    <h2 class="text-xl mt-7 mb-4">Questions:</h2>
    {#if course.questions}
      <ul>
        {#each course.questions as question}
          <li>
            <a href="/questions/{question.id}" class="block max-w-m p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 my-3">
              {question.content}
            </a>
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