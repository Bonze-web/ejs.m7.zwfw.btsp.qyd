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
        transfertype = '',
        senduserguid = '',
        userGuid = '';

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
                transfertype = Util.getExtraDataByKey('transfertype');
                senduserguid = Util.getExtraDataByKey('senduserguid');

                initListeners()
            });
        }
    );

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('#optbtn').on('tap', '#submit', function () {
            if (Zepto('#receivebz').val() == '') {
                ejs.ui.toast('请先填写接收备注')
            } else {
                sendBack();
            }
        }).on('tap', '#cancel', function () {
            ejs.page.close();
        });

        
    }

    function sendBack() {
        Util.ajax({
            url: Config.serverUrl + 'task/updateTransfer',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dutyguid: rowGuid,
                    receivebz: Zepto('#receivebz').val(),
                    handletype: '1',
                    transfertype: transfertype,
                    senduserguid: senduserguid
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
                    ejs.ui.toast('移交接收成功');

                    setTimeout(function(){
                        ejs.page.close();
                    },500)
                }

            },
            error: function (err) {
                ejs.ui.toast(err)
            }
        });
    }

})(document, Zepto);