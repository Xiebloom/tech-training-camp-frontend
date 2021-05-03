// 获取当前时间
function getTime() {
    let nowDate = new Date()
    let time = ''
    time += nowDate.getFullYear() + '-'
    time += nowDate.getMonth() + 1 + '-'
    time += nowDate.getDate() + ' '
    time += nowDate.getHours() + ':'
    time += nowDate.getMinutes()
    return time
}

module.exports = getTime