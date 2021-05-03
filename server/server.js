require('./model/index')
const File = require('./model/files')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// 处理跨域问题
app.use(require('cors')())

// 解析 post 请求的 req
app.use(bodyParser.urlencoded({ extended : false}))
app.use(bodyParser.json())

// 获取数据库中的文件 list
app.get('/getList', async (req, res) => {
    // 1 查询数据库
    let list = await File.find()
    res.send(list)
})

// 获取某个文件
app.get('/getFile', async (req, res) => {
    // 1 获得 id
    let _id = req.query.id
    // 2 查询数据
    let targetFile = await File.findOne({_id:_id})
    // console.log(targetFile);
    res.send(targetFile)
})

// 保存文件
app.post('/save', async (req, res) => {
    // console.log('/save-body',req.body);
    // 查询是否已有该命名文件
    let isExisted = await File.findOne({name: req.body.name})
    // - 已有，进行覆盖
    if(isExisted !== null) {
        await File.updateOne({name: req.body.name}, req.body)
        res.send('已覆盖原有文件')
    } 
    // - 没有，创建文件
    else {
        await File.create(req.body)
        res.send(`已新建文件 '${req.body.name}'`)
    }
})

app.listen(3000, () => {
    console.log('Run the server...');
})
