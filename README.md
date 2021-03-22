
# tech-training-camp-frontend
MarkDown

##  1 技术方案
### 1.1 实现方法
* 语法解析：正则表达式
* 项目开发：Vue框架
### 1.2 技术栈
Vue \ VueRouter \ Vue-cli
## 2 使用方法
### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
## 3 各阶段性任务
### 3.1 实现 md 语法的解析及渲染
1. 务必确认解析不出错
### 3.2 实现工具栏的布局及功能粗略实现
1. 功能按键布局直接 flex 简单优雅
2. 各功能先按类划分，按框架实现
### 3.3 基于Vue的组件思想进行搭建项目
1. 注意按钮组件的复用性
2. 组件种类：
* 基本按钮
* 含下拉菜单的按钮
* 空白
* 按钮框
### 3.4 优化功能，改善用户体验
1. 各按键的功能模块
* 光标前后加入字符 (加粗，倾斜，下划线等)
* 换行加入字符 (代码框)
* 光标重定位
2. 左右界面协同滚动
3. 公式输入 / 代码高亮 (X)
### 3.5 创新功能 
1. 靠左、靠右排版功能
2. 清除功能
3. 输入链接时出现代表链接的图片，比起蓝色字符+下划线更美观
### 3.6 NodeJS实现文件读取
### 3.7 共同编辑

## 4 仍可提升点
* 利用 AST 解析去更好地支持 md 的语法 (语法嵌套功能暂未实现)
* 利用路由实现：读取文件、文件管理、批量删除等功能的界面
* 提高性能：改善输入一个字，重新渲染一次的笨方法
* 利用更高级的Vue的功能，同时优化组件的设计
* 更加工程化，如 Babel、webpack、Eslint 语法检查等
* 就算是单人项目，也应该和其他营员多交流

