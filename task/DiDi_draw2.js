const $ = API("Didi", true);
const mainURL = "https://bosp-api.xiaojukeji.com/bosp-api/lottery";
const lid = "8cguaa19";
const delay = 2000;
$.detail = "";

!(async () => {
	$.Ticket = encodeURIComponent($.read("#DiDi"));
	if (!$.Ticket) {
		throw new ERR.TokenError("❌ 未获取或填写 Token");
	} else {
		$.times = 1;
		while ($.times) {
			await draw();
			await share();
		}
		await $.notify("滴滴出行-答题抽奖", "", $.detail);
	}
})()
	.catch((err) => {
		$.notify(
			"滴滴出行答题抽奖 - 出现错误",
			"",
			JSON.stringify(err, Object.getOwnPropertyNames(err))
		);
		$.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
	})
	.finally($.done());

function share() {
	return $.get({
		url:
			mainURL +
			"/incrDpubShareParticipateLimit?lid=" +
			lid +
			"&token=" +
			$.Ticket +
			"&role=1",
	})
		.delay(delay)
		.then((resp) => {
			let obj = JSON.parse(resp.body);
			$.times += obj.data.incr_num;
		})
		.catch((err) => {
			throw err;
		});
}

function draw() {
	return $.get({
		url: mainURL + "/draw?lid=" + lid + "&token=" + $.Ticket,
	})
		.delay(delay)
		.then((resp) => {
			let obj = JSON.parse(resp.body);
			if (obj.code == 0) {
				$.detail += obj.data.prize.name + "\n";
				$.info(obj.data.prize.name);
				$.times = obj.data.userinfo.draw_times;
			} else {
				$.times = 0;
				$.detail += obj.message;
			}
		})
		.catch((err) => {
			throw err;
		});
}

// prettier-ignore
// OpenAPI by Peng-YM, modified by zZPiglet
function API(s="untitled",t=!1){return new class{constructor(s,t){this.name=s,this.debug=t,this.isRequest="undefined"!=typeof $request,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.isJSBox=this.isNode&&"undefined"!=typeof $jsbox,this.node=(()=>{if(this.isNode){const s="undefined"!=typeof $request?void 0:require("request"),t=require("fs");return{request:s,fs:t}}return null})(),this.initCache();const e=(s,t)=>new Promise(function(e){setTimeout(e.bind(null,t),s)});Promise.prototype.delay=function(s){return this.then(function(t){return e(s,t)})}}get(s){return this.isQX?("string"==typeof s&&(s={url:s,method:"GET"}),$task.fetch(s)):new Promise((t,e)=>{this.isLoon||this.isSurge?$httpClient.get(s,(s,i,o)=>{s?e(s):t({status:i.status,headers:i.headers,body:o})}):this.node.request(s,(s,i,o)=>{s?e(s):t({...i,status:i.statusCode,body:o})})})}post(s){return this.isQX?("string"==typeof s&&(s={url:s}),s.method="POST",$task.fetch(s)):new Promise((t,e)=>{this.isLoon||this.isSurge?$httpClient.post(s,(s,i,o)=>{s?e(s):t({status:i.status,headers:i.headers,body:o})}):this.node.request.post(s,(s,i,o)=>{s?e(s):t({...i,status:i.statusCode,body:o})})})}initCache(){if(this.isQX&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(this.isLoon||this.isSurge)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),this.isNode){let s="root.json";this.node.fs.existsSync(s)||this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.root={},s=`${this.name}.json`,this.node.fs.existsSync(s)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.cache={})}}persistCache(){const s=JSON.stringify(this.cache);this.isQX&&$prefs.setValueForKey(s,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(s,this.name),this.isNode&&(this.node.fs.writeFileSync(`${this.name}.json`,s,{flag:"w"},s=>console.log(s)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root),{flag:"w"},s=>console.log(s)))}write(s,t){this.log(`SET ${t}`),-1!==t.indexOf("#")?(t=t.substr(1),this.isSurge||this.isLoon&&$persistentStore.write(s,t),this.isQX&&$prefs.setValueForKey(s,t),this.isNode&&(this.root[t]=s)):this.cache[t]=s,this.persistCache()}read(s){return this.log(`READ ${s}`),-1===s.indexOf("#")?this.cache[s]:(s=s.substr(1),this.isSurge||this.isLoon?$persistentStore.read(s):this.isQX?$prefs.valueForKey(s):this.isNode?this.root[s]:void 0)}delete(s){this.log(`DELETE ${s}`),-1!==s.indexOf("#")?(s=s.substr(1),this.isSurge||this.isLoon&&$persistentStore.write(null,s),this.isQX&&$prefs.removeValueForKey(s),this.isNode&&delete this.root[s]):delete this.cache[s],this.persistCache()}notify(t=s,e="",i="",o,n){if(this.isSurge){let s=i+(null==n?"":`\n\n多媒体链接：${n}`),r={};o&&(r.url=o),"{}"==JSON.stringify(r)?$notification.post(t,e,s):$notification.post(t,e,s,r)}if(this.isQX){let s={};o&&(s["open-url"]=o),n&&(s["media-url"]=n),"{}"==JSON.stringify(s)?$notify(t,e,i):$notify(t,e,i,s)}if(this.isLoon){let s={};o&&(s.openUrl=o),n&&(s.mediaUrl=n),"{}"==JSON.stringify(s)?$notification.post(t,e,i):$notification.post(t,e,i,s)}if(this.isNode){let s=i+(null==o?"":`\n\n跳转链接：${o}`)+(null==n?"":`\n\n多媒体链接：${n}`);if(this.isJSBox){const i=require("push");i.schedule({title:t,body:e?e+"\n"+s:s})}else console.log(`${t}\n${e}\n${s}\n\n`)}}log(s){this.debug&&console.log(s)}info(s){console.log(s)}error(s){console.log("ERROR: "+s)}wait(s){return new Promise(t=>setTimeout(t,s))}done(s={}){this.isQX||this.isLoon||this.isSurge?this.isRequest?$done(s):$done():this.isNode&&!this.isJSBox&&"undefined"!=typeof $context&&($context.headers=s.headers,$context.statusCode=s.statusCode,$context.body=s.body)}}(s,t)}
