<template>
  <Navbar />
  <div class="container">
    <form @click.prevent class="form-control">
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1 class="text-center">Delete All Locations</h1>
          <hr />
          <p class="text-danger">
            Are you sure you want to delete all locations?
          </p>
          <p class="text-danger">
            It will also delete all related categories and items
          </p>
          <hr />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto mb-2">
          <button class="btn btn-dark" @click="goBack()">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteAllLocations()">
            Delete All
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
import { mapActions } from "vuex";
import axios from "axios";
import Navbar from "@/components/Header/Navbar.vue";
export default {
  name: "DeleteAllLocations",
  components: {
    Navbar,
  },
  data() {
    return {
      userId: "",
      successMessage: "",
      errorMessage: "",
      allLocationId: [],
      allItemsIdIs: [],
      allCatsIdIs: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "SignUp" });
    } else {
      this.userId = JSON.parse(user).id;
      //Locations
      let resultLoc = await axios.get(
        `http://localhost:3000/locations?userId=${this.userId}`
      );
      console.log(resultLoc.data.length);
      let resultLocLen = resultLoc.data.length;
      for (var l = 0; l < resultLocLen; l++) {
        this.allLocationId.push(resultLoc.data[l].id);
      }
      //CAtegories
      let resultCat = await axios.get(
        `http://localhost:3000/categories?userId=${this.userId}`
      );
      console.log(resultCat.data.length);
      let resultCatLen = resultCat.data.length;
      for (var c = 0; c < resultCatLen; c++) {
        this.allCatsIdIs.push(resultCat.data[c].id);
      }
      //items
      let resultItem = await axios.get(
        `http://localhost:3000/items?userId=${this.userId}`
      );
      console.log(resultItem.data.length);
      let resultItemLen = resultItem.data.length;
      for (var i = 0; i < resultItemLen; i++) {
        this.allItemsIdIs.push(resultItem.data[i].id);
      }
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    goBack() {
      this.redirectTo({ val: "home" });
    },
    async deleteAllLocations() {
      let allItemsResults = [];
      for (var i = 0; i < this.allItemsIdIs.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.allItemsIdIs[i]}`
        );
        if (result.status == 200) {
          allItemsResults.push(true);
        } else {
          allItemsResults.push(false);
        }
      }
      let allCatsResults = [];
      for (var c = 0; c < this.allCatsIdIs.length; c++) {
        let result = await axios.delete(
          `http://localhost:3000/categories/${this.allCatsIdIs[c]}`
        );
        if (result.status == 200) {
          allCatsResults.push(true);
        } else {
          allCatsResults.push(false);
        }
      }
      let allResults = [];
      for (var l = 0; l < this.allLocationId.length; l++) {
        let result = await axios.delete(
          `http://localhost:3000/locations/${this.allLocationId[l]}`
        );
        if (result.status == 200) {
          allResults.push(true);
        } else {
          allResults.push(false);
        }
      }
      if (
        !allResults.includes(false) &&
        !allItemsResults.includes(false) &&
        !allCatsResults.includes(false)
      ) {
        this.successMessage = "All Locations are deleted...";
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
