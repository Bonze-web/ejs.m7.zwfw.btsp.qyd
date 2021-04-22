/**
 * 作者： 袁莉
 * 创建时间： 2019/10/18
 * 版本： [1.0, 2019/10/18]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：简易案件-案件详情
 */

(function(doc, Util) {
	"use strict";

	var rowGuid = Util.getExtraDataByKey('rowguid') || '';

	Util.loadJs(
		function() {
			Config.configReady([], function() {
				getCasedetail();

			}, function(err) {});
		});

	
	/**
	 * @description 获取登记案件详情
	 */
	function getCasedetail() {
		var url = Config.serverUrl + 'checkInfo/getCheckTaskDetail',
			data = JSON.stringify({
				token: Config.validate,
				params: {
					dutyguid: rowGuid
				}
			});

		console.log('案件详情：', url, data);

		Util.ajax({
			url: url,
			data: data,
			contentType: 'application/json',
			beforeSend: function() {
				ejs.ui.showWaiting();
			},
			success: function(result) {
				console.log(JSON.stringify(result));

				if(result.status.code != 1) {
					ejs.ui.toast(result.status.text);
					return;
				}

				var data = result.custom || {},
					template = Mustache.render($("#baseinfo-template").html(), data);

				doc.getElementById('baseinfo').innerHTML = template;

			},
			error: function(error) {
				console.log(JSON.stringify(error));
				ejs.ui.toast('接口有误，请联系管理员');
				ejs.ui.closeWaiting({});
			},
			complete: function() {
				ejs.ui.closeWaiting({});
			}
		});
	}

})(document, window.Util);