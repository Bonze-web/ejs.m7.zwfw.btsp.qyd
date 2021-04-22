/**
    作者 :lujun
    创建时间 :2021/03/31
    版本 :[1.0, 2021/03/31]
    版权：江苏国泰新点软件有限公司
    描述：企业主体库-详情
 **/

(function (d, $) {
    'use strict';

    var listname = decodeURI(Util.getExtraDataByKey('listname')) || '',
        operator = decodeURI(Util.getExtraDataByKey('operator')) || '',
        pripid = decodeURI(Util.getExtraDataByKey('pripid')) || '';

    Util.loadJs(
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
        ejs.navigator.setTitle(listname + '详情');
        // 初始化事件监听
        initListeners();
        getInfo();
    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('body')
            // 点击跳转
            .on('tap', '.btn-box button,.info .info-row', function (e) {
                console.log(this.dataset.url)
                if (this.dataset.url) {
                    ejs.page.open(this.dataset.url, {})
                }
            })
    }

    /**
     * @description 获取经营基本信息
     */
    function getInfo() {
        var url = 'foodopt/getfoodoptbasicinfo',
            params = {
                pripid: pripid,
                operator: operator
            };
        if (listname.indexOf('生产') != -1) {
            url = 'foodpdt/getfoodpdtbasicinfo';
            delete (params['operator']);
            params.producter = operator;
        }
        Util.ajax({
            url: Config.serverUrl + url,
            data:
                JSON.stringify({
                    token: 'Epoint_WebSerivce_**##0601',
                    params: params
                })
            ,
            contentType: 'application/json',
            success: function (res) {
                console.log(res)
                // 处理数据
                if (res.status.code != 200) {
                    ejs.ui.toast(res.status.text);
                    return false;
                }

                var list = [];

                if (listname.indexOf('生产') != -1) {
                    list = res.custom.foodpdtbasicinfo;
                    list.operator = list.producter;
                    list.jystyle = 'hidden';
                } else {
                    list = res.custom.foodoptbasicinfo
                }

                var html = Mustache.render($('#detail-tpl').html(), list);
                $('#detail').html(html);


            },
            error: function (error) {
                ejs.ui.toast(JSON.stringify(error));
                console.log(error);
                ejs.ui.closeWaiting({});
            },
            complete: function () {
                ejs.ui.closeWaiting({});
            }
        });
    }

})(document, Zepto);