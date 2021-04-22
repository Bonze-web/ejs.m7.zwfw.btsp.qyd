/*
作者：libo
创建时间: 2020-12-20
版本: [1.0, 2020-12-20]
版权: 江苏国泰新点软件有限公司
描述: 考勤模块
*/

(function (doc) {

    "use strict";

    var calendar,
        loginId;

    var setArray = [];

    var chooseDate = '';

    Util.loadJs(
        'pages/common/common.js',
        'js/widgets/calendar/calendar.js',
        'js/widgets/calendar/calendar.css',
        function () {
            ejs.config({
                jsApiList: []
            });
            common.commGetUserInfo(function (res) {
                loginId = res.loginid;

                initListeners();
                initPage();
            })
            // ejs.ready(function () {
            //     ejs.auth.getUserInfo({
            //         success: function (result) {

            //             var handleUser = JSON.parse(result.userInfo);

            //             loginId = handleUser.loginId;

            //             initListeners();
            //             initPage();
            //         },
            //         error: function (error) {}
            //     });
            // });

        });

    function initPage() {
        getNowDate();

        calendar = new Calendar({
            // 日历容器
            container: "#calendar",
            // item点击事件
            itemClick: function (item) {
                console.log(item.date + " 农历：" + item.lunar);

                chooseDate = item.date;


                // 判断一下记录在不在维护日期里面，如果在的话，就需要调用日期接口获取详情
                if(setArray.includes(item.date)){

                    Zepto('#recordlist').removeClass('mui-hidden');
                    Zepto('#recordnodata').addClass('mui-hidden');
                    getDateInfo(item.date);
                }else{
                    Zepto('#recordnodata').removeClass('mui-hidden');
                    Zepto('#recordlist').addClass('mui-hidden');
                }
            },
            swipeCallback: function (item) {
                console.log(item)

                var year = item.year,
                    month = item.month,
                    day = item.day;

                getBaseInfo(year,month,day);
            }
        });
    }

    /**
     * @description 初始化监听
     */
    function initListeners() {
        ejs.navigator.setRightBtn({
            isShow: 1,
            text: '日历维护',
            // 设置图片的优先级会较高
            //imageUrl: 'http://app.epoint.com.cn/staticResource/testicon2.png',
            which: 0, // 每一个按钮的回调是独立返回
            success: function(result) {
                ejs.page.open("./record_calendarcheck.html", {});
            },
            error: function(error) {}
        });

        // 菜单
        mui('.mui-content').on("tap","#vegetable",function(){
            ejs.page.open('./../flava/flava_menu.html',{
                date: chooseDate
            });
        })
        // 消毒
        mui('.mui-content').on("tap","#wash",function(){
            ejs.page.open('./../flava/flava_clean.html',{
                date: chooseDate
            });
        })
        // 食品留样
        mui('.mui-content').on("tap","#provisions",function(){
            ejs.page.open('./../samples/samples_index.html',{
                date: chooseDate
            });
        })
        // 校长陪餐
        mui('.mui-content').on("tap","#dinnerwith",function(){
            ejs.page.open('./../flava/flava_dinnerwith.html',{
                date: chooseDate
            });
        })
        // 晨检
        mui('.mui-content').on("tap","#matinal",function(){
            ejs.page.open(Config.serverUrl.replace(/rest\//,'/') + 'frame/fmui/pages/jyqyinfo/ejgtyzfobjfoodoptexamine/ejgtyzfobjfoodoptexamineadd',{
                date: chooseDate
            });
        })
        // 餐厨垃圾
        mui('.mui-content').on("tap","#garbage",function(){
            ejs.page.open(Config.serverUrl.replace(/rest\//,'/') + 'frame/fmui/pages/jyqyinfo/ejgtyzfobjfoodoptljcl/ejgtyzfobjfoodoptljcladd',{
                date: chooseDate
            });
        })
    }

    function getNowDate(){
        var date = new Date();

        var year = date.getFullYear(),
            month = date.getMonth() + 1,
            strDate = date.getDate();

        if(month > 0 && month < 10){
            month = '0' + month
        }

        if(strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        
        chooseDate = year + '-' + month + '-' + strDate;

        getBaseInfo(year,month,strDate);
    }

    function getDateInfo(date){
        Util.ajax({
            url: Config.serverUrl + 'foodopt/getDailyRecordCondition',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    pripid: loginId,
                    day: date
                }
            }),
            contentType: 'application/json;charset=UTF-8',
            success: function(result) {
                console.log(result)

                if (result.status.code != 200) {
                    ejs.ui.toast('获取数据失败');
                    return;
                }

                if(result.custom.code != 1){
                    ejs.ui.toast(result.custom.text);
                }else{
                    var handleData = result.custom;

                    $('#dailyfood').text('早餐'+ handleData.breakfastCount +'样;午餐'+ handleData.lunchCount +'样;晚餐'+ handleData.dinnerCount +'样')
                    $('#washinfo').text(handleData.cleanList.name + ':' + handleData.cleanList.count);
                    $('#provisionsinfo').text('早餐'+ handleData.breakfastRemainCount +'样;午餐'+ handleData.lunchRemainCount +'样;晚餐'+ handleData.dinnerRemaincount +'样');
                    $('#dinnerwithinfo').text('早餐'+ handleData.breakfastAcmpyCount +'样;午餐'+ handleData.lunchAcmpyCount +'样;晚餐'+ handleData.dinnerAcmpycount +'样');
                    $('#matinalinfo').text('检查时间' + handleData.checkTime);
                    $('#garbageinfo').text(handleData.garbageCount);
                }

            }
        });
    }

    function getBaseInfo(year,month,day){
        Util.ajax({
            url: Config.serverUrl + 'btjgxx/getWorkdayByMonth',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    //pripid: '123456789987654321',
                    pripid: loginId,
                    month: month,
                    year: year
                }
            }),
            contentType: 'application/json;charset=UTF-8',
            success: function(result) {
                console.log(result)

                if (result.status.code != 200) {
                    ejs.ui.toast('获取数据失败');
                    return;
                }

                if(result.custom.code != 1){
                    ejs.ui.toast(result.custom.text);
                }else{
                    setArray = [];

                    result.custom.workdayList.forEach(item => {
                        if(item.isupdate == '1'){
                            setArray.push(item.wdate)
                        }
                    })
                    calendar.setInfo(setArray);

                    // 判断一下记录在不在维护日期里面，如果在的话，就需要调用日期接口获取详情
                    if(setArray.includes(year + '-' + month + '-' + day)){

                        Zepto('#recordlist').removeClass('mui-hidden');
                        Zepto('#recordnodata').addClass('mui-hidden');
                        getDateInfo(year + '-' + month + '-' + day);
                    }else{
                        Zepto('#recordnodata').removeClass('mui-hidden');
                        Zepto('#recordlist').addClass('mui-hidden');
                    }

                }

            }
        });
    }


}(document));