/*  
微信公众号：ios黑科技
官方网站：s7aa.cn

[rewrite_local]

#易学视频去广告（新袋熊兼容TF袋熊）
^http:\/\/(aws1|(aws2))\.elkwo\.com\/app\/php\/api\/ad\/v2 url script-response-body daixiong.js


MITM = aws2.elkwo.com,aws1.elkwo.com

商店版下载地址：
https://apps.apple.com/cn/app/id1539273424

TF版下载地址：
http://ldy.oac.pw?appkey=38&&taskConfigId=&inviteUserId=1119557507540561920
*/

var obj = JSON.parse($response.body);
obj= {
  "status": 200,
  "msg": "请求成功",
};


$done({body: JSON.stringify(obj)}); 
