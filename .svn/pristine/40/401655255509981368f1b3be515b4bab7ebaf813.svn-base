/**
 * 作者：丁力
 * 创建时间：2019-9-7 20:58:354
 * 版本：[1.0, 2019-9-7]
 * 版权：江苏国泰新点软件有限公司
 * 描述：整改复查
 **/
(function(doc, Util) {
	"use strict";

	var type = '',
		status = '',
		keyword = '',
		infoType = 0,
		minirefreshObj = null;

	Util.loadJs([
			'pages/common/common.js',
			// 下拉刷新
			'js/widgets/minirefresh/minirefresh.css',
			'js/widgets/minirefresh/minirefresh.js'
		], [
			// 原生
			'js/widgets/minirefresh/themes/native/minirefresh.theme.native.js'
		],
		'js/widgets/minirefresh/minirefresh.bizlogic.js',
		function() {
			var className = ejs.os.android ? 'com.epoint.app.restapi.EjsApi' : 'SZEJSApi';
			var jsApiList = [{
				'moduleName': className
			}];

			Config.configReady(jsApiList, function() {

				//当页面重新可见时刷新页面
				ejs.event.registerEvent({
					key: 'resume',
					success: function(result) {
						ejs.page.reload();
						ejs.ui.closeWaiting();
					},
					error: function(error) {}
				});

				getStatusCount();
				initListeners();
			}, function(err) {});
		});

	/**
	 * 获取数量
	 */
	function getStatusCount() {
		var url = Config.serverUrl + 'checkInfo/getCheckStatusCount',
			data = JSON.stringify({
				token: Config.validate,
				params: {
					ywcj: '2',
					keyword: keyword
				}
			});

		console.log('任务数量：', url, data);

		Util.ajax({
			url: url,
			data: data,
			contentType: 'application/json',
			success: function(result) {
				console.log(result);

				if(result.status.code != 1) {
					ejs.ui.toast(result.status.text);
					return;
				}

				var listdata = doc.getElementById('em-tab-list'),
					template = doc.getElementById('tabtemplate').innerHTML;

				listdata.innerHTML = Mustache.render(template, result.custom);

				Zepto('.em-tab-list').children().eq(0).addClass('em-active');

				status = result.custom.statuslist[0].status;
				initPullRefreshList();
			},
			error: function(error) {
				console.log(JSON.stringify(error));
				ejs.ui.toast('接口有误，请联系管理员');
				ejs.ui.closeWaiting({});
			},
		});
	}

	/**
	 * 下拉刷新
	 */
	function initPullRefreshList() {
		var url = Config.serverUrl + 'checkInfo/getCheckTaskList';

		minirefreshObj = new MiniRefreshBiz({
			url: url,
			initPageIndex: 1,
			template: function() {
				if(infoType === 0) {
					return doc.getElementById('template').innerHTML
				} else {
					return doc.getElementById('template2').innerHTML
				}
			},
			setting: {
				up: {
					loadFull: {
						// 开启配置后，只要没满屏幕，就会自动加载
						isEnable: false,
						delay: 300
					},
				}
			},
			container: '#minirefresh',
			contentType: 'application/json',
			dataRequest: function(currPage) {

				var paramsData = {
					status: status,
					searchkey: keyword,
					currentpageindex: currPage.toString(),
					pagesize: '10'
				};

				var requestData = JSON.stringify({
					token: Config.validate,
					params: paramsData
				});

				console.log('请求参数：' + url + requestData);

				return requestData;
			},
			dataChange: function(response) {
				console.log(response);

				if(response.status.code != 1) {
					ejs.ui.toast(response.status.text);

					return;
				}

				return response.custom.taskinfolist;
			},
			success: function(result) {
				console.log(result);

				//判断是否为空
				var dataLength = document.getElementById('listdata').querySelectorAll('li').length;

				if(parseInt(dataLength) > 0) {
					document.querySelector('.upwrap-tips').style.display = 'block';
					document.querySelector('.em-tips').style.display = 'none';
				} else {
					// 显示空盒子
					document.querySelector('.upwrap-tips').style.display = 'none';
					document.querySelector('.em-tips').style.display = 'block';
				}
			},
			error: function(error) {
				console.log(error);
			}
		});
	}

	/**
	 * 事件监听
	 */
	function initListeners() {

		//原生搜索栏
		ejs.navigator.showSearchBar({
			success: function(result) {
				keyword = result.keyword;

				minirefreshObj.refresh();
			},
			error: function(error) {}
		});

		// 头部切换
		Zepto('.em-tab-list').on('tap', 'li', function() {
			Zepto(this).addClass('em-active').siblings().removeClass('em-active');

			infoType = Zepto(this).index();
			status = this.id;

			minirefreshObj.refresh();
		});

		//跳转详情 电话 导航
		Zepto('#listdata').on('tap', '.em-todo', function(e) {
			var target = e.target;

			if(target.id == 'nav') {
				map(target);
			} else if(target.id == 'dzxdr-tel') {
				tel(target);
			} else {
				ejs.page.open("./reform_detail.html", {
					infotype: infoType,
					rowguid: $(this).attr('rowguid')
				});
			}
		});

		//电话 导航
		Zepto('#listdata').on('tap', '.em-done', function(e) {
			var target = e.target;

			if(target.id == 'nav') {
				map(target);
			} else if(target.id == 'dzxdr-tel') {
				tel(target);
			}
		});

		//跳转详情
		Zepto('#listdata').on('tap', '.em-add', function(e) {
			ejs.page.open("./reform_detail.html", {
				rowguid: Zepto(this).attr('rowguid'),
				reformtype: type,
				reformstatus: status,
				infotype: infoType
			});
		});
	}

	/**
	 * 地图
	 * @param {Object} target
	 */
	function map(target) {
		var lat = target.dataset.lat,
			lng = target.dataset.lng,
			name = target.dataset.name;

		if(lat == '' || lng == '') {
			ejs.ui.toast('暂无定位信息');
			return;
		}

		ejs.callApi({
			// 该组件下的任意api
			name: "showNavigation",
			mudule: 'moduleName',
			// 是否长期回调，为0时可以省略
			isLongCb: 0,
			data: {
				name: name,
				lat: lat,
				lng: lng
			},
			success: function(result) {},
			error: function(error) {
				console.log(error);
			}
		});
	}

	/**
	 * 电话
	 * @param {Object} target
	 */
	function tel(target) {
		var contacttel = target.dataset.tel;

		if(contacttel == '') {
			ejs.ui.toast('当前行政相对人暂无电话信息');
			return;
		}

		ejs.ui.confirm({
			title: "提示",
			message: "确认拨打电话：" + contacttel,
			buttonLabels: ['取消', '确定'],
			cancelable: 1,
			success: function(result) {
				// 点击任意一个按钮都会回调
				console.log(result);
				if(result.which == 1) {
					ejs.device.callPhone(contacttel);
				}
			},
			error: function(err) {}
		});
	}
})(document, window.Util);