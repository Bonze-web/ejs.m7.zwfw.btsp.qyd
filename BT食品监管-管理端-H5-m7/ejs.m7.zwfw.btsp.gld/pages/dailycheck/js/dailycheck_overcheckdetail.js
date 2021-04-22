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
        userGuid = '';

    var itemArray = [],
        resultArray = [],
        wayArray = [];

    Util.loadJs(
        // 下拉刷新
        'js/widgets/tabview/tabview.js',
        function () {
            ejs.config({
                jsApiList: []
            });

            ejs.ready(function () {
                rowGuid = Util.getExtraDataByKey('rowguid') || '111';
                userGuid = Util.getExtraDataByKey('userguid');

                initPage()
            });
        }
    );

    // 初始化页面信息
    function initPage() {
        // 初始化事件监听
        initListeners();

        new TabView({
            container: "#em-tabview-con",
            activeCls: "cur",
            isSwipe: false,
            activeIndex: 0,
            triggerEvent: 'tap',
            itemClick: function (e) {}
        });

        Promise.all([getCodeName('检查表名'), getCodeName('企业检查结果'), getCodeName('结果处理方式')]).then(arr => {
            console.log(arr)

            itemArray = arr[0].custom.codelist;
            resultArray = arr[1].custom.codelist;
            wayArray = arr[2].custom.codelist;


        }).then(() => {
            getDetail();
            getCheckInfo();
        })

        // 详情附件
        $('#taskattach').on('tap','.file-info-downloadicon',function(){
            var url = $(this).data('attachurl'),
                filename = $(this).data('attachname');

            // 调用ejsapi下载
            ejs.ui.showWaiting('正在加载...');
            ejs.io.downloadFile({
                url: url,
                fileName: filename,
                reDownloaded: 1,
                success: function(result) {
                    ejs.ui.closeWaiting();
                },
                error: function(error) {}
            });
        })
    }

    /**
     * 初始化事件监听
     */
    function initListeners() {

    }

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

                console.log($('#detail-con').find('.itemvalue'))

                $('#detail-con').find('.itemvalue').each(function (key, value) {

                    var thisId = $(this).attr('id');

                    $(this).text(handleJson[thisId])
                })

                // 渲染检查结果
                handleJson.checktablelist.forEach(item => {
                    // 处理相关字段
                    item.checktabletext = getItemText(item.checktable);
                    item.dealwaytext = getWayText(item.dealway);
                    item.checkResulttext = getResultText(item.checkresult);

                    item.dealway == '2' ? item.write = '1' : item.write = '0';
                    item.checkresult == '1' ? item.passresult = '1' : item.passresult = '0';
                    item.dealway == '1' ? item.passway = '1' : item.passway = '0';
                })

                var output = Mustache.render(document.getElementById('item-template').innerHTML, {
                    list: handleJson.checktablelist
                });
                Zepto('#checkresult').html(output);

                getAttachList(handleJson.taskclientguid)

            },
            error: function (err) {
                ejs.ui.toast(err)
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


    // 获取审核信息
    function getCheckInfo() {
        Util.ajax({
            url: Config.serverUrl + 'task/getFlowList',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dutyguid: rowGuid,
                    currentpage: 0,
                    pagesize: 999
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

                var handleJson = res.custom.dtyflowlist;

                if(handleJson && handleJson.length > 0){
                    $('#checkflow').removeClass('mui-hidden');

                    var output = Mustache.render(document.getElementById('flow-litem').innerHTML, {
                        list: handleJson
                    });
                    Zepto('#checkflow').html(output);
                }else{
                    $('#checking-nodata').removeClass('mui-hidden');
                }

            },
            error: function (err) {
                ejs.ui.toast(err)
            }
        });
    }

    function getItemText(value) {
        var backText = '';

        itemArray.forEach(item => {
            if (item.itemvalue == value) {
                backText = item.itemtext;
            }
        })

        return backText
    }

    function getResultText(value) {
        var backText = '';

        resultArray.forEach(item => {
            if (item.itemvalue == value) {
                backText = item.itemtext;
            }
        })

        return backText
    }

    function getWayText(value) {
        var backText = '';

        wayArray.forEach(item => {
            if (item.itemvalue == value) {
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