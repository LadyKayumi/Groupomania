<template>
  <div class="backdrop">
    <div class="modal">
      <p>
        <strong>REGLES A SUIVRE</strong> <br> <br>
        - Ne pas postez de contenus offensants <br> <br>
        - Respectez autrui <br> <br>
        - Ne pas hésitez à envoyer un message à un administrateur pour nous informer d'un comportement à punir <br> <br>
        - Tout comportement peu recommendable pourra encourir d'une sanction, voir d'un banissement
      </p>
      <button @click="setReadRules({read: true, checked, overwrite: true})">Fermer</button>
      <input v-model="checked" type="checkbox">J'ai bien lu les règles
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      checked: null
    }
  },
  computed: {
    ...mapState({
      readRules: 'readRules'
    })
  },
  methods: {
    ...mapActions(['setReadRules'])
  },
  mounted() {
    let checked = localStorage.getItem('readRules')
    if(!checked) {
      checked = false
    } else {
      if(checked == 'true') {
        checked = true
      } else {
        checked = false
      }
    }
    this.checked = checked
  }
};
</script>

<style scoped>
.modal {
  width: 400px;
  padding: 20px;
  margin: 100px auto;
  background: white;
  border-radius: 10px;
}

.backdrop {
  top: 0;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  z-index: 5;
}
button {
  padding: 5px;
  border-radius: 15px;
  background-color: #4E5166;
  font-size: 15px;
  color: white;
  margin-right: 170px;
}
@media screen and (max-width: 768px) {
  .modal {
    width: 75%;
  }
  button {
    margin-right: 115px;
  }
}
</style>