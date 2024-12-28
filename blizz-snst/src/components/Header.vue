<script setup>
import {useUserStore} from "@/stores/user";
import {useRoute} from "vue-router";
import {ref} from "vue";

const searchTerm = ref("");



const route = useRoute();
const userStore = useUserStore();
console.log(userStore.user);
</script>

<template>
  <BNavbar toggleable="lg" variant="primary" v-b-color-mode="'dark'">
    <BNavbarBrand to="/" class="fw-bold ml-2"
      >BLIZZ
      <IFontistoSnowflake7
        class="fw-1000 text-light mx-1 mt-0 fs-4"
      ></IFontistoSnowflake7
    ></BNavbarBrand>

    <BNavbarNav>
      <BNavItem class="text-capitalize fw-bold">{{
        route.meta.title || $route.name
      }}</BNavItem>
    </BNavbarNav>
    <BNavbarToggle target="nav-collapse" />
    <BCollapse id="nav-collapse" is-nav>
      <BNavbarNav>
        <!-- <BNavItem to="/" v-if="route.name !== 'Home'">Home</BNavItem> -->
      </BNavbarNav>
      <!-- Right aligned nav items -->
      <BNavbarNav class="ms-auto mb-2 mb-lg-0">
        <BNavItemDropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>Account</em>
          </template>
          <BDropdownItem to="/profile" v-if="userStore.user"
            >Profile</BDropdownItem
          >
          <BDropdownItem to="#" v-if="userStore.user" @click="userStore.logout"
            >Sign Out</BDropdownItem
          >
          <BDropdownItem to="/login" v-if="!userStore.user"
            >Sign In</BDropdownItem
          >
          <BDropdownItem to="/register" v-if="!userStore.user"
            >Sign Up</BDropdownItem
          >
        </BNavItemDropdown>
        <BNavItem to="/" v-if="userStore.user && route.name !== 'Home'">Home</BNavItem>
        <BNavItem to="/lobby" v-if="userStore.user && route.name !== 'Lobby'">Chatrooms</BNavItem>
      </BNavbarNav>

      <BNavForm class="d-flex" v-if="userStore.user">
        <BFormInput
          class="me-2 bg-light text-dark border-none"
          placeholder="Search"
        />
        <BButton type="submit" variant="outline-light" @click="search">Search</BButton>
      </BNavForm>
    </BCollapse>
  </BNavbar>
</template>
