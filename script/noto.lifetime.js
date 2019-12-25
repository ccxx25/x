/*
QX:
[rewrite_local]
^https:\/\/api\.revenuecat\.com\/.*\/(receipts$|subscribers) url script-response-body noto.lifetime.js

[MITM]
hostname = api.revenuecat.com

注：请勿发送至公开群组，请勿用于盈利。
*/

let obj = JSON.parse($response.body);
let url = $request.url;

if(url.endsWith("offerings")) {
  $done({});
} else {

  let pro = obj["subscriber"]["entitlements"];
  let sub = obj["subscriber"]["non_subscriptions"];

  pro["pro"] = {
    "expires_date": null,
    "product_identifier": "com.lkzhao.editor.full.deal",
    "purchase_date": "2019-12-01T00:00:00Z"
  };

  sub["com.lkzhao.editor.full.deal"] =[
  {
    "id": "12345qwert",
    "is_sandbox": false,
    "original_purchase_date": "2019-12-01T00:00:00Z",
    "purchase_date": "2019-12-01T00:00:00Z",
    "store": "app_store"
  }
  ];

  $done({body: JSON.stringify(obj)});
}
