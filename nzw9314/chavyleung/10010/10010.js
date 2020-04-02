const chavy = init()
const cookieName = '中国联通'
const KEY_loginurl = 'chavy_tokenurl_10010'
const KEY_loginheader = 'chavy_tokenheader_10010'
const KEY_signurl = 'chavy_signurl_10010'
const KEY_signheader = 'chavy_signheader_10010'
const KEY_loginlotteryurl = 'chavy_loginlotteryurl_10010'
const KEY_loginlotteryheader = 'chavy_loginlotteryheader_10010'
const KEY_findlotteryurl = 'chavy_findlotteryurl_10010'
const KEY_findlotteryheader = 'chavy_findlotteryheader_10010'

const signinfo = {}
let VAL_loginurl = chavy.getdata(KEY_loginurl)
let VAL_loginheader = chavy.getdata(KEY_loginheader)
let VAL_signurl = chavy.getdata(KEY_signurl)
let VAL_signheader = chavy.getdata(KEY_signheader)
let VAL_loginlotteryurl = chavy.getdata(KEY_loginlotteryurl)
let VAL_loginlotteryheader = chavy.getdata(KEY_loginlotteryheader)
let VAL_findlotteryurl = chavy.getdata(KEY_findlotteryurl)
let VAL_findlotteryheader = chavy.getdata(KEY_findlotteryheader)

;(sign = async () => {
  chavy.log(`🔔 ${cookieName}`)
  await loginapp()
  await signapp()
  if (VAL_loginlotteryurl && VAL_findlotteryurl) await loginlottery()
  if (signinfo.encryptmobile) {
    await findlottery()
    if (signinfo.findlottery && signinfo.findlottery.acFrequency && signinfo.findlottery.acFrequency.usableAcFreq) {
      for (let i = 0; i < signinfo.findlottery.acFrequency.usableAcFreq; i++) {
        await lottery()
      }
    }
  }
  await getinfo()
  showmsg()
  chavy.done()
})().catch((e) => chavy.log(`❌ ${cookieName} 签到失败: ${e}`), chavy.done())

function loginapp() {
  return new Promise((resolve, reject) => {
    const url = { url: VAL_loginurl, headers: JSON.parse(VAL_loginheader) }
    chavy.post(url, (error, response, data) => {
      try {
        updateSignAppCookies(response.headers['Set-Cookie'])
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `登录结果: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} loginapp - 登录失败: ${e}`)
        chavy.log(`❌ ${cookieName} loginapp - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function updateSignAppCookies(respcookie) {
  if (VAL_signheader) {
    const OBJ_signheader = JSON.parse(VAL_signheader)
    let signcookie = OBJ_signheader['Cookie']
    signcookie = signcookie.replace(/route5=([^;]*)/, respcookie.match(/route5=([^;]*)/)[0])
    signcookie = signcookie.replace(/JSESSIONID=([^;]*)/, respcookie.match(/JSESSIONID=([^;]*)/)[0])
    OBJ_signheader['Cookie'] = signcookie
    VAL_signheader = JSON.stringify(OBJ_signheader)
  } else {
    chavy.log(`⚠ ${cookieName} updateSignAppCookies: 请先获取 Cookies`)
  }
}

function updateLotteryAppCookies(respcookie) {
  if (VAL_lotteryheader) {
    const OBJ_lotteryheader = JSON.parse(VAL_lotteryheader)
    let lotterycookie = OBJ_lotteryheader['Cookie']
    lotterycookie = lotterycookie.replace(/route5=([^;]*)/, respcookie.match(/route5=([^;]*)/)[0])
    lotterycookie = lotterycookie.replace(/JSESSIONID=([^;]*)/, respcookie.match(/JSESSIONID=([^;]*)/)[0])
    OBJ_lotteryheader['Cookie'] = lotterycookie
    VAL_lotteryheader = JSON.stringify(OBJ_lotteryheader)
  } else {
    chavy.log(`⚠ ${cookieName} updatelotteryAppCookies: 请先获取 Cookies`)
  }
}

function signapp() {
  return new Promise((resolve, reject) => {
    const url = { url: VAL_signurl, body: '{}', headers: JSON.parse(VAL_signheader) }
    chavy.post(url, (error, response, data) => {
      try {
        signinfo.signapp = JSON.parse(data)
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `签到结果: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} signapp - 签到失败: ${e}`)
        chavy.log(`❌ ${cookieName} signapp - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function loginlottery() {
  return new Promise((resolve, reject) => {
    const url = { url: VAL_loginlotteryurl, headers: JSON.parse(VAL_loginlotteryheader) }
    chavy.get(url, (error, response, data) => {
      try {
        const encryptmobileMatch = data.match(/encryptmobile=([^('|")]*)/)
        if (encryptmobileMatch) {
          signinfo.encryptmobile = encryptmobileMatch[1]
          chavy.log(`❌ ${cookieName} loginlottery - encryptmobile: ${signinfo.encryptmobile}`)
        } else {
          chavy.msg(cookieName, `获取抽奖令牌: 失败`, `说明: ${e}`)
          chavy.log(`❌ ${cookieName} loginlottery - 获取抽奖令牌失败: ${e}`)
          chavy.log(`❌ ${cookieName} loginlottery - response: ${JSON.stringify(response)}`)
        }
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `登录抽奖: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} loginlottery - 登录抽奖失败: ${e}`)
        chavy.log(`❌ ${cookieName} loginlottery - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function findlottery() {
  return new Promise((resolve, reject) => {
    chavy.log(`❌ ${cookieName} findlottery - OLD - VAL_findlotteryurl: ${VAL_findlotteryurl}}`)
    VAL_findlotteryurl = VAL_findlotteryurl.replace(/encryptmobile=[^(&|$)]*/, `encryptmobile=${signinfo.encryptmobile}`)
    VAL_findlotteryurl = VAL_findlotteryurl.replace(/mobile=[^(&|$)]*/, `mobile=${signinfo.encryptmobile}`)
    chavy.log(`❌ ${cookieName} findlottery - NEW - VAL_findlotteryurl: ${VAL_findlotteryurl}}`)
    const url = { url: VAL_findlotteryurl, headers: JSON.parse(VAL_findlotteryheader) }
    chavy.get(url, (error, response, data) => {
      try {
        chavy.log(`❌ ${cookieName} findlottery - response: ${JSON.stringify(response)}`)
        signinfo.findlottery = JSON.parse(data)
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `获取抽奖次数: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} findlottery - 获取抽奖次数失败: ${e}`)
        chavy.log(`❌ ${cookieName} findlottery - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function lottery() {
  return new Promise((resolve, reject) => {
    const url = { url: `https://m.client.10010.com/dailylottery/static/doubleball/choujiang?usernumberofjsp=${signinfo.encryptmobile}`, headers: JSON.parse(VAL_loginlotteryheader) }
    url.headers['Referer'] = `https://m.client.10010.com/dailylottery/static/doubleball/firstpage?encryptmobile=${signinfo.encryptmobile}`
    chavy.post(url, (error, response, data) => {
      try {
        chavy.log(`❌ ${cookieName} lottery - response: ${JSON.stringify(response)}`)
        signinfo.lotterylist = signinfo.lotterylist ? signinfo.lotterylist : []
        signinfo.lotterylist.push(JSON.parse(data))
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `抽奖结果: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} lottery - 抽奖失败: ${e}`)
        chavy.log(`❌ ${cookieName} lottery - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function gettel() {
  const reqheaders = JSON.parse(VAL_signheader)
  const reqreferer = reqheaders.Referer
  const reqCookie = reqheaders.Cookie
  let tel = ''
  if (reqreferer.indexOf(`desmobile=`) >= 0) tel = reqreferer.match(/desmobile=(.*?)(&|$)/)[1]
  if (tel == '' && reqCookie.indexOf(`u_account=`) >= 0) tel = reqCookie.match(/u_account=(.*?);/)[1]
  return tel
}

function getinfo() {
  return new Promise((resolve, reject) => {
    const url = { url: `https://mina.10010.com/wxapplet/bind/getIndexData/alipay/alipaymini?user_id=${gettel()}` }
    chavy.get(url, (error, response, data) => {
      try {
        signinfo.info = JSON.parse(data)
        resolve()
      } catch (e) {
        chavy.msg(cookieName, `获取余量: 失败`, `说明: ${e}`)
        chavy.log(`❌ ${cookieName} getinfo - 获取余量失败: ${e}`)
        chavy.log(`❌ ${cookieName} getinfo - response: ${JSON.stringify(response)}`)
        resolve()
      }
    })
  })
}

function showmsg() {
  let subTitle = ''
  let detail = ''
  let signday = ''

  // 签到结果
  if (signinfo.signapp.msgCode == '0000') {
    subTitle = `签到: 成功`
    signday = `; 连签: ${signinfo.signapp.continuCount}天`
    detail = `连签: ${signinfo.signapp.continuCount}天, 积分: +${signinfo.signapp.prizeCount}`
  } else if (signinfo.signapp.msgCode == '0008') {
    subTitle = `签到: 重复`
  } else {
    subTitle = `签到: 失败`
  }

  if (signinfo.info.code == '0000') {
    // 基本信息
    subTitle += signday
    detail = detail ? `${detail}\n` : ``
    const free = signinfo.info.dataList[0]
    const flow = signinfo.info.dataList[1]
    const voice = signinfo.info.dataList[2]
    detail = `话费: ${free.number}${free.unit}, 已用: ${flow.number}${flow.unit}, 剩余: ${voice.number}${voice.unit}`
  }

  if (signinfo.findlottery && signinfo.findlottery.acFrequency && signinfo.lotterylist) {
    subTitle += `; 抽奖: ${signinfo.findlottery.acFrequency.usableAcFreq}次`
    detail += '\n查看抽奖详情\n'

    for (let i = 0; i < signinfo.findlottery.acFrequency.usableAcFreq; i++) {
      detail += `\n抽奖 (${i}): ${signinfo.lotterylist[i].RspMsg}`
    }
  }

  // 详细信息
  // if (signinfo.detail.code == '0000') {
  // }

  chavy.msg(cookieName, subTitle, detail)
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
