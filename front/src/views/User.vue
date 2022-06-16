<template>
  <main id="profile">
    <div v-if="loaded && userProfile.username" class="profile">
      <section class="profile__image">
        <img class="profile__image__pfp" :src="userProfile.pfp" :alt="`Photo de profil de ${userProfile.username}`">
      </section>
      <span class="profile__separation"></span>
      <section class="profile__info">
        <div class="profile__info__firstName">
          <h3>Prénom</h3>
          <p>{{ userProfile.firstName }}</p>
        </div>
        <div class="profile__info__lastName">
          <h3>Nom</h3>
          <p>{{ userProfile.lastName }}</p>
        </div>
        <div class="profile__info__username">
          <h3>Nom d'utilisateur</h3>
          <p>{{ userProfile.username }}</p>
        </div>
        <div v-if="user.username === $route.params.username" class="profile__info__email">
          <h3>Adresse mail</h3>
          <p>{{ userProfile.email }}</p>
        </div>
        <div>
          <h3>Postes créés</h3>
          <p>{{ userProfile.nbPosts }}</p>
        </div>
        <div>
          <h3>Upvotes reçus</h3>
          <p>{{ userProfile.nbUpvotes }}</p>
        </div>
      </section>
    </div>
    <div v-else>
      <h2>{{ userNotFound }}</h2>
    </div>
    <section v-if="loaded && (userProfile.username && user.admin || user.username === $route.params.username)"
      class="options">
      <button class="options__modify"
        @click="$router.push({ name: 'UserEdit', params: { username: userProfile.username } })">Modifier les
        informations</button>
      <button class="options__delete" @click="deleteAccount()">Supprimer le compte</button>
    </section>
  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Profile',
  data() {
    return {
      loaded: false,
      userNotFound: '',
      errorMessage: '',
      userProfile: {},
    }
  },
  computed: {
    ...mapState({
      apiURL: 'apiURL',
      user: 'user'
    })
  },
  methods: {
    async deleteAccount() {
      const requestSettings = {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
      try {
        const res = await fetch(`${this.apiURL}/user/${this.$route.params.username}`, requestSettings)
        if (res.ok) {
          this.errorMessage = 'Suppression du compte effectuée'
          if (this.user.username === this.$route.params.username) {
            await this.$router.push({ name: 'Logout' })
          }
          else {
            await this.$router.push({ name: 'Feed' })
          }
        }
      }
      catch (err) {
        return console.error(err)
      }
    }
  },
  async beforeMount() {
    const requestSettings = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }
    try {
      const res = await fetch(`${this.apiURL}/user/${this.$route.params.username}`, requestSettings)
      const json = await res.json()
      if (res.ok) {
        this.userProfile = json
        this.loaded = true
      }
      else {
        this.userNotFound = 'L\'utilisateur recherché n\'existe pas.'
        this.errorMessage = 'Erreur lors de la récupération des informations.'
      }
    }
    catch (err) {
      this.userNotFound = 'L\'utilisateur recherché n\'existe pas.'
      this.errorMessage = 'Erreur lors de la récupération des informations.'
      return console.error(err)
    }
  },
  async beforeRouteUpdate(to, from, next) {
    this.loaded = false
    const requestSettings = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }
    try {
      const res = await fetch(`${this.apiURL}/user/${to.params.username}`, requestSettings)
      const json = await res.json()
      if (res.ok) {
        this.userProfile = json
        this.loaded = true
      }
      else {
        this.userNotFound = 'L\'utilisateur recherché n\'existe pas.'
        this.errorMessage = 'Erreur lors de la récupération des informations.'
      }
    }
    catch (err) {
      this.userNotFound = 'L\'utilisateur recherché n\'existe pas.'
      this.errorMessage = 'Erreur lors de la récupération des informations.'
      return console.error(err)
    }
    next()
  }
}
</script>

<style lang="scss" scoped>
#profile {
  .profile, .options {
    margin: 5vw 25vw;
    margin-bottom: 2.5vh;
    padding: 2.5vh 2.5vw;
  }
}

.delete {
  z-index: 2;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;

  &__background {
    width: 100%;
    height: 100%;
    background-color: rgba(#000, .4);
  }

  &__popup {
    width: 500;
    height: 200px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-radius: 25px;
    background-color: white;

    &__error {
      text-align: center;
    }

    &__choices {
      display: flex;
      justify-content: space-around;
      margin: 0 125px;

      * {
        cursor: pointer;
        border: none;
        border-radius: 25px;
        font-weight: bold;
        font-size: 1.2em;
      }

      &__yes {
        color: hsl(0, 100%, 50%);
      }

      &:hover {
        color: hsl(0, 100%, 65%);
      }

      &__no {
        color: hsl(200, 100%, 50%);

        &:hover {
          color: hsl(200, 100%, 60%);
        }
      }
    }
  }
}

.notForDeletion {
  display: none;
}

.tabs {
  margin: auto;
  display: flex;
  justify-content: center;
  column-gap: 30px;

  button {
    padding: 2px 10px;
    font-size: 1.2em;
    cursor: pointer;
    border-radius: 50px;
    background-color: transparent;
    border: 1px solid hsl(10, 99%, 55%);
    transition-property: background-color;
    transition-duration: 250ms;

    &:hover {
      background-color: hsl(10, 99%, 55%);
      color: white;
    }
  }
}

.profile {
  display: flex;
  gap: 30px;
  text-align: left;
  border: 1px solid hsl(10, 99%, 55%);
  border-radius: 25px;
  box-shadow: 0 0 10px hsl(10, 99%, 65%);
  background-color: #FFD7D7;

  h3 {
    margin-bottom: .5em;
  }

  p {
    margin: 0;
  }

  &__separation {
    margin: 2.5vh 0;
    border-right: 1px solid hsl(10, 99%, 65%);
  }

  &__image {
    max-width: 300px;
    max-height: 300px;
    align-self: center;
    flex: 2;

    &__pfp {
      width: 100%;
      height: 100%;
      max-width: 300px;
      max-height: 300px;
      object-fit: contain;
    }
  }

  &__info {
    padding-left: 3vw;
    flex: 3;
  }
}

.options {
  min-height: 45px;
  display: flex;
  justify-content: center;
  column-gap: 30px;

  * {
    font-size: 1.2em;
    cursor: pointer;
    border-radius: 50px;
    background-color: transparent;
    transition-property: background-color;
    transition-duration: 250ms;
  }

  &__modify {
    color: hsl(195, 100%, 50%);
    border: 2px solid hsl(195, 100%, 50%);

    &:hover {
      color: white;
      background-color: hsl(195, 100%, 50%);
    }
  }

  &__delete {
    color: hsl(0, 100%, 50%);
    border: 2px solid hsl(0, 100%, 50%);

    &:hover {
      color: white;
      background-color: hsl(0, 100%, 50%);
    }
  }
}

@media screen and (max-width: 1024px) {
  #profile {

    .profile,
    .options {
      margin: 0 2.5vw;
    }
  }

  .profile__separation {
    margin: 2.5vh 0;
  }
}

@media screen and (max-width: 768px) {
  .profile {
    flex-direction: column;

    &__separation {
      border-bottom: 1px solid hsl(10, 99%, 65%);
      margin: 0 2.5vh;
    }
  }

  .delete__popup {
    width: 95%;
  }
}
</style>