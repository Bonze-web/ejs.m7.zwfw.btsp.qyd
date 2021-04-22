/*
 * @Author: guotq
 * @Date: 2018-04-20 16:31:00
 * @Last Modified by: guotq
 * @Last Modified time: 2018-10-11 15:44:11
 * @Description: 极简的日期插件
 */

(function () {
    'use strict';

    var tpl = ['<div class="ui-datepicker-header">',
        '    <a href="javascript:void(0);" class="ui-datepicker-btn ui-datepicker-prev-btn" data-type="leftbtn">&lt;</a>',
        '    <a href="javascript:void(0);" class="ui-datepicker-btn ui-datepicker-next-btn" data-type="rightbtn">&gt;</a>',
        '    <span class="ui-datepicker-curr-month" data-title="date"></span>',
        '</div>',
        '<div class="ui-datepicker-body">',
        '    <table>',
        '        <thead>',
        '            <tr>',
        '                <th>一</th>',
        '                <th>二</th>',
        '                <th>三</th>',
        '                <th>四</th>',
        '                <th>五</th>',
        '                <th>六</th>',
        '                <th>日</th>',
        '            </tr>',
        '        </thead>',
        '        <tbody data-body="body"></tbody>',
        '    </table>',
        '</div>'
    ].join('');

    /**
     * 极简的日期插件
     * @param {Object} options 配置项
     * el 容器元素
     * itemClick callback
     */
    function EasyCalendar(options) {
        if (!options.el) {
            throw new Error('请传入正确的容器元素');
        }

        this.el = this.getHTMLElement(options.el);
        this.cls = options.cls || '';

        // 加载模板
        this.loadTpl();
        this.showDateEl = this.getHTMLElement('[data-title=date]');
        this.tableBodyEl = this.getHTMLElement('[data-body=body]');
        this.leftBtnEl = this.getHTMLElement('[data-type=leftbtn]');
        this.rightBtnEl = this.getHTMLElement('[data-type=rightbtn]');
        this.itemClick = typeof options.itemClick === 'function' ? options.itemClick : function () {};
        this._addEvent();
    }

    /**
     * 原型
     */
    EasyCalendar.prototype = {

        /**
         * 创建日期插件
         * @param {Number} year 年
         * @param {Number} month 月
         * @param {Number} day 日
         */
        createCalendar: function (year, month, day) {
            var today = this.getNowDay();

            if (!year) {
                year = today.getFullYear();
            }

            if (!day) {
                day = today.getDate();
            }

            if (month === undefined) {
                month = today.getMonth();
            } else {
                month = month - 1;

                if (month < 0) {
                    month = 11;
                } else if (month > 11) {
                    month = 0;
                }
            }

            var todayDate = new Date(year, month, 1),
                todayYear = todayDate.getFullYear(),
                todayMonth = todayDate.getMonth() + 1,
                todayDateOfWeek = todayDate.getDay();

            var preDate = new Date(year, month, 0),
                preYear = preDate.getFullYear(),
                preMonth = preDate.getMonth() + 1,
                preDateOfMonth = preDate.getDate();

            var lastDate = new Date(year, month + 1, 0),
                lastDateOfMonth = lastDate.getDate();

            var nextDate = new Date(year, month + 1, 1),
                nextYear = nextDate.getFullYear(),
                nextMonth = nextDate.getMonth() + 1;

            if (day > lastDateOfMonth) {
                throw new Error('当前传入天数，超出本月应有天数，本月只有：' + lastDateOfMonth + '天');
            }

            // 0 - 6 0代表星期天，修改一下
            if (todayDateOfWeek === 0) {
                todayDateOfWeek = 7;
            }

            // 前面有几个上个月的天数
            var preDayOfCount = todayDateOfWeek - 1,
                result = [],
                _year = 0,
                _month = 0,
                _day = 0,
                cls = '',
                dayCls = '',
                index = 0;

            for (var i = 0, len = 42; i < len; i++) {
                index = i - preDayOfCount;

                if (index < 0) {
                    _year = preYear;
                    _month = preMonth;
                    _day = preDateOfMonth + index + 1;
                    cls = 'exceed';
                }

                if (index >= 0 && index < lastDateOfMonth) {
                    _year = todayYear;
                    _month = todayMonth;
                    _day = index + 1;
                    cls = '';
                }

                if (index >= lastDateOfMonth) {
                    _year = nextYear;
                    _month = nextMonth;
                    _day = index - lastDateOfMonth + 1;
                    cls = 'exceed';
                }

                if (_month === todayMonth && _year === todayYear && _day === day) {
                    dayCls = this.cls;
                } else {
                    dayCls = '';
                }

                result.push({
                    year: _year,
                    month: _month,
                    day: _day,
                    cls: cls,
                    dayCls: dayCls
                });

            }

            this.showDateEl.innerHTML = todayYear + '-' + this.appendZero(todayMonth);
            this.year = todayYear;
            this.month = todayMonth;
            this.day = day;
            // 渲染日期
            this._renderCalendar(result);
        },

        /**
         * 渲染日期
         * @param {String} dateCollection 日期集合
         */
        _renderCalendar: function (dateCollection) {
            var result = '';

            for (var i = 1, len = dateCollection.length; i <= len; i++) {
                var item = dateCollection[i - 1];

                if (i === 1) {
                    result += '<tr><td class="' + item.cls + ' ' + item.dayCls + '" data-year="' + item.year + '" data-month="' + item.month + '">' + item.day + '</td>';
                } else if (i % 7 === 0) {
                    result += '<td class="' + item.cls + ' ' + item.dayCls + '" data-year="' + item.year + '" data-month="' + item.month + '">' + item.day + '</td></tr><tr>';
                } else {
                    result += '<td class="' + item.cls + ' ' + item.dayCls + '" data-year="' + item.year + '" data-month="' + item.month + '">' + item.day + '</td>';
                }

            }

            this.tableBodyEl.innerHTML = result;
        },

        /**
         * 获取日历日期
         * @returns {Object} 结果
         */
        getCalendarData: function () {
            return {
                year: this.year.toString(),
                month: this.month.toString(),
                day: this.day.toString()
            };
        },

        /**
         * 监听事件
         */
        _addEvent: function () {
            var _handleTriggerDate = this._handleTriggerDate.bind(this);
            var that = this;
            var cls = this.cls;

            this.leftBtnEl.addEventListener('tap', function () {
                _handleTriggerDate(this, '-');
            });

            this.rightBtnEl.addEventListener('tap', function () {
                _handleTriggerDate(this, '+');
            });

            this.tableBodyEl.addEventListener('tap', function (e) {
                var self = e.target;
                var thatMonth = that.month;

                if (self.tagName !== 'TD') {
                    return;
                }

                if (cls) {
                    self.classList.add(cls);
                    that.removeSiblingsCls(self, cls);
                }

                var year = self.dataset.year,
                    month = self.dataset.month,
                    day = self.innerHTML;

                that.itemClick.call(self, {
                    year: year,
                    month: month,
                    day: self.innerHTML
                });

                if (month > thatMonth || month < thatMonth) {
                    that.createCalendar(year, month, parseInt(day, 10));
                }
            });
        },

        /**
         * 获取当前元素的兄弟元素并且除去样式
         * @param {HTMLElement} el 当前元素
         * @param {String} cls 高亮样式
         */
        removeSiblingsCls: function (el, cls) {
            var siblings = [].slice.call(this.tableBodyEl.querySelectorAll('td'));

            siblings.forEach(function (e, i) {
                if (e !== el) {
                    e.classList.remove(cls);
                }
            });
        },

        /**
         * 处理监听日期
         * @param {HTMLElement} el 当前点击元素
         * @param {String} operator 运算符
         */
        _handleTriggerDate: function (el, operator) {
            var month = this.month,
                year = this.year,
                style = el.style;

            // 弹起样式
            style.paddingTop = '1px';

            setTimeout(function() {
                style.paddingTop = 0;
            }, 100);

            if (operator === '+') {
                month++;
            } else if (operator === '-') {
                month--;
            }

            if (month <= 0) {
                year--;
            } else if (month > 12) {
                year++;
            }

            this.createCalendar(year, month);
        },

        /**
         * 个位数不足补0
         * @param {Number} num 数字
         * @returns {String} 补0过后的数字
         */
        appendZero: function (num) {
            if (num < 10) {
                return '0' + num;
            }

            return num;
        },

        /**
         * 展示日期组件
         */
        showCalendar: function () {
            this.el.style.display = 'block';
        },

        /**
         * 关闭日期组件
         */
        hideCalendar: function () {
            this.el.style.display = 'none';
        },

        /**
         * 如果组件当前状态为显示则隐藏，如果为隐藏则显示
         */
        toggleCalendar: function() {
            var style = this.el.style;

            if (style.display === 'none') {
                style.display = 'block';
            }
            else {
                style.display = 'none';
            }
        },

        /**
         * 获取当前日期
         * @returns {Date} date 时间实例
         */
        getNowDay: function () {
            return new Date();
        },

        /**
         * 获取模板
         */
        loadTpl: function () {
            this.el.innerHTML = tpl;
        },

        /**
         * 获取 dom 元素
         * @param {any} el 元素
         * @returns {HTMLElement} 获取到的dom元素
         */
        getHTMLElement: function (el) {
            var d = this.el && this.el.nodeType === 1 ? this.el : document;

            if (el.nodeType !== 1) {
                return d.querySelector(el);
            }

            return el;
        }
    };

    window.EasyCalendar = EasyCalendar;
}());