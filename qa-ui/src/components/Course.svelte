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
    {#if course.questions}
      <h2 class="text-xl">Questions:</h2>
      <ul>
        {#each course.questions as question}
          <li>
            <a href="/questions/{question.id}" class="block max-w-m p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 my-3">
              {question.content}
            </a>
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</div>