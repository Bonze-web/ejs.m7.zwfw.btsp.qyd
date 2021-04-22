/**
 * 作者: 孙尊路
 * 创建时间: 2017/07/03
 * 版本: [2.0, 2017/07/03 ]
 * 版权: 江苏国泰新点软件有限公司
 * 描述: 字符串类拓展，完善框架字符串处理方法
 */
"use strict";

var string_extend = window.string_extend || (function(exports, undefined) {
	/**
	 * 正则表达式验证
	 */
	function checkReg(reg, str) {
		if(!str) {
			return false;
		}
		if(reg.test(str) == true) {
			return true;
		}

		return false;
	}
	/**
	 * 是否存在非法字符
	 * @param {string} str 需要判断输入的字符串
	 * @return {String} 返回过滤后的结果,true存在；false不存在
	 */
	exports.isExcludeSpecial = function(str) {
		var reg = /[^\?\<\>\"\:\)\(\^\$\!\~\！\@\#\￥\%\……\&\*\（\）\——\+\{\}\|\：\“\”\《\》\？\`\[\]\·\-\=【】、；‘’，。、a-zA-Z0-9\_\u4e00-\u9fa5]/;
		return checkReg(reg, str);
	};
	/**
	 * 过滤非法字符，过滤特殊字符与转义字符
	 * @param {string} str 需要过滤的字符串
	 * @return {String} 返回过滤后的结果
	 */
	exports.excludeSpecial = function(str, reg) {
		if(!str) {
			return str;
		}

		// 去掉转义字符 与特殊字符  ，其实有另一种思路就是只提取合法的
		reg = reg || /[\\\/\b\f\n\r\t`~!@#$^&%*()=\|{}+《》':;',\[\].<>\/?~！@#￥……&*（）——【】‘’；：”“'。，、？]/g;
		str = str.replace(reg, '');

		return str;
	};

	/**
	 * @description 获取字符串长度（汉字算两个字符，字母数字算一个）
	 * @param {Object} val  字符串
	 * @return len 字符串的长度
	 */
	exports.getByteLenByChar = function(val) {
		var len = 0;
		len = (parseInt(val.length)).toString();
		return len;
	};
	/**
	 * @description 按升序或降序将json数组排序
	 * @param {Object} tmpInfo json数组
	 * @param {Object} param 排序字段
	 * @param {Object} c 降序或者升序 up  down //不传默认按照升序排序
	 */
	exports.SortBy = function(dataJson, param, c) {
		var tmpInfo = [];
		var down = function(x, y) {
			return(eval("x." + param) > eval("y." + param)) ? -1 : 1
		}; //通过eval对json对象的键值传参
		var up = function(x, y) {
			return(eval("x." + param) < eval("y." + param)) ? -1 : 1
		};
		if(c == "down") {
			tmpInfo = dataJson.sort(down);
		} else {
			tmpInfo = dataJson.sort(up); //默认按照升序排序
		}
		return tmpInfo;
	};
	/**
	 * @description  截取字符串，存进数组
	 * @param {Object} str 字符串比如："str;str2;str3;str4;str5;"
	 * @param {Object} regex 正则表达式
	 */
	exports.splitString = function(str, regex) {
		var len = parseInt(str.length - 1);
		if("-1" !== len) {
			var newStr = str.substring(0, len);
			var splitArray = newStr.split(regex);
		}
		//console.log("测试" + JSON.stringify(splitArray));
		return splitArray;
	};

	/**
	 *  @description  截取选择通讯录人员列表数据
	 * @param {Object} keys str 字符串比如："key;key2;key3;key4;key5;"
	 * @param {Object} values str 字符串比如："value;value2;value3;value4;value5;"
	 */
	exports.getSpitList = function(keys, values) {
		var tmpInfo = [];
		if(keys && values) {
			var tmpKeys = exports.splitString(keys, /;/);
			var tmpValues = exports.splitString(values, /;/);
			for(var i = 0; i < tmpKeys.length; i++) {
				tmpInfo.push({
					userguid: tmpValues[i],
					username: tmpKeys[i]
				});
			}
		}
		return tmpInfo;
	};

	/**
	 * @description 该方法用于去除html标签，图片，换行，回车等
	 * @param {Object} htmlStr 富文本字符串
	 */
	exports.removeHtmlTag = function(htmlStr) {
		var htmlStr = htmlStr.replace(/(\n)/g, "");
		htmlStr = htmlStr.replace(/(\t)/g, "");
		htmlStr = htmlStr.replace(/(\r)/g, "");
		htmlStr = htmlStr.replace(/<\/?[^>]*>/g, "");
		htmlStr = htmlStr.replace(/\s*/g, "");
		return htmlStr;
	};
	/**
	 * 兼容require
	 */
	if(typeof module != 'undefined' && module.exports) {
		module.exports = exports;
	} else
	if(typeof define == 'function' && (define.amd || define.cmd)) {
		define(function() {
			return exports;
		});
	}

	return exports;
})({});