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

<div class="px-6">
  <h1 class="text-4xl my-5">Courses</h1>
  <ul>
    {#each courses as course}
      <li>
        <a href="/courses/{course.id}" class="block max-w-m p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 my-3">
          <p class="text-lg">{course.title}</p>
        </a>
      </li>
    {/each}
  </ul>
</div>