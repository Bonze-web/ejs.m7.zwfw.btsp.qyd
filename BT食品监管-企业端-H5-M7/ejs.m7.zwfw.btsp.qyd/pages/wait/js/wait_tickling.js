/*
 * @作者: 杨宗标
 * @创建时间: 2021-04-08 08:49:27
 * @修改时间: 2021-04-21 19:22:22
 * @版本: [1.0]
 * @版权: 国泰新点软件股份有限公司
 * @描述:
 */

(function() {
    "use strict";

    Util.loadJs([
        'pages/common/common.js'
    ], function() {
        customBiz.configReady();
    });

    var customBiz = {
        configReady: function() {

            var self = this;
            common.commGetUserInfo(function (res) {
                self.myLoginid = res.loginid;
                self.userguid = res.userguid;
                console.log(res);
                // self.userguid = res.userguid
                var jsApiList = [{

                }];
                self.initListeners();
                self.eventAdd();
            })
        },
        initListeners: function() {
            var self = this;
            //  基本信息
            // var data1 = {
            //     imgArr: [
            //         {srcUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=153960715,2502274764&fm=26&gp=0.jpg'},
            //         {srcUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=153960715,2502274764&fm=26&gp=0.jpg'},
            //         {srcUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=153960715,2502274764&fm=26&gp=0.jpg'},
            //         {srcUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=153960715,2502274764&fm=26&gp=0.jpg'},
            //         {srcUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=153960715,2502274764&fm=26&gp=0.jpg'},
            //         {srcUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=153960715,2502274764&fm=26&gp=0.jpg'},

            //     ]
            // }
            // var temple1 = Zepto('#template1').html();
            // var output = Mustache.render(temple1, data1);
            // Zepto('#text_content').html(output);
            self.templateAdd("public");
        },
        templateAdd(userguid) {
            var self = this;
            var data = {
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    userguid: userguid
                }
            };
            Util.ajax({
                url: Config.serverUrl + 'opinion/getOpinionList',
                // url: "http://172.20.241.134:8090/audit-jgtyzf-business-web/rest/" + 'opinion/getOpinionList',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(result) {
                    if(result.custom.code == 1) {
                         var data1 = {
                            imgArr:result.custom.mouldList
                        }
                        var temple1 = Zepto('#template1').html();
                        var output = Mustache.render(temple1, data1);
                        Zepto('#text_content').html(output);
                    }
                },
                error: function(error) {
                        ejs.ui.toast(error);
                }
            });
            // var data1 = {
            //     imgArr: [
            //         {srcUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=153960715,2502274764&fm=26&gp=0.jpg'},
            //         {srcUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=153960715,2502274764&fm=26&gp=0.jpg'},
            //         {srcUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=153960715,2502274764&fm=26&gp=0.jpg'},
            //         {srcUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=153960715,2502274764&fm=26&gp=0.jpg'},
            //         {srcUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=153960715,2502274764&fm=26&gp=0.jpg'},
            //         {srcUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=153960715,2502274764&fm=26&gp=0.jpg'},

            //     ]
            // }
            // var temple1 = Zepto('#template1').html();
            // var output = Mustache.render(temple1, data1);
            // Zepto('#text_content').html(output);
        },
        eventAdd() {
            var self = this;
            mui(".page_bg").on("tap","#public", function(){

                Zepto(this).addClass("active").siblings("#personal").removeClass("active");
                self.templateAdd("public");
            })
            mui(".page_bg").on("tap","#personal", function(){
                Zepto(this).addClass("active").siblings("#public").removeClass("active");
                self.templateAdd();
            })
            mui(".page_bg").on("tap","#add_template", function(){
                var suggestion = Zepto("#suggestion").val();
                if(!suggestion) {
                    ejs.ui.toast("意见不能为空");
                    return false;
                }
                var data = {
                    token: 'Epoint_WebSerivce_**##0601',
                    params: {
                        mouldContent: suggestion
                    }
                };
                Util.ajax({
                    url: Config.serverUrl + 'opinion/addOpinion',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    success: function(result) {
                        if(result.custom.code == 1) {
                            ejs.ui.toast("添加成功");
                            if(Zepto("#personal").hasClass("active")) {
                                self.templateAdd();
                            }

                        }
                    },
                    error: function(error) {
                            ejs.ui.toast(error);
                    }
                });
            })
            mui(".page_bg").on("tap","#preserve", function(){
                var suggestion = Zepto("#suggestion").val();
                if(!suggestion) {
                    ejs.ui.toast("意见不能为空");
                    return false;
                }
                var warningguid = Util.getExtraDataByKey('warningguid') || '';
                var data = {
                    token: 'Epoint_WebSerivce_**##0601',
                    params: {
                        warningguid: warningguid,
                        feedback: suggestion,
                    }
                };
                Util.ajax({
                    url: Config.serverUrl + 'tyzfxxfb/warning/feedbackupdate',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    success: function(result) {
                    console.log();
                    if(result.custom.code == 1) {
                        ejs.page.close();
                    }
                        // 食品安全
                        // var data3 = {
                        //     // list: result.custom.aqglyList
                        //     list: [
                        //         {
                        //             sex: "女",
                        //             cert_num: "419249174172",
                        //             administrator: "杨"
                        //         }
                        //     ]
                        // }
                        // var temple1 = Zepto('#foodstuff').html();
                        // var output = Mustache.render(temple1, data3);
                        // Zepto('#food_security').html(output);
                    },
                    error: function(error) {
                            ejs.ui.toast(error);
                    }
                });
            });
            mui(".page_bg").on("tap","#wait_circle_box", function(){
                var wait_circle = Zepto(this).children(".wait_circle");
                var wait_content = Zepto(this).siblings("span").html();
                var suggestion_text = Zepto("#suggestion").val();
                if(wait_circle.hasClass("mui-hidden")) {
                    wait_circle.removeClass("mui-hidden");
                    wait_circle.siblings(".wait_add").addClass("mui-hidden");
                    var regExp = new RegExp(wait_content, 'gi');
                    Zepto("#suggestion").val(suggestion_text.replace(regExp,""));
                } else {
                    wait_circle.addClass("mui-hidden");
                    wait_circle.siblings(".wait_add").removeClass("mui-hidden");
                    suggestion_text = suggestion_text + wait_content;
                    Zepto("#suggestion").val(suggestion_text);
                }
            })
        }
    }


})(window)