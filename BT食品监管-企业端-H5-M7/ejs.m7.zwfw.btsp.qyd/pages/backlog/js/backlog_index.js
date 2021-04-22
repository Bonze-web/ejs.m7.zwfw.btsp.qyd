/*
 * @作者: 杨宗标
 * @创建时间: 2021-04-13 18:21:40
 * @修改时间: 2021-04-20 20:28:16
 * @版本: [1.0]
 * @版权: 国泰新点软件股份有限公司
 * @描述:
 */

(function() {
    "use strict";

    Util.loadJs([
        'pages/common/common.js',
    ],
    function() {

        customBiz.configReady();
    });

    var customBiz = {
        configReady: function() {
            var self = this;
            common.commGetUserInfo(function (res) {
                self.myLoginid = res.loginid;
                self.currPage = 0;
                var jsApiList = [{

                }];
                self.initListeners();
                self.eventAdd();
            })

        },
        initListeners: function() {
            var self = this;
             var data = {
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    currentpage: 0,
                    pagesize: 2,
                    loginid: self.myLoginid
                }
            };
            Util.ajax({
                url: Config.serverUrl + 'tyzfxxfb/warning/getWaitHandleList',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(result) {
                    var waithandlelist = result.custom.waithandlelist;
                    if(waithandlelist instanceof Array && waithandlelist.length>0) {
                        waithandlelist.forEach((ele,idx)=>{
                            if(ele.is_deal == 1) {
                                waithandlelist[idx].is_deal = true;
                            } else if(ele.is_deal == 0) {
                                waithandlelist[idx].is_deal = false;
                            }

                        })
                        var data3 = {
                            list: result.custom.waithandlelist
                            // list: [
                            //     {
                            //         sex: "女",
                            //         cert_num: "419249174172",
                            //         administrator: "杨"
                            //     }
                            // ]
                        }
                        var temple1 = Zepto('#template1').html();
                        var output = Mustache.render(temple1, data3);
                        Zepto('#backlog_list').html(output);
                        Zepto('#back_quantum_num').html(result.custom.total);
                    }
                },
                error: function(error) {
                    ejs.ui.toast(error);
                }
            });
        },
        eventAdd() {
            var self = this;
            mui('.backlog').on("tap","#backlog_head",function(){
                ejs.page.open("./../wait/wait_index.html",{});
            })
             // 列表详情
            mui('.backlog').on('tap', ".backlog_list_item", function(){
                ejs.page.open("./../wait/wait_details.html",{warningguid: Zepto(this).attr("warningguid")});
            })
        }
    }


})(window)

