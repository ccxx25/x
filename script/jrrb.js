//今日热榜 crate by makexp 2020.01.14
//^https:\/\/api\.tophub\.today\/account\/sync* url script-response-body jrrb.js

let obj = JSON.parse($response.body);
obj["data"]={
	"vip_expired": "18630733746",
	"is_vip_now": true,
	"is_vip": "1"
	}
$done({body: JSON.stringify(obj)});