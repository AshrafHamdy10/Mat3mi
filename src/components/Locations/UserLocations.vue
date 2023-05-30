<template>
  <table class="table caption-top" v-if="allLocations.length > 0">
    <caption>
      <span class="text-light"
        >List Of Locations ({{ allLocations.length }})</span
      >
      <span class="float-end">
        <RouterLink :to="{ name: 'DeleteAllLocations' }">
          <button class="btn btn-danger">Delete All</button>
        </RouterLink>
      </span>
    </caption>
    <thead class="table-dark">
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Phone</th>
        <th scope="col">Address</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(loc, i) in allLocations" :key="i">
        <th scope="row" class="text-success">{{ loc.name }}</th>
        <td>{{ loc.phone }}</td>
        <td>{{ loc.address }}</td>
        <td>
          <RouterLink
            :to="{ name: 'DeleteLocation', params: { locationId: loc.id } }"
          >
            <button class="btn btn-danger">Delete</button>
          </RouterLink>
          &nbsp;
          <RouterLink
            :to="{ name: 'UpdateLocation', params: { locationId: loc.id } }"
          >
            <button class="btn btn-success">Update</button>
          </RouterLink>
          &nbsp;
          <RouterLink :to="{ name: 'MenU', params: { locationId: loc.id } }">
            <button class="btn btn-warning">Menu</button>
          </RouterLink>
        </td>
      </tr>
    </tbody>
  </table>
  <div v-else class="alert alert-warning mg-10" role="alert">
    No Locations added yet
  </div>
</template>

<script>
export default {
  name: "UserLocations",
  props: ["allLocations"],
};
</script>

<style lang="scss" scoped>
.mg-10 {
  margin-top: 10px;
}
</style>
