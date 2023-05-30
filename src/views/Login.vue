<template>
  <div class="container">
    <LoginForm />
  </div>
</template>

<script>
import LoginForm from "@/components/Login/Login.vue";
export default {
  name: "LogIn",
  components: {
    LoginForm,
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin-top: 100px;
}
</style>
