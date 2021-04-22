/**
    作者 :lujun
    创建时间 :2021/03/31
    版本 :[1.0, 2021/03/31]
    版权：江苏国泰新点软件有限公司
    描述：抄送移交
 **/

(function (d, $) {
    'use strict';

    var dutyguid = Util.getExtraDataByKey('dutyguid') || '',
        userGuid = Util.getExtraDataByKey('userguid') || '',
        handletype = Util.getExtraDataByKey('handletype') || '',
        senduserguid = Util.getExtraDataByKey('senduserguid') || '',
        transfertype = Util.getExtraDataByKey('transfertype') || '';

    Util.loadJs(
        ['js/utils/util.date.js'],
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
        initListeners();

        // 退回1 接收2
        var text = handletype == 1 ? '退回原因' : '接收备注'
        $('.feedbackyj').text(text)

    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('body')
            // 点击取消
            .on('tap', '#cancel', function (e) {
                ejs.page.close(JSON.stringify({ key: 'value2' }));
            })
            // 点击确定
            .on('tap', '#submit', function (e) {
                for (var i = 0; i < $('#form input,textarea').length; i++) {
                    var item = $('#form input,textarea')[i];
                    console.log(item)
                    if (item.id && !$(item).val()) {
                        ejs.ui.toast(item.placeholder);
                        return;
                    }
                }
                updateTransfer();
            })
    }

    /**
     * @description 任务移交-移交状态更新
     */
    function updateTransfer() {
        Util.ajax({
            url: Config.serverUrl + 'task/updateTransfer',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dutyguid: dutyguid,
                    handletype: handletype,
                    senduserguid: senduserguid,
                    transfertype: transfertype,
                    receivebz: $('#receivebz').val()//移交备注
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

                var text = handletype == 1 ? '退回成功' : '接收成功'
                ejs.ui.alert({
                    title: "提示",
                    message: text,
                    buttonName: "确定",
                    cancelable: 1,
                    h5UI: false, // 是否强制使用H5-UI效果，默认false
                    success: function (result) {
                        ejs.page.close(JSON.stringify({ key: 'value2' }));
                    },
                    error: function (err) { }
                });

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