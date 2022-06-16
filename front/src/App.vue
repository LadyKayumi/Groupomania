<template>
  <Modal v-if="!readRules"></Modal>
  <Header></Header>
  <router-view />
  <Footer></Footer>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import Modal from "./components/Modal.vue";

import { mapState } from 'vuex'

export default {
  name: "App",
  components: { Header, Footer, Modal },
  computed: {
    ...mapState({
      readRules: 'readRules'
    })
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");

* {
  font-family: Lato, Helvetica, Arial, sans-serif;
}

body {
  min-height: 100vh;
  margin: 0;
  margin-bottom: 5vh;
}
#app {
  text-align: center;
  display: flex;
  flex-direction: column;
}
</style>
