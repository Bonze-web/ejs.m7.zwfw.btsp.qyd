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

/*
 * 作者: 吴松泽
 * 创建时间: 2020-06-15 09:07:04
 * 修改时间: 2020-06-17 19:23:38
 * 版本: [1.0]
 * 版权: 江苏国泰新点软件有限公司
 * 描述:
 */
/**
 * 统一调用迅盟API
 * @param {Object} args 传参
 * @param {String} api api名称
 * @param {Boolean} type 是否支持promise
 */
function callXmByArgs(args, api, isPromise) {
    var options = args[0];
    // const resolve = options.success;
    // const reject = options.error;
    var resolve = args[1];
    var reject = args[2];

    if (api && typeof api === 'function') {
        var dataFilter = options.dataFilter;
        var opt = options.params ? options.params : options;
        if (isPromise === undefined || isPromise === true) {
            api(opt).then(function (result) {
                var newResult = result;

                if (dataFilter) {
                    newResult = dataFilter(result);
                }
                options.success && options.success(newResult);
                resolve && resolve(newResult);
            }).catch(function (error) {
                options.error && options.error(error);
                reject && reject(error);
            });
        } else if (isPromise === false) {
            api(opt);
            options.success && options.success();
            resolve && resolve();
        }
    } else {
        console.error('api不存在');
    }
}

function authMixin(hybrid) {
    var hybridJs = hybrid;

    hybridJs.extendModule('auth', [{
        namespace: 'getToken',
        os: ['xm'],
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            var args = rest;

            args[0].params = 'getEpointToken';
            args[0].dataFilter = function (result) {
                return {
                    access_token: result
                };
            };
            callXmByArgs(args, xm.native);
        }
    }, {
        namespace: 'getAuthCode',
        os: ['xm'],
        defaultParams: {
            appkey: ''
        },
        runCode: function runCode() {
            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            var args = rest;

            args[0].dataFilter = function (result) {
                return {
                    authCode: result
                };
            };
            callXmByArgs(args, xm.getAuthCode);
        }
    }, {
        namespace: 'refreshToken',
        os: ['xm'],
        runCode: function runCode() {
            for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                rest[_key3] = arguments[_key3];
            }

            var args = rest;

            args[0].params = 'refreshEpointToken';
            args[0].dataFilter = function (result) {
                return {
                    access_token: result
                };
            };
            callXmByArgs(args, xm.native);
        }
    }]);
}

function deviceMixin(hybrid) {
    var hybridJs = hybrid;

    hybridJs.extendModule('device', [{
        namespace: 'setOrientation',
        os: ['xm'],
        defaultParams: {
            orientation: 1 // 1表示竖屏，0表示横屏
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            var args = rest;
            var options = args[0];

            // 设为竖屏，迅盟api为调用切换横竖屏
            if (options.orientation === 1 && window.ejs_xm_orientation !== 0) {
                callXmByArgs(args, xm.horizontalScreen, false);
                window.ejs_xm_orientation = 0;
            } else if (options.orientation === 0 && window.ejs_xm_orientation !== 1) {
                callXmByArgs(args, xm.horizontalScreen, false);
                window.ejs_xm_orientation = 1;
            }
        }
    }, {
        namespace: 'getNetWorkInfo',
        os: ['xm'],
        runCode: function runCode() {
            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            var args = rest;
            var options = args[0];
            var isOnline = xm.isOnline();

            options.success && options.success({
                netWorkType: isOnline ? 1 : -1
            });
        }
    }, {
        namespace: 'callPhone',
        os: ['xm'],
        defaultParams: {
            phoneNum: ''
        },
        runCode: function runCode() {
            for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                rest[_key3] = arguments[_key3];
            }

            var args = rest;
            var options = args[0];

            args[0].params = {
                dialNumber: options.phoneNum
            };
            callXmByArgs(rest, xm.makePhoneCall, false);
        }
    }]);
}

function ioMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('io', [{
        namespace: 'downloadFile',
        os: ['xm'],
        defaultParams: {
            url: '',
            fileName: ''
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            var args = rest;
            var options = args[0];

            args[0] = innerUtil.extend(args[0], {
                url: args[0].url,
                filePath: '/ejs/' + options.fileName
            });
            args[0].dataFilter = function (result) {
                return {
                    filePath: result.filePath
                };
            };
            callXmByArgs(args, xm.downloadFile);
        }
    }, {
        namespace: 'selectFile',
        os: ['xm'],
        defaultParams: {
            multi: 0
        },
        runCode: function runCode() {
            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            var args = rest;
            var options = args[0];

            if (options.multi === 0) {
                // 单选
                args[0] = innerUtil.extend(args[0], {
                    count: 1
                });
            } else if (options.multi === 1) {
                // 多选
                args[0] = innerUtil.extend(args[0], {
                    count: 9
                });
            }
            args[0].dataFilter = function (result) {
                var path = [];
                if (result instanceof Array) {
                    result.forEach(function (item) {
                        path.push(item.path);
                    });
                } else {
                    path.push(result.path);
                }

                return {
                    resultData: path
                };
            };
            callXmByArgs(args, xm.chooseFile);
        }
    }, {
        namespace: 'openFile',
        os: ['xm'],
        defaultParams: {
            path: ''
        },
        runCode: function runCode() {
            for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                rest[_key3] = arguments[_key3];
            }

            var args = rest;
            var options = args[0];
            var fileName = options.path.split('/')[options.path.split('/').length - 1];
            fileName = fileName.split('?')[0];

            args[0] = innerUtil.extend(args[0], {
                path: options.path,
                fileName: fileName
            });
            callXmByArgs(rest, xm.openFile, false);
        }
    }]);
}

function navigatorMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('navigator', [{
        namespace: 'setTitle',
        os: ['xm'],
        defaultParams: {
            title: ''
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'title');

            callXmByArgs(args, xm.setNavigationBarTitle, false);
        }
    }]);
}

function pageMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    function getFullUrlByParams() {
        var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var data = arguments[1];

        var extrasDataStr = '';

        if (data) {
            Object.keys(data).forEach(function (item) {
                if (extrasDataStr.indexOf('?') === -1) {
                    extrasDataStr += '?';
                } else {
                    extrasDataStr += '&';
                }
                extrasDataStr += item + '=' + data[item];
            });
        }

        return url + extrasDataStr;
    }
    hybridJs.extendModule('page', [{
        namespace: 'open',
        os: ['xm'],
        defaultParams: {
            pageUrl: '',
            pageStyle: 1,
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

            if (/^(http|https|ftp|epth|h5|\/\/)/g.test(options.pageUrl)) {
                // 将额外数据拼接到url中
                options.pageUrl = innerUtil.getFullUrlByParams(options.pageUrl, options.data);
                args[0] = innerUtil.extend(args[0], {
                    url: options.pageUrl,
                    hideNavibar: options.pageStyle !== 1
                });
                // 如果是全路径
                callXmByArgs(args, xm.openExternal);
            } else {
                // xm.on('resultData', (result) => {
                //     options.success && options.success({
                //         resultData: result,
                //     });
                // });
                if (options.data) {
                    // eslint-disable-next-line no-restricted-syntax
                    for (var key in options.data) {
                        // eslint-disable-next-line no-prototype-builtins
                        if (options.data.hasOwnProperty(key)) {
                            var element = options.data[key];
                            options.data[key] = encodeURI(element);
                        }
                    }
                }
                xm.off('resultData');

                var opt = {
                    url: getFullUrlByParams(options.pageUrl, options.data),
                    events: {
                        resultData: function resultData(result) {
                            options.success && options.success({
                                resultData: result
                            });
                        }
                    }
                };

                if (options.pageStyle === -1) {
                    opt.naviStyle = 2;
                } else {
                    opt.naviStyle = 0;
                }

                xm.navigateTo(opt);
            }
        }
    }, {
        namespace: 'close',
        os: ['xm'],
        defaultParams: {
            // 需要关闭的页面层级，默认只会关闭一层
            popPageNumber: 1,
            // 需要传递的参数，是一个字符串
            resultData: ''
        },
        runCode: function runCode() {
            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'resultData');
            var options = args[0];
            options.resultData && xm.emitParent('resultData', typeof options.resultData === 'string' ? JSON.stringify(options.resultData) : options.resultData);
            xm.navigateBack({
                delta: args[0].popPageNumber
            });
        }
    }]);
}

function miniH5Mixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('miniH5', [{
        namespace: 'navigateTo',
        os: ['xm'],
        defaultParams: {
            // 要打开的小程序 appId
            appId: '',
            // 打开指定的页面路径
            path: '',
            // 需要传递给小程序的额外参数
            extraData: {}
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            var args = rest;

            args[0] = innerUtil.extend(args[0], {
                appid: Number(args[0].appId),
                param: args[0].extraData,
                relativeUrl: args[0].path
            });
            callXmByArgs(args, xm.openApp, false);
        }
    }, {
        namespace: 'navigateBack',
        os: ['xm'],
        defaultParams: {
            // 要打开的小程序 appId
            delta: 1
        },
        runCode: function runCode() {
            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            var args = rest;

            xm.navigateBack({
                delta: args[0].delta
            });
        }
    }, {
        namespace: 'close',
        os: ['xm'],
        defaultParams: {
            params: 'close'
        },
        runCode: function runCode() {
            for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                rest[_key3] = arguments[_key3];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'params');

            callXmByArgs(args, xm.native, true);
        }
    }]);
}

function runtimeMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('runtime', [{
        namespace: 'getGeolocation',
        os: ['xm'],
        defaultParams: {
            // 1代表火星坐标系GCJ-02（天朝特色，带偏差，国内高德坐标也是这个），0代表地球坐标系WGS84（标准坐标）
            coordinate: 1,
            isShowDetail: 1
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            var args = rest;
            var options = args[0];

            args[0] = innerUtil.extend(args[0], {
                sdk: options.coordinate === 1 ? 0 : 1
            });
            args[0].dataFilter = function (result) {
                return {
                    longitude: result.lng,
                    latitude: result.lat,
                    addressComponent: {
                        country: result.country,
                        country_code: 0,
                        province: result.province,
                        city: result.city,
                        district: result.district,
                        adcode: result.adcode,
                        street: result.street,
                        street_number: result.streetNum,
                        direction: result.streetNum
                    }
                };
            };
            callXmByArgs(args, xm.getLocation);
        }
    }, {
        namespace: 'getAppVersion',
        os: ['xm'],
        runCode: function runCode() {
            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            var args = rest;

            args[0].dataFilter = function (result) {
                return {
                    version: result.version
                };
            };
            callXmByArgs(args, xm.getAppInfo);
        }
    }]);
}

function storageMixin(hybrid) {
    var hybridJs = hybrid;

    hybridJs.extendModule('storage', [{
        namespace: 'setItem',
        os: ['xm'],
        runCode: function runCode(params, resolve) {
            var options = params;
            var success = options.success;

            Object.keys(options).forEach(function (key) {
                if (key !== 'success' && key !== 'error') {
                    var value = options[key];

                    xm.setStorage({
                        key: key,
                        value: value
                    });
                }
            });
            success && success({});
            resolve && resolve({});
        }
    }, {
        namespace: 'getItem',
        os: ['xm'],
        runCode: function runCode(params, resolve) {
            var options = params;
            var success = options.success;
            var res = {};
            var getStorage = function getStorage(key) {
                return new Promise(function (r) {
                    xm.getStorage({
                        key: key
                    }).then(function (data) {
                        res[key] = data;
                        r();
                    });
                });
            };
            var array = [];

            if (options.key instanceof Array) {
                options.key.forEach(function (key) {
                    array.push(getStorage(key));
                });
            } else {
                array.push(getStorage(options.key));
            }
            Promise.all(array).then(function () {
                success && success(res);
                resolve && resolve(res);
            });
        }
    }, {
        namespace: 'removeItem',
        os: ['xm'],
        runCode: function runCode(params, resolve) {
            var options = params;
            var success = options.success;

            var removeStorage = function removeStorage(key) {
                return new Promise(function (r) {
                    xm.removeStorage({
                        key: key
                    }).then(function () {
                        r();
                    });
                });
            };
            var array = [];

            if (options.key instanceof Array) {
                options.key.forEach(function (key) {
                    array.push(removeStorage(key));
                });
            } else {
                array.push(removeStorage(options.key));
            }
            Promise.all(array).then(function () {
                success && success({});
                resolve && resolve({});
            });
        }
    }]);
}

function utilMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('util', [{
        namespace: 'scan',
        os: ['xm'],
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            var args = rest;

            args[0].dataFilter = function (result) {
                return {
                    resultData: result
                };
            };
            callXmByArgs(args, xm.scanCode);
        }
    }, {
        namespace: 'playVideo',
        os: ['xm'],
        defaultParams: {
            videoUrl: 0
        },
        runCode: function runCode() {
            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            var args = rest;

            args[0] = innerUtil.extend(args[0], {
                url: args[0].videoUrl
            });
            callXmByArgs(args, xm.playMedia);
        }
    }, {
        namespace: 'selectImage',
        os: ['xm'],
        defaultParams: {
            photoCount: 9
        },
        runCode: function runCode() {
            for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                rest[_key3] = arguments[_key3];
            }

            var args = rest;

            args[0] = innerUtil.extend(args[0], {
                sourceType: 2,
                count: args[0].photoCount
            });
            args[0].dataFilter = function (result) {
                var path = [];
                result.length && result.forEach(function (item) {
                    path.push(item.path);
                });
                return {
                    resultData: path
                };
            };
            callXmByArgs(args, xm.chooseImage);
        }
    }, {
        namespace: 'cameraImage',
        os: ['xm'],
        runCode: function runCode() {
            for (var _len4 = arguments.length, rest = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                rest[_key4] = arguments[_key4];
            }

            var args = rest;

            args[0] = innerUtil.extend(args[0], {
                sourceType: 1
            });
            args[0].dataFilter = function (result) {
                var path = [];
                result.length && result.forEach(function (item) {
                    path.push(item.path);
                });
                return {
                    resultData: path
                };
            };
            callXmByArgs(args, xm.chooseImage);
        }
    }, {
        namespace: 'prevImage',
        os: ['xm'],
        defaultParams: {
            index: '',
            selectedPhotos: {}
        },
        runCode: function runCode() {
            for (var _len5 = arguments.length, rest = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                rest[_key5] = arguments[_key5];
            }

            var args = rest;

            args[0] = innerUtil.extend(args[0], {
                current: args[0].index,
                urls: args[0].selectedPhotos
            });
            callXmByArgs(args, xm.previewImages, false);
        }
    }, {
        namespace: 'invokePluginApi',
        os: ['xm'],
        defaultParams: {
            path: '',
            dataMap: {}
        },
        runCode: function runCode() {
            for (var _len6 = arguments.length, rest = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                rest[_key6] = arguments[_key6];
            }

            var args = rest;
            var resolve = args[1];
            var reject = args[2];

            xm.native('invokePlugin', {
                path: args[0].path,
                dataMap: args[0].dataMap
            }).then(function (res) {
                console.log('res.data');
                console.log(res.data);
                args[0].success && args[0].success(res.data);
                resolve && resolve(res.data);
            }).catch(function (err) {
                reject && reject(err);
            });
        }
    }]);
}

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
        os: ['xm'],
        defaultParams: {
            message: ''
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'message');

            args[0] = innerUtil.extend(args[0], {
                message: args[0].message
            });
            callXmByArgs(args, xm.showToast, false);
        }
    }, {
        namespace: 'showDebugDialog',
        os: ['xm'],
        defaultParams: {
            debugInfo: ''
        },
        runCode: function runCode() {
            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject(rest, 'debugInfo');

            args[0] = innerUtil.extend(args[0], {
                title: '',
                message: args[0].debugInfo
            });
            args[0].dataFilter = function (result) {
                return {
                    which: result === 'ok' ? 1 : 0
                };
            };
            callXmByArgs(args, xm.showConfirm, true);
        }
    }, {
        namespace: 'alert',
        os: ['xm'],
        defaultParams: {
            title: '',
            message: ''
        },
        runCode: function runCode() {
            for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                rest[_key3] = arguments[_key3];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'message', 'title', 'buttonName');

            args[0] = innerUtil.extend(args[0], {
                title: args[0].title,
                message: args[0].message
            });
            args[0].dataFilter = function (result) {
                return {
                    which: result === 'ok' ? 1 : 0
                };
            };
            callXmByArgs(args, xm.showConfirm, true);
        }
    }, {
        namespace: 'confirm',
        os: ['xm'],
        defaultParams: {
            title: '',
            message: ''
        },
        runCode: function runCode() {
            for (var _len4 = arguments.length, rest = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                rest[_key4] = arguments[_key4];
            }

            var args = rest;

            args[0] = innerUtil.extend(args[0], {
                title: args[0].title,
                message: args[0].message
            });

            args[0].dataFilter = function (result) {
                return {
                    which: result === 'ok' ? 1 : 0
                };
            };
            callXmByArgs(args, xm.showConfirm, true);
        }
    }, {
        namespace: 'prompt',
        os: ['xm'],
        defaultParams: {
            title: '',
            hint: '',
            text: ''
        },
        runCode: function runCode() {
            for (var _len5 = arguments.length, rest = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                rest[_key5] = arguments[_key5];
            }

            var args = rest;

            args[0] = innerUtil.extend(args[0], {
                title: args[0].title,
                message: '请输入',
                placeholder: args[0].hint,
                defaultValue: args[0].text
            });

            args[0].dataFilter = function (result) {
                return {
                    which: 1,
                    content: result
                };
            };
            callXmByArgs(args, xm.showPrompt, true);
        }
    }, {
        namespace: 'showWaiting',
        os: ['xm'],
        defaultParams: {
            message: '正在加载...',
            h5UI: false
        },
        runCode: function runCode() {
            for (var _len6 = arguments.length, rest = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                rest[_key6] = arguments[_key6];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'message');
            var options = args[0];
            var h5UI = options.h5UI;

            if (h5UI !== false) {
                uiVue(args, 'showWaiting');
            } else {
                args[0] = innerUtil.extend(args[0], {});
                callXmByArgs(args, xm.showLoading, false);
            }
        }
    }, {
        namespace: 'closeWaiting',
        os: ['xm'],
        defaultParams: {},
        runCode: function runCode() {
            for (var _len7 = arguments.length, rest = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                rest[_key7] = arguments[_key7];
            }

            var args = rest;

            callXmByArgs(args, xm.hideLoading, false);
        }
    }, {
        namespace: 'select',
        os: ['xm'],
        defaultParams: {
            title: '',
            items: []
        },
        runCode: function runCode() {
            for (var _len8 = arguments.length, rest = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
                rest[_key8] = arguments[_key8];
            }

            var args = rest;
            var itemList = args[0].items.map(function (value, index) {
                return {
                    text: value,
                    value: index
                };
            });

            args[0] = innerUtil.extend(args[0], {
                title: args[0].title,
                list: itemList,
                defaultValue: ''
            });

            args[0].dataFilter = function (result) {
                return {
                    which: Number(result.value),
                    content: result.text
                };
            };
            callXmByArgs(args, xm.picker, true);
        }
    }, {
        namespace: 'actionSheet',
        os: ['xm'],
        defaultParams: {
            items: []
        },
        runCode: function runCode() {
            for (var _len9 = arguments.length, rest = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
                rest[_key9] = arguments[_key9];
            }

            var args = rest;
            var itemList = args[0].items.map(function (value, index) {
                return {
                    text: value,
                    value: index
                };
            });

            args[0] = innerUtil.extend(args[0], {
                title: '请选择',
                itemList: itemList,
                defaultValue: ''
            });

            args[0].dataFilter = function (result) {
                return {
                    which: Number(result.value),
                    content: result.text
                };
            };
            callXmByArgs(args, xm.showActionSheet, true);
        }
    }, {
        namespace: 'pickDate',
        os: ['xm'],
        defaultParams: {
            datetime: '',
            format: 'yyyy-MM-dd'
        },
        runCode: function runCode() {
            for (var _len10 = arguments.length, rest = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
                rest[_key10] = arguments[_key10];
            }

            var args = rest;
            // 兼容ios
            var datetime = args[0].datetime.replace(/-/g, '/');

            args[0] = innerUtil.extend(args[0], {
                format: args[0].format,
                defaultValue: new Date(datetime).getTime()
            });

            args[0].dataFilter = function (result) {
                return {
                    date: result
                };
            };
            callXmByArgs(args, xm.selectDate, true);
        }
    }]);
}

function streamMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('stream', [{
        namespace: 'fetch',
        os: ['xm'],
        defaultParams: {
            url: '',
            method: 'POST',
            body: '',
            // 有一些默认的头部信息
            headers: {
                // application/json
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            var args = rest;
            var resolve = args[1];
            var reject = args[2];

            args[0] = innerUtil.extend(args[0], {
                body: args[0].body,
                headers: args[0].headers,
                method: args[0].method,
                credentials: false
            });

            var opt = args[0].params ? args[0].params : args[0];

            xm.fetch(args[0].url, opt).then(function (response) {
                response.json().then(function (result) {
                    var newResult = {
                        data: result
                    };
                    args[0].success && args[0].success(newResult);
                    resolve && resolve(newResult);
                });
            }).catch(function (error) {
                args[0].error && args[0].error(error);
                reject && reject(error);
            });
        }
    }]);
}

function audioMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('audio', [{
        namespace: 'startRecord',
        os: ['xm'],
        defaultParams: {
            maxDuration: 120
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            // 兼容字符串形式
            var args = rest;

            args[0] = innerUtil.extend(args[0], {
                duration: args[0].maxDuration * 1000
            });
            callXmByArgs(args, xm.startRecord, true);
        }
    }, {
        namespace: 'stopRecord',
        os: ['xm'],
        defaultParams: {},
        runCode: function runCode() {
            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            // 兼容字符串形式
            var args = rest;

            args[0] = innerUtil.extend(args[0], {});
            args[0].dataFilter = function (result) {
                return {
                    duration: result.duration,
                    path: result.filePath
                };
            };
            callXmByArgs(args, xm.stopRecord, true);
        }
    }, {
        namespace: 'cancelRecord',
        os: ['xm'],
        defaultParams: {},
        runCode: function runCode() {
            for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                rest[_key3] = arguments[_key3];
            }

            // 兼容字符串形式
            var args = rest;

            args[0] = innerUtil.extend(args[0], {});

            callXmByArgs(args, xm.cancelRecord, true);
        }
    }, {
        namespace: 'startPlay',
        os: ['xm'],
        defaultParams: {
            path: ''
        },
        runCode: function runCode() {
            for (var _len4 = arguments.length, rest = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                rest[_key4] = arguments[_key4];
            }

            // 兼容字符串形式
            var args = rest;

            args[0] = innerUtil.extend(args[0], {
                url: args[0].path
            });

            callXmByArgs(args, xm.playAudio, true);
        }
    }, {
        namespace: 'stopPlay',
        os: ['xm'],
        defaultParams: {},
        runCode: function runCode() {
            for (var _len5 = arguments.length, rest = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                rest[_key5] = arguments[_key5];
            }

            // 兼容字符串形式
            var args = rest;

            args[0] = innerUtil.extend(args[0], {});

            callXmByArgs(args, xm.stopAudio, true);
        }
    }]);
}

var hybridJs = window.ejs;

authMixin(hybridJs);
deviceMixin(hybridJs);
ioMixin(hybridJs);
navigatorMixin(hybridJs);
pageMixin(hybridJs);
miniH5Mixin(hybridJs);
runtimeMixin(hybridJs);
storageMixin(hybridJs);
utilMixin(hybridJs);
uiMixin(hybridJs);
streamMixin(hybridJs);
audioMixin(hybridJs);

})));
