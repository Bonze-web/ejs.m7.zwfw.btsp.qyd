/*
 * @作者: 杨宗标
 * @创建时间: 2021-04-14 10:15:58
 * @修改时间: 2021-04-22 18:54:24
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
                    date: self.transferDate(new Date()),
                    pripid: self.myLoginid
                }
            };
            Util.ajax({
                url: Config.serverUrl + 'foodopt/getDailyRecord',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(result) {
                    var custom =  result.custom;
                    for(let k in custom) {
                        if(custom[k] == "false") {
                            custom[k] = false;
                        } else if (custom[k] == "true") {
                            custom[k] = true;
                        }
                    }
                    // result.custom.examineSign = true;
                    if(result.custom.examineSign) {
                        self.examineguid = result.custom.examineguid
                        self.examineSign = 1;
                    }
                    if(result.custom.garbageSign) {
                        self.garbageguid = result.custom.garbageguid
                        self.garbageSign = 1;
                    }

                    var template1 = Zepto('#template1').html();
                    var output = Mustache.render(template1, result.custom);
                    Zepto('#service_box').html(output);
                },
                error: function(error) {
                    ejs.ui.toast(error);
                }
            });
        },
        eventAdd() {
            var self = this;
            var oDate = new Date();
            var dayDate = self.transferDate(oDate);
            Zepto("#present_content").html(dayDate);
            mui('.mui-content').on("tap","#present_title_box",function(){
                // ejs.page.open("./record_workday.html",{});
                ejs.page.open({
                    pageUrl: './record_workday.html',
                    pageStyle: 1,
                    orientation: 1,
                    data: {},
                    success: function(result) {
                       self.initListeners();
                    },
                    error: function(error) {}
                });
            })

            // 菜单
            mui('.mui-content').on("tap","#vegetable",function(){
                ejs.page.open({
                    pageUrl: './../flava/flava_menu.html',
                    pageStyle: 1,
                    orientation: 1,
                    data: {
                        pripid : self.myLoginid,
                        date: dayDate
                    },
                    success: function(result) {
                       self.initListeners();
                    },
                    error: function(error) {}
                });
                // ejs.page.open('./../flava/flava_menu.html', {pripid : self.myLoginid ,date: dayDate});
            })
            // 消毒
            mui('.mui-content').on("tap","#disinfect",function(){
                ejs.page.open({
                    pageUrl: './../flava/flava_clean.html',
                    pageStyle: 1,
                    orientation: 1,
                    data: {
                        pripid : self.myLoginid,
                        date: dayDate
                    },
                    success: function(result) {
                       self.initListeners();
                    },
                    error: function(error) {}
                });
                // ejs.page.open('./../flava/flava_clean.html',{pripid : self.myLoginid ,date: dayDate});
            })
            // 食品留样
            mui('.mui-content').on("tap","#provisions",function(){
                ejs.page.open({
                    pageUrl:'./../samples/samples_index.html',
                    pageStyle: 1,
                    orientation: 1,
                    data: {
                        pripid : self.myLoginid,
                        date: dayDate
                    },
                    success: function(result) {
                       self.initListeners();
                    },
                    error: function(error) {}
                });
                // ejs.page.open('./../samples/samples_index.html',{pripid : self.myLoginid ,date: dayDate});
            })
            // 校长陪餐
            mui('.mui-content').on("tap","#dinnerwith",function(){
                ejs.page.open({
                    pageUrl: "./../flava/flava_dinnerwith.html",
                    pageStyle: 1,
                    orientation: 1,
                    data: {
                        pripid : self.myLoginid,
                        date: dayDate
                    },
                    success: function(result) {
                       self.initListeners();
                    },
                    error: function(error) {}
                });
                // ejs.page.open('./../flava/flava_dinnerwith.html',{pripid : self.myLoginid ,date: dayDate});
            })
            // 晨检
            mui('.mui-content').on("tap","#matinal",function(){
                if(self.examineSign === 1) {
                    ejs.page.open({
                        pageUrl: Config.serverUrl.replace(/rest\//,'/') + 'frame/fmui/pages/jyqyinfo/ejgtyzfobjfoodoptexamine/ejgtyzfobjfoodoptexamineedit?',
                        pageStyle: 1,
                        orientation: 1,
                        data: {
                            guid: self.examineguid
                        },
                        success: function(result) {
                            console.log("城建");
                           self.initListeners();
                        },
                        error: function(error) {}
                    });
                    // ejs.page.open(Config.serverUrl.replace(/rest\//,'/') + 'frame/fmui/pages/jyqyinfo/ejgtyzfobjfoodoptexamine/ejgtyzfobjfoodoptexamineedit?',{guid: self.examineguid});
                } else {
                    ejs.page.open({
                        pageUrl: Config.serverUrl.replace(/rest\//,'/') + 'frame/fmui/pages/jyqyinfo/ejgtyzfobjfoodoptexamine/ejgtyzfobjfoodoptexamineadd',
                        pageStyle: 1,
                        orientation: 1,
                        data: {
                            guid: self.examineguid
                        },
                        success: function(result) {
                           self.initListeners();
                        },
                        error: function(error) {}
                    });
                    // ejs.page.open(Config.serverUrl.replace(/rest\//,'/') + 'frame/fmui/pages/jyqyinfo/ejgtyzfobjfoodoptexamine/ejgtyzfobjfoodoptexamineadd',{});
                }

            })
            // 餐厨垃圾
            mui('.mui-content').on("tap","#garbage",function(){
                if(self.garbageSign === 1) {
                     // ejs.page.open(Config.serverUrl.replace(/rest\//,'/') + 'frame/fmui/pages/jyqyinfo/ejgtyzfobjfoodoptljcl/ejgtyzfobjfoodoptljcledit?guid=',{guid: self.garbageguid});
                    ejs.page.open({
                        pageUrl: Config.serverUrl.replace(/rest\//,'/') + 'frame/fmui/pages/jyqyinfo/ejgtyzfobjfoodoptljcl/ejgtyzfobjfoodoptljcladd',
                        pageStyle: 1,
                        orientation: 1,
                        data: {
                            guid: self.garbageguid
                        },
                        success: function(result) {
                            self.initListeners();
                        },
                        error: function(error) {}
                    });
                } else {
                    ejs.page.open({
                        pageUrl: Config.serverUrl.replace(/rest\//,'/') + 'frame/fmui/pages/jyqyinfo/ejgtyzfobjfoodoptljcl/ejgtyzfobjfoodoptljcladd',
                        pageStyle: 1,
                        orientation: 1,
                        data: {
                            guid: self.garbageguid
                        },
                        success: function(result) {
                            self.initListeners();
                        },
                        error: function(error) {}
                    });

                    // ejs.page.open(Config.serverUrl.replace(/rest\//,'/') + 'frame/fmui/pages/jyqyinfo/ejgtyzfobjfoodoptljcl/ejgtyzfobjfoodoptljcladd',{guid: self.garbageguid});
                }

            })
        },
        transferDate(date) {
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

            var dateString = year + '-' + month + '-' + day;
            return dateString;
        }
    }


})(window)