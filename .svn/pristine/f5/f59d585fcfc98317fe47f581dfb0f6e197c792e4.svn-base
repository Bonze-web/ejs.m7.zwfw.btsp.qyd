/**
 * 作者：解宇
 * 创建时间：2019-09-05
 * 版本：[1.0, 2019-09-05]
 * 版权：江苏国泰新点软件有限公司
 * 描述：检查任务-任务详情（进行中）
 **/

(function (d, $) {
    'use strict';

    var rowguid = '', // 主键guid
        token = '',
        pviguid = '',
        areaList = [], // 行政区划代码项
        areanumber = '',
        isfeedback = '0', // 是否处罚
        punishcode = '', // 处罚项
        issaveflag = '',
        objguid = '',
        objname = '',
        objtype = '',
        objtypeText = '',
        // 基本信息
        baseEle = document.getElementById('baseList'),
        baseTpl = document.getElementById('base-template').innerHTML;

    Util.loadJs([
        'js/widgets/mui.picker/mui.picker.css',
        'js/widgets/mui.poppicker/mui.poppicker.css',
        'js/widgets/mui.picker/mui.picker.js',
        'js/widgets/mui.poppicker/mui.poppicker.js',
    ],
        function () {
            var className = ejs.os.android ? 'com.epoint.app.restapi.EjsApi' : 'SZEJSApi';
            var jsApiList = [{
                'moduleName': className
            }];
            Config.configReady(jsApiList, function () {
                ejs.auth.getToken({
                    success: function (result) {
                        token = result.access_token;
                        // 初始化
                        initPage();
                    },
                    error: function (error) { }
                });

            }, function (err) { });
        }
    );

	/**
	 * 初始化事件监听
	 */
    function initPage() {
        rowguid = Util.getExtraDataByKey('rowguid') || '';
        pviguid = Util.getExtraDataByKey('pviguid') || '';

        getDetail(); // 获取详情
        getCheckBehaviorList(); // 获取监管行为信息
//      getAreaInfo(); // 获取行政区划
        sign(); // 签名
    }

	/**
	 * 初始化事件监听
	 */
    function initListeners() {




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
                message: "确认拨打电话：" + contacttel,
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
	 * @description 获取详情
	 */
    function getDetail() {
        var url = Config.serverUrl + 'checkInfo/getCheckTaskDetail',
            data = JSON.stringify({
                token: Config.validate,
                params: {
                    dutyguid: rowguid,
                    pviguid: pviguid
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

                objguid = result.custom.objguid;
                objname = result.custom.objname;
                objtype = result.custom.objtype;
                objtypeText = result.custom.objtypeText;

                var signlist = result.custom.sings;
                signlist.forEach(function (item, index) {
                    if (item.attachguid == '') {
                        item.isshow = '0';
                    } else {
                        item.isshow = '1';
                    }
                });

                // 渲染数据-基本信息
                baseEle.innerHTML = Mustache.render(baseTpl, {
                    baseInfo: result.custom
                });

                initListeners(); // 事件监听

            },
            error: function (error) {
                console.log(JSON.stringify(error));
                ejs.ui.toast('接口有误，请联系管理员');
                ejs.ui.closeWaiting();
            },
            complete: function () {
                ejs.ui.closeWaiting();
            }
        });
    }

	/**
	 * @description 获取监管行为信息
	 */
    function getCheckBehaviorList() {
        var url = Config.serverUrl + 'checkInfo/getCheckObjBehaviorList',
            data = JSON.stringify({
                token: Config.validate,
                params: {
                    dutyguid: rowguid,
                    currentpageindex: '1',
                    pagesize: '100',
                    pviguid: ''
                }
            });

        console.log('获取监管行为信息：', url, data);

        Util.ajax({
            url: url,
            data: data,
            contentType: 'application/json',
            beforeSend: function () {
                ejs.ui.showWaiting();
            },
            success: function (result) {
                if (result.status.code != 1) {
                    ejs.ui.toast(result.status.text);

                    return;
                }

                var list = result.custom.behaviorobjlist;
                list.forEach(function (item, index) {
                    if (item.checkresultvalue == '01' || item.checkresultvalue == '02' || item.checkresultvalue == '03') {
                        item.checkstatus = '1';
                    }
                });

                // 渲染数据
                supervisionEle.innerHTML = Mustache.render(supervisionTpl, {
                    supervisionfo: list
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
	 * @description 办结/保存
	 */
    function handleItem(status, punishstatus) {
        var url = Config.serverUrl + 'checkInfo/updateCheckInfo',
            data = JSON.stringify({
                token: Config.validate,
                params: {
                    dutyguid: rowguid,
                    status: status,
                    addressregistered: '',
                    addressoperating: '',
                    areanumber: '',
                    entrustdept: '',
                    entrustdeptcode: '',
                    checktype: '',
                    checkmode: '',
                    ispunish: punishstatus,
                    issave: issaveflag
                }
            });

        console.log('办结/保存：', url, data);

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

                if (status == '40') {
                    ejs.ui.toast('保存成功');
                } else {
                    ejs.ui.toast('反馈成功');
                }

                ejs.page.close(JSON.stringify({
                    rowguid: rowguid
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
	 * @description 删除监管行为
	 */
    function deleteAction(guid) {
        var url = Config.serverUrl + 'checkInfo/deleteCheckBhvObjInfo',
            data = JSON.stringify({
                token: Config.validate,
                params: {
                    rowguid: guid
                }
            });

        console.log('删除监管行为：', url, data);

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

                ejs.ui.toast('删除成功');

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
	 * @description 所属行政区划
	 */
    function getAreaInfo() {
        var url = Config.serverUrl + 'commonInter/getAreaInfoList',
            data = JSON.stringify({
                token: Config.validate,
                params: {
                    areacode: Config.areacode
                }
            });

        console.log('所属行政区划：', url, data);

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
                result.custom.areainfolist.forEach(function (item, index) {
                    areaList.push({
                        text: item.areaname,
                        value: item.areacode
                    });
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
	 * @description 控制value的值
	 */
    function chk(v, name) {
        var s = Zepto("input[name=" + name + "]");
        console.log(s);
        for (var i = 0; i < s.length; i++) {
            if (s[i].value == v) {
                console.log('匹配');
                s[i].checked = "checked";
                return;
            }
        }
    }

	/**
	 * @description 提交验证
	 */
    function validate() {
        var flag = 1;
        var num = 0;

        Zepto('#supervisionList li').each(function (index, val) {
            var result = Zepto(val).data('checkresultstatusvalue');
            console.log('result=' + result);
            if (result != '01' && result != '02' && result != '03') {
                flag = 0;

                return false;
            }
            flag = 1;
        });

        if (flag == 0) {
            return false;
        }

        return true;
    }



    // 请求
    function ajax(url, data, success) {
        var data = JSON.stringify(data);
        var url = Config.serverUrl + url;

        ejs.ui.showWaiting();
        Util.ajax({
            url: url,
            data: data,
            contentType: 'application/json',
            success: function (result) {
                success(result);
                ejs.ui.closeWaiting();
            },
            error: function (res) {
                console.log(JSON.stringify(res));
            }
        });
    }

    // 签名之后保存入库接口
    function signadd(attachguid, personguid) {
        var url = Config.serverUrl + 'checkInfo/signadd',
            data = JSON.stringify({
                token: Config.validate,
                params: {
                    dutyguid: rowguid,
                    lepguid: personguid,
                    attachguid: attachguid
                }
            });

        console.log('签名：', url, data);

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
                ejs.ui.toast('签名成功');

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