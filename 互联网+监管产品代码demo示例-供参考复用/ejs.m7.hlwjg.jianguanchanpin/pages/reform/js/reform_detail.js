/**
 * 作者：丁力
 * 创建时间：2019-9-7 20:58:354
 * 版本：[1.0, 2019-9-7]
 * 版权：江苏国泰新点软件有限公司
 * 描述：基本信息
 **/
'use strict';

Util.loadJs([
		'pages/common/common.js',
		// 下拉刷新
		'js/widgets/minirefresh/minirefresh.css',
		'js/widgets/minirefresh/minirefresh.js',
		'js/widgets/mui.picker/mui.picker.css',
		'js/widgets/mui.poppicker/mui.poppicker.css',
		'js/widgets/mui.picker/mui.picker.js',
		'js/widgets/mui.poppicker/mui.poppicker.js',
	], [
		// 原生
		'js/widgets/minirefresh/themes/native/minirefresh.theme.native.js'
	],
	'js/widgets/minirefresh/minirefresh.bizlogic.js',
	function() {
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

		self.infotype = Util.getExtraDataByKey('infotype') || '';
		self.rowguid = Util.getExtraDataByKey('rowguid') || '';
		self.reformtype = Util.getExtraDataByKey('reformtype') || '';
		self.reformstatus = Util.getExtraDataByKey('reformstatus') || '';

		self.getDetail();

		// Android 容器下需要刷新
		ejs.event.registerEvent({
			key: 'resume',
			success: function(result) {
				self.PullToRefreshToolObj.refresh();
			},
			error: function(error) {}
		});

		//电话
		mui('.mui-content').on('tap', '.em-call', function(e) {
			ejs.ui.popPicker({
				layer: 1,
				data: self.telarr,
				success: function(result) {
					var tmp = result.items[0];
					if(tmp.value) {
						ejs.device.callPhone(tmp.value);
					} else {
						ejs.ui.toast('该用户未配置手机号，请联系管理员！');
					}
				},
				error: function(err) {}
			});
		});

		//查看历史
		mui('#listdata').on('tap', '.img_check', function(e) {
			e.stopPropagation();
			var behaviorobjguid = Zepto(this).attr('behaviorobjguid');
			var itemguid = Zepto(this).attr('itemguid');
			ejs.page.open("./reform_historylist.html", {
				itemguid: itemguid,
				behaviorobjguid: behaviorobjguid
			});
		});

		//添加整改
		mui('#listdata').on('tap', '.em-add', function(e) {
			e.stopPropagation();

			ejs.page.open("./reform_apply.html", {
				rowguid: Zepto(this).attr('rowguid'),
				behaviorguid: Zepto(this).attr('behaviorguid'),
				behaviorobjguid: Zepto(this).attr('behaviorobjguid'),
				dutyguid: self.rowguid,
				isupload: Zepto(this).attr('add')
			});
		});

		//确认整改
		mui('body').on('tap', '.em-submit', function(e) {
			ejs.ui.confirm({
				title: "温馨提示",
				message: "是否确认整改？",
				buttonLabels: ['取消', '确定'],
				cancelable: 1,
				success: function(result) {
					if(result.which == '1') {
						if(self.validate()) { // 正常执行
							self.submitApply('0');
						} else {
							ejs.ui.confirm({
								title: "",
								message: "是否走简易案件",
								buttonLabels: ['取消', '确定'],
								cancelable: 1,
								h5UI: false, // 是否强制使用H5-UI效果，默认false
								success: function(result) {
									// 点击任意一个按钮都会回调
									if(result.which == 0) { // 不走简易案件
										self.submitApply('0');
									} else {
										self.submitApply('1');
									}
								},
								error: function(err) {}
							});
						}
					}
				},
				error: function(err) {}
			});
		});
	},
	//确认整改
	submitApply: function(sign) {
		var self = this;

		common.ajax({
				url: Config.serverUrl + 'checkInfo/updateCheckInfo',
				data: {
					"dutyguid": self.rowguid,
					"status": '70',
					"iszgfc": '1',
					"addressregistered": '',
					"addressoperating": '',
					"areanumber": '',
					"entrustdept": '',
					"entrustdeptcode": '',
					"checktype": '',
					"checkmode": '',
					"ispunish": sign
				},
				// 考虑到网络不佳情况下，业务是否手动显示加载进度条
				isShowWaiting: false
			},
			function(result) {
				if(result.status.code === "1" || result.status.code === 1) {
					ejs.ui.toast('整改成功!');
					ejs.page.close();
				} else {
					ejs.ui.toast(result.status.text);
				}
			},
			function(error) {
				ejs.ui.toast(Config.TIPS_II);
			}, {
				isDebug: true
			});
	},
	//提交验证
	validate: function() {
		var flag = 1;
		var num = 0;

		Zepto('#listdata .remove-mui-active').each(function(index, val) {
			var iszg = Zepto(val).data('iszg');
			var isjyaj = Zepto(val).data('isjyaj');
			if(iszg == '1' && isjyaj == '1') { // 包含处罚决定或强制决定
				flag = 0;

				return false;
			}
			flag = 1;
		});

		if(flag == 0) {
			return false;
		}

		return true;
	},
	//	获取详情
	getDetail: function() {
		var self = this;

		common.ajax({
				url: Config.serverUrl + 'checkInfo/getCheckTaskDetail',
				data: {
					"dutyguid": self.rowguid
				},
				// 考虑到网络不佳情况下，业务是否手动显示加载进度条
				isShowWaiting: false
			},
			function(result) {
				if(result.status.code == "1") {
					var tmp = result.custom;
					var template = document.getElementById("template").innerHTML;
					tmp.planenddate = tmp.planenddate.substring(0, 10);
					tmp.planstartdate = tmp.planstartdate.substring(0, 10);
					self.telarr = [];
					mui.each(tmp.leptels, function(key, value) {
						self.telarr.push({
							'value': value.tel,
							'text': value.name
						})
					})
					var html = Mustache.render(template, tmp);
					document.querySelector(".mui-content").innerHTML = html;

					self.initPullRefreshList();
				} else {
					ejs.ui.toast(result.status.text);
				}
			},
			function(error) {
				ejs.ui.toast(Config.TIPS_II);
			}, {
				isDebug: true
			});
	},
	// 刷新列表
	initPullRefreshList: function() {
		var self = this;
		// 默认关键字
		self.KeyWord = '';

		// 下拉刷新对象
		self.PullToRefreshToolObj;

		// 页数大小
		var pageSize = 10;

		var urlFunc = function() {
			var url = Config.serverUrl + 'checkInfo/getCheckObjBehaviorList';
			// ejs.ui.showDebugDialog(url);
			console.log(url);

			return url;
		};

		// 请求参数
		var dataRequestFunc = function(currPage) {
			// 其他
			var data = {
				// 当前搜索的第几页
				'currentpageindex': currPage,
				// 个人唯一标识
				'pagesize': pageSize,
				'dutyguid': self.rowguid,
				'pviguid': '',

			};
			var requestData = JSON.stringify({
				token: Config.validate,
				params: data
			});

			return requestData;

		};
		// 改变数据
		var dataChangeFunc = function(response) {
			// console.log(JSON.stringify(response));
			var outData = null;

			// 采用统一的方式处理
			if(response.status.code == '1') {
				outData = response.custom.behaviorobjlist || [];
			}
			mui.each(outData, function(key, value) {
				mui.each(value.behaviorlist, function(key2, value2) {
					value2.behaviorobjguid = value.behaviorobjguid;
				})
			})
			// ejs.ui.showDebugDialog(JSON.stringify(outData));
			return outData;

		};

		// 模板
		var templateFunc = function(value) {

			if(self.infotype === '0' || self.infotype === 0) {
				template = document.getElementById("template2").innerHTML;
			} else {
				var template = document.getElementById("template3").innerHTML;
			}

			return template;
		};

		// 点击
		var itemClickFunc = function(e) {};

		self.PullToRefreshToolObj = new MiniRefreshBiz({
			// 可以主动传入theme，而不是使用默认的 MiniRefresh
			// h5下使用默认主题，native下使用native主题
			theme: ejs.os.ejs ? MiniRefreshTools.theme.natives : MiniRefreshTools.theme.defaults,
			isDebug: true,
			container: '#minirefresh',
			// 默认的列表数据容器选择器
			listContainer: '#listdata',
			// 默认的请求页面,根据不同项目服务器配置而不同,正常来说应该是0
			initPageIndex: 1,
			// 得到模板 要求是一个函数(返回字符串) 或者字符串
			template: templateFunc,
			// 得到url 要求是一个函数(返回字符串) 或者字符串
			url: urlFunc,
			dataRequest: dataRequestFunc,
			dataChange: dataChangeFunc,
			itemClick: itemClickFunc,
			success: function(res, isPulldown) {
				console.log(res);
				// 手动处理渲染列表
				// 如果是下拉刷新，清空列表
				// 数据为空时！
				var dataLength = document.getElementById('listdata').querySelectorAll('li').length;

				if(parseInt(dataLength) > 0) {
					document.querySelector('.upwrap-tips').style.display = 'block';
					document.querySelector('.em-tips').style.display = 'none';
				} else {
					// 显示空盒子
					document.querySelector('.upwrap-tips').style.display = 'none';
					document.querySelector('.em-tips').style.display = 'block';
				}
				Zepto('.em-content').removeClass('mui-hidden');
				Zepto('.em-reformlist').css('marginBottom', '150px');

				//判断是否展示确认整改按钮
				if(self.infotype === '0' || self.infotype === 0) {
					$('.em-submit').removeClass('hidden');

				}

				//待整改页面进来 为否隐藏历史
				$('#listdata .em-history').each(function() {

					if(this.dataset.isver != '1' && this.dataset.isneed === '是') {
						Zepto(this).removeClass('hidden');
					}
				})

				//判断整改按钮是否展示
				$('#listdata li').each(function() {
					if(this.dataset.isneed === '否') {
						Zepto(this).addClass('hidden');
					}
				})

				//判断是否已添加
				$('#listdata .em-added').each(function() {

					if(this.dataset.add === 1 || this.dataset.add === '1') {
						$(this).text('已添加');
					}
				})
			},
		});
	},
};