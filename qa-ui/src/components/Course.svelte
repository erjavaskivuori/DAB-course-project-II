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

<div>
  {#if course}
    <h1>{course.title}</h1>
  {/if}
</div>