/**
 * 作者： 孙尊路
 * 创建时间： 2017/06/16 13:27:09
 * 版本： [1.0, 2017/6/16]
 * 版权： 江苏国泰新点软件有限公司
 * 描述： 自定义日期工具集 
 */

"use strict";
/**
 * 日期相关
 */
(function(exports) {
	var DateUtil = {
		/**
		 * 获取对象
		 */
		DateObj: function(dateStr) {
			var dateObj;
			if(!dateStr) {
				//throw("请输入合法日期格式！"+str);
				dateObj = new Date();
			} else {
				// 注意：须先把时间戳(122891289)转成字符串然后进行查找
				var index = dateStr.toString().indexOf('-');
				if(index == "-1") {
					// 解析时间戳
					dateObj = new Date(dateStr);
				} else {
					// 解析正常格式时间戳，切记不要直接传  new Date 2017-09-09 19:00:00，
					dateObj = new Date(dateStr.replace(/-/g, '/'));
				}
			}
			return dateObj;
		},
		/**
		 * 获取日期
		 * format 返回格式 （yyyy-mm-dd）（年月日）
		 * 例如：输出 2017-09-09 （yyyy-mm-dd）   2017年08月09日（年月日）
		 */
		getDate: function(str, format) {
			var dateStr = '';

			// 初始化当前日期
			var yyyy = this.DateObj(str).getFullYear();
			var mm = this.DateObj(str).getMonth() + 1;
			var dd = this.DateObj(str).getDate();
			if("yyyy-mm-dd" == format) {
				dateStr += yyyy + "-" + this.tod(mm) + "-" + this.tod(dd);
			} else if("年月日" == format) {
				dateStr += yyyy + "年" + this.tod(mm) + "月" + this.tod(dd) + "日";
			}
			return dateStr;
		},
		/**
		 * 获取小时、分钟、秒    例如：18:09:00
		 * @param {Object} format  hh:mm  mm:ss  hh:mm:ss
		 * 例如：hh:mm 输出00:00  hh:mm:ss 输出00:00:00
		 */
		getTime: function(dateStr, format) {
			var timeStr = "";

			var hh = this.DateObj(dateStr).getHours();
			var mm = this.DateObj(dateStr).getMinutes();
			var ss = this.DateObj(dateStr).getSeconds();

			if("hh:mm" == format) {
				timeStr += this.tod(hh) + ":" + this.tod(mm);
			} else if("mm:ss" == format) {
				timeStr += this.tod(mm) + ":" + this.tod(ss);
			} else if("hh:mm:ss" == format) {
				timeStr += this.tod(hh) + ":" + this.tod(mm) + ":" + this.tod(ss);
			}
			return timeStr;
		},
		/**
		 * 获取当前下一个小时
		 */
		getNextHour: function(dateStr, format) {
			var tm = Date.parse(this.DateObj(dateStr)) + (1 * 3600 * 1000);
			var t = new Date(parseInt(tm));
			var y = t.getFullYear();
			var m = t.getMonth() + 1;
			var d = t.getDate();
			var hh = t.getHours();
			var mm = t.getMinutes();
			var ss = t.getSeconds();
			// 初始化当前日期
			var dateStr = y + "-" + this.tod(m) + "-" + this.tod(d) + " " + this.tod(hh) + ":" + this.tod(mm) + ":" + this.tod(ss);
			//console.log(dateStr);
			var pre = this.getDate(dateStr, format);
			var next = this.getTime(dateStr, "hh:mm");
			return pre + " " + next;
		},
		/**
		 * 获取日期对象
		 */
		getWeek: function(dateStr) {
			var week = this.DateObj(dateStr).getDay();
			var weekday = "";
			if(week == 0) {
				weekday = "星期日";
			} else if(week == 1) {
				weekday = "星期一";
			} else if(week == 2) {
				weekday = "星期二";
			} else if(week == 3) {
				weekday = "星期三";
			} else if(week == 4) {
				weekday = "星期四";
			} else if(week == 5) {
				weekday = "星期五";
			} else if(week == 6) {
				weekday = "星期六";
			}
			return weekday;
		},
		/**
		 * 日期转换成时间戳
		 */
		toTimeStap: function(param) {
			var ts = new Date(parseInt(param)); //不推荐使用
			//var ts = (new Date(parseInt(param))).valueOf(); //结果：1280977330748       //推荐; 
			//var ts = new Date(parseInt(param)); //结果：1280977330748        //推荐; 
			return ts;
		},
		/**
		 * 两个日期时间比较大小
		 */
		compareDate: function(startDate, endDate) {
			var startTimeStamp = this.DateObj(startDate).getTime();
			//alert("开始时间戳"+startTimeStamp);
			var endTimeStamp = this.DateObj(endDate).getTime();
			//alert("结束时间戳"+endTimeStamp);
			//alert("比较结果："+(endTimeStamp >= startTimeStamp));
			return endTimeStamp >= startTimeStamp;
		},
		/**
		 * 将1,2,3,4,5格式化01,02,03,04,05
		 * @param {Object} m 月份 d日 转换
		 */
		tod: function(str) {
			if(parseInt(str) > 9) {
				str = "" + parseInt(str);
			} else {
				str = "0" + parseInt(str);
			}
			return str;
		},
		/**
		 * @description 获取区间内所有的日期
		 * @param {Object} date1
		 * @param {Object} date2
		 */
		getDateList: function(option) {
			var self = this;
			// 时间差的毫秒数
			var date3 = (self.DateObj(option.date2)).getTime() - (self.DateObj(option.date1)).getTime()
			// 声明日时间戳
			var eachTimeStap = (24 * 3600 * 1000);
			// 计算出相差天数
			var days = Math.floor(date3 / eachTimeStap) + 1;
			// 两者之间最大的日期时间戳,相减换算成日期，比如：（3828983-2017-09-01）
			var maxtmp = (self.DateObj(option.date2)).getTime();
			// 临时数组
			var data = [];
			for(var i = 0; i < days; i++) {
				// 第一项无须减计算
				if(i == 0) {
					maxtmp -= 0;
				} else {
					// 其他须减计算
					maxtmp -= eachTimeStap;
				}
				// 放入数组里
				data.push({
					date: self.getDate(maxtmp, "yyyy-mm-dd")
				});
			}
			// 返回
			//console.log("打印："+JSON.stringify(data));
			return data;
		},

	};

	exports.DateUtil = DateUtil;

})(this);