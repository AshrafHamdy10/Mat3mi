<template>
  <ul id="nav">
    <RouterLink
      :to="{ name: 'home', params: { pageTitle: 'Home Page' } }"
      exact
    >
      <a>Home</a>
    </RouterLink>
    <a href="#" @click="logMeOut()">Logout</a>
  </ul>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "NavBar",
  methods: {
    ...mapActions(["redirectTo"]),
    logMeOut() {
      localStorage.clear();
      //this.$router.push({ name: "LogIn" });
      this.redirectTo({ val: "LogIn" });
    },
  },
};
</script>

<style lang="scss" scoped>
$fontColor: darkcyan;
$navColor: #525a5a;

ul {
  display: flex;
  justify-content: center;
  list-style: none;
  margin-bottom: 10px;

  a {
    text-decoration: none;
    font-weight: bold;
    color: $fontColor;
    padding: 10px;
  }
}

a.router-link-exact-active a,
ul a a:hover {
  color: $navColor;
  box-shadow: 2px 2px 4px 0px $navColor;
}
</style>
