/**
 * 作者： 黄赟博
 * 创建时间：2017/08/28 10:22
 * 版本： [1.0, 2018/05/22]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：  新闻详情
 **/
"use strict";

Util.loadJs([
	'pages/common/common.js',
	"./../common/preview.js"
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
		common.commGetUserInfo(function (res) {
			console.log(res);
			self.myLoginid = res.loginid;
			self.initListeners();
			self.getDetail();
		})

	},
	initListeners: function() {
		var self = this;
		mui('.mui-content').on('tap', '#download_box', function() {
			var attachurl = Zepto(this).attr('myUrl');
			var attachname = Zepto(this).attr('attachname');

			console.log(attachurl,attachname);
			preview.downloadFile({
				url: attachurl,
				fileName: attachname,
				reDownloaded: '0',
				isBackground: 0,
			}, function() {
				ejs.ui.toast('文件下载完成');
			});
			preview.openPreviewUrl({
                url: attachurl,
                fileName: attachname
            });
			// ejs.io.downloadFile({
			// 	url: attachurl,
			// 	fileName: attachname,
			// 	reDownloaded: 0,
			// 	openAfterComplete: 1,
			// 	success: function(result) {},
			// 	error: function(error) {}
			// });
		});


		mui(".mui-content").on("tap",".em-save",function(){
			var data = {
				token: 'Epoint_WebSerivce_**##0601',
				params: {
					collectionurl: window.location.href,
					loginid: self.myLoginid ,
					clienttype: self.fbinfo.infotype,
					clientidentifier: self.fbinfo.rowguid,
					collectiontitle: self.fbinfo.title
				}
			};
			Util.ajax({
				url: Config.serverUrl + 'btjgxx/addCollection',
				data: JSON.stringify(data),
				contentType: 'application/json',
				success: function(result) {
					if (result.custom.code == "1") {
						ejs.ui.toast(result.custom.text);
					}
				},
				error: function(error) {
					ejs.ui.toast(error);
				}
			});
		})
	},
	/**
	 * @description 获取关注数据
	 */
	getDetail: function(guid) {
		var self = this;
		var rowguid = Util.getExtraDataByKey('rowguid');

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
					self.fbinfo = result.custom.fbinfo;
					result.custom.fbinfo.pubdate =  transferDate(new Date(result.custom.fbinfo.pubdate));

					if(result.custom.fbinfo.attachList instanceof Array && result.custom.fbinfo.attachList.length>0) {

						result.custom.fbinfo.attachList.forEach((ele,idx)=>{
							var num = ele.attachname.lastIndexOf(".");
							result.custom.fbinfo.attachList[idx].myattachname = ele.attachname.slice(num+1);
						})
					}
					console.log(result.custom.fbinfo.attachList);
					var temple1 = Zepto('#tmp02').html();
					var output = Mustache.render(temple1, result.custom.fbinfo);
					Zepto('#content').html(output);
					Zepto(".em-save").removeClass("mui-hidden");
				}
			},
			error: function(error) {
				ejs.ui.toast(error);
			}
		});
	}
};