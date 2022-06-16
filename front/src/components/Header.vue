<template>
  <header>
    <router-link to="/">
      <img class="logo" src="../assets/icon-left-font-monochrome-black.png" alt="Groupomania Logo" />
    </router-link>
    <div>
      <nav id="nav" v-if="isLoggedIn">
        <router-link to="/"><i class="fas fa-home"></i>Accueil</router-link> |
        <router-link :to="{ name: 'User', params: { username: user.username } }"><i class="fas fa-user"></i>Mon Profil
        </router-link> |
        <router-link :to="{ name: 'Logout' }"><i class="fas fa-sign-out-alt"></i>Déconnexion</router-link>
      </nav>
      <nav id="nav" v-else>
        <router-link to="/"><i class="fas fa-home"></i>Accueil</router-link> |
        <router-link to="/login"><i class="fas fa-sign-in-alt"></i>Connexion</router-link>
      </nav>
    </div>
  </header>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Nav',
  computed: {
    ...mapState({
      isLoggedIn: 'isLoggedIn',
      user: 'user'
    })
  },
  methods: {
    ...mapActions(['logout'])
  }
}
</script>

<style lang="scss" scoped>
header {
  height: 6em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
}

nav {
  margin: 15px;

  a {
    text-decoration: none;
    font-size: 18px;
    font-weight: bold;
    color: #4e5166;
    padding: 5px;

    i {
      padding: 5px;
    }
  }
}

.logo {
  width: 18em;
  position: relative;
  left: 1em;
}

@media screen and (max-width: 1024px) {
  header {
    height: 5vh;
  }
}

@media screen and (max-width: 768px) {
  header {
    height: 20vh;
    flex-direction: column;
    justify-content: space-around;
  }
}
</style>