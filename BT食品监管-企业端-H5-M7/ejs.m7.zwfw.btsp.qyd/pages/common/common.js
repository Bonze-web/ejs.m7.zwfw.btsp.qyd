/**
 * 作者: 沈凡琪
 * 创建时间: 2019/01/15
 * 版本: [1.0, 2019/01/15 ]
 * 版权: 江苏国泰新点软件有限公司
 * 描述: 自定义通用工具
 */
'use strict';

var common =
    window.common ||
    (function (exports) {
        /**
         * commonAjax 通用ajax请求
         * @param {Function} callback 回调
         */
        exports.commonAjax = function (url, data, callback) {
            console.log(JSON.stringify(data));
            Util.ejs.ui.showWaiting();
            Util.ajax({
                url: url,
                data: JSON.stringify(data),
                type: 'POST',
                contentType: 'application/json',
                success: function (response) {
                    Util.ejs.ui.closeWaiting();
                    if (response.status.code != '200') {
                        Util.ejs.ui.toast(response.status.text);
                        return;
                    }
                    if (response.custom.code != '1') {
                        Util.ejs.ui.toast(response.custom.text);
                        return;
                    }

                    return callback(response) && callback;
                },
                error: function (error) {
                    Util.ejs.ui.closeWaiting();
                    Util.ejs.ui.toast('error' + JSON.stringify(error));
                }
            });
        };
        /**
         * @description ajax 二次封装函数
         * @param {Object} paramsData 请求参数
         * @param {Object} successCallback 成功回调
         * @param {Object} errorCallback 失败回调
         * @param {Object} options 配置项
         */
        exports.ajax = function (paramsData, successCallback, errorCallback, options) {
            // object是规范的数据格式，string是不规范的数据格式
            if (typeof paramsData.data === 'string') {
                var data = paramsData.data;
            } else {
                var data = {
                    params: JSON.stringify(paramsData.data)
                };
            }

            // 开启调试
            if (options.isDebug) {
                console.log(
                    'RESTful参数：\n' +
                    Config.serverOA9Url +
                    paramsData.url +
                    '\n' +
                    JSON.stringify({
                        params: paramsData.data
                    }) +
                    '\n'
                );
            }
            // 考虑到网络不佳情况下，业务是否手动显示加载进度条
            if (paramsData.isShowWaiting) {
                ejs.ui.showWaiting();
            }
            switch (options.url) {
                case 'oa8':
                    var url = Config.serverUrl + 'oacustomer_v7/' + paramsData.url;

                    break;
                case 'oa9':
                    var url = Config.normalUrl + 'frame9_v7/' + paramsData.url;
                    break;
                case 'ztbdev':
                    var url = Config.serverUrl + 'Dev2OAWebService/OAWebService/' + paramsData.url;


                    break;
                case 'fdoc':
                    // ejs.ui.toast(Config.serverUrl);
                    var url = Config.serverUrl + 'knowledge_v7/' + paramsData.url;

                    break;
                case 'swdoc':
                    // ejs.ui.toast(Config.serverUrl);
                    var url = Config.serverUrl + 'EpointSWDocs_v7/' + paramsData.url;

                    break;
                case 'complaint':
                    // ejs.ui.toast(Config.serverUrl);
                    var url = Config.complaint + paramsData.url;

                    break;
                case 'devnew':
                    // ejs.ui.toast(Config.serverUrl);
                    var url = Config.devnew + 'rest/frame/' + paramsData.url;

                    break;
                // 固定资产系统
                case 'assetsmanage':
                    // ejs.ui.toast(Config.serverUrl);
                    var url = Config.assetsmanage + 'rest/frame/' + paramsData.url;

                    break;
                // 虚拟数字工厂
                case 'digitalfactory9':
                    // ejs.ui.toast(Config.serverUrl);
                    var url = Config.digitalfactory9 + 'rest/frame/' + paramsData.url;

                    break;
                default:
                    var url = /http/.test(paramsData.url) ? paramsData.url : Config.serverOA9Url + paramsData.url;
            }
            var ajaxBody = {
                // 兼容个性化接口地址传入
                url: url,
                contentType: 'application/x-www-form-urlencoded',
                data: data,
                timeout: 30000,
                dataPath: paramsData.dataPath,
                success: function (result) {
                    // 考虑到网络不佳情况下，业务是否手动显示加载进度条
                    if (paramsData.isShowWaiting) {
                        ejs.ui.closeWaiting();
                    }
                    if (options.isDebug) {
                        console.log('RESTful返回值：\n' + JSON.stringify(result) + '\n');
                    }
                    // 执行外部回调
                    typeof successCallback === 'function' && successCallback
                        ? successCallback(result)
                        : 'that is not function!';
                },
                error: function (error) {
                    // 考虑到网络不佳情况下，业务是否手动显示加载进度条
                    if (paramsData.isShowWaiting) {
                        ejs.ui.closeWaiting();
                    }
                    // 开启调试
                    if (options.isDebug) {
                        console.log('RESTful错误返回值：\n' + JSON.stringify(error) + '\n');
                    }
                    errorCallback && errorCallback(error);
                    // 执行外部回调
                    // (typeof (errorCallback) == "function" && errorCallback) ? errorCallback(JSON.stringify(error)): "that is not function!"
                }
            };

            // 发送请求
            Util.ajax(ajaxBody);
        };
        /*
         * 日期格式转换
         */
        exports.transferDate = function (date) {
            // 年
            var year = date.getFullYear();
            // 月
            var month = date.getMonth() + 1;
            // 日
            var day = date.getDate();

            if (month >= 1 && month <= 9) {
                month = '0' + month;
            }
            if (day >= 0 && day <= 9) {
                day = '0' + day;
            }

            var dateString = year + '-' + month + '-' + day;

            return dateString;
        };
        /*
         * 获取token
         */
        exports.getToken = function (callbck) {
            Util.ajax({
                url: url,
                data: JSON.stringify({}),
                type: 'POST',
                contentType: 'application/json;charset=UTF-8',
                success: function (response) {
                    if (response.status.Code != 200) {
                        Util.ejs.ui.toast(response.status.text);
                        return;
                    }
                    if (response.custom.code != '1') {
                        Util.ejs.ui.toast(response.custom.text);
                        return;
                    }

                    return callback(response) && callback;
                },
                error: function (error) {
                    Util.ejs.ui.closeWaiting();
                    Util.ejs.ui.toast('error' + JSON.stringify(error));
                }
            });
        };
        //处理姓名
        exports.handleName = function (str) {
            var _str_Start = str[str.length - 1]; // 最后一个字符
            var star = '';
            for (var i = 0; i < str.length - 1; i++) {
                star += '*';
            }
            var _str_Res = star + _str_Start;
            if (str == '') {
                _str_Res = '';
            }
            return _str_Res;
        };

        //处理身份证
        exports.handleId = function (str) {
            var _str_Start = str.substr(0, 1);
            var _str_End = str.substr(17, 1);
            var _ss = function () {
                var s = '';
                for (var i = 0; i < str.length - 2; i++) s += '*';
                return s;
            };
            var _str_Res = _str_Start + _ss() + _str_End;
            if (str == '') {
                _str_Res = '';
            }
            return _str_Res;
        };

        //处理手机号
        exports.handlePhone = function (str) {
            var _str_Start = str.substr(0, 3);
            var _str_End = str.substr(7, 4);
            var _ss = function () {
                var s = '';
                for (var i = 0; i < str.length - 7; i++) s += '*';
                return s;
            };
            var _str_Res = _str_Start + _ss() + _str_End;
            if (str == '') {
                _str_Res = '';
            }
            return _str_Res;
        };
        /*
         * 4.2.2、获取事项多情形的场景展示接口（已通过本地测试）
         * 测试：电影放映经营许可证核发（内资）cf0ea142-926b-4f27-81e3-a7252ebb5ffb
         */
        exports.isHaveElemen = function (param, callback) {
            Util.ejs.ui.showWaiting(' ');
            Util.ajax({
                url: Config.eleUrl + 'zwdtTask/getTaskElement',
                data: JSON.stringify({
                    token: 'Epoint_WebSerivce_**##0601',
                    params: {
                        taskid: param // 非空,事项版本标识  taskid和item_id一样的
                    }
                }),
                contentType: 'application/json;charset=UTF-8',
                success: function (result) {
                    //			var result = {
                    //				"status": {
                    //					"code": 200,
                    //					"text": ""
                    //				},
                    //				"custom": {
                    //					"code": 1,
                    //					"text": "事项要素获取成功",
                    //					"type": "radio",
                    //					"elementlist": [{
                    //						"elementname": "测试情形一",
                    //						"elementquestion": "[单选]测试情形一",
                    //						"elementguid": "dc5c5bd0-6f5f-4de1-95f9-61e4c969c121",
                    //						"optionlist": [{
                    //							"optionname": "测试材料一",
                    //							"optionguid": "f853da45-5374-46c8-afa6-02d9722bb3a2"
                    //						}, {
                    //							"optionname": "测试材料二",
                    //							"optionguid": "4c389690-1a64-4984-b149-36af5872861a"
                    //						}]
                    //					}, {
                    //						"elementname": "测试情形二",
                    //						"elementquestion": "[单选]测试情形二",
                    //						"elementguid": "dc5c5bd0-6f5f-4de1-95f9-61e4c969c121",
                    //						"optionlist": [{
                    //							"optionname": "测试材料三",
                    //							"optionguid": "f853da45-5374-46c8-afa6-02d9722bb3a2"
                    //						}, {
                    //							"optionname": "测试材料四",
                    //							"optionguid": "4c389690-1a64-4984-b149-36af5872861a"
                    //						}]
                    //					}]
                    //				}
                    //			};
                    console.log('结果：' + JSON.stringify(result));
                    if (result.custom.code == 0) {
                        Util.ejs.ui.closeWaiting();
                        Util.ejs.ui.toast(result.custom.text);
                        return;
                    }
                    if (result.status.code == 0) {
                        Util.ejs.ui.closeWaiting();
                        Util.ejs.ui.toast(result.status.text);
                        return;
                    }
                    var res = result.custom;
                    var isHave = ''; // 1有 0没有
                    if (res.elementlist && res.elementlist.length > 0) {
                        window.localStorage.setItem('resEle', JSON.stringify(res));
                        isHave = '1';
                    } else {
                        isHave = '0';
                    }
                    return callback && callback(isHave);
                }
            });
        };
        /*
         * 4.2.4、获取情形唯一标识(即提交4.2.2)
         */

        exports.getCaseGuid = function (data, callback) {
            Util.ejs.ui.showWaiting(' ');
            Util.ajax({
                url: Config.eleUrl + 'zwdtTask/getCaseGuidBySelectedOptions',
                data: JSON.stringify({
                    token: 'Epoint_WebSerivce_**##0601',
                    params: data
                }),
                contentType: 'application/json;charset=UTF-8',
                success: function (result) {
                    console.log('结果：' + JSON.stringify(result));
                    if (result.custom.code == 0) {
                        Util.ejs.ui.closeWaiting();
                        Util.ejs.ui.toast(result.custom.text);
                        return;
                    }
                    if (result.status.code == 0) {
                        Util.ejs.ui.closeWaiting();
                        Util.ejs.ui.toast(result.status.text);
                        return;
                    }
                    return callback && callback(result);
                }
            });
        };
        /**
         * 4.3.2、初始化办件材料接口（已通过本地测试）
         */
        exports.initMaterials = function (data, callback) {
            console.log(JSON.stringify(data));

            Util.ajax({
                url: Config.thisUrl + 'private/initProjectReturnMaterials',
                data: JSON.stringify(data),
                contentType: 'application/json;charset=UTF-8',
                success: function (result) {
                    //	var result={"custom":{"projectguid":"73c9ee24-cb20-480c-802b-539d665e4cac","code":1,"materiallist":[{"certcode":"","necessary":"1","taskmaterialguid":"8a928c2a-1228-46d7-8617-f40af7bf5c3f","itemcode":"","ordernum":8,"clientguid":"55233a82-465a-4e95-ae14-0e634e20543b","projectmaterialguid":"37bec685-2494-43a8-bd65-165e1224dbba","type":20,"projectmaterialname":"电影放映单位设立申请表","status":10,"isonecert":"0"},{"certcode":"","necessary":"1","taskmaterialguid":"3a92ed00-ff24-4607-8a74-1b0f77685ee5","itemcode":"","ordernum":7,"clientguid":"bbc0396f-4a95-40a0-b0e7-d9356d925331","projectmaterialguid":"55ba6e6e-84f1-410c-8f66-39acbd867d83","type":20,"projectmaterialname":"法定代表人身份证","status":10,"isonecert":"0"},{"certcode":"","necessary":"1","taskmaterialguid":"f1fa8a24-9735-4433-9411-c9557d7bffe0","itemcode":"","ordernum":6,"clientguid":"30fdc8a9-2cfa-4e5f-a5a8-f2596c7a38e6","projectmaterialguid":"0697740b-84f2-4f27-ba06-d97ebacd77e4","type":20,"projectmaterialname":"电影放映设备清单","status":10,"isonecert":"0"},{"certcode":"","necessary":"1","taskmaterialguid":"f5436ab9-9478-46d7-8092-37a9959463ad","itemcode":"","ordernum":5,"clientguid":"adbcaca4-1c8e-41e3-9e65-d4c0fcd52c53","projectmaterialguid":"6616a274-1292-440e-a676-da17ed31e4c5","type":20,"projectmaterialname":"营业执照（副本）","status":10,"isonecert":"0"},{"certcode":"","necessary":"1","taskmaterialguid":"c34f564a-3bfb-4e22-8322-aebbe395f7cc","itemcode":"","ordernum":3,"clientguid":"3c94505a-6579-4271-9aff-3d4f42001ada","projectmaterialguid":"1de631d7-8b5d-43d6-9b66-a4d1f246154a","type":20,"projectmaterialname":"场地平面图","status":10,"isonecert":"0"},{"certcode":"","necessary":"1","taskmaterialguid":"42f462a3-8e0f-4269-a916-6e4c5be97271","itemcode":"","ordernum":2,"clientguid":"0ea9d7ff-bf18-45af-8f73-2e59c17b41bc","projectmaterialguid":"7a99d35a-c511-4aaa-a241-4151388682e0","type":20,"projectmaterialname":"消防安全检查合格证","status":10,"isonecert":"0"}],"text":"初始化办件成功"},"status":{"code":200,"text":""}}

                    console.log('结果：' + JSON.stringify(result));
                    if (result.custom.code == 0) {
                        Util.ejs.ui.closeWaiting();
                        Util.ejs.ui.toast(result.custom.text);
                        return;
                    }
                    if (result.status.code == 0) {
                        Util.ejs.ui.closeWaiting();
                        Util.ejs.ui.toast(result.status.text);
                        return;
                    }
                    Util.ejs.ui.closeWaiting();
                    return callback && callback(result);
                }
            });
        };
        // 获取当前用户的信息
        exports.commGetUserInfo = function (callback) {
            if (Config.localDebug == 1) {
                callback && callback({loginid:Config.pripid})
            } else {

                ejs.auth.getUserInfo({
                    success: function (result) {
                        var handleUser = JSON.parse(result.userInfo);
                        // console.log("🚀 ~ file: common.js ~ line 289 ~ handleUser", handleUser)
                        // 存储键值对
                        ejs.storage.setItem({
                            userguid: handleUser.userguid,
                            pripid: handleUser.pripid,
                            success: function (result) {
                                callback && callback(handleUser)
                            },
                            error: function (error) { }
                        });
                    },
                    error: function (error) {
                    }
                });
            }
        }

        return exports;
    })({});

/**
 * 日期相关
 */
(function (exports) {
    var DateUtil = {
        /**
         * 获取对象
         */
        DateObj: function (dateStr) {
            var dateObj;

            if (!dateStr) {
                // throw("请输入合法日期格式！"+str);
                dateObj = new Date();
            } else {
                // 注意：须先把时间戳(122891289)转成字符串然后进行查找
                var index = dateStr.toString().indexOf('-');

                if (index == '-1') {
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
        getDate: function (str, format) {
            var dateStr = '';

            // 初始化当前日期
            var yyyy = this.DateObj(str).getFullYear();
            var mm = this.DateObj(str).getMonth() + 1;
            var dd = this.DateObj(str).getDate();

            if ('yyyy-mm-dd' == format) {
                dateStr += yyyy + '-' + this.tod(mm) + '-' + this.tod(dd);
            } else if ('年月日' == format) {
                dateStr += yyyy + '年' + this.tod(mm) + '月' + this.tod(dd) + '日';
            }

            return dateStr;
        },
        /**
         * 获取小时、分钟、秒    例如：18:09:00
         * @param {Object} format  hh:mm  mm:ss  hh:mm:ss
         * 例如：hh:mm 输出00:00  hh:mm:ss 输出00:00:00
         */
        getTime: function (dateStr, format) {
            var timeStr = '';

            var hh = this.DateObj(dateStr).getHours();
            var mm = this.DateObj(dateStr).getMinutes();
            var ss = this.DateObj(dateStr).getSeconds();

            if ('hh:mm' == format) {
                timeStr += this.tod(hh) + ':' + this.tod(mm);
            } else if ('mm:ss' == format) {
                timeStr += this.tod(mm) + ':' + this.tod(ss);
            } else if ('hh:mm:ss' == format) {
                timeStr += this.tod(hh) + ':' + this.tod(mm) + ':' + this.tod(ss);
            }

            return timeStr;
        },
        /**
         * 获取当前下一个小时
         */
        getNextHour: function (dateStr, format) {
            var tm = Date.parse(this.DateObj(dateStr)) + 1 * 3600 * 1000;
            var t = new Date(parseInt(tm));
            var y = t.getFullYear();
            var m = t.getMonth() + 1;
            var d = t.getDate();
            var hh = t.getHours();
            var mm = t.getMinutes();
            var ss = t.getSeconds();
            // 初始化当前日期
            var dateStr =
                y +
                '-' +
                this.tod(m) +
                '-' +
                this.tod(d) +
                ' ' +
                this.tod(hh) +
                ':' +
                this.tod(mm) +
                ':' +
                this.tod(ss);
            var pre = this.getDate(dateStr, format);
            var next = this.getTime(dateStr, 'hh:mm');

            return pre + ' ' + next;
        },
        /**
         * 获取日期对象
         */
        getWeek: function (dateStr) {
            var week = this.DateObj(dateStr).getDay();
            var weekday = '';

            if (week == 0) {
                weekday = '星期日';
            } else if (week == 1) {
                weekday = '星期一';
            } else if (week == 2) {
                weekday = '星期二';
            } else if (week == 3) {
                weekday = '星期三';
            } else if (week == 4) {
                weekday = '星期四';
            } else if (week == 5) {
                weekday = '星期五';
            } else if (week == 6) {
                weekday = '星期六';
            }

            return weekday;
        },
        /**
         * 日期转换成时间戳
         */
        toTimeStap: function (param) {
            var ts = new Date(parseInt(param)); // 不推荐使用

            // var ts = (new Date(parseInt(param))).valueOf(); //结果：1280977330748       //推荐;
            // var ts = new Date(parseInt(param)); //结果：1280977330748        //推荐;
            return ts;
        },
        /**
         * 两个日期时间比较大小
         */
        compareDate: function (startDate, endDate) {
            var startTimeStamp = this.DateObj(startDate).getTime();
            // console.log('开始时间戳' + startTimeStamp);
            var endTimeStamp = this.DateObj(endDate).getTime();

            // console.log('结束时间戳' + endTimeStamp);
            // alert("比较结果："+(endTimeStamp >= startTimeStamp));
            return endTimeStamp >= startTimeStamp;
        },
        /**
         * 将1,2,3,4,5格式化01,02,03,04,05
         * @param {Object} m 月份 d日 转换
         */
        tod: function (str) {
            if (parseInt(str) > 9) {
                str = '' + parseInt(str);
            } else {
                str = '0' + parseInt(str);
            }

            return str;
        },
        /**
         * @description 获取区间内所有的日期
         * @param {Object} date1
         * @param {Object} date2
         */
        getDateList: function (option) {
            var self = this;
            // 时间差的毫秒数
            var date3 = self.DateObj(option.date2).getTime() - self.DateObj(option.date1).getTime();
            // 声明日时间戳
            var eachTimeStap = 24 * 3600 * 1000;
            // 计算出相差天数
            var days = Math.floor(date3 / eachTimeStap) + 1;
            // 两者之间最大的日期时间戳,相减换算成日期，比如：（3828983-2017-09-01）
            var maxtmp = self.DateObj(option.date2).getTime();
            // 临时数组
            var data = [];

            for (var i = 0; i < days; i++) {
                // 第一项无须减计算
                if (i == 0) {
                    maxtmp -= 0;
                } else {
                    // 其他须减计算
                    maxtmp -= eachTimeStap;
                }
                // 放入数组里
                data.push({
                    date: self.getDate(maxtmp, 'yyyy-mm-dd')
                });
            }

            // 返回
            // console.log("打印："+JSON.stringify(data));
            return data;
        }
    };

    exports.DateUtil = DateUtil;
})(this);

