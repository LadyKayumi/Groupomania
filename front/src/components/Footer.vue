<template>
  <footer>
    <ul>
      <li><a href="#">Mentions légales</a></li>
      <li><a href="#">Nous contacter</a></li>
      <li><a href="#" @click.prevent="setReadRules({read: false})" >Affichage des règles</a></li>
      <li><a href="#">Rapporter un bug</a></li>
    </ul>
  </footer>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions(['setReadRules'])
  }
};
</script>

<style>
footer {
  background-color: #4e5166;
  width: 100%;
  height: 5vh;
  position: fixed;
  bottom: 0;
}
ul {
  display: flex;
  justify-content: space-evenly;
}
ul li {
  list-style: none;
}
ul li a {
  text-decoration: none;
  list-style: none;
  color: #ffd7d7;
}
</style>