<template>
    <div class="header-button" >
        <div class="fixed-menu" @click="click(0)"> </div>
        <ul class="float-menu">
            <li v-for="(item, index) in urls" :key="item.id">
                <img :src="item.url" alt="..." @click="click(index+1)">
            </li>
        </ul>
    </div>
</template>

<script>

export default {
  data () {
    return {
      urls: [{
        id: 1,
        url: require('../assets/icons/title2.jpg')
      }, {
        id: 2,
        url: require('../assets/icons/title3.jpg')
      }]
    }
  },
  name: 'AdvanceButton',
  props: {
    buttonname: {
      type: String
    },
    functiontype: {
      type: String
    }
  },
  methods: {
    click: function (index) {
      console.log(index)
      this.$emit(this.functiontype, '#'.repeat(index + 1) + ' ')
    }
  }
}
</script>

<style scoped>
* {
    padding: 0;
    margin: 0;
}
.header-button {
  height: 25px;
  width: 25px;
  margin: 2px 7px;
  border-radius: 20%/20%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  cursor: pointer;
  box-shadow: 0px 1px 5px 1px gray;
}

li {
    list-style: none;
}
.fixed-menu {
    /* 第一个按钮 */
    height: 100%;
    width: 25px;
    border-radius: 20%/20%;
    background-image: url(../assets/icons/title1.jpg);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    position: relative;
    z-index: 1;
    margin: 0%;
}
.float-menu {
    /* 悬浮菜单 */
    display: none;
    opacity: 0;
    position: relative;
    box-sizing: border-box;
    background-color: gray;
    width: 100%;
    top: -10px;
    padding-top: 10px;
    padding-bottom: 2px;
    border-radius: 5px;
    box-shadow: 0px 5px 0px 1px gray;
    background-size: contai;
}

.float-menu li {
    position: relative;
    /* left: -2px; */
    box-sizing: border-box;
    height: 25px;
    width: 25px;
    margin-top: 6px;
}

.float-menu img {
    box-sizing: border-box;
    border: gray 2px solid;
    height: 25px;
    border-radius: 20% 20%;
}

@keyframes choose-title {
    from {
        opacity: 0;
        top: -20px;
    }
    to {
        opacity: 1;
        top: -10px;
    }
}

.header-button:hover .float-menu {
    /* 这里要用 header-button, 涉及事件冒泡 */
    display: block;
    opacity: 1;
    animation: choose-title 0.5s ease;
}

</style>
