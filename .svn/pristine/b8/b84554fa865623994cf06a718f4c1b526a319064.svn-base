/**
 * 作者： 袁莉
 * 创建时间： 2019/10/15
 * 版本： [1.0, 2019/10/15]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：简易案件首页
 */

(function(doc, Util) {
		"use strict";

		var rowGuid = Util.getExtraDataByKey('rowguid') || '';

		Util.loadJs(
			function() {
				Config.configReady([], function() {
					getCasedetail();
					initListeners();
					getCaselist();
					getNoregisterCaselist();

				}, function(err) {});
			});

		function initListeners() {

			//查看任务基本详情
			$('#check-casedetail').on('tap', function() {
				var pageUrl = './easycase_detail.html',
					data = {
						rowguid: rowGuid
					};

				if(pageUrl) {
					ejs.page.open({
						pageUrl: pageUrl,
						pageStyle: 1,
						orientation: 1,
						data: data,
						success: function(result) {

						},
						error: function(error) {}
					});

				}
			});

			//登记案件列表
			$('#register-caselists').on('tap', 'li', function() {
				var caseGuid = this.dataset.caseguid;
				
				var pageUrl = './easycase_done_register_moreinfo.html',
					data = {
						rowguid: rowGuid,
						caseguid: caseGuid
					};

				if(pageUrl) {
					ejs.page.open({
						pageUrl: pageUrl,
						pageStyle: 1,
						orientation: 1,
						data: data,
						success: function(result) {

						},
						error: function(error) {}
					});

				}
			});

	}
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
				//				console.log(JSON.stringify(result));

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
	/**
	 * @description 获取登记案件列表
	 */
	function getCaselist() {
		var url = Config.serverUrl + 'checkInfo/punishCaseInfoList',
			data = JSON.stringify({
				token: Config.validate,
				params: {
					dutyguid: rowGuid
				}
			});

		console.log('登记案件列表：', url, data);

		Util.ajax({
			url: url,
			data: data,
			contentType: 'application/json',
			beforeSend: function() {
				ejs.ui.showWaiting();
			},
			success: function(result) {
				//				console.log(JSON.stringify(result));

				if(result.status.code != 1) {
					ejs.ui.toast(result.status.text);
					return;
				}

				var data = result.custom || {},
					template = Mustache.render($("#case-template").html(), data);

				doc.getElementById('register-caselists').innerHTML = template;

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

	/**
	 * @description 获取监管行为列表
	 */
	function getNoregisterCaselist() {
		var url = Config.serverUrl + 'checkInfo/getPunishCheckBehaviorList',
			data = JSON.stringify({
				token: Config.validate,
				params: {
					dutyguid: rowGuid,
					currentpageindex: '1',
					pagesize: '0'
				}
			});

		console.log('监管行为列表：', url, data);

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

				doc.getElementById('noregister-caselists').innerHTML = template;

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