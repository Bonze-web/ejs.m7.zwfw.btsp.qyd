/**
 * 作者：解宇
 * 创建时间：2019-12-12
 * 版本：[1.0, 2019-12-12]
 * 版权：江苏国泰新点软件有限公司
 * 描述：移交抄告-选择部门
 **/

(function(d, $) {
	'use strict';

	var token = '',
		minirefreshObj,
		pageSize = '15',
		isshowsearch = 0,
		keyword = '';

	Util.loadJs([
			'js/widgets/minirefresh/minirefresh.css',
			'js/widgets/minirefresh/minirefresh.js',
		],
		'js/widgets/minirefresh/minirefresh.bizlogic.js',
		function() {
			Config.configReady([], function() {

					ejs.auth.getToken({
						success: function(result) {
							token = result.access_token;
							// 初始化页面信息
							initPage();
						}
					});

				},
				function(err) {});
		}
	);

	// 初始化页面信息
	function initPage() {
		// 初始化事件监听
		initListeners();

		// 获取列表
		PullToRefresh();
	}

	/**
	 * 初始化事件监听
	 */
	function initListeners() {
		ejs.navigator.setRightBtn({
			isShow: 1,
			imageUrl: '../common/img/default/img_search_nav_btn.png',
			which: 0,
			success: function(result) {
				// 显示搜索
				if(isshowsearch === 0) {
					isshowsearch = 1;
					ejs.navigator.showSearchBar({
						success: function(result) {
							keyword = result.keyword;
							minirefreshObj.refresh();
						},
						error: function(error) {}
					});
				} else { // 隐藏按钮
					isshowsearch = 0;
					ejs.navigator.hideSearchBar({
						success: function(result) {},
						error: function(error) {}
					});
				}
			},
			error: function(error) {}
		});
	}

	// 列表下拉刷新
	function PullToRefresh() {

		minirefreshObj = new MiniRefreshBiz({
			url: Config.serverUrl + 'copytransferinfo/getuserlist',
			initPageIndex: 1,
			contentType: 'application/json',
			dataRequest: function(currPage) {
				var requestData = {
					searchkey: keyword,
					currentpageindex: currPage.toString(),
					pagesize: pageSize
				};

				var data = JSON.stringify({
					token: Config.validate,
					params: requestData
				});

				return data;
			},
			dataChange: function(res) {
				if(res.status.code != 1) {
					ejs.ui.toast(res.status.text);

					return;
				}

				return res.custom.userlist;
			},
			itemClick: function(e) {
				e.stopPropagation();

				ejs.page.close({
					// 也支持传递字符串
					resultData: {
						value: this.dataset.value,
						text: this.dataset.text
					},
					success: function(result) {
						/**
						 * 回调内请不要做UI显示相关的事情
						 * 因为可能刚回调页面就关闭了
						 */

					},
					error: function(error) {}
				});
			}
		});
	}

}(document, Zepto));