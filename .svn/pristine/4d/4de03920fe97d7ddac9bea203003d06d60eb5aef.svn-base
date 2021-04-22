/**
 * 作者：libo
 * 创建时间：2021-04-15
 * 版本：[1.0, 2021-04-15]
 * 版权：江苏国泰新点软件有限公司
 * 描述：修改检查项
 **/

 (function (d, $) {
    'use strict';

    var rowGuid = '',
        userGuid = '',
        checkitem = '',
        checkcontent = '',
        checkcontentguid = '';

    var chooseArray = [],
        evaluteValue = '',
        checkValue = '';

    Util.loadJs(
        // 下拉刷新
        'js/widgets/minirefresh/minirefresh.css',
        function () {
            ejs.config({
                jsApiList: []
            });

            ejs.ready(function () {
                rowGuid = Util.getExtraDataByKey('guid');
                userGuid = Util.getExtraDataByKey('userguid');
                checkcontentguid = Util.getExtraDataByKey('checkcontentguid');

                initPage()
            });
        }
    );

    // 初始化页面信息
    function initPage() {
        // 初始化事件监听
        initListeners();
        // 获取是否代码项
        getCodeName('是否').then(res => {
            res.custom.codelist.forEach(item => {
                chooseArray.push({
                    text: item.itemtext,
                    value: item.itemvalue
                })
            })
        })

        getCheckItem();
    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('#surebtn').on('tap',function(){
            saveItemInfo();
        })

        // 检查项选择
        // $('#checkitem').on('tap',function(){
        //     ejs.page.open("./dailycheck_taskfeedbackchoose.html", {
        //         guid: rowGuid,
        //         checkcontentguid: checkcontentguid
        //     });
        // })

        $('#isevaluate').on('tap',function(){
            ejs.ui.popPicker({
                layer: 1,
                data: chooseArray,
                success: function(result) {
                    /*
                    {
                        // 选择的对象
                        items: [{text: "text1", value: "value1"}]
                    }
                    */
                    $('#isevaluate').val(result.items[0].text);
                    evaluteValue = result.items[0].value;
                },
                error: function(err) {}
            });
        })

        $('#ischeck').on('tap',function(){
            ejs.ui.popPicker({
                layer: 1,
                data: chooseArray,
                success: function(result) {
                    /*
                    {
                        // 选择的对象
                        items: [{text: "text1", value: "value1"}]
                    }
                    */
                    $('#ischeck').val(result.items[0].text);
                    checkValue = result.items[0].value;
                },
                error: function(err) {}
            });
        })
    }

    /**
     * @description 获取代码项
     */
     function getCodeName(name) {
        return new Promise(function (resolve, reject) {
            Util.ajax({
                url: Config.serverUrl + 'commonInter/getCodeInfoList',
                data: JSON.stringify({
                    token: 'Epoint_WebSerivce_**##0601',
                    params: {
                        codename: name
                    }
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function (res) {
                    console.log(res);
                    if (res.status.code != 1) {
                        ejs.ui.toast('获取数据失败');
                        return;
                    }

                    resolve(res);

                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    }

    // 获取检查项
    function getCheckItem() {
        Util.ajax({
            url: Config.serverUrl + 'task/getCheckitem',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dutyguid: rowGuid,
                    checkcontentguid: checkcontentguid
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

                    checkitem = res.custom.checkitem;
                    checkcontent = res.custom.checkContent;

                    $('#checkitem').val(res.custom.checkitem);
                    $('#checkcontent').val(res.custom.checkContent);
                    $('#bz').val(res.custom.bz);
                }


            },
            error: function (err) {
                ejs.ui.toast(err);
            }
        });
    }

    /**
     * 修改
     * @param {String} url 接口地址
     */
    function saveItemInfo() {
        Util.ajax({
            url: Config.serverUrl + 'task/saveCheckItem',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dutyguid: rowGuid,
                    isevaluate: evaluteValue,
                    ischeck: checkValue,
                    checkcontentguid: checkcontentguid,
                    bz: $('#bz').val()
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
                    ejs.ui.toast('保存成功');

                    ejs.page.close();
                }


            },
            error: function (err) {
                ejs.ui.toast(err);
            }
        });
    }

    

})(document, Zepto);