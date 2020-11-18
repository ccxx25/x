/* 本脚本数据从电视家数据库获取

[task_local]
1 10 * * * tvpreview.js

By Macsuny
                   
*/
var c = "cctv1"  // 从电视家网络活动中获取，央视可以直接改后缀数字
var wurl = {
    url: "http://api.cntv.cn/epg/epginfo?serviceId=cbox&c="+c,
};
   $task.fetch(wurl).then(response => {    
      let result = JSON.parse(response.body)
      var i = 0                          
      const title = `${result[`${c}`].channelName}节目预告`
      subTitle = `正在播出: ${result[`${c}`].isLive}`
      detail = `${result[`${c}`].program[i].showTime} ${result[`${c}`].program[i].t}`
      
for (i=0; i< result[`${c}`].program.length;i++){
  detail += `\n${result[`${c}`].program[i].showTime} ${result[`${c}`].program[i].t}`}

$notify(title, subTitle, detail)
     })
$done()

