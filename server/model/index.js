const mongoose = require( 'mongoose')

// 数据库连接
// * 27017 默认端口
mongoose.connect('mongodb://localhost:27017/e',{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => console.log('---------- connect to db successfully ----------'))
    .catch(() => console.log('---------- failed to connect to db -----------'));

