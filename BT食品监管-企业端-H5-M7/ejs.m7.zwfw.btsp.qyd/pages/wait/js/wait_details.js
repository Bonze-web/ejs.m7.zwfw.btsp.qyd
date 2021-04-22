/*
 * @作者: 杨宗标
 * @创建时间: 2021-04-07 16:44:01
 * @修改时间: 2021-04-21 15:01:55
 * @版本: [1.0]
 * @版权: 国泰新点软件股份有限公司
 * @描述:
 */


(function(){

    "use strict";

    var calendar;
    var self = {};
    Util.loadJs(
        'pages/common/common.js',
        'js/widgets/calendar/calendar.js',
        'js/widgets/calendar/calendar.css',
        function () {
            common.commGetUserInfo(function (res) {
                self.myLoginid = res.loginid;
                initListeners();
                initPage();
            })

        });

    function initPage() {
        // var data3 = {
        //     list: [

        //     ]
        // }
        // var temple1 = Zepto('#template1').html();
        // var output = Mustache.render(temple1, data3);
        // Zepto('#exceed_list_box').html(output);
        var warningguid = Util.getExtraDataByKey('warningguid') || '';
        mui('.page_bg').on('tap', '.em-save', function(){
            // ejs.page.open(Config.serverUrl.replace(/rest\//,'/') + Zepto(this).attr("deal_link"),{});
            ejs.page.open("./wait_tickling.html",{warningguid: warningguid});
         })
    }

    function transferDate(date) {
        // 年
        var year = date.getFullYear();
        // 月
        var month = date.getMonth() + 1;
        // 日
        var day = date.getDate();

        if(month >= 1 && month <= 9) {

            month = "0" + month;
        }
        if(day >= 0 && day <= 9) {

            day = "0" + day;
        }
        // day += 1;

        var dateString = year + '-' + month + '-' + day;
        return dateString;

    };
    /**
     * @description 初始化监听
     */
    function initListeners() {
        var warningguid = Util.getExtraDataByKey('warningguid') || '';
        var data = {
            token: 'Epoint_WebSerivce_**##0601',
            params: {
                rowguid: warningguid,
                loginid:  self.myLoginid
            }
        };
        Util.ajax({
            url: Config.serverUrl + 'tyzfxxfb/warning/getWaitHandleDetail',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(result) {
                var waithandle = result.custom.waithandle;
                if(Object.keys(waithandle).length <= 0) {
                    return false;
                }

                if(waithandle.warning_obj_type == 1) {
                    tableRequest(waithandle);
                } else {
                    var oDate = new Date(waithandle.warning_time);
                    if(waithandle.deal_time) {
                        var oDate1 = new Date(waithandle.deal_time);
                        waithandle.deal_time = transferDate(oDate1);
                    }

                    waithandle.warning_time = transferDate(oDate);

                    waithandle.healthCertList = [];
                    var temple1 = Zepto('#template1').html();
                    var output = Mustache.render(temple1, waithandle);
                    Zepto('.page_bg').html(output);
                }
            },
            error: function(error) {
                ejs.ui.toast(error);
            }
        });
    }

    // 表格请求
    function tableRequest(waithandle) {
        var data = {
            token: 'Epoint_WebSerivce_**##0601',
            params: {
                warnguid: waithandle.rowguid,
                currentpage: 0,
                pagesize: 999
            }
        };
        Util.ajax({
            url: Config.serverUrl + 'opinion/getHeathCertWarningList',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(result) {
                var oDate = new Date(waithandle.warning_time);
                if(waithandle.deal_time) {
                    var oDate1 = new Date(waithandle.deal_time);
                    waithandle.deal_time = transferDate(oDate1);
                }

                waithandle.warning_time = transferDate(oDate);

                waithandle.healthCertList = result.custom.healthCertList;
                var temple1 = Zepto('#template1').html();
                var output = Mustache.render(temple1, waithandle);
                Zepto('.page_bg').html(output);
            },
            error: function(error) {
                ejs.ui.toast(error);
            }
        });
    }
})(window)