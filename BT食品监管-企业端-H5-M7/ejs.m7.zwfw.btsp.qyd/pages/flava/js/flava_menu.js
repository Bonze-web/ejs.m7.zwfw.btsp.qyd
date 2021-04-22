/**
 * 作者： 张金锁
 * 创建时间： 2021/04/06 14:57:36
 * 版本： [1.0]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：每日菜谱
 */
(function (doc, Util) {
    'use strict';

    var rowguid = '';
    var menu_date = Util.getExtraDataByKey('date') || '2021-02-19';
    var pripid = '';

    Util.loadJs(['pages/common/common.js'], function () {
        initPage();
    });

    /*
     * @description 获取pripid
     */
    function initPage() {
        common.commGetUserInfo(function (res) {
            console.log('🚀 ~ file: news_index.js ~ line 30 ~ res', res);
            pripid = res.loginid;
            initListeners();
            getTabData();
        });
    }

    /*
     * @description 点击事件
     */
    function initListeners() {
        $('body')
            //选择早餐、午餐还是晚餐
            .on('tap', '.em-tab-selector', function () {
                $(this).addClass('em-active0').siblings().removeClass('em-active0');
                getTypeData();
            })
            //新增主食页
            .on('tap', '.em-add-icon', function () {
                var foodtype = $(this).parent().parent().attr('itemvalue');
                var rowguid = $('.em-active0').attr('rowguid');
                ejs.page.open(
                    Config.serverUrl.replace(/rest\//, '') +
                        'frame/fmui/pages/jyqyinfo/ejgtyzfobjfoodoptmenufood/ejgtyzfobjfoodoptmenufoodadd?menuguid=' +
                        rowguid +
                        '&foodType=' +
                        foodtype
                );
            })
            //删除菜谱内容
            .on('tap', '.em-delete', function (item) {
                var rowguid = $(this).parent().attr('rowguid');
                ejs.ui.confirm({
                    title: '是否选择',
                    message: '确定删除？',
                    buttonLabels: ['取消', '确定'],
                    cancelable: 1,
                    h5UI: false, // 是否强制使用H5-UI效果，默认false
                    success: function (result) {
                        if (result.which == 1) {
                            item.target.parentNode.remove();
                            deleteData(rowguid);
                        }
                    },
                    error: function (err) {}
                });
            })
            //内容详情页
            .on('tap', '.em-type', function () {
                var guid = $(this).parent().attr('rowguid');
                ejs.page.open(
                    Config.serverUrl.replace(/rest\//, '') +
                        'frame/fmui/pages/jyqyinfo/ejgtyzfobjfoodoptmenufood/ejgtyzfobjfoodoptmenufooddetail?guid=' +
                        guid
                );
            });
    }

    /*
     * @description 删除菜谱内容
     */
    function deleteData(rowguid) {
        Util.ajax({
            url: Config.serverUrl + 'foodopt/getfoodoptmenufooddelete',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    rowguid: rowguid
                }
            }),
            headers: { 'Content-Type': 'application/json' },
            success: function (result) {
                if (result.custom.code == 1) {
                    ejs.ui.toast(result.custom.text);
                    getTabData();
                } else {
                    ejs.ui.toast(result.custom.text);
                }
            },
            error: function (error) {
                console.log('返回结果：' + JSON.stringify(error));
            }
        });
    }

    /*
     * @description 获取tab栏数据
     */
    function getTabData() {
        Util.ajax({
            url: Config.serverUrl + 'foodopt/getfoodoptmenuinfo',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    menu_date: menu_date,
                    pripid: pripid,
                    pagesize: '999',
                    currentpage: '0'
                }
            }),
            headers: { 'Content-Type': 'application/json' },
            success: function (result) {
                if (result.custom.code == 1) {
                    var tmpInfo = result.custom.foodoptmenulist,
                        template = document.getElementById('template-tab').innerHTML,
                        html = '';
                    var indexa = '';
                    $.each(tmpInfo, function (index, item) {
                        item.indexa = index;
                        html += Mustache.render(template, item);
                    });
                    document.getElementById('listdata-tab').innerHTML = html;
                    getTypeData();
                } else {
                    ejs.ui.toast(result.custom.text);
                }
            },
            error: function (error) {
                console.log('返回结果：' + JSON.stringify(error));
            }
        });
    }

    /*
     * @description 获取菜谱类型数据
     */
    function getTypeData() {
        Util.ajax({
            url: Config.serverUrl + 'commonInter/getCodeInfoList',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    codename: '配餐类型'
                }
            }),
            headers: { 'Content-Type': 'application/json' },
            success: function (result) {
                if (result.status.code == 1) {
                    var tmpInfo = result.custom.codelist,
                        template = document.getElementById('template-type').innerHTML,
                        html = '';
                    var foodTypeList = [];
                    $.each(tmpInfo, function (index, item) {
                        foodTypeList.push(item.itemvalue);
                        item.a1 = index;
                        html += Mustache.render(template, item);
                    });
                    document.getElementById('listdata-type').innerHTML = html;
                    var key = 0;
                    $.each(foodTypeList, function (indexInArray, valueOfElement) {
                        key = indexInArray;
                        getListData(valueOfElement, key);
                    });
                } else {
                    ejs.ui.toast(result.status.text);
                }
            },
            error: function (error) {
                console.log('返回结果：' + JSON.stringify(error));
            }
        });
    }

    /*
     * @description 获取列表数据
     */
    function getListData(foodtype, key) {
        rowguid = $('.em-active0').attr('rowguid');
        Util.ajax({
            url: Config.serverUrl + 'foodopt/getfoodoptmenufoodinfo',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    menuguid: rowguid,
                    food_type: foodtype
                }
            }),
            headers: { 'Content-Type': 'application/json' },
            success: function (result) {
                if (result.custom.code == 1) {
                    var tmpInfo = result.custom.foodoptmenufoodinfo,
                        template = document.getElementById('template').innerHTML,
                        html = '';
                    $.each(tmpInfo, function (index, item) {
                        html += Mustache.render(template, item);
                    });
                    document.getElementById('listdata' + key).innerHTML = html;
                } else {
                    ejs.ui.toast(result.custom.text);
                }
            },
            error: function (error) {
                console.log('返回结果：' + JSON.stringify(error));
            }
        });
    }
})(document, window.Util);
