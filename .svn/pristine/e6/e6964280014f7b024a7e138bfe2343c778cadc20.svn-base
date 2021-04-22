/*!
 * @epoint-mrc/ejsv4 v4.0.2d
 * (c) 2017-2020 
 * Released under the BSD-3-Clause License.
 * 
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('vue'), require('vant')) :
	typeof define === 'function' && define.amd ? define(['vue', 'vant'], factory) :
	(factory(global.Vue,global.vant));
}(this, (function (Vue,vant) { 'use strict';

Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

var pickdateStyle = document.createElement('style');
pickdateStyle.textContent = '\n    .ejs-ui-pickdate .van-picker{\n        padding: 52px 0 70px;\n    }\n    \n    .ejs-ui-pickdate .van-picker .van-picker__toolbar{\n        position: absolute;\n        width: 100%;\n        height: 70px;\n        box-sizing: border-box;\n        bottom: 0;\n        padding: 10px 20px 20px;\n    }\n\n    .ejs-ui-pickdate .van-picker .van-picker__toolbar button{\n        width: calc(50% - 14px);\n        border-radius: 22px;\n        font-size: 15px;\n    }\n\n    .ejs-ui-pickdate .van-picker .van-picker__toolbar .van-picker__cancel{\n        border: 1px solid #969799;\n        color: #2e3033;\n    }\n\n    .ejs-ui-pickdate .van-picker .van-picker__toolbar .van-picker__confirm{\n        background-color: #2463e0;\n        color: #fff;\n    }\n    \n    .ejs-ui-pickdate .van-picker .van-picker__title{\n        position: absolute;\n        top: -300px;\n    }\n    \n    .ejs-ui-pickdate .van-picker .van-picker__columns{\n        height: 264px !important;\n        color: #2E3033;\n        border-top: 1px solid #ebedf0;\n        padding: 0 20px;\n    }\n    ';
pickdateStyle.id = 'pickdateStyle';

var pickdatetimeStyle = document.createElement('style');
pickdatetimeStyle.textContent = '\n    #ejs-ui-pickDateTime .van-picker .van-picker-column:nth-child(1){\n        flex: 2;\n    }\n';
pickdatetimeStyle.id = 'pickdatetimeStyle';

var selectStyle = document.createElement('style');
selectStyle.textContent = '\n    .ejs-ui-select .van-cell-group{\n        max-height: 376px;\n        overflow: scroll;\n    }\n    .ejs-ui-select .van-cell-group::after{\n        border: none;\n    }\n    .ejs-ui-select .van-cell-group .van-cell{\n        padding: 10px 20px;\n        font-size: 16px;\n        color: #2e3033;\n    }\n    .ejs-ui-select .van-cell-group .van-cell::after{\n        border-bottom: none;\n    }\n    .ejs-ui-select .van-cell-group .van-cell .van-radio__icon .van-icon{\n        border: none;\n    }\n    .ejs-ui-select .van-popup__close-icon{\n        color: #2e3033;\n    }\n    .ejs-ui-select .van-checkbox__icon--checked .van-icon,\n    .ejs-ui-select .van-radio__icon--checked .van-icon{\n        background-color: #2463e0;\n    }\n    .ejs-ui-select .van-cell-group .fontActive{\n        color: #2463e0;\n    }\n';
selectStyle.id = 'selectStyle';

var dialogStyle = document.createElement('style');
dialogStyle.textContent = '\n    .van-dialog{\n        border-radius: 6px;\n    }\n    .van-dialog__footer{\n        padding: 0 24px 20px;\n    }\n    .van-dialog__footer .van-button{\n        border-radius: 25px;\n        height: 40px;\n    }\n    .van-dialog__footer .van-dialog__cancel{\n        border: 1px solid #ebedf0;\n        margin-right: 16px;\n    }\n    .van-dialog__footer .van-dialog__confirm{\n        background-color: rgb(36, 99, 224);\n        color: #fff;\n    }\n    .van-dialog__message{\n        padding: 0;\n        color: #000;\n    }\n    .van-dialog__message--has-title{\n        padding: 0;\n    }\n    .van-dialog__content{\n        padding: 20px 20px 28px;\n    }\n    .van-hairline--top::after{\n        border-top-width: 0;\n    }\n    .van-hairline--left::after{\n        border-left-width: 0;\n    }\n    [class*=van-hairline]::after{\n        border: none;\n    }\n';
dialogStyle.id = 'dialogStyle';

/**
 * 将小于10的数字前面补齐0,然后变为字符串返回
 * @param {Number} number 需要不起的数字
 * @return {String} 补齐0后的字符串
 */
function paddingWith0(numberStr) {
    var DECIMAL_TEN = 10;
    var number = numberStr;

    if (typeof number === 'number' || typeof number === 'string') {
        number = parseInt(number, DECIMAL_TEN);
        if (number < DECIMAL_TEN) {
            number = '0' + number;
        }

        return number;
    }

    return '';
}

var option = {
    minDate: null,
    maxDate: null
};
var nowValue = null;
var weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function getMonthEndDay(year, month) {
    return 32 - new Date(year, month - 1, 32).getDate();
}

function times(n, iteratee) {
    var index = -1;
    var result = Array(n);

    while (++index < n) {
        result[index] = iteratee(index);
    }

    return result;
}

function formatDate(year, month, date) {
    var week = weekDay[new Date(year, month - 1, date).getDay()];
    return year + '-' + paddingWith0(month) + '-' + paddingWith0(date) + ' ' + week;
}

function getBoundary(type, value) {
    var _ref = void 0;

    var boundary = option[type + 'Date'];
    var year = boundary.getFullYear();
    var month = 1;
    var date = 1;
    var hour = 0;
    var minute = 0;

    if (type === 'max') {
        month = 12;
        date = getMonthEndDay(value.getFullYear(), value.getMonth() + 1);
        hour = 23;
        minute = 59;
    }

    if (value.getFullYear() === year) {
        month = boundary.getMonth() + 1;

        if (value.getMonth() + 1 === month) {
            date = boundary.getDate();

            if (value.getDate() === date) {
                hour = boundary.getHours();

                if (value.getHours() === hour) {
                    minute = boundary.getMinutes();
                }
            }
        }
    }

    return _ref = {}, _ref[type + 'Year'] = year, _ref[type + 'Month'] = month, _ref[type + 'Date'] = date, _ref[type + 'Hour'] = hour, _ref[type + 'Minute'] = minute, _ref;
}

function ranges() {
    var _this$getBoundary = getBoundary('max', nowValue),
        maxYear = _this$getBoundary.maxYear,
        maxDate = 31,
        maxMonth = 12,
        maxHour = _this$getBoundary.maxHour,
        maxMinute = _this$getBoundary.maxMinute;

    var _this$getBoundary2 = getBoundary('min', nowValue),
        minYear = _this$getBoundary2.minYear,
        minDate = 1,
        minMonth = 1,
        minHour = _this$getBoundary2.minHour,
        minMinute = _this$getBoundary2.minMinute;

    var result = [{
        type: 'year',
        range: [minYear, maxYear]
    }, {
        type: 'month',
        range: [minMonth, maxMonth]
    }, {
        type: 'day',
        range: [minDate, maxDate]
    }, {
        type: 'hour',
        range: [minHour, maxHour]
    }, {
        type: 'minute',
        range: [minMinute, maxMinute]
    }];

    return result;
}

function originColumns() {
    var rangesData = ranges();

    return rangesData.map(function (_ref) {
        var type = _ref.type,
            rangeArr = _ref.range;
        var values = times(rangeArr[1] - rangeArr[0] + 1, function (index) {
            var value = rangeArr[0] + index;
            return value;
        });

        return {
            type: type,
            values: values
        };
    });
}

function columns() {
    var originColumnsData = originColumns();
    var changeColumns = originColumnsData.slice(-2);
    var maxDate = option.maxDate.getDate(),
        maxMonth = option.maxDate.getMonth() + 1,
        maxYear = option.maxDate.getFullYear(),
        minDate = option.minDate.getDate(),
        minMonth = option.minDate.getMonth() + 1,
        minYear = option.minDate.getFullYear();
    var col_1 = [];

    originColumnsData[0].values.forEach(function (year) {
        originColumnsData[1].values.forEach(function (month) {
            if (maxYear === year && month > maxMonth || minYear === year && month < minMonth) {} else {
                originColumnsData[2].values.forEach(function (date) {
                    if (maxYear === year && month === maxMonth && date > maxDate || minYear === year && month === minMonth && date < minDate || date > getMonthEndDay(year, month)) {} else {
                        col_1.push(formatDate(year, month, date));
                    }
                });
            }
        });
    });

    changeColumns = [{
        type: 'day',
        values: col_1
    }].concat(changeColumns);

    return changeColumns.map(function (column) {
        var index = 0;

        if (column.type === 'day') {
            var now = formatDate(nowValue.getFullYear(), nowValue.getMonth() + 1, nowValue.getDate());
            index = column.values.indexOf(now);
        }

        if (column.type === 'hour') {
            index = column.values.indexOf(nowValue.getHours());
            column.values = column.values.map(function (ele) {
                return paddingWith0(ele);
            });
        }

        if (column.type === 'minute') {
            index = column.values.indexOf(nowValue.getMinutes());
            column.values = column.values.map(function (ele) {
                return paddingWith0(ele);
            });
        }
        return {
            values: column.values,
            defaultIndex: index
        };
    });
}

function getColumns(minDate, maxDate, innerValue) {

    option.minDate = minDate;
    option.maxDate = maxDate;
    nowValue = innerValue;

    return columns();
}

function insertFormatCSS() {
    if (!document.querySelector('#pickdateStyle')) {
        var head = document.getElementsByTagName('head')[0];

        head.appendChild(pickdateStyle);
    }
}

function formatDialog(cancelable) {
    if (!document.querySelector('#dialogStyle')) {
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(dialogStyle);
    }

    if (!cancelable) {
        document.querySelector('#dialogStyle').textContent = document.querySelector('#dialogStyle').textContent.replace(/.van-dialog__footer\{([\s]+?)padding: 0 24px 20px;/g, '.van-dialog__footer{\n            padding: 0 20% 20px;');
    } else {
        document.querySelector('#dialogStyle').textContent = document.querySelector('#dialogStyle').textContent.replace(/.van-dialog__footer\{([\s]+?)padding: 0 20% 20px;/g, '.van-dialog__footer{\n            padding: 0 24px 20px;');
    }
}

function uiVue(args, method) {
    var options = args[0];
    var resolve = args[1];
    var vueData = {
        type: '',
        confirm: {
            show: false,
            title: '',
            message: '',
            buttonLabels: ['取消', '确定'],
            cancelable: true
        },
        alert: {
            show: false,
            title: '',
            message: '',
            buttonName: '',
            cancelable: true
        },
        prompt: {
            show: false,
            message: '',
            value: '',
            title: '',
            buttonLabels: '',
            hint: '',
            maxlength: '',
            autosize: null,
            cancelable: true
        },
        actionSheet: {
            show: false,
            actions: [],
            canClose: false,
            cancelable: true
        },
        pickDate: {
            show: false,
            type: '',
            value: null,
            title: '',
            minDate: null,
            maxDate: null,
            innerValue: null,
            columns: null,
            canClose: false
        },
        pickTime: {
            show: false,
            value: null,
            title: '',
            minHour: '',
            maxHour: '',
            minMinute: '',
            maxMinute: '',
            canClose: false
        },
        pickDateTime: {
            show: false,
            value: null,
            title: '',
            minDate: null,
            maxDate: null,
            innerValue: null,
            columns: null,
            canClose: false
        },
        popPicker: {
            show: false,
            columns: [],
            canClose: false
        },
        showWaiting: {
            show: false,
            message: '',
            canClose: false
        },
        select: {
            title: '',
            items: [],
            choiceState: [],
            // 由以前的true和false替换为了1和0
            isMultiSelect: 1,
            // 样式类型，默认为0。 0：单列表样式；1：九宫格样式(目前只支持单选)
            type: '',
            columns: '',
            // 可取消
            cancelable: '',
            show: false,
            value: '',
            canClose: false
        }
    };

    var datetime = options.datetime;
    var minDate = options.minDate;
    var maxDate = options.maxDate;

    if (method === 'pickDate' || method === 'pickDateTime' || method === 'pickMonth') {
        insertFormatCSS();

        if (!datetime) {
            // 如果不存在，默认为当前时间
            datetime = new Date();
        } else {
            datetime = new Date(datetime);
        }

        if (method !== 'pickDateTime') {
            if (!minDate) {
                // 如果不传
                minDate = new Date().getFullYear() - 10;
                minDate += '/01/01';
            }

            if (!maxDate) {
                maxDate = new Date().getFullYear() + 10;
                maxDate += '/12/31';
            }
        }
    }

    switch (method) {
        case 'confirm':
            vueData.type = 'confirm';
            vueData.confirm.title = options.title;
            vueData.confirm.message = options.message;
            vueData.confirm.buttonLabels = options.buttonLabels;
            vueData.confirm.cancelable = options.cancelable === 1;
            formatDialog(vueData.confirm.cancelable);
            break;
        case 'alert':
            vueData.type = 'alert';
            vueData.alert.title = options.title;
            vueData.alert.message = options.message;
            vueData.alert.buttonName = options.buttonName;
            vueData.alert.cancelable = options.cancelable === 1;
            formatDialog(vueData.alert.cancelable);
            break;
        case 'prompt':
            vueData.type = 'prompt';
            vueData.prompt.message = options.message;
            vueData.prompt.value = options.text;
            vueData.prompt.title = options.title;
            vueData.prompt.buttonLabels = options.buttonLabels;
            vueData.prompt.hint = options.hint;
            vueData.prompt.maxlength = options.maxLength;
            vueData.prompt.cancelable = options.cancelable === 1;
            vueData.prompt.autosize = {
                // 一行的高度是24px
                maxHeight: options.lines * 24,
                minHeight: 24
            };
            formatDialog(vueData.prompt.cancelable);
            break;
        case 'actionSheet':
            vueData.type = 'actionSheet';
            options.items = options.items.map(function (element) {
                return { name: element };
            });
            vueData.actionSheet.actions = options.items;
            vueData.actionSheet.cancelable = options.cancelable === 1;
            break;
        case 'pickDate':
            vueData.type = 'pickDate';
            vueData.pickDate.type = 'date';
            vueData.pickDate.value = datetime;
            vueData.pickDate.title = options.title;
            vueData.pickDate.minDate = new Date(minDate);
            vueData.pickDate.maxDate = new Date(maxDate);
            break;
        case 'pickMonth':
            vueData.type = 'pickDate';
            vueData.pickDate.type = 'year-month';
            vueData.pickDate.value = datetime;
            vueData.pickDate.title = options.title;
            vueData.pickDate.minDate = new Date(minDate);
            vueData.pickDate.maxDate = new Date(maxDate);
            break;
        case 'pickTime':
            insertFormatCSS();
            var _datetime = options.datetime;

            if (!_datetime) {
                // 如果不存在，默认为当前时间
                var dateNow = new Date();
                var hours = paddingWith0(dateNow.getHours());
                var minutes = paddingWith0(dateNow.getMinutes());
                _datetime = hours + ':' + minutes;
            }
            vueData.type = 'pickTime';
            vueData.pickTime.value = _datetime;
            vueData.pickTime.title = options.title;
            vueData.pickTime.minHour = options.minHour;
            vueData.pickTime.maxHour = options.maxHour;
            vueData.pickTime.minMinute = options.minMinute;
            vueData.pickTime.maxMinute = options.maxMinute;
            break;
        case 'pickDateTime':
            vueData.type = 'pickDateTime';
            if (!document.querySelector('pickdatetimeStyle')) {
                var head = document.getElementsByTagName('head')[0];

                head.appendChild(pickdatetimeStyle);
            }

            if (!minDate) {
                // 如果不传
                vueData.pickDateTime.minDate = new Date(datetime.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
            } else {
                vueData.pickDateTime.minDate = new Date(minDate);
            }

            if (!maxDate) {
                vueData.pickDateTime.maxDate = new Date(datetime.getTime() + 6 * 30 * 24 * 60 * 60 * 1000);
            } else {
                vueData.pickDateTime.maxDate = new Date(maxDate);
            }
            vueData.pickDateTime.value = datetime;
            vueData.pickDateTime.title = options.title;
            vueData.pickDateTime.innerValue = datetime;
            vueData.pickDateTime.columns = getColumns(vueData.pickDateTime.minDate, vueData.pickDateTime.maxDate, datetime);
            break;
        case 'popPicker':
            vueData.type = 'popPicker';
            vueData.popPicker.columns = options.data;
            break;
        case 'showWaiting':
            vueData.type = 'showWaiting';
            vueData.showWaiting.message = options.message;
            vueData.showWaiting.opacityArray = [0.3, 0.7, 1];
            break;
        case 'select':
            var setValue = '';
            var _type = '';

            if (options.type === 0 && options.isMultiSelect === 1) {
                // 多选
                _type = 'selectMulti';
                setValue = [];
                options.choiceState.forEach(function (item, index) {
                    if (item === '1') {
                        setValue.push(options.items[index]);
                    }
                });
            } else if (options.type === 0 && options.isMultiSelect === 0) {
                // 单选
                _type = 'select';
            } else if (options.type === 1) {
                // 九宫格单选
                _type = 'selectSingleSP';
                formatDialog(options.cancelable === 1);
            }

            if (options.type === 0 && !document.querySelector('#selectStyle')) {
                var _head = document.getElementsByTagName('head')[0];

                _head.appendChild(selectStyle);
            }
            vueData.type = 'select';
            vueData.select.title = options.title;
            vueData.select.items = options.items;
            vueData.select.choiceState = options.choiceState;
            vueData.select.isMultiSelect = options.isMultiSelect;
            vueData.select.type = _type;
            vueData.select.columns = options.columns;
            vueData.select.cancelable = options.cancelable === 1;
            vueData.select.value = setValue;
            break;
        default:
            break;
    }

    if (options.success) {
        vueData[vueData.type].success = options.success;
    }

    if (resolve) {
        vueData[vueData.type].resolve = resolve;
    }

    var createPickDate = function createPickDate() {
        var vnode = new Vue({
            data: function data() {
                return vueData;
            },
            render: function render() {
                var h = arguments[0];

                var self = this;
                var innerDOM = '';

                switch (self.type) {
                    case 'confirm':
                        innerDOM = h(vant.Dialog.Component, {
                            attrs: {
                                id: 'ejs-ui-confirm'
                            },
                            props: {
                                'value': self.confirm.show,
                                'title': self.confirm.title,
                                'message': self.confirm.message,
                                'show-cancel-button': self.confirm.cancelable,
                                'confirm-button-text': self.confirm.buttonLabels[1],
                                'cancel-button-text': self.confirm.buttonLabels[0],
                                'overlay-style': { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
                            },
                            on: {
                                'confirm': self.conConfirm,
                                'cancel': self.conCancel
                            }
                        });
                        break;
                    case 'alert':
                        innerDOM = h(vant.Dialog.Component, {
                            attrs: {
                                id: 'ejs-ui-alert'
                            },
                            props: {
                                'value': self.alert.show,
                                'title': self.alert.title,
                                'message': self.alert.message,
                                'show-cancel-button': self.alert.cancelable,
                                'confirm-button-text': self.alert.buttonName,
                                'overlay-style': { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
                            },
                            on: {
                                'confirm': self.alertConfirm,
                                'cancel': self.alertConfirm
                            }
                        });
                        break;
                    case 'prompt':
                        innerDOM = h(
                            vant.Dialog.Component,
                            {
                                attrs: {
                                    id: 'ejs-ui-prompt'
                                },
                                props: {
                                    'value': self.prompt.show,
                                    'title': self.prompt.title,
                                    'show-cancel-button': self.prompt.cancelable,
                                    'confirm-button-text': self.prompt.buttonLabels[1],
                                    'cancel-button-text': self.prompt.buttonLabels[0],
                                    'overlay-style': { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
                                },
                                on: {
                                    'confirm': self.promptConfirm,
                                    'cancel': self.promptCancel
                                }
                            },
                            [h(vant.Field, {
                                props: {
                                    'value': self.prompt.value,
                                    'type': 'textarea',
                                    'autosize': self.prompt.autosize,
                                    'placeholder': self.prompt.hint,
                                    'maxlength': self.prompt.maxlength
                                },
                                on: {
                                    'input': self.promptInput
                                }
                            })]
                        );
                        break;
                    case 'actionSheet':
                        if (self.actionSheet.cancelable) {
                            innerDOM = h(vant.ActionSheet, {
                                attrs: {
                                    id: 'ejs-ui-actionSheet'
                                },
                                props: {
                                    'value': self.actionSheet.show,
                                    'actions': self.actionSheet.actions,
                                    'cancelText': '\u53D6\u6D88',
                                    'close-on-click-overlay': false
                                },
                                on: {
                                    'select': self.actionSheetSelect,
                                    'cancel': self.cancel,
                                    'click-overlay': self.cancel
                                }
                            });
                        } else {
                            innerDOM = h(vant.ActionSheet, {
                                attrs: {
                                    id: 'ejs-ui-actionSheet'
                                },
                                props: {
                                    'value': self.actionSheet.show,
                                    'actions': self.actionSheet.actions,
                                    'close-on-click-overlay': false
                                },
                                on: {
                                    'select': self.actionSheetSelect,
                                    'cancel': self.cancel,
                                    'click-overlay': self.cancel
                                }
                            });
                        }
                        break;
                    case 'pickDate':
                        innerDOM = h(
                            vant.Popup,
                            {
                                props: {
                                    'value': self.pickDate.show,
                                    'position': 'bottom',
                                    'close-on-click-overlay': false,
                                    'overlay-style': { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
                                },
                                attrs: {
                                    id: 'ejs-ui-' + self.type
                                },
                                'class': 'ejs-ui-pickdate',
                                on: {
                                    'click-overlay': self.cancel
                                }
                            },
                            [h(vant.DatetimePicker, {
                                props: {
                                    'value': self.pickDate.value,
                                    'type': self.pickDate.type,
                                    'title': self.pickDate.title,
                                    'minDate': self.pickDate.minDate,
                                    'maxDate': self.pickDate.maxDate,
                                    'confirm-button-text': '\u786E\u5B9A'
                                },
                                on: {
                                    'confirm': self.pickDateConfirm,
                                    'cancel': self.cancel
                                }
                            })]
                        );
                        break;
                    case 'pickTime':
                        innerDOM = h(
                            vant.Popup,
                            {
                                props: {
                                    'value': self.pickTime.show,
                                    'position': 'bottom',
                                    'close-on-click-overlay': false,
                                    'overlay-style': { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
                                },
                                attrs: {
                                    id: 'ejs-ui-pickTime'
                                },
                                'class': 'ejs-ui-pickdate',
                                on: {
                                    'click-overlay': self.cancel
                                }
                            },
                            [h(vant.DatetimePicker, {
                                props: {
                                    'value': self.pickTime.value,
                                    'type': 'time',
                                    'title': self.pickTime.title,
                                    'min-hour': self.pickTime.minHour,
                                    'max-hour': self.pickTime.maxHour,
                                    'min-minute': self.pickTime.minMinute,
                                    'max-minute': self.pickTime.maxMinute,
                                    'confirm-button-text': '\u786E\u5B9A'
                                },
                                on: {
                                    'confirm': self.pickTimeConfirm,
                                    'cancel': self.cancel
                                }
                            })]
                        );
                        break;
                    case 'pickDateTime':
                        innerDOM = h(
                            vant.Popup,
                            {
                                props: {
                                    'value': self.pickDateTime.show,
                                    'position': 'bottom',
                                    'close-on-click-overlay': false,
                                    'overlay-style': { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
                                },
                                attrs: {
                                    id: 'ejs-ui-' + self.type
                                },
                                'class': 'ejs-ui-pickdate',
                                on: {
                                    'click-overlay': self.cancel
                                }
                            },
                            [h(vant.Picker, {
                                props: {
                                    'title': self.pickDateTime.title,
                                    'show-toolbar': true,
                                    'columns': self.pickDateTime.columns,
                                    'confirm-button-text': '\u786E\u5B9A'
                                },
                                on: {
                                    'confirm': self.pickDateTimeConfirm,
                                    'cancel': self.cancel,
                                    'change': self.pickDateTimeChange
                                }
                            })]
                        );
                        break;
                    case 'popPicker':
                        innerDOM = h(
                            vant.Popup,
                            {
                                props: {
                                    'value': self.popPicker.show,
                                    'position': 'bottom',
                                    'close-on-click-overlay': false,
                                    'overlay-style': { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
                                },
                                attrs: {
                                    id: 'ejs-ui-popPicker'
                                },
                                on: {
                                    'click-overlay': self.cancel
                                }
                            },
                            [h(vant.Picker, {
                                props: {
                                    'show-toolbar': true,
                                    'columns': self.popPicker.columns
                                },
                                on: {
                                    'confirm': self.popPickerConfirm,
                                    'cancel': self.cancel
                                }
                            })]
                        );
                        break;
                    case 'showWaiting':
                        innerDOM = h(
                            vant.Popup,
                            {
                                props: {
                                    'value': self.showWaiting.show,
                                    'close-on-click-overlay': false
                                },
                                attrs: {
                                    id: 'ejs-ui-showWaiting',

                                    overlay: false
                                },
                                on: {
                                    'click-overlay': self.cancel
                                },
                                style: { width: '140px', height: '115px', backgroundColor: '#000', opacity: '0.7', borderRadius: '10px' }
                            },
                            [h(
                                'div',
                                { style: { textAlign: 'center', width: '100%', height: '100%', padding: '30px 0 20px', boxSizing: 'border-box' } },
                                [h(
                                    'div',
                                    { style: { display: 'flex', justifyContent: 'space-around', margin: '0 auto 24px', width: '36px', height: '14px' } },
                                    [self.showWaiting.opacityArray.map(function (item) {
                                        return h('span', {
                                            style: { backgroundColor: '#fff', opacity: item, height: '100%', width: '3px', transform: 'skewX(-15deg)' }
                                        });
                                    })]
                                ), h(
                                    'div',
                                    { style: { color: '#fff', fontSize: '15px' } },
                                    [self.showWaiting.message]
                                )]
                            )]
                        );
                        break;
                    case 'select':
                        var _innerSelect = '';

                        if (self.select.type === 'select') {
                            // 单选
                            _innerSelect = h(
                                vant.RadioGroup,
                                {
                                    props: {
                                        'value': self.select.value
                                    }
                                },
                                [h(vant.CellGroup, [self.select.items.map(function (item) {
                                    var clickEvent = function clickEvent() {
                                        self.select.value = item;
                                        self.selectConfirm();
                                    };

                                    return h(
                                        vant.Cell,
                                        {
                                            props: {
                                                'title': item,
                                                'clickable': true
                                            },
                                            on: {
                                                'click': clickEvent
                                            },

                                            'class': { fontActive: self.select.value === item }
                                        },
                                        [h(vant.Radio, {
                                            attrs: { name: item },
                                            slot: 'right-icon' })]
                                    );
                                })])]
                            );
                        } else if (self.select.type === 'selectMulti') {
                            // 多选
                            _innerSelect = h('div', [h(
                                vant.CheckboxGroup,
                                {
                                    props: {
                                        'value': self.select.value
                                    }
                                },
                                [h(
                                    vant.CellGroup,
                                    { style: { maxHeight: '292px' } },
                                    [self.select.items.map(function (item) {
                                        var clickEvent = function clickEvent() {
                                            var k = self.select.value.indexOf(item);
                                            if (k > -1) {
                                                self.select.value.splice(k, 1);
                                            } else {
                                                self.select.value.push(item);
                                            }
                                        };

                                        return h(
                                            vant.Cell,
                                            {
                                                props: {
                                                    'title': item,
                                                    'clickable': true
                                                },
                                                on: {
                                                    'click': clickEvent
                                                },

                                                'class': { fontActive: self.select.value.indexOf(item) > -1 }
                                            },
                                            [h(vant.Checkbox, {
                                                props: {
                                                    'name': item,
                                                    'shape': 'square'
                                                },
                                                slot: 'right-icon' })]
                                        );
                                    })]
                                )]
                            ), h(
                                'div',
                                { style: { padding: '10px 20px' } },
                                [h(
                                    'div',
                                    {
                                        style: { height: '44px', width: '100%', lineHeight: '44px', color: '#fff', fontSize: '16px', textAlign: 'center', borderRadius: '22px', backgroundColor: '#2463e0' },
                                        on: {
                                            'click': self.selectConfirm
                                        }
                                    },
                                    ['\u786E\u5B9A']
                                )]
                            )]);
                        }

                        innerDOM = h(
                            vant.Popup,
                            {
                                props: {
                                    'value': self.select.show,
                                    'position': 'bottom',
                                    'overlay-style': { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
                                    'close-on-click-overlay': false,
                                    'closeable': self.select.cancelable
                                },
                                attrs: {
                                    id: 'ejs-ui-' + self.select.type
                                },
                                'class': 'ejs-ui-select',
                                on: {
                                    'click-overlay': self.cancel,
                                    'click': self.clickPop
                                }
                            },
                            [h(
                                'h5',
                                { style: { color: '#2e3033', fontSize: '16px', paddingLeft: '20px', height: '44px', lineHeight: '44px', borderBottom: '0.5px solid #ebedf0', marginBottom: '10px' } },
                                [self.select.title]
                            ), _innerSelect]
                        );

                        if (self.select.type === 'selectSingleSP') {
                            // 九宫格
                            var items = [[]];
                            var i = 0;
                            self.select.items.forEach(function (item) {
                                if (items[i].length >= self.select.columns) {
                                    i += 1;
                                    items.push([]);
                                }
                                items[i].push(item);
                            });

                            _innerSelect = h(
                                vant.RadioGroup,
                                {
                                    props: {
                                        'value': self.select.value
                                    }
                                },
                                [h(vant.CellGroup, [items.map(function (item) {
                                    return h(vant.Row, [item.map(function (ele) {
                                        var clickEvent = function clickEvent() {
                                            self.select.value = ele;
                                        };

                                        return h(
                                            vant.Col,
                                            {
                                                props: {
                                                    'span': 24 / self.select.columns
                                                }
                                            },
                                            [h(
                                                vant.Cell,
                                                {
                                                    props: {
                                                        'title': ele,
                                                        'clickable': true
                                                    },
                                                    on: {
                                                        'click': clickEvent
                                                    }
                                                },
                                                [h(vant.Radio, {
                                                    attrs: { name: ele },
                                                    slot: 'right-icon' })]
                                            )]
                                        );
                                    })]);
                                })])]
                            );

                            innerDOM = h(
                                vant.Dialog.Component,
                                {
                                    attrs: {
                                        id: 'ejs-ui-' + self.select.type
                                    },
                                    props: {
                                        'value': self.select.show,
                                        'title': self.select.title,
                                        'show-cancel-button': self.select.cancelable,
                                        'overlay-style': { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
                                    },
                                    on: {
                                        'confirm': self.selectConfirm,
                                        'cancel': self.cancel
                                    }
                                },
                                [_innerSelect]
                            );
                        }
                        break;
                    default:
                        break;
                }

                return h(
                    'div',
                    {
                        attrs: { id: 'ejs-ui' }
                    },
                    [innerDOM]
                );
            },

            watch: {
                'pickDateTime.innerValue': function pickDateTimeInnerValue(val, oldVal) {
                    var minDate = this.pickDateTime.minDate;
                    var maxDate = this.pickDateTime.maxDate;
                    if (this.compareDate(val, minDate) || this.compareDate(val, maxDate) || this.compareDate(oldVal, minDate) || this.compareDate(oldVal, maxDate)) {
                        this.pickDateTime.columns = getColumns(this.pickDateTime.minDate, this.pickDateTime.maxDate, val);
                    }
                },
                type: function type(val) {
                    if (val === 'showWaiting') {
                        this.showWaitingAnimation();
                    }
                }
            },
            methods: {
                conConfirm: function conConfirm() {
                    var result = {
                        which: 1
                    };
                    this.confirm.show = false;
                    this.success(result);
                },
                conCancel: function conCancel() {
                    var result = {
                        which: 0
                    };
                    this.confirm.show = false;
                    this.success(result);
                },
                alertConfirm: function alertConfirm() {
                    this.alert.show = false;
                    this.success({});
                },
                promptConfirm: function promptConfirm() {
                    var result = {
                        which: 1,
                        content: this.prompt.value
                    };
                    this.prompt.show = false;
                    this.success(result);
                },
                promptCancel: function promptCancel() {
                    var result = {
                        which: 0,
                        content: this.prompt.value
                    };
                    this.prompt.show = false;
                    this.success(result);
                },
                promptInput: function promptInput(value) {
                    this.prompt.value = value;
                },
                actionSheetSelect: function actionSheetSelect(item) {
                    var index = this.actionSheet.actions.indexOf(item);
                    var result = {
                        which: index,
                        content: item.name
                    };
                    this.actionSheet.show = false;
                    this.actionSheet.canClose = false;
                    this.success(result);
                },
                pickDateConfirm: function pickDateConfirm(value) {
                    var result = null;
                    var date = new Date(value);
                    var year = date.getFullYear();
                    var month = paddingWith0(date.getMonth() + 1);
                    var day = paddingWith0(date.getDate());
                    if (this.pickDate.type === 'date') {
                        result = {
                            date: year + '-' + month + '-' + day
                        };
                    } else {
                        result = {
                            month: year + '-' + month
                        };
                    }
                    this.pickDate.show = false;
                    this.pickDate.canClose = false;
                    this.success(result);
                },
                pickDateTimeConfirm: function pickDateTimeConfirm(value) {
                    var nyr = value[0].substring(0, 10);
                    var week = value[0].substring(11, 13);
                    var result = {
                        datetime: nyr + ' ' + value[1] + ':' + value[2],
                        week: week
                    };
                    this.pickDateTime.show = false;
                    this.pickDateTime.canClose = false;
                    this.success(result);
                },
                pickDateTimeChange: function pickDateTimeChange(v) {
                    var val = v.getValues();
                    val = val[0].substring(0, 10) + ' ' + val[1] + ':' + val[2];
                    this.pickDateTime.innerValue = new Date(val);
                },
                pickTimeConfirm: function pickTimeConfirm(value) {
                    var result = {
                        time: value
                    };
                    this.pickTime.show = false;
                    this.pickTime.canClose = false;
                    this.success(result);
                },
                popPickerConfirm: function popPickerConfirm(item) {
                    var res = item;
                    if (Array.isArray(item)) {
                        res = item.map(function (element) {
                            return {
                                text: element,
                                value: element
                            };
                        });
                    } else {
                        res = [item];
                    }
                    var result = {
                        items: res
                    };
                    this.popPicker.show = false;
                    this.popPicker.canClose = false;
                    this.success(result);
                },
                selectConfirm: function selectConfirm() {
                    var result = null;
                    var self = this;
                    if (Array.isArray(self.select.value)) {
                        var choiceState = self.select.items.map(function (item) {
                            if (self.select.value.indexOf(item) > -1) {
                                return '1';
                            }
                            return '0';
                        });

                        result = {
                            choiceState: choiceState,
                            choiceContent: this.select.value
                        };
                    } else {
                        var index = self.select.items.indexOf(this.select.value);
                        result = {
                            which: index,
                            content: this.select.value
                        };
                    }

                    this.select.show = false;
                    this.select.canClose = false;

                    this.success(result);
                },
                clickPop: function clickPop(e) {
                    if (e.target.classList.contains('van-popup__close-icon') && this.select.canClose) {
                        this.select.show = false;
                        this.select.canClose = false;
                    }
                },
                cancel: function cancel() {
                    var type = this.type;
                    if (this[type].canClose) {
                        this[type].show = false;
                        this[type].canClose = false;
                    }
                },
                success: function success(result) {
                    this[this.type].success && this[this.type].success(result);
                    this[this.type].resolve && this[this.type].resolve(result);
                },
                compareDate: function compareDate(date1, date2) {
                    if (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()) {
                        return true;
                    } else {
                        return false;
                    }
                },

                showWaitingAnimation: function showWaitingAnimation() {
                    var self = this;
                    var count = 0;
                    var updateArray = function updateArray() {
                        var last = self.showWaiting.opacityArray.pop();
                        self.showWaiting.opacityArray.unshift(last);
                    };
                    var step = function step() {
                        count++;
                        if (count >= 10) {
                            count = 0;
                            updateArray();
                        }

                        if (self.type === 'showWaiting') {
                            requestAnimationFrame(step);
                        }
                    };
                    requestAnimationFrame(step);
                }
            },
            mounted: function mounted() {
                var _this = this;

                var type = this.type;
                this[type].show = true;
                if ('canClose' in this[type]) {
                    setTimeout(function () {
                        _this[type].canClose = true;
                    }, 300);
                }

                if (this.type === 'showWaiting') {
                    this.showWaitingAnimation();
                }
            }
        }).$mount();

        document.body.appendChild(vnode.$el);
        return vnode;
    };

    if (!document.querySelector('#ejs-ui')) {
        Vue.prototype.$ejsUI = createPickDate();
    } else {
        var type = vueData.type;
        Vue.prototype.$ejsUI.type = type;
        Vue.prototype.$ejsUI[type] = vueData[type];
        Vue.prototype.$ejsUI[type].show = true;
        setTimeout(function () {
            Vue.prototype.$ejsUI[type].canClose = true;
        }, 300);
    }

    if (method === 'showWaiting') {
        options.success && options.success();
        resolve && resolve();
    }
}

function uiMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('ui', [{
        namespace: 'toast',
        os: ['h5'],
        defaultParams: {
            message: ''
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'message');
            var options = args[0];
            var resolve = args[1];

            vant.Toast(options.message);
            options.success && options.success();
            resolve && resolve();
        }
    }, {
        namespace: 'showDebugDialog',
        os: ['h5'],
        defaultParams: {
            debugInfo: ''
        },
        runCode: function runCode() {
            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'debugInfo');

            args[0] = {
                title: '',
                message: args[0].debugInfo,
                buttonName: '确定',
                success: args[0].success
            };

            hybridJs.ui.alert.apply(this, args);
        }
    }, {
        namespace: 'alert',
        os: ['h5'],
        defaultParams: {
            title: '',
            message: '',
            buttonName: '确定',
            // 默认可取消
            cancelable: 1
        },
        runCode: function runCode() {
            for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                rest[_key3] = arguments[_key3];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'message', 'title', 'buttonName');
            uiVue(args, 'alert');
        }
    }, {
        namespace: 'confirm',
        os: ['h5'],
        defaultParams: {
            // 这是默认参数，API的每一个参数都应该有一个默认值
            title: '',
            message: '',
            buttonLabels: ['取消', '确定'],
            cancelable: 1
        },
        runCode: function runCode() {
            for (var _len4 = arguments.length, rest = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                rest[_key4] = arguments[_key4];
            }

            // 兼容字符串形式
            var args = rest;

            uiVue(args, 'confirm');
        }
    }, {
        namespace: 'prompt',
        os: ['h5'],
        defaultParams: {
            title: '',
            hint: '',
            text: '',
            lines: 1,
            cancelable: 1,
            maxLength: 10000,
            buttonLabels: ['取消', '确定']
        },
        runCode: function runCode() {
            for (var _len5 = arguments.length, rest = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                rest[_key5] = arguments[_key5];
            }

            // 兼容字符串形式
            var args = rest;

            uiVue(args, 'prompt');
        }
    }, {
        namespace: 'actionSheet',
        os: ['h5'],
        defaultParams: {
            items: []
        },
        runCode: function runCode() {
            for (var _len6 = arguments.length, rest = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                rest[_key6] = arguments[_key6];
            }

            // 兼容字符串形式
            var args = rest;

            uiVue(args, 'actionSheet');
        }
    }, {
        namespace: 'pickDate',
        os: ['h5'],
        defaultParams: {
            // h5中的开始年份
            minDate: '',
            // h5中的结束年份
            maxDate: '',
            // 默认为空为使用当前时间
            // 格式为 yyyy-MM-dd。
            datetime: '',
            title: '选择日期'
        },
        runCode: function runCode() {
            for (var _len7 = arguments.length, rest = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                rest[_key7] = arguments[_key7];
            }

            // 兼容字符串形式
            var args = rest;

            uiVue(args, 'pickDate');
        }
    }, {
        namespace: 'pickTime',
        os: ['h5'],
        defaultParams: {
            // 默认为空为使用当前时间
            // 格式为 hh:mm。
            datetime: '',
            title: '选择时间',
            minHour: 0,
            maxHour: 23,
            minMinute: 0,
            maxMinute: 59
        },
        runCode: function runCode() {
            for (var _len8 = arguments.length, rest = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
                rest[_key8] = arguments[_key8];
            }

            // 兼容字符串形式
            var args = rest;
            uiVue(args, 'pickTime');
        }
    }, {
        namespace: 'pickDateTime',
        os: ['h5'],
        defaultParams: {
            // 默认为空为使用当前时间
            // 格式为 yyyy-MM-dd hh:mm。
            datetime: '',
            // h5中的开始年份
            minDate: '',
            // h5中的结束年份
            maxDate: '',
            title: '选择日期时间'
        },
        runCode: function runCode() {
            for (var _len9 = arguments.length, rest = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
                rest[_key9] = arguments[_key9];
            }

            // 兼容字符串形式
            var args = rest;
            uiVue(args, 'pickDateTime');
        }
    }, {
        namespace: 'pickMonth',
        os: ['h5'],
        defaultParams: {
            // 默认为空为使用当前时间
            // 格式为 yyyy-MM
            datetime: '',
            // h5中的开始年份
            minDate: '',
            // h5中的结束年份
            maxDate: '',
            title: '选择年月'
        },
        runCode: function runCode() {
            for (var _len10 = arguments.length, rest = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
                rest[_key10] = arguments[_key10];
            }

            // 兼容字符串形式
            var args = rest;
            uiVue(args, 'pickMonth');
        }
    }, {
        namespace: 'popPicker',
        os: ['h5'],
        defaultParams: {
            // 层级，默认为1
            layer: 1,
            data: []
        },
        runCode: function runCode() {
            for (var _len11 = arguments.length, rest = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
                rest[_key11] = arguments[_key11];
            }

            // 兼容字符串形式
            var args = rest;
            uiVue(args, 'popPicker');
        }
    }, {
        namespace: 'showWaiting',
        os: ['h5'],
        defaultParams: {
            message: '加载中...',
            padlock: true
        },
        runCode: function runCode() {
            for (var _len12 = arguments.length, rest = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
                rest[_key12] = arguments[_key12];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'message');
            uiVue(args, 'showWaiting');
        }
    }, {
        namespace: 'closeWaiting',
        os: ['h5'],
        runCode: function runCode() {
            for (var _len13 = arguments.length, rest = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
                rest[_key13] = arguments[_key13];
            }

            // 兼容字符串形式
            var args = rest;
            var options = args[0];
            var resolve = args[1];

            if (Vue.prototype.$ejsUI && Vue.prototype.$ejsUI.showWaiting.show) {
                Vue.prototype.$ejsUI.showWaiting.show = false;
                Vue.prototype.$ejsUI.showWaiting.canClose = false;
            }

            options.success && options.success();
            resolve && resolve();
        }
    }, {
        namespace: 'select',
        os: ['h5'],
        defaultParams: {
            title: '',
            items: [],
            choiceState: [],
            // 由以前的true和false替换为了1和0
            isMultiSelect: 0,
            // 样式类型，默认为0。 0：单列表样式；1：九宫格样式(目前只支持单选)
            type: 0,
            columns: 2,
            // 可取消
            cancelable: 1
        },
        runCode: function runCode() {
            for (var _len14 = arguments.length, rest = Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
                rest[_key14] = arguments[_key14];
            }

            // 兼容字符串形式
            var args = rest;
            uiVue(args, 'select');
        }
    }]);
}

function pageMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('page', [{
        namespace: 'open',
        os: ['h5'],
        defaultParams: {
            pageUrl: '',
            // 额外数据
            data: {}
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'pageUrl', 'data');
            var options = args[0];

            // 将额外数据拼接到url中
            options.pageUrl = innerUtil.getFullUrlByParams(options.pageUrl, options.data);

            // f9
            parent.appendIframe(options.pageUrl, options.success);
            // 普通
            // document.location.href = options.pageUrl;
        }
    }, {
        namespace: 'close',
        os: ['h5'],
        runCode: function runCode(params) {
            var options = params;

            // 浏览器退出
            /* if (window.history.length > 1) {
                window.history.back();
            } */
            parent.delIframe(options);
        }
    }, {
        namespace: 'reload',
        os: ['h5'],
        runCode: function runCode() {
            window.location.reload();
        }
    }]);
}

function storageMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('storage', [{
        namespace: 'getItem',
        os: ['h5'],
        defaultParams: {
            // 对应的key
            key: ''
        },
        runCode: function runCode(params, resolve, reject) {
            var options = params;
            var success = options.success;
            var error = options.error;

            if (!innerUtil.isObject(options.key)) {
                options.key = [options.key];
            }

            var keys = options.key;
            var values = {};

            try {
                for (var i = 0, len = keys.length; i < len; i += 1) {
                    var value = localStorage.getItem(keys[i]);

                    values[keys[i]] = value;
                }
            } catch (msg) {
                var err = {
                    code: 0,
                    msg: 'localStorage\u83B7\u53D6\u503C\u51FA\u9519:' + JSON.stringify(keys),
                    result: msg
                };

                error && error(err);
                reject && reject(err);

                return;
            }

            success && success(values);
            resolve && resolve(values);
        }
    }, {
        namespace: 'setItem',
        os: ['h5'],
        runCode: function runCode(params, resolve, reject) {
            var options = params;
            var success = options.success;
            var error = options.error;

            try {
                Object.keys(options).forEach(function (key) {
                    if (key !== 'success' && key !== 'error') {
                        var value = options[key];

                        localStorage.setItem(key, value);
                    }
                });
            } catch (msg) {
                var errorMsg = '';

                if (msg.name === 'QuotaExceededError') {
                    errorMsg = '超出本地存储限额，建议先清除一些无用空间!';
                } else {
                    errorMsg = 'localStorage存储值出错';
                }

                var err = {
                    code: 0,
                    msg: errorMsg,
                    result: msg
                };

                error && error(err);
                reject && reject(err);

                return;
            }

            success && success({});
            resolve && resolve({});
        }
    }, {
        namespace: 'removeItem',
        os: ['h5'],
        defaultParams: {
            // 对应的key
            key: ''
        },
        runCode: function runCode(params, resolve, reject) {
            var options = params;
            var success = options.success;
            var error = options.error;

            if (!innerUtil.isObject(options.key)) {
                options.key = [options.key];
            }

            var keys = options.key;

            try {
                for (var i = 0, len = keys.length; i < len; i += 1) {
                    localStorage.removeItem(keys[i]);
                }
            } catch (msg) {
                var err = {
                    code: 0,
                    msg: 'localStorage\u79FB\u9664\u503C\u51FA\u9519:' + JSON.stringify(keys),
                    result: msg
                };

                error && error(err);
                reject && reject(err);

                return;
            }

            success && success({});
            resolve && resolve({});
        }
    }]);
}

function deviceMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('device', [{
        namespace: 'callPhone',
        os: ['h5'],
        defaultParams: {
            phoneNum: ''
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'phoneNum');
            var phoneNum = args[0].phoneNum;

            window.location.href = 'tel:' + phoneNum;
        }
    }, {
        namespace: 'sendMsg',
        os: ['h5'],
        defaultParams: {
            phoneNum: '',
            message: ''
        },
        runCode: function runCode() {
            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'phoneNum', 'message');
            var phoneNum = args[0].phoneNum;
            var message = args[0].message;

            window.location.href = 'sms:' + phoneNum + '?body=' + message;
        }
    }, {
        namespace: 'sendMail',
        os: ['h5'],
        defaultParams: {
            mail: '',
            subject: '',
            cc: ''
        },
        runCode: function runCode() {
            for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                rest[_key3] = arguments[_key3];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'mail', 'subject', 'cc');
            var mail = args[0].mail;
            var subject = args[0].subject;
            var cc = args[0].cc;

            window.location.href = 'mailto:' + mail + '?subject=' + subject + '&cc=' + cc;
        }
    }]);
}

var parseHtml = function parseHtml(strHtml) {
    if (!strHtml || typeof strHtml !== 'string') {
        return null;
    }
    // 创一个灵活的div
    var a = document.createElement('div');
    var b = document.createDocumentFragment();

    a.innerHTML = strHtml;

    var i = a.firstChild;
    b.appendChild(i);

    return b;
};
var choposeOnce = 0;
var commonClassName = function commonClassName(cb) {
    if (choposeOnce === 0) {
        choposeOnce = 1;
        document.querySelector('html').insertAdjacentHTML('beforeend', '\n        <style>\n        body {\n            overflow: hidden;\n        }\n        .ejs-contact-content {\n        position: absolute;\n        width: 100%;\n        top: 0;\n        bottom: 0;\n        height: 100%;\n        z-index: 99;\n        background: #fff;\n        overflow: hidden;\n    }\n    .ejs-choose-ul:after {\n        display:none\n    }\n    .ejs-choose-ul {\n        margin-top: 10px;\n        overflow: scroll;\n        height: 100%;\n        padding-bottom: 44px;\n    }\n    .ejs-choose-ul .ejs-choose-li label {\n        padding: 11px 0;\n    }\n    .ejs-choose-ul .ejs-choose-li {\n        padding: 0 15px;\n    }\n    .ejs-contact-bottom {\n        position: absolute;\n        bottom: 0;\n        height: 44px;\n        border-top: 1px solid #eee;\n        width: 100%;\n        background: #fff;\n    }\n    .ejs-contact-bottom  button {\n        float: right;\n        margin-right: 10px;\n        margin-top: 5px;\n        background-color: #3c80e6;\n        color:#fff;\n        width: 90px;\n        border-radius: 5px;\n    }\n    .ejs-hidden {\n        overflow: hidden;\n        height: 100vh;\n    }\n\n\n    .ejs-choose-li {\n        position: relative;\n        overflow: hidden;\n        padding: 11px 15px;\n        -webkit-touch-callout: none;\n    }\n\n    .ejs-choose-li:after {\n        position: absolute;\n        right: 0;\n        bottom: 0;\n        left: 15px;\n        height: 1px;\n        content: \'\';\n        -webkit-transform: scaleY(.5);\n        transform: scaleY(.5);\n        background-color: #c8c7cc;\n    }\n\n    .ejs-choose-li.mui-radio input[type=radio],\n    .ejs-choose-li.mui-checkbox input[type=checkbox] {\n        top: 8px;\n    }\n\n    .ejs-choose-li.mui-radio.mui-left,\n    .ejs-choose-li.mui-checkbox.mui-left {\n        padding-left: 58px;\n    }\n\n    .ejs-choose-li.mui-active {\n        background-color: #eee;\n    }\n\n    .ejs-choose-li:last-child:before,\n    .ejs-choose-li:last-child:after {\n        height: 0;\n    }\n\n    .ejs-choose-li>a:not(.mui-btn) {\n        position: relative;\n        display: block;\n        overflow: hidden;\n        margin: -11px -15px;\n        padding: inherit;\n        white-space: nowrap;\n        text-overflow: ellipsis;\n        color: inherit;\n        /*&:active {\n        background-color: #eee;\n    }*/\n    }\n\n    .ejs-choose-li>a:not(.mui-btn).mui-active {\n        background-color: #eee;\n    }\n\n    .ejs-choose-li p {\n        margin-bottom: 0;\n    }\n\n    .ejs-choose-li.mui-transitioning>.mui-slider-handle,\n    .ejs-choose-li.mui-transitioning>.mui-slider-left .mui-btn,\n    .ejs-choose-li.mui-transitioning>.mui-slider-right .mui-btn {\n        -webkit-transition: -webkit-transform 300ms ease;\n        transition: transform 300ms ease;\n    }\n\n    .ejs-choose-li.mui-active>.mui-slider-handle {\n        background-color: #eee;\n    }\n\n    .ejs-choose-li>.mui-slider-handle {\n        position: relative;\n        background-color: #fff;\n    }\n\n    .ejs-choose-li>.mui-slider-handle.mui-navigate-right:after,\n    .ejs-choose-li>.mui-slider-handle .mui-navigate-right:after {\n        right: 0;\n    }\n\n    .ejs-choose-li>.mui-slider-handle,\n    .ejs-choose-li>.mui-slider-left .mui-btn,\n    .ejs-choose-li>.mui-slider-right .mui-btn {\n        -webkit-transition: -webkit-transform 0ms ease;\n        transition: transform 0ms ease;\n    }\n\n    .ejs-choose-li>.mui-slider-left,\n    .ejs-choose-li>.mui-slider-right {\n        position: absolute;\n        top: 0;\n        display: -webkit-box;\n        display: -webkit-flex;\n        display: flex;\n        height: 100%;\n    }\n\n    .ejs-choose-li>.mui-slider-left>.mui-btn,\n    .ejs-choose-li>.mui-slider-right>.mui-btn {\n        position: relative;\n        left: 0;\n        display: -webkit-box;\n        display: -webkit-flex;\n        display: flex;\n        padding: 0 30px;\n        color: #fff;\n        border: 0;\n        border-radius: 0;\n        -webkit-box-align: center;\n        -webkit-align-items: center;\n        align-items: center;\n    }\n\n    .ejs-choose-li>.mui-slider-left>.mui-btn:after,\n    .ejs-choose-li>.mui-slider-right>.mui-btn:after {\n        position: absolute;\n        z-index: -1;\n        top: 0;\n        width: 600%;\n        height: 100%;\n        content: \'\';\n        background: inherit;\n    }\n\n    .ejs-choose-li>.mui-slider-left>.mui-btn.mui-icon,\n    .ejs-choose-li>.mui-slider-right>.mui-btn.mui-icon {\n        font-size: 30px;\n    }\n\n    .ejs-choose-li>.mui-slider-right {\n        right: 0;\n        -webkit-transition: -webkit-transform 0ms ease;\n        transition: transform 0ms ease;\n        -webkit-transform: translateX(100%);\n        transform: translateX(100%);\n    }\n\n    .ejs-choose-li>.mui-slider-left {\n        left: 0;\n        -webkit-transition: -webkit-transform 0ms ease;\n        transition: transform 0ms ease;\n        -webkit-transform: translateX(-100%);\n        transform: translateX(-100%);\n    }\n\n    .ejs-choose-li>.mui-slider-left>.mui-btn:after {\n        right: 100%;\n        margin-right: -1px;\n    }\n    .ejs-choose-li>.mui-btn,\n    .ejs-choose-li>.mui-badge,\n    .ejs-choose-li>.mui-switch,\n    .ejs-choose-li>a>.mui-btn,\n    .ejs-choose-li>a>.mui-badge,\n    .ejs-choose-li>a>.mui-switch {\n        position: absolute;\n        top: 50%;\n        right: 15px;\n        -webkit-transform: translateY(-50%);\n        transform: translateY(-50%);\n    }\n    .ejs-f9-content .ejs-choose-ul .mui-badge {\n        font-size: 12px;\n        line-height: 1;\n        display: inline-block;\n        padding: 3px 6px;\n        border-radius: 100px;\n        width:auto;\n    }\n        </style>');

        cb && cb();
    } else {
        cb && cb();
    }
};
var contactDom = function contactDom(cb) {
    commonClassName(function () {
        var f9Div = document.querySelector('.ejs-f9-content');
        if (!f9Div) {
            console.error('缺少ejs-f9-content样式，请在需要调试ejs的页面body加入class="ejs-f9-content"');

            return;
        }
        var divNav = '<div class="ejs-contact-content">\n        <ul class="mui-table-view">\n            <li class="mui-table-view-cell">\u7EC4\u7EC7\u67B6\u6784</li>\n        </ul>\n\n        <ul class="mui-table-view ejs-choose-ul"></ul>\n        <div class="ejs-contact-bottom">\n            <button>\u786E\u5B9A</button>\n        </div>\n    </div>';

        f9Div.insertBefore(parseHtml(divNav), f9Div.childNodes[0]);
        cb && cb();
    });
};
var resultUser = [];
var viewli = function viewli(arr, selectedusers) {
    var chooseUl = document.querySelector('.ejs-choose-ul');
    var contactLi = '';
    chooseUl.innerHTML = '';
    arr.forEach(function (e) {
        // 渲染部门
        if (e.iconCls === 'mini-tree-folder') {
            contactLi += '<li class="ejs-choose-li mui-input-row  mui-checkbox  mui-left"\n            fullPath="' + e.fullPath + '"\n            textCls="' + e.textCls + '"\n            pid="' + e.pid + '"\n            ckr="' + e.ckr + '"\n            isLeaf="' + e.isLeaf + '"\n            tableName="' + e.tableName + '"\n            objectcode="' + e.objectcode + '"\n            path="' + e.path + '"\n            expanded="' + e.expanded + '"\n            isSubNode="' + e.isSubNode + '"\n            titleExtra="' + e.titleExtra + '"\n            checked="' + e.checked + '"\n            ouguid="' + e.id + '"\n            text="' + e.text + '"\n            >\n                <label class="ejs-chontact-label">' + e.text + '</label>\n                <input class="mui-hidden" name="checkbox1" value="Item 1" type="checkbox" ' + (e.checked === true ? 'checked' : '') + '>\n                <span class="mui-badge mui-badge-primary">\u90E8\u95E8</span>\n            </li>';
        } else {
            selectedusers && selectedusers.forEach(function (item) {
                if (item.userguid === e.id) {
                    e.checked = true;
                }
            });
            /* if (e.checked) {
                resultUser.push({
                    username: e.text || '',
                    loginid: e.loginid || '',
                    sequenceid: e.sequenceid || '',
                    photourl: e.photourl || '',
                    displayname: e.text || '',
                    title: e.title || '',
                    baseouname: e.baseouname || '',
                    ccworksequenceid: e.ccworksequenceid || '',
                    userguid: e.id || '',
                    ordernumber: e.ordernumber || '',
                });
            } */
            // 渲染人员列表
            contactLi += '<li class="ejs-choose-li mui-input-row mui-checkbox  mui-left"\n            loginid="' + e.loginid + '"\n            sequenceid="' + e.sequenceid + '"\n            photourl="' + e.photourl + '"\n            displayname="' + e.text + '"\n            username="' + e.text + '"\n            title="' + e.title + '"\n            baseouname="' + e.baseouname + '"\n            ccworksequenceid="' + e.ccworksequenceid + '"\n            userguid="' + e.id + '"\n            ordernumber="' + e.ordernumber + '"\n            >\n                <label class="ejs-chontact-label" for=' + e.id + '>' + e.text + '</label>\n                <input name="checkbox1" value="Item 1" type="checkbox" ' + (e.checked === true ? 'checked' : '') + '>\n                <span class="mui-badge">\u4EBA\u5458</span>\n            </li>';
        }
    });
    chooseUl.insertAdjacentHTML('afterbegin', contactLi);
};
var listenBack = function listenBack() {
    var state = {
        title: '选人',
        url: '#choose' // 这个url可以随便填，只是为了不让浏览器显示的url地址发生变化，对页面其实无影响
    };
    window.history.pushState(state, state.title, state.url);
    window.addEventListener('popstate', function () {
        document.querySelector('.mui-content').classList.remove('ejs-hidden');
        document.querySelector('.ejs-contact-content') && document.querySelector('.ejs-contact-content').remove();
    }, false);
};

var formdataRoot = new FormData();
var invokePluginApi = function (opt, cb) {
    if (opt.path === 'workplatform.provider.openNewPage' && opt.dataMap.method === 'goSelectPerson') {
        contactDom(function () {
            listenBack();
            resultUser = [];

            if (opt.dataMap.selectedusers && opt.dataMap.selectedusers.length > 0) {
                resultUser = opt.dataMap.selectedusers;
            }
            document.querySelector('.mui-content').classList.add('ejs-hidden');
            // console.log(opt.f9userdata);
            if (opt.f9userdata) {
                viewli(opt.f9userdata, opt.dataMap.selectedusers);
            } else {
                formdataRoot.append('commonDto', JSON.stringify([{
                    id: opt.f9controlid,
                    url: epm.getRightUrl(epm.dealUrl(opt.f9action, true)),
                    type: 'treeselect-non-nested',
                    action: opt.f9action,
                    idField: 'id',
                    textField: 'text',
                    imgField: 'img',
                    iconField: 'iconCls',
                    parentField: 'pid',
                    valueField: 'id',
                    pinyinField: 'tag',
                    value: '',
                    text: '',
                    isSecondRequest: true
                }]));
                Util.ajax({
                    url: epm.getRightUrl(epm.dealUrl(opt.f9action, true)), // opt.f9action,
                    type: 'post',
                    // dataType: 'json',
                    data: formdataRoot,
                    processData: false,
                    contentType: false,
                    success: function success(data) {
                        viewli(data.controls[0].data, opt.dataMap.selectedusers);
                    },
                    complete: function complete() {
                        /* if (!opts.notShowLoading) {
                            epm.hideMask();
                        } */
                    }
                });
            }
            mui('.ejs-contact-content').on('click', '.ejs-choose-li input', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
            mui('.ejs-contact-content').off('click', '.ejs-choose-li');
            // eslint-disable-next-line func-names
            mui('.ejs-contact-content').on('click', '.ejs-choose-li', function () {
                var liNode = this;
                var ouguid = liNode.getAttribute('ouguid');
                // 如果点击是部门，渲染展开数组
                var formdata = new FormData();
                if (ouguid) {
                    var nodeData = {
                        fullPath: liNode.getAttribute('fullPath'),
                        textCls: liNode.getAttribute('textCls'),
                        pid: liNode.getAttribute('pid'),
                        ckr: liNode.getAttribute('ckr'),
                        isLeaf: liNode.getAttribute('isLeaf'),
                        tableName: liNode.getAttribute('tableName'),
                        objectcode: liNode.getAttribute('objectcode'),
                        path: liNode.getAttribute('path'),
                        expanded: liNode.getAttribute('expanded'),
                        isSubNode: liNode.getAttribute('isSubNode'),
                        titleExtra: liNode.getAttribute('titleExtra'),
                        checked: liNode.getAttribute('checked'),
                        id: liNode.getAttribute('ouguid'),
                        text: liNode.getAttribute('text')
                    };
                    // 工作流选人不走这边
                    if (opt.f9userdata) {
                        var params = epm.get(opt.f9controlid).getModule();

                        params.node = nodeData;
                        params.isSecondRequest = true;
                        params.checkRecursive = true;
                        formdata.set('commonDto', JSON.stringify([params]));
                    } else {
                        formdata.set('commonDto', JSON.stringify([{
                            id: opt.f9controlid,
                            url: epm.getRightUrl(epm.dealUrl(opt.f9action, true)),
                            type: 'treeselect-non-nested',
                            action: opt.f9action,
                            idField: 'id',
                            textField: 'text',
                            imgField: 'img',
                            iconField: 'iconCls',
                            parentField: 'pid',
                            valueField: 'id',
                            pinyinField: 'tag',
                            value: '',
                            text: '',
                            isSecondRequest: true,
                            node: nodeData
                        }]));
                    }
                    Util.ajax({
                        url: epm.getRightUrl(epm.dealUrl(opt.f9action, true)), // opt.f9action,
                        type: 'post',
                        // dataType: 'json',
                        data: formdata,
                        processData: false,
                        contentType: false,
                        success: function success(data) {
                            viewli(data.controls[0].data, opt.dataMap.selectedusers);
                        },
                        complete: function complete() {
                            /* if (!opts.notShowLoading) {
                                epm.hideMask();
                            } */
                        }
                    });
                } else {
                    // console.log(liNode.querySelector('input').checked);

                    if (!liNode.querySelector('input').checked) {
                        resultUser.push({
                            username: liNode.getAttribute('username') || '',
                            loginid: liNode.getAttribute('loginid') || '',
                            sequenceid: liNode.getAttribute('sequenceid') || '',
                            photourl: liNode.getAttribute('photourl') || '',
                            displayname: liNode.getAttribute('displayname') || '',
                            title: liNode.getAttribute('title') || '',
                            baseouname: liNode.getAttribute('baseouname') || '',
                            ccworksequenceid: liNode.getAttribute('ccworksequenceid') || '',
                            userguid: liNode.getAttribute('userguid') || '',
                            ordernumber: liNode.getAttribute('ordernumber') || ''
                        });
                    } else {
                        resultUser = resultUser.filter(function (e) {
                            return e.userguid !== liNode.getAttribute('userguid');
                        });
                    }

                    this.querySelector('input').checked = !this.querySelector('input').checked;
                }
            });
            mui('.ejs-contact-bottom').off('click', 'button');
            mui('.ejs-contact-bottom').on('click', 'button', function () {
                history.go(-1);

                cb && cb({
                    resultData: resultUser,
                    grouipData: [],
                    talkData: []
                });
            });
        });
    }
};

function utilMixin(hybrid) {
    var hybridJs = hybrid;

    hybridJs.extendModule('util', [{
        namespace: 'encrypt',
        os: ['h5'],
        defaultParams: {
            type: '1',
            keys: [],
            text: ''
        },
        runCode: function runCode(params, resolve, reject) {
            var options = params;
            var success = options.success;
            var error = options.error;

            if (!options.text) {
                var err = {
                    code: 0,
                    msg: '需要加密的字符串不存在'
                };

                error && error(err);
                reject && reject(err);

                return;
            }
            if (options.type === '0') {
                var _result = {
                    text: options.text
                };
                success && success(_result);
                resolve && resolve(_result);

                return;
            }
            if (!options.keys || options.keys.length !== 2) {
                var _err = {
                    code: 0,
                    msg: 'H5encrypt加密需要正确传参keys数组'
                };

                error && error(_err);
                reject && reject(_err);

                return;
            }
            var key = options.keys[0];
            var iv = options.keys[1];
            var message = options.text;
            var result = void 0;
            try {
                var ciphertext = CryptoJS.AES.encrypt(message, CryptoJS.enc.Utf8.parse(key), {
                    iv: CryptoJS.enc.Utf8.parse(iv),
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });
                var encryptText = CryptoJS.enc.Base64.stringify(ciphertext.ciphertext);
                result = {
                    text: encryptText
                };
            } catch (msg) {
                var errorMsg = 'CryptoJS加密失败，H5加密需要引入aes.js文件库';

                var _err2 = {
                    code: 0,
                    msg: errorMsg,
                    result: msg
                };

                error && error(_err2);
                reject && reject(_err2);

                return;
            }
            success && success(result);
            resolve && resolve(result);
        }
    }, {
        namespace: 'invokePluginApi',
        os: ['h5'],
        support: '3.2.0',
        defaultParams: {
            path: '',
            dataMap: ''
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            var args = rest;
            var options = args[0];
            var resolve = args[1];

            invokePluginApi(options, function (result) {
                options.success && options.success(result);
                resolve && resolve(result);
            });
        }
    }]);
}

var parseHtml$1 = function parseHtml(strHtml) {
    if (!strHtml || typeof strHtml !== 'string') {
        return null;
    }
    // 创一个灵活的div
    var a = document.createElement('div');
    var b = document.createDocumentFragment();

    a.innerHTML = strHtml;

    var i = a.firstChild;
    b.appendChild(i);

    return b;
};
var once = 0;
var commonClassName$1 = function commonClassName(cb) {
    if (once === 0) {
        once = 1;
        document.querySelector('html').insertAdjacentHTML('beforeend', '\n        <style>\n        .mui-bar-nav~.mui-content {\n            padding-top: 0px;\n            margin-top: 44px;\n        }\n        .mui-focusin>.mui-bar-nav,\n        .mui-focusin>.mui-bar-header-secondary {\n            position: fixed;\n        }\n        .ejs-tab {\n            border: 1px solid #3c80e6;\n            border-radius: 20px;\n            width: 100px;\n        }\n        .ejs-tab0 {\n            margin-right: -12px;\n        }\n        .ejs-tab1 {\n            margin-left: -12px;\n        }\n        .ejs-tab-active{\n            background: #3c80e6;\n                color: #fff;\n                z-index: 9;\n        }\n        .ejs-f9-content #header {\n            padding-right: 0px;\n        }\n        .ejs-f9-content #header .ejs-right-a-0,\n        .ejs-f9-content #header .ejs-right-a-1 {\n            font-size: 14px;\n            line-height: 44px;\n            color: #007aff;\n            min-width: 44px;\n            min-height: 44px;\n            background-size: auto 35px;\n            background-position: 50%,50%;\n            background-repeat: no-repeat;\n            z-index: 9;\n            position: relative;\n            text-align: center;\n        }\n        .ejs-f9-content #header .ejs-right-a-1 {\n            margin-right: 0px;\n        }\n        </style>');
        var f9Div = document.querySelector('.ejs-f9-content');
        if (!f9Div) {
            console.error('缺少ejs-f9-content样式，请在需要调试ejs的页面body加入class="ejs-f9-content"');

            return;
        }
        document.querySelector('header#header') && document.querySelector('header#header').remove();
        var divNav = '<header id="header" class="mui-bar mui-bar-nav ">\n                            <a class="ejs-action-back mui-icon mui-icon-left-nav  mui-pull-left ' + (Util.os.dd ? 'mui-hidden' : '') + '"></a>\n                            <span id="title" class="mui-title">\n                                <div class="ejs-title">' + document.title + '</div>\n                                <div class="ejs-sub-title"></div>\n                            </span>\n                            <a id="info" class="mui-pull-right mui-hidden ejs-right-a-0"></a>\n                            <a id="info" class="mui-pull-right mui-hidden ejs-right-a-1"></a>\n                        </header>';

        f9Div.insertBefore(parseHtml$1(divNav), f9Div.childNodes[0]);
        cb && cb();
    } else {
        cb && cb();
    }
};
var hasNavDiv = function hasNavDiv(cb) {
    commonClassName$1(function () {
        mui('.ejs-f9-content').on('click', '.ejs-action-back', function () {
            parent.delIframe();
        });
        cb && cb();
    });
};

function setTitle(opt) {
    hasNavDiv(function () {
        var titleDiv = document.querySelector('.ejs-title');
        var subTitleDiv = document.querySelector('.ejs-sub-title');

        document.querySelector('.mui-bar .mui-title .ejs-title').innerText = opt.title;
        if (opt.subTitle) {
            document.querySelector('.mui-bar .mui-title .ejs-sub-title').innerText = opt.subTitle;
            titleDiv.style.height = '30px';
            titleDiv.style.lineHeight = '30px';
            subTitleDiv.style.height = '14px';
            subTitleDiv.style.lineHeight = '14px';
            subTitleDiv.style.fontSize = '16px';
        } else {
            document.querySelector('.mui-bar .mui-title .ejs-sub-title').innerText = '';
            titleDiv.style.height = '';
            titleDiv.style.lineHeight = '';
            subTitleDiv.style.height = '0';
            subTitleDiv.style.lineHeight = '';
            subTitleDiv.style.fontSize = '';
        }
    });
}

function setMultiTitle(opt, cb) {
    hasNavDiv(function () {
        var tab0 = opt.titles[0];
        var tab1 = opt.titles[1];
        var titleDiv = document.querySelector('.mui-title');
        titleDiv.style.display = 'flex';
        titleDiv.style.justifyContent = 'center';
        titleDiv.style.height = '44px';
        titleDiv.style.alignItems = 'center';
        var multDiv = '\n        <button class="ejs-tab ejs-tab0 ejs-tab-active">' + tab0 + '</button>\n        <button class="ejs-tab ejs-tab1">' + tab1 + '</button>';
        document.querySelector('.mui-title').innerHTML = multDiv;
        var callback = function callback(num) {
            cb && cb({
                which: num
            });
        };
        mui('#header').off('click', '.ejs-tab');
        mui('#header').on('click', '.ejs-tab', function (el) {
            document.querySelector('.ejs-tab-active').classList.remove('ejs-tab-active');
            el.target.classList.add('ejs-tab-active');
            if (el.target.classList.contains('ejs-tab0')) {
                callback(0);
            } else {
                callback(1);
            }
        });
    });
}

function setRightBtn(opt, cb) {
    hasNavDiv(function () {
        var text = opt.text;
        var imageUrl = opt.imageUrl;
        var isShow = opt.isShow;
        var which = opt.which;
        var textleDiv = document.querySelector('.ejs-right-a-' + which);
        if (isShow === 1) {
            textleDiv.classList.remove('mui-hidden');
            if (!imageUrl) {
                textleDiv.innerText = text;
                textleDiv.style.backgroundImage = '';
            } else {
                textleDiv.innerText = '';
                textleDiv.style.backgroundImage = 'url(' + imageUrl + ')';
            }
        } else {
            textleDiv.classList.add('mui-hidden');
        }

        var callback = function callback(num) {
            cb && cb({
                which: num
            });
        };
        mui('#header').off('click', '.ejs-right-a-' + which);
        mui('#header').on('click', '.ejs-right-a-' + which, function () {
            callback(which);
        });
    });
}

function pageMixin$1(hybrid) {
    var hybridJs = hybrid;

    hybridJs.extendModule('navigator', [{
        namespace: 'setTitle',
        os: ['h5'],
        defaultParams: {
            title: '',
            // 子标题
            subTitle: '',
            // 是否可点击，可点击时会有点击效果并且点击后会触发回调，不可点击时永远不会触发回调
            // 可点击时，title会有下拉箭头
            // promise调用时和其他长期回调一样立马then
            direction: 'bottom',
            // 是否可点击，如果为1，代表可点击，会在标题右侧出现一个下拉图标，并且能被点击监听
            clickable: 0
        },
        runCode: function runCode() {
            var innerUtil = hybridJs.innerUtil;
            // 兼容字符串形式

            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'title');
            var options = args[0];
            var resolve = args[1];

            setTitle(options);
            options.success && options.success({});
            resolve && resolve({});
        }
    }, {
        namespace: 'setMultiTitle',
        os: ['h5'],
        defaultParams: {
            titles: ''
        },
        runCode: function runCode() {
            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            var args = rest;
            var options = args[0];
            var resolve = args[1];

            setMultiTitle(options, function (result) {
                options.success && options.success(result);
                resolve && resolve(result);
            });
        }
    }, {
        namespace: 'setRightBtn',
        os: ['h5'],
        defaultParams: {
            text: '',
            imageUrl: '',
            isShow: 1,
            // 对应哪一个按钮，一般是0, 1可选择
            which: 0
        },
        runCode: function runCode() {
            for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                rest[_key3] = arguments[_key3];
            }

            var args = rest;
            var options = args[0];
            var resolve = args[1];

            setRightBtn(options, function (result) {
                options.success && options.success(result);
                resolve && resolve(result);
            });
        }
    }]);
}

function authMixin(hybrid) {
    var hybridJs = hybrid;

    hybridJs.extendModule('auth', [{
        namespace: 'getUserInfo',
        os: ['h5'],
        runCode: function runCode() {
            var innerUtil = hybridJs.innerUtil;
            // 兼容字符串形式

            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'title');
            var options = args[0];
            var resolve = args[1];
            Util.ajax({
                url: Util.getProjectBasePath('') + 'rest/frame/getuserinfo_guid_v7',
                contentType: 'application/x-www-form-urlencoded',
                type: 'POST',
                data: {
                    params: JSON.stringify({})
                },
                success: function success(result) {
                    var userInfo = {
                        userInfo: JSON.stringify(result.custom)
                    };
                    options.success && options.success(userInfo);
                    resolve && resolve(userInfo);
                },
                error: function error(err) {
                    console.log(err);
                }
            });
        }
    }]);
}

var hybridJs = window.ejs;

uiMixin(hybridJs);
authMixin(hybridJs);
pageMixin(hybridJs);
storageMixin(hybridJs);
deviceMixin(hybridJs);
utilMixin(hybridJs);
pageMixin$1(hybridJs);

})));
