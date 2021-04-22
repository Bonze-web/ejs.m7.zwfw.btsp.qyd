/**
 * 作者： 袁莉
 * 创建时间： 2019/10/16
 * 版本： [1.0, 2019/10/16]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：简易案件-待登记-添加处罚事项
 */

(function(doc, Util) {
	"use strict";

	var caseGuid = Util.getExtraDataByKey('caseguid') || '',
		targetGuid = Util.getExtraDataByKey('targetguid') || '',
		name = Util.getExtraDataByKey('name') || '';

	var rowGuid = Util.getExtraDataByKey('rowguid') || '',
		openType = Util.getExtraDataByKey('type') || '';

	var submitData = {},
		clauseListArr = [], //违法情节数组
		basicListArr = []; //管理依据数组

	Util.loadJs(
		'js/widgets/mui.picker/mui.picker.css',
		'js/widgets/mui.poppicker/mui.poppicker.css',
		'js/widgets/mui.picker/mui.picker.js',
		'js/widgets/mui.poppicker/mui.poppicker.js',
		function() {
			Config.configReady([], function() {

				if(openType == 'edit') {
					ejs.navigator.setTitle('编辑处罚事项');
					getPunishCaseArticleDetail();
				} else {
					ejs.navigator.setTitle('添加处罚事项');
					$('#name').val(name);
					submitData.caseguid = caseGuid;
					submitData.targetguid = targetGuid;
				}
				initListeners();

			}, function(err) {});
		});

	function initListeners() {
		$('body')
			.on('tap', '#btn-save', function() {
				if(dataCheck()) {

					if(openType == 'edit') {
						updatePunishCaseArticle()
					} else {
						submit();
					}
				}
			})
			//处罚事项
			.on('tap', '#itemguid', function() {

				var self = this,
					data = {
						key: 'value2',
						caseguid: caseGuid
					};

				ejs.page.open({
					pageUrl: './easycase_publishlist.html',
					pageStyle: 1,
					orientation: 1,
					data: data,
					success: function(result) {
						var data = result.resultData;

						$(self).val(data.itemtext);
						submitData.itemguid = data.itemguid;

						$('#upperlimit').val(data.upperlimit);
						$('#lowerlimit').val(data.lowerlimit);

						$('#basicguid').val('');
						$('#punishment').val('');
						$('#clauseguid').val('');
						submitData.basicguid = '';
						submitData.basicguid = '';
						submitData.clauseguid = '';

						getBasicinfo(); //获取管理依据
						getClauseList(); //获取违法情节

					},
					error: function(error) {}
				});
			})
			//管理依据
			.on('tap', '#basicguid', function() {
				var self = this;
				if(submitData.itemguid == '' || submitData.itemguid == undefined) {
					ejs.ui.toast('请先选择处罚事项！');
					return false;
				} 
				if(basicListArr.length == 0) {
					ejs.ui.toast('未获取到管理依据！');
					return false;
				} else {
					ejs.ui.popPicker({
						layer: 1,
						data: basicListArr,
						success: function(result) {
							console.log(result);

							$(self).val(result.items[0].text);
							submitData.basicguid = result.items[0].value;

							$.each(basicListArr, function(i, val) {
								if(submitData.basicguid == val.value) {
									$('#punishment').val(val.punishment);
								}
							})

						},
						error: function(err) {}
					});
				}
			})
			//违法情节
			.on('tap', '#clauseguid', function() {
				var self = this;
				if(submitData.itemguid == '' || submitData.itemguid == undefined) {
					ejs.ui.toast('请先选择处罚事项！');
					return false;
				}
				if (clauseListArr.length == 0) {
					ejs.ui.toast('未获取到违法情节！');
					return false;
				} else {
					ejs.ui.popPicker({
						layer: 1,
						data: clauseListArr,
						success: function(result) {
							console.log(result.items[0].text);

							$(self).val(result.items[0].text);
							submitData.clauseguid = result.items[0].value;

						},
						error: function(err) {}
					});
				}
			})
	}

	/**
	 * 数据验证
	 */
	function dataCheck() {

		submitData.opinion = $('#opinion').val(); //处罚建议

		if(submitData.itemguid == '' || submitData.itemguid == undefined) {
			ejs.ui.toast('请选择处罚事项！');
			return false;
		}

		if(submitData.basicguid == '' || submitData.basicguid == undefined) {
			ejs.ui.toast('请选择处罚依据！');
			return false;
		}

		if(submitData.clauseguid == '' || submitData.clauseguid == undefined) {
			ejs.ui.toast('请选择违法情节！');
			return false;
		}

		if(submitData.opinion == '' || submitData.opinion == undefined) {
			ejs.ui.toast('请输入处罚建议！');
			return false;
		}

		return true;
	}

	/**
	 * 新增数据提交
	 */
	function submit() {
		var data = submitData;

		ajaxCommon('checkInfo/addPunishCaseArticle', data, function(result) {
			console.log(JSON.stringify(result));
			ejs.page.close({
				resultData: {
					key: 'addpublish'
				},
				success: function(result) {},
				error: function(error) {}
			});

		});
	}

	/**
	 * 获取管理依据
	 */
	function getBasicinfo() {
		var data = {
			itemguid: submitData.itemguid
		};

		ajaxCommon('checkInfo/getPunishCaseBasicList', data, function(result) {
			basicListArr = [];
			var data = result.custom.articlelist || [];
			if(data.length > 0) {
				$.each(data, function(i, val) {
					var obj = {
						text: val.management,
						value: val.rowguid,
						punishment: val.punishment
					}

					basicListArr.push(obj);
				});
			}
		});
	}

	/**
	 * 获取违法情节
	 */
	function getClauseList() {
		var data = {
			itemguid: submitData.itemguid
		};

		ajaxCommon('checkInfo/getPunishCaseClauseList', data, function(result) {
			clauseListArr = [];
			var data = result.custom.clauselist || [];
			if(data.length > 0) {
				$.each(data, function(i, val) {
					var obj = {
						text: val.clausename,
						value: val.rowguid
					}

					clauseListArr.push(obj);
				});
			}
		});
	}

	/**
	 * 获取处罚信息详情
	 */
	function getPunishCaseArticleDetail() {
		var data = {
			rowguid: rowGuid
		};

		ajaxCommon('checkInfo/getPunishCaseArticleDetail', data, function(result) {
			console.log(JSON.stringify(result));
			var data = result.custom || {};
			$('#name').val(data.targetname);
			$('#itemguid').val(data.itemname);
			$('#basicguid').val(data.management);
			$('#punishment').val(data.punishment);
			$('#clauseguid').val(data.clausename);
			$('#lowerlimit').val(data.lowerlimit);
			$('#upperlimit').val(data.upperlimit);
			$('#opinion').val(data.opinion);
			submitData.rowguid = data.rowguid;
			submitData.caseguid = data.caseguid;
			caseGuid = submitData.caseguid;
			submitData.targetguid = data.targetguid;
			submitData.itemguid = data.itemguid;
			submitData.basicguid = data.basicguid;
			submitData.clauseguid = data.clauseguid;
			submitData.punishvalue = data.punishvalue;
			submitData.opinion = data.opinion;
			getBasicinfo(); //获取管理依据
			getClauseList(); //获取违法情节
		});
	}

	/**
	 * 获取处罚信息更新
	 */
	function updatePunishCaseArticle() {
		var data = {
			rowguid: submitData.rowguid,
			caseguid: submitData.caseguid,
			targetguid: submitData.targetguid,
			itemguid: submitData.itemguid,
			basicguid: submitData.basicguid,
			clauseguid: submitData.clauseguid,
			punishvalue: submitData.punishvalue,
			involvednumber: '',
			opinion: submitData.opinion
		};

		ajaxCommon('checkInfo/updatePunishCaseArticle', data, function(result) {
			ejs.page.close();
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
				//				ejs.ui.showWaiting();
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