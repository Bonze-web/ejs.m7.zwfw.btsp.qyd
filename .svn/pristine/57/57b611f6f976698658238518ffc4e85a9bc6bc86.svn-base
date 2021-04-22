/**
 * 作者：彭屹尧
 * 创建时间：2019-12-1
 * 版本：[1.0, 2019-12-01]
 * 版权：江苏国泰新点软件有限公司
 * 描述：gis地图列表页
 **/

(function (d, $) {
    'use strict';

    var token,
        type = '30', // tab状态
        isshowsearch = 0,
        keyword = '',
        minirefreshObj = null, // 下拉刷新实例
        x = '',
        y = '',
        list = [],
        comlist = [],
        tasklist = [],
        sourcelist = [],
        range = '附近',
        resource = '1',
        iscom = '0';

    var className = ejs.os.android ? 'com.epoint.app.restapi.EjsApi' : 'SZEJSApi';
    var jsApiList = [{
        'moduleName': className
    }];

    Util.loadJs(
        // 下拉刷新
        'js/widgets/minirefresh/minirefresh.css',
        'js/widgets/minirefresh/minirefresh.js',
        'js/widgets/minirefresh/minirefresh.bizlogic.js',
        'js/widgets/mui.poppicker/mui.poppicker.css',
        'js/widgets/mui.picker/mui.picker.css',
        'js/widgets/mui.poppicker/mui.poppicker.js',
        'js/widgets/mui.picker/mui.picker.js',

        function () {
            // 获取代码项
            gettasklist()

            // 调用api获取定位
            Config.configReady(jsApiList, function () {
                ejs.callApi({
                    // 该组件下的任意api
                    name: "getLocation",
                    mudule: 'moduleName',
                    // 是否长期回调，为0时可以省略
                    isLongCb: 0,
                    data: {

                    },
                    success: function (result) {
                        // 处理成功
                        x = result.latitude;
                        y = result.longitude;

                        console.log(x, y);

                        // 下拉刷新
                        pullToRefresh();

                    },
                    error: function (error) {
                        // 处理失败
                    }
                });
                // 初始化事件监听
                initListeners();
            }, function (err) { });
        }
    );

	/**
	 * 初始化事件监听
	 */
    function initListeners() {
        ejs.navigator.setRightBtn({
            isShow: 1,
            imageUrl: '../common/img/default/img_search_nav_btn.png',
            which: 1,
            success: function (result) {
                // 显示搜索
                if (isshowsearch === 0) {
                    isshowsearch = 1;
                    ejs.navigator.showSearchBar({
                        success: function (result) {
                            keyword = result.keyword;
                            minirefreshObj.refresh();
                        },
                        error: function (error) { }
                    });
                } else { // 隐藏按钮
                    isshowsearch = 0;
                    ejs.navigator.hideSearchBar({
                        success: function (result) { },
                        error: function (error) { }
                    });
                }
            },
            error: function (error) { }
        });

        ejs.navigator.setRightBtn({
            //调用api 跳转原生地图
            isShow: 1,
            imageUrl: './img/img_openmap.png',
            which: 0,
            success: function (result) {
                console.log('点击地图', result, className);

                className = ejs.os.android ? 'com.epoint.app.view.MapActivity' : 'MapViewController';

                ejs.page.openLocal({
                    className: className,
                    isOpenExist: 0,
                    data: {
                    },
                    success: function (result) {

                    },
                    error: function (error) { }
                });

            },
            error: function (error) { }
        });

        // 头部切换
        $('#head').on('tap', '.headitem', function (e) {
            // 改变样式
            $('#head').find('.headactive').removeClass('headactive');
            $(this).addClass('headactive');

            // 刷新列表
            type = this.dataset.type;

            if (type == '30') {
                sourcelist = tasklist;
                resource = '1';
                iscom = '0';
                $('#comtitle').attr('placeholder', "全部来源")
                minirefreshObj.refresh();
            }
            if (type == '40') {
                comlist = [{
                    value: '有限公司(自然人独资)',
                    text: '有限公司(自然人独资)'
                },
                {
                    value: '有限公司(自然人控股)',
                    text: '有限公司(自然人控股)'
                }];
                $('#comtitle').attr('placeholder', "企业类型")
                sourcelist = comlist;
                resource = '有限公司(自然人独资)'
                iscom = '1';
                minirefreshObj.refresh();
            }
        });

        $('body').on('tap', '#typetask', function (e) {
            console.log(123123123);

            // 选择距离
            ejs.ui.popPicker({
                layer: 1,
                data: [{
                    value: '附近',
                    text: '附近'
                },
                {
                    value: '500',
                    text: '500米'
                },
                {
                    value: '1000',
                    text: '1000米'
                }
                    ,
                {
                    value: '3000',
                    text: '3000米'
                }
                    ,
                {
                    value: '5000',
                    text: '5000米'
                }
                    ,
                {
                    value: '10000',
                    text: '10000米'
                }],
                success: function (result) {
                    range = result.items[0].value
                    minirefreshObj.refresh();
                },
                error: function (err) { }
            });

        }).on('tap', '#typecom', function (e) {
            console.log(this);
            var self = this;

            if (list.length < 1) {
                ejs.ui.toast('数据加载中...');

                return false;
            }
            // 选择来源
            ejs.ui.popPicker({
                layer: 1,
                data: sourcelist,
                success: function (result) {
                    console.log(result);

                    resource = result.items[0].value;

                    console.log(resource);
                    minirefreshObj.refresh();
                },
                error: function (err) { }
            });

        })
    }

    // 获取来源代码项
    function gettasklist() {

        Util.ajax({
            url: Config.serverUrl + 'commonInter/getCodeInfoList',
            data: {
                token: Config.validate,
                params: JSON.stringify({
                    codename: '监管任务来源类别'
                })
            },
            contentType: 'application/json',
            success: function (result) {
                console.log(result);

                list = result.custom.codelist;

                for (let i = 0; i < list.length; i++) {
                    tasklist.push({
                        value: list[i].itemvalue,
                        text: list[i].itemtext
                    })
                }

                sourcelist = tasklist;

            },
            error: function (error) {
                ejs.ui.toast(Config.TIPS_II);
            }
        });
    }

	/**
	 * 下拉刷新
     * 
	 * @param {String} url 接口地址
	 */
    function pullToRefresh() {
        minirefreshObj = new MiniRefreshBiz({
            url: Config.serverUrl + 'gisinfo/findnearinfo',
            contentType: 'application/json',
            dataRequest: function (currPage) {
                var requestData = {
                    lat: x,//必填 当前定位的纬度
                    lng: y,//必填 当前定位的经度
                    range: range,   //必填 距离   如果默认为附近，请传值“附近” 
                    resource: resource,    //必填 任务来源         
                    title: keyword,  // 不必填  任务名称
                    iscom: iscom,
                    pagesize: '20',
                    currentpageindex: currPage

                };

                var data = JSON.stringify({
                    token: Config.validate,
                    params: requestData
                });

                console.log('下拉刷新', requestData);

                return data;
            },
            // listContainer: container,
            initPageIndex: '1',
            dataChange: function (res) {

                console.log('返回参数', res);

                return res.custom.returnlist;
            },
            template: function () {
                console.log(type);

                var tpl = '';

                if (type === '30') {
                    tpl = $('#item-template').html();
                } else {
                    tpl = $('#item-template-com').html();
                }

                return tpl;
            },
            itemClick: function (e) {
                console.log(this.dataset);
                if (type === '30') {
                    ejs.page.open({
                        pageUrl: './map_details_task.html',
                        pageStyle: 1,
                        orientation: 1,
                        data: {
                            rowguid: this.dataset.rowguid
                        },
                        success: function (result) {
                            minirefreshObj.refresh();
                        },
                        error: function (error) { }
                    });
                } else {
                    ejs.page.open({
                        pageUrl: './map_details_com.html',
                        pageStyle: 1,
                        orientation: 1,
                        data: {
                            rowguid: this.dataset.rowguid
                        },
                        success: function (result) {
                            minirefreshObj.refresh();
                        },
                        error: function (error) { }
                    });
                }
            }
        });
    }


}(document, Zepto));