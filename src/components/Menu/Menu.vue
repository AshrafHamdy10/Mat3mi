<template>
  <Navbar />
  <div class="container">
    <div>
      <br />
      <RouterLink
        :to="{ name: 'ViewCategories', params: { locId: locationId } }"
      >
        <button type="button" class="float-start btn btn-success">
          View/Add Categories
        </button>
      </RouterLink>
      <RouterLink :to="{ name: 'AddNewItem', params: { locId: locationId } }">
        <button
          type="button"
          class="float-end btn btn-success"
          v-if="numOfCategories > 0"
        >
          Add New Items
        </button>
      </RouterLink>
    </div>
    <div class="clearfix"></div>
    <div class="text-center">
      <h1 class="mb text-light">{{ locName }}</h1>
      <p class="text-dark">{{ locAddress }}</p>
    </div>
    <div class="clearfix"></div>
    <RouterLink
      :to="{ name: 'DeleteAllItems', params: { locId: locationId } }"
      v-if="listOfUserItems.length > 0"
    >
      <button type="button" class="btn btn-danger">Delete All Items</button>
    </RouterLink>
    <div class="clearfix"></div>
    <br />
    <!-- <div>
      Is User Logged In? {{ isUserLoggedIn }}<br />
      User Id is {{ loggedInUserId }}<br />
      Num of Categories is {{ numOfCategories }}<br />
      Categories Array? {{ listOfCategories }}
    </div> -->
    <div class="each-category">
      <div class="" v-for="(cat, c) in listOfUserCategories" :key="c">
        <div class="row">
          <div class="text-dark row col-12">
            <h3 class="text-center bg-light p-1">{{ cat.name }}</h3>
          </div>
          <div
            v-for="(item, i) in listOfUserItems"
            :key="i"
            v-show="cat.id == item.catId"
            :class="{ 'col-xs-12 col-sm-4 px-4': cat.id == item.catId }"
          >
            <div
              class="bg-dark text-center br-5"
              v-if="cat.id == item.catId"
              :class="{ 'each-item': cat.id == item.catId }"
            >
              <h5 class="item-name text-warning p-3">
                {{ item.name }}
              </h5>
              <p class="item-description text-light">
                {{ item.description }}
              </p>
              <div>
                <div class="item-price float-start text-light">
                  Available Quantity: {{ numberWithCommas(item.qty) }}
                </div>
                <div class="item-price float-end text-light">
                  Price: {{ numberWithCommas(item.price) }} L.E
                </div>
              </div>
              <div class="clearfix"></div>
              <div class="p-1 mt-2">
                <div class="item-price float-start text-info">
                  <RouterLink
                    :to="{
                      name: 'UpdateItem',
                      params: { itemId: item.id, locId: locationId },
                    }"
                  >
                    <button type="button" class="float-end btn btn-success">
                      Update
                    </button>
                  </RouterLink>
                </div>
                <div class="item-price float-end text-info">
                  <RouterLink
                    :to="{
                      name: 'DeleteItem',
                      params: { itemId: item.id, locId: locationId },
                    }"
                  >
                    <button type="button" class="float-end btn btn-danger">
                      Delete
                    </button>
                  </RouterLink>
                </div>
              </div>
              <div class="clearfix"></div>
            </div>
            <hr />
          </div>
        </div>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Header/Navbar.vue";
import { mapActions, mapState, mapMutations } from "vuex";
import axios from "axios";
export default {
  name: "MenU",
  components: {
    Navbar,
  },
  data() {
    return {
      userName: "",
      userId: "",
      locationId: this.$route.params.locationId,
      locName: "",
      locAddress: "",
      listOfUserCategories: [],
      listOfUserItems: [],
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
      this.getCurrentUserCategories(this.userId, this.locationId);
      this.getCurrentUserItems(this.userId, this.locationId);
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    ...mapMutations([
      "isLoggedInUser",
      "displayAllCategories",
      "canUserAccessThisLocation",
    ]),
    async getCurrentUserCategories(userId, locId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locId}`
      );
      if (result.status == 200) {
        this.listOfUserCategories = result.data;
        console.table(this.listOfUserCategories);
      }
    },
    async getCurrentUserItems(userId, locId) {
      let result = await axios.get(
        `http://localhost:3000/items?userId=${userId}&locId=${locId}`
      );
      if (result.status == 200) {
        this.listOfUserItems = result.data;
        console.table(this.listOfUserItems);
      }
    },
    numberWithCommas(n) {
      return n.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
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
  },
};
</script>

<style lang="scss" scoped>
.mb {
  margin-bottom: 0;
}
.item-description {
  padding-top: 12px;
  min-height: 100px;
}
.br-5 {
  border-radius: 5px;
}
</style>
