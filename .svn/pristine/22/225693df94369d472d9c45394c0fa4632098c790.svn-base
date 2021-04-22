/**
 * 作者： 袁莉
 * 创建时间： 2019/10/18
 * 版本： [1.0, 2019/10/18]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：简易案件-案件详情
 */

(function(doc, Util) {
	"use strict";

	var itemCode = Util.getExtraDataByKey('itemcode') || '',
		itemName = Util.getExtraDataByKey('itemname') || '',
		caseGuid = Util.getExtraDataByKey('caseguid') || '';

	Util.loadJs(
		function() {
			Config.configReady([], function() {
				getCaselist();
				initlisteners();
			}, function(err) {});
		});

	function initlisteners() {
		$('#listdata').on('tap', 'li', function() {
			var self = this,
				itemText = $(self).text(),
				itemGuid = self.dataset.rowguid,
				upperlimit = self.dataset.upperlimit,
				lowerlimit = self.dataset.lowerlimit;

			ejs.ui.confirm({
				title: "是否选择",
				message: itemText,
				buttonLabels: ['取消', '确定'],
				cancelable: 1,
				success: function(result) {
					var which = result.which;

					if(which == 1) {
						//TODO
						ejs.page.close({
							// 也支持传递字符串
							resultData: {
								key: 'value2',
								itemtext: itemText,
								itemguid:itemGuid,
								upperlimit:upperlimit,
								lowerlimit:lowerlimit
							},
							success: function(result) {

							},
							error: function(error) {}
						});
					}
				},
				error: function(err) {}
			});
		});
	}

	/**
	 * @description 获取处罚事项列表
	 */
	function getCaselist() {
		var url = Config.serverUrl + 'checkInfo/getPunishCaseItemList',
			data = JSON.stringify({
				token: Config.validate,
				params: {
					caseguid: caseGuid,
					itemcode: itemCode, //处罚事项编码  非必填
					itemname: itemName //案件唯一标识  非必填
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
					template = Mustache.render($("#item-template").html(), data);

				doc.getElementById('listdata').innerHTML = template;

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