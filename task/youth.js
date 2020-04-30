const CookieName = "中青看点"
const signurlKey ='youthurl_zq'
const signheaderKey = 'youthheader_zq'
const sy = init()
const signheaderVal = sy.getdata(signheaderKey); 

let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie()
} else {
   all()
}

function GetCookie() {
   if ($request && $request.method != `OPTIONS`) {
   const signheaderVal = JSON.stringify($request.headers);
    if (signheaderVal)        sy.setdata(signheaderVal,signheaderKey)
    sy.log(`[${CookieName}] 获取Cookie: 成功,signheaderVal: ${signheaderVal}`)
     sy.msg(CookieName, `获取Cookie: 成功🎉`, ``)
  }
 }
 
async function all() 
{ 
  await sign();
  await signInfo();
}

function sign() {      
  return new Promise((resolve, reject) =>
   {
    const url = { 
      url: 'https://kd.youth.cn/TaskCenter/sign', 
      headers: JSON.parse(signheaderVal),
}
     sy.get(url, (error, response, data) =>
 {
      sy.log(`${CookieName}, data: ${data}`)
       signresult =JSON.parse(data)
       if (signresult.status == 1){
          subTitle = `签到成功🎉`
          detail= `获取金币: ${signresult.score}，明日金币:${signresult.nextScore} `
           }
       else if(signresult.status == 0){
          subTitle = `重复签到`
          detail= ``
         }
       })
resolve()
     })
  }
      
function signInfo() {      
  return new Promise((resolve, reject) =>
   {
    const url = { 
      url: 'https://kd.youth.cn/TaskCenter/getSign', 
      headers: JSON.parse(signheaderVal),
}
   sy.post(url, (error, response, data) =>
 {
     sy.log(`${CookieName}, data: ${data}`)
      signinfo =JSON.parse(data)
      if (signinfo.status == 1){
         subTitle += `  总计: ${signinfo.data.user.score}个青豆`
         detail += `账户昵称: ${signinfo.data.user.nickname}  已签到: ${signinfo.data.total_day}天，签到获得${signinfo.data.sign_score}个青豆`
           }
       else {
          subTitle = `${signinfo.msg}`
          detail= ``
         }

      sy.msg(CookieName,subTitle,detail)
resolve()
       })
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
        url.method = `GET`
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

