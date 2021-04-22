/**
 * 作者 :戴科
 * 创建时间 :2017/05/23 21:37:21
 * 版本 :[1.0, 2017/5/23]
 * 版权：江苏国泰新点软件有限公司
 * 描述：
 */

"use strict";
var CommonajaxTools = window.CommonajaxTools || (function(exports, undefined) {
	var debug = false;
	/**
	 * 通用的ajax请求
	 * @param {Object} url请求路径
	 * @param {Object} token 请求的服务器验证
	 * @param {Object} data 
	 * @param {Object} successcallback
	 */

	exports.commonajax = function(realurl, data, successcallback) {
		ejs.oauth.getToken(function(result, msg, detail) {
			var token = result.token;
			var url = realurl;
			var requestData = {};
			//动态校验字段

			requestData.token = token;
			requestData.params = data;
			requestData = JSON.stringify(requestData);
			console.log(requestData);
			if (debug) {
				ejs.nativeUI.showDebugDialog('请求数据:' + requestData + realurl);
				console.log('请求数据:' + requestData + url);
			}
			Util.ajax({
				url: url,
				data: requestData,
				dataType: "json",
				type: "POST",
				contentType: 'application/json;charset=UTF-8',
				success: function(response) {
					if (debug) {
						ejs.nativeUI.showDebugDialog(JSON.stringify(response));
						console.log(JSON.stringify(response));
					}
					if (response.status.code == "0") {
						ejs.nativeUI.closeWaiting();
						ejs.nativeUI.toast(response.status.text);
						return false;
					}
					successcallback(response);

				},
				error: function(response) {
					console.log('请求失败');
					console.log(JSON.stringify(response));
					if (debug) {
						ejs.nativeUI.showDebugDialog(JSON.stringify(response));
					} else {
						ejs.nativeUI.toast('网络链接超时！');
					}

				}
			});
		});

	}

	/**
	 * 根据openId拿到用户信息
	 * @param {Object} url请求路径
	 * @param {Object} token 请求的服务器验证
	 * @param {Object} data 
	 * @param {Object} successcallback
	 */
	exports.getUserInfo = function(data, successcallback) {
		var token = "";
		var url = 'http://192.168.105.77:8070/cns-web-rest/rest/ouframeuserwx/getUserInfoByOpenId';
		var requestData = {};
		//动态校验字段
		requestData.token = token;
		requestData.params = data;
		requestData = JSON.stringify(requestData);
		console.log('请求数据:' + requestData + url);
		Util.ajax({
			url: url,
			data: requestData,
			dataType: "json",
			type: "POST",
			contentType: 'application/json;charset=UTF-8',
			success: function(response) {
				console.log(JSON.stringify(response))

				if (response.status.code == "0") {
					ejs.nativeUI.toast(response.status.text);
					return false;
				} else if (response.status.code == '1' && response.custom.userGuid != "") {
					var userGuid = response.custom.userGuid;
					var ouGuid = response.custom.ouGuid;
					successcallback(userGuid, ouGuid);
				}

			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});

	};

	/**
	 * oa登录
	 * @param {Object} url请求路径
	 * @param {Object} token 请求的服务器验证
	 * @param {Object} data 
	 * @param {Object} successcallback
	 */
	exports.oaAjax = function(realurl, data, successcallback) {
		ejs.oauth.getToken(function(result, msg, detail) {
			var token = result.token;
			var url = realurl;
			var requestData = {};
			//动态校验字段
			requestData.ValidateData = token;
			requestData.paras = data;
			requestData = JSON.stringify(requestData);
			console.log('请求数据:' + requestData + url);
			//			if(debug) {
			//				ejs.nativeUI.showDebugDialog('请求数据:' + requestData + realurl);
			//				 
			//			}
			Util.ajax({
				url: url,
				data: requestData,
				dataType: "json",
				type: "POST",
				contentType: 'application/json;charset=UTF-8',
				success: function(response) {
					console.log(JSON.stringify(response))
						//					if(debug) {
						//						ejs.nativeUI.showDebugDialog(JSON.stringify(response));
						//						console.log(JSON.stringify(response));
						//					}
					if (response.ReturnInfo.Code == "0") {
						ejs.nativeUI.toast(response.ReturnInfo.Description);
						return false;
					}
					successcallback(response);

				},
				error: function(response) {
					console.log('请求失败');
					console.log(JSON.stringify(response));
					//					if(debug) {
					//						ejs.nativeUI.showDebugDialog(JSON.stringify(response));
					//					} else {
					//						ejs.nativeUI.toast('网络链接超时！');
					//					}

				}
			});
		});
	};
	/**
	 * 是否绑定
	 * @param {Object} url请求路径
	 * @param {Object} token 请求的服务器验证
	 * @param {Object} data 
	 * @param {Object} successcallback
	 */
	exports.isBind = function(data, successcallback) {
		var url = 'http://192.168.105.77:8070/cns-web-rest/rest/ouframeuserwx/checkUserBind';
		var requestData = {};
		//动态校验字段
		requestData.token = "";
		requestData.params = data;
		requestData = JSON.stringify(requestData);
		console.log('请求数据:' + requestData + url);
		Util.ajax({
			url: url,
			data: requestData,
			dataType: "json",
			type: "POST",
			contentType: 'application/json;charset=UTF-8',
			success: function(response) {
				console.log(JSON.stringify(response));
				if (response.custom.bindStatus) {
					var bindStatus = response.custom.bindStatus;
					if (response.status.code == '1' && response.custom.bindStatus == '1') {
						console.log('已经绑定过啦');
						//						mui.toast(response.status.text);

						successcallback(bindStatus);
					} else {
						successcallback(bindStatus);
					}
				} else {
					mui.toast(response.status.text);
				}

			},
			error: function(response) {
				console.log('请求失败');
				mui.toast(response.status.text);
				console.log(JSON.stringify(response));
			}
		});

	};
	/*
	 * 通用ajax
	 * shenfq
	 */
	exports.ajaxCom = function(url, requestData, callback) {
		Util.ajax({
			url: url,
			data: requestData,
			dataType: "json",
			type: "POST",
			contentType: 'application/json;charset=UTF-8',
			success: function(response) {
				//				console.log(JSON.stringify(response))
				if (response.status.code == "0") {
					ejs.nativeUI.toast(response.status.text);
					return;
				};
				if (response.custom.code == '0') {
					ejs.nativeUI.toast(response.custom.text);
					return;
				};
				callback(response);

			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});
	};
	/*
	 * 全局替换指定字符replace(/-/g, '')
	 * shenfq 
	 * 这边主要时间2018-1-17 23:11:59换变成2019/01/14 16:18:59
	 */
	exports.replaceStr = function(str) {
		return str.replace(/-/g, '/');
	};
	/*
	 * 倒计时dates:2019/01/14 16:18:59
	 * 天-时-分-秒
	 * shenfq
	 */
	exports.countDown = function(dates, index, callback) {
		function down() {
			var EndTime = new Date(dates); // 结束时间
			var NowTime = new Date(); // 当前时间
			var t = EndTime.getTime() - NowTime.getTime(); // 转成毫秒数相减
			// console.log("t" + t);

			// 转换
			var d = parseInt(t / 1000 / 60 / 60 / 24), // 换算天
				h = parseInt(t / 1000 / 60 / 60 % 24), // 换算小时
				m = parseInt(t / 1000 / 60 % 60), // 换算分
				s = parseInt(t / 1000 % 60); // 换算秒

			// 处理成01 、11格式
			d < 10 ? d = '0' + d : d = d; // 天
			h < 10 ? h = '0' + h : h = h; // 时
			m < 10 ? m = '0' + m : m = m; // 分
			s < 10 ? s = '0' + s : s = s; // 秒
			//console.log(d + '天' + h + '时' + m + '分' + s + '秒');

			// 结束了就清除
			if (t < 0) {
				clearTimeout(down);
				return false;
			};
			setTimeout(down, 1000);

			// 排行榜页面添加样式
			if (index == "排行榜") {
				var tem = '<span>剩余  </span>' + d + '<span>天   </span>' + h + '<span>时</span> ' + m + '<span>分</span> ' + s + '<span>秒</span>';
				return callback(tem) && callback;
			};
			// 首页添加样式
			if (index == "首页") {
				var tem = '距离<span>活动结束:</span><span>' + d + '</span>天<span>' + h + '</span>时<span>' + m + '</span>分<span>' + s + '</span>秒';
				return callback(tem) && callback;
			};

			var tem = d + '天' + h + '时' + m + '分' + s + '秒';
			return callback(tem) && callback;

		};

		down();
	};

	return exports;

})({});