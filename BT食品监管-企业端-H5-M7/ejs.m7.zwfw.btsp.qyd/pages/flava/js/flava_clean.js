/**
 * 作者： 张金锁
 * 创建时间： 2021/04/06 18:10:36
 * 版本： [1.0]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：清洗消毒
 */
(function (doc, Util) {
    'use strict';

    var miniRefreshObj;

    var pripid = '';
    var clean_date = Util.getExtraDataByKey('date') || '2021-02-19';

    Util.loadJs(
        ['pages/common/common.js', 'js/widgets/minirefresh/minirefresh.css', 'js/widgets/minirefresh/minirefresh.js'],
        ['js/widgets/minirefresh/minirefresh.bizlogic.js'],
        function () {
            initPage();
        }
    );

    /*
     * @description 获取pripid
     */
    function initPage() {
        common.commGetUserInfo(function (res) {
            console.log('🚀 ~ file: news_index.js ~ line 30 ~ res', res);
            pripid = res.loginid;
            initListeners();
            getData();
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
                        'frame/fmui/pages/jyqyinfo/ejgtyzfobjfoodoptclean/ejgtyzfobjfoodoptcleanadd?cleanDate=' +
                        clean_date
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
                            deleteData(rowguid);
                            // item.target.parentNode.remove();
                        }
                    },
                    error: function (err) {}
                });
            })
            //详情
            .on('tap', '.em-time,.em-main', function () {
                var rowguid = $(this).parent().attr('rowguid');
                ejs.page.open(
                    Config.serverUrl.replace(/rest\//, '') +
                        'frame/fmui/pages/jyqyinfo/ejgtyzfobjfoodoptclean/ejgtyzfobjfoodcleandetail?guid=' +
                        rowguid
                );
            })
            //修改
            .on('tap', '.em-rename', function () {
                var rowguid = $(this).parent().attr('rowguid');
                ejs.page.open(
                    Config.serverUrl.replace(/rest\//, '') +
                        'frame/fmui/pages/jyqyinfo/ejgtyzfobjfoodoptclean/ejgtyzfobjfoodoptcleanedit?guid=' +
                        rowguid
                );
            });
    }

    /*
     * @description 删除企业清洗消毒信息
     */
    function deleteData(rowguid) {
        Util.ajax({
            url: Config.serverUrl + 'foodopt/getfoodoptcleandelete',
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
                    miniRefreshObj.refresh();
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
     * @description 获取列表数据
     */
    function getData() {
        miniRefreshObj = new MiniRefreshBiz({
            container: '#minirefresh',
            isDebug: false,
            contentType: 'application/json;charest=UTF-8',
            timeout: null,
            url: Config.serverUrl + 'foodopt/getfoodoptcleaninfo',
            dataRequest: function (currPage) {
                var data = {
                    clean_date: clean_date,
                    pripid: pripid,
                    pagesize: '10',
                    currentpage: currPage * 10
                };
                var requestData = JSON.stringify({
                    token: 'Epoint_WebSerivce_**##0601',
                    params: data
                });
                return requestData;
            },
            template: function () {
                var template = document.getElementById('template').innerHTML;
                return template;
            },
            dataChange: function (result) {
                if (result.custom.code == '1') {
                    var tmpInfo = result.custom.foodoptcleanlist;
                } else {
                    ejs.ui.toast(result.custom.text);
                }
                return tmpInfo;
            },
            success: function (res, isPulldown) {
                if (isPulldown) {
                    if (res) {
                        if (res.length <= 0) {
                            $('.em-tips').removeClass('hidden');
                            $('.minirefresh-upwrap').hide();
                            $('.downwrap-content').hide();
                        } else {
                            $('.em-tips').addClass('hidden');
                            $('.minirefresh-upwrap').show();
                            $('.downwrap-content').show();
                        }
                    }
                }
            }
        });
    }
})(document, window.Util);
