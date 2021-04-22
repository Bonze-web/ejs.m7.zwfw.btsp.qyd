/**
    作者 :lujun
    创建时间 :2021/03/31
    版本 :[1.0, 2021/03/31]
    版权：江苏国泰新点软件有限公司
    描述：风险分级评定详情-待接收 待反馈详情
 **/

(function (d, $) {
    'use strict';

    var checkguid = Util.getExtraDataByKey('checkguid') || '';


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
        // 初始化事件监听
        // initListeners();
        getInfo();
    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('body')
            // 点击 底部按钮
            .on('tap', '#transferbtn', function (e) {
                ejs.page.open('./risk_transfer.html', { checkguid: checkguid, optguid: optguid, userguid: userGuid })
            })
    }

    /**
 * @description 获取基本信息
 */
    function getInfo() {
        Util.ajax({
            url: Config.serverUrl + 'task/getDtyCheckDetail',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    checkguid: checkguid,
                }
            }),
            contentType: 'application/json',
            success: function (res) {
                console.log(res)

                // 处理数据
                if (res.status.code != 200) {
                    ejs.ui.toast(res.status.text);
                    return false;
                }
                res.custom.pointList.map((ele, i) => {
                    ele.index = i + 1;
                })

                var html = Mustache.render($('#detail-tpl').html(), res.custom);
                $('#detail').html(html);

                // getAttachList(res.custom.taskclientguid);

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
    /**
    * @description 获取附件列表
    */
    function getAttachList(guid) {
        Util.ajax({
            url: Config.serverUrl + 'attach/getAttachList',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    "clientguid": guid
                    // '724d2b6b-04ff-4beb-8980-eab30e2c314d'
                    // guid
                }
            }),
            contentType: 'application/json',

            success: function (res) {
                console.log(res);
                if (res.status.code != 200) {
                    ejs.ui.toast('获取数据失败');
                    return;
                }
                var html = Mustache.render($('#taskattach-tpl').html(), res.custom);
                $('#taskattach').html(html);

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