/**
 * 作者：丁力
 * 创建时间：2019-9-7 20:58:354
 * 版本：[1.0, 2019-9-7]
 * 版权：江苏国泰新点软件有限公司
 * 描述：监管对象
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
            self.initListeners();
            self.getCode();
        }, function (error) {});

    },
    initListeners: function () {
        var self = this;
        self.isshowsearch = 0;

        // Android 容器下需要刷新
        ejs.event.registerEvent({
            key: 'resume',
            success: function (result) {
                // 只有Android环境下才会执行刷新
                if (Util.os.android) {
                    self.PullToRefreshToolObj.refresh();
                }
            },
            error: function (error) {}
        });
        
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
        
        // 头部切换
		Zepto('.em-province-list').on('tap','li',function(){
            var _this = this;
            self.objecttype = Zepto(_this).attr('type');
            self.objecttypename = Zepto(_this).text();
            Zepto(_this).addClass('em-active').siblings().removeClass('em-active');
            self.PullToRefreshToolObj.refresh();
        });

    },
//	代码项
	getCode: function () {
		var self = this;
        common.ajax({
            url: Config.serverUrl + 'commonInter/getObjectTypeList',
            data: {},
            // 考虑到网络不佳情况下，业务是否手动显示加载进度条
            isShowWaiting: false
        },
        function (result) {
            if (result.status.code == "1") {
                var tmp = result.custom.codelist;
                var html = '';
                var tabtemplate = document.getElementById("tabtemplate").innerHTML;
                self.objecttype = tmp[0].itemvalue;
                self.objecttypename = tmp[0].itemtext;
                mui.each(tmp, function(key, value) {
                	html += Mustache.render(tabtemplate, value);
                })
                document.querySelector('.em-province-list').innerHTML = html;
                Zepto('.em-province-list').children().eq(0).addClass('em-active');
            	self.initPullRefreshList();
            }
        },
        function (error) {
            ejs.ui.toast(Config.TIPS_II);
        }, {
            isDebug: true
        });
	},
    // 刷新列表
    initPullRefreshList: function () {
        var self = this;
        // 默认关键字
        self.KeyWord = '';

        // 下拉刷新对象
        self.PullToRefreshToolObj;

        // 页数大小
        var pageSize = 10;

        var urlFunc = function () {
            var url = Config.serverUrl + 'checkInfo/getCheckObjList';
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
                'objecttype': self.objecttype,
                // 查询条件
                'keyword': self.KeyWord,

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
                outData = response.custom.objectlist || [];
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
        var itemClickFunc = function (e) {
        	var objguid = Zepto(this).attr('objguid');
        	ejs.page.open("./supervisor_detail.html", {
			    objguid: objguid,
			    objtype: self.objecttype,
			    objecttypename: self.objecttypename
			});
        };

        self.PullToRefreshToolObj = new MiniRefreshBiz({
            // 可以主动传入theme，而不是使用默认的 MiniRefresh
            // h5下使用默认主题，native下使用native主题
            theme: MiniRefreshTools.theme.defaults,
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
                    document.querySelector('.minirefresh-downwrap').style.display = 'block';
                    document.querySelector('.em-tips').style.display = 'none';
                } else {
                    // 显示空盒子
                    document.querySelector('.upwrap-tips').style.display = 'none';
                    document.querySelector('.minirefresh-downwrap').style.display = 'none';
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