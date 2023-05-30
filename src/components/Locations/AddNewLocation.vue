<template>
  <Navbar />
  <div class="container">
    <form @click.prevent class="form-control">
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1>Add New Restaurant</h1>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-2"
            :class="{ 'form-group-error': v$.name.$error }"
          >
            <input
              type="text"
              class="w250 form-control"
              id="floatRestName"
              placeholder="Enter Restaurant Name"
              v-model.trim="state.name"
            />
            <label for="floatRestName">Enter Restaurant Name</label>
          </div>
          <span
            class="form-control is-invalid text-danger"
            v-if="v$.name.$error"
            >{{ v$.name.$errors[0].$message }}</span
          >
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-2 mt-2"
            :class="{ 'form-group-error': v$.phone.$error }"
          >
            <input
              type="text"
              class="w250 form-control"
              id="floatPhone"
              placeholder="Phone Number"
              v-model.trim="state.phone"
            />
            <label for="floatPhone">Phone Number</label>
          </div>
          <span
            class="form-control is-invalid text-danger"
            v-if="v$.phone.$error"
            >{{ v$.phone.$errors[0].$message }}</span
          >
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-2 mt-2"
            :class="{ 'form-group-error': v$.address.$error }"
          >
            <input
              type="text"
              class="w250 form-control"
              id="floatAddress"
              placeholder="Restaurant Address"
              v-model.trim="state.address"
            />
            <label for="floatAddress">Restaurant Address</label>
          </div>
          <span
            class="form-control is-invalid text-danger"
            v-if="v$.address.$error"
            >{{ v$.address.$errors[0].$message }}</span
          >
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            type="button"
            @click="addLocation()"
            class="btn btn-success w250"
          >
            Add Now
          </button>
        </div>
      </div>
      <br />
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
  </div>
</template>

<script>
import Navbar from "@/components/Header/Navbar.vue";
import useValidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import { mapActions } from "vuex";
import axios from "axios";

export default {
  name: "AddNewLocation",
  setup() {
    const state = reactive({
      name: "",
      phone: "",
      address: "",
    });
    const rules = computed(() => {
      return {
        name: { required, minLength: minLength(5) },
        phone: { required, minLength: minLength(11) },
        address: { required, minLength: minLength(10) },
      };
    });
    const v$ = useValidate(rules, state);
    return {
      state,
      v$,
    };
  },
  data() {
    return {
      userId: "",
      successMessage: "",
      errorMessage: "",
    };
  },
  components: {
    Navbar,
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "home" });
    } else {
      this.userId = JSON.parse(user).id;
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async addLocation() {
      this.v$.$validate(); //Activate My Validations
      if (!this.v$.$error) {
        console.log("Validated");
        let results = await axios.post(`http://localhost:3000/locations`, {
          name: this.state.name,
          phone: this.state.phone,
          address: this.state.address,
          userId: this.userId,
        });
        if (results.status == 201) {
          this.errorMessage = "";
          this.successMessage = "Added New Location👍";
          setTimeout(() => {
            this.redirectTo({ val: "home" });
          }, 2000);
          //Show Success Message
          console.log("Adding New Location Successfully");
        } else {
          //Show Error Message
          this.successMessage = "";
          this.errorMessage = "Something went wrong, please try again!😟";
          console.log("Failed Adding New Location");
        }
      } else {
        this.successMessage = "";
        this.errorMessage = "You must fill in all required fields!🙄";
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
