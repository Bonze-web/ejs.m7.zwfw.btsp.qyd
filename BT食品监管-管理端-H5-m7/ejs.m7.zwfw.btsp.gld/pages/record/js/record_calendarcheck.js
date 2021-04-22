/*
作者：libo
创建时间: 2021-04-14
版本: [1.0, 2021-04-14]
版权: 江苏国泰新点软件有限公司
描述: 日历维护
*/

(function (doc) {

    "use strict";

    var month = '',
        year = '';

    var chooseDate = [];

    var monthData = [{
        month: '1'
    }, {
        month: '2'
    }, {
        month: '3'
    }, {
        month: '4'
    }, {
        month: '5'
    }, {
        month: '6'
    }, {
        month: '7'
    }, {
        month: '8'
    }, {
        month: '9'
    }, {
        month: '10'
    }, {
        month: '11'
    }, {
        month: '12'
    }]

    Util.loadJs(
        'js/widgets/calendar/calendar.js',
        'js/widgets/calendar/calendar.css',
        function () {

            initListeners();
            initPage();

        });

    function initPage() {
        // 渲染12个月的数据
        var output = Mustache.render(document.getElementById('calen-litem').innerHTML, {
            datalist: monthData
        })
        $('#calendarcon').html(output);

        // 需要获取默认月份的数据
        getNowDate()
    }

    /**
     * @description 初始化监听
     */
    function initListeners() {
        // 月份显示和隐藏
        Zepto('body').on('tap', '.showorhidden', function () {
            var _this = $(this);

            if (_this.text() == '隐藏') {
                _this.parent().next().addClass('mui-hidden');
                _this.text('显示');
            } else {
                _this.text('隐藏');
                // 需要判断是否是第一次
                if (_this.parent().data('click') == 0) {
                    var index = _this.parent().data('month'),
                        month,
                        year = new Date().getFullYear();

                    if (index > 0 && index < 10) {
                        month = '0' + index
                    }
                    _this.parent().next().removeClass('mui-hidden');
                    getBaseInfo(year, month, index);
                } else {
                    _this.parent().next().removeClass('mui-hidden');
                }
            }
        })

        Zepto('body').on('change', '.monthcheck', function (e) {
            var checkType = e.currentTarget.checked,
                _this = Zepto(this).parent();

            if (checkType) {
                // 选中目前月份所有日期

                _this.parent().next().find('.daycheck').each((key, value) => {
                    Zepto(value).prop("checked", true);

                    // 需要先判断数组中有没有这一项
                    if (!checkExist(Zepto(value).data('date'))) {
                        chooseDate.push({
                            date: Zepto(value).data('date'),
                            iswork: Zepto(value).data('iswork')
                        })
                    }

                })

            } else {
                _this.parent().next().find('.daycheck').each((key, value) => {
                    Zepto(value).prop("checked", false);

                    //删除数组中的这一项
                    chooseDate.forEach((item, index) => {
                        if (item.date == Zepto(value).data('date')) {
                            chooseDate.splice(index, 1);
                        }
                    })
                })
            }

            console.log(chooseDate);
            Zepto('#haschoose').text(chooseDate.length + '个');
        })

        Zepto('body').on('change', '.daycheck', function (e) {
            var checkType = e.currentTarget.checked,
                choosed = Zepto(this).data('date'),
                isWork = Zepto(this).data('iswork');

            if (checkType) {
                chooseDate.push({
                    date: choosed,
                    iswork: isWork
                })
            } else {
                //删除数组中的这一项
                chooseDate.forEach((item, index) => {
                    if (item.date == choosed) {
                        chooseDate.splice(index, 1);
                    }
                })
            }

            console.log(chooseDate);
            Zepto('#haschoose').text(chooseDate.length + '个');
        })

        Zepto('body').on('tap', '#setwork', function () {
            // 需要判断选中的日期里有没有工作日，如果有工作日，不可操作
            if(!checkWorkDay().flag){
                setDay('1',checkWorkDay().array)
            }else{
                ejs.ui.toast('日期里含有工作日')
            }
        }).on('tap', '#setrest', function () {
            // 需要判断选中的日期里有没有工作日，如果有工作日，不可操作
            if(!checkRestDay().flag){
                setDay('0',checkRestDay().array)
            }else{
                ejs.ui.toast('日期里含有休息日')
            }
        })
    }

    function checkWorkDay(){
        var flag = false,
            arrayHandle = '';

        console.log(chooseDate)

        chooseDate.forEach(item => {
            if(item.iswork == 1){
                flag = true;
            }
            arrayHandle += item.date + ';'
        })

        return {
            flag: flag,
            array:arrayHandle
        };
    }

    function checkRestDay(){
        var flag = false,
            arrayHandle = '';

        chooseDate.forEach(item => {
            if(item.iswork == 0){
                flag = true;
            }

            arrayHandle += item.date + ';'
        })

        return {
            flag: flag,
            array:arrayHandle
        };
    }

    function checkExist(date){
        var flag = false;

        chooseDate.forEach(item => {
            if(item.date == date){
                flag = true
            } 
        })

        return flag;
    }

    function getNowDate() {
        var date = new Date();

        var year = date.getFullYear(),
            month = date.getMonth() + 1;

        if (month > 0 && month < 10) {
            month = '0' + month
        }


        getBaseInfo(year, month, date.getMonth() + 1);
    }

    function setDay(type,dayArray){
        Util.ajax({
            url: Config.serverUrl + 'btjgxx/updateWorkday',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    pripid: '123456789987654321',
                    days: dayArray,
                    operateType: type
                }
            }),
            contentType: 'application/json;charset=UTF-8',
            success: function (result) {
                console.log(result)


                if (result.status.code != 200) {
                    ejs.ui.toast('获取数据失败');
                    return;
                }

                if (result.custom.code != 1) {
                    ejs.ui.toast(result.custom.text);
                } else {
                    
                }
            }
        });
    }

    function getBaseInfo(year, month, index) {
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
            success: function (result) {
                console.log(result)


                if (result.status.code != 200) {
                    ejs.ui.toast('获取数据失败');
                    return;
                }

                if (result.custom.code != 1) {
                    ejs.ui.toast(result.custom.text);
                } else {
                    result.custom.workdayList.forEach(item => {
                        item.day = item.wdate.substring(8, 10)
                    })

                    console.log(result.custom.workdayList)
                    // 渲染指定数据
                    $('.calendar-month').forEach(function (key, childindex) {
                        if ((childindex + 1) == index) {
                            var output = Mustache.render(doc.getElementById('calenday-litem').innerHTML, {
                                daylist: result.custom.workdayList
                            });

                            console.log(key)

                            $(key).next().html(output);
                            $(key).data('click', '1');
                            $(key).find('.showorhidden').text('隐藏');
                        }
                    })
                }
            }
        });
    }


}(document));