/*
[rewrite_local]
^https?:\/\/tieba.baidu\.com url script-response-body cookie_baidu_tieba.js
[mitm]
hostname = tieba.baidu.com
[task_local]
0 9 * * * sign_baidu_tieba_v2.js
配置完毕后,请关闭然后再打开qx,然后手机访问https://tieba.baidu.com ,等待弹出cookie写入成功提示后即可
 */
var cookieVal = $prefs.valueForKey("CookieTB");
var singleNotifyCount = 30; //想签到几个汇总到一个通知里,这里就填几个(比如我有13个要签到的,这里填了5,就会分三次消息通知过去)
var process = {
    total: 0,
    result: [
        // {
        //     bar:'',
        //     level:0,
        //     exp:0,
        //     errorCode:0,
        //     errorMsg:''
        // }
    ]
};
var url_fetch_sign = {
    url: "https://tieba.baidu.com/mo/q/newmoindex",
    headers: {
        "Content-Type": "application/octet-stream",
        Referer: "https://tieba.baidu.com/index/tbwise/forum",
        Cookie: cookieVal,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366"
    }
};
var url_fetch_add = {
    url: "https://tieba.baidu.com/sign/add",
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookieVal,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_1 like Mac OS X; zh-CN) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/14B100 UCBrowser/10.7.5.650 Mobile"
    },
    body: ""
};

function signTieBa() {
    if (!cookieVal) {
        $notify("贴吧签到", "签到失败", "未获取到cookie");
        return;
    }
    $task.fetch(url_fetch_sign).then(response => {
        // $notify("贴吧签到", "贴吧列表", response.body);
        var body = JSON.parse(response.body);
        var isSuccessResponse = body && body.no == 0 && body.error == "success" && body.data.tbs;
        if (!isSuccessResponse) {
            $notify("贴吧签到", "签到失败", (body && body.error) ? body.error : "接口数据获取失败");
            return;
        }
        process.total = body.data.like_forum.length;
        if (body.data.like_forum && body.data.like_forum.length > 0) {
            for (const bar of body.data.like_forum) {
                signBar(bar, body.data.tbs);
            }
        } else {
            $notify("贴吧签到", "签到失败", "请确认您有关注的贴吧");
            return;
        }
    }, reason => {
        $notify("贴吧签到", "签到失败", "未获取到签到列表");
    });
}

function signBar(bar, tbs) {
    if (bar.is_sign == 1) { //已签到的,直接不请求接口了
        process.result.push({
            bar: `${bar.forum_name}`,
            level: bar.user_level,
            exp: bar.user_exp,
            errorCode: 9999,
            errorMsg: "已签到"
        });
        checkIsAllProcessed();
    } else {
        url_fetch_add.body = `tbs=${tbs}&kw=${bar.forum_name}&ie=utf-8`;
        $task.fetch(url_fetch_add).then(response => {
            try{
                var addResult = JSON.parse(response.body);
            if (addResult.no == 0) {
                process.result.push({
                    bar: bar.forum_name,
                    errorCode: 0,
                    errorMsg: `获得${addResult.data.uinfo.cont_sign_num}积分,第${addResult.data.uinfo.user_sign_rank}个签到`
                });
            } else {
                process.result.push({
                    bar: bar.forum_name,
                    errorCode: addResult.no,
                    errorMsg: addResult.error
                });
            }
            }catch(e){
                $notify("贴吧签到", "贴吧签到数据处理异常", JSON.stringify(e));
            }
            checkIsAllProcessed();
        }, reason => {
            process.result.push({
                bar: bar.forum_name,
                errorCode: 999,
                errorMsg: '接口错误'
            });
            checkIsAllProcessed();
        });
    }
}

function checkIsAllProcessed() {
    if (process.result.length != process.total) return;
    for (var i = 0; i < Math.ceil(process.total / singleNotifyCount); i++) {
        var notify = "";
        var spliceArr = process.result.splice(0, singleNotifyCount);
        var notifySuccessCount = 0;
        for (const res of spliceArr) {
            if (res.errorCode == 0 || res.errorCode == 9999) {
                notifySuccessCount++;
            }
            if (res.errorCode == 9999) {
                notify += `【${res.bar}】已经签到，当前等级${res.level},经验${res.exp}
`;
            } else {
                notify += `【${res.bar}】${res.errorCode==0?'签到成功':'签到失败'}，${res.errorCode==0?res.errorMsg:('原因：'+res.errorMsg)}
`;
            }
        }
        $notify("贴吧签到", `签到${spliceArr.length}个,成功${notifySuccessCount}个`, notify);
    }
}

signTieBa()