<script setup lang="ts">
import {setUpGlobalToasts} from "@client/utilities/utilities";
import {useToast} from "vuestic-ui";

const toast = useToast();
setUpGlobalToasts(toast);

</script>

<template>
  <header>
    <va-navbar color="softDark" id="navbar">
      <template #left>
        <RouterLink id="nav-title" to="/">Bet Sys</RouterLink>
      </template>
    </va-navbar>

  </header>
  <div id="router-view-holder">
    <RouterView />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 3px;
}

.va-navbar {
  --va-navbar-height: 3rem;
}

#nav-title {
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

#navbar a {
  color: var(--vt-c-white);
  margin-left: 10px;
}

#navbar a:hover {
  color: var(--vt-c-white-greyed);
  background-color: rgba(0,0,0,0);
}

.va-divider-vertical {
  margin-left: -6px;
}

.nav-link {
  font-size: 10pt;
}

#router-view-holder {
  padding: 1rem;
}

.apple-offset {
  margin-bottom: 5px;
}

.dim-on-hover:hover {
  color: var(--vt-c-white-greyed);
  cursor: pointer;
}

.avatar.img {
  border: #181515;
  border-radius: 50%;
  height: 24px;
  line-height: 24px;
}

.avatar {
  align-items: center;
  -webkit-transform: translateY(-2px);
  transform: translateY(-2px);
  width: 40px;
}

.avatarHolder {
  width: 30px;
  height: 30px;
  background-position: center center;
  background-size: cover;
  border-radius: 50%;
}
</style>
