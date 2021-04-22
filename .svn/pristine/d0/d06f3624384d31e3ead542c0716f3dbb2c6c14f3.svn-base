/**
 * 作者：丁力
 * 创建时间：2019-9-7 20:58:354
 * 版本：[1.0, 2019-9-7]
 * 版权：江苏国泰新点软件有限公司
 * 描述：签到历史
 **/

'use strict';
Util.loadJs([
    'pages/common/common.js',
], function() {
    customBiz.configReady();
});

var customBiz = {

    // 初始化校验，必须调用
    // 注，如果没有组件API需要注册，可以传空，注册组件时，必须容器支持对应组件才能注册成功
    configReady: function() {
        var self = this;

        // 默认Android（属于个性化内容，标准版里改功能不对外开放，jsApiList传null即可）
        var customAPIName = Util.os.android ? 'com.epoint.app.api.MyEJSApi' : 'TX_EJSApi';
        var jsApiList = [{
            'schedule': customAPIName // 或者iOS下为 EJSPayApi
        }];

        Config.configReady(null, function() {
            self.initListeners();
        }, function(error) {

        });
    },
    initListeners: function() {
        var self = this;

        // 默认显示今天
        self.defaultDate = DateUtil.getDate('', 'yyyy-mm-dd');
        Zepto('.em-time').text(self.defaultDate.substring(5, 10));
        Zepto('.em-weekcon').text(DateUtil.getWeek(self.defaultDate));
        Zepto('.em-detecon').text(DateUtil.getDate(self.defaultDate, '年月日').substring(0, 8));
        // 滚动
        mui('.mui-scroll-wrapper').scroll();
        // 初始化日历
        self.initCalendar();

    },
    /**
	 * 初始化日历
	 */
    initCalendar: function() {
        var self = this;
		ejs.ui.showWaiting();
        // 初始化日历
        self.calendar = new Calendar({
            // swiper滑动容器
            container: '#calendar',
            // 日期模板
            dayTempl: function(value, curr) {
                var _self = this;
                var template = '';

                // 上一月和下一月不可点击模板
                if (curr == self.defaultDate) {
	                if (value.date == curr) {
	                    // 今天
	                    if (value.isSelected) {
	                        var template = '<div class="em-calendar-item em-calendar-active  isforbid{{isforbid}}" date="{{date}}"><span class="day">{{day}}</span><p class="lunar">今天</p><span class="dot dot-type1"></span></div>';
	                    } else {
	                        var template = '<div class="em-calendar-item em-calendar-active  isforbid{{isforbid}}" date="{{date}}"><span class="day">{{day}}</span><p class="lunar">今天</p></div>';
	                    }
	                } else {
	                    if (value.isSelected) {
	                        // 个性化和业务贴近
	                        var template = '<div class="em-calendar-item  isforbid{{isforbid}} tip{{tip}}" date="{{date}}"><span class="day">{{day}}</span><p class="lunar">{{lunar}}</p><span class="dot dot-type1"></span></div>';
	                    } else {
	                        var template = '<div class="em-calendar-item  isforbid{{isforbid}} tip{{tip}}" date="{{date}}"><span class="day">{{day}}</span><p class="lunar">{{lunar}}</p></div>';
	                    }
	                }
                } else if (curr !== self.defaultDate) {
                	if (value.date == self.defaultDate) {
	                    // 今天
	                    if (value.isSelected) {
	                        var template = '<div class="em-calendar-item em-calendar-active  isforbid{{isforbid}}" date="{{date}}"><span class="day">{{day}}</span><p class="lunar">{{lunar}}</p><span class="dot dot-type1"></span></div>';
	                    } else {
	                        var template = '<div class="em-calendar-item em-calendar-active  isforbid{{isforbid}}" date="{{date}}"><span class="day">{{day}}</span><p class="lunar">{{lunar}}</p></div>';
	                    }
	                } else if (value.date == curr) {
	                	// 今天
	                    if (value.isSelected) {
	                        var template = '<div class="em-calendar-item isforbid{{isforbid}}" date="{{date}}"><span class="day">{{day}}</span><p class="lunar">今天</p><span class="dot dot-type1"></span></div>';
	                    } else {
	                        var template = '<div class="em-calendar-item isforbid{{isforbid}}" date="{{date}}"><span class="day">{{day}}</span><p class="lunar">今天</p></div>';
	                    }
	                } else {
	                    if (value.isSelected) {
	                        // 个性化和业务贴近
	                        var template = '<div class="em-calendar-item  isforbid{{isforbid}} tip{{tip}}" date="{{date}}"><span class="day">{{day}}</span><p class="lunar">{{lunar}}</p><span class="dot dot-type1"></span></div>';
	                    } else {
	                        var template = '<div class="em-calendar-item  isforbid{{isforbid}} tip{{tip}}" date="{{date}}"><span class="day">{{day}}</span><p class="lunar">{{lunar}}</p></div>';
	                    }
	                }
                }

                return template;

            },
            // 上一月节点
            pre: '.pre',
            // 下一月节点
            next: '.next',

            // 回到今天
            backToToday: '.em-tab-item-today',
            // 回到今天回调
            backToTodayCallback: function(dateObj) {},
            // 业务数据改变
            dataRequest: function(currdate, callback, _this) {
                var year = currdate.substring(0, 4);
                var month = currdate.substring(5, 7);
                var lastDate = year + '-' + (Math.abs(month) - 1) * 1 + '-';
                var nextDate = year + '-' + (Math.abs(month) + 1) * 1 + '-';

                self.nowMonth = Math.abs(month) < 10 ? '0' + Math.abs(month) : Math.abs(month);
                var data = {
                    // 开始日期时间
                    'fromdatetime': lastDate + '01 00:00:00',
                    // 结束日期时间
                    'todatetime': nextDate + '31 23:59:59',
                };
                // ejs.ui.showDebugDialog(JSON.stringify(data));
                // console.log(JSON.stringify(data));
                common.ajax({
                    url: Config.serverUrl + 'checkInfo/getCheckInfo',
                    data: data,
                    isShowWaiting: false
                }, function(result) {
                    if (result.status.code == '1') {
                        var tmpInfo = result.custom.signinfolist;
                        // 日历
                        var tmpCalendarData = [];

                        if (tmpInfo && Array.isArray(tmpInfo) && tmpInfo.length > 0) {
                            // 有日程安排
                            mui.each(tmpInfo, function(key, value) {
                                tmpCalendarData.push({
                                	"date": value.signtime.substring(0, 10)
                                })
                            });
                            // 去除数组重复项
                            var resData = _this.uniqueArray(tmpCalendarData, 'date');
                            callback && callback(resData);
                        } else {
                            // 无签到
                            callback && callback([]);
                        }
                    } else {
                        ejs.ui.toast(result.status.text);
                        // 无签到
                        callback && callback([]);
                    }
	                Zepto('.mui-content').removeClass('mui-hidden');
					ejs.ui.closeWaiting();
                }, function(error) {
                    // console.log(error);
                    callback && callback([]);
                    ejs.ui.toast(Config.TIPS_II + '错误原因：' + JSON.stringify(error));
                }, {
                    isDebug: false
                });

            },
            // 是否支持滑动
            isSwipeH: false,
            // 滑动回调
            swipeCallback: function(dateObj) {
                self.defaultDate = dateObj.date;
		        Zepto('.em-time').text(self.defaultDate.substring(5, 10));
		        Zepto('.em-weekcon').text(DateUtil.getWeek(self.defaultDate));
            	Zepto('.em-detecon').text(DateUtil.getDate(self.defaultDate, '年月日').substring(0, 8));
                // 修改滑动回当前月，日期选择为当前日 wsz 2018-08-06 15:00:51
                Zepto('.em-calendar-active').removeClass('em-calendar-active');
                Zepto('.swiper-slide-active [date="' + dateObj.date + '"]').addClass('em-calendar-active');
                self.getSignInfo();
            },
            // 点击日期事件
            itemClick: function(item) {
                self.defaultDate = item.date;
		        Zepto('.em-time').text(self.defaultDate.substring(5, 10));
		        Zepto('.em-weekcon').text(DateUtil.getWeek(self.defaultDate));
		        // 刷新我的日程
			    self.getSignInfo();
            },

            // 调试
            isDebug: false
        });

    },

    /**
	 * 获取当天考勤列表
	 */
    getSignInfo: function() {
        var self = this;
        var data = {
            // 开始日期时间
            'fromdatetime': self.defaultDate + ' ' + '00:00:00',
            // 结束日期时间
            'todatetime': self.defaultDate + ' ' + '23:59:59',
        };

        // ejs.ui.showDebugDialog(JSON.stringify(data));
        common.ajax({
            url: Config.serverUrl + 'checkInfo/getCheckInfo',
            data: data,
            isShowWaiting: false
        }, function(result) {
            if (result.status.code == '1') {
                var tmpInfo = result.custom.signinfolist;
                var template = document.getElementById('template').innerHTML;
                var html = '';

                if (tmpInfo && Array.isArray(tmpInfo) && tmpInfo.length > 0) {
                    // 有日程安排
                    mui.each(tmpInfo, function(key, value) {
						value.signtime = value.signtime.substring(11, 16);
                        html += Mustache.render(template, value);
                    });

                    document.getElementById('listdata').innerHTML = html;
                    document.getElementsByClassName('em-line')[0].style.height = document.getElementById('listdata').scrollHeight - 20 + 'px';
				} else {
                    // 无日程安排
                    html += document.getElementById('temp-nodata').innerHTML;
                    document.getElementById('listdata').innerHTML = html;
                }
            } else {
                ejs.ui.toast(result.status.text);
            }

        }, function(error) {
            // console.log(error);
            ejs.ui.toast(Config.TIPS_II + '错误原因：' + JSON.stringify(error));
        }, {
            isDebug: false
        });

    },
};