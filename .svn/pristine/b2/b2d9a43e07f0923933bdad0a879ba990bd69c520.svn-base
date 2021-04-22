/**
 * 作者： 袁莉
 * 创建时间： 2019/10/15
 * 版本： [1.0, 2019/10/15]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：简易案件-已登记-案件详情
 */

(function(doc, Util) {
		"use strict";

		var caseGuid = Util.getExtraDataByKey('caseguid') || '',
			rowGuid = Util.getExtraDataByKey('rowguid') || '';

		Util.loadJs(
			'pages/common/formatfile.js',
			function() {
				Config.configReady([], function() {
					getNoregisterCaselist(); //监管行为列表
					getCasedetail(); //案件基本信息 
					getPublishList(); //获取处罚事项列表
					getFileList(); //获取附件列表
					getHostList(); //获取主办人列表
					initListeners();

				}, function(err) {});
			});

		function initListeners() {
			$('body').on('tap', '.file-li-item', function() {
				var fjurl = $(this).attr('data-src'),
					filename = $(this).attr('data-filename');				ejs.ui.showWaiting();
				ejs.io.downloadFile({
					url: fjurl,
					fileName: filename,
					reDownloaded: 0,
					openAfterComplete: 1,
					success: function(result) {
						ejs.ui.closeWaiting();
						ejs.ui.toast('下载成功');
					},
					error: function(error) {
						ejs.ui.closeWaiting();
						ejs.ui.toast('下载失败');
					}
				});
			})
		}
	/**
	 * @description 获取登记案件详情
	 */
	function getCasedetail() {
		var url = Config.serverUrl + 'checkInfo/punishCaseInfoDetail',
			data = JSON.stringify({
				token: Config.validate,
				params: {
					caseguid: caseGuid
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
					template = Mustache.render($("#regulatory-template").html(), data);

				doc.getElementById('regulatory-listdata').innerHTML = template;

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
	 * @description 获取处罚事项信息
	 */
	function getPublishList() {
		var url = Config.serverUrl + 'checkInfo/getPunishCaseArticleList',
			data = JSON.stringify({
				token: Config.validate,
				params: {
					caseguid: caseGuid
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
					template = Mustache.render($("#publish-template").html(), data);

				doc.getElementById('publish-listdata').innerHTML = template;

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
	 * @description 获取附件列表
	 */
	function getFileList() {
		var url = Config.serverUrl + 'checkInfo/getPunishCaseAttachList',
			data = JSON.stringify({
				token: Config.validate,
				params: {
					caseguid: caseGuid
				}
			});

		console.log('相关附件列表：', url, data);

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

				var data = result.custom || {};
				if(data.clauselist && data.clauselist.length > 0) {
					$.each(data.clauselist, function(i, val) {
						val.fileicon = FormatFile.getFileIcon(val.filename)
					});
				}
				var template = Mustache.render($("#files-template").html(), data);

				doc.getElementById('files-listdata').innerHTML = template;

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
	 * @description 获取承办人列表
	 */
	function getHostList() {
		var url = Config.serverUrl + 'checkInfo/getPunishCaseHandlerList',
			data = JSON.stringify({
				token: Config.validate,
				params: {
					caseguid: caseGuid
				}
			});

		console.log('相关附件列表：', url, data);

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
					dataArr = data.handlerlist,
					hostTemp = '',
					helpTemp = '',
					hostArr = [],
					helpArr = [];

				$.each(dataArr, function(i, val) {
					var userName = val.username;

					if(val.dutytype == '主办人') {
						hostArr.push({
							username: userName
						});
					} else {
						helpArr.push({
							username: userName
						});
					}
				});
				data.hostlist = hostArr;
				data.helplist = helpArr;

				hostTemp = Mustache.render($("#host-template").html(), data);
				helpTemp = Mustache.render($("#help-template").html(), data);
				doc.getElementById('host-listdata').innerHTML = hostTemp;
				doc.getElementById('help-listdata').innerHTML = helpTemp;

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