<script>
  import { userUuid } from "../stores/stores.js";
</script>

<nav class="p-4 mb-4 shadow">
  <div class="flex w-full h-full flex-row items-center justify-center">
    <a href="/">
      <button class="bg-blue-600 text-white font-bold p-1.5 rounded-md mr-5">Home</button>
    </a>
    <span class="text-sm text-gray-700">Hello {$userUuid}!</span>
  </div>
</nav>
