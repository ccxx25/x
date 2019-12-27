
/*
先用浏览器登录: https://tieba.baidu.com
再用浏览器访问一下: http://tieba.baidu.com （注意了, 是 http, 没有 s）
*/
if ($request.headers["Cookie"]) {
  var headerTB = $request.headers["Cookie"];
  var cookie = $prefs.setValueForKey(headerTB, "CookieTB");
  if (!cookie) {
    $notify("写入贴吧Cookie失败‼️‼️", "", "请重试");
  } else {
    $notify("写入贴吧Cookie成功🎉", "", "您可以手动禁用此脚本");
    //console.log("京东Cookie : \n" + $prefs.valueForKey("CookieJD"))
  }
} else {
  $notify("写入贴吧Cookie失败‼️‼️", "", "请退出账号, 重复步骤");
}
$done({});
