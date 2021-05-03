<template>
    <div class="file-component">
        <div class="mask" @click="back"></div>
        <div class="file-window">
            <table>
                <tr>
                    <td width="30%">文件名</td>
                    <td width="30%">内容摘要</td>
                    <td width="30%">时间</td>
                    <td width="10%">操作</td>
                </tr>
                <tr :key="item._id" v-for="item in list">
                    <td width="30%">{{item.name}}</td>
                    <td class="value" width="30%">{{item.value.split('\n')[0]}}</td>
                    <td width="30%">{{item.date}}</td>
                    <td class="button" width="10%">
                        <a href="#" @click="getFile(item._id)" > getfile</a>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import eventhub from './eventhub'

export default {
    name: 'Files',
    data() {
        return {
            list : []
        }
    },
    created() {
        // 获取文件列表
        axios.defaults.baseURL = 'http://127.0.0.1:3000'
        axios.get('/getList')
            // created 钩子获取当前数据库内的文件数据
            .then(res => { 
                // res.data 为一数组，包含所有的数据库的内容
                // console.log(res.data);
                this.list = Array.from(res.data)
            })
    },
    methods: {
        getFile (id) {
            // 根据 id 去数据库查找
            axios.get(`/getFile?id=${id}`)
            .then(res => { 
                // res.data.value 为文档内容
                // console.log(res.data.value);
                // 重渲染 & 设置文档标题
                eventhub.$emit('rerender2', res.data.value)
                eventhub.$emit('setTitle', res.data.name)
                // 回退到编辑界面
                this.$router.push('/')
            })
        },
        back () {
            // 点击 mask 直接回退
            this.$router.push('/')
        }
    }
}
</script>

<style scoped>
    * {
        padding: 0;
        margin: 0;
    }
    table {
        border: 0;
        width: 600px;
        table-layout: fixed;
    }
    .file-window {
        /* 定位 */
        position: absolute;
        top: 50%;
        left:50%;
        transform: translate(-50%,-50%);
        z-index: 3;
        /* 大小 */
        height: 500px;
        width: 650px;
        /* 边距 */
        padding: 10px;
        /* 装饰 */
        opacity: 80%;
        border-radius: 10px;
        background-color: whitesmoke;
        overflow: auto;
    }

    td {
        border: 0;
        vertical-align: middle;
        text-align: center;
        height: 40px;
    }
    .value {
        padding: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .button:hover {
        border-radius: 5px;
        transition: all 0.3s ease;
        background-color: skyblue;
    }

    .mask {
        position: absolute;
        width: 100vw;
        height: 100vh;
        background-color: black;
        opacity: 60%;
        z-index: 2;
    }

</style>