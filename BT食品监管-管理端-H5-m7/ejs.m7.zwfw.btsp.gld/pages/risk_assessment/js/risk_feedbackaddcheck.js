/**
    作者 :lujun
    创建时间 :2021/03/31
    版本 :[1.0, 2021/03/31]
    版权：江苏国泰新点软件有限公司
    描述：添加检查项
 **/

(function (d, $) {
    'use strict';

    var dutyguid = Util.getExtraDataByKey('dutyguid') || '',
        optguid = Util.getExtraDataByKey('optguid') || '',
        optname = decodeURI(Util.getExtraDataByKey('optname')) || '',
        standardguidlist = [],
        codelist = [],
        checkobj = {};

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
        initListeners();
        getCodeName('是否');
    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('body')
            // 点击检查项跳转
            .on('tap', '#checkitem,#checkcontent', function (e) {
                ejs.page.open({
                    pageUrl: './risk_feedbackchoose.html',
                    pageStyle: 1,
                    orientation: 1,
                    data: {
                        dutyguid: dutyguid
                    },
                    success: function (result) {
                        console.log(result)
                        var resultData = result.resultData;
                        checkobj = resultData;
                        checkobj.checkitem = decodeURI(checkobj.checkitem);
                        checkobj.checkcontent = decodeURI(checkobj.checkcontent);
                        $('#checkitem input').val(checkobj.checkitem);
                        $('#checkcontent input').val(checkobj.checkcontent);

                    },
                    error: function (error) { }
                });
            })
            // 点击 评价
            .on('tap', '#isevaluate', function (e) {
                var _this = $(this);
                ejs.ui.popPicker({
                    layer: 1,
                    data: codelist,
                    success: function (result) {
                        _this.find('input').val(result.items[0].text);
                        _this[0].dataset.isevaluate = result.items[0].value;
                    },
                    error: function (err) { }
                });
            })
            // 点击 确定
            .on('tap', '.surebtn', function (e) {
                console.log($('.mui-input-group input,textarea#content'))
                for (var i = 0; i < $('.mui-input-group input,textarea#content').length; i++) {
                    var item = $('.mui-input-group input,textarea#content')[i];
                    if (!$(item).val()) {
                        ejs.ui.toast(item.placeholder);
                        return;
                    }
                }
                if (!dutyguid) {
                    ejs.page.close({
                        // 也支持传递字符串
                        resultData: {
                            checkitem: encodeURI(checkobj.checkitem),
                            checkcontentguid: checkobj.checkcontentguid,
                            checkcontent: encodeURI(checkobj.checkcontent),
                            isevaluate: $('#isevaluate')[0].dataset.isevaluate,
                            ischeck: 0,
                            remark: encodeURI($('#content').val()),
                        },
                        success: function (result) {
                        },
                        error: function (error) { }
                    });
                    return;
                }

                standardguidlist = [];
                checkobj.checkcontentguid.split(';').forEach((ele, i) => {
                    if (ele)
                        standardguidlist.push({ standardguid: ele })
                })
                var params = {
                    dutyguid: dutyguid,
                    optguid: optguid,
                    optname: optname,
                    standardguidlist: standardguidlist,
                    isevaluate: $('#isevaluate')[0].dataset.isevaluate,
                    Bz: $('#content').val()
                }
                console.log(params)
                saveCheckResult(params);
            })
    }
    /**
    * @description 获取代码项
    */
    function getCodeName(codename) {
        Util.ajax({
            url: Config.serverUrl + 'commonInter/getCodeInfoList',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    codename: codename
                }
            }),
            headers: { 'Content-Type': 'application/json' },
            success: function (res) {
                console.log(res);
                if (res.status.code != 1) {
                    ejs.ui.toast('获取数据失败');
                    return;
                }
                res.custom.codelist.map((ele, i) => {
                    codelist.push({
                        text: ele.itemtext,
                        value: ele.itemvalue
                    })
                })
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
     * @description 保存检查结果
     */
    function saveCheckResult(params) {
        Util.ajax({
            url: Config.serverUrl + 'risktask/saveCheckResult',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: params
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
                    message: "添加成功",
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