/**
 * 作者： 孙尊路
 * 创建时间： 2017/06/16 13:27:09
 * 版本： [1.0, 2017/6/16]
 * 版权： 江苏国泰新点软件有限公司
 * 描述： 继承Util.ajax,修改默认配置项，只用于下拉刷新列表获取数据
 */
var oldAjax = Util.ajax;

Util.ajax = function(options) {
	var setting = options;
	setting.headers = setting.headers || {};
	if(ejs.os.ejs) {
		// EJS 容器
		ejs.auth.getToken({
			success: function(result) {
				var token = result.access_token;
				setting.headers.Authorization = "Bearer " + token;
			}
		});

	} else {
		// Chrome 各种浏览器
		setting.xhrFields = {
			// 跨域带cookie
			withCredentials: true
		};
	}

	return oldAjax(setting);
};