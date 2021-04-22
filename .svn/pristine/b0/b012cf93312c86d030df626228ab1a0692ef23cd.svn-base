/**
    作者 :lujun
    创建时间 :2021/03/31
    版本 :[1.0, 2021/03/31]
    版权：江苏国泰新点软件有限公司
    描述：风险分级评定超期预警
 **/

(function (d, $) {
    'use strict';



    var userguid = '',
        checkobj = {},//检查对象
        checkitemlist = [];//检查项

    Util.loadJs(
        // 下拉刷新
        'js/widgets/minirefresh/minirefresh.css',
        'js/widgets/minirefresh/minirefresh.js',
        'js/widgets/minirefresh/themes/native/minirefresh.theme.native.js',
        'js/widgets/minirefresh/minirefresh.bizlogic.js',
        'js/utils/util.date.js',
        function () {
            ejs.config({
                jsApiList: []
            });

            // ejs.ready(function () {
            //     initPage()
            // });
            ejs.ready(function () {
                ejs.auth.getUserInfo({
                    success: function (result) {

                        var handleUser = JSON.parse(result.userInfo);

                        userguid = handleUser.userguid;

                        initPage()
                    },
                    error: function (error) { }
                });
            });
        }
    );

    // 初始化页面信息
    function initPage() {
        // 初始化事件监听
        initListeners();
        getCodeName('企业检查结果', 'checkResult');
        getCodeName('结果处理方式', 'dealWay');

        $('.date').text(Util.date.MyDate.parseDate().format('yyyy-MM-dd'));
    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('body')
            // 点击 active选择
            .on('tap', '.check-result-choose div', function (e) {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
            })
            // 点击跳转
            .on('tap', '.handlebtn', function (e) {
                console.log(this.dataset.url)
                var url = this.dataset.url;
                if (url) {
                    // ejs.page.open(url, {})
                    ejs.page.open({
                        pageUrl: url,
                        pageStyle: 1,
                        orientation: 1,
                        data: {
                            key1: 'value1'
                        },
                        success: function (result) {
                            console.log(result)
                            var resultData = result.resultData;
                            if (url.indexOf('inspection_search') != -1) {
                                console.log(result)
                                checkobj = resultData;
                                checkobj.listname = decodeURI(checkobj.listname);
                                checkobj.company = decodeURI(checkobj.company);
                                checkobj.pripidType = "统一社会信用代码";
                                $('#checkobj').removeClass('hidden');
                                for (var i in checkobj) {
                                    $('#checkobj').find(`#${i}`).text(checkobj[i]);
                                }
                            } else {
                                resultData.index = checkitemlist.length + 1;
                                resultData.checkitem = decodeURI(resultData.checkitem);
                                resultData.checkcontent = decodeURI(resultData.checkcontent);
                                resultData.remark = decodeURI(resultData.remark);

                                checkitemlist.push(resultData);
                                $('#checkitemlist').removeClass('hidden');

                                var html = Mustache.render($('#checkitem-tpl').html(), { checkitemlist });
                                $('#checkitemlist').html(html);
                            }
                        },
                        error: function (error) { }
                    });
                }
            })
            // 点击 时间
            .on('tap', '#checkDate', function (e) {
                var _this = $(this).find('.date');
                ejs.ui.pickDate({
                    title: '选择日期',
                    datetime: '',
                    h5UI: false, // 是否强制使用H5-UI效果，默认false
                    success: function (result) {
                        _this.text(result.date);
                    },
                    error: function (err) { }
                });

            })
            // 点击确定
            .on('tap', '#statusbtn', function (e) {
                if (!checkobj.companyType) {
                    ejs.ui.toast('请选择检查对象');
                    return;
                }
                if (!checkitemlist.length) {
                    ejs.ui.toast('请选择检查项');
                    return;
                }
                var params = {
                    companyType: checkobj.companyType,
                    pripid: checkobj.pripid,
                    company: checkobj.company,
                    riskLevel: checkobj.riskLevel,
                    checkDate: $('#checkDate .date').text() + ' 00:00:00',
                    checkResult: $('#checkResult .active')[0].dataset.value,
                    dealWay: $('#dealWay .active')[0].dataset.value,
                    userguid: userguid,
                }
                var pointList = [];
                checkitemlist.map((ele, i) => {
                    pointList.push({
                        checkcontentguid: '41abfa62-4ef0-43b6-be92-c66fd7c7aa70',
                        // ele.checkcontentguid.substring(0, ele.checkcontentguid.length - 1),
                        isevaluate: ele.isevaluate,
                        ischeck: ele.ischeck,
                        remark: ele.remark
                    })
                })
                params.pointList = pointList;

                addDtyCheck(params);
            })
    }
    /**
     * @description 获取代码项
     */
    function getCodeName(codename, id) {
        Util.ajax({
            url: Config.serverUrl + 'commonInter/getCodeInfoList',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    codename: codename
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
                var output = Mustache.render(document.getElementById('choose-tpl').innerHTML, {
                    list: res.custom.codelist
                });

                $(`#${id}`).html(output).find('div').eq(0).addClass('active');

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
 * @description 新增
 */
    function addDtyCheck(params) {
        console.log(params)
        Util.ajax({
            url: Config.serverUrl + 'task/addDtyCheck',
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
                    message: "新增成功",
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