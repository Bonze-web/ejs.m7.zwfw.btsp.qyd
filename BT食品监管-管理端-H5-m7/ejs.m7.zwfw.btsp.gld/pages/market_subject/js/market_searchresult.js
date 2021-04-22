/**
    作者 :lujun
    创建时间 :2021/03/31
    版本 :[1.0, 2021/03/31]
    版权：江苏国泰新点软件有限公司
    描述：风险分级评定超期预警
 **/

(function (d, $) {
    'use strict';

    var minirefreshObj = null, // 下拉刷新实例
        listname = Util.getExtraDataByKey('listname') || '',//列表名
        searchrResult = JSON.parse(localStorage.getItem('market_searchresult')),//搜索结果
        paramsobj = {};//传参对象

    listname = decodeURI(listname);

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
        ejs.navigator.setTitle(listname + '搜索结果');

        var searchrResultList = [];
        searchrResult.map((ele, i) => {
            paramsobj[ele.field] = ele.value;
            if (ele.value) {
                if (ele.valuetext) {
                    ele.value = ele.valuetext;
                }
                searchrResultList.push(ele);
            }
        })
        console.log(searchrResultList)
        var list = { searchrResult: searchrResultList },
            html = Mustache.render($('#choose-tpl').html(), list);
        $('#choose').html(html);
        // console.log(searchrResult)

        // 初始化事件监听
        initListeners();
        // 下拉刷新
        pullToRefresh();

        $('#minirefresh').css('margin-top', $('.check-result').height() + 'px')

    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('body')
            // 点击 重选条件
            .on('tap', '#againchoose', function (e) {
                ejs.page.close(JSON.stringify({ key: 'value2' }));
                localStorage.removeItem('market_searchresult');
            })
            // 点击 删除条件
            .on('tap', '#choose .icon-del', function (e) {
                var parent = $(this).parent();
                parent.remove();
                paramsobj[parent[0].id] = '';
                minirefreshObj.refresh();
            })
    }

    /**
     * 下拉刷新
     * @param {String} url 接口地址
     */
    function pullToRefresh() {
        var urlFunc = function () {
            console.log(listname.indexOf('生产') != -1)
            var url = listname.indexOf('生产') != -1 ? 'foodpdt/getfoodpdtbasiclist' : 'foodopt/getfoodoptbasiclist';
            url = Config.serverUrl + url
            return url;
        };
        minirefreshObj = new MiniRefreshBiz({
            url: urlFunc,
            template: '#item-template',
            initPageIndex: 0,
            listContainer: '#listdata',
            contentType: 'application/json;charset=UTF-8',
            // contentType: 'application/x-www-form-urlencoded',
            dataRequest: function (currPage) {
                var params = Object.assign(paramsobj, {
                    currentpage: currPage.toString(),
                    pagesize: '10',
                })

                var requestData = JSON.stringify({
                    token: "Epoint_WebSerivce_**##0601",
                    params: params
                });

                // console.log(requestData);

                return requestData;
            },
            dataChange: function (res) {
                var list = listname.indexOf('生产') != -1 ? res.custom.foodpdtbasiclist : res.custom.foodoptbasiclist;

                list.map((ele, i) => {
                    if (listname.indexOf('生产') != -1) {
                        ele.operator = ele.producter;
                        ele.jystyle = 'hidden';
                    } else {
                        ele.scstyle = 'hidden';
                    }
                })
                console.log(list)

                return list;
            },
            success: function (res) { },
            itemClick: function (e) {
                var dataset = this.dataset
                for (var i in dataset) {
                    dataset[i] = encodeURI(dataset[i]);
                }
                dataset.listname = encodeURI(listname);
                console.log(listname)
                // return;
                ejs.page.open('./market_detail.html', dataset);
            },
            error: function (err) {
                ejs.ui.toast(JSON.stringify(err));
            }
        });
    }
})(document, Zepto);