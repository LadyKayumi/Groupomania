<template>
  <div class="backdrop">
    <div class="modal">
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur
        tempore amet aut perspiciatis accusantium fuga perferendis quae,
        quisquam animi aspernatur quidem, harum porro hic labore neque dolorum
        necessitatibus sequi veritatis. Cum neque eligendi explicabo repellat
        minima, cupiditate facere molestias pariatur possimus numquam minus nam
        ex consectetur praesentium labore maiores? Pariatur!
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

</style>