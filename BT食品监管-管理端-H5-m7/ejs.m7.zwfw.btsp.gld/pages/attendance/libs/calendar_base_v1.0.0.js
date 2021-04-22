/**
 * 作者: 孙尊路
 * 创建时间: 2017-07-14 13:26:47
 * 版本: [1.0, 2017/7/14]
 * 版权: 江苏国泰新点软件有限公司
 * 描述：日历组件
 * 实现方案：自定义日历组件+swiper插件的完美结合。
 */

(function() {
	"use strict";

	/**
	 * 全局生效默认设置
	 * 默认设置可以最大程度的减小调用时的代码
	 */
	var defaultOptions = {
		// swiper滑动容器
		swiper: ".swiper-container",
		// 默认日历组件容器
		container: ".em-calendar-container",
		// 默认日历内容容器
		containerWrapper: ".em-calendar-wrapper",
		// 默认显示农历
		isLunar: true,
		// 默认开启水平方向切换月份
		isSwipeH: true,
		// 默认开启垂直方向切换月份
		isSwipeV: true,
		// 滑动回调
		swipeCallback: noop,
		// 上一月节点
		pre: ".pre",
		// 上一月回调
		preCallback: noop,
		// 下一月节点
		next: ".next",
		// 下一月回调
		nextCallback: noop,
		// 点击回调
		itemClick: noop,
		// 业务数据，要求接口返回
		data: [],
		// 是否开启调试
		isDebug: false
	};

	function noop() {}

	/**
	 * 日历的构造函数
	 * @param {Object} options 配置参数，和init以及_initData的一致
	 * @constructor
	 */
	function Calendar(options) {

		options = mui.extend({}, defaultOptions, options);

		this.container = this._selector(options.container);
		this.containerWrapper = this._selector(options.containerWrapper);
		this.swiper = this._selector(options.swiper);

		this._initData(options);
	}

	Calendar.prototype = {
		/**
		 * 初始化数据单独提取，方便refresh使用
		 * @param {Object} options 配置参数
		 */
		_initData: function(options) {

			this.options = options;
			if(!this._validate()) {
				// 因为验证是强制性的，因此直接抛出错误
				throw new Error('验证错误，日历的传入格式非法，请检查代码');
			}
			this._initParams();
			this._addEvent();

		},
		_initParams: function() {
			var self = this;
			self.newDate = new Date();
			self.nowYear = self.newDate.getFullYear();
			self.nowMonth = self.newDate.getMonth() + 1;
			self.nowDay = self.newDate.getDate();

			// 初始化当前日期
			var dObj = new Date();
			var m = dObj.getMonth() + 1;
			var d = dObj.getDate();
			self.currentDate = dObj.getFullYear() + "-" + (self.tom(m)) + "-" + (self.tod(d))

			self.nowMonth = String(self.nowMonth);
			if(self.nowMonth.length == 1) {
				self.nowMonth = "0" + self.nowMonth;
			}

			// 定义全局变量 计算农历
			self.CalendarData = new Array(100);
			self.madd = new Array(12);
			self.tgString = "甲乙丙丁戊己庚辛壬癸";
			self.dzString = "子丑寅卯辰巳午未申酉戌亥";
			self.numString = "一二三四五六七八九十";
			self.monString = "正二三四五六七八九十冬腊";
			self.weekString = "日一二三四五六";
			self.sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
			self.cYear, self.cMonth, self.cDay, self.TheDate;
			self.CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95);
			self.madd[0] = 0;
			self.madd[1] = 31;
			self.madd[2] = 59;
			self.madd[3] = 90;
			self.madd[4] = 120;
			self.madd[5] = 151;
			self.madd[6] = 181;
			self.madd[7] = 212;
			self.madd[8] = 243;
			self.madd[9] = 273;
			self.madd[10] = 304;
			self.madd[11] = 334;

			// console.log("初始化年月日：" + self.nowYear + "-" + self.nowMonth + "-" + self.nowDay);
			// 刷新生成日历

			this.refresh(self.nowYear, self.nowMonth, self.nowDay, document.querySelector(".swiper-slide").querySelector(".em-calendar-wrapper"));
		},
		/**
		 * 刷新日历，传入日期格式须：2017-07-01 或2017-12-09
		 */
		refresh: function(year, month, day, activeSlideNode) {
			var self = this;

			self.nowYear = parseInt(year);
			self.nowMonth = parseInt(month);
			self.nowDay = parseInt(day);

			self.nowMonth = self.tom(self.nowMonth);
			self.nowDay = self.tod(self.nowDay);

			// 获取星期
			var tmptmp = new Date(Date.parse(self.nowYear + '/' + self.nowMonth + '/01'));
			var nowXingQiJi = tmptmp.getDay();
			nowXingQiJi = parseInt(nowXingQiJi);
			if(nowXingQiJi == 0) {
				nowXingQiJi = 7;
			}
			// 根据年份、月份 计算月份中的天数（比如：28、29、30、31等）
			var dayCount = self._judgeDaysByYearMonth(self.nowYear, self.nowMonth);
			// 总天数
			self.dayCount = dayCount;
			// 保留老的存储方式
			var fileInfo = {};
			// 新的存储方式
			var tmpInfo = [];

			var preDayCount = self._judgeDaysByYearMonth(self.nowYear, self.nowMonth - 1);
			preDayCount = parseInt(preDayCount);

			// 头部日期计算
			for(var i = 1; i < nowXingQiJi + 1; i++) {
				var preMonthDay = preDayCount - nowXingQiJi + i;
				//console.log(preMonthDay);
				var tmpName = 'day' + i;
				var lunar = 'lunar' + i;
				//日、农历、完整日期
				fileInfo[tmpName] = preMonthDay;
				fileInfo[lunar] = self._getLunar(preMonthDay, "m-1");
				//存储前一个月数据
				tmpInfo.push({
					day: preMonthDay, //日
					lunar: self._getLunar(preMonthDay, "m-1"), //农历
					date: self.nowYear + "-" + self.tom(self.nowMonth - 1) + "-" + self.tod(preMonthDay), //完整日期
					isforbid: "0" //前一个月和后一个月不可点击
				});
			}
			var daonale = 0;

			if(dayCount == '28') {
				daonale = 28 + nowXingQiJi;
				for(var index = nowXingQiJi + 1, indexindex = 1; index < (28 + nowXingQiJi + 1); index++, indexindex++) {
					var tmpName = 'day' + index;
					var lunar = 'lunar' + index;
					fileInfo[tmpName] = indexindex;
					fileInfo[lunar] = self._getLunar(indexindex);
					//存储当前月数据
					tmpInfo.push({
						day: indexindex, //日
						lunar: self._getLunar(indexindex), //农历
						date: self.nowYear + "-" + self.tom(self.nowMonth) + "-" + self.tod(indexindex), //完整日期
						isforbid: "1" //当前月可点击
					});
					//	console.log(self.tom(parseInt(self.nowMonth)) + "月份：" + self.tod(indexindex));

				}
			}
			if(dayCount == '29') {
				daonale = 29 + nowXingQiJi;
				for(var index = nowXingQiJi + 1, indexindex = 1; index < (29 + nowXingQiJi + 1); index++, indexindex++) {
					var tmpName = 'day' + index;
					var lunar = 'lunar' + index;
					fileInfo[tmpName] = indexindex;
					fileInfo[lunar] = self._getLunar(indexindex);
					//存储当前月数据
					tmpInfo.push({
						day: indexindex, //日
						lunar: self._getLunar(indexindex), //农历
						date: self.nowYear + "-" + self.tom(self.nowMonth) + "-" + self.tod(indexindex), //完整日期
						isforbid: "1" //当前月可点击
					});
					//console.log(self.tom(parseInt(self.nowMonth)) + "月份：" + self.tod(indexindex));

				}
			}
			if(dayCount == '30') {
				daonale = 30 + nowXingQiJi;
				for(var index = nowXingQiJi + 1, indexindex = 1; index < (30 + nowXingQiJi + 1); index++, indexindex++) {
					var tmpName = 'day' + index;
					var lunar = 'lunar' + index;
					fileInfo[tmpName] = indexindex;
					fileInfo[lunar] = self._getLunar(indexindex);
					//存储当前月数据
					tmpInfo.push({
						day: indexindex, //日
						lunar: self._getLunar(indexindex), //农历
						date: self.nowYear + "-" + self.tom(self.nowMonth) + "-" + self.tod(indexindex), //完整日期
						isforbid: "1" //当前月可点击
					});
					//console.log(self.tom(parseInt(self.nowMonth)) + "月份：" + self.tod(indexindex));
				}
			}
			if(dayCount == '31') {
				daonale = 31 + nowXingQiJi;
				for(var index = nowXingQiJi + 1, indexindex = 1; index < (31 + nowXingQiJi + 1); index++, indexindex++) {
					var tmpName = 'day' + index;
					var lunar = 'lunar' + index;
					fileInfo[tmpName] = indexindex;
					fileInfo[lunar] = self._getLunar(indexindex);
					//存储当前月数据
					tmpInfo.push({
						day: indexindex, //日
						lunar: self._getLunar(indexindex), //农历
						date: self.nowYear + "-" + self.tom(self.nowMonth) + "-" + self.tod(indexindex), //完整日期
						isforbid: "1" //当前月可点击
					});
					//console.log(self.tom(parseInt(self.nowMonth)) + "月份：" + self.tod(indexindex));
				}
			}
			// 尾部日期计算
			for(var index2 = daonale + 1, index3 = 1; index2 <= 42; index2++, index3++) {
				var tmpName = 'day' + index2;
				var lunar = 'lunar' + index2;
				fileInfo[tmpName] = index3;
				fileInfo[lunar] = self._getLunar(index3, "m+1");
				//存储当前月数据
				tmpInfo.push({
					day: index3, //日
					lunar: self._getLunar(index3, "m+1"), //农历
					date: self.nowYear + "-" + self.tom(parseInt(self.nowMonth) + parseInt(1)) + "-" + self.tod(index3), //完整日期
					isforbid: "0" //前一月和后一月不可点击
				});
				//console.log(self.tom(parseInt(self.nowMonth) + parseInt(1)) + "月份：" + self.tod(index3));
			}
			if(self.options.isDebug) {
				console.log("*********日历格式********:\n" + JSON.stringify(tmpInfo) + "\n");
			}
			this._render(fileInfo, tmpInfo, activeSlideNode);
		},

		/**
		 * 视图的渲染和数据分离，采用内部的数据
		 */
		_render: function(fileInfo, tmpInfo, activeSlideNode) {
			var self = this;

			//和业务绑定
			if(self.options.isDebug) {
				console.log("*********业务数据：********:\n" + JSON.stringify(self.options.data) + "\n");
			}
			for(var j = 0; j < self.options.data.length; j++) {
				for(var i = 0; i < tmpInfo.length; i++) {
					if(self.options.data[j].date == tmpInfo[i].date) {
						tmpInfo[i].isSelected = "1";
					}
				}
			}

			//完全自定义外部传入模板
			var html = '';
			html += self.options.weekHeader();
			html += self.options.dayStartNode();

			for(var i = 0, len = tmpInfo.length; i < len; i++) {
				html += Mustache.render(self.options.dayTempl(tmpInfo[i], self.currentDate), tmpInfo[i]);
			}
			html += self.options.dayEndNode();

			if(self.options.isDebug) {
				console.log("*********日历模板********:\n" + html + "\n");
			}

			//填充
			activeSlideNode.innerHTML = html;
			//this._selector(this.options.swiper).querySelector(this.options.container).innerHTML = html;
		},
		/**
		 * 增加事件，包括
		 * 日历点击的监听
		 * 日历左滑、右滑切换，等等
		 */
		_addEvent: function() {
			var self = this;
			var itemClick = self.options.itemClick;
			var swipeCallback = self.options.swipeCallback;
			var preCallback = self.options.preCallback;
			var nextCallback = self.options.nextCallback;
			var backToTodayCallback = self.options.backToTodayCallback;
			// 添加滑动效果
			var swiper = new Swiper('.swiper-container', {
				loop: true,
				effect: 'cube',
				cube: {
					slideShadows: false,
					shadow: false,
					shadowOffset: 10,
					shadowScale: 0.6
				},

				onSlideNextStart: function(swiper) {
					//当前activeIndex
					var activeIndex = swiper.activeIndex;
					var activeSlideNode = swiper.slides[activeIndex];
					//临时变量
					self.tmpActiveIndex = swiper.activeIndex;
					self.tmpSlideNode = swiper.slides[activeIndex];
					console.log("月份递减" + activeIndex);
					//activeIndex=2标识手动滑动第二张
					if(activeIndex == 2) {
						self.nowMonth = parseInt(self.nowMonth) + parseInt(1);
						if(self.nowMonth == 13) {
							self.nowYear = self.nowYear + 1;
							self.nowMonth = 1;
						}

						self.nowMonth = self.tom(self.nowMonth);
						self.nowDay = self.tod(self.nowDay);
						// 刷新
						self.refresh(self.nowYear, self.nowMonth, self.nowDay, activeSlideNode);
						// 滑动回调
						swipeCallback && swipeCallback({
							year: self.nowYear,
							month: self.nowMonth,
							day: self.nowDay,
							dayCount: self.dayCount
						});
					}
				},
				onSlidePrevStart: function(swiper) {
					//当前activeIndex
					var activeIndex = swiper.activeIndex;
					var activeSlideNode = swiper.slides[activeIndex];
					//临时变量
					self.tmpActiveIndex = swiper.activeIndex;
					self.tmpSlideNode = swiper.slides[activeIndex];
					console.log("月份递增" + activeIndex);
					self.nowMonth = parseInt(self.nowMonth) - parseInt(1);
					if(self.nowMonth == 0) {
						self.nowYear = self.nowYear - 1;
						self.nowMonth = 12;
					}
					self.nowMonth = self.tom(self.nowMonth);
					self.nowDay = self.tod(self.nowDay);
					// 刷新
					self.refresh(self.nowYear, self.nowMonth, self.nowDay, activeSlideNode);
					// 滑动回调
					swipeCallback && swipeCallback({
						year: self.nowYear,
						month: self.nowMonth,
						day: self.nowDay,
						dayCount: self.dayCount
					});

				},
			});
			swiper.slideTo(0, 1000, false); //初始化默认当前页,切换到第一个slide，速度为1秒
			//滑动到前一个滑块。
			// 给日期增加点击监听事件
			mui(".swiper-container").on('tap', '.em-calendar-item', function() {

				if(!this.classList.contains('isforbid0')) {
					Zepto(this).addClass('em-calendar-active').siblings().removeClass('em-calendar-active');
					var dateStr = this.getAttribute('date');
					if(this.querySelector('.lunar')) {
						var lunarStr = this.querySelector('.lunar').innerText.trim();
					} else {
						var lunarStr = "已签";
					}
					itemClick && itemClick({
						date: dateStr, //日期
						lunar: lunarStr //农历
					});
				}
			});

			// 上一月
			if(self._selector(self.options.pre)) {
				self._selector(self.options.pre).addEventListener("tap", function() {
					swiper.slidePrev();
				});

			}

			// 下一月
			if(self._selector(self.options.next)) {
				self._selector(self.options.next).addEventListener("tap", function() {
					swiper.slideNext();
				});

			}
			// 回到今天
			if(self._selector(self.options.backToToday)) {
				self._selector(self.options.backToToday).addEventListener("tap", function() {
					// 刷新
					// 初始化当前日期
					var dObj = new Date();
					var y = dObj.getFullYear();
					var m = self.tom(dObj.getMonth() + 1);
					var d = self.tod(dObj.getDate());
					self.refresh(y, m, d, self.tmpSlideNode);

					// 1代表初始化的那个索引值;初始化默认当前页,切换到第一个slide，速度为1秒
					if(self.tmpActiveIndex == "1") {
						//TODO 什么都不做
					} else {
						swiper.slideTo(1, 1000, false);
					}

					// 回到今天
					backToTodayCallback && backToTodayCallback({
						year: y,
						month: m,
						day: d,
						date: y + "-" + m + "-" + d
					});
				});
			}
		},
		/**
		 * 获取当前农历
		 * @param {Object} currentday
		 * @param {Object} month
		 * @return {String} 
		 */
		_getLunar: function(currentday, month) {
			var self = this;
			// 获取当前农历
			var yy = self.nowYear;
			var mm = self.nowMonth;
			mm = parseInt(mm);
			if(month === "m+1") {
				mm = 1 + mm;
				if(mm == 13) {
					mm = 1
				};
			}
			if(month === "m-1") {
				mm = -1 + mm;
				if(mm == 0) {
					mm = 1
				};
			}
			var dd = currentday;
			var ww = new Date(Date.parse(yy + '/' + mm + '/' + dd)).getDay();
			return this._getLunarDay(yy, mm, dd);
		},
		/**
		 * 根据年月计算当月的天数
		 * @param {Object} y
		 * @param {Object} m
		 */
		_judgeDaysByYearMonth: function(y, m) {
			var self = this;
			if(y == undefined || y == null) {
				throw "=====获取当前月份天数时，缺少y参数，未定义！=======";
			}
			if(m == undefined || m == null) {
				throw "=====获取当前月份天数时，缺少m参数，未定义！=======";
			}
			var y = parseInt(y);
			var m = parseInt(m);
			if(m == 0) {
				y--;
				m = 12;
			}
			if(m == 2) {
				if((y % 4 == 0 && y % 100 != 0) || (y % 400 == 0)) {
					return '29';
				} else {
					return '28';
				}
			} else {
				if(self._inArray(m, [1, 3, 5, 7, 8, 10, 12])) {
					return '31';
				} else {
					return '30';
				}
			}

		},

		/**
		 * 进行一次全局验证，验证输入的合法性
		 * 这个验证是强制性的
		 */
		_validate: function() {
			var flag = true;
			if(!this.options.container) {
				flag = false;
			}
			return flag;
		},
		_selector: function(el) {
			// 减少耦合
			return document.querySelector(el);
		},
		/**
		 *  判断元素在数组中是否存在
		 * @param {Object} str 数字或者字符串元素
		 * @param {Object} arr 有效数组
		 */
		_inArray: function(str, arr) {
			// 不是数组则抛出异常 
			if(!Array.isArray(arr)) {
				throw "arguments is not Array";
			}
			// 遍历是否在数组中 
			for(var i = 0, k = arr.length; i < k; i++) {
				if(str == arr[i]) {
					return true;
				}
			}
			// 如果不在数组中就会返回false 
			return false;
		},
		// 遍历查找同级元素
		_sibling: function(elem, forCB) {
			var r = [];
			var n = elem.parentNode.firstChild;
			for(; n; n = n.nextSibling) {
				if(n.nodeType === 1 && n !== elem) {
					if(forCB && typeof(forCB) == "function") {
						forCB(n);
					}
				}
			}
		},
		_getBit: function(m, n) {
			var self = this;
			// 农历转换 
			return(m >> n) & 1;
		},
		_e2c: function() {
			var self = this;
			self.TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
			var total, m, n, k;
			var isEnd = false;
			var tmp = self.TheDate.getYear();
			if(tmp < 1900) {
				tmp += 1900;
			}
			total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + self.madd[self.TheDate.getMonth()] + self.TheDate.getDate() - 38;

			if(self.TheDate.getYear() % 4 == 0 && self.TheDate.getMonth() > 1) {
				total++;
			}
			for(m = 0;; m++) {
				k = (self.CalendarData[m] < 0xfff) ? 11 : 12;
				for(n = k; n >= 0; n--) {
					if(total <= 29 + self._getBit(self.CalendarData[m], n)) {
						isEnd = true;
						break;
					}
					total = total - 29 - self._getBit(self.CalendarData[m], n);
				}
				if(isEnd) break;
			}
			self.cYear = 1921 + m;
			self.cMonth = k - n + 1;
			self.cDay = total;
			if(k == 12) {
				if(self.cMonth == Math.floor(self.CalendarData[m] / 0x10000) + 1) {
					self.cMonth = 1 - self.cMonth;
				}
				if(self.cMonth > Math.floor(self.CalendarData[m] / 0x10000) + 1) {
					self.cMonth--;
				}
			}

		},

		_getcDateString: function() {
			var self = this;
			var tmp = "";
			/*显示农历年：（ 如：甲午(马)年 ）*/
			if(self.cMonth < 1) {
				// tmp += "(闰)";
				// tmp += self.monString.charAt(-self.cMonth - 1);
			} else {
				// tmp += self.monString.charAt(self.cMonth - 1);
			}
			//tmp += "月";
			tmp += (self.cDay < 11) ? "初" : ((self.cDay < 20) ? "十" : ((self.cDay < 30) ? "廿" : "三十"));
			if(self.cDay % 10 != 0 || self.cDay == 10) {
				tmp += self.numString.charAt((self.cDay - 1) % 10);
			}
			return tmp;

		},
		_getLunarDay: function(solarYear, solarMonth, solarDay) {
			var self = this;
			//solarYear = solarYear<1900?(1900+solarYear):solarYear; 
			if(solarYear < 1921 || solarYear > 2080) {
				return "";
			} else {
				solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
				self._e2c(solarYear, solarMonth, solarDay);
				return self._getcDateString();
			}

		},
		/**
		 * 将1,2,3,4,5格式化01,02,03,04,05
		 * @param {Object} m 月份转换
		 */
		tom: function(m) {
			if(parseInt(m) > 9) {
				m = "" + parseInt(m);
			} else {
				m = "0" + parseInt(m);
			}
			return m;
		},
		/**
		 * 将1,2,3,4,5格式化01,02,03,04,05
		 * @param {Object} 日转换
		 */
		tod: function(d) {
			if(parseInt(d) > 9) {
				d = "" + parseInt(d);
			} else {
				d = "0" + parseInt(d);
			}
			return d;
		},
		/**
		 * 获取小时、分钟、秒    例如：18:09:00
		 * @param {Object} format hh:mm 输出00:00  hh:mm:ss 输出00:00:00
		 */
		getTime: function(format) {
			var oDate = new Date();
			var hh = oDate.getHours();
			var mm = oDate.getMinutes();
			var ss = oDate.getSeconds();
			var timeStr = "";
			if("hh:mm" == format) {
				timeStr += hh + ":" + mm;
			} else if("hh:mm:ss" == format) {
				timeStr += hh + ":" + mm + ":" + ss;
			}
			return timeStr;
		},
	};

	window.Calendar2 = Calendar;
})();