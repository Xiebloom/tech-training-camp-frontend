<template>
    <div class="main">
      <textarea name="textarea" id="" v-model="text" @input="render"></textarea>
      <div class="mdtext" v-html="mdtext" ref="md"></div>
  </div>
</template>

<script>
import EventBus from './eventhub.js'
export default {
  name: 'Texta',
  data () {
    return {
      text: '',
      mdtext: ''
    }
  },
  // 一开始没反应啊？
  // 后面换了事件的名称（不重名），又换了钩子函数的位置（methods）之前，就好了？
  created () {
    // mounted 时刻，开始监听 rerender 事件
    EventBus.$on('rerender2', (newValue) => {
      console.log('ok, now rerender')
      this.text = newValue
      this.render()
    })
  },
  methods: {
    render: function () {
      // console.log(this)
      const rows = this.text.split('\n')
      let html = ''
      let matchArr = ''

      // match 的返回值是个伪数组, 其中 res[0] = matched substring
      for (var i = 0, len = rows.length; i < len; i++) {
        matchArr = rows[i].match(/^#\s/) || // 1 号标题
                    rows[i].match(/^##\s/) || // 2号
                    rows[i].match(/^###\s/) ||
                    rows[i].match(/^####\s/) ||
                    rows[i].match(/^#####\s/) ||
                    rows[i].match(/^######\s/) ||
                    rows[i].match(/^[*\-_=]{3,}/) || // 匹配3次以上
                    rows[i].match(/^>\s/) || // 引用 quoteblock
                    rows[i].match(/^\*\s/) || // 无序列表
                    rows[i].match(/^\d\.\s/) || // 有序列表
                    rows[i].match(/^```$/) || // 代码块
                    rows[i].match(/^\|.*\|/) || // 表格
                    rows[i].match(/^@[l,r,c,d]\s/) // 对齐

        // console.log(rows[i].match(/^#\s/))

        if (matchArr) {
          let temp = ''
          let re = ''
          switch (matchArr[0]) {
            // 标题
            case '# ':
              // console.log('#!')
              html += '<h1>' + this.format(rows[i].substring(2)) + '</h1>'
              break
            case '## ':
              html += '<h2>' + this.format(rows[i].substring(3)) + '</h2>'
              break
            case '### ':
              html += '<h3>' + this.format(rows[i].substring(4)) + '</h3>'
              break
            case '#### ':
              html += '<h4>' + this.format(rows[i].substring(5)) + '</h4>'
              break
            case '##### ':
              html += '<h5>' + this.format(rows[i].substring(6)) + '</h5>'
              break
            case '###### ':
              html += '<h6>' + this.format(rows[i].substring(7)) + '</h6>'
              break

            case rows[i].match(/^[*\-_=]{3,}/) && rows[i].match(/^[*\-_=]{3,}/)[0]:
              // 水平线
              html += rows[i].replace(/^[*\-_=]{3,}/g, '<hr>')
              break

            case '> ':
              // 引用
              temp = ''
              re = /^>\s/
              // 判断是否是多行连续引用
              while (i < len && rows[i].match(re)) {
                temp += '<p>' + this.format(rows[i].substring(2)) + '</p>'
                // 如果有下一行，并且下一行也是引用
                if (rows[i + 1] && rows[i + 1].match(re)) i++
                // 必须 break, 否则 i 不会自增，死循环
                else break
              }
              html += '<blockquote>' + temp + '</blockquote>'
              break

            case '* ':
              // 无序列表
              temp = ''
              re = /^\*\s/
              while (i < len && rows[i].match(re)) {
                temp += '<li>' + this.format(rows[i].substring(2)) + '</li>'
                if (rows[i + 1] && rows[i + 1].match(re)) i++
                else break
              }
              html += '<ul>' + temp + '</ul>'
              break

            case rows[i].match(/^\d\.\s/) && rows[i].match(/^\d\.\s/)[0]:
              // 有序列表
              temp = ''
              re = /^\d\.\s/
              while (i < len && rows[i].match(re)) {
                temp += '<li>' + this.format(rows[i].substring(3)) + '</li>'
                // console.log(i);
                if (rows[i + 1] && rows[i + 1].match(re)) i++
                else break
              }
              html += '<ol>' + temp + '</ol>'
              break

            case '```':
              // 代码块
              temp = ''
              re = /^```$/
              i++
              // !re.test(rows[i])
              while (i < len && !rows[i].match(re)) {
                temp += rows[i] + '\n'
                i++
              }
              html += '<pre>' + temp + '</pre>'
              break

            case rows[i].match(/^\|.*\|/) && rows[i].match(/^\|.*\|/)[0]:
              // 表格
              temp = ''
              re = /^\|.*\|/ // 表格框
              var thRe = /^\[th\]/ // 表头
              var arry, j, jlen
              while (i < len && re.test(rows[i])) {
                // 依照 | 进行拆分
                arry = rows[i].split('|')
                temp += '<tr>'
                // arry[0] 和 arry[last] 是 空字符串
                // - split 是以 '|' 作为分隔符，其前后都会被纳入结果
                for (j = 1, jlen = arry.length - 1; j < jlen; j++) {
                  if (thRe.test(arry[1])) {
                    // 如果存在 [th] 表头标识符
                    temp += '<th>' + arry[j] + '</th>'
                  } else {
                    temp += '<td>' + arry[j] + '</td>'
                  }
                }
                temp += '</tr>'
                // 将表头标识符删去
                temp = temp.replace('[th]', '')
                if (rows[i + 1] && rows[i + 1].match(re)) i++
                else break
              }
              html += '<table>' + temp + '</table>'
              break

            case rows[i].match(/^@[l,r,c,d]\s/)[0]:
              // 文本对齐
              var alignType = ''
              switch (rows[i].match(/^@[l,r,c,d]\s/)[0]) {
                // 匹配标识符
                case '@l ':
                  alignType = 'left'
                  break
                case '@r ':
                  alignType = 'right'
                  break
                case '@c ':
                  alignType = 'center'
                  break
                case '@d ':
                  alignType = 'justify'
                  break
                default:
                  break
              }
              // 模板字符串安排 style
              html += `<p style="text-align: ${alignType};">` + rows[i].substring(3) + '</p>'
              break
            default:
              break
          }
        } else {
          html += '<p>' + this.format(rows[i]) + '</p>'
        }
      }
      this.mdtext = html
    },
    // 对行内文字格式进行设定
    format: function (str) {
      // 保留用户输入的空格
      str = str.replace(/\s/g, '&nbsp;')
      var url = ''
      var title = ''

      // 粗体
      var bold = str.match(/\*{2}[^*].*?\*{2}/g) // 非贪婪匹配，两个 '**' 中间的字符必须不以*打头，否则是打不出一排*的
      if (bold) {
        for (var i = 0, len = bold.length; i < len; i++) {
          str = str.replace(bold[i], '<b>' + bold[i].substring(2, bold[i].length - 2) + '</b>')
        }
      }

      // 斜体
      var italic = str.match(/\*[^*].*?\*/g) // 同样是非贪婪匹配， 两个 '*' 中间必须有别的字符才能构成斜体
      if (italic) {
        for (i = 0, len = italic.length; i < len; i++) {
          str = str.replace(italic[i], '<i>' + italic[i].substring(1, italic[i].length - 1) + '</i>')
        }
      }

      // 代码行
      var code = str.match(/`.+`/g)
      if (code) {
        for (i = 0, len = code.length; i < len; i++) {
          str = str.replace(code[i], '<code>' + code[i].substring(1, code[i].length - 1) + '</code>')
        }
      }

      // 插入图片
      var img = str.match(/!\[.*\]\(.*\)/g)
      var re1 = /\(.*\)/
      var re2 = /\[.*\]/
      if (img) {
        for (i = 0, len = img.length; i < len; i++) {
          url = img[i].match(re1)[0]
          title = img[i].match(re2)[0]
          str = str.replace(img[i], '<img src=' + url.substring(1, url.length - 1) + ' alt=' + title.substring(1, title.length - 1) + '>')
        }
      }

      // 链接
      var a = str.match(/\[.*\]\(.*\)/g)
      if (a) {
        for (i = 0, len = a.length; i < len; i++) {
          url = a[i].match(re1)[0]
          title = a[i].match(re2)[0]
          str = str.replace(a[i], '<a href=' + url.substring(1, url.length - 1) + '>' + '<img src="pandaman.jpg" alt="..." class="linkimg"> ' + '<span>' + title.substring(1, title.length - 1) + '</span>' + '</a>')
        }
      }

      return str
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.main {
    /* 两个编译框 */
    flex: auto;
    display: flex;
    height: 100vh;
    overflow: hidden;
}

textarea {
    flex: 1;
    /* float: left; */
    box-sizing: border-box;
    padding: 30px;
    border-right: 2px white solid;
    color: cornsilk;
    background-color: rgba(146, 168, 209);
    overflow-y: auto;
    outline: none;
}

.mdtext {
    flex: 1;
    /* float: right; */
    box-sizing: border-box;
    padding: 30px;
    /* height: 80%; */
    /* width: 49%; */
    border-left: 2px white solid;
    background-color: rgb(247, 202, 201);
    overflow-y: auto;
    word-break: break-word;
}

::-webkit-scrollbar-track-piece {
    background-color: #fff;
    -webkit-border-radius: 0;
}

::-webkit-scrollbar {
    width: 10px;
    height: 10px
}

::-webkit-scrollbar-thumb {
    height: 50px;
    background-color: #b8b8b8;
    -webkit-border-radius: 6px;
    outline: 2px solid #fff;
    outline-offset: -2px;
    border: 2px solid #fff;
    filter: alpha(opacity=50);
    opacity: 0.5
}

::-webkit-scrollbar-thumb:hover {
    height: 50px;
    background-color: #878987;
    -webkit-border-radius: 6px
}

</style>
