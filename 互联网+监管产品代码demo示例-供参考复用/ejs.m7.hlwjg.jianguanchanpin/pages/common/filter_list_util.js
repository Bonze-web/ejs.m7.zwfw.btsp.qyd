/**
 * 作者： 孙尊路
 * 创建时间： 2017/06/16 13:27:09
 * 版本： [1.0, 2017/6/16]
 * 版权： 江苏国泰新点软件有限公司
 * 描述： 筛选出列表选择组件
 */

"use strict";
var FilterListUtil = window.FilterListUtil || (function(exports, undefined) {
	
	//自定义菜单
	exports.toggleTabbarMenu = {
		// 变量
		variable: {
			tabarNode: document.querySelector('.em-tab-bar-list'),
			searchNode: document.querySelector('.em-advanced-search-wrapper'),
			maskNode: document.querySelector('.em-mask')
		},
		// 打开
		openTabbar: function() {
			var _this = this;
			//展开tabar
			_this.variable.tabarNode.classList.remove('em-transition-vertical-up');
			_this.variable.tabarNode.classList.add('em-transition-vertical-down');
			_this.variable.tabarNode.style.height = "100px";
			//其他层
			_this.variable.maskNode.style.display = "block";

		},
		closeTabbar: function() {
			var _this = this;
			//隐藏tabar
			_this.variable.tabarNode.classList.remove('em-transition-vertical-down');
			_this.variable.tabarNode.classList.add('em-transition-vertical-up');
			_this.variable.tabarNode.style.height = "0px";
			//其他层
			_this.variable.maskNode.style.display = "none";
		}
	};


	return exports;
})({});