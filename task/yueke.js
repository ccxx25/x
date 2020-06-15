
/**
 * @fileoverview Template to compose HTTP reqeuest.
 * 
 */

const url = `https://app.relxtech.com/dianziyan-api/api/v3/community/check-in`;
const method = `POST`;
const headers = {
'ltype' : `1`,
'sensorsId' : `02F78226-13A3-4F80-80F4-9DF8117AD1A2`,
'Accept-Encoding' : `gzip, deflate, br`,
'bundleId' : `com.global.app.hook1`,
'Connection' : `keep-alive`,
'Content-Type' : `application/json`,
'deviceType' : `ios`,
'User-Agent' : `RELX ME_2.3.2_iOS_iPhone-XS-Max_13.3_Wifi_1591668389683`,
'token' : `3280272d788541ba8599891ee643c8d1`,
'Cookie' : `acw_tc=2760821715916682212973553efe02ed126677af69c4a8fdbab1f69354ffd5; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22172751416ecc08-0e8f7bdc54f788-724c1451-370944-172751416ed9a1%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%2C%22%24latest_utm_source%22%3A%22%E4%BA%A7%E5%93%81%E7%99%BE%E7%A7%91v3%22%2C%22%24latest_utm_campaign%22%3A%22%E4%BA%A7%E5%93%81%E7%99%BE%E7%A7%91%22%7D%2C%22%24device_id%22%3A%22172751416ecc08-0e8f7bdc54f788-724c1451-370944-172751416ed9a1%22%7D; UM_distinctid=1727514346197-0f82af75be27b28-724c1451-5a900-172751434622a5; CNZZDATA1277871575=271252727-1591100789-%7C1591100789`,
'Host' : `app.relxtech.com`,
'appVersion' : `2.3.2`,
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
