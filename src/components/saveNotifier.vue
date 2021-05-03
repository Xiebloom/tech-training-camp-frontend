<template>
    <div class="notifier">
        {{content}} 已保存
    </div>
</template>

<script>
export default {
  name: 'saveNotifier',
  data() {
    return {
        content: ''
    }
  },
  methods: {
      // 淡入淡出，提示文件已保存
      notify (data) {
          this.content = data
          let notifier = document.querySelector('.notifier')
          notifier.style.opacity = '80%'
          setTimeout(() => {
              notifier.style.opacity = '0%'
          }, 2000);
      }
  }
}
</script>

<style scoped>
    div {
        /* 定位 */
        position: absolute;
        top: 4%;
        right: 5%;
        /* 大小 */
        width: 200px;
        height: 50px;
        /* 装饰 */
        border-radius: 30px;
        background-color: black;
        /* 动画 */
        transition: all 1s ease;
        /* 文字 */
        color: whitesmoke;
        font-size: 20px;
        text-align: center;
        line-height: 50px;
        /* 特效 */
        opacity: 0%;
    }
</style>