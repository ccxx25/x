
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
                        response.body = data;
                        resolve(response, {
                            error: error
                        });
                    })
                } else {
                    $httpClient.get(url, (error, response, data) => {
                        response.body = data;
                        resolve(response, {
                            error: error
                        });
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
/*
README：https://github.com/yichahucha/surge/tree/master
 */

const console_log = true
const url = $request.url
const body = $response.body

if (true) {
    let obj = JSON.parse(body)
    let apiStack = obj.data.apiStack[0]
    let value = JSON.parse(apiStack.value)
    let tradeConsumerProtection = value.global.data.tradeConsumerProtection
    if (!tradeConsumerProtection) {
        value.global.data["tradeConsumerProtection"] = customTradeConsumerProtection()
    }
    tradeConsumerProtection = value.global.data.tradeConsumerProtection
    let service = tradeConsumerProtection.tradeConsumerService.service
    let nonService = tradeConsumerProtection.tradeConsumerService.nonService

    let item = obj.data.item
    let shareUrl = `https://item.taobao.com/item.htm?id=${item.itemId}`

    request_hsitory_price(shareUrl, function (data) {
        if (data) {
            let historyItem = getHistoryItem()
            if (data.ok == 1 && data.single) {
                const lower_price = lower_price_msg(data.single)
                const result = history_price_item(data.single)
                const tbitems = result[1]
                service.items = service.items.concat(nonService.items)
                historyItem.desc = lower_price
                service.items.push(historyItem)
                nonService.title = "价格走势"
                nonService.items = tbitems
            }
            if (data.ok == 0 && data.msg.length > 0) {
                historyItem.desc = data.msg
                service.items.push(historyItem)
            }
            apiStack.value = JSON.stringify(value)
            $done({ body: JSON.stringify(obj) })
        } else {
            $done({ body })
        }
    })
}

function lower_price_msg(data) {
    const lower = data.lowerPriceyh;
    const lower_date = changeDateFormat(data.lowerDateyh);
    const lower_msg = "历史最低到手价:   ¥" + String(lower) + "   " + lower_date
    const curret_msg = (data.currentPriceStatus ? "   当前价格" + data.currentPriceStatus : "") + "   (仅供参考)";
    return lower_msg + curret_msg;
}

function history_price_item(data) {
    const rex_match = /\[.*?\]/g;
    const rex_exec = /\[(.*),(.*),"(.*)"\]/;
    const list = data.jiagequshiyh.match(rex_match);
    let tbitems = [];
    let start_date = "";
    let end_date = "";

    list.reverse().forEach((item, index) => {
        if (item.length > 0) {
            const result = rex_exec.exec(item);
            const dateUTC = new Date(eval(result[1]));
            const date = dateUTC.format("yyyy-MM-dd");
            if (index == 0) {
                end_date = date;
            }
            if (index == list.length - 1) {
                start_date = date;
            }
            let price = result[2];
            price = "¥" + String(parseFloat(price));
            const msg = date + get_blank_space(50 - date.length) + price;
            tbitem = {
                icon: "https://s2.ax1x.com/2020/01/03/lU2AYD.png",
                title: msg
            }
            tbitems.push(tbitem);
        }
    });
    const date_range_msg = `(${start_date} ~ ${end_date})`;
    return [date_range_msg, tbitems]
}

function request_hsitory_price(share_url, callback) {
    const options = {
        url: "https://apapia-history.manmanbuy.com/ChromeWidgetServices/WidgetServices.ashx",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 - mmbWebBrowse - ios"
        },
        body: "methodName=getBiJiaInfo_wxsmall&p_url=" + encodeURIComponent(share_url)
    }
    $httpClient.post(options, function (error, response, data) {
        if (!error) {
            callback(JSON.parse(data));
            if (console_log) console.log("Data:\n" + data);
        } else {
            callback(null, null);
            if (console_log) console.log("Error:\n" + error);
        }
    })
}

function changeDateFormat(cellval) {
    const date = new Date(parseInt(cellval.replace("/Date(", "").replace(")/", ""), 10));
    const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    const currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return date.getFullYear() + "-" + month + "-" + currentDate;
}

function get_blank_space(length) {
    let blank = "";
    for (let index = 0; index < length; index++) {
        blank += " ";
    }
    return blank;
}

function getHistoryItem() {
    return {
        icon: "https://s2.ax1x.com/2020/01/03/lU2Pw6.png",
        title: "历史价格",
        desc: ""
    }
}

function customTradeConsumerProtection() {
    return {
        "tradeConsumerService": {
            "service": {
                "items": [
                ],
                "icon": "",
                "title": "基础服务"
            },
            "nonService": {
                "items": [
                ],
                "title": "其他"
            }
        },
        "passValue": "all",
        "url": "https://h5.m.taobao.com/app/detailsubpage/consumer/index.js",
        "type": "0"
    }
}

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

Date.prototype.format = function (fmt) {
    var o = {
        "y+": this.getFullYear(),
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            if (k == "y+") {
                fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
            }
            else if (k == "S+") {
                var lens = RegExp.$1.length;
                lens = lens == 1 ? 3 : lens;
                fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1, lens));
            }
            else {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
    }
    return fmt;
}
