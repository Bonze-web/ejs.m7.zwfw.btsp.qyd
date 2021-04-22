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
        optguid = '';

    var itemValueArray = [],
        resultArray = [],
        wayArray = [];

    var choosedNum = 0; // 记录已选中的任务数量

    Util.loadJs(
        // 下拉刷新
        'js/widgets/tabview/tabview.js',
        function () {
            ejs.config({
                jsApiList: []
            });

            ejs.ready(function () {
                rowGuid = Util.getExtraDataByKey('guid');
                userGuid = Util.getExtraDataByKey('userguid');
                initPage()
            });
        }
    );

    // 初始化页面信息
    function initPage() {
        // 初始化事件监听
        initListeners();

        Promise.all([getCodeName('检查表名'),getCodeName('企业检查结果'), getCodeName('结果处理方式')]).then(arr => {
            console.log(arr)

            var output = Mustache.render(document.getElementById('item-template').innerHTML, {
                list: arr[0].custom.codelist
            });

            $('#itemlist').html(output);

            arr[0].custom.codelist.forEach(item => {
                itemValueArray.push(item.itemvalue)
            })

            resultArray = arr[1].custom.codelist;
            wayArray = arr[2].custom.codelist;

            
        }).then(() => {
            getDetail()
        })


    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        // 提交审核需要先判断是否有选中项
        $('#submit').on('tap', function () {
            if (choosedNum == 0) {
                ejs.ui.toast('暂未填写表单信息，不可提交')
            } else {
                submitChcek();
            }
        })

        $('#itemlist').on('tap', 'li', function () {
            var value = $(this).data('value');

            ejs.page.open({
                pageUrl: "./dailycheck_taskfeedbackitem.html",
                pageStyle: 1,
                orientation: 1,
                data: {
                    guid: rowGuid,
                    userguid: userGuid,
                    value: value,
                    optguid: optguid
                },
                success: function (result) {
                    renderDetail();
                },
                error: function (error) {}
            });
        })
    }


    //提交审核
    function submitChcek() {
        Util.ajax({
            url: Config.serverUrl + 'task/updateTask',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dutyguid: rowGuid,
                    status: '50',
                    userguid: userGuid
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

                ejs.ui.toast(res.custom.text);
                ejs.page.close();
            },
            error: function (err) {
                ejs.ui.toast(err);
            }
        });
    }

    // 获取详情，需要获取optguid
    function getDetail() {
        Util.ajax({
            url: Config.serverUrl + 'task/getTaskDetail',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dutyguid: rowGuid
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

                var handleJson = res.custom;

                optguid = handleJson.optguid;

                renderDetail();



            },
            error: function (err) {
                ejs.ui.toast(err)
            }
        });

    }

    function renderDetail() {
        itemValueArray.forEach((item, index) => {
            getSaveResult(optguid, item, index);
        })
    }

    // 获取已保存结果
    function getSaveResult(guid, checktable, index) {
        console.log(JSON.stringify({
            dutyguid: rowGuid,
            optguid: guid,
            checktable: checktable
        }))
        Util.ajax({
            url: Config.serverUrl + 'task/getSaveCheckResult',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dutyguid: rowGuid,
                    optguid: guid,
                    checktable: checktable
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

                    choosedNum++;
                    // 渲染相关数据
                    $('#itemlist').find('li').each(function (key, value) {
                        if (key == index) {
                            $(this).find('.chooseInfo').removeClass('mui-hidden');
                            $(this).find('.checktime').text(res.custom.checktime);
                            $(this).find('.checkresult').text(getResultText(res.custom.checkresult));
                            $(this).find('.checkway').text(getWayText(res.custom.dealway));
                        }
                    })
                }


            },
            error: function (err) {
                ejs.ui.toast(err);
            }
        });
    }

    function getResultText(value){
        var backText = '';

        resultArray.forEach(item => {
            if(item.itemvalue == value){
                backText = item.itemtext;
            }
        })

        return backText
    }

    function getWayText(value){
        var backText = '';

        wayArray.forEach(item => {
            if(item.itemvalue == value){
                backText = item.itemtext;
            }
        })

        return backText
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

})(document, Zepto);