const cookieName = '字幕组'
const cookieKey = 'chavy_cookie_zimuzu'
const cookieAppKey = 'chavy_cookie_zimuzu_app'
const chavy = init()
if ($request.headers.Host == 'h5.rrhuodong.com') {
  const cookieVal = $request.headers['Cookie']
  if (cookieVal) {
    if (chavy.setdata(cookieVal, cookieAppKey)) {
      chavy.msg(`${cookieName} (APP)`, '获取Cookie: 成功', '')
      chavy.log(`[${cookieName} (APP)] 获取Cookie: 成功, cookie: ${cookieAppKey}`)
    }
  }
} else {
  const cookieVal = $request.headers['Cookie']
  if (cookieVal) {
    if (chavy.setdata(cookieVal, cookieKey)) {
      chavy.msg(`${cookieName} (网页)`, '获取Cookie: 成功', '')
      chavy.log(`[${cookieName} (网页)] 获取Cookie: 成功, cookie: ${cookieVal}`)
    }
  }
}

const chavy = init()
const cookieVal = $request.headers['Cookie']
if (cookieVal) {
  if (chavy.setdata(cookieVal, cookieKey)) {
    chavy.msg(`${cookieName}`, '获取Cookie: 成功', '')
    chavy.log(`[${cookieName}] 获取Cookie: 成功, cookie: ${cookieVal}`)
  }
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
chavy.done()
