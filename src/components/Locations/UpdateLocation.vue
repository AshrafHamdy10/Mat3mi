<template>
  <Navbar />
  <div class="container">
    <form @click.prevent class="form-control">
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1>Update Restaurant</h1>
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
            class="form-control is-invalid text-danger mb-2"
            v-if="v$.address.$error"
            >{{ v$.address.$errors[0].$message }}</span
          >
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            type="button"
            @click="UpdateLocation()"
            class="btn btn-success mt-3 w250"
          >
            Update Now
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
  name: "UpdateLocation",
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
      locationId: "",
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
      this.locationId = this.$route.params.locationId;
      this.canCurrentUserAccessThisLocation();
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async canCurrentUserAccessThisLocation() {
      let result = await axios.get(
        `http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.locationData = result.data;
        this.state.name = this.locationData[0].name;
        this.state.address = this.locationData[0].address;
        this.state.phone = this.locationData[0].phone;
      } else {
        this.redirectTo({ val: "home" });
      }
    },
    async UpdateLocation() {
      this.v$.$validate(); //Activate My Validations
      if (!this.v$.$error) {
        console.log("Validated");
        //put
        let results = await axios.put(
          `http://localhost:3000/locations/${this.locationId}`,
          {
            name: this.state.name,
            phone: this.state.phone,
            address: this.state.address,
            userId: this.userId,
          }
        );
        if (results.status == 200) {
          this.errorMessage = "";
          this.successMessage = "Location is updated👍";
          setTimeout(() => {
            this.redirectTo({ val: "home" });
          }, 2000);
          //Show Success Message
          console.log("Updating Location Successfully");
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
