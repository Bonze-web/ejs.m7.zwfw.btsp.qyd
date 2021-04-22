/**
 * 作者: 沈凡琪
 * 创建时间: 2019/01/15
 * 版本: [1.0, 2019/01/15 ]
 * 版权: 江苏国泰新点软件有限公司
 * 描述: 自定义通用工具
 */
'use strict';

var common = window.common || (function(exports) {

	/**
	 * commonAjax 通用ajax请求
	 * @param {Function} callback 回调
	 */
	exports.commonAjax = function(url, data, callback) {
		console.log(JSON.stringify(data))
		Util.ejs.ui.showWaiting();
		Util.ajax({
			url: url,
			data: JSON.stringify(data),
			type: 'POST',
			contentType: 'application/json',
			success: function(response) {
				Util.ejs.ui.closeWaiting();
				if (response.status.code != '200') {
					Util.ejs.ui.toast(response.status.text);
					return;
				};
				if (response.custom.code != '1') {
					Util.ejs.ui.toast(response.custom.text);
					return;
				};

				return callback(response) && callback;
			},
			error: function(error) {
				Util.ejs.ui.closeWaiting();
				Util.ejs.ui.toast('error' + JSON.stringify(error));
			}
		});

	};
	/*
	 * 日期格式转换
	 */
	exports.transferDate = function(date) {

		// 年  
		var year = date.getFullYear();
		// 月  
		var month = date.getMonth() + 1;
		// 日  
		var day = date.getDate();

		if (month >= 1 && month <= 9) {

			month = "0" + month;
		}
		if (day >= 0 && day <= 9) {

			day = "0" + day;
		}

		var dateString = year + '-' + month + '-' + day;

		return dateString;
	};
	/*
	 * 获取token
	 */
	exports.getToken = function(callbck) {
		Util.ajax({
			url: url,
			data: JSON.stringify({

			}),
			type: 'POST',
			contentType: 'application/json;charset=UTF-8',
			success: function(response) {
				if (response.status.Code != 200) {
					Util.ejs.ui.toast(response.status.text);
					return;
				};
				if (response.custom.code != '1') {
					Util.ejs.ui.toast(response.custom.text);
					return;
				};

				return callback(response) && callback;
			},
			error: function(error) {
				Util.ejs.ui.closeWaiting();
				Util.ejs.ui.toast('error' + JSON.stringify(error));
			}
		});

	};
	//处理姓名
	exports.handleName = function(str) {
		var _str_Start = str[str.length - 1]; // 最后一个字符
		var star = "";
		for (var i = 0; i < (str.length - 1); i++) {
			star += "*";
		};
		var _str_Res = star + _str_Start;
		if (str == '') {
			_str_Res = "";
		}
		return _str_Res;
	};

	//处理身份证
	exports.handleId = function(str) {
		var _str_Start = str.substr(0, 1);
		var _str_End = str.substr(17, 1);
		var _ss = function() {
			var s = "";
			for (var i = 0; i < (str.length - 2); i++) s += "*";
			return s;
		};
		var _str_Res = _str_Start + _ss() + _str_End;
		if (str == '') {
			_str_Res = '';
		}
		return _str_Res;
	};

	//处理手机号
	exports.handlePhone = function(str) {
		var _str_Start = str.substr(0, 3);
		var _str_End = str.substr(7, 4);
		var _ss = function() {
			var s = "";
			for (var i = 0; i < (str.length - 7); i++) s += "*";
			return s;
		};
		var _str_Res = _str_Start + _ss() + _str_End;
		if (str == '') {
			_str_Res = '';
		}
		return _str_Res
	};
	/*
	 * 4.2.2、获取事项多情形的场景展示接口（已通过本地测试）
	 * 测试：电影放映经营许可证核发（内资）cf0ea142-926b-4f27-81e3-a7252ebb5ffb
	 */
	exports.isHaveElemen = function(param, callback) {
		Util.ejs.ui.showWaiting(" ");
		Util.ajax({
			url: Config.eleUrl + 'zwdtTask/getTaskElement',
			data: JSON.stringify({
				"token": "Epoint_WebSerivce_**##0601",
				"params": {
					"taskid": param // 非空,事项版本标识  taskid和item_id一样的
				}
			}),
			contentType: 'application/json;charset=UTF-8',
			success: function(result) {
				//			var result = {
				//				"status": {
				//					"code": 200,
				//					"text": ""
				//				},
				//				"custom": {
				//					"code": 1,
				//					"text": "事项要素获取成功",
				//					"type": "radio",
				//					"elementlist": [{
				//						"elementname": "测试情形一",
				//						"elementquestion": "[单选]测试情形一",
				//						"elementguid": "dc5c5bd0-6f5f-4de1-95f9-61e4c969c121",
				//						"optionlist": [{
				//							"optionname": "测试材料一",
				//							"optionguid": "f853da45-5374-46c8-afa6-02d9722bb3a2"
				//						}, {
				//							"optionname": "测试材料二",
				//							"optionguid": "4c389690-1a64-4984-b149-36af5872861a"
				//						}]
				//					}, {
				//						"elementname": "测试情形二",
				//						"elementquestion": "[单选]测试情形二",
				//						"elementguid": "dc5c5bd0-6f5f-4de1-95f9-61e4c969c121",
				//						"optionlist": [{
				//							"optionname": "测试材料三",
				//							"optionguid": "f853da45-5374-46c8-afa6-02d9722bb3a2"
				//						}, {
				//							"optionname": "测试材料四",
				//							"optionguid": "4c389690-1a64-4984-b149-36af5872861a"
				//						}]
				//					}]
				//				}
				//			};
				console.log("结果：" + JSON.stringify(result));
				if(result.custom.code == 0) {
					Util.ejs.ui.closeWaiting();
					Util.ejs.ui.toast(result.custom.text);
					return;
				};
				if(result.status.code == 0) {
					Util.ejs.ui.closeWaiting();
					Util.ejs.ui.toast(result.status.text);
					return;
				};
				var res = result.custom;
				var isHave = ''; // 1有 0没有
				if(res.elementlist && res.elementlist.length > 0) {
					window.localStorage.setItem('resEle', JSON.stringify(res));
					isHave = '1';
				} else {
					isHave = '0';
				};
				return callback && callback(isHave);
			}
		});
	};
	/*
	 * 4.2.4、获取情形唯一标识(即提交4.2.2)
	 */

	exports.getCaseGuid = function(data, callback) {
		Util.ejs.ui.showWaiting(" ");
		Util.ajax({
			url: Config.eleUrl + "zwdtTask/getCaseGuidBySelectedOptions",
			data: JSON.stringify({
				"token": "Epoint_WebSerivce_**##0601",
				"params": data
			}),
			contentType: 'application/json;charset=UTF-8',
			success: function(result) {
				console.log("结果：" + JSON.stringify(result));
				if(result.custom.code == 0) {
					Util.ejs.ui.closeWaiting();
					Util.ejs.ui.toast(result.custom.text);
					return;
				};
				if(result.status.code == 0) {
					Util.ejs.ui.closeWaiting();
					Util.ejs.ui.toast(result.status.text);
					return;
				};
				return callback && callback(result);
			}
		});

	};
	/**
	 * 4.3.2、初始化办件材料接口（已通过本地测试）
	 */
	exports.initMaterials = function(data, callback) {
		console.log(JSON.stringify(data))

		Util.ajax({
			url: Config.thisUrl + 'private/initProjectReturnMaterials',
			data: JSON.stringify(data),
			contentType: 'application/json;charset=UTF-8',
			success: function(result) {
				//	var result={"custom":{"projectguid":"73c9ee24-cb20-480c-802b-539d665e4cac","code":1,"materiallist":[{"certcode":"","necessary":"1","taskmaterialguid":"8a928c2a-1228-46d7-8617-f40af7bf5c3f","itemcode":"","ordernum":8,"clientguid":"55233a82-465a-4e95-ae14-0e634e20543b","projectmaterialguid":"37bec685-2494-43a8-bd65-165e1224dbba","type":20,"projectmaterialname":"电影放映单位设立申请表","status":10,"isonecert":"0"},{"certcode":"","necessary":"1","taskmaterialguid":"3a92ed00-ff24-4607-8a74-1b0f77685ee5","itemcode":"","ordernum":7,"clientguid":"bbc0396f-4a95-40a0-b0e7-d9356d925331","projectmaterialguid":"55ba6e6e-84f1-410c-8f66-39acbd867d83","type":20,"projectmaterialname":"法定代表人身份证","status":10,"isonecert":"0"},{"certcode":"","necessary":"1","taskmaterialguid":"f1fa8a24-9735-4433-9411-c9557d7bffe0","itemcode":"","ordernum":6,"clientguid":"30fdc8a9-2cfa-4e5f-a5a8-f2596c7a38e6","projectmaterialguid":"0697740b-84f2-4f27-ba06-d97ebacd77e4","type":20,"projectmaterialname":"电影放映设备清单","status":10,"isonecert":"0"},{"certcode":"","necessary":"1","taskmaterialguid":"f5436ab9-9478-46d7-8092-37a9959463ad","itemcode":"","ordernum":5,"clientguid":"adbcaca4-1c8e-41e3-9e65-d4c0fcd52c53","projectmaterialguid":"6616a274-1292-440e-a676-da17ed31e4c5","type":20,"projectmaterialname":"营业执照（副本）","status":10,"isonecert":"0"},{"certcode":"","necessary":"1","taskmaterialguid":"c34f564a-3bfb-4e22-8322-aebbe395f7cc","itemcode":"","ordernum":3,"clientguid":"3c94505a-6579-4271-9aff-3d4f42001ada","projectmaterialguid":"1de631d7-8b5d-43d6-9b66-a4d1f246154a","type":20,"projectmaterialname":"场地平面图","status":10,"isonecert":"0"},{"certcode":"","necessary":"1","taskmaterialguid":"42f462a3-8e0f-4269-a916-6e4c5be97271","itemcode":"","ordernum":2,"clientguid":"0ea9d7ff-bf18-45af-8f73-2e59c17b41bc","projectmaterialguid":"7a99d35a-c511-4aaa-a241-4151388682e0","type":20,"projectmaterialname":"消防安全检查合格证","status":10,"isonecert":"0"}],"text":"初始化办件成功"},"status":{"code":200,"text":""}}

				console.log("结果：" + JSON.stringify(result));
				if(result.custom.code == 0) {
					Util.ejs.ui.closeWaiting();
					Util.ejs.ui.toast(result.custom.text);
					return;
				};
				if(result.status.code == 0) {
					Util.ejs.ui.closeWaiting();
					Util.ejs.ui.toast(result.status.text);
					return;
				};
				Util.ejs.ui.closeWaiting();
				return callback && callback(result);
			}
		});

	};
	return exports;
})({});
