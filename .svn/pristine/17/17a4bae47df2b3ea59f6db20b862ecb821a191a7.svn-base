/**
    作者 :lujun
    创建时间 :2021/03/31
    版本 :[1.0, 2021/03/31]
    版权：江苏国泰新点软件有限公司
    描述：风险分级评定超期预警
 **/

(function (d, $) {
    'use strict';

    var minirefreshObj = null; // 下拉刷新实例
    var rowguid = decodeURI(Util.getExtraDataByKey('rowguid')) || '';

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
        // 下拉刷新
        pullToRefresh();
    }


    /**
     * 下拉刷新
     * @param {String} url 接口地址
     */
    function pullToRefresh() {
        minirefreshObj = new MiniRefreshBiz({
            url: Config.serverUrl + 'warning/getHeathCertWarningList',
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
                        warnguid: rowguid
                    }
                });

                // console.log(requestData);

                return requestData;
            },
            dataChange: function (res) {
                // console.log(JSON.stringify(res), res);

                return res.custom.healthCertList;
            },
            success: function (res) {

            },
            itemClick: function (e) {
                // ejs.page.open('./warning_risklist.html', this.dataset)
            },
            error: function (err) {
                ejs.ui.toast(JSON.stringify(err));
            }
        });
    }
})(document, Zepto);