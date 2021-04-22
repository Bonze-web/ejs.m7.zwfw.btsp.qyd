/**
 * 作者：彭屹尧
 * 创建时间：2019-12-1 10:58:354
 * 版本：[1.0, 2019-12-1]
 * 版权：江苏国泰新点软件有限公司
 * 描述：监管对象详细信息
 **/

(function (d, $) {
    'use strict';

    var rowguid = '', // 主键guid
        // 基本信息
        baseEle = document.getElementById('baseList'),
        baseTpl = document.getElementById('base-template').innerHTML,
        // 执法人员信息
        checkEle = document.getElementById('checkList'),
        checkTpl = document.getElementById('checker-template').innerHTML,
        // 监管事项信息
        supervisionEle = document.getElementById('supervisionList'),
        supervisionTpl = document.getElementById('supervision-template').innerHTML,
        // 执法人员详细信息
        checkDetailEle = document.getElementById('checkDetail'),
        checkDetailTpl = document.getElementById('checkDetail-template').innerHTML;

    Util.loadJs(
        function () {
            var className = ejs.os.android ? 'com.epoint.app.restapi.EjsApi' : 'SZEJSApi';
            var jsApiList = [{
                'moduleName': className
            }];

            Config.configReady(jsApiList, function () {

                // 初始化
                initPage();

            }, function (err) { });
        }
    );

	/**
	 * 初始化事件监听
	 */
    function initPage() {
        ejs.ui.showWaiting();
        rowguid = Util.getExtraDataByKey('rowguid') || '';
        console.log(rowguid);


        if (status == '30') { //待接收
            Zepto('.operation')[0].classList.remove('mui-hidden');
        } else { // 已办结
            Zepto('.operation')[0].classList.add('mui-hidden');
            Zepto('.lawenforcer').css('margin-bottom', '0 !important');
        }

        getDetail(); // 获取详情
        getSupervisionList(); // 获取监管事项信息
        getCheckerList(); // 获取执法人员列表
        initListeners();
    }

	/**
	 * 初始化事件监听
	 */
    function initListeners() {

        // 接收任务
        Zepto('#btn-receive').on('tap', function () {
            ejs.ui.confirm({
                title: "提示",
                message: "是否确认接收该任务？",
                buttonLabels: ['取消', '确定'],
                cancelable: 1,
                success: function (result) {
                    // 点击任意一个按钮都会回调
                    console.log(result);
                    if (result.which == 1) {
                        reveiveTask();
                    }
                },
                error: function (err) { }
            });

        });

        // 行政相对人导航
        Zepto('.mui-content').on('tap', '#nav', function () {
            console.log(this.dataset.lat);
            console.log(this.dataset.lng);
            var lat = this.dataset.lat,
                lng = this.dataset.lng,
                name = this.dataset.name;
            if (lat == '' || lng == '') {
                ejs.ui.toast('暂无定位信息');
                return;
            }

            ejs.callApi({
                // 该组件下的任意api
                name: "showNavigation",
                mudule: 'moduleName',
                // 是否长期回调，为0时可以省略
                isLongCb: 0,
                data: {
                    name: name,
                    lat: lat,
                    lng: lng
                },
                success: function (result) {

                },
                error: function (error) {
                    // 处理失败
                }
            });

        });

        // 行政相对人电话
        Zepto('.mui-content').on('tap', '#dzxdr-tel', function () {
            var contacttel = this.dataset.tel;
            console.log(contacttel);

            if (contacttel == '') {
                ejs.ui.toast('当前行政相对人暂无电话信息');
                return;
            }

            ejs.ui.confirm({
                title: "提示",
                message: "确认拨打电话？",
                buttonLabels: ['取消', '确定'],
                cancelable: 1,
                success: function (result) {
                    // 点击任意一个按钮都会回调
                    console.log(result);
                    if (result.which == 1) {
                        ejs.device.callPhone(contacttel);
                    }
                },
                error: function (err) { }
            });
        });

        // 监管事项信息详情
        Zepto('#supervisionList').on('tap', 'li', function () {
            console.log(this.dataset.rowguid);
            console.log(this.dataset.catalogid);

            ejs.page.open("../regulatory/regulatory_detail.html", {
                catalogid: this.dataset.catalogid,
                rowguid: this.dataset.rowguid
            });
        });

        //点击蒙版空白部分关闭蒙版
        $('#mask').on('tap', function (e) {
            var target = e.target;
            if (target.id == 'mask') {
                closeMask();
            }
        });

        // 展示执法人员详细信息
        Zepto('#checkList').on('tap', '.action-item-title', function (e) {
            $('#mask').removeClass('mui-hidden');
            $('#mask-people').removeClass('mui-hidden');
            getCheckerInfo(this.dataset.checkguid);
        });

        // 关闭执法人员详情弹框
        Zepto('.close-wrap').on('tap', function (e) {
            closeMask();
        });

        // 拨打电话
        Zepto('.lawenforcer').on('tap', '.tel', function (e) {
            e.stopPropagation();
            console.log(this.dataset.contacttel);
            var contacttel = this.dataset.contacttel;
            ejs.ui.confirm({
                title: "提示",
                message: "确认拨打电话？",
                buttonLabels: ['取消', '确定'],
                cancelable: 1,
                success: function (result) {
                    // 点击任意一个按钮都会回调
                    console.log(result);
                    if (result.which == 1) {
                        ejs.device.callPhone(contacttel);
                    }
                },
                error: function (err) { }
            });
        });
    }

	/**
	 * 关闭蒙版
	 */
    function closeMask() {
        $('#mask').addClass('mui-hidden');
        $('#mask-people').addClass('mui-hidden');
    }

	/**
	 * @description 获取详情
	 */
    function getDetail() {
        var url = Config.serverUrl + 'checkInfo/getCheckTaskDetail',
            data = JSON.stringify({
                token: Config.validate,
                params: {
                    dutyguid: rowguid
                }
            });

        console.log('获取详情：', url, data);

        Util.ajax({
            url: url,
            data: data,
            contentType: 'application/json',
            beforeSend: function () {
                ejs.ui.showWaiting();
            },
            success: function (result) {
                console.log(result);
                if (result.status.code != 1) {
                    ejs.ui.toast(result.status.text);

                    return;
                }

                // 渲染数据
                baseEle.innerHTML = Mustache.render(baseTpl, {
                    baseInfo: result.custom
                });

            },
            error: function (error) {
                console.log(JSON.stringify(error));
                ejs.ui.toast('接口有误，请联系管理员');
                ejs.ui.closeWaiting({});
            },
            complete: function () {
                ejs.ui.closeWaiting({});
            }
        });
    }

	/**
	 * @description 接收任务
	 */
    function reveiveTask() {
        var url = Config.serverUrl + 'checkInfo/updateCheckInfo',
            data = JSON.stringify({
                token: Config.validate,
                params: {
                    dutyguid: rowguid,
                    status: '40',
                    addressregistered: '',
                    addressoperating: '',
                    areanumber: '',
                    entrustdept: '',
                    entrustdeptcode: '',
                    checktype: '',
                    checkmode: ''
                }
            });

        console.log('接收任务：', url, data);

        Util.ajax({
            url: url,
            data: data,
            contentType: 'application/json',
            beforeSend: function () {
                ejs.ui.showWaiting();
            },
            success: function (result) {
                console.log(result);
                if (result.status.code != 1) {
                    ejs.ui.toast(result.status.text);

                    return;
                }

                ejs.ui.toast('接收成功');
                ejs.page.close(JSON.stringify({
                    key: '111'
                }));

            },
            error: function (error) {
                console.log(JSON.stringify(error));
                ejs.ui.toast('接口有误，请联系管理员');
                ejs.ui.closeWaiting({});
            },
            complete: function () {
                ejs.ui.closeWaiting({});
            }
        });
    }

	/**
	 * @description 获取监管事项信息
	 */
    function getSupervisionList() {
        var url = Config.serverUrl + 'checkInfo/getCheckTaskItemList',
            data = JSON.stringify({
                token: Config.validate,
                params: {
                    dutyguid: rowguid,
                    currentpageindex: '1',
                    pagesize: '100'
                }
            });

        console.log('获取执法人员列表：', url, data);

        Util.ajax({
            url: url,
            data: data,
            contentType: 'application/json',
            beforeSend: function () {
                ejs.ui.showWaiting();
            },
            success: function (result) {
                console.log(result);
                if (result.status.code != 1) {
                    ejs.ui.toast(result.status.text);

                    return;
                }

                // 渲染数据
                supervisionEle.innerHTML = Mustache.render(supervisionTpl, {
                    supervisionInfo: result.custom.itemlist
                });

            },
            error: function (error) {
                console.log(JSON.stringify(error));
                ejs.ui.toast('接口有误，请联系管理员');
                ejs.ui.closeWaiting({});
            },
            complete: function () {
                ejs.ui.closeWaiting({});
            }
        });
    }

	/**
	 * @description 获取执法人员列表
	 */
    function getCheckerList() {
        var url = Config.serverUrl + 'checkInfo/getCheckPersonList',
            data = JSON.stringify({
                token: Config.validate,
                params: {
                    dutyguid: rowguid,
                    currentpageindex: '1',
                    pagesize: '100'
                }
            });

        console.log('获取执法人员列表：', url, data);

        Util.ajax({
            url: url,
            data: data,
            contentType: 'application/json',
            beforeSend: function () {
                ejs.ui.showWaiting();
            },
            success: function (result) {
                console.log(result);
                if (result.status.code != 1) {
                    ejs.ui.toast(result.status.text);

                    return;
                }

                // 渲染数据
                checkEle.innerHTML = Mustache.render(checkTpl, {
                    checkInfo: result.custom.personlist
                });

            },
            error: function (error) {
                console.log(JSON.stringify(error));
                ejs.ui.toast('接口有误，请联系管理员');
                ejs.ui.closeWaiting({});
            },
            complete: function () {
                ejs.ui.closeWaiting({});
            }
        });
    }

	/**
	 * @description 获取执法人员信息
	 */
    function getCheckerInfo(guid) {
        var url = Config.serverUrl + 'checkInfo/getCheckPersonDetail',
            data = JSON.stringify({
                token: Config.validate,
                params: {
                    lepguid: guid
                }
            });

        console.log('获取执法人员信息：', url, data);

        Util.ajax({
            url: url,
            data: data,
            contentType: 'application/json',
            beforeSend: function () {
                ejs.ui.showWaiting();
            },
            success: function (result) {
                console.log(result);
                if (result.status.code != 1) {
                    ejs.ui.toast(result.status.text);

                    return;
                }

                // 渲染数据
                checkDetailEle.innerHTML = Mustache.render(checkDetailTpl, {
                    checkDetailInfo: result.custom
                });

            },
            error: function (error) {
                console.log(JSON.stringify(error));
                ejs.ui.toast('接口有误，请联系管理员');
                ejs.ui.closeWaiting({});
            },
            complete: function () {
                ejs.ui.closeWaiting({});
            }
        });
    }

}(document, Zepto));