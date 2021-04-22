/**
 * 作者：丁力
 * 创建时间：2019-9-7 20:58:354
 * 版本：[1.0, 2019-9-7]
 * 版权：江苏国泰新点软件有限公司
 * 描述：监管事项
 **/
'use strict';

Util.loadJs([
	'pages/common/common.js',
], function() {
	customBiz.configReady();
});

/**
 * @description 所有业务处理
 */
var customBiz = {
	// 初始化校验，必须调用
	// 注，如果没有组件API需要注册，可以传空，注册组件时，必须容器支持对应组件才能注册成功
	configReady: function() {
		var self = this;

		Config.configReady(null, function() {
			self.initListeners();
		}, function(error) {});

	},
	initListeners: function() {
		var self = this;

		self.catalogid = Util.getExtraDataByKey('catalogid') || '';
		self.rowguid = Util.getExtraDataByKey('rowguid') || '';
		self.superviseitemcode = Util.getExtraDataByKey('superviseitemcode') || '';

		self.getDetail();


		// 头部切换
		Zepto('.em-tab-list').on('tap', 'li', function() {
			var _this = this;
			self.type = Zepto(_this).attr('type');
			Zepto(_this).addClass('em-active').siblings().removeClass('em-active');
			self.getDetail();
		});


		var obtn = document.querySelector('.em-totop'); //获取回到顶部按钮的ID
		var clientHeight = document.documentElement.clientHeight; //获取可视区域的高度
		var timer = null; //定义一个定时器
		var isTop = true; //定义一个布尔值，用于判断是否到达顶部
		window.onscroll = function() { //滚动条滚动事件

			//获取滚动条的滚动高度
			var osTop = document.documentElement.scrollTop || document.body.scrollTop;

			if (osTop >= clientHeight) { //如果滚动高度大于可视区域高度，则显示回到顶部按钮
				obtn.style.display = 'block';
			} else { //否则隐藏
				obtn.style.display = 'none';
			}

			//主要用于判断当 点击回到顶部按钮后 滚动条在回滚过程中，若手动滚动滚动条，则清除定时器
			if (!isTop) {
				clearInterval(timer);
			}
			isTop = false;
		}

		//回到顶部
		Zepto('.mui-content').on('tap', '.em-totop', function() {
			//设置一个定时器
			timer = setInterval(function() {
				//获取滚动条的滚动高度
				var osTop = document.documentElement.scrollTop || document.body.scrollTop;
				//用于设置速度差，产生缓动的效果
				var speed = Math.floor(-osTop / 6);
				document.documentElement.scrollTop = document.body.scrollTop = osTop + speed;
				isTop = true; //用于阻止滚动事件清除定时器
				if (osTop == 0) {
					clearInterval(timer);
				}
			}, 30);
		});



	},
	//	获取详情
	getDetail: function() {
		var self = this;
		var url = Config.serverUrl + 'checkInfo/getCheckCatalogDetail';
		var data = {
			"catalogid": self.catalogid
		}
		if (self.type == '1') {
			url = Config.serverUrl + 'checkInfo/getCheckItemDetail';
			data = {
				"itemguid": self.rowguid
			}
		}

		common.ajax({
				url: url,
				data: data,
				// 考虑到网络不佳情况下，业务是否手动显示加载进度条
				isShowWaiting: false
			},
			function(result) {
				if (result.status.code == '0') {
					document.getElementById("listdata").innerHTML = '';
					document.querySelector('.em-tips').style.display = 'block';
					return;
				}
				if (result.status.code == "1") {
					Zepto(".mui-content").removeClass("mui-hidden");

					var tmp = result.custom;
					var template = document.getElementById("template").innerHTML;
					var template2 = document.getElementById("template2").innerHTML;
					var html;
					if (self.type == '1') {
						html = Mustache.render(template2, tmp)
					} else {
						html = Mustache.render(template, tmp)
					}
					document.getElementById("listdata").innerHTML = html;
					document.querySelector('.em-tips').style.display = 'none';
				}
			},
			function(error) {
				ejs.ui.toast(Config.TIPS_II);
			}, {
				isDebug: true
			});
	},

};
