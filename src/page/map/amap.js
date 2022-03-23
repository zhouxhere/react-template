//获取当前时间
var nowDate = new Date()
var year = nowDate.getFullYear()
var month = nowDate.getMonth() + 1
var today = nowDate.getDate()
var hours = nowDate.getHours()
var minutes = nowDate.getMinutes()
var seconds = nowDate.getSeconds()

if (month >= 1 && month <= 9) {
  month = '0' + month
}
if (today >= 1 && today <= 9) {
  today = '0' + today
}
var currentdate =
  year + '-' + month + '-' + today + ' ' + hours + ':' + minutes + ':' + seconds
var longTime = new Date(
  currentdate.replace(new RegExp('-', 'gm'), '/')
).getTime()
export default { longTime }
