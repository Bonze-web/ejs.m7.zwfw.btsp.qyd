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
		behaviorGuid = Util.getExtraDataByKey('behaviorguid') || '';

	console.log(rowGuid);
	console.log(behaviorGuid);

	//编辑
	var caseGuid = Util.getExtraDataByKey('caseguid') || '',
		openType = Util.getExtraDataByKey('type') || '';

	var date = new Date();

	var xzqhArr = [], //所属区划
		categoryArr = [], //案件分类
		sourceArr = [], //案件来源
		userlistArr = [], //案件承办人数组
		currentTime = '', //当前时间
		submitData = {};

	var targetGuid = '', //处罚对象标识
		name = ''; //处罚对象名称
		
	var dutyguid = '',
		behaviorguid = '';

	var cfsxList = []; //处罚事项是否添加
	var num = 0; //主办人是否添加
	
	var type = '';

	Util.loadJs(
		'pages/common/formatfile.js',
		'js/widgets/mui.picker/mui.picker.css',
		'js/widgets/mui.poppicker/mui.poppicker.css',
		'js/widgets/mui.picker/mui.picker.js',
		'js/widgets/mui.poppicker/mui.poppicker.js',
		function() {
			Config.configReady([], function() {
				currentTime = getNowFormatDate();
				$('#registerdate').val(currentTime);

				if(openType == 'edit') {
					type = 'edit';
					submitData.caseguid = caseGuid;

					if(submitData.caseguid) {
						getCaseBaseinfo();
						getPunishCaseArticleList(); //获取处罚信息列表
						getPunishCaseAttachList(); //获取附件列表
						getPunishCaseHandlerList(); //获取案件承办人列表
					}
				} else {
					caseinfoInit(); //案件初始化

				}

				getAreaInfo(); //获取所属区域
				getCategory(); //获取案件来源
				getSource(); //获取案件来源
				getPunishCaseUserList(); //获取人员列表
				initListeners();

			}, function(err) {});
		});

	function initListeners() {
		$('body')
			//TODO 基本信息部分点击事件

			//添加处罚事项
			.on('tap', '#btn-addpublish', function() {
				var data = {
					targetguid: targetGuid,
					name: name,
					key: 'addpublish',
					caseguid: submitData.caseguid
				};

				ejs.page.open({
					pageUrl: './easycase_todo_add_penalties.html',
					pageStyle: 1,
					orientation: 1,
					data: data,
					success: function(result) {
						getPunishCaseArticleList(); //获取处罚信息列表
					},
					error: function(error) {}
				});
			})
			//添加相关材料
			.on('tap', '#btn-addfile', function() {
				var data = {
					caseguid: submitData.caseguid,
					key: 'addfile'
				};

				ejs.page.open({
					pageUrl: './easycase_todo_add_files.html',
					pageStyle: 1,
					orientation: 1,
					data: data,
					success: function(result) {
						getPunishCaseAttachList(); //获取附件列表
					},
					error: function(error) {}
				});
			})
			//保存
			.on('tap', '#btn-save', function() {
				//调用保存接口
				if(dataCheck()) {
					update();
				}
			})
			//所属区域
			.on('tap', '#xzqh', function() {
				var self = this;
				ejs.ui.popPicker({
					layer: 1,
					data: xzqhArr,
					success: function(result) {
						console.log(result);

						$(self).val(result.items[0].text);
						submitData.xzqhguid = result.items[0].value;

					},
					error: function(err) {}
				});
			})
			//获取案件分类
			.on('tap', '#category', function() {
				var self = this;
				ejs.ui.popPicker({
					layer: 1,
					data: categoryArr,
					success: function(result) {
						console.log(result);

						$(self).val(result.items[0].text);
						submitData.categoryguid = result.items[0].value;

					},
					error: function(err) {}
				});
			})
			//案件来源 
			.on('tap', '#source', function() {
				var self = this;
				ejs.ui.popPicker({
					layer: 1,
					data: sourceArr,
					success: function(result) {
						console.log(result);

						$(self).val(result.items[0].text);
						submitData.source = result.items[0].value;

					},
					error: function(err) {}
				});
			})
			//案发时间 
			.on('tap', '#occurdate', function() {
				var self = this,
					dateTime = currentTime.split(' ')[0] + ' ' + date.getHours() + ':' + date.getMinutes();

				ejs.ui.pickDateTime({
					title1: '选择日期',
					title2: '选择时间',
					datetime: dateTime,
					success: function(result) {
						console.log(result.datetime);
						console.log(currentTime)
						
						var choosetime = new Date(Date.parse((result.datetime + ':00').replace(/-/g,"/"))).getTime();
						var satime = new Date(Date.parse((currentTime).replace(/-/g,"/"))).getTime();
//						var choosetime = new Date('2020/03/15 08:00:00');
//						var satime = new Date('2020/03/16 08:00:00');
						console.log(choosetime,satime);
						if(choosetime > satime) {
							$(self).val('');
							ejs.ui.toast('请选择受案日期之前的时间');
							return;
						}
						$(self).val(result.datetime + ':00');
						submitData.occurdate = result.datetime + ':00';
					},
					error: function(err) {}
				});
			})
			//添加主办人
			.on('tap', '#btn-addhost', function() {
				if(num >= 1){
					ejs.ui.toast('最多添加一个主办人');
					return;
				}
				var self = this;
				ejs.ui.popPicker({
					layer: 1,
					data: userlistArr,
					success: function(result) {
						console.log(result);

						/*$(self).val(result.items[0].text);
						submitData.source = result.items[0].value;*/
						addPunishCaseHandler('01', result.items[0].value, result.items[0].text);

					},
					error: function(err) {}
				});
			})
			//添加协办人
			.on('tap', '#btn-addhelp', function() {
				var self = this;
				ejs.ui.popPicker({
					layer: 1,
					data: userlistArr,
					success: function(result) {
						console.log(result);

						addPunishCaseHandler('02', result.items[0].value, result.items[0].text);

					},
					error: function(err) {}
				});
			});

		//处罚事项列表-编辑/删除
		$('#publish-listdata')
			//编辑
			.on('tap', '.edit-action', function() {
				var guid = this.dataset.rowguid,
					data = {
						rowguid: guid,
						type: 'edit'
					};

				ejs.page.open({
					pageUrl: './easycase_todo_add_penalties.html',
					pageStyle: 1,
					orientation: 1,
					data: data,
					success: function(result) {
						getPunishCaseArticleList(); //获取处罚信息列表
					},
					error: function(error) {}
				});
			})
			//删除处罚事项
			.on('tap', '.del-action', function() {
				var self = this,
					articleguid = self.dataset.rowguid;

				ejs.ui.confirm({
					title: '提示信息',
					message: '是否删除该处罚事项?',
					buttonLabels: ['取消', '确定'],
					cancelable: 1,
					success: function(result) {
						var btnWhich = result.which;
						if(btnWhich == 1) {
							var targetDom = self.parentNode.parentNode.parentNode;
							//删除案件接口
							deletePunishCaseArticle(articleguid, targetDom);

						}
					},
					error: function(err) {}
				});
			});

		//案件相关材料-删除
		$('#files-listdata').on('tap', '.file-del', function() {
			var self = this,
				attachguid = self.dataset.rowguid;

			ejs.ui.confirm({
				title: '提示信息',
				message: '是否删除该材料?',
				buttonLabels: ['取消', '确定'],
				cancelable: 1,
				success: function(result) {
					var btnWhich = result.which;
					if(btnWhich == 1) {
						var targetDom = self.parentNode;
						//删除案件接口
						deletePunishCaseAttach(attachguid, targetDom);
					}
				},
				error: function(err) {}
			});
		});

		//案件主办人-删除
		$('#host-listdata').on('tap', '.file-del', function() {
			var self = this,
				handlerguid = self.dataset.rowguid;

			ejs.ui.confirm({
				title: '提示信息',
				message: '是否删除该主办人?',
				buttonLabels: ['取消', '确定'],
				cancelable: 1,
				success: function(result) {
					var btnWhich = result.which;
					if(btnWhich == 1) {
						var targetDom = self.parentNode;
						//删除案件接口
						deletePunishCaseHandler(handlerguid, targetDom, 'zb');
					}
				},
				error: function(err) {}
			});
		});

		//案件协办人-删除
		$('#help-listdata').on('tap', '.file-del', function() {
			var self = this,
				handlerguid = self.dataset.rowguid;

			ejs.ui.confirm({
				title: '提示信息',
				message: '是否删除协办人?',
				buttonLabels: ['取消', '确定'],
				cancelable: 1,
				success: function(result) {
					var btnWhich = result.which;
					if(btnWhich == 1) {
						var targetDom = self.parentNode;
						//删除案件接口
						deletePunishCaseHandler(handlerguid, targetDom,'xb');
					}
				},
				error: function(err) {}
			});
		});
	}

	/**
	 * @description 初始化
	 */
	function caseinfoInit() {
		var data = {
			dutyguid: rowGuid,
			behaviorguid: behaviorGuid
		};

		ajaxCommon('checkInfo/punishCaseInfoInit', data, function(result) {

			console.log(JSON.stringify(result));
			var data = result.custom || {};

			submitData.caseguid = data.caseguid;

			console.log('submitData.caseguid:' + submitData.caseguid)

			if(submitData.caseguid) {
				$('#registrantouname').val(data.registrantouname);
				$('#registrantusername').val(data.registrantusername);
				targetGuid = data.targetguid;
				name = data.name;
				submitData.dutyguid = data.dutyguid;
				submitData.behaviorguid  = data.behaviorguid;
				submitData.targetguid  = data.targetguid;

				getPunishCaseArticleList(); //获取处罚信息列表
				getPunishCaseAttachList(); //获取附件列表
				getPunishCaseHandlerList(); //获取案件承办人列表
			}

		});
	}
	/**
	 * @description 获取案件分类
	 */
	function getCategory() {

		ajaxCommon('checkInfo/getPunishCategoryList', {}, function(result) {
			var data = result.custom.categorylist || [];
			if(data.length > 0) {
				$.each(data, function(i, val) {
					var obj = {
						text: val.categoryname,
						value: val.rowguid
					}

					categoryArr.push(obj);
				});
			}
		});
	}

	/**
	 * @description 获取所属区域
	 */
	function getAreaInfo() {

		ajaxCommon('checkInfo/getPunishAreaList', {}, function(result) {
			var data = result.custom.arealist || [];
			if(data.length > 0) {
				$.each(data, function(i, val) {
					var obj = {
						text: val.xzqhname,
						value: val.rowguid
					}

					xzqhArr.push(obj);
				});
			}
		});
	}

	/**
	 * @description 获取案件来源
	 */
	function getSource() {
		var data = {
			codename: '处罚-案件来源'
		}

		ajaxCommon('commonInter/getCodeInfoList', data, function(result) {
			var data = result.custom.codelist || [];
			if(data.length > 0) {
				$.each(data, function(i, val) {
					var obj = {
						text: val.itemtext,
						value: val.itemvalue
					}

					sourceArr.push(obj);
				});
			}
		});
	}

	/**
	 * @description 获取案件基本信息
	 */
	function getCaseBaseinfo() {
		var data = {
			caseguid: caseGuid
		}

		ajaxCommon('checkInfo/punishCaseInfoDetail', data, function(result) {
			var data = result.custom || {};

			$('#xzqh').val(data.xzqh); //行政区划  
			submitData.xzqhguid = data.xzqhguid;
			$('#source').val(data.source); //案件来源   
			submitData.source = data.sourcevalue;
			$('#registrantouname').val(data.registerou); //受理单位 
			$('#registrantusername').val(data.registeruser); //登记人员 
			$('#registerdate').val(data.registerdate); //受案时间
			$('#occurdate').val(data.occurdate); //案发时间
			submitData.occurdate = data.occurdate;
			$('#occuraddress').val(data.occuraddress); //案发地点
			submitData.occuraddress = data.occuraddress;
			$('#category').val(data.category); //案件分类
			submitData.categoryguid = data.categoryguid;
			$('#summary').val(data.summary); //案情摘要
			submitData.summary = data.summary;
			$('#losssitiation').val(data.losssitiation); //损失情况
			submitData.losssitiation = data.losssitiation;
			targetGuid = data.targetguid;
			name = data.name;
			currentTime = data.registerdate;

		});
	}

	/**
	 * @description 获取处罚事项信息
	 */
	function getPunishCaseArticleList() {
		var data = {
			caseguid: submitData.caseguid
		}

		ajaxCommon('checkInfo/getPunishCaseArticleList', data, function(result) {
			var data = result.custom || {},
				template = Mustache.render($("#publish-template").html(), data);

			doc.getElementById('publish-listdata').innerHTML = template;

			cfsxList = result.custom.categorylist;
		});
	}

	/**
	 * @description 处罚事项信息-删除
	 */
	function deletePunishCaseArticle(articleguid, targetDom) {
		var data = {
			articleguid: articleguid
		}

		ajaxCommon('checkInfo/deletePunishCaseArticle', data, function(result) {
			$(targetDom).remove();
			getPunishCaseArticleList();
		});
	}

	/**
	 * @description 获取附件列表
	 */
	function getPunishCaseAttachList() {
		var data = {
			caseguid: submitData.caseguid,
			type : type
		}

		ajaxCommon('checkInfo/getPunishCaseAttachList', data, function(result) {
			var data = result.custom || {},
				template = '',
				dataArr = data.clauselist;

			if(data.clauselist && data.clauselist.length > 0) {
				$.each(data.clauselist, function(i, val) {
					val.fileicon = FormatFile.getFileIcon(val.filename)
				});
			}

			template = Mustache.render($("#file-template").html(), data);

			doc.getElementById('files-listdata').innerHTML = template;
		});
	}

	/**
	 * @description 附件-删除
	 */
	function deletePunishCaseAttach(attachguid, targetDom) {
		var data = {
			attachguid: attachguid
		}

		ajaxCommon('checkInfo/deletePunishCaseAttach', data, function(result) {
			$(targetDom).remove();
		});
	}

	/**
	 * @description 获取案件承办人列表
	 */
	function getPunishCaseHandlerList() {
		var data = {
			caseguid: submitData.caseguid
		}

		ajaxCommon('checkInfo/getPunishCaseHandlerList', data, function(result) {
			var data = result.custom || {},
				hostArr = [],
				helpArr = [],
				hostTemp = '',
				helpTemp = '',
				dataArr = data.handlerlist;

			if(dataArr && dataArr.length > 0) {
				$.each(dataArr, function(i, val) {
					var dutytype = val.dutytype,
						rowguid = val.rowguid,
						username = val.username,
						obj = {
							rowguid: rowguid,
							username: username
						};

					if(dutytype == '01' || dutytype == '主办人') {
						hostArr.push(obj);
						num++;
					} else {
						helpArr.push(obj);
					}

				});
			}

			data.hostlist = hostArr;
			data.helplist = helpArr;

			helpTemp = Mustache.render($("#help-template").html(), data);
			hostTemp = Mustache.render($("#host-template").html(), data);
			doc.getElementById('host-listdata').innerHTML = hostTemp;
			doc.getElementById('help-listdata').innerHTML = helpTemp;
		});
	}

	/**
	 * @description 承办人-删除
	 */
	function deletePunishCaseHandler(handlerguid, targetDom,type) {
		var data = {
			handlerguid: handlerguid
		}

		ajaxCommon('checkInfo/deletePunishCaseHandler', data, function(result) {
			$(targetDom).remove();
			if(type == 'zb'){
				num--;
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

	/**
	 * 数据验证
	 */
	function dataCheck() {
		submitData.registerdate = $('#registerdate').val(); //受案日期
		submitData.occuraddress = $('#occuraddress').val(); //案发地点
		submitData.summary = $('#summary').val(); //案情摘要
		submitData.losssitiation = $('#losssitiation').val(); //损失情况

		//所属区域
		if(submitData.xzqhguid == undefined) {
			ejs.ui.toast('请选择所属区域！');
			return false;
		}

		//案件来源 
		if(submitData.source == undefined) {
			ejs.ui.toast('请选择案件来源！');
			return false;
		}

		//案发时间 
		if(submitData.occurdate == undefined) {
			ejs.ui.toast('请选择案发时间！');
			return false;
		}

		//案发地点
		if(submitData.occuraddress == '') {
			ejs.ui.toast('请输入案发地点！');
			return false;
		}

		//案件分类
		if(submitData.categoryguid == undefined) {
			ejs.ui.toast('请选择案件分类！');
			return false;
		}

		//案情摘要
		if(submitData.summary == '') {
			ejs.ui.toast('请输入案情摘要！');
			return false;
		}

		//损失情况
		if(submitData.losssitiation == '') {
			ejs.ui.toast('请输入危害损失情况！');
			return false;
		}
		if(cfsxList.length == 0) {
			ejs.ui.toast('请添加处罚事项！');
			return false;
		}
		if(num == 0) {
			ejs.ui.toast('请添加主办人！');
			return false;
		}
		submitData.finalsubmit = '1';

		return true;
	}

	/**
	 * @description 简易案件更新
	 */
	function update() {
		console.log(submitData)

		var data = submitData;
		
		var url = '';
		if(openType == 'edit') {
			url = 'checkInfo/punishCaseInfoUpdate';
		}else{
			url = 'checkInfo/punishCaseInfoAdd';
		}

		ajaxCommon(url, data, function(result) {
			ejs.ui.toast('保存成功！');

			if(openType == 'edit') {
				ejs.page.close({
					// 也支持传递字符串
					resultData: {
						type: 'edit',
					},
					success: function(result) {},
					error: function(error) {}
				});
			} else {
				ejs.page.close({
					// 也支持传递字符串
					resultData: {
						key: 'resume'
					},
					popPageNumber: 2,
					success: function(result) {},
					error: function(error) {}
				});
			}
		});
	}

	/**
	 * @description 获取案件承办人列表
	 */
	function getPunishCaseUserList() {

		ajaxCommon('checkInfo/getPunishCaseUserList', {}, function(result) {
			var data = result.custom.userlist || [];
			if(data.length > 0) {
				$.each(data, function(i, val) {
					var obj = {
						text: val.displayname,
						value: val.rowguid
					}

					userlistArr.push(obj);
				});
			}
		});
	}

	/**
	 * @description 案件承办人-新增  主办人-01  协办人-02
	 */
	function addPunishCaseHandler(dutytype, userguid, username) {

		var data = {
			caseguid: submitData.caseguid,
			dutytype: dutytype,
			userguid: userguid,
			handlertype: '010'
		}

		ajaxCommon('checkInfo/addPunishCaseHandler', data, function(result) {
			var outPut = {
					username: username,
					rowguid: result.custom.rowguid
				},
				template = Mustache.render($("#host-template-add").html(), outPut);

			if(dutytype == '01') {
				$('#host-listdata').prepend(template);
				num++;
			} else {
				$('#help-listdata').prepend(template);
			}
		});
	}

	/**
	 * 获取当前时间
	 */
	function getNowFormatDate() {
		var date = new Date();

		var seperator1 = "-",
			seperator2 = ":",
			month = date.getMonth() + 1,
			strDate = date.getDate();

		var hour = date.getHours(),
			minute = date.getMinutes(),
			second = date.getSeconds();

		if(month >= 1 && month <= 9) {
			month = '0' + month;
		}
		if(strDate >= 0 && strDate <= 9) {
			strDate = '0' + strDate;
		}
		if(hour < 10) {
			hour = '0' + hour;
		}
		if(minute < 10) {
			minute = '0' + minute;
		}
		if(second < 10) {
			second = '0' + second;
		}
		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
			" " + hour + seperator2 + minute + seperator2 + second;

		return currentdate;
	}
})(document, window.Util);