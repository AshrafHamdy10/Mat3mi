import { createStore } from "vuex";
import axios from "axios";
import router from "../router/index";
const state = {
  isUserLoggedIn: "",
  loggedInUserId: "",
  numOfCategories: "",
  listOfCategories: [],
  listOfItems: [],
  listOfLocations: [],
};
const getters = {};
const mutations = {
  redirectTo(state, payload) {
    router.push({ name: payload });
  },
  isLoggedInUser(state) {
    let user = localStorage.getItem("user-info");
    if (user) {
      state.isUserLoggedIn = true;
      state.loggedInUserId = JSON.parse(user).id;
    } else {
      state.isUserLoggedIn = false;
    }
  },
  async displayAllCategories(state, payload) {
    let result = await axios.get(
      `http://localhost:3000/categories?userId=${payload.userIdIs}&locationId=${payload.locationIdIs}`
    );
    if (result.status == 200) {
      state.listOfCategories = result.data;
      state.numOfCategories = state.listOfCategories.length;
    }
  },
  async canUserAccessThisLocation(state, payload) {
    let result = await axios.get(
      `http://localhost:3000/locations?userId=${payload.userIdIs}&id=${payload.locationIdIs}`
    );
    if (result.status == 200) {
      state.listOfLocations = result.data;
      if (state.listOfLocations.length !== 1) {
        this.commit("redirectTo", payload.redirectToPage);
      }
    }
  },
  async canUserAccessThisCategory(state, payload) {
    let result = await axios.get(
      `http://localhost:3000/categories?userId=${payload.userIdIs}&locationId=${payload.locationIdIs}&id=${payload.catIdIs}`
    );
    if (result.status == 200) {
      state.listOfCategories = result.data;
      if (state.listOfCategories.length !== 1) {
        this.commit("redirectTo", payload.redirectToPage);
      }
    }
  },
  async canUserAccessThisItem(state, payload) {
    let result = await axios.get(
      `http://localhost:3000/items?userId=${payload.userIdIs}&locationId=${payload.locationIdIs}&id=${payload.itemIdIs}`
    );
    if (result.status == 200) {
      state.listOfItems = result.data;
      if (state.listOfItems.length < 1) {
        this.commit("redirectTo", payload.redirectToPage);
      }
    }
  },
};
const actions = {
  redirectTo({ commit }, payload) {
    commit("redirectTo", payload.val);
  },
};
export default createStore({
  state,
  getters,
  mutations,
  actions,
  modules: {},
});
