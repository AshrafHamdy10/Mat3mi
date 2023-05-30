<template>
  <div>
    <br />
    <div class="text-center">
      <RouterLink :to="{ name: 'home' }">
        <button class="btn btn-info">Visit Home Page</button>
      </RouterLink>
    </div>
    <img src="../assets/error-page.png" class="rounded mx-auto d-block h400" />
  </div>
</template>

<script>
export default {
  name: "ErrorPage",
};
</script>

<style scoped>
.h400 {
  height: 500px;
}
</style>
