
/**
 * @fileoverview Template to compose HTTP reqeuest.
 * 
 */

const url = `https://app.relxtech.com/dianziyan-api/api/v3/community/check-in`;
const method = `POST`;
const headers = {
'ltype' : `1`,
'sensorsId' : `DC5E8ED9-9B17-4D43-9374-0E014B3000D7`,
'Accept-Encoding' : `gzip, deflate, br`,
'bundleId' : `com.WuXinKeJi.RELXME`,
'Connection' : `keep-alive`,
'Content-Type' : `application/json`,
'deviceType' : `ios`,
'User-Agent' : `RELX ME_2.4.0_iOS_iPhone-XS-Max_13.3_Wifi_1594744446125`,
'token' : `905f61bcee6b43c68d28a547c0534fd7`,
'versionBuild' : `4`,
'Cookie' : `acw_tc=2760824d15947444465622518eadf3fc92973444bed866817b8946a4a6429c`,
'Host' : `app.relxtech.com`,
'appVersion' : `2.4.0`,
'Accept-Language' : `zh-Hans-AR;q=1, zh-Hant-HK;q=0.9, en-GB;q=0.8, en-AR;q=0.7`,
'Accept' : `application/json`
};
const body = `{}`;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);
}, reason => {
    console.log(reason.error);
});
