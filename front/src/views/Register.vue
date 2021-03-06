<template>
  <main class="register">
    <h2>Inscription</h2>
    <form action="javascript:void(0);" method="post">
      <div class="register__inputline">
        <input v-model="firstName"
          :class="{ validInput: isFirstNameValid, invalidInput: !isFirstNameValid && firstName.length > 0 }"
          class="register__inputline__firstname" type="text" name="firstName" id="firstName" placeholder="Prénom"
          autocomplete="off" required>
        <label class="label" for="firstName"></label>
      </div>
      <div class="register__inputline">
        <input v-model="lastName"
          :class="{ validInput: isLastNameValid, invalidInput: !isLastNameValid && lastName.length > 0 }"
          class="register__inputline__lastname" type="text" name="lastName" id="lastName" placeholder="Nom"
          autocomplete="off" required>
        <label class="label" for="lastName"></label>
      </div>
      <div class="register__inputline">
        <input v-model="username"
          :class="{ validInput: isUsernameValid, invalidInput: !isUsernameValid && username.length > 0 }"
          class="register__inputline__username" type="text" name="username" id="username" placeholder="Nom d'utilisateur"
          autocomplete="off" required>
        <label class="label" for="username"></label>
      </div>
      <div class="register__inputline">
        <input v-model="email" :class="{ validInput: isEmailValid, invalidInput: !isEmailValid && email.length > 0 }"
          class="register__inputline__email" type="email" name="email" id="email" placeholder="Mail" autocomplete="off"
          required>
        <label class="label" for="email"></label>
      </div>
      <div class="register__inputline">
        <input v-model="password"
          :class="{ validInput: isPasswordValid, invalidInput: !isPasswordValid && password.length > 0 }"
          class="register__inputline__password" type="password" name="password" id="password" placeholder="Mot de passe"
          autocomplete="off" required>
        <label class="label" for="password"></label>
      </div>
      <input @click="register()" type="submit" value="S'inscrire">
    </form>
    <p class="error" :class="{ validInput: !requestError, invalidInput: requestError }">{{ errorMessage }}</p>
    <div class="options">
      <router-link :to="{ name: 'Login' }">Vous avez déjà un compte ?</router-link>
    </div>
  </main>
</template>

<script>
const zxcvbn = require('zxcvbn')
import { mapState } from 'vuex'

export default {
  name: 'Register',
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      errorMessage: '',
      requestError: true
    }
  },
  computed: {
    ...mapState({
      apiURL: 'apiURL',
    }),
    isFirstNameValid() {
      const nameRegex = /^[A-zÀ-ú' -]*$/
      return this.firstName.length > 0 && this.firstName.match(nameRegex)
    },
    isLastNameValid() {
      const nameRegex = /^[A-zÀ-ú' -]*$/
      return this.lastName.length > 0 && this.lastName.match(nameRegex)
    },
    isUsernameValid() {
      const usernameRegex = /^[A-Za-z0-9_.-]*$/g
      return this.username.length > 4 && this.username.match(usernameRegex)
    },
    isEmailValid() {
      const mailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
      return this.email.length > 0 && this.email.match(mailRegex)
    },
    isPasswordValid() {
      return this.password.length > 0 && zxcvbn(this.password, [this.email, this.username, this.firstName, this.lastName]).score > 1
    }
  },
  methods: {
    async register() {
      if (!(this.isFirstNameValid && this.isLastNameValid && this.isUsernameValid && this.isEmailValid && this.isPasswordValid)) {
        return this.errorMessage = 'Please correct the informations.'
      }
      this.errorMessage = ''
      const requestSettings = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          email: this.email,
          password: this.password
        })
      }
      try {
        const res = await fetch(`${this.apiURL}/auth/register`, requestSettings)
        const json = await res.json()
        if (res.ok) {
          this.requestError = false
          this.errorMessage = json.message
          return await this.$router.push({ name: 'Login' })
        }
        this.requestError = true
        this.errorMessage = json.message
      }
      catch (err) {
        this.requestError = true
        return this.errorMessage = 'Request error.'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

.register {
  width: 35vw;
  background-color: #FD2D01;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    text-align: center;
    color: white;
    font-size: 1.5em;
    padding: 20px 0;
  }

  form {
    width: 85%;
    display: flex;
    background-color: #FFD7D7;
    flex-direction: column;
    padding-top: 20px;

    input[type="password"],
    input[type="email"],
    input[type="text"] {
      width: 75%;
      height: 30px;
      border: none;
      border: 1px solid grey;
      outline: none;
      padding: 0 15px;
      border-radius: 10px;
    }

    &.invalidInput {
      border-bottom: 1px solid red;
    }

    &.validInput {
      border-bottom: 1px solid rgb(0, 185, 0);
    }

    input[type="submit"] {
      width: 50%;
      align-self: center;
      padding: 15px;
      margin: 15px 0;
      background-color: hsl(10, 99%, 50%);
      border: none;
      cursor: pointer;
      font-weight: bold;
      color: #ffffff;
      border-radius: 15px;

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
    margin-bottom: 25px;
    color: #FFD7D7
  }
}

.error {
  color: red;
  font-weight: bold;

  &.validInput {
    color: rgb(0, 185, 0);
  }
}

@media screen and (max-width: 1024px) {
  .register {
    width: 95vw;
  }
}
</style>