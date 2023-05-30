<template>
  <Navbar />
  <div class="container">
    <form @click.prevent class="form-control">
      <div class="row g-3 align-items-center">
        <h1 class="text-center">Update Your Profile</h1>
        <div class="col-auto d-block mx-auto">
          <input
            type="text"
            disabled
            class="form-control"
            placeholder="Enter Your Name"
            v-model="name"
          />
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="email"
            disabled
            class="form-control"
            placeholder="Enter Your Email"
            v-model="email"
          />
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="password"
            disabled
            class="form-control"
            placeholder="Enter Password"
            v-model="pass"
          />
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            type="submit"
            @click="updateProfile()"
            class="btn btn-primary"
          >
            Update Profile
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Navbar from "@/components/Header/Navbar.vue";
import { mapActions } from "vuex";
export default {
  name: "ProfileForm",
  components: {
    Navbar,
  },
  data() {
    return {
      name: "",
      email: "",
      pass: "",
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.name = JSON.parse(user).name;
      this.email = JSON.parse(user).email;
      this.pass = JSON.parse(user).pass;
    } else {
      this.redirectTo({ val: "SignUp" });
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    updateProfile() {
      this.redirectTo({ val: "UpdateProfile" });
    },
  },
};
</script>

<style lang="scss" scoped></style>
