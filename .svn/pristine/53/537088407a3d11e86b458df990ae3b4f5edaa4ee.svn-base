/*
 * @作者: 杨宗标
 * @创建时间: 2021-04-17 18:52:13
 * @修改时间: 2021-04-20 17:41:35
 * @版本: [1.0]
 * @版权: 国泰新点软件股份有限公司
 * @描述:
 */


(function(){
    "use strict";

    Util.loadJs([
        'pages/common/common.js',
        // 下拉刷新
		'js/widgets/minirefresh/minirefresh.css',
		'js/widgets/minirefresh/minirefresh.js',
    ],
    'js/widgets/minirefresh/minirefresh.bizlogic.js',
    function() {
        customBiz.configReady();
    });
    var customBiz = {
        configReady() {
            var self = this;
            common.commGetUserInfo(function (res) {
                self.myLoginid = res.loginid;
                self.userguid = res.userguid;
                // console.log("🚀 ~ file: news_index.js ~ line 30 ~ res", res)


                var data = {
                    token: 'Epoint_WebSerivce_**##0601',
                    params: {
                        pripid:  self.myLoginid,
                    }
                };
                Util.ajax({
                    url: Config.serverUrl + 'foodopt/getfoodoptbasicinfo',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    success: function(result) {
                        var data = result.custom.foodoptbasicinfo;
                        if(Object.keys(data).length>0) {
                            location.replace(Config.serverUrl.replace(/rest\//,'/')  + "frame/fmui/pages/opt/tyzfobjfoodoptbasicdetail?guid="  + result.custom.foodoptbasicinfo.rowguid);
                        } else {
                            self.foodpdtAdd();
                        }
                    },
                    error: function(error) {
                        ejs.ui.toast(error);
                    }
                });
            })

        },
        foodpdtAdd() {
            var data = {
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    pripid: Config.pripid,
                }
            };
            Util.ajax({
                // url: Config.serverUrl + 'foodopt/getfoodoptbasicinfo',
                url: Config.serverUrl + 'foodpdt/getfoodpdtbasicinfo',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(result) {
                    var data = result.custom.foodpdtbasicinfo;
                    if(Object.keys(data).length>0) {
                        location.replace(Config.serverUrl.replace(/rest\//,'/')  + "frame/fmui/pages/opt/tyzfobjfoodoptbasicdetail?guid=" + result.custom.foodpdtbasicinfo.rowguid);
                    }
                },
                error: function(error) {
                    ejs.ui.toast(error);
                }
            });
        }
    }
})(window)