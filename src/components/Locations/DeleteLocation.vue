<template>
  <Navbar />
  <div class="container">
    <form @click.prevent class="form-control">
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1>Delete Restaurant #{{ deleteLocation }}</h1>
          <hr />
          <p class="text-danger">
            Are you sure you want to delete this location?
          </p>
          <div class="text-center">
            <h4 class="text-success">{{ name }}</h4>
            <span class="text-muted">{{ address }}</span> <br />
            <span class="text-muted">{{ phone }}</span> <br />
          </div>
          <hr />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto mb-2">
          <button class="btn btn-dark" @click="goBack()">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteRest()">Delete</button>
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
      </div>
      <div class="row g-3 align-items-center">
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
import { mapActions } from "vuex";
import axios from "axios";
export default {
  name: "DeleteLocation",
  components: {
    Navbar,
  },
  data() {
    return {
      name: "",
      address: "",
      phone: "",
      userId: "",
      deleteLocation: "",
      locationData: [],
      successMessage: "",
      errorMessage: "",
      allItemsIdIs: [],
      allCatsIdIs: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "SignUp" });
    } else {
      this.deleteLocation = this.$route.params.locationId;
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAccessThisLocation();
      let result = await axios.get(
        `http://localhost:3000/items?locId=${this.deleteLocation}`
      );
      let resultLen = result.data.length;
      for (var i = 0; i < resultLen; i++) {
        this.allItemsIdIs.push(result.data[i].id);
      }
      let resultForCategories = await axios.get(
        `http://localhost:3000/categories?locationId=${this.deleteLocation}`
      );
      let resultCatLen = resultForCategories.data.length;
      for (var c = 0; c < resultCatLen; c++) {
        this.allCatsIdIs.push(resultForCategories.data[c].id);
      }
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    goBack() {
      this.redirectTo({ val: "home" });
    },
    async canCurrentUserAccessThisLocation() {
      let result = await axios.get(
        `http://localhost:3000/locations?id=${this.deleteLocation}&userId=${this.userId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.locationData = result.data;
        this.name = this.locationData[0].name;
        this.address = this.locationData[0].address;
        this.phone = this.locationData[0].phone;
      } else {
        this.redirectTo({ val: "home" });
      }
    },
    async deleteRest() {
      let allItemsResults = [];
      for (var t = 0; t < this.allItemsIdIs.length; t++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.allItemsIdIs[t]}`
        );
        if (result.status == 200) {
          allItemsResults.push(true);
        } else {
          allItemsResults.push(false);
        }
      }
      let allCatsResults = [];
      for (var s = 0; s < this.allCatsIdIs.length; s++) {
        let result = await axios.delete(
          `http://localhost:3000/categories/${this.allCatsIdIs[s]}`
        );
        if (result.status == 200) {
          allCatsResults.push(true);
        } else {
          allCatsResults.push(false);
        }
      }
      let result = await axios.delete(
        `http://localhost:3000/locations/${this.deleteLocation}`
      );
      if (
        result.status == 200 &&
        !allCatsResults.includes(false) &&
        !allItemsResults.includes(false)
      ) {
        this.successMessage =
          "Location and all related categories are deleted...";
        this.errorMessage = "";
        setTimeout(() => {
          this.redirectTo({ val: "home" });
        }, 2000);
      } else {
        this.errorMessage = "Something went wrong, try again!";
        this.successMessage = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
