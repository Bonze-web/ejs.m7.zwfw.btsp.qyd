/*
作者：libo
创建时间: 2020-12-20
版本: [1.0, 2020-12-20]
版权: 江苏国泰新点软件有限公司
描述: 考勤模块
*/

(function (doc) {

    "use strict";

    var calendar;

    Util.loadJs(
        'js/widgets/calendar/calendar.js',
        'js/widgets/calendar/calendar.css',
        function () {

            initListeners();
            initPage();

        });

    function initPage() {
        getNowDate();

        calendar = new Calendar({
            // 日历容器
            container: "#calendar",
            // item点击事件
            itemClick: function (item) {
                console.log(item.date + " 农历：" + item.lunar);

            },
            swipeCallback: function (item) {
                console.log(item)

                var year = item.year,
                    month = item.month;

                getBaseInfo(year,month);
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
    }

    function getNowDate(){
        var date = new Date();

        var year = date.getFullYear(),
            month = date.getMonth() + 1;

        if(month > 0 && month < 10){
            month = '0' + month
        }

        
        getBaseInfo(year,month);
    }

    function getBaseInfo(year,month){
        Util.ajax({
            url: Config.serverUrl + 'btjgxx/getWorkdayByMonth',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    pripid: '123456789987654321',
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
                    var setArray = [];

                    result.custom.workdayList.forEach(item => {
                        if(item.isupdate == '1'){
                            setArray.push(item.wdate)
                        }
                    })

                    calendar.setInfo(setArray);
                }

            }
        });
    }


}(document));