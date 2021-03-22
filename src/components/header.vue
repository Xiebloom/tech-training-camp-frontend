<template>
  <header>
    <Blocks>
      <AdvancedButton functiontype="newline" @newline="newline($event)"></AdvancedButton>
    </Blocks>
    <Blocks>
      <BaseButton functiontype="newline" class="leftalign" @newline="newline('@l ')"></BaseButton>
      <BaseButton functiontype="newline" class="rightlign" @newline="newline('@r ')"></BaseButton>
    </Blocks>
    <Blocks>
      <BaseButton functiontype="addtion" class="em" @addtion="addtion({mark:'*'})"></BaseButton>
      <BaseButton functiontype="addtion" class="bold" @addtion="addtion({mark:'**'})"></BaseButton>
      <BaseButton functiontype="addtion" class="underline" @addtion="addtion({mark:'u',type:2})"></BaseButton>
    </Blocks>
    <Blocks>
      <BaseButton functiontype="newline" class="quote" @newline="newline('> ')"></BaseButton>
      <BaseButton functiontype="newline" class="baseline" @newline="newline('***\n')"></BaseButton>
      <BaseButton functiontype="addtion" class="code" @addtion="addtion({mark:'\`'})"></BaseButton>
      <BaseButton functiontype="newblock" class="codeblock" @newblock="newblock('\`\`\`')"></BaseButton>
    </Blocks>
    <div class="refence">
      <router-link to="/refence">符号规则</router-link>
    </div>
  </header>
</template>

<script>
import BaseButton from './basebutton.vue'
import EventBus from './eventhub.js'
import AdvancedButton from './AdvancedButton.vue'
import Blocks from './Blocks.vue'

export default {
  data () {
    return {
    }
  },
  mounted () {
    EventBus.$on('rerender2', (val) => {
      console.log(val)
    })
  },
  name: 'Header',
  components: {
    BaseButton,
    AdvancedButton,
    Blocks
  },
  methods: {
    newline (type) {
      console.log('newline! by header!')
      const textArea = document.querySelector('textarea')
      let insertPosition = -1
      for (var i = 0; i < textArea.selectionStart; i++) {
        if (textArea.value[i] === '\n') insertPosition = i
      }
      // 在最后一个 \n 之后加上对应的 markdown 标识符
      textArea.value = textArea.value.slice(0, insertPosition + 1) +
        `${type}` +
        textArea.value.slice(insertPosition + 1)
      this.rerender(textArea.value)
      textArea.focus()
    },
    newblock (mark) {
      console.log('clicked!')
      const textArea = document.querySelector('textarea')
      textArea.value += '\n```\n'
      const focusPosition = textArea.value.length
      textArea.value += '\n```'
      // 固定光标
      this.focuson(textArea, focusPosition)
      // 重新渲染
      this.rerender(textArea.value)
    },
    addtion (m) {
      // 获取标记及插入类型
      let mark = m.mark
      const type = (m.type === undefined ? 1 : m.type)
      // 记录当前选择位置
      const textArea = document.querySelector('textarea')
      const position = {}
      position.start = textArea.selectionStart
      position.end = textArea.selectionEnd
      // console.log(textArea.value.length, position.start);
      let newValue = ''
      // 在选择位置前后插入
      if (type === 1) {
        newValue = textArea.value.slice(0, position.start) +
              mark +
              textArea.value.slice(position.start, position.end) +
              mark +
              textArea.value.slice(position.end)
      } else if (type === 2) {
        newValue = textArea.value.slice(0, position.start) +
              `<${mark}>` +
              textArea.value.slice(position.start, position.end) +
              `</${mark}>` +
              textArea.value.slice(position.end)
        mark += '12'
      }
      // 如果当前没有选择文字, 就要将光标移到插入区域
      if (position.start === position.end) {
        // 需要更新 textArea.value 的值, 否则无法正确设置光标
        textArea.value = newValue
        console.log(textArea.value.length, position.start + mark.length)
        this.focuson(textArea, position.start + mark.length)
      } else {
      // 如果当前有选择文字, 就要将光标重新 focus 即可
        textArea.focus()
      }
      // 重新渲染
      this.rerender(newValue)
    },
    rerender (newValue) {
      // 通过事件总线去触发兄弟组件 Texta 的 render()
      EventBus.$emit('rerender2', newValue)
    },
    focuson: function (e, cursor) {
      e.focus()
      e.setSelectionRange(cursor, cursor)
    }
  }
}
</script>

<style scoped>

header {
    /* 头部标签栏 */
    /* flex-shrink: 0; */
    display: flex;
    height: 40px;
    width: 100vw;
    background-color: whitesmoke;
    justify-content: space-around;
    align-items: center;
}

.quote {
  background-image: url(../assets/icons/quote.gif)
}
.leftalign {
  background-image: url(../assets/icons/alignleft.gif)
}
.rightlign {
  background-image: url(../assets/icons/alignright.gif)
}
.em {
  background-image: url(../assets/icons/em.gif)
}
.bold {
  background-image: url(../assets/icons/bold.gif)
}
.underline {
  background-image: url(../assets/icons/underline.gif)
}
.code {
  background-image: url(../assets/icons/code.jpg)
}
.codeblock {
  background-image: url(../assets/icons/codeblock.gif);
}
.baseline {
  background-image: url(../assets/icons/hr.jpg);
}
.refence {
  padding: 0 5px;
  border-radius: 5px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  cursor: pointer;
  box-shadow: 0px 1px 5px 1px gray;
}
</style>
