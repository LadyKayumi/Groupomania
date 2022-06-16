<template>
  <main class="login">
    <h2>Connexion</h2>
    <form action="javascript:void(0);" method="post">
      <div class="login__inputline">
        <input v-model="email" :class="{ validInput: isEmailValid, invalidInput: !isEmailValid && email.length > 0 }"
          class="login__inputline__email" type="email" name="email" id="email" placeholder="Mail" autocomplete="off"
          required>
        <label class="label" for="email"></label>
      </div>
      <div class="login__inputline">
        <input v-model="password" :class="{ validInput: password.length > 0 }" class="login__inputline__password"
          type="password" name="password" id="password" placeholder="Mot de passe" autocomplete="off" required>
        <label class="label" for="password"></label>
      </div>
      <input @click="login()" type="submit" value="Se connecter">
    </form>
    <p id="error">{{ errorMessage }}</p>
    <div class="options">
      <router-link :to="{ name: 'Register' }">Vous n'avez pas de compte ?</router-link>
    </div>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  computed: {
    ...mapState({
      isLoggedIn: 'isLoggedIn',
      apiURL: 'apiURL',
      user: 'user'
    }),
    isEmailValid() {
      const mailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
      return this.email.match(mailRegex)
    }
  },
  methods: {
    ...mapActions(['changeLoginState', 'setUser', 'setUpvotes']),
    async login() {
      const requestSettings = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: this.email,
          password: this.password
        })
      }
      try {
        const res = await fetch(`${this.apiURL}/auth/login`, requestSettings)
        const json = await res.json()
        if (res.ok) {
          this.changeLoginState(true)
          this.setUser(json.user)
        }
        else {
          this.errorMessage = json.message
          return
        }
      }
      catch (err) {
        return this.errorMessage = 'Request error.'
      }
      try {
        const upvotesRequestSettings = {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
        const res = await fetch(`${this.apiURL}/upvote/user/${this.user.username}`, upvotesRequestSettings)
        const upvotes = await res.json()
        if (res.ok) {
          this.setUpvotes(upvotes)
          await this.$router.push({ name: 'Feed' })
        }
      }
      catch (err) {
        return
      }
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

.login {
  width: 22%;
  border: 1px solid rgb(71, 71, 71);
  background-color: #fd2d01;
  box-shadow: 10px 10px 10px grey;
  border-radius: 20px;
  padding: 7em 5em;
  margin: 2em auto;

  h2 {
    color: white;
  }

  form {
    display: flex;
    flex-direction: column;
    padding-top: 20px;
    background-color: #FFD7D7;
    border: 2px solid grey;

    input[type="password"],
    input[type="email"] {
      width: 75%;
      height: 30px;
      border: none;
      border: 1px solid grey;
      outline: none;
      padding: 0 15px;
      border-radius: 10px;
    }

    &.invalidInput {
      border-bottom: 1px solid black;
    }

    &.validInput {
      border-bottom: 1px solid rgb(0, 185, 0);
    }

    input[type="submit"] {
      width: 50%;
      align-self: center;
      padding: 15px;
      margin: 10px 0;
      background-color: hsl(10, 99%, 50%);
      border: none;
      cursor: pointer;
      font-weight: bold;
      color: #ffffff;
      border-radius: 15px;
      border: 2px solid grey;

      &:hover {
        background-color: hsl(10, 99%, 45%);
      }
    }
  }

  &__inputline {
    position: relative;
    margin: 15px 0;

    ::placeholder {
      color: #cccccc;
    }
  }
}

.options {
  display: flex;
  flex-direction: column;

  a {
    margin: 5px auto;
    color: #FFD7D7;
  }
}

#error {
  font-weight: bold;
  color: black;
}

@media screen and (max-width: 1024px) {
  .login {
    width: 65vw;
  }
}
</style>