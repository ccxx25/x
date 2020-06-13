const cookieName = '悦刻'
const signurlKey = 'senku_signurl_yk'
const signheaderKey = 'senku_signheader_yk'
const signbodyKey = 'senku_signbody_yk'
const senku = init()
const signurlVal = senku.getdata(signurlKey)
const signheaderVal = senku.getdata(signheaderKey)
//const signBodyVal = senku.getdata(signbodyKey)

sign()

function sign() {
  const url = { url: signurlVal, headers: JSON.parse(signheaderVal)/*, body: signBodyVal */}
  senku.get(url, (error, response, data) => {
    const result = JSON.parse(data)
    const total = result.data.continuation_days
//result.data['continuation_days'].total
    //const ret = result.data.state
    const ret1 = result.data.state
    const ret = result.data['prize_config_response_list'][0].state
    let subTitle = ``
    let detail = ``
    //if (ret == 1) {
    if (ret1 == false) {
      const num = //result.data['remaining_days'].num
result.data.remaining_days
      subTitle = `签到结果: 成功`
      detail = `已连续签到:${total}天,距离领取最高奖励还有: ${num}天`
    } else if (ret1 == true) {
      subTitle = `签到结果: 成功 (重复签到)`
    } else {
      subTitle = `签到结果: 失败`
    }
    senku.msg(cookieName, subTitle, detail)
    senku.done()
  })
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
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
