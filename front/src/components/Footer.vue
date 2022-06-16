<template>
  <footer>
    <ul>
      <li><a href="#">Mentions légales</a></li>
      <li><a href="#">Nous contacter</a></li>
      <li><a href="#" @click.prevent="setReadRules({ read: false })">Affichage des règles</a></li>
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

<style lang="scss" scoped>
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

  li {
    list-style: none;

    a {
      text-decoration: none;
      list-style: none;
      color: #ffd7d7;
    }
  }
}

@media screen and (max-width: 768px) {
  a {
    margin: 0 5px;
  }
}
</style>