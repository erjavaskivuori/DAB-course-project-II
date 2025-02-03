<script>
  import { onMount } from "svelte";

  let courses = [];

  const getCourses = async () => {
    const response = await fetch("/api/courses");
    courses = await response.json();
    console.log(courses);
  };

  onMount(() => {
    getCourses();
  });
</script>

<div>
  <h1>Courses</h1>
  <ul>
    {#each courses as course}
      <li>
        <a href="/courses/{course.id}">{course.title}</a></li>
    {/each}
  </ul>
</div>