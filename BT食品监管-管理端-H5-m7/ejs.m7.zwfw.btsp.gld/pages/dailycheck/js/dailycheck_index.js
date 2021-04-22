/**
 * 作者：范周静
 * 创建时间：2019-05-13 08:56:59
 * 版本：[1.0, 2019-05-13]
 * 版权：江苏国泰新点软件有限公司
 * 描述：列表
 **/

(function (d, $) {
    'use strict';

    var status = '1',
        userGuid = '',
        minirefreshObj = null; // 下拉刷新实例

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
                    error: function (error) {}
                });
            });
        }
    );

    // 初始化页面信息
    function initPage() {
        // 初始化事件监听
        initListeners();

        getCodeName('检查形式').then(() => {
            // 下拉刷新
            pullToRefresh();
        })

    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('#dailytab').on('tap', 'div', function () {
            $(this).siblings().removeClass('active');

            $(this).addClass('active');
            status = $(this).data('status');

            minirefreshObj.refresh();
        })

        $('body').on('tap', '.checklist-content,.checklist-title', function (e) {
            var rowguid = $(this).parent().data('rowguid'),
                islock = $(this).parent().data('islock') || '';

            console.log(e.target)

            if (status == '1') {
                ejs.page.open("./dailycheck_getdetail.html", {
                    rowguid: rowguid,
                    userguid: userGuid,
                    islock: islock
                });
            } else if (status == '7') {
                ejs.page.open("./dailycheck_yijiaowaitgetdetail.html", {
                    rowguid: rowguid,
                    userguid: userGuid
                });
            } else if (status == '2') {
                ejs.page.open("./dailycheck_waitfeeddetail.html", {
                    rowguid: rowguid,
                    userguid: userGuid,
                    islock: islock
                });
            } else if (status == '3') {
                ejs.page.open("./dailycheck_secondcheckdetail.html", {
                    rowguid: rowguid,
                    userguid: userGuid,
                    islock: islock
                });
            } else if (status == '4') {
                ejs.page.open("./dailycheck_waitcheckdetail.html", {
                    rowguid: rowguid,
                    userguid: userGuid
                });
            } else if (status == '5') {
                ejs.page.open("./dailycheck_overcheckdetail.html", {
                    rowguid: rowguid,
                    userguid: userGuid
                });
            }
        })

        $('body').on('tap', '.operationbtn', function (event) {

            var optName = $(this).text(),
                guid = $(this).parent().parent().data('rowguid'),
                lng = $(this).parent().parent().data('lng') || '';

            // 接受操作分为两种，第一种状态下的接受，就是普通改变状态接受，移交后的接受代表抄送移交接受

            if (status == '1' || status == '2' || status == '3') {
                if (optName == '移交') {
                    ejs.page.open({
                        pageUrl: "./dailycheck_yijiao.html",
                        pageStyle: 1,
                        orientation: 1,
                        data: {
                            guid: guid,
                            userguid: userGuid
                        },
                        success: function (result) {
                            minirefreshObj.refresh()

                        },
                        error: function (error) {}
                    });
                } else if (optName == '接收') {
                    ejs.ui.confirm({
                        title: "确认",
                        message: "确认接收",
                        buttonLabels: ['取消', '确定'],
                        cancelable: 1,
                        h5UI: false, // 是否强制使用H5-UI效果，默认false
                        success: function (result) {
                            // 点击任意一个按钮都会回调
                            if (result.which == 1) {
                                getItem(guid);
                            }
                        },
                        error: function (err) {}
                    });
                } else if (optName == '反馈') {
                    // 需判断经纬度是否已录入
                    if (lng == '') {
                        ejs.ui.confirm({
                            title: "提示",
                            message: "该企业还未录入经纬度坐标，请先录入在反馈",
                            buttonLabels: ['取消', '确定'],
                            cancelable: 1,
                            h5UI: false, // 是否强制使用H5-UI效果，默认false
                            success: function (result) {
                                // 点击任意一个按钮都会回调
                                if (result.which == 1) {
                                    ejs.page.open("./dailycheck_sign.html", {
                                        guid: guid,
                                        userguid: userGuid
                                    });
                                }
                            },
                            error: function (err) {}
                        });

                    } else {
                        ejs.page.open("./dailycheck_taskfeedback.html", {
                            guid: guid,
                            userguid: userGuid
                        });
                    }

                }else if(optName == '填写整改信息'){
                    ejs.ui.toast('请进入详情选择具体检查结果填写整改信息');
                }
            } else if (status == '7') {
                if (optName == '退回') {
                    getYijiaoDetail(guid, 1);
                } else if (optName == '接收') {
                    getYijiaoDetail(guid, 2);
                }
            }
        })
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

                ejs.ui.toast(res.custom.text);
                minirefreshObj.refresh();

            },
            error: function (err) {
                ejs.ui.toast(err);
            }
        });
    }

    function getYijiaoDetail(guid, type) {
        Util.ajax({
            url: Config.serverUrl + 'task/getTransferInfo',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dutyguid: guid
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

                var transferType = handleJson.transferrecord.transfertype,
                    sendUserguid = handleJson.transferrecord.senduserguid;

                if (type == 1) {
                    ejs.page.open("./dailycheck_yijiaoback.html", {
                        guid: guid,
                        userguid: userGuid,
                        transfertype: transferType,
                        senduserguid: sendUserguid
                    });
                } else {
                    ejs.page.open("./dailycheck_yijiaoget.html", {
                        guid: guid,
                        userguid: userGuid,
                        transfertype: transferType,
                        senduserguid: sendUserguid
                    });
                }

            },
            error: function (err) {
                ejs.ui.toast(err)
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
            template: function (value) {
                var template = '';

                if (status == '1') {
                    if (value.islock == '1') {
                        template = d.getElementById('item-templatelock').innerHTML;
                    } else {
                        template = d.getElementById('item-template').innerHTML;
                    }

                }else if(status == '2' || status == '3' || status == '7'){
                    template = d.getElementById('item-template').innerHTML;
                } else {
                    template = d.getElementById('item-template1').innerHTML;
                }

                return template;
            },
            listContainer: '#listdata',
            contentType: 'application/json;charset=UTF-8',
            // contentType: 'application/x-www-form-urlencoded',
            dataRequest: function (currPage) {
                var requestData = JSON.stringify({
                    token: 'Epoint_WebSerivce_**##0601',
                    params: {
                        userguid: userGuid,
                        checkform: '01',
                        type: status,
                        searchkey: '',
                        currentpageindex: currPage.toString(),
                        pagesize: '10'
                    }
                });

                // console.log(requestData);

                return requestData;
            },
            dataChange: function (res) {

                // 需要处理下时间以及状态
                res.custom.taskinfolist.forEach(item => {
                    //var restTime = dateCompare(item.planenddate);

                    if (item.warningstatus == '1') {
                        item.timestatus = 'overtime';
                        item.timestatustext = '已超期' + item.warningdate + '天';
                    } else if (item.warningstatus == '2') {
                        item.timestatus = 'resttime';
                        item.timestatustext = '剩余' + item.warningdate + '天';
                    } else {
                        item.timestatus = 'lesttime';
                        item.timestatustext = '';
                    }

                    if (status == '1') {
                        item.btn1 = '移交';
                        item.btn2 = '接收';
                    } else if (status == '2') {
                        item.btn1 = '移交';
                        item.btn2 = '反馈';
                    } else if (status == '3') {
                        item.btn1 = '移交';
                        item.btn2 = '填写整改信息';
                    }else if (status == '7') {
                        item.btn1 = '退回';
                        item.btn2 = '接收';
                    }
                })

                return res.custom.taskinfolist;
            },
            success: function (res) {
                // 数据为空时！
                var dataLength = document.getElementById("listdata").querySelectorAll("li").length;
                if (parseInt(dataLength) > 0) {
                    document.querySelector('.upwrap-tips').style.display = "block";
                    document.querySelector('.em-tips').style.display = "none";
                } else {
                    //显示空盒子
                    document.querySelector('.upwrap-tips').style.display = "none";
                    document.querySelector('.em-tips').style.display = "block";
                }
            },
            itemClick: function (e) {

            },
            error: function (err) {
                ejs.ui.toast(JSON.stringify(err));
            }
        });
    }

    function dateCompare(date) {
        let startTime = new Date(); // 开始时间
        let endTime = new Date(date); // 结束时间
        let usedTime = endTime - startTime; // 相差的毫秒数
        let days = Math.floor(usedTime / (24 * 3600 * 1000)); // 计算出天数
        // let leavel = usedTime % (24 * 3600 * 1000); // 计算天数后剩余的时间
        // let hours = Math.floor(leavel / (3600 * 1000)); // 计算剩余的小时数
        // let leavel2 = leavel % (3600 * 1000); // 计算剩余小时后剩余的毫秒数
        // let minutes = Math.floor(leavel2 / (60 * 1000)); // 计算剩余的分钟数
        //return days + '天' + hours + '时' + minutes + '分';

        return days;
    }
})(document, Zepto);