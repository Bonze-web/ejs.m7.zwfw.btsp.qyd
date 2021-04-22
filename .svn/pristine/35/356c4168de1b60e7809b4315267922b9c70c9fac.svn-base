/**
 * 作者： 袁莉
 * 创建时间： 2019/10/16
 * 版本： [1.0, 2019/10/16]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：简易案件-待登记-选择监管行为
 */

(function(doc, Util) {
	"use strict";

	var minirefreshObj = '',
		rowGuid = Util.getExtraDataByKey('rowguid') || '',
		pviGuid = Util.getExtraDataByKey('pviguid') || '';

	var checkedArr = [], //选中元素数组
		checkitemArr = []; //所有处罚项数组

	Util.loadJs(
		'js/widgets/minirefresh/minirefresh.css',
		'js/widgets/minirefresh/minirefresh.js',
		'js/widgets/minirefresh/minirefresh.bizlogic.js',
		function() {
			Config.configReady([], function() {
				pullToRefresh();
				initListeners();

			}, function(err) {});
		});

	function initListeners() {
		ejs.event.registerEvent({
			key: 'resume',
			success: function(result) {
				$('#btn-register').removeClass('btn-register-active');
				$('#footer-check').removeClass('check-all-active');
				minirefreshObj.refresh();
			},
			error: function(error) {}
		});
		$('body')
			//单选
			.on('tap', '.check-item', function() {
				$(this).toggleClass('check-item-active');
				judgeActive();
			})
			//全选按钮切换
			.on('tap', '#check-all', function() {
				console.log($('.main-li-item'))
				if($('.main-li-item').length == 0){
					ejs.ui.toast('暂无数据');
					return;
				}
				
				var isChecked = $('#footer-check').hasClass('check-all-active');

				if(isChecked) {
					$.each(checkitemArr, function(i, val) {
						if($(val).hasClass('check-item-active')) {
							$(val).removeClass('check-item-active');
						}
					});
					$('#btn-register').removeClass('btn-register-active');
					$('#footer-check').removeClass('check-all-active');
				} else {
					$.each(checkitemArr, function(i, val) {
						if(!$(val).hasClass('check-item-active')) {
							$(val).addClass('check-item-active');
						}
					});
					$('#btn-register').addClass('btn-register-active');
					$('#footer-check').addClass('check-all-active');
				}
			})
			//登记案件
			.on('tap', '#btn-register', function() {
				var self = this,
					canAction = $(self).hasClass('btn-register-active');
				if(canAction) {
					var behaviorguid = '',
						itemChooseArr = $('.check-item-active');

					$.each(itemChooseArr, function(i, val) {
						var targetDom = val.parentNode.parentNode;
						console.log(targetDom);
						if(i == 0) {
							behaviorguid = targetDom.dataset.rowguid;
						} else {
							behaviorguid += ',' + targetDom.dataset.rowguid;
						}
					});

					ejs.page.open({
						pageUrl: './easycase_todo_register_moreinfo.html',
						pageStyle: 1,
						orientation: 1,
						data: {
							rowguid: rowGuid,
							behaviorguid: behaviorguid
						},
						success: function(result) {
							
						},
						error: function(error) {}
					});

				} else {
					ejs.ui.toast('请先选择监管行为！');
				}
			});
	}

	/**
	 * 验证是否全选
	 */
	function judgeActive() {
		checkedArr = $('.check-item-active');

		var checkedLen = checkedArr.length,
			checkitemLen = checkitemArr.length;

		console.log('checkedLen:' + checkedLen + ';checkitemLen:' + checkitemLen);

		if(checkedLen == checkitemLen) {
			$('#btn-register').addClass('btn-register-active');
			$('#footer-check').addClass('check-all-active');
		} else {
			$('#footer-check').removeClass('check-all-active');
			if(checkedLen == 0) {
				$('#btn-register').removeClass('btn-register-active');
			} else {
				$('#btn-register').addClass('btn-register-active');
			}
		}
	}

	function pullToRefresh() {
		//var url = Config.serverUrl + 'checkInfo/getCheckBehaviorList';
		var url = Config.serverUrl + 'checkInfo/getPunishCheckBehaviorList';

		minirefreshObj = new MiniRefreshBiz({
			url: url,
			delay: 0,
			initPageIndex: 1,
			template: '#item-template',
			contentType: 'application/json',
			dataRequest: function(currPage) {

				var requestData = {
					dutyguid: rowGuid,
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

				var list = response.custom || '';
				var listData = [];
				for(var i = 0;i<list.behaviorlist.length;i++){
					if(list.behaviorlist[i].canselect != '0'){
						listData.push(list.behaviorlist[i])
					}
				}
				
				return listData;
			},

			itemClick: function(e) {

			},
			success: function() {
				checkitemArr = $('.check-item');
			},
			error: function(response) {
				console.log(response);
			}
		});
	}

})(document, window.Util);