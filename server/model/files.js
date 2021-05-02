const mongoose = require( 'mongoose')
const getTime = require('../getTime')
// 初始化数据库
// - 创建用户集合规则
let time = getTime()

let File = mongoose.model('File', new mongoose.Schema({
    name: {
        type : String,
        minlength : 2,
        maxlength : 20,
        require: true,
        unique: {
            value :true,
            message: '文件名重复'
        }
    },
    value : {
        type : String
    },
    date : {
        type : String,
        default : time
    }
}))
// - 添加数据
// File.create({ name: 'test', value:'test-value' })

module.exports = File;