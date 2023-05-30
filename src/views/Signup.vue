<template>
  <div class="container">
    <SignUpForm />
  </div>
</template>

<script>
import SignUpForm from "@/components/Signup/Signup.vue";
export default {
  name: "SignUp",
  components: {
    SignUpForm,
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin-top: 100px;
}
</style>
