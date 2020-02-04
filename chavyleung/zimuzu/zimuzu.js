const cookieName = '字幕组'
const cookieKey = 'chavy_cookie_zimuzu'
const chavy = init()
const cookieVal = chavy.getdata(cookieKey)

sign()

function sign() {
  const timestamp = Date.parse(new Date())
  let url = { url: `http://www.rrys2019.com/user/login/getCurUserTopInfo`, headers: { Cookie: cookieVal } }
  url.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15'

  chavy.get(url, (error, response, data) => {
    chavy.log(`${cookieName}, data: ${data}`)
    let result = JSON.parse(data)
    const title = `${cookieName}`
    let subTitle = ''
    let detail = ''
    if (result.status == 1) {
      if (result.data.new_login) subTitle = '签到结果: 成功'
      else subTitle = '签到结果: 成功 (重复签到)'
      detail = `人人钻: ${result.data.userinfo.point}, 登录天数: ${result.data.usercount.cont_login} -> ${result.data.upgrade_day}`
      chavy.msg(title, subTitle, detail)
    } else {
      subTitle = '签到结果: 未知'
      chavy.msg(title, subTitle, detail)
    }
  })
  chavy.done()
}

function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
