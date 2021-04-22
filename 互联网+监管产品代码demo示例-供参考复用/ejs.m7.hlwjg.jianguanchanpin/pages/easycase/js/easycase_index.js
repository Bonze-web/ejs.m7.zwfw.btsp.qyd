/**
 * 作者： 袁莉
 * 创建时间： 2019/10/15
 * 版本： [1.0, 2019/10/15]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：简易案件首页
 */

(function(doc, Util) {
	"use strict";

	var tapType = 'todo',
		type = '60,80',
		minirefreshObj = null;

	Util.loadJs(
		'js/widgets/minirefresh/minirefresh.css',
		'js/widgets/minirefresh/minirefresh.js',
		'js/widgets/minirefresh/minirefresh.bizlogic.js',
		function() {
			Config.configReady([], function() {

				getCount();
				initListeners();
				pullToRefresh();

			}, function(err) {});
		});

	function initListeners() {
		// 头部切换
		$('#head').on('tap', '.headitem', function(e) {
			// 改变样式
			$('#head').find('.headactive').removeClass('headactive');
			$(this).addClass('headactive');
			tapType = this.dataset.type;
			console.log(tapType);

			if(tapType == 'todo') {

				type = '60,80';
			} else {
				type = '65';
			}
			minirefreshObj.refresh();
		});

		//列表点击跳转
		$('#listdata').on('tap', '.li-list', function() {
			var pageUrl = '',
				rowGuid = '',
				pviGuid = '',
				taskCode = '',
				data = {};

			rowGuid = this.dataset.rowguid;
			pviGuid = this.dataset.pviguid;
			taskCode = this.dataset.taskcode;

			if(tapType == 'todo') {
				pageUrl = './easycase_todo_register.html';
				data = {
					rowguid: rowGuid,
					pviguid: pviGuid,
					taskcode: taskCode
				};
			} else {
				pageUrl = './easycase_done_register.html';
				data = {
					rowguid: rowGuid
				};

			}

			if(pageUrl) {
				ejs.page.open({
					pageUrl: pageUrl,
					pageStyle: 1,
					orientation: 1,
					data: data,
					success: function(result) {
						ejs.page.reload();
					},
					error: function(error) {}
				});
			}
		});
	}

	/**
	 * @description 数据统计
	 */
	function getCount() {
		var url = Config.serverUrl + 'checkInfo/getCheckStatusCount',
			data = JSON.stringify({
				token: Config.validate,
				params: {
					ywcj: '3'
				}
			});

		console.log('数据统计：', url, data);

		Util.ajax({
			url: url,
			data: data,
			contentType: 'application/json',
			beforeSend: function() {
				ejs.ui.showWaiting();
			},
			success: function(result) {
				console.log(result);

				if(result.status.code != 1) {
					ejs.ui.toast(result.status.text);
					return;
				}

				var data = result.custom.statuslist;

				document.getElementById('todo-count').innerHTML = '(' + data[0].count + ')';
				// 待签收
				document.getElementById('done-count').innerHTML = '(' + data[1].count + ')';
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
	 * 下拉刷新
	 */
	function pullToRefresh() {
		var url = Config.serverUrl + 'checkInfo/getCheckTaskList';

		minirefreshObj = new MiniRefreshBiz({
			url: url,
			initPageIndex: 1,
			template: '#item-template',
			contentType: 'application/json',
			dataRequest: function(currPage) {

				var requestData = {
					status: type,
					searchkey: '',
					currentpageindex: currPage.toString(),
					pagesize: '10'
				};

				var data = JSON.stringify({
					token: Config.validate,
					params: requestData
				});

				return data;
			},
			dataChange: function(response) {
				console.log(JSON.stringify(response));

				if(response.status.code != 1) {
					ejs.ui.toast(response.status.text);

					return;
				}

				var list = response.custom.taskinfolist;

				return response.custom.taskinfolist;
			},

			itemClick: function(e) {

			},
			success: function() {

			},
			error: function(response) {
				console.log(response);
			}
		});
	}

})(document, window.Util);