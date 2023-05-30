<template>
  <Navbar />
  <div class="container">
    <RouterLink
      :to="{ name: 'ViewCategories', params: { locationId: locationId } }"
    >
      <button class="btn btn-secondary">Back to Category</button> </RouterLink
    >&nbsp;&nbsp;
    <RouterLink :to="{ name: 'MenU', params: { locationId: locationId } }">
      <button class="btn btn-dark">Back to menu</button>
    </RouterLink>
    <br />
    <div class="text-center">
      <h1 class="mb0 text-light">{{ locName }}</h1>
      <p class="text-dark">{{ locAddress }}</p>
    </div>
  </div>
  <form @click.prevent class="form-control">
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <h1>Update Category</h1>
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
            id="floatCatName"
            placeholder="Add Category Name"
            v-model.trim="name"
          />
          <label for="floatCatName">Add Category Name</label>
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
        <button
          type="button"
          @click="updateCategory()"
          class="btn btn-success w250 mt-2"
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
</template>

<script>
import axios from "axios";
import useValidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import { mapActions, mapMutations } from "vuex";
import Navbar from "@/components/Header/Navbar.vue";
export default {
  name: "AddNewCategory",
  components: {
    Navbar,
  },
  data() {
    return {
      v$: useValidate(),
      locationId: this.$route.params.locationId,
      catId: this.$route.params.catId,
      userId: "",
      locName: "",
      locAddress: "",
      name: "",
      successMessage: "",
      errorMessage: "",
      listOfUserCategories: [],
      categoryNames: [],
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(4), maxLength: maxLength(15) },
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "SignUp" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
      this.canUserAccessThisLocation({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
        redirectToPage: "home",
      });
      this.canUserAccessThisCategory({
        userIdIs: this.userId,
        catIdIs: this.catId,
        locationIdIs: this.locationId,
        redirectToPage: "home",
      });
      this.getLocationInfo(this.userId, this.locationId);
      this.displayUserCategories(this.userId, this.locationId);
      this.getCategoryName(this.userId, this.locationId, this.catId);
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    ...mapMutations([
      "isLoggedInUser",
      "displayAllCategories",
      "canUserAccessThisLocation",
      "canUserAccessThisCategory",
    ]),
    async displayUserCategories(userId, locId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locId}`
      );
      if (result.status == 200) {
        this.listOfUserCategories = result.data;
      }
    },
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
    async getCategoryName(userId, locId, catId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locId}&id=${catId}`
      );
      if (result.status == 200) {
        this.categoryNames = result.data;
        if (this.categoryNames.length > 0) {
          this.name = this.categoryNames[0].name;
        }
      }
    },
    async updateCategory() {
      this.v$.$validate();
      let filterCategoryName = this.listOfUserCategories.filter(
        (v) => v.name.toLocaleLowerCase() == this.name.toLocaleLowerCase()
      );
      console.table(this.listOfUserCategories);

      if (!this.v$.$error) {
        if (filterCategoryName.length > 0) {
          this.errorMessage = "Category Name Already Exist, try another name";
          this.successMessage = "";
        } else {
          let result = await axios.put(
            `http://localhost:3000/categories/${this.catId}`,
            {
              name: this.name,
              userId: this.userId,
              locationId: parseInt(this.locationId, 10),
            }
          );
          if (result.status == 200) {
            this.successMessage = "Update Category Name Successfully";
            this.errorMessage = "";
            setTimeout(() => {
              this.$router.push({
                name: "ViewCategories",
                params: { locationId: this.locationId },
              });
            }, 2000);
          } else {
            this.successMessage = "";
            this.errorMessage = "Something went wrong, please try again!😟";
          }
        }
      } else {
        this.successMessage = "";
        this.errorMessage = "You must fill in Category Name!🙄";
      }
    },
  },
};
</script>

<style lang="scss">
.container {
  background-image: url("../../assets/kitchen.jpg");
}
.mb0 {
  margin-bottom: 0;
}
</style>
