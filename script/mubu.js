/*
//幕布高级会员
[rewrite_local]
^https:\/\/mubu\.com\/api\/app\/user\/info url script-response-body mubu.js

MITM=mubu.com
by chamberlen
*/


var body = $response.body;
var obj = JSON.parse(body);
obj={
 "msg": null,
 "data": {
  "id": 4640382,
  "qqName": "Robin",
  "phone": null,
  "passSecure": false,
  "wxId": null,
  "level": 2,
  "encryptPassword": null,
  "vipEndDate": "20221101",
  "wxName": null,
  "qqId": "UID_BA993CB43981AC8AE731F8DB5ADD9458",
  "name": "Robin",
  "photo": "https://mubu.com/photo/aabb2370-386c-4804-85c8-eddad2093b0c.jpg"
 },
 "code": 0
};
  
body=JSON.stringify(obj);
$done({body});
