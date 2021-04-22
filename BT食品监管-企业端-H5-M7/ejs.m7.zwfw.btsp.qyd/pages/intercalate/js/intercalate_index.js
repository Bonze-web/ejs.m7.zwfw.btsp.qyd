/*
 * @作者: 杨宗标
 * @创建时间: 2021-04-19 16:51:53
 * @修改时间: 2021-04-19 21:21:23
 * @版本: [1.0]
 * @版权: 国泰新点软件股份有限公司
 * @描述:
 */


(function(){
    "use strict";

    Util.loadJs([

    ],
    function() {
        customBiz.configReady();
    });
    var customBiz = {
        configReady() {
            mui(".page_bg").on("tap",".subtract_left",function(){
                var mynumber = Zepto("#mynumber").val();
                var myEle = Zepto(".subtract_left").attr("mysrc");

                if(mynumber<=0 && myEle == 1) {
                    Zepto(".subtract_left img").attr("src","./img/subtract_gray.png");
                    Zepto(".subtract_left").attr("mysrc",0);
                    return false;
                } else if(mynumber>0 && myEle == 0) {
                    Zepto(".subtract_left img").attr("src","./img/subtract_blue.png");
                    Zepto(".add_right").attr("mysrc",1);
                }

                mynumber = mynumber - 1;
                Zepto("#mynumber").val(mynumber);
            })
            mui(".page_bg").on("tap",".add_right",function(){
                var mynumber = parseInt(Zepto("#mynumber").val());
                var myEle = Zepto(".subtract_left").attr("mysrc");

                mynumber = mynumber + 1;
                Zepto("#mynumber").val(mynumber);
                if(mynumber>0 && myEle == 0) {
                    Zepto(".subtract_left img").attr("src","./img/subtract_blue.png");
                    Zepto(".add_right").attr("mysrc",1);
                }
            });

            mui(".page_bg").on("tap",".conserve",function(){
                var time = Zepto("input[name='time']:checked").val();
                var rowguid = Util.getExtraDataByKey('rowguid') || '';
                var data = {
                    token: 'Epoint_WebSerivce_**##0601',
                    params: {
                        rowguid: rowguid,
                        check_frequency: Zepto("#mynumber").val(),
                        frequency_unit: time
                    }
                };
                Util.ajax({
                    url: Config.serverUrl + 'foodopt/updateCheckFrequency',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    success: function(result) {
                        location.replace("./../business/business_index.html")
                    },
                    error: function(error) {
                        ejs.ui.toast(error);
                    }
                });
            })
        }
    }
})(window)