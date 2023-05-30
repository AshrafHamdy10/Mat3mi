<template>
  <Navbar />
  <div class="container">
    <form @click.prevent class="form-control">
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div class="clearfix"></div>
          <div class="text-center">
            <h1 class="mb text-success">{{ locName }}</h1>
            <p class="text-dark">{{ locAddress }}</p>
          </div>
          <div class="clearfix"></div>
          <div class="text-center">
            <h1 class="text-danger">Delete All Items</h1>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <hr />
          <p class="text-danger">
            Are you sure you want to delete All Items for above Location?🤔
          </p>
          <hr />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto mb-2">
          <button class="btn btn-dark" @click="goBack()">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="DeleteAllItems()">
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
          class="col-auto d-block mx-auto alert alert-warning"
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
import { mapMutations, mapActions } from "vuex";
import axios from "axios";
export default {
  name: "DeleteAllItems",
  components: {
    Navbar,
  },
  data() {
    return {
      locationId: this.$route.params.locationId,
      userId: "",
      locationData: "",
      successMessage: "",
      errorMessage: "",
      locName: "",
      locAddress: "",
      allItemsIdIs: [],
      myResult: "",
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "SignUp" });
    } else {
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAccessThisLocation();
      let result = await axios.get(
        `http://localhost:3000/items?userId=${this.userId}&locId=${this.locationId}`
      );
      this.myResult = result.data;
      let resultLen = this.myResult.length;
      for (var i = 0; i < resultLen; i++) {
        this.allItemsIdIs.push(result.data[i].id);
      }
      console.table(this.allItemsIdIs);
    }
  },
  methods: {
    ...mapMutations(["canUserAccessThisItem"]),
    ...mapActions(["redirectTo"]),
    goBack() {
      this.$router.push({
        name: "MenU",
        params: { locationId: this.locationId },
      });
    },
    async canCurrentUserAccessThisLocation() {
      let result = await axios.get(
        `http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.locationData = result.data;
        this.locName = this.locationData[0].name;
        this.locAddress = this.locationData[0].address;
      } else {
        this.redirectTo({ val: "home" });
      }
    },
    async DeleteAllItems() {
      let allResults = [];
      for (var i = 0; i < this.allItemsIdIs.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.allItemsIdIs[i]}`
        );
        if (result.status == 200) {
          allResults.push(true);
        } else {
          allResults.push(false);
        }
      }
      if (!allResults.includes(false)) {
        this.successMessage = "All Items are deleted...";
        this.errorMessage = "";
        setTimeout(() => {
          this.$router.push({
            name: "MenU",
            params: { locationId: this.locationId },
          });
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
