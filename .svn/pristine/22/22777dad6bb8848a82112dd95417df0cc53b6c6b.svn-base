/**
 * 作者：丁力
 * 创建时间：2019-9-7 20:58:354
 * 版本：[1.0, 2019-9-7]
 * 版权：江苏国泰新点软件有限公司
 * 描述：检查签到
 **/
'use strict';

var dutyguid = '';
var dutyName = '';

Util.loadJs(['js/widgets/baidumap/baidumap.js', 'pages/common/common.js'], function () {
    customBiz.configReady();
});

var customBiz = {
    // 初始化校验，必须调用
    // 注，如果没有组件API需要注册，可以传空，注册组件时，必须容器支持对应组件才能注册成功
    configReady: function () {
        var self = this;

        self.initListeners();
        self.location();
        self.getSignInfo();
    },
    initListeners: function () {
        var self = this;

        ejs.device.setBounce({
            isEnable: 0,
            success: function (result) {},
            error: function (error) {}
        });
        // 区域滚动
        mui('.mui-scroll-wrapper').scroll({
            scrollY: true, // 是否竖向滚动
            scrollX: false, // 是否横向滚动
            startX: 0, // 初始化时滚动至x
            startY: 0, // 初始化时滚动至y
            indicators: true, // 是否显示滚动条
            deceleration: 0.0006, // 阻尼系数,系数越小滑动越灵敏
            bounce: false // 是否启用回弹
        });

        ejs.navigator.setRightBtn({
            isShow: 1,
            text: '按钮右1',
            // 设置图片的优先级会较高
            imageUrl: '../attendance/img/img_history.png',
            which: 0, // 每一个按钮的回调是独立返回
            success: function (result) {
                ejs.page.open('./attendance_history.html', {});
            },
            error: function (error) {}
        });

        //地点
        mui('.em-addressinfo').on('tap', '.em-siteinfodetail', function () {
            self.title = Zepto(this).children().children('.em-site').text();
            self.address = Zepto(this).children().children('.em-sitedetail').text();

            $('.haschoose').text(self.title);

            self.addressinfo.scrollTop(0).height('93px').css('overflow', 'hidden');
            setTimeout(function () {
                self.refreshicon.removeClass('mui-hidden');
                self.downarrow.removeClass('mui-hidden');
                self.button.removeClass('mui-hidden');
            }, 300);
        });

        //展开
        mui('.em-addressinfo').on('tap', '.em-downarrow', function () {
            self.refreshicon.addClass('mui-hidden');
            self.downarrow.addClass('mui-hidden');
            self.button.addClass('mui-hidden');
            self.addressinfo.height('448px').css('overflow', 'scroll');
        });

        //签到
        mui('.mui-content').on('tap', '.em-button', function () {
            var place = self.address + self.title;
            var value = $('.em-choose').text();
            //判断是否已选择任务
            if ($('.em-choose').text() != '') {
                ejs.ui.confirm({
                    title: '位置',
                    message: place,
                    buttonLabels: ['取消', '下一步'],
                    cancelable: 1,
                    success: function (result) {
                        // 点击任意一个按钮都会回调
                        if (result.which == '1') {
                            ejs.ui.confirm({
                                title: '任务',
                                message: value,
                                buttonLabels: ['取消', '签到'],
                                cancelable: 1,
                                success: function (result) {
                                    // 点击任意一个按钮都会回调
                                    if (result.which == '1') {
                                        self.sign();
                                    }
                                }
                            });
                        }
                    }
                });
            } else {
                ejs.ui.toast('请先选择任务再签到。');
            }
        });

        //选择任务
        mui('.em-assignment').on('tap', '.em-choose', function () {
            ejs.page.open({
                pageUrl: './attendance_assignment.html',
                pageStyle: 1,
                orientation: 1,
                success: function (result) {
                    dutyguid = result.resultData.dutyguid;
                    dutyName = result.resultData.value;
                    $('.em-choose').text(result.resultData.value);
                },
                error: function (error) {}
            });
        });
    },
    /**
     * 初始化定位
     */
    location: function () {
        var self = this;

        Util.ejs.ui.showWaiting('加载中...');
        // 加载百度地图
        var bMap = new BaiduMap({
            container: '#baidumap',
            isForceDD: false,
            isForceEJS: true,
            success: function (point) {
                self.longitude = point.lng;
                self.latitude = point.lat;
                // 搜索热点
                bMap.searchHotPoint({
                    // 半径为1000米内的POI,默认100米
                    poiRadius: 12500,
                    // 列举出50个POI,默认10个
                    numPois: 12,
                    success: function (allPois) {
                        Util.ejs.ui.closeWaiting();
                        var tmpInfo = allPois;
                        // alert(JSON.stringify(tmpInfo));
                        var template = document.querySelector('#template').innerHTML;
                        var detemplate = document.querySelector('#detemplate').innerHTML;
                        var html = '';
                        self.title = tmpInfo[0].title;
                        self.address = tmpInfo[0].address;
                        $('.haschoose').text(self.title);
                        mui.each(tmpInfo, function (key, value) {
                            if (key == '1') {
                                html += detemplate;
                            } else {
                                html += Mustache.render(template, value);
                            }
                        });
                        document.querySelector('.em-addressul').innerHTML = html;
                        Zepto('.mui-content').removeClass('mui-hidden');

                        self.addressinfo = Zepto('.em-addressinfo'); //地点列表
                        self.refreshicon = Zepto('.em-refreshicon'); //刷新按钮
                        self.downarrow = Zepto('.em-downarrow'); //展开按钮
                        self.button = Zepto('.em-button'); //签到按钮
                    }
                });
            },
            error: function (msg) {
                Util.ejs.ui.closeWaiting();
                document.querySelector('.em-wifi').style.display = 'block';
                // 获取容器版本
                ejs.runtime.getEjsVersion({
                    success: function (result) {
                        // 字符串逐字比较,判断容器版本
                        if (result.version <= '3.1.5') {
                            ejs.ui.toast(msg);
                        } else {
                            // 检查是否有定位权限 容器版本大于3.1.5
                            ejs.device.checkPermissions({
                                permissionsType: 0,
                                success: function (result) {
                                    if (result.permissionGranted == 0) {
                                        // 如果没有定位权限
                                        ejs.ui.alert({
                                            title: '提示',
                                            message: Util.os.android
                                                ? '请前往设置允许程序定位权限'
                                                : '请确保开启定位服务并且允许程序定位权限',
                                            buttonName: '确定',
                                            cancelable: 1,
                                            success: function (result) {
                                                ejs.runtime.openSetting();
                                            },
                                            error: function (err) {}
                                        });
                                    } else if (result.permissionGranted == 1) {
                                        // 如果有定位权限依然失败
                                        ejs.ui.alert({
                                            title: '提示',
                                            message: '请确保开启定位服务且允许APP定位权限，仍然无效请重启手机再次尝试',
                                            buttonName: '确定',
                                            cancelable: 1,
                                            success: function (result) {
                                                ejs.runtime.openSetting();
                                            },
                                            error: function (err) {}
                                        });
                                    }
                                },
                                error: function (error) {}
                            });
                        }
                    },
                    error: function (error) {}
                });
            }
        });

        // 重新定位
        document.querySelector('.em-refreshicon').addEventListener('tap', function () {
            //             ejs.ui.toast('已重新定位！');
            bMap.update();
        });

        document.querySelector('.em-wifi').addEventListener('click', function () {
            ejs.page.reload();
        });
    },
    /**
     * 签到
     */
    sign: function () {
        var self = this;
        Util.ajax({
            // url: Config.serverUrl + 'checkInfo/addCheckInfo',
            url: 'http://117.191.67.11:8081/tyzf_cs/rest/sign/addCheckInfo',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    signplace: self.title,
                    signplacedetail: self.address,
                    longitude: self.longitude,
                    latitude: self.latitude,
                    dutyguid: dutyguid,
                    dutyName: dutyName
                }
            }),
            contentType: 'application/json',
            // dataPath: 'custom.signlst',
            // 考虑到网络不佳情况下，业务是否手动显示加载进度条
            isShowWaiting: false,
            success: function (result) {
                if (result.custom.code == '1') {
                    ejs.ui.toast('签到成功！');
                    // 兼容快速调用
                    ejs.page.close({
                        resultData: {
                            key1: 'value1'
                        }
                    });
                } else {
                    ejs.ui.alert({
                        title: '提示',
                        message: result.status.text,
                        buttonName: '确定',
                        cancelable: 1,
                        success: function (result) {
                            ejs.page.close({
                                resultData: {
                                    key1: 'value1'
                                }
                            });
                        },
                        error: function (err) {}
                    });
                }
            },
            error: function (error) {
                ejs.ui.toast(Config.TIPS_II);
            }
        });
    },
    /**
     * 获取签到信息
     */
    getSignInfo: function () {
        var self = this;

        Util.ajax({
            // url: Config.serverAttendanceUrl + 'checkInfo/getCheckInfo',
            url: 'http://117.191.67.11:8081/tyzf_cs/rest/checkInfo/getCheckInfo',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    fromdatetime: DateUtil.getDate('', 'yyyy-mm-dd') + ' 00:00:00',
                    todatetime: DateUtil.getDate('', 'yyyy-mm-dd') + ' 23:59:59'
                }
            }),
            contentType: 'application/json',
            // 考虑到网络不佳情况下，业务是否手动显示加载进度条
            isShowWaiting: false,
            success: function (result) {
                if (result.status.code == '1') {
                    var tmp = result.custom.signinfolist;
                    var templatetop = document.getElementById('templatetop').innerHTML;
                    var html = '';
                    var today = DateUtil.getDate('', 'yyyy-mm-dd');
                    var data = {
                        date: today.substring(5, 10),
                        week: DateUtil.getWeek(today),
                        address: '今天，您还没有签到哦~'
                    };
                    if (tmp.length > 0) {
                        data.address = tmp[tmp.length - 1].signplace + tmp[tmp.length - 1].signplacedetail;
                        html = Mustache.render(templatetop, data);
                    } else {
                        html = Mustache.render(templatetop, data);
                    }
                    document.querySelector('.em-sign').innerHTML = html;
                } else {
                    ejs.ui.toast(result.status.text);
                }
            },
            error: function (error) {
                console.log(error);
                ejs.ui.toast(Config.TIPS_II);
            }
        });
    }
};
