/*
[rewrite_local]

#rrsp
^https:\/\/api\.rr\.tv\/watch\/v4\/priority_video_quality* url script-response-body rrsp.js

MITM=api.rr.tv

by:opacc

*/
let obj = JSON.parse($response.body);
obj=
{
 "code": "0000",
 "msg": "Success",
 "data": {
  "sortedItems": [
   {
    "qualityDescription": "高清",
    "qualityCode": "SD",
    "canPlay": true,
    "canShowVip": false,
    "initialQuality": false
   },
   {
    "qualityDescription": "超清",
    "qualityCode": "HD",
    "canPlay": true,
    "canShowVip": false,
    "initialQuality": false
   },
   {
    "qualityDescription": "原画",
    "qualityCode": "OD",
    "canPlay": true,
    "canShowVip": false,
    "initialQuality": false
   },
   {
    "qualityDescription": "AI原画",
    "qualityCode": "AI_OD",
    "canPlay": true,
    "canShowVip": false,
    "initialQuality": true
   }
  ]
 }

};
$done({body: JSON.stringify(obj)})
