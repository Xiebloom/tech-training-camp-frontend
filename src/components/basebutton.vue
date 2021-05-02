<template>
  <div class="header-button" @click="click" >
  </div>
</template>

<script>

export default {
  name: 'BaseButton',
  props: {
    buttonname: {
      type: String
    },
    functiontype: {
      type: String
    },
    urls: {
      type: Object
    }
  },
  methods: {
    click () {
      this.$emit(this.functiontype)
      // console.log('functiontype is ' + this.functiontype + ' by basebutton')
    }
  }
}
</script>

<style scoped>
.header-button {
  /* float: left; flex 属性不需要浮动*/
  height: 25px;
  width: 25px;
  margin: 2px 7px;
  border-radius: 20%/20%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  cursor: pointer;
  box-shadow: 0px 1px 5px 1px gray;
  /* background-image: url(../assets/icons/1.png); */
}
</style>
