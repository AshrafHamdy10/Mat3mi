<template>
  <Navbar />
  <div class="container">
    <form @click.prevent class="form-control">
      <div class="row g-3 align-items-center">
        <h1 class="text-center">Update Your Profile</h1>
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-2"
            :class="{ 'form-group-error': v$.name.$error }"
          >
            <input
              type="text"
              class="w250 form-control"
              id="floatName"
              placeholder="Enter Your Name"
              v-model.trim="name"
            />
            <label for="floatName">Enter Your Name</label>
          </div>
          <span
            class="form-control is-invalid text-danger"
            id="validationServerUsername"
            v-if="v$.name.$error"
            >{{ v$.name.$errors[0].$message }}</span
          >
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-2 mt-2"
            :class="{ 'form-group-error': v$.email.$error }"
          >
            <input
              type="email"
              class="w250 form-control"
              id="floatEmail"
              placeholder="Enter Your Email"
              v-model.trim="email"
            />
            <label for="floatEmail">Enter Your Email</label>
          </div>
          <span
            class="form-control is-invalid text-danger"
            id="validationServerUsername"
            v-if="v$.email.$error"
            >{{ v$.email.$errors[0].$message }}</span
          >
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-2 mt-2"
            :class="{ 'form-group-error': v$.pass.$error }"
          >
            <input
              type="password"
              class="w250 form-control"
              id="floatPass"
              placeholder="Enter Password"
              v-model.trim="pass"
            />
            <label for="floatPass">Enter Password</label>
          </div>
          <span
            class="form-control is-invalid text-danger"
            id="validationServerUsername"
            v-if="v$.pass.$error"
            >{{ v$.pass.$errors[0].$message }}</span
          >
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            type="submit"
            @click="updateProfileNow()"
            class="btn btn-primary w250"
          >
            Update Profile
          </button>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div
          class="col-auto d-block mx-auto alert alert-danger"
          v-if="updateErr.length > 0"
        >
          {{ updateErr }}
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Navbar from "@/components/Header/Navbar.vue";
import axios from "axios";
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { mapActions } from "vuex";
export default {
  name: "UpdateProfile",
  components: {
    Navbar,
  },
  data() {
    return {
      v$: useValidate(),
      name: "",
      email: "",
      pass: "",
      userId: "",
      updateErr: "",
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(10) },
      email: { required, email },
      pass: { required, minLength: minLength(10) },
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.name = JSON.parse(user).name;
      this.email = JSON.parse(user).email;
      this.pass = JSON.parse(user).pass;
      this.userId = JSON.parse(user).id;
    } else {
      this.redirectTo({ val: "SignUp" });
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async updateProfileNow() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("Validated");
        //put
        let result = await axios.put(
          `http://localhost:3000/users/${this.userId}`,
          {
            name: this.name,
            email: this.email,
            pass: this.pass,
          }
        );
        if (result.status == 200) {
          console.log("Profile Updated Successfully");
          localStorage.setItem("user-info", JSON.stringify(result.data));
          this.redirectTo({ val: "ProFile" });
        } else {
          console.warn("Profile is Not Updated");
          this.updateErr = "Something went wrong, try again!";
        }
      } else {
        this.updateErr = "Something went wrong, refresh the page!";
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
