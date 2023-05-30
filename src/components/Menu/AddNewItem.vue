<template>
  <Navbar />
  <div class="container">
    <div class="clearfix"></div>
    <RouterLink :to="{ name: 'MenU', params: { locId: locationId } }">
      <button type="button" class="float-start btn btn-secondary">
        Back to Menu
      </button>
    </RouterLink>
    <div class="clearfix"></div>
    <div class="text-center">
      <h1 class="mb text-light">{{ locName }}</h1>
      <p class="text-light">{{ locAddress }}</p>
    </div>
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1>Add New Item</h1>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.itemName.$error }"
          >
            <input
              type="text"
              class="w250 form-control"
              id="floatItemName"
              placeholder="Enter Item Name"
              v-model.trim="itemName"
            />
            <label for="floatItemName">Enter Item Name</label>
            <span
              class="error-feedback text-warning"
              v-if="v$.itemName.$error"
              >{{ v$.itemName.$errors[0].$message }}</span
            >
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.itemPrice.$error }"
          >
            <input
              type="number"
              class="w250 form-control"
              id="floatItemPrice"
              placeholder="Enter Item Price"
              v-model.trim="itemPrice"
            />
            <label for="floatItemPrice">Enter Item Price</label>
            <span
              class="error-feedback text-warning"
              v-if="v$.itemPrice.$error"
              >{{ v$.itemPrice.$errors[0].$message }}</span
            >
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.itemsQty.$error }"
          >
            <input
              type="number"
              class="w250 form-control"
              id="floatItemQty"
              placeholder="Enter Item Quantity"
              v-model.trim="itemsQty"
            />
            <label for="floatItemQty">Enter Item Quantity</label>
            <span
              class="error-feedback text-warning"
              v-if="v$.itemsQty.$error"
              >{{ v$.itemsQty.$errors[0].$message }}</span
            >
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.description.$error }"
          >
            <textarea
              class="w250 h200 form-control"
              placeholder="Enter Item Description"
              id="floatItemDescription"
              v-model.trim="description"
            ></textarea>
            <label for="floatItemDescription">Enter Item Description</label>
            <span
              class="error-feedback text-warning"
              v-if="v$.description.$error"
              >{{ v$.description.$errors[0].$message }}</span
            >
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.pickedCategory.$error }"
          >
            <select
              class="w250 form-select"
              id="floatItemCategory"
              v-model.trim="pickedCategory"
            >
              <option
                v-for="(cat, i) in listOfCategories"
                :key="i"
                :value="cat.id"
              >
                {{ cat.name }}
              </option>
            </select>
            <label for="floatItemCategory">Select Category Name</label>
            <span
              class="error-feedback text-warning"
              v-if="v$.pickedCategory.$error"
              >{{ v$.pickedCategory.$errors[0].$message }}</span
            >
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            type="button"
            @click="addNewItem()"
            class="w250 btn btn-success"
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
import { mapActions, mapState, mapMutations } from "vuex";
import axios from "axios";
import useValidate from "@vuelidate/core";
import { required, minLength, maxLength, between } from "@vuelidate/validators";
export default {
  name: "AddNewItem",
  components: {
    Navbar,
  },
  data() {
    return {
      v$: useValidate(),
      userName: "",
      userId: "",
      locationId: this.$route.params.locationId,
      locName: "",
      locAddress: "",
      pickedCategory: "",
      successMessage: "",
      errorMessage: "",
      itemName: "",
      description: "",
      itemsQty: 1,
      itemPrice: "",
    };
  },
  computed: {
    ...mapState([
      "isUserLoggedIn",
      "loggedInUserId",
      "numOfCategories",
      "listOfCategories",
    ]),
  },
  validations() {
    return {
      itemName: { required, minLength: minLength(6) },
      description: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(120),
      },
      itemsQty: { required, between: between(1, 100000) },
      itemPrice: { required, between: between(0, 1000000) },
      pickedCategory: { required },
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "SignUp" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
      this.isLoggedInUser();
      /* this.locationId = this.$route.params.locationID; */
      this.displayAllCategories({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
      });
      this.canUserAccessThisLocation({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
        redirectToPage: "home",
      });
      this.getLocationInfo(this.userId, this.locationId);
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    ...mapMutations([
      "isLoggedInUser",
      "displayAllCategories",
      "canUserAccessThisLocation",
    ]),
    async getLocationInfo(userId, locId) {
      let result = await axios.get(
        `http://localhost:3000/locations?userId=${userId}&id=${locId}`
      );
      let locDetails = [];
      if (result.status == 200 && result.data.length > 0) {
        locDetails = result.data;
        this.locName = locDetails[0].name;
        this.locAddress = locDetails[0].address;
      }
    },
    async addNewItem() {
      this.v$.$validate(); //Activate My Validations
      if (!this.v$.$error) {
        console.log("Validated");
        let results = await axios.post(`http://localhost:3000/items`, {
          name: this.itemName,
          price: parseFloat(this.itemPrice).toFixed(2),
          description: this.description,
          qty: this.itemsQty,
          userId: this.userId,
          locId: parseInt(this.locationId, 10),
          catId: this.pickedCategory,
        });
        if (results.status == 201) {
          this.errorMessage = "";
          this.successMessage = "Added New Item👍";
          setTimeout(() => {
            this.$router.push({
              name: "MenU",
              params: { locationId: this.locationId },
            });
          }, 2000);
          //Show Success Message
          console.log("Adding New Item Successfully");
        } else {
          //Show Error Message
          this.successMessage = "";
          this.errorMessage = "Something went wrong, please try again!😟";
          console.log("Failed Adding New Item");
        }
      } else {
        this.successMessage = "";
        this.errorMessage = "You must fill in all required fields!🙄";
      }
    },
  },
};
</script>

<style lang="scss">
.mb {
  margin-bottom: 0;
}
.h200 {
  min-height: 150px;
  max-height: 150px;
}
.w250 {
  min-width: 250px;
}
.form-group-error {
  color: red;
}
.form-group-error input,
.form-group-error select,
.form-group-error textarea {
  border-color: red;
}
</style>
