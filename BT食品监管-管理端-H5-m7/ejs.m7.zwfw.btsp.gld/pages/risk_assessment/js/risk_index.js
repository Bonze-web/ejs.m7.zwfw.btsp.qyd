/**
    作者 :lujun
    创建时间 :2021/03/31
    版本 :[1.0, 2021/03/31]
    版权：江苏国泰新点软件有限公司
    描述：风险分级评定
 **/

(function (d, $) {
    'use strict';

    var minirefreshObj = null,// 下拉刷新实例
        userGuid = '',
        checkform = '';

    // 1 待接受（状态30） 2 待反馈  （状态40） 3 待复查  （状态95）  
    // 4待审核 （50、70） 5 已办结 100  6已反馈（status 50） 7移交待接收

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
                ejs.auth.getUserInfo({
                    success: function (result) {

                        var handleUser = JSON.parse(result.userInfo);

                        userGuid = handleUser.userguid;
                        console.log(userGuid)

                        initPage()
                    },
                    error: function (error) { }
                });
            });
        }
    );

    // 初始化页面信息
    function initPage() {
        $('#minirefresh').css('margin-top', $('.daily-tab').height())
        // 初始化事件监听
        initListeners();

        // ejs.ui.showWaiting('正在加载...');
        Promise.all([getCodeName('检查形式')]).then(function (res) {
            var codelist = res[0].custom.codelist;
            codelist.map((ele, i) => {
                if (ele.itemtext == '风险等级评定')
                    checkform = ele.itemvalue;
            })
            // 下拉刷新
            pullToRefresh();
        }).catch(function (error) {
            ejs.ui.closeWaiting();
            ejs.ui.alert(JSON.stringify(error));
        }).finally(function () {
            ejs.ui.closeWaiting();
        });
    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('body')
            // 点击tab切换
            .on('tap', '.daily-tab div', function (e) {
                $('.active').removeClass('active');
                $(this).addClass('active');
                minirefreshObj.refresh();
            })
            // 点击li 跳转
            .on('tap', '#listdata li', function (e) {
                var target = e.detail.target,
                    tabText = $('.active').text(),
                    url = 'risk_overcheckdetail',
                    dutyguid = this.dataset.dutyguid,
                    islock = this.dataset.islock;
                console.log(target.id)
                this.dataset.status = encodeURI(tabText);
                this.dataset.userguid = userGuid;



                //为底部按钮时
                switch (target.id) {
                    case 'statusbtn'://接收 反馈按钮
                        if (tabText == '移交待接收') {
                            getTransferInfo(dutyguid, $(target).text());
                            return;
                        }
                        url = $(target).text() == '反馈' ? 'risk_feedback' : '';

                        if (!url) {
                            ejs.ui.confirm({
                                title: "确认",
                                message: "确认接收",
                                buttonLabels: ['取消', '确定'],
                                cancelable: 1,
                                h5UI: false, // 是否强制使用H5-UI效果，默认false
                                success: function (result) {
                                    // 点击任意一个按钮都会回调
                                    if (result.which == 1) {
                                        getItem(dutyguid);
                                    }
                                },
                                error: function (err) { }
                            });
                        }
                        break;
                    case 'transferbtn':
                        if (tabText == '移交待接收') {
                            getTransferInfo(dutyguid, $(target).text());
                            return;
                        }
                        url = 'risk_transfer';
                        break;
                    default:
                        if (tabText == '待接收' || tabText == '待反馈' || tabText == '移交待接收') {
                            url = 'risk_receiveddetail'
                        }
                }

                if (url)
                    ejs.page.open({
                        pageUrl: `./${url}.html`,
                        pageStyle: 1,
                        orientation: 1,
                        data: this.dataset,
                        success: function (result) {
                            minirefreshObj.refresh();
                        },
                        error: function (error) { }
                    });
            })
    }
    //移交待接收
    function getTransferInfo(guid, text) {
        Util.ajax({
            url: Config.serverUrl + 'task/getTransferInfo',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dutyguid: guid,
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
                var handletype = text == '退回' ? '1' : '2';
                var transferrecord = res.custom.transferrecord;
                if (!transferrecord) {
                    ejs.ui.toast('移交信息为空');
                    return;
                }

                ejs.page.open({
                    pageUrl: './risk_transferback.html',
                    pageStyle: 1,
                    orientation: 1,
                    data: {
                        guid: guid,
                        handletype: handletype,
                        senduserguid: transferrecord.senduserguid,
                        transfertype: transferrecord.transfertype
                    },
                    success: function (result) {
                        minirefreshObj.refresh();
                    },
                    error: function (error) { }
                });


            },
            error: function (err) {
                ejs.ui.toast(err);
            }
        });
    }

    /**
    * @description 获取代码项
    */
    function getCodeName(codename) {
        return new Promise(function (resolve, reject) {
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

                    resolve(res);

                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    }
    //接受检查
    function getItem(guid) {
        Util.ajax({
            url: Config.serverUrl + 'task/updateTask',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dutyguid: guid,
                    status: '40',
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

            },
            error: function (err) {
                ejs.ui.toast(err);
            }
        });
    }

    /**
     * 下拉刷新
     * @param {String} url 接口地址
     */
    function pullToRefresh() {
        minirefreshObj = new MiniRefreshBiz({
            url: Config.serverUrl + 'task/getTaskList',
            template: '#item-template',
            initPageIndex: 0,
            listContainer: '#listdata',
            contentType: 'application/json;charset=UTF-8',
            // contentType: 'application/x-www-form-urlencoded',
            dataRequest: function (currPage) {
                var requestData = JSON.stringify({
                    token: "Epoint_WebSerivce_**##0601",
                    params: {
                        currentpageindex: currPage.toString(),
                        pagesize: '10',
                        checkform: checkform,//检查形式:区分 日常、专项、风险评定
                        searchkey: "",//非必填 搜索框查询条件（任务名称或者任务编码）
                        type: $('.active')[0].dataset.type,//非必填 状态查询条件
                    }
                });

                // console.log(requestData);

                return requestData;
            },
            dataChange: function (res) {
                // console.log(JSON.stringify(res), res);
                var list = res.custom.taskinfolist,
                    transferbtn = '',
                    statusbtn = '',
                    statusbtnStyle = '';
                switch ($('.active')[0].dataset.type) {
                    case '1':
                        transferbtn = '移交';
                        statusbtn = '接收';
                        statusbtnStyle = '';
                        break;
                    case '2':
                        transferbtn = '移交';
                        statusbtn = '反馈';
                        statusbtnStyle = '';
                        break;
                    case '7':
                        transferbtn = '退回';
                        statusbtn = '接收';
                        statusbtnStyle = '';
                        break;
                    default:
                        statusbtnStyle = 'hidden';
                }
                //warningstatus 已超期 1 ；临近超期 2 ；未超期 3；
                // resttime overtime notovertime
                list.map((ele, i) => {
                    ele.transferbtn = transferbtn;
                    ele.statusbtn = statusbtn;
                    ele.statusbtnStyle = statusbtnStyle;
                    ele.warningtext = ele.warningstatus == 1 ? '已超期' : (ele.warningstatus == 2 ? '临近超期' : '未超期');

                    if (ele.islock == 1 && $('.active')[0].dataset.type == 1) {//待接收且islock为1
                        ele.statusbtnStyle = 'hidden';
                    } else {
                        ele.islockstyle = 'hidden';
                    }

                    if (!ele.statusbtnStyle) {
                        ele.timestyle = ele.warningstatus == 1 ? 'overtime' : (ele.warningstatus == 2 ? 'resttime' : 'notovertime');
                    }
                })

                return list;
            },
            success: function (res) {
            },
            itemClick: function (e) {

            },
            error: function (err) {
                ejs.ui.toast(JSON.stringify(err));
            }
        });
    }
})(document, Zepto);