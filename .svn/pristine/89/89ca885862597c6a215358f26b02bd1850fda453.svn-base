/**
 * 作者： 黄赟博
 * 创建时间：2017/08/28 10:22
 * 版本： [1.0, 2018/05/22]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：  新闻详情
 **/
"use strict";

Util.loadJs([

], function() {
	customBiz.configReady();
});
function transferDate(date) {
	// 年
	var year = date.getFullYear();
	// 月
	var month = date.getMonth() + 1;
	// 日
	var day = date.getDate();

	if(month >= 1 && month <= 9) {

		month = "0" + month;
	}
	if(day >= 0 && day <= 9) {

		day = "0" + day;
	}

	var dateString = year + '-' + month + '-' + day;
	return dateString;

};
/**
 * @description 所有业务处理
 */
var customBiz = {
	// 初始化校验，必须调用
	// 注，如果没有组件API需要注册，可以传空，注册组件时，必须容器支持对应组件才能注册成功
	configReady: function() {
		var self = this;

		self.initListeners();
		self.getDetail();
	},
	initListeners: function() {
		var self = this;



		Zepto('#attachlist').on('tap', 'li', function() {
			var attachurl = Zepto(this).attr('url');
			var attachname = Zepto(this).find('.mui-ellipsis').text();
			ejs.io.downloadFile({
				url: attachurl,
				fileName: attachname,
				reDownloaded: 0,
				openAfterComplete: 1,
				success: function(result) {},
				error: function(error) {}
			});
		});
	},
	/**
	 * @description 获取关注数据
	 */
	getDetail: function(guid) {
		var self = this;
		var rowguid = Util.getExtraDataByKey('rowguid') || '20833370-69b1-436b-9357-f142870955fe';

		var data = {
			token: 'Epoint_WebSerivce_**##0601',
			params: {
				rowguid: rowguid
			}
		};
		Util.ajax({
			url: Config.serverUrl + 'tyzfxxfb/getTyzfxxfByRowGuid',
			data: JSON.stringify(data),
			contentType: 'application/json',
			success: function(result) {
				if (result.custom.code == "1") {
					result.custom.fbinfo.pubdate =  transferDate(new Date(result.custom.fbinfo.pubdate));
					console.log(result.custom.fbinfo);
					var temple1 = Zepto('#tmp02').html();
					var output = Mustache.render(temple1, result.custom.fbinfo);
					Zepto('#content').html(output);
				}
			},
			error: function(error) {
				ejs.ui.toast(error);
			}
		});
	}
};