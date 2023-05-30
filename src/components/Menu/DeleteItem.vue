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
            <h1>Delete Item #{{ itemId }}</h1>
            <h4>Item Name: {{ itemName }}</h4>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <hr />
          <p class="text-danger">
            Are you sure you want to delete this Item?🤔
          </p>
          <hr />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto mb-2">
          <button class="btn btn-dark" @click="goBack()">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteItem()">Delete</button>
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
  name: "DeleteItem",
  components: {
    Navbar,
  },
  data() {
    return {
      locationId: this.$route.params.locationId,
      itemId: this.$route.params.itemId,
      userId: "",
      locationData: "",
      successMessage: "",
      errorMessage: "",
      locName: "",
      locAddress: "",
      allItemsIdIs: [],
      pickedCategory: "",
      itemName: "",
      description: "",
      itemsQty: 1,
      itemPrice: "",
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "SignUp" });
    } else {
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAccessThisLocation();
      this.canUserAccessThisItem({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
        itemIdIs: this.itemId,
        redirectToPage: "home",
      });
      this.getCategoryName(this.userId, this.locationId, this.catId);
      let result = await axios.get(
        `http://localhost:3000/items?catId=${this.catId}`
      );
      console.log(result.data.length);
      let resultLen = result.data.length;
      for (var i = 0; i < resultLen; i++) {
        this.allItemsIdIs.push(result.data[i].id);
      }
      this.getItemInfo(this.userId, this.locationId, this.itemId);
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
    async getItemInfo(userId, locId, itemId) {
      let result = await axios.get(
        `http://localhost:3000/items?userId=${userId}&locationId=${locId}&id=${itemId}`
      );
      let resultData = result.data[0];
      if (result.status == 200) {
        this.description = resultData.description;
        this.itemName = resultData.name;
        this.itemPrice = resultData.price;
        this.itemsQty = resultData.qty;
        this.pickedCategory = resultData.catId;
      }
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
    async deleteItem() {
      let result = await axios.delete(
        `http://localhost:3000/items/${this.itemId}`
      );
      /*  let allResults = [];
      for (var i = 0; i < this.allItemsIdIs.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.allItemsIdIs[i]}`
        );
        if (result.status == 200) {
          allResults.push(true);
        } else {
          allResults.push(false);
        }
      } */
      if (result.status == 200) {
        this.successMessage = "Item is deleted...";
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
