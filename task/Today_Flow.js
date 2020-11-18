/*
    本作品用于QuantumultX和Surge之间js执行方法的转换
    您只需书写其中任一软件的js,然后在您的js最【前面】追加上此段js即可
    无需担心影响执行问题,具体原理是将QX和Surge的方法转换为互相可调用的方法
    尚未测试是否支持import的方式进行使用,因此暂未export
    如有问题或您有更好的改进方案,请前往 https://github.com/sazs34/TaskConfig/issues 提交内容,或直接进行pull request
    您也可直接在tg中联系@wechatu
*/
// #region 固定头部
let isQuantumultX = $task !== undefined; //判断当前运行环境是否是qx
let isSurge = $httpClient !== undefined; //判断当前运行环境是否是surge
// http请求
var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};
// cookie读写
var $prefs = isQuantumultX ? $prefs : {};
var $persistentStore = isSurge ? $persistentStore : {};
// 消息通知
var $notify = isQuantumultX ? $notify : {};
var $notification = isSurge ? $notification : {};
// #endregion 固定头部

// #region 网络请求专用转换
if (isQuantumultX) {
    var errorInfo = {
        error: ''
    };
    $httpClient = {
        get: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        },
        post: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            url.method = 'POST';
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        }
    }
}
if (isSurge) {
    $task = {
        fetch: url => {
            //为了兼容qx中fetch的写法,所以永不reject
            return new Promise((resolve, reject) => {
                if (url.method == 'POST') {
                    $httpClient.post(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                } else {
                    $httpClient.get(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                }
            })

        }
    }
}
// #endregion 网络请求专用转换

// #region cookie操作
if (isQuantumultX) {
    $persistentStore = {
        read: key => {
            return $prefs.valueForKey(key);
        },
        write: (val, key) => {
            return $prefs.setValueForKey(val, key);
        }
    }
}
if (isSurge) {
    $prefs = {
        valueForKey: key => {
            return $persistentStore.read(key);
        },
        setValueForKey: (val, key) => {
            return $persistentStore.write(val, key);
        }
    }
}
// #endregion

// #region 消息通知
if (isQuantumultX) {
    $notification = {
        post: (title, subTitle, detail) => {
            $notify(title, subTitle, detail);
        }
    }
}
if (isSurge) {
    $notify = function (title, subTitle, detail) {
        $notification.post(title, subTitle, detail);
    }
}
// #endregion



/* Today_Flow  (Made by Meeta)

本脚本旨在获取机场流量使用详情
请在下方填入节点订阅链接和机场名（Ps：链接需支持Quantumult 显示流量使用情况）

使用建议：
每日自动获取显示 + 手动执行脚本
Surge配置文件示例(可能需要自己修改本地脚本路径)
# Today_Flow
Today_Flow.js = debug=1,script-path=Script/Today_Flow.js,cronexp="0 0 8,20 * * *",type=cron


TG频道:@meetashare
*/



const link1 = "https://v2.upcloud.icu/link/Ei8yeCHz07sFP6n8?sub=3";
const name1 = "尚云☁️";
$httpClient.get(link1, function(error, response, data){
    if(error){
    console.log(error);
    $done();
  }else{
    var obj = response;
    var userinfo = obj["headers"]["subscription-userinfo"];
    //console.log(userinfo);
    var upload_k = Number(userinfo.match(/upload=\d+/g)[0].match(/\d+/g)[0]);
    var download_k = Number(userinfo.match(/download=\d+/g)[0].match(/\d+/g)[0]);
    var total_k = Number(userinfo.match(/total=\d+/g)[0].match(/\d+/g)[0]);
    var residue_m = (total_k/1048576-download_k/1048576-upload_k/1048576);
    var residue = residue_m.toFixed(2).toString();
    var dnow = new Date().getTime().toString();
    var utime = (dnow-$persistentStore.read("o_now"));
    var todayflow = $persistentStore.read("today_flow")-residue;
    $persistentStore.write(residue,"today_flow");
    $persistentStore.write(dnow,"o_now");
    var title = name1+" 剩余流量 ：" + (residue_m/1024).toFixed(2) + " G";
    console.log(title);
    var hutime = parseInt(utime/3600000);
    var mutime = (utime/60000)%60;
    if(hutime==0){var subtitle = "在过去的"+ mutime.toFixed(1) +"分钟内使用了：" + todayflow.toFixed(2) + " M流量";
    }else{var subtitle = "在过去的" + hutime +"时 "+ mutime.toFixed(1) +"分钟内使用了：" + todayflow.toFixed(2) + " M流量";};
    console.log(subtitle);
    var mation = "Total_Upload : " + (upload_k/1073741824).toFixed(2) + " G" + "\n" + "Total_Download : " + (download_k/1073741824).toFixed(2) + " G";
    console.log(mation);
    $notification.post(title, subtitle,mation );
    $done();
  };
}
);

