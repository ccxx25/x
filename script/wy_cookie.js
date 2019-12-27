

/*
浏览器访问并登录: https://music.163.com/m/login
 再用浏览器访问下: http://music.163.com 
 QuanX提示: Cookie [网易云音乐] 写入成功
 最后就可以把第 1 条脚本注释掉了
 */

if ($request.headers["Cookie"]) {
  var headerWY = $request.headers["Cookie"];
  var cookie = $prefs.setValueForKey(headerWY, "CookieWY");
  if (!cookie) {
    $notify("写入网易Cookie失败‼️‼️", "", "请重试");
  } else {
    $notify("写入网易Cookie成功🎉", "", "您可以手动禁用此脚本");
    //console.log("京东Cookie : \n" + $prefs.valueForKey("CookieJD"))
  }
} else {
  $notify("写入网易Cookie失败‼️‼️", "", "请退出账号, 重复步骤");
}
$done({});
