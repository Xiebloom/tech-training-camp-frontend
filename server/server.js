require('./model/index')
const File = require('./model/files')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(require('cors')())
app.use(bodyParser.urlencoded({ extended : false}))
app.use(bodyParser.json())

app.get('/getList', async (req, res) => {
    // 1 查询数据库
    let list = await File.find()
    res.send(list)
})

app.get('/getFile', async (req, res) => {
    // 1 获得 id
    let _id = req.query.id
    // 2 查询数据
    let targetFile = await File.findOne({_id:_id})
    // console.log(targetFile);
    res.send(targetFile)
})

app.post('/save', async (req, res) => {
    console.log('/save-body',req.body);
    let isExisted = await File.findOne({name: req.body.name})
    // console.log('---------------\n',isExisted);
    if(isExisted !== null) {
        await File.updateOne({name: req.body.name}, req.body)
        res.send('已覆盖原有文件')
    } else {
        await File.create(req.body)
        res.send(`已新建文件 '${req.body.name}'`)
    }
})

app.listen(3000, () => {
    console.log('Run the server...');
})
