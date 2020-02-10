/*
浏览器访问并登录: https://music.163.com/m/login
打开浏览器访问: https://music.163.com/m/
QuanX提示: Cookie [网易云音乐] 写入成功
最后就可以把[rewrite_local]的脚本注释掉了

*/

const cookieName = '网易云音乐'
const cookieKey = 'chavy_cookie_neteasemusic'
const cookieVal = $request.headers['Cookie']

if (cookieVal) {
  let cookie = $prefs.setValueForKey(cookieVal, cookieKey)
  if (cookie) {
    let msg = `${cookieName}`
    $notify(msg, 'Cookie写入成功', '详见日志')
    console.log(msg)
    console.log(cookieVal)
  }
}

$done({})
