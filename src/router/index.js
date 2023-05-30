import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Signup from "../views/Signup.vue";
import Login from "../views/Login.vue";
import Profile from "../views/Profile.vue";
import ErrorPage from "../views/ErrorPage.vue";
import UpdateProfile from "../components/Profile/UpdateProfile.vue";
import AddNewLocation from "@/components/Locations/AddNewLocation.vue";
import DeleteLocation from "@/components/Locations/DeleteLocation.vue";
import DeleteAllLocations from "@/components/Locations/DeleteAllLocations.vue";
import UpdateLocation from "@/components/Locations/UpdateLocation.vue";
import MenU from "@/components/Menu/Menu.vue";
import AddNewCategory from "@/components/Menu/AddNewCategory.vue";
import ViewCategories from "@/components/Menu/ViewCategories.vue";
import UpdateCategory from "@/components/Menu/UpdateCategory.vue";
import DeleteCategory from "@/components/Menu/DeleteCategory.vue";
import DeleteAllCategories from "@/components/Menu/DeleteAllCategories.vue";
import AddNewItem from "@/components/Menu/AddNewItem.vue";
import UpdateItem from "@/components/Menu/UpdateItem.vue";
import DeleteItem from "@/components/Menu/DeleteItem.vue";
import DeleteAllItems from "@/components/Menu/DeleteAllItems.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: Signup,
  },
  {
    path: "/login",
    name: "LogIn",
    component: Login,
  },
  {
    path: "/profile",
    name: "ProFile",
    component: Profile,
  },
  {
    path: "/update-profile",
    name: "UpdateProfile",
    component: UpdateProfile,
  },
  {
    path: "/add-new-location",
    name: "AddNewLocation",
    component: AddNewLocation,
  },
  {
    path: "/delete-location/:locationId",
    name: "DeleteLocation",
    component: DeleteLocation,
  },
  {
    path: "/update-location/:locationId",
    name: "UpdateLocation",
    component: UpdateLocation,
  },
  {
    path: "/menu/location/:locationId",
    name: "MenU",
    component: MenU,
  },
  {
    path: "/menu/categories/add/:locationId",
    name: "AddNewCategory",
    component: AddNewCategory,
  },
  {
    path: "/menu/categories/view/:locationId",
    name: "ViewCategories",
    component: ViewCategories,
  },
  {
    path: "/menu/add/item/loc/:locationId",
    name: "AddNewItem",
    component: AddNewItem,
  },
  {
    path: "/menu/item/update/:itemId/loc/:locationId",
    name: "UpdateItem",
    component: UpdateItem,
  },
  {
    path: "/menu/delete/item/:itemId/loc/:locationId",
    name: "DeleteItem",
    component: DeleteItem,
  },
  {
    path: "/menu/delete/all-items/:locationId",
    name: "DeleteAllItems",
    component: DeleteAllItems,
  },
  {
    path: "/menu/categories/update/loc/:locationId/item/:catId",
    name: "UpdateCategory",
    component: UpdateCategory,
  },
  {
    path: "/menu/categories/delete/loc/:locationId/item/:catId",
    name: "DeleteCategory",
    component: DeleteCategory,
  },
  {
    path: "/menu/categories/delete/all/:locationId",
    name: "DeleteAllCategories",
    component: DeleteAllCategories,
  },
  {
    path: "/delete-all-locations",
    name: "DeleteAllLocations",
    component: DeleteAllLocations,
  },
  {
    path: "/:catchAll(.*)",
    name: "ErrorPage",
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.params.pageTitle !== undefined) {
    document.title = `${to.name} | ${to.params.pageTitle} | ${process.env.VUE_APP_TITLE}`;
  } else {
    if (to.name == null) {
      document.title = `Unknown Page | ${process.env.VUE_APP_TITLE}`;
    } else {
      document.title = `${to.name} | ${process.env.VUE_APP_TITLE}`;
    }
  }
  next();
});
export default router;
