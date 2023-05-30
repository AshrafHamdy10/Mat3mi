<template>
  <form @click.prevent class="form-control">
    <img
      src="../../assets/logo.png"
      alt="logo"
      class="rounded mx-auto d-block"
    />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <h1 class="text-center">Hi, Login..</h1>
        <div
          class="form-floating mb-2"
          :class="{ 'form-group-error': v$.email.$error }"
        >
          <input
            type="email"
            class="w250 form-control"
            id="floatEmail"
            placeholder="Your Email is"
            v-model.trim="state.email"
          />
          <label for="floatEmail">Your Email is</label>
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
            placeholder="Your Password is"
            v-model.trim="state.pass"
          />
          <label for="floatPass">Your Password is</label>
        </div>
        <span
          class="form-control is-invalid text-danger mb-1"
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
          @click="userLogin()"
          class="btn btn-success w250 mb-1 mt-1"
        >
          Login
        </button>
        <br />
        <button
          type="button"
          @click="redirectTo({ val: 'SignUp' })"
          class="btn btn-primary w250 mt-2"
        >
          Sign Up
        </button>
        <p class="text-primary text-center">Don't have an account..Sign Up</p>
      </div>
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
import axios from "axios";
import { mapActions } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { reactive, computed } from "vue";
export default {
  name: "LoginForm",
  //composition API
  setup() {
    //data
    const state = reactive({
      pass: "",
      email: "",
    });
    //Validations
    const rules = computed(() => {
      return {
        email: { required, email },
        pass: { required },
      };
    });

    const v$ = useVuelidate(rules, state);
    return {
      state,
      v$,
    };
  },
  data() {
    return {
      successMessage: "",
      errorMessage: "",
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
    async userLogin() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("Form Validated Successfully");
        let result = await axios.get(
          `http://localhost:3000/users?email=${this.state.email}&pass=${this.state.pass}`
        );
        if (result.status == 200 && result.data.length > 0) {
          localStorage.setItem("user-info", JSON.stringify(result.data[0]));
          console.log("Logged In");
          this.successMessage = "Loading...";
          this.errorMessage = "";
          setTimeout(() => {
            this.redirectTo({ val: "home" });
          }, 2000);
        } else {
          this.successMessage = "";
          this.errorMessage = "User is invalid..😟";
        }
      } else {
        this.successMessage = "";
        this.errorMessage = "You must Enter Your Email and Password..🙄";
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
