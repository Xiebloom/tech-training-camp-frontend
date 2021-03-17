// 子组件
var AdvancedButton = {
    props: ['urls', 'buttonname', 'functiontype'],
    // 模板语法里面 background-image 要写成 backgroundImage
    template: `          
    <div class="header-button" >
        <div class="fixed-menu" :style="{backgroundImage: urls[buttonname][0]}" @click="click(0)"> </div>
        <ul class="float-menu">
            <li v-for="(item,index) in urls[buttonname].slice(1)">
                <img :src="urls[buttonname][index+1]" alt="..." @click="click(index+1)">
            </li>
        </ul>
    </div>
    `,
    methods: {
        click: function(index) {
            // console.log(index)
            this.$emit(this.functiontype, '#'.repeat(index + 1) + ' ');
        }
    }
}

var BaseButton = {
    props: ['urls', 'buttonname', 'functiontype'],
    // 模板语法里面 background-image 要写成 backgroundImage
    template: `          
    <div class="header-button" :style="{backgroundImage: urls[buttonname]}" @click="click">
        
    </div>
    `,
    methods: {
        click: function() {
            this.$emit(this.functiontype);
        }
    }
}

var SpaceArea = {
    template: `
        <div class="space-area"></div>
    `
}

var ButtonBlock = {
    // 利用插槽
    template: `
        <div class="button-block">
            <slot></slot>
        </div>
    `
}

// 父组件
Vue.component('my-header', {
    data: function() {
        return {
            urls: {
                quote: 'url(./icons/quote.gif)',
                cleanup: 'url(./icons/clearup.jpg)',
                em: 'url(./icons/em.gif)',
                bold: 'url(./icons/bold.gif)',
                underline: 'url(./icons/underline.gif)',
                title: ['url(./icons/title1.jpg)', './icons/title2.jpg', './icons/title3.jpg'],
                baseline: 'url(./icons/hr.jpg)',
                code: 'url(./icons/code.jpg)',
                alignleft: 'url(./icons/alignleft.gif)',
                alignright: 'url(./icons/alignright.gif)',
                codeblock: 'url(./icons/codeblock.gif)',
            },
        }
    },

    // 靠左/靠右
    // 加粗/倾斜/下划线
    // 标题/引用/代码块/水平线
    template: `
        <div>
            <!-- 段落排版 -->
            <button-block>
                <base-button :urls="urls" buttonname="alignleft" functiontype="newline" @newline="newline('@l ')"></base-button>
                <base-button :urls="urls" buttonname="alignright" functiontype="newline" @newline="newline('@r ')"></base-button>
            </button-block>
            <space-area></space-area>

            <!-- 文字变形 -->
            <button-block>
                <base-button :urls="urls" buttonname="em" functiontype="onmouseup" @onmouseup="addtion({mark:'*'})" class="clearfix"></base-button>
                <base-button :urls="urls" buttonname="bold" functiontype="onmouseup" @onmouseup="addtion({mark:'**'})" class="clearfix"></base-button>
                <base-button :urls="urls" buttonname="underline" functiontype="onmouseup" @onmouseup="addtion({mark:'u',type:2})" class="clearfix"></base-button>
            </button-block>
            <space-area></space-area> 

            <!-- 换行插入标签 -->         
            <button-block>
                <base-button :urls="urls" buttonname="quote" functiontype="newline" @newline="newline('> ')"></base-button>
                <advanced-button :urls="urls" buttonname="title" functiontype="newline" @newline="newline($event)"></advanced-button>
                <base-button :urls="urls" buttonname="baseline" functiontype="newline" @newline="newline('***\\n')"></base-button>
                <base-button :urls="urls" buttonname="code" functiontype="onmouseup" @onmouseup="addtion({mark:'\`'})" class="clearfix"></base-button>
            </button-block>     
            
            <space-area></space-area>
            <button-block>
                <base-button :urls="urls" buttonname="codeblock" functiontype="newblock" @newblock="newblock('\`\`\`')"></base-button>
            </button-block>
            <space-area></space-area>
            <button-block>
                <base-button :urls="urls" buttonname="cleanup" functiontype="cleanup" @cleanup="cleanup"></base-button>
            </button-block>
        </div>
    `,
    components: {
        'base-button': BaseButton,
        'space-area': SpaceArea,
        'button-block': ButtonBlock,
        'advanced-button': AdvancedButton,
    },
    methods: {
        // 当前行头插入功能: quote / title 等
        newline: function(type) {
            // console.log('new line!');
            let textArea = document.querySelector('textarea');
            let insertPosition = -1;
            for (var i = 0; i < textArea.selectionStart; i++) {
                if (textArea.value[i] == '\n') insertPosition = i;
            }
            // 在最后一个 \n 之后加上对应的 markdown 标识符
            textArea.value = textArea.value.slice(0, insertPosition + 1) +
                `${type }` +
                textArea.value.slice(insertPosition + 1)
            this.rerender(textArea.value)
            textArea.focus();
        },
        // 换行功能: 新增代码块
        newblock: function(mark) {
            console.log('clicked!');
            let textArea = document.querySelector('textarea');
            textArea.value += '\n\`\`\`\n';
            let focusPosition = textArea.value.length;
            textArea.value += '\n\`\`\`';
            // 固定光标
            this.focuson(textArea, focusPosition);
            // 重新渲染
            this.rerender(textArea.value);
        },
        // 插入类功能
        addtion: function(m) {
            // 获取标记及插入类型
            let mark = m.mark,
                type = (m.type == undefined ? 1 : m.type);
            // 记录当前选择位置
            let textArea = document.querySelector('textarea');
            let position = {};
            position.start = textArea.selectionStart;
            position.end = textArea.selectionEnd;
            // console.log(textArea.value.length, position.start);
            let newValue = '';
            // 在选择位置前后插入
            if (type == 1) {
                newValue = textArea.value.slice(0, position.start) +
                    mark +
                    textArea.value.slice(position.start, position.end) +
                    mark +
                    textArea.value.slice(position.end)
            } else if (type == 2) {
                newValue = textArea.value.slice(0, position.start) +
                    `<${mark}>` +
                    textArea.value.slice(position.start, position.end) +
                    `</${mark}>` +
                    textArea.value.slice(position.end);
                mark += '12';
            }
            // 如果当前没有选择文字, 就要将光标移到插入区域
            if (position.start == position.end) {
                // 需要更新 textArea.value 的值, 否则无法正确设置光标
                textArea.value = newValue;
                console.log(textArea.value.length, position.start + mark.length);
                this.focuson(textArea, position.start + mark.length)
            }
            // 如果当前有选择文字, 就要将光标重新 focus 即可
            else {
                textArea.focus()
            }
            // 重新渲染 
            this.rerender(newValue)
        },
        // 清空
        cleanup: function() {
            console.log('cleanup!');
            let textArea = document.querySelector('textarea');
            // 清空 textArea
            textArea.value = '';
            // 重新渲染
            this.rerender('')
        },
        // 通用方法: 固定光标
        // 传入参数: textarea元素, 希望的光标位置
        focuson: function(e, cursor) {
            e.focus();
            e.setSelectionRange(cursor, cursor);
        },
        // 通用方法: 重新渲染
        rerender: function(newValue) {
            this.$root.text = newValue;
            this.$root.render()
        }
    }
})

// var mdArea = document.querySelector('mdtext');

var markdownComp = new Vue({
    el: "#complier",
    data: {
        text: '',
        mdtext: '',
        scrollPosition: 0,
    },
    methods: {
        render: function() {
            // console.log(this)
            let rows = this.text.split('\n'),
                html = '',
                matchArr = '';

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
                    rows[i].match(/^@[l,r,c,d]\s/); // 对齐

                // console.log(rows[i].match(/^#\s/))

                if (matchArr) {
                    switch (matchArr[0]) {
                        // 标题
                        case '# ':
                            // console.log('#!')
                            html += '<h1>' + this.format(rows[i].substring(2)) + '</h1>';
                            break;
                        case '## ':
                            html += '<h2>' + this.format(rows[i].substring(3)) + '</h2>';
                            break;
                        case '### ':
                            html += '<h3>' + this.format(rows[i].substring(4)) + '</h3>';
                            break;
                        case '#### ':
                            html += '<h4>' + this.format(rows[i].substring(5)) + '</h4>';
                            break;
                        case '##### ':
                            html += '<h5>' + this.format(rows[i].substring(6)) + '</h5>';
                            break;
                        case '###### ':
                            html += '<h6>' + this.format(rows[i].substring(7)) + '</h6>';
                            break;

                        case rows[i].match(/^[*\-_=]{3,}/) && rows[i].match(/^[*\-_=]{3,}/)[0]:
                            // 水平线
                            html += rows[i].replace(/^[*\-_=]{3,}/g, '<hr>');
                            break;

                        case '> ':
                            //引用
                            var temp = '';
                            var re = /^>\s/;
                            // 判断是否是多行连续引用
                            while (i < len && rows[i].match(re)) {
                                temp += '<p>' + this.format(rows[i].substring(2)) + '</p>';
                                // 如果有下一行，并且下一行也是引用
                                if (rows[i + 1] && rows[i + 1].match(re)) i++;
                                // 必须 break, 否则 i 不会自增，死循环
                                else break;
                            }
                            html += '<blockquote>' + temp + '</blockquote>';
                            break;

                        case '* ':
                            // 无序列表
                            var temp = '';
                            var re = /^\*\s/;
                            while (i < len && rows[i].match(re)) {
                                temp += '<li>' + this.format(rows[i].substring(2)) + '</li>';
                                if (rows[i + 1] && rows[i + 1].match(re)) i++;
                                else break;
                            }
                            html += '<ul>' + temp + '</ul>';
                            break;

                        case rows[i].match(/^\d\.\s/) && rows[i].match(/^\d\.\s/)[0]:
                            // 有序列表
                            var temp = '';
                            var re = /^\d\.\s/;
                            while (i < len && rows[i].match(re)) {
                                temp += '<li>' + this.format(rows[i].substring(3)) + '</li>';
                                // console.log(i);
                                if (rows[i + 1] && rows[i + 1].match(re)) i++;
                                else break;
                            }
                            html += '<ol>' + temp + '</ol>';
                            break;

                        case '```':
                            // 代码块
                            var temp = '';
                            var re = /^```$/;
                            i++;
                            // !re.test(rows[i])
                            while (i < len && !rows[i].match(re)) {
                                temp += rows[i] + '\n';
                                i++;
                            }
                            html += '<pre>' + temp + '</pre>';
                            break;

                        case rows[i].match(/^\|.*\|/) && rows[i].match(/^\|.*\|/)[0]:
                            // 表格
                            var temp = '';
                            var re = /^\|.*\|/; // 表格框
                            var thRe = /^\[th\]/; // 表头
                            var arry, j, jlen;
                            while (i < len && re.test(rows[i])) {
                                // 依照 | 进行拆分
                                arry = rows[i].split('|');
                                temp += '<tr>';
                                // arry[0] 和 arry[last] 是 空字符串
                                // - split 是以 '|' 作为分隔符，其前后都会被纳入结果
                                for (j = 1, jlen = arry.length - 1; j < jlen; j++) {
                                    if (thRe.test(arry[1])) {
                                        // 如果存在 [th] 表头标识符
                                        temp += '<th>' + arry[j] + '</th>';
                                    } else {
                                        temp += '<td>' + arry[j] + '</td>';
                                    }
                                }
                                temp += '</tr>';
                                // 将表头标识符删去
                                temp = temp.replace('[th]', '');
                                if (rows[i + 1] && rows[i + 1].match(re)) i++;
                                else break;
                            }
                            html += '<table>' + temp + '</table>';
                            break;

                        case rows[i].match(/^@[l,r,c,d]\s/)[0]:
                            // 文本对齐
                            let alignType = ''
                            switch (rows[i].match(/^@[l,r,c,d]\s/)[0]) {
                                // 匹配标识符
                                case '@l ':
                                    alignType = 'left';
                                    break;
                                case '@r ':
                                    alignType = 'right';
                                    break;
                                case '@c ':
                                    alignType = 'center';
                                    break;
                                case '@d ':
                                    alignType = 'justify';
                                    break;
                                default:
                                    break;
                            }
                            // 模板字符串安排 style
                            html += `<p style="text-align: ${alignType};">` + rows[i].substring(3) + '</p>';
                            break;
                        default:
                            break;
                    }
                } else {
                    html += '<p>' + this.format(rows[i]) + '</p>';
                }

            }
            this.mdtext = html;
        },
        // 对行内文字格式进行设定
        format: function(str) {

            // 保留用户输入的空格
            str = str.replace(/\s/g, '&nbsp;');

            // 粗体
            var bold = str.match(/\*{2}[^*].*?\*{2}/g); // 非贪婪匹配，两个 '**' 中间的字符必须不以*打头，否则是打不出一排*的
            if (bold) {
                for (var i = 0, len = bold.length; i < len; i++) {
                    str = str.replace(bold[i], '<b>' + bold[i].substring(2, bold[i].length - 2) + '</b>');
                }
            }

            // 斜体
            var italic = str.match(/\*[^*].*?\*/g); // 同样是非贪婪匹配， 两个 '*' 中间必须有别的字符才能构成斜体
            if (italic) {
                for (i = 0, len = italic.length; i < len; i++) {
                    str = str.replace(italic[i], '<i>' + italic[i].substring(1, italic[i].length - 1) + '</i>');
                }
            }

            // 代码行
            var code = str.match(/`.+`/g);
            if (code) {
                for (i = 0, len = code.length; i < len; i++) {
                    str = str.replace(code[i], '<code>' + code[i].substring(1, code[i].length - 1) + '</code>');
                }
            }

            // 插入图片
            var img = str.match(/!\[.*\]\(.*\)/g);
            var re1 = /\(.*\)/;
            var re2 = /\[.*\]/;
            if (img) {
                for (i = 0, len = img.length; i < len; i++) {
                    var url = img[i].match(re1)[0];
                    var title = img[i].match(re2)[0];
                    str = str.replace(img[i], '<img src=' + url.substring(1, url.length - 1) + ' alt=' + title.substring(1, title.length - 1) + '>');
                }
            }

            // 链接
            var a = str.match(/\[.*\]\(.*\)/g);
            if (a) {
                for (i = 0, len = a.length; i < len; i++) {
                    var url = a[i].match(re1)[0];
                    var title = a[i].match(re2)[0];
                    str = str.replace(a[i], '<a href=' + url.substring(1, url.length - 1) + '>' + '<img src="pandaman.jpg" alt="..." class="linkimg"> ' + '<span>' + title.substring(1, title.length - 1) + '</span>' + '</a>');
                }
            }

            return str;
        },
        // 协同滚动事件
        controlScroll: function() {
            this.$refs.md.scrollTop = event.target.scrollTop / event.target.clientHeight * this.$refs.md.clientHeight
        }
    }
})