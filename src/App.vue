<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import login from './components/login.vue'
import chatRoom from './components/chatRoom.vue'
export default {
  name:'App',
  components:{
    login,
    chatRoom
  }
}
</script>

<style>
html,body {
  margin: 0;
  padding: 0;
}
</style>
