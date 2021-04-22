/*
 * @作者: 杨宗标
 * @创建时间: 2021-04-14 20:02:19
 * @修改时间: 2021-04-20 18:23:25
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
                    pripid: self.myLoginid
                }
            };
            Util.ajax({
                url: Config.serverUrl + 'btjgxx/getRiskInfo',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(result) {
                    //evalTime: "2021-04-14"
                    // riskLevel: "4"
                    // scoreAdjust: "不调整"
                    var riskList = [];
                    if(result.custom.code == 1) {
                        if(result.custom.riskList.length<10){
                            riskList = result.custom.riskList.slice(0,-1);
                        } else if(result.custom.riskList.length>=10){
                            riskList = result.custom.riskList.slice(0,10);
                        }

                        riskList.forEach((ele,idx)=>{
                            riskList[idx].year = ele.evalTime.slice(0,4);
                            riskList[idx].month = ele.evalTime.slice(5);
                            switch (ele.riskLevel) {
                                case "1":
                                    riskList[idx].myRiskLevel = "A";
                                    break;
                                case "2":
                                    riskList[idx].myRiskLevel = "B";
                                    break;
                                case "3":
                                    riskList[idx].myRiskLevel = "C";
                                    break;
                                case "4":
                                    riskList[idx].myRiskLevel = "D";
                                    break;

                                default:
                                    break;
                            }
                            // 对调整的字样做处理
                            if(ele.scoreAdjust.indexOf("不")!=-1) {
                                riskList[idx].myScoreAdjust = "1"
                            } else if(ele.scoreAdjust.indexOf("上")!=-1) {
                                riskList[idx].myScoreAdjust = "2"
                            } else if(ele.scoreAdjust.indexOf("下")!=-1) {
                                riskList[idx].myScoreAdjust = "3"
                            }

                            switch (ele.scoreAdjust) {
                                case "1":
                                    riskList[idx].myRiskLevel = "A";
                                    break;
                                case "2":
                                    riskList[idx].myRiskLevel = "B";
                                    break;
                                case "3":
                                    riskList[idx].myRiskLevel = "C";
                                    break;
                                case "4":
                                    riskList[idx].myRiskLevel = "D";
                                    break;

                                default:
                                    break;
                            }
                        })

                    }
                    var data3 = {
                        list: riskList
                    }
                    var temple1 = Zepto('#template1').html();
                    var output = Mustache.render(temple1, data3);
                    Zepto('#grade_list_box').html(output);
                    var riskListOne = riskList[0];
                    if(riskListOne.riskLevel == "1") {
                        Zepto("#riskgrade_icon").attr("src","./image/riskgrade_icon_a.png")
                    } else if(riskListOne.riskLevel == "2"){
                        Zepto("#riskgrade_icon").attr("src","./image/riskgrade_icon_b.png")
                    } else if(riskListOne.riskLevel == "3"){
                        Zepto("#riskgrade_icon").attr("src","./image/riskgrade_icon_c.png")
                    } else if(riskListOne.riskLevel == "4"){
                        Zepto("#riskgrade_icon").attr("src","./image/riskgrade_icon_d.png")
                    }

                    if(riskListOne.myScoreAdjust == "1") {
                        Zepto("#riskgrade_icon_upwhite").addClass("mui-hidden");
                        Zepto("#riskgrade_icon_downwhite").addClass("mui-hidden");
                        Zepto("#numerical").html("不调整");
                    } else if(riskListOne.myScoreAdjust == "2") {
                        // Zepto("#riskgrade_icon_upwhite").addClass("mui-hidden");
                        Zepto("#riskgrade_icon_downwhite").addClass("mui-hidden");
                        riskListOne.numScoreAdjust = riskListOne.scoreAdjust.replace(/[^0-9\.]/ig,"");
                        Zepto("#numerical").html(riskListOne.numScoreAdjust);
                    } else if(riskListOne.myScoreAdjust == "3") {
                        Zepto("#riskgrade_icon_upwhite").addClass("mui-hidden");
                        // Zepto("#riskgrade_icon_downwhite").addClass("mui-hidden");
                        riskListOne.numScoreAdjust = riskListOne.scoreAdjust.replace(/[^0-9\.]/ig,"");
                        Zepto("#numerical").html(riskListOne.numScoreAdjust);
                    }
                    console.log(riskListOne);
                    Zepto("#updata_time span").html(riskListOne.evalTime);

                    var myRiskList = riskList.slice(1);
                    console.log(myRiskList);
                    var temple1 = Zepto('#template2').html();
                    var output = Mustache.render(temple1, {myRiskList: myRiskList});
                    Zepto('#time_axis').html(output);
                },
                error: function(error) {
                        ejs.ui.toast(error);
                }

                // console.log(riskList);
                // var data3 = {
                //     list: riskList
                // }
                // var temple1 = Zepto('#template1').html();
                // var output = Mustache.render(temple1, data3);
                // Zepto('#grade_list_box').html(output);
                // },
                // error: function(error) {
                //         ejs.ui.toast(error);
                // }

            });
            // var data1 = {
            //     imgArr: [


            //     ]
            // }
            // var temple1 = Zepto('#template1').html();
            // var output = Mustache.render(temple1, data1);
            // Zepto('#text_content').html(output);
        },
        eventAdd() {
            mui(".risk_grade").on("tap","#explain", function(){
                Zepto("#illustrate").removeClass("mui-hidden");
            })
            mui(".illustrate").on("tap","#delete_box", function(){
                Zepto("#illustrate").addClass("mui-hidden");
            })
        }
    }


})(window)