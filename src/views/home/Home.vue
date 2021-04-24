<template>
  <div class="home">
    <div class="refence">
      <router-view/>
    </div>
    <Header></Header>
    <Texta></Texta>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '../../components/header.vue'
import Texta from '../../components/Texta.vue'
// import Refence from '../../components/Refence.vue'

export default {
  name: 'Home',
  components: {
    Header,
    Texta
    // Refence
  }
}
</script>

<style scoped>
.home {
  overflow: hidden;
  display: flex;
  height: 100vh;
  flex-direction: column;
}
Header {
  flex:1;
}
Texta {
  flex: 1;
  overflow: hidden;
}

</style>
