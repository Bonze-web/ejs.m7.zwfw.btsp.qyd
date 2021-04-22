/**
 * 作者：范周静
 * 创建时间：2019-05-13 08:56:59
 * 版本：[1.0, 2019-05-13]
 * 版权：江苏国泰新点软件有限公司
 * 描述：列表
 **/

(function (d, $) {
    'use strict';

    var rowGuid = '',
        userGuid = '',
        chooseUserName = [],
        chooseUserGuid = [];

    Util.loadJs(
        // 下拉刷新
        'js/widgets/tabview/tabview.js',
        function () {
            ejs.config({
                jsApiList: []
            });

            ejs.ready(function () {
                rowGuid = Util.getExtraDataByKey('guid') || '111';
                userGuid = Util.getExtraDataByKey('userguid');

                initListeners()
            });
        }
    );

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('#optbtn').on('tap', '.surebtn', function () {
            if (chooseUserGuid.length == 0) {
                ejs.ui.toast('请先选择转移人')
            } else if (Zepto('#sendbz').val() == '') {
                ejs.ui.toast('请先填写备注')
            } else {
                sendChange();
            }
        }).on('tap', '.cancelbtn', function () {
            ejs.page.close();
        });

        $('#targetuserguid').on('tap', function () {
            ejs.contact.choose({
                userguids: chooseUserGuid,
                success: function (result) {
                    /**
                     * {
                            resultData: [{"userguid":"73bee7b8-068c-4b11-9d2a-b16fcbba5119","username":"zjftest-1234"},{"userguid":"4c3df176-cf65-4727-a004-0138b9f96e34","username":"qq"},{"userguid":"d6dc7773-11b4-4270-8c10-97c4c85647a4","username":"admin1111"}]
                       }
                     */

                    chooseUserGuid = [];
                    chooseUserName = [];

                    result.resultData.forEach(function (item, index) {
                        chooseUserGuid.push(item.userguid);
                        chooseUserName.push(item.username);
                    })

                    $('#showusername').val(chooseUserName)
                },
                error: function (error) {}
            });
        })
    }

    function sendChange() {

        console.log(JSON.stringify({
            dutyguid: rowGuid,
            targetuserguid: chooseUserGuid,
            sendtime: getTime(),
            sendbz: Zepto('#sendbz').val(),
            senduserguid: userGuid
        }))
        Util.ajax({
            url: Config.serverUrl + 'task/saveTransferInfo',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dutyguid: rowGuid,
                    targetuserguid: chooseUserGuid,
                    sendtime: getTime(),
                    sendbz: Zepto('#sendbz').val(),
                    senduserguid: userGuid
                }
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                console.log(res);
                if (res.status.code != 200) {
                    ejs.ui.toast('获取数据失败');
                    return;
                }

                if(res.custom.code == 0){
                    ejs.ui.toast(res.custom.text)
                }else{
                    ejs.ui.toast('移交保存成功');

                    ejs.page.close();
                }

            },
            error: function (err) {
                ejs.ui.toast(err)
            }
        });
    }

    function getTime() {
        var date = new Date();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var currentdate = '';
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }

        var hour = date.getHours();
        var minute = date.getMinutes();

        if (hour >= 0 && hour <= 9) {
            hour = "0" + hour;
        }

        if (minute >= 0 && minute <= 9) {
            minute = "0" + minute;
        }

        var currentdate = date.getFullYear() + '-' + month + '-' + strDate + ' ' + hour + ':' + minute + ':00';
        return currentdate;
    }

})(document, Zepto);