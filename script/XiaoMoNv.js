/* Quantumult X 脚本:小魔女破解付费房 （By 凉意） 小魔女下载链接 :https://bz6.xyz/?oem=7506bab5fe133526
下载备用：https://bj6.xyz/?oem=7506bab5fe133526
https://sf6.xyz/?oem=7506bab5fe133526
TG频道:https://t.me/liangyiA
[rewrite_local]
#小魔女破解付费房
^http:\/\/m\.xmn\d+\.com\/xmn\/live\/room\/intoRoom\/* url script-response-body XiaoMoNv.js
hostname = m.*.com
*/
let obj = JSON.parse($response.body);
obj.state = 0; 
obj.content = {}
$done({body: JSON.stringify(obj)});