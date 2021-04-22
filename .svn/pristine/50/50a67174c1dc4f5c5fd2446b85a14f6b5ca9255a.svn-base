/**
 * 作者： 袁莉
 * 创建时间： 2019/10/15
 * 版本： [1.0, 2019/10/15]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：简易案件首页
 */

(function(doc, Util) {
	"use strict";

	var rowGuid = Util.getExtraDataByKey('rowguid') || '',
		pviGuid = Util.getExtraDataByKey('pviguid') || '';

	Util.loadJs(function() {
		Config.configReady([], function() {

			getCasedetail();
			getCaselist(); //获取登记案件列表
			initListeners();

			ejs.event.registerEvent({
				key: 'resume',
				success: function(result) {

					getCaselist(); //获取登记案件列表
				},
				error: function(error) {}
			});

		}, function(err) {});
	});

	function initListeners() {

		//查看任务基本详情
		$('#check-casedetail').on('tap', function() {
			var pageUrl = './easycase_detail.html',
				data = {
					rowguid: rowGuid
				};

			ejs.page.open({
				pageUrl: pageUrl,
				pageStyle: 1,
				orientation: 1,
				data: data,
				success: function(result) {

				},
				error: function(error) {}
			});

		});

		//添加监管行为
		$('#add-supervision').on('tap', function() {
			var pageUrl = './easycase_todo_regulatory_behavior.html',
				data = {
					rowguid: rowGuid,
					pviguid: pviGuid
				};

			if(pageUrl) {
				ejs.page.open({
					pageUrl: pageUrl,
					pageStyle: 1,
					orientation: 1,
					data: data,
					success: function(result) {
						getCaselist(); //获取登记案件列表
					},
					error: function(error) {}
				});

			}
		});

		//登记案件列表-编辑/删除
		$('#case-lists')
			.on('tap', '.edit-action', function() {
				var pageUrl = './easycase_todo_register_moreinfo.html',
					caseguid = this.dataset.caseguid,
					data = {
						type: 'edit',
						caseguid: caseguid
					};

				if(pageUrl) {
					ejs.page.open({
						pageUrl: pageUrl,
						pageStyle: 1,
						orientation: 1,
						data: data,
						success: function(result) {
							getCaselist(); //获取登记案件列表
						},
						error: function(error) {}
					});

				}
			})
			.on('tap', '.del-action', function() {
				var self = this,
					caseguid = this.dataset.caseguid;

				ejs.ui.confirm({
					title: '提示信息',
					message: '是否删除该案件?',
					buttonLabels: ['取消', '确定'],
					cancelable: 1,
					success: function(result) {
						var btnWhich = result.which;
						if(btnWhich == 1) {
							var targetDom = self.parentNode.parentNode.parentNode;
							//删除案件接口
							punishCaseInfoDelete(caseguid, targetDom);
						}
					},
					error: function(err) {}
				});
			});

		$('#btn-check').on('tap', function() {
			var self = this;
			ejs.ui.confirm({
				title: '提示信息',
				message: '是否确认送审核？',
				buttonLabels: ['取消', '确定'],
				cancelable: 1,
				success: function(result) {
					var btnWhich = result.which;
					if(btnWhich == 1) {
						ejs.ui.toast('送审核成功！');
						//送审核接口
						submit();
					}
				},
				error: function(err) {}
			});
		});
	}

	/**
	 * @description 简易案件-删除
	 */
	function punishCaseInfoDelete(caseguid, targetDom) {
		var data = {
			caseguid: caseguid
		}

		ajaxCommon('checkInfo/punishCaseInfoDelete', data, function(result) {
			$(targetDom).remove();
		});
	}

	/**
	 * @description 简易案件-删除
	 */
	function submit() {
		var data = {
			dutyguid: rowGuid,
			status: '65',
			addressregistered: '',
			addressoperating: '',
			areanumber: '',
			entrustdept: '',
			entrustdeptcode: '',
			checktype: '',
			checkmode: '',
			ispunish: '1'
		}

		ajaxCommon('checkInfo/updateCheckInfo', data, function(result) {
			ejs.page.close({
				// 也支持传递字符串
				resultData: {
					key: 'value2'
				},
				success: function(result) {
					/**
					 * 回调内请不要做UI显示相关的事情
					 * 因为可能刚回调页面就关闭了
					 */

				},
				error: function(error) {}
			});
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

				doc.getElementById('case-lists').innerHTML = template;

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
	 * 非下拉刷新请求
	 * @param {Object} requestUrl 请求地址
	 * @param {Object} data 请求参数
	 * @param {Object} callback 成功回调函数
	 */
	function ajaxCommon(requestUrl, data, callback) {
		var url = Config.serverUrl + requestUrl,
			data = JSON.stringify({
				token: Config.validate,
				params: data
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
				if(result.status.code != 1) {
					ejs.ui.toast(result.status.text);
					return;
				}

				callback(result);
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