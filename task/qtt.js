// Todo: 待添加多账号签到

const cookieName = '趣头条'
const signKey = 'senku_signKey_qtt'
const signXTKKey = 'senku_signXTK_qtt'
const readKey = 'senku_readKey_qtt'
const navCoinKey = 'senku_navCoinKey_qtt'
const senku = init()
const signVal = senku.getdata(signKey)
const signXTKVal = senku.getdata(signXTKKey)
const readVal = senku.getdata(readKey)
const navCoinVal = senku.getdata(navCoinKey)
const signurlVal = 'https://api.1sapp.com/sign/sign?version=30967000&xhi=200' + signVal
const adUrl = 'https://api.1sapp.com/sign/adDone?version=30967000&xhi=200' + signVal
const getinfoUrlVal = 'https://api.1sapp.com/sign/info?version=30967000&xhi=200' + signVal
const hourUrlVal = 'https://api.1sapp.com/mission/intPointReward?version=30967000&xhi=200' + signVal
const coinUrlVal = 'https://api.1sapp.com/app/ioscoin/getInfo?version=30967000&xhi=200' + signVal
const signinfo = { playList: [] }
const playUrl = [adUrl + 'pos=one', adUrl + 'pos=two', adUrl + 'pos=three', adUrl + 'pos=four']


  ; (sign = async () => {
    senku.log(`🔔 ${cookieName}`)
    // 要获取首页奖励取消下方注释
    if (navCoinVal.match(/\/x\/feed\/getReward\?qdata=[a-zA-Z0-9_-]+/)) {
      await navCoin()
    }
    await signDay()
    await signHour()
    await signLucky()
    await playone()
    await playtwo()
    await playthree()
    await playfour()
    await read()
    await getinfo()
    await getcoininfo()

    showmsg()
    senku.done()
  })().catch((e) => senku.log(`❌ ${cookieName} 签到失败: ${e}`), senku.done())


function signDay() {
  return new Promise((resolve, reject) => {
    const url = { url: signurlVal, headers: { 'Host': 'api.1sapp.com', 'X-Tk': signXTKVal } }
    url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
    senku.get(url, (error, response, data) => {
      try {
        senku.log(`❕ ${cookieName} signDay - response: ${JSON.stringify(response)}`)
        signinfo.signDay = JSON.parse(data)
        resolve()
      } catch (e) {
        senku.msg(cookieName, `签到结果: 失败`, `说明: ${e}`)
        senku.log(`❌ ${cookieName} signDay - 签到失败: ${e}`)
        senku.log(`❌ ${cookieName} signDay - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function navCoin() {
  return new Promise((resolve, reject) => {
    const url = { url: navCoinVal, headers: { 'Host': 'api.1sapp.com', 'X-Tk': signXTKVal } }
    url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
    senku.get(url, (error, response, data) => {
      try {
        senku.log(`❕ ${cookieName} navCoin - response: ${JSON.stringify(response)}`)
        signinfo.navCoin = JSON.parse(data)
        resolve()
      } catch (e) {
        senku.msg(cookieName, `签到结果: 失败`, `说明: ${e}`)
        senku.log(`❌ ${cookieName} navCoin - 签到失败: ${e}`)
        senku.log(`❌ ${cookieName} navCoin - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function read() {
  return new Promise((resolve, reject) => {
    const url = { url: readVal, headers: { 'Host': 'api.1sapp.com', 'X-Tk': signXTKVal } }
    url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
    senku.get(url, (error, response, data) => {
      try {
        senku.log(`❕ ${cookieName} signDay - response: ${JSON.stringify(response)}`)
        signinfo.read = JSON.parse(data)
        resolve()
      } catch (e) {
        senku.msg(cookieName, `签到结果: 失败`, `说明: ${e}`)
        senku.log(`❌ ${cookieName} signDay - 签到失败: ${e}`)
        senku.log(`❌ ${cookieName} signDay - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

// FIXME: 时段请求偶尔丢失或伪请求
function signHour() {
  return new Promise((resolve, reject) => {
    const url = { url: hourUrlVal, headers: { 'Host': 'api.1sapp.com', 'X-Tk': signXTKVal } }
    senku.get(url, (error, response, data) => {
      try {
        senku.log(`❕ ${cookieName} signHour - response: ${JSON.stringify(response)}`)
        signinfo.signHour = JSON.parse(data)
        resolve()
      } catch (e) {
        senku.msg(cookieName, `签到结果: 失败`, `说明: ${e}`)
        senku.log(`❌ ${cookieName} signHour - 签到失败: ${e}`)
        senku.log(`❌ ${cookieName} signHour - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function signLucky() {
  return new Promise((resolve, reject) => {

    const luckyUrlVal = 'https://qtt-turntable.qutoutiao.net/press_trigger?version=30967000&xhi=200' + signVal
    const url = { url: luckyUrlVal, headers: { "Host": "qtt-turntable.qutoutiao.net", 'X-Tk': signXTKKey } }
    senku.get(url, (error, response, data) => {
      try {
        senku.log(`❕ ${cookieName} signLucky - response: ${JSON.stringify(response)}`)
        signinfo.signLucky = JSON.parse(data)
        resolve()
      } catch (e) {
        senku.msg(cookieName, `幸运转盘: 失败`, `说明: ${e}`)
        senku.log(`❌ ${cookieName} signLucky - 幸运转盘失败: ${e}`)
        senku.log(`❌ ${cookieName} signLucky - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function getinfo() {
  return new Promise((resolve, reject) => {
    const url = { url: getinfoUrlVal, headers: { 'Host': 'api.1sapp.com', 'X-Tk': signXTKKey } }
    senku.get(url, (error, response, data) => {
      try {
        senku.log(`❕ ${cookieName} getinfo - response: ${JSON.stringify(response)}`)
        signinfo.info = JSON.parse(data)
        resolve()
      } catch (e) {
        senku.msg(cookieName, `签到结果: 失败`, `说明: ${e}`)
        senku.log(`❌ ${cookieName} getinfo - 签到失败: ${e}`)
        senku.log(`❌ ${cookieName} getinfo - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function getcoininfo() {
  return new Promise((resolve, reject) => {
    const url = { url: coinUrlVal, headers: { 'Host': 'api.1sapp.com', 'X-Tk': signXTKKey } }
    senku.get(url, (error, response, data) => {
      try {
        senku.log(`❕ ${cookieName} getcoininfo - response: ${JSON.stringify(response)}`)
        signinfo.coininfo = JSON.parse(data)
        resolve()
      } catch (e) {
        senku.msg(cookieName, `签到结果: 失败`, `说明: ${e}`)
        senku.log(`❌ ${cookieName} getcoininfo - 签到失败: ${e}`)
        senku.log(`❌ ${cookieName} getcoininfo - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function playone() {
  return new Promise((resolve, reject) => {
    const urlParameter = 'https://api.1sapp.com/sign/adDone?version=30967000&xhi=200&pos=two' + signVal
    const url = { url: urlParameter, headers: { 'Host': 'api.1sapp.com', 'X-Tk': signXTKKey } }
    url.headers['User-Agent'] = 'Mozilla / 5.0(iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit / 605.1.15(KHTML, like Gecko) Mobile / 15E148'
    senku.get(url, (error, response, data) => {
      try {
        senku.log(`❕ ${cookieName} playAd - response: ${JSON.stringify(response)}`)
        signinfo.playList.push(JSON.parse(data))
        resolve()
      } catch (e) {
        senku.msg(cookieName, `签到结果: 失败`, `说明: ${e}`)
        senku.log(`❌ ${cookieName} playAd - 签到失败: ${e}`)
        senku.log(`❌ ${cookieName} playAd - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function playtwo() {
  return new Promise((resolve, reject) => {
    const urlParameter = 'https://api.1sapp.com/sign/adDone?version=30967000&xhi=200&pos=two' + signVal
    const url = { url: urlParameter, headers: { 'Host': 'api.1sapp.com', 'X-Tk': signXTKKey } }
    url.headers['User-Agent'] = 'Mozilla / 5.0(iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit / 605.1.15(KHTML, like Gecko) Mobile / 15E148'
    senku.get(url, (error, response, data) => {
      try {
        senku.log(`❕ ${cookieName} playAd - response: ${JSON.stringify(response)}`)
        signinfo.playList.push(JSON.parse(data))
        resolve()
      } catch (e) {
        senku.msg(cookieName, `签到结果: 失败`, `说明: ${e}`)
        senku.log(`❌ ${cookieName} playAd - 签到失败: ${e}`)
        senku.log(`❌ ${cookieName} playAd - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function playthree() {
  return new Promise((resolve, reject) => {
    const urlParameter = 'https://api.1sapp.com/sign/adDone?version=30967000&xhi=200&pos=three' + signVal
    const url = { url: urlParameter, headers: { 'Host': 'api.1sapp.com', 'X-Tk': signXTKKey } }
    url.headers['User-Agent'] = 'Mozilla / 5.0(iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit / 605.1.15(KHTML, like Gecko) Mobile / 15E148'
    senku.get(url, (error, response, data) => {
      try {
        senku.log(`❕ ${cookieName} playAd - response: ${JSON.stringify(response)}`)
        signinfo.playList.push(JSON.parse(data))
        resolve()
      } catch (e) {
        senku.msg(cookieName, `签到结果: 失败`, `说明: ${e}`)
        senku.log(`❌ ${cookieName} playAd - 签到失败: ${e}`)
        senku.log(`❌ ${cookieName} playAd - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function playfour() {
  return new Promise((resolve, reject) => {
    const urlParameter = 'https://api.1sapp.com/sign/adDone?version=30967000&xhi=200&pos=four' + signVal
    const url = { url: urlParameter, headers: { 'Host': 'api.1sapp.com', 'X-Tk': signXTKKey } }
    url.headers['User-Agent'] = 'Mozilla / 5.0(iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit / 605.1.15(KHTML, like Gecko) Mobile / 15E148'
    senku.get(url, (error, response, data) => {
      try {
        senku.log(`❕ ${cookieName} playAd - response: ${JSON.stringify(response)}`)
        signinfo.playList.push(JSON.parse(data))
        resolve()
      } catch (e) {
        senku.msg(cookieName, `签到结果: 失败`, `说明: ${e}`)
        senku.log(`❌ ${cookieName} playAd - 签到失败: ${e}`)
        senku.log(`❌ ${cookieName} playAd - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}


// 将时间戳格式化
function tTime(timestamp) {
  const date = new Date(timestamp * 1000)
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = (date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  const h = date.getHours() + ':'
  const m = (date.getMinutes() + 1 < 10 ? '0' + (date.getMinutes() + 1) : date.getMinutes() + 1) + ''
  return M + D + h + m
}

function showmsg() {
  let subTitle = ''
  let detail = ''
  let moreDetail = ''
  // signDayMsg
  if (signinfo.info && signinfo.info.data.signIn.today == 1) {
    if (signinfo.signDay.code == 0) {
      const continuation = signinfo.info.data.signIn.continuation
      const amount = signinfo.info.data.signIn.amount
      const currentCoin = amount[continuation]
      const nextCoin = amount[continuation + 1]
      const coins = signinfo.info.data.show_balance_info.coins
      subTitle = '每日:✅'
      detail += detail == '' ? '' : ', '
      detail += `【每日签到】获得${currentCoin}💰,明日可得${nextCoin}💰\n`
    }
    else subTitle = '每日:🔄'
  } else {
    subTitle = '每日:❌'
    senku.log(`❌ ${cookieName} showmsg - 每日签到: ${JSON.stringify(signinfo.signDay)}`)
  }

  // signHourMsg
  subTitle += subTitle == '' ? '' : ', '
  if (signinfo.signHour && signinfo.signHour.code == 0) {
    subTitle += '时段:✅'
    detail += detail == '' ? '' : ','
    const amount = signinfo.signHour.data.amount
    const next_time = tTime(signinfo.signHour.data.next_time)
    detail += `【时段签到】获得${amount}💰,下次签到:${next_time}\n`
  } else subTitle += '时段:🔕'

  // readMsg
  detail += detail == '' ? '' : ','
  if (signinfo.read && signinfo.read.data.status_code == 0) {
    if (signinfo.coininfo.data) {
      const desc = signinfo.coininfo.data.content_config.desc
      detail += `【阅读详情】${desc},手动获取金币\n`
    }
  } else detail += '【阅读详情】失败\n'

  // navCoinMsg
  if (signinfo.navCoin && signinfo.navCoin.code == 0) {
    if (signinfo.coininfo.data) {
      const cur_amount = signinfo.navCoin.data.cur_amount
      const total_times = signinfo.navCoin.data.total_times
      const done_times = signinfo.navCoin.data.done_times
      detail += `【首页奖励】${cur_amount}💰,完成${done_times}/${total_times}\n`
    }
  } else if (signinfo.navCoin && signinfo.navCoin.code == -308) {
    detail += `【首页奖励】时间未到\n`
  } else if (signinfo.navCoin && signinfo.navCoin.code == -2) {
    detail += `【首页奖励】Cookie失效\n`
  } else detail += '【首页奖励】失败或Cookie不存在\n'

  // signLuckyMsg
  subTitle += subTitle == '' ? '' : ', '
  if (signinfo.signLucky && signinfo.signLucky.code == 1) {
    subTitle += `幸运转盘:✅`
    detail += detail == '' ? '' : ','
    const amount_coin = signinfo.signLucky.amount_coin
    const count = signinfo.signLucky.count
    const count_limit = signinfo.signLucky.count_limit
    detail += `【幸运转盘】获得${amount_coin},抽奖情况:${count}/${count_limit}次\n`
  } else subTitle += `转盘:次数上限`
  // playAdsMsg
  subTitle += subTitle == '' ? '' : ', '
  if (signinfo.playList) {
    subTitle += '广告:✅'

    const icon = signinfo.info.data.signIn.ext_ad.icon
    const coins = signinfo.info.data.show_balance_info.coins
    const continuation = signinfo.info.data.signIn.continuation
    for (const poss of icon) {
      const time = tTime(poss.next_time)
      detail += `【视频广告】下次🕥${time} 可获得${poss.amount}💰\n`
    }
    detail += `【账户详情】共计:${coins}💰,连续签到${continuation}天`
  } else subTitle += '广告:❌'

  senku.msg(cookieName, subTitle, detail)
  senku.done()
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
