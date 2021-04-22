/**
    作者 :lujun
    创建时间 :2021/03/31
    版本 :[1.0, 2021/03/31]
    版权：江苏国泰新点软件有限公司
    描述：风险分级评定超期预警
 **/

(function (d, $) {
    'use strict';

    var optname = Util.getExtraDataByKey('optname') || '',
        minirefreshObj = null; // 下拉刷新实例

    Util.loadJs(
        // 下拉刷新
        'js/widgets/minirefresh/minirefresh.css',
        'js/widgets/minirefresh/minirefresh.js',
        'js/widgets/minirefresh/minirefresh.bizlogic.js',
        function () {
            ejs.config({
                jsApiList: []
            });

            ejs.ready(function () {
                initPage()
            });
        }
    );

    // 初始化页面信息
    function initPage() {
        $('#minirefresh').css('margin-top', $('.se-box').height())
        // 初始化事件监听
        initListeners();
        // 下拉刷新
        pullToRefresh();
    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('body')
            //搜索框
            .on('change', '.se-input', (function () {
                optname = this.value;
                minirefreshObj.refresh();
            }))
            // 点击新增按钮 跳转
            .on('tap', '.addbtn', function (e) {
                localStorage.removeItem('inspection_add')
                ejs.page.open({
                    pageUrl: './inspection_add.html',
                    pageStyle: 1,
                    orientation: 1,
                    data: {
                    },
                    success: function (result) {
                        minirefreshObj.refresh();
                    },
                    error: function (error) { }
                });
            })
    }

    /**
     * 下拉刷新
     * @param {String} url 接口地址
     */
    function pullToRefresh() {
        minirefreshObj = new MiniRefreshBiz({
            url: Config.serverUrl + 'task/getDtyCheckList',
            template: '#item-template',
            initPageIndex: 0,
            listContainer: '#listdata',
            contentType: 'application/json;charset=UTF-8',
            // contentType: 'application/x-www-form-urlencoded',
            dataRequest: function (currPage) {
                var requestData = JSON.stringify({
                    token: "Epoint_WebSerivce_**##0601",
                    params: {
                        currentpage: currPage.toString(),
                        pagesize: '10',
                        optname: optname,
                    }
                });

                // console.log(requestData);

                return requestData;
            },
            dataChange: function (res) {
                console.log(res)


                return res.custom.checkList;
            },
            success: function (res) {
            },
            itemClick: function (e) {
                ejs.page.open('./inspection_detail.html', this.dataset)
            },
            error: function (err) {
                ejs.ui.toast(JSON.stringify(err));
            }
        });
    }
})(document, Zepto);