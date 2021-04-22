/**
 * 作者：印沛锜
 * 创建时间：2020-09-05 14:27
 * 版本：[1.0, 2020-09-05]
 * 版权：江苏国泰新点软件有限公司
 * 描述：扫一扫跳转
 **/
(function () {
    'use strict';

    Util.loadJs([
        'pages/common/common.js',
    ],
        function () {
            customBiz.configReady();
        });

    var idcode = Util.getExtraDataByKey('uniscid') || '';//91652722MA78T4N453

    /**
     * @description 所有业务处理
     */
    var customBiz = {
        // 初始化校验，必须调用
        // 注，如果没有组件API需要注册，可以传空，注册组件时，必须容器支持对应组件才能注册成功
        configReady: function () {
            var self = this;
            Config.configReady(null, function () {
                self.initListeners();
                self.initPage();
            }, function (error) { });

        },
        initListeners: function () {
            var self = this;
            self.getDtyNum();
        },
        initPage: function () {
        },
        /**
         * 编码获取任务（获取待接收、待反馈的任务）
         */
        getDtyNum: function () {
            var self = this;
            var data = {
                'idcode': idcode// 必填 行政相对人编码
            };
            common.ajax({
                url: Config.serverUrl + 'checkInfo/getDtyNumByIdcode',
                data: data,
                isShowWaiting: false
            }, function(result) {
                console.log(result);
                if (result.status.code == '1') {
                    console.log(result);
                    var res = result.custom;
                    if (res.total > 0) {
                        // 跳转检查任务列表
                        var url = './scan_index.html?idcode=' + idcode;
                        location.replace(url);
                    } else {
                        if (res.isinzyk == '1') {
                            //跳转随机检查新增页面
                            console.log(ejs.page)
                            ejs.ui.confirm({
                                title: "提醒",
                                message: "是否进行新增检查",
                                buttonLabels: ['取消', '确定'],
                                cancelable: 1,
                                h5UI: false, // 是否强制使用H5-UI效果，默认false
                                success: function(result) {
                                    console.log(result)
                                    console.log(result.which)
                                    if (result.which == '1') {
                                        ejs.storage.setItem({
                                            adminMsg: JSON.stringify(res),
                                            success: function(result) {
                                                var url = './scan_add.html';
                                                location.replace(url);
                                            },
                                            error: function(error) {}
                                        });
                                    } else {
                                        ejs.page.close('');
                                    }
                                },
                                error: function(err) {}
                            });
                        } else {
                            ejs.ui.toast('此行政相对人不在监管对象库中');
                        }
                    }
                } else {
                    ejs.ui.toast(result.status.text);
                }

            }, function(error) {
                // console.log(error);
                ejs.ui.toast(Config.TIPS_II + '错误原因：' + JSON.stringify(error));
            }, {
                isDebug: false
            });
            // var result = {
            //     "custom":{
            //         "administrativecpcetype":"001",
            //         "administrativecpcetypevalue":"统一社会信用代码",
            //         "total":0,
            //         "administrativecpuicode":"123456987412589632",
            //         "administrativecptype":"com",
            //         "administrativecpnavalue":"法人",
            //         "administrativecp":"阿勒泰地区医药局",
            //         "administrativecptypevalue":"企业",
            //         "acguig":"3e929233-7433-493e-b464-b9764a4d1830",
            //         "administrativecpna":"02",
            //         "isinzyk":1
            //     },
            //     "status":{
            //         "code":1,
            //         "text":"获取成功！"
            //     }
            // }
            // if (result.status.code == '1') {
            //     console.log(result);
            //     var res = result.custom;
            //     if (res.total > 0) {
            //         // 跳转检查任务列表
            //         var url = './scan_index.html?idcode=' + idcode;
            //         location.replace(url);
            //     } else {
            //         if (res.isinzyk == '1') {
            //             //跳转随机检查新增页面
            //             console.log(ejs.page)
            //             ejs.ui.confirm({
            //                 title: "提醒",
            //                 message: "是否进行新增检查",
            //                 buttonLabels: ['取消', '确定'],
            //                 cancelable: 1,
            //                 h5UI: false, // 是否强制使用H5-UI效果，默认false
            //                 success: function(result) {
            //                     if (result.which == '1') {
            //                         ejs.storage.setItem({
            //                             adminMsg: JSON.stringify(res),
            //                             success: function(result) {
            //                                 var url = './scan_add.html';
            //                                 location.replace(url);
            //                             },
            //                             error: function(error) {}
            //                         });
            //                     } else {
            //                         ejs.page.close('');
            //                     }
            //                 },
            //                 error: function(err) {}
            //             });
            //         } else {
            //             ejs.ui.toast('此行政相对人不在监管对象库中');
            //         }
            //     }
            // } else {
            //     ejs.ui.toast(result.status.text);
            // }
        }
    };
}())