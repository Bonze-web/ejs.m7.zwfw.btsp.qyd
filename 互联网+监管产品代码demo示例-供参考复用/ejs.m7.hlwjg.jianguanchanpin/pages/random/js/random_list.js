/**
 * 作者：丁力
 * 创建时间：2019-9-7 20:58:354
 * 版本：[1.0, 2019-9-7]
 * 版权：江苏国泰新点软件有限公司
 * 描述：双随机计划
 **/
'use strict';

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
function () {
    customBiz.configReady();
});

/**
 * @description 所有业务处理
 */
var customBiz = {
    // 初始化校验，必须调用
    // 注，如果没有组件API需要注册，可以传空，注册组件时，必须容器支持对应组件才能注册成功
    configReady: function () {
        var self = this;

        Config.configReady(null, function () {
        	
			self.plantype = Util.getExtraDataByKey('plantype') || '';
			self.parentguid = Util.getExtraDataByKey('parentguid') || '';
            self.initListeners();
            self.initPullRefreshList();

        }, function (error) {});

    },
    initListeners: function () {
        var self = this;
        ejs.navigator.setRightBtn({
			isShow: 1,
			imageUrl: '../common/img/default/img_search_nav_btn.png',
			which: 0,
			success: function(result) {
				// 显示搜索
				if(self.isshowsearch === 0) {
					self.isshowsearch = 1;
					ejs.navigator.showSearchBar({
						success: function(result) {
							self.KeyWord = result.keyword;
							self.PullToRefreshToolObj.refresh();
						},
						error: function(error) {}
					});
				} else { // 隐藏按钮
					self.isshowsearch = 0;
					ejs.navigator.hideSearchBar({
						success: function(result) {},
						error: function(error) {}
					});
				}
			},
			error: function(error) {}
		});

    },
    // 刷新列表
    initPullRefreshList: function () {
        var self = this;

        // 下拉刷新对象
        self.PullToRefreshToolObj;

        // 页数大小
        var pageSize = 10;

        var urlFunc = function () {
            var url = Config.serverUrl + 'checkInfo/getSSJPlanList';
            // ejs.ui.showDebugDialog(url);
            console.log(url);

            return url;
        };

        // 请求参数
        var dataRequestFunc = function (currPage) {
            // 其他
            var data = {
                // 当前搜索的第几页
                'currentpageindex': currPage,
                // 个人唯一标识
                'pagesize': pageSize,
                // 处理类型
                'plantype': self.plantype,
                // 查询条件
                'keyword': self.KeyWord,
                'isparent': '0',
                'parentguid': self.parentguid,
                'isown': ''
            };
            var requestData = JSON.stringify({
            	token: Config.validate,
                params: data
            });

            return requestData;

        };
        // 改变数据
        var dataChangeFunc = function (response) {
            // console.log(JSON.stringify(response));
            var outData = null;

            // 采用统一的方式处理
            // 采用统一的方式处理
            if (response.status.code == '1') {
                outData = response.custom.planlist || [];
            }
            // ejs.ui.showDebugDialog(JSON.stringify(outData));
            return outData;

        };

        // 模板
        var templateFunc = function (value) {
            var template = document.getElementById("template").innerHTML;

            return template;
        };

        // 点击
        var itemClickFunc = function (e) {};

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
            beforeSend: function () {
            	
            },
            success: function (res, isPulldown) {
                // 手动处理渲染列表
                // 如果是下拉刷新，清空列表
                // 数据为空时！
                var dataLength = document.getElementById('listdata').querySelectorAll('li').length;

                if (parseInt(dataLength) > 0) {
                    document.querySelector('.upwrap-tips').style.display = 'block';
                    document.querySelector('.em-tips').style.display = 'none';
                } else {
                    // 显示空盒子
                    document.querySelector('.upwrap-tips').style.display = 'none';
                    document.querySelector('.em-tips').style.display = 'block';
                }
            },
            setting: {
                isLockX: false,
                down: {
                    successAnim: {
                        isEnable: true,
                        duration: 800
                    },
                    offset: 45,
                }
            },
        });

    },
};