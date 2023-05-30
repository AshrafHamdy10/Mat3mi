<template>
  <Navbar />
  <div class="container form-control">
    <RouterLink
      :to="{ name: 'AddNewCategory', params: { locationId: locationId } }"
    >
      <button class="btn btn-success">Add Category</button> </RouterLink
    >&nbsp;&nbsp;
    <RouterLink :to="{ name: 'MenU', params: { locationId: locationId } }">
      <button class="btn btn-secondary">Back to menu</button>
    </RouterLink>
    <br />
    <div class="text-center">
      <h1 class="mb text-light">{{ locName }}</h1>
      <p class="text-dark">{{ locAddress }}</p>
    </div>
    <table class="table caption-top" v-if="numOfCategories > 0">
      <caption>
        <span class="text-light"
          >List Of Categories ({{ numOfCategories }})</span
        >
        <span class="float-end">
          <RouterLink
            :to="{
              name: 'DeleteAllCategories',
              params: { locationId: locationId },
            }"
          >
            <button class="btn btn-danger">Delete All Categories</button>
          </RouterLink>
        </span>
      </caption>
      <thead class="table-dark">
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cat, i) in listOfCategories" :key="i">
          <th scope="row">{{ cat.name }}</th>
          <td>
            <RouterLink
              :to="{
                name: 'UpdateCategory',
                params: { catId: cat.id, locationId: cat.locationId },
              }"
            >
              <button class="btn btn-success">Update</button> </RouterLink
            >&nbsp;
            <RouterLink
              :to="{
                name: 'DeleteCategory',
                params: { catId: cat.id, locationId: cat.locationId },
              }"
            >
              <button class="btn btn-danger">Delete</button>
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="alert alert-warning mg-10" role="alert">
      No Categories added yet
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions, mapMutations, mapState } from "vuex";
import Navbar from "@/components/Header/Navbar.vue";
export default {
  name: "ViewCategories",
  components: {
    Navbar,
  },
  data() {
    return {
      locationId: this.$route.params.locationId,
      userId: "",
      locName: "",
      locAddress: "",
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
      this.displayAllCategories({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
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
  },
};
</script>

<style lang="scss" scoped>
.mb {
  margin-bottom: 0;
}
</style>
