<template>
  <Navbar />
  <div class="container form-control">
    <p class="text-end text-dark">
      Welcome, <span class="text-light">{{ userName }}</span>
      <RouterLink :to="{ name: 'ProFile' }">
        <button class="btn btn-info" type="button">Profile</button>
      </RouterLink>
    </p>
    <RouterLink :to="{ name: 'AddNewLocation' }">
      <button type="button" class="btn btn-primary">Add New Restaurant</button>
    </RouterLink>
    <UserLocations :allLocations="listOfLocations" />
  </div>
</template>

<script>
import Navbar from "@/components/Header/Navbar.vue";
import UserLocations from "@/components/Locations/UserLocations.vue";
import { mapActions } from "vuex";
import axios from "axios";
export default {
  name: "HomeView",
  data() {
    return {
      userName: "",
      userId: "",
      listOfLocations: [],
    };
  },
  components: {
    Navbar,
    UserLocations,
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "SignUp" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
    }
    let result = await axios.get(
      `http://localhost:3000/locations?userId=${this.userId}`
    );
    if (result.status == 200 && result.data.length > 0) {
      console.log(result.data);
      this.listOfLocations = result.data;
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
  },
};
</script>
<style scoped lang="scss"></style>
