/**
 * 作者： 张金锁
 * 创建时间： 2021/04/17 14:32:36
 * 版本： [1.0]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：选择任务
 */
(function (doc, Util) {
    'use strict';

    var miniRefreshObj;
    var keyWord = '';

    Util.loadJs(
        ['js/widgets/minirefresh/minirefresh.css', 'js/widgets/minirefresh/minirefresh.js'],
        ['js/widgets/minirefresh/minirefresh.bizlogic.js'],
        function () {
            initPage();
            initListeners();
            getData();
        }
    );

    function initPage() {
        ejs.navigator.setSearchBar({
            isShow: 1,
            isSearchable: 1,
            placeholder: '',
            keyword: '',
            cancelOnSearchBarAndNotRefresh: 0, //3.2.7.e 新增
            hideBottomLine: 0, //3.4.2.a 新增
            success: function (result) {
                keyWord = result.keyword;
                console.log(keyWord);
                miniRefreshObj.refresh();
            },
            error: function () {}
        });
    }

    /*
     * @description 点击事件
     */
    function initListeners() {
        $('body')
            //选择任务
            .on('tap', '.em-item', function () {
                var value = $(this).find('span').text();
                var dutyguid = $(this).attr('dutyguid');
                ejs.page.close({
                    // 也支持传递字符串
                    resultData: {
                        value: value,
                        dutyguid: dutyguid
                    },
                    success: function (result) {
                        /**
                         * 回调内请不要做UI显示相关的事情
                         * 因为可能刚回调页面就关闭了
                         */
                    },
                    error: function (error) {}
                });
            });
    }

    /*
     * @description 获取数据
     */
    function getData() {
        miniRefreshObj = new MiniRefreshBiz({
            container: '#minirefresh',
            isDebug: false,
            contentType: 'application/json;charest=UTF-8',
            timeout: null,
            // url: Config.serverUrl + 'foodopt/getfoodoptcleaninfo',
            url: 'http://117.191.67.11:8081/tyzf_cs/rest/sign/getTaskListByLep',
            dataRequest: function (currPage) {
                var data = {
                    status: '40;95',
                    searchkey: keyWord,
                    pagesize: '10',
                    currentpage: currPage
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
                    var tmpInfo = result.custom.dutyList;
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
