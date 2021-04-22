/**
 * 作者： 张金锁
 * 创建时间： 2021/04/07 09:22:36
 * 版本： [1.0]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：校长陪餐
 */
(function (doc, Util) {
    'use strict';

    var acmpy_date = Util.getExtraDataByKey('date') || '2021-02-19';
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
            getListData();
            initListeners();
        });
    }

    /*
     * @description 点击事件
     */
    function initListeners() {
        $('body')
            //新增
            .on('tap', '.em-btn', function () {
                ejs.page.open(
                    Config.serverUrl.replace(/rest\//, '') +
                        'frame/fmui/pages/jyqyinfo/ejgtyzfobjfoodoptacmpy/tyzfobjfoodoptacmpyadd?date=' +
                        acmpy_date
                );
            })
            //删除
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
                            // item.target.parentNode.remove();
                            // console.log(rowguid);
                            deleteData(rowguid);
                        }
                    },
                    error: function (err) {}
                });
            })
            //修改
            .on('tap', '.em-rename', function () {
                var rowguid = $(this).parent().attr('rowguid');
                ejs.page.open(
                    Config.serverUrl.replace(/rest\//, '') +
                        'frame/fmui/pages/jyqyinfo/ejgtyzfobjfoodoptacmpy/tyzfobjfoodoptacmpyedit?guid=' +
                        rowguid
                );
            })
            //详情
            .on('tap', '.em-time,.em-main', function () {
                var rowguid = $(this).parent().attr('rowguid');

                ejs.page.open(
                    Config.serverUrl.replace(/rest\//, '') +
                        'frame/fmui/pages/jyqyinfo/ejgtyzfobjfoodoptacmpy/tyzfobjfoodacmpydetail?guid=' +
                        rowguid
                );
            });
    }

    /*
     * @description 删除校长陪餐信息
     */
    function deleteData(rowguid) {
        Util.ajax({
            url: Config.serverUrl + 'foodopt/getfoodoptacmpydelete',
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
                    getListData();
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
     * @description 获取数据
     */
    function getListData() {
        Util.ajax({
            url: Config.serverUrl + 'foodopt/getfoodoptacmpyinfo',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    pripid: pripid,
                    acmpy_date: acmpy_date
                }
            }),
            headers: { 'Content-Type': 'application/json' },
            success: function (result) {
                if (result.custom.code == 1) {
                    var tmpInfo = result.custom.foodoptacmpylist,
                        template = document.getElementById('template').innerHTML,
                        html = '';
                    $.each(tmpInfo, function (index, item) {
                        html += Mustache.render(template, item);
                    });
                    document.getElementById('listdata').innerHTML = html;
                    var length = $('.em-list li').length;
                    length > 0 ? $('.em-tips').hide() : $('.em-tips').show();
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
