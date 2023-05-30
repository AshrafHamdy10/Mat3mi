<template>
  <form @click.prevent class="form-control">
    <img
      src="../../assets/logo.png"
      alt="logo"
      class="rounded mx-auto d-block"
    />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <h1 class="text-center">Sign Up</h1>
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
          class="form-control is-invalid text-danger mb-2"
          id="validationServerUsername"
          v-if="v$.pass.$error"
          >{{ v$.pass.$errors[0].$message }}</span
        >
      </div>
    </div>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <button
          type="submit"
          @click="validateEmailBeforeSignUp()"
          class="btn btn-success w250 mb-2"
        >
          Sign Up
        </button>
        <br />
        <button
          type="button"
          @click="redirectTo({ val: 'LogIn' })"
          class="btn btn-primary w250"
        >
          Login
        </button>
      </div>
      <p class="text-center text-primary">
        Login If You Already Have An Account
      </p>
    </div>
    <div class="row g-3 align-items-center">
      <div
        class="col-auto d-block mx-auto alert alert-success"
        v-if="successMessage.length > 0"
      >
        {{ successMessage }}
      </div>
      <div
        class="col-auto d-block mx-auto alert alert-danger"
        v-if="errorMessage.length > 0"
      >
        {{ errorMessage }}
      </div>
    </div>
  </form>
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
export default {
  name: "SignUpForm",
  data() {
    return {
      v$: useVuelidate(),
      name: "",
      pass: "",
      email: "",
      successMessage: "",
      errorMessage: "",
      userEmailExists: "",
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(10) },
      pass: { required, minLength: minLength(10) },
      email: { required, email },
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.redirectTo({ val: "home" });
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    LoginPage() {
      this.$router.push({ name: "LogIn" });
    },
    async validateEmailBeforeSignUp() {
      let res = await axios.get(
        `http://localhost:3000/users?email=${this.email}`
      );
      if (res.status == 200) {
        this.userEmailExists = res.data;
        if (this.userEmailExists.length != 1) {
          this.successMessage = "";
          this.errorMessage = "";
          this.signUpNow();
        } else {
          this.successMessage = "";
          this.errorMessage = "This Email Already Exists..🙄";
        }
      }
    },
    async signUpNow() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("Form Validated Successfully");
        let result = await axios.post("http://localhost:3000/users", {
          name: this.name,
          email: this.email,
          pass: this.pass,
        });
        if (result.status == 201) {
          console.log("Added New User Successfully");
          //save user data in local storage
          localStorage.setItem("user-info", JSON.stringify(result.data));
          console.log(result.data);
          this.successMessage = "Loading...";
          this.errorMessage = "";
          //redirect to home page
          setTimeout(() => {
            this.redirectTo({ val: "home" });
          }, 2000);
        } else {
          this.successMessage = "";
          this.errorMessage = "Something went wrong, please try again";
        }
      } else {
        this.successMessage = "";
        this.errorMessage = "You must fill in all fields..🙄";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.error-feedback {
  color: red;
  font-size: 0.85em;
}
</style>
