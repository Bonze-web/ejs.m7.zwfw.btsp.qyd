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
        checkContentGuid = '';

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
                rowGuid = Util.getExtraDataByKey('guid');
                checkContentGuid = Util.getExtraDataByKey('checkcontentguid');
                initPage()
            });
        }
    );

    // 初始化页面信息
    function initPage() {
        // 初始化事件监听
        initListeners();

        // 获取已保存检查项
        getCheckItem();

    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        // 修改检查项
        $('#listdata').on('tap', 'li', function () {
            var checkitemguid = $(this).data('checkitemguid'),
                checkcontentguid = $(this).data('checkcontentguid'),
                checkcontent = $(this).data('checkcontent'),
                checkitem = $(this).data('checkitem');

            ejs.page.open("./dailycheck_taskfeedbackaddcheck.html", {
                guid: rowGuid,
                userguid: userGuid,
                checkitemguid: checkitemguid,
                checkcontentguid: checkcontentguid
            });
        })

    }

    

    function submitItem(){
        Util.ajax({
            url: Config.serverUrl + 'task/saveCheckResult',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dutyguid: rowGuid,
                    optguid: optguid,
                    checktable: value,
                    checkresult: checkResultValue,
                    dealway: checkWayValue,
                    operator: '',
                    checktime: $('#checktime').text(),
                    bz: ''
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

                if (res.custom.code != 0) {

                }


            },
            error: function (err) {
                ejs.ui.toast(err);
            }
        });
    }

})(document, Zepto);