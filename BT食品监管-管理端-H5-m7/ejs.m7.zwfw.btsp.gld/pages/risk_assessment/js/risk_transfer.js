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
        chooseUserName = [],
        chooseUserGuid = [];

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
                saveTransferInfo();
            })
        $('#handleperson').on('tap', function () {
            ejs.contact.choose({
                userguids: [],
                success: function (result) {
                    result.resultData.forEach(function (item, index) {
                        chooseUserGuid.push(item.userguid);
                        chooseUserName.push(item.username);
                    })

                    $('#targetuserguid').val(chooseUserName)
                },
                error: function (error) { }
            });
        })
    }

    /**
     * @description 移交
     */
    function saveTransferInfo() {
        var sendtime = Util.date.MyDate.parseDate().format('yyyy-MM-dd HH:mm:ss');
        var guids = '';
        chooseUserGuid.forEach((ele, i) => {
            guids = guids + ele + ';'
        })
        Util.ajax({
            url: Config.serverUrl + 'task/saveTransferInfo',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    targetuserguid: guids,
                    dutyguid: dutyguid,
                    sendtime: sendtime,
                    senduserguid: userGuid,
                    sendbz: $('#sendbz').val()//移交备注
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
                ejs.ui.alert({
                    title: "提示",
                    message: "移交成功",
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