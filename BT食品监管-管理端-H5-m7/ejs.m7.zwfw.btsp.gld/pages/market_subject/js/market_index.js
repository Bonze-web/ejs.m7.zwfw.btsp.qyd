/**
    作者 :lujun
    创建时间 :2021/03/31
    版本 :[1.0, 2021/03/31]
    版权：江苏国泰新点软件有限公司
    描述：企业主体库
 **/

(function (d, $) {
    'use strict';

    var minirefreshObj = null; // 下拉刷新实例

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
        $('#minirefresh').css('margin-top', $('.daily-tab').height() + 'px')

        // 初始化事件监听
        initListeners();
        // 下拉刷新
        pullToRefresh();
    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        ejs.navigator.setRightBtn({
            isShow: 1,
            text: '搜索',
            // 设置图片的优先级会较高
            // imageUrl: '../css/images/img_search.png',
            which: 0, // 每一个按钮的回调是独立返回
            success: function (result) {
                ejs.page.open('./market_search.html', {
                    listname: encodeURI($('.active').text())
                });
            },
            error: function (error) { }
        });
        $('body')
            // 点击tab切换
            .on('tap', '.daily-tab div', function (e) {
                $('.active').removeClass('active');
                $(this).addClass('active');
                minirefreshObj.refresh();
            })
            .on('tap', '.search', function (e) {
                ejs.page.open('./market_search.html?ejs_pagetitle=' + $('.active').text() + '详情', {
                    listname: encodeURI($('.active').text())
                });
            })

    }

    /**
     * 下拉刷新
     * @param {String} url 接口地址
     */
    function pullToRefresh() {
        var urlFunc = function () {
            var url = '';
            url = Config.serverUrl + $('.active')[0].dataset.url
            return url;
        };
        minirefreshObj = new MiniRefreshBiz({
            url: urlFunc,
            // template: '#item-template',
            // initPageIndex: 0,
            listContainer: '#listdata',
            contentType: 'application/json;charset=UTF-8',
            // contentType: 'application/x-www-form-urlencoded',
            dataRequest: function (currPage) {
                var text = $('.active').text(),
                    params = {
                        currentpage: currPage.toString(),
                        pagesize: '10',
                        status: ''//状态
                    },
                    obj = {};
                if (text.indexOf('生产') != -1) {
                    obj = {
                        producter: '',//生产者名字
                        organization: '',//所属团
                        risk_level: '',//风险等级
                        pripid: '',//统一社会信用代码
                    }
                } else {
                    obj = {
                        operator: '',//经营者名字
                        optname: '',//企业名称
                        obj_state: '',//主体业态
                        economy_type: '',//经营性质
                        division: '',//所属师
                        regiment: '',//所属团
                    }
                }
                params = Object.assign(params, obj)

                var requestData = JSON.stringify({
                    token: "Epoint_WebSerivce_**##0601",
                    params: params
                });

                // console.log(requestData);

                return requestData;
            },
            dataChange: function (res) {
                if (res.custom.code != 1) {
                    ejs.ui.toast('获取数据失败');
                    return;
                }
                console.log(res)
                var text = $('.active').text(),
                    list = text.indexOf('生产') != -1 ? res.custom.foodpdtbasiclist : res.custom.foodoptbasiclist;

                list.map((ele, i) => {
                    if (text.indexOf('生产') != -1) {
                        ele.operator = ele.producter;
                        ele.jystyle = 'hidden';
                    } else {
                        ele.scstyle = 'hidden';
                    }
                })


                return list;
            },
            success: function (res) { },
            itemClick: function (e) {
                var dataset = this.dataset
                for (var i in dataset) {
                    dataset[i] = encodeURI(dataset[i]);
                }
                dataset.listname = encodeURI($('.active').text());
                console.log($('.active').text())
                // return;
                ejs.page.open('./market_detail.html', dataset);
            },
            error: function (err) {
                ejs.ui.toast(JSON.stringify(err));
            }
        });
    }
})(document, Zepto);