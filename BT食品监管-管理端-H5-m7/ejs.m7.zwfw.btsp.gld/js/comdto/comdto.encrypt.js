// 需要加密的js的处理
(function (win, $) {
    if (!win.Util) {
        win.Util = {};
    } else if (!Util._getType) {
        Util._getType = function (obj) {
            return $.type(obj);
        }
    }
    // atob/btoa polyfill for IE 9-
    // code from :https://github.com/davidchambers/Base64.js/blob/master/base64.js
    (function () {
        var object =
            typeof exports != 'undefined' ?
            exports :
            typeof self != 'undefined' ?
            self // #8: web workers
            :
            $.global; // #31: ExtendScript

        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        function InvalidCharacterError(message) {
            this.message = message;
        }
        InvalidCharacterError.prototype = new Error();
        InvalidCharacterError.prototype.name = 'InvalidCharacterError';

        // encoder
        // [https://gist.github.com/999166] by [https://github.com/nignag]
        object.btoa ||
            (object.btoa = function (input) {
                var str = String(input);
                for (
                    // initialize result and counter
                    var block, charCode, idx = 0, map = chars, output = '';
                    // if the next str index does not exist:
                    //   change the mapping table to "="
                    //   check if d has no fractional digits
                    str.charAt(idx | 0) || ((map = '='), idx % 1);
                    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
                    output += map.charAt(63 & (block >> (8 - (idx % 1) * 8)))
                ) {
                    charCode = str.charCodeAt((idx += 3 / 4));
                    if (charCode > 0xff) {
                        throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
                    }
                    block = (block << 8) | charCode;
                }
                return output;
            });

        // decoder
        // [https://gist.github.com/1020396] by [https://github.com/atk]
        object.atob ||
            (object.atob = function (input) {
                var str = String(input).replace(/[=]+$/, ''); // #31: ExtendScript bad parse of /=
                if (str.length % 4 == 1) {
                    throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
                }
                for (
                    // initialize result and counters
                    var bc = 0, bs, buffer, idx = 0, output = '';
                    // get next character
                    (buffer = str.charAt(idx++));
                    // character found in table? initialize bit storage and add its ascii value;
                    ~buffer &&
                    ((bs = bc % 4 ? bs * 64 + buffer : buffer),
                        // and if not first of each 4 characters,
                        // convert the first 8 bits to one ascii character
                        bc++ % 4) ?
                    (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)))) :
                    0
                ) {
                    // try to find character in table (0-63, not found => -1)
                    buffer = chars.indexOf(buffer);
                }
                return output;
            });
    })();

    /**
     * 将多个参数对象按照url参数对象规则合并到一个
     *
     * @param {Object} p1 合并到的参数对象
     * @param {...Object} ...param 其他参数对象
     * @returns {Object} 合并后的参数对象，修改p1生成
     * @example
     * assignUrlParams({a: '1', b: '1'}, {a: '1',b: '1',c: '1'}) => {"a": ["1","1"], "b": ["1","1"],"c": "1" }
     * !!这是一个专用于url上提取参数进行进行合并的情况 参数值为undefined、string 或者已经合并过的 array 不存在其他情况
     */
    function assignUrlParams(p1) {
        $.each([].slice.call(arguments, 1), function (i, param) {
            for (var k in param) {
                if (!Object.prototype.hasOwnProperty.call(param, k)) {
                    continue;
                }
                var type = Util._getType(p1[k]);
                if (type == 'undefined') {
                    p1[k] = param[k];
                } else if (type == 'string') {
                    p1[k] = [p1[k], param[k]];
                } else if (type == 'array') {
                    p1[k].push(param[k]);
                }
            }
        });
        return p1;
    }

    var _skipEncodeUrlArr;
    // 经沟通 login id 从系统参数中获取
    function getLoginId() {
        return Util.getFrameSysParam('epoint_user_loginid') || '';
    }
    // 加密解密
    $.extend(win.Util, {

        // 加密解密
        // url 上加密参数的特定名称
        URL_ENCRYPT_PARAM_NAME: 'frameUrlSecretParam',
        // url 是否包含加密参数的正则
        _hasUrlEncryptedReg: /[?&]frameUrlSecretParam=/,
        // 请求体中加密的参数的特定名称
        BODY_ENCRYPT_PARAM_NAME: 'frameBodySecretParam',
        /**
         * 将参数对象拼接为 url 参数格式
         *
         * @param {Object} obj 要处理的参数对象
         * @returns {String} 拼完成的字符串
         * @example
         * {a:[1,2,3],b:1}  =>  'a=1&a=2&a=3&b=1'
         * {a:[1,2,3],b:1,c:{name:'c'}}  =>  "a=1&a=2&a=3&b=1&c={"name":"c"}"
         */
        _joinUrlParams: function (obj) {
            var arr = [],
                loginId = '';
            $.each(obj, function (k, v) {
                if (k === '@epoint_user_loginid') {
                    loginId = encodeURI(k + '=' + v);
                } else if (Object.prototype.hasOwnProperty.call(obj, k)) {
                    var type = Util._getType(v),
                        str = '';
                    if (type == 'array') {
                        // 数组拆分为多个 &
                        // 'a=' + [1,2,3].join('&a=')
                        // "a=1&a=2&a=3"
                        str += encodeURI(k + '=' + v.join('&' + k + '='));
                    } else if (type == 'string') {
                        // 字符串直接拼接
                        str += encodeURI(k + '=' + v);
                    } else {
                        // 其他直接 转字符串
                        str += encodeURI(k + '=' + JSON.stringify(v));
                    }
                    arr.push(str);
                }
            });

            return arr.join('&') + (loginId ? '&' + loginId : '');
        },
        // 获取框架jsboot内系统参数
        getFrameSysParam: function (name) {
            if (!win.EpFrameSysParams) {
                return;
            }

            return win.EpFrameSysParams[name];
        },
        /**
         * 字符串加密 （先 encodeURIComponent 在 转 base64 再 encodeURIComponent）
         *
         * @param {String} str 要处理的字符串
         * @returns {String} 加密后的字符串
         */
        encrypt: function (str) {
            if ('string' != Util._getType(str)) {
                throw new Error('The argument must be string!');
            }
            var loginId = getLoginId();
            if (Util.getFrameSysParam('security_urlparam_encode_with_loginid') && loginId) {
                // 拷贝的url中可能已包含了登录信息，要避免重复拼接
                if (str.indexOf('@epoint_user_loginid=') == -1) {
                    str += "@epoint_user_loginid=" + loginId;
                }
            }
            // var output = win.btoa(win.encodeURI(str));
            var output = win.encodeURIComponent(win.btoa(win.encodeURIComponent(str)));
            return output;
        },
        /**
         * 字符串解密 （先 decodeURIComponent 再 base64还原 再 decodeURIComponent ）
         *
         * @param {String} str 要处理的字符串
         * @returns {String} 解密后的字符串
         */
        decrypt: function (str) {
            if ('string' != Util._getType(str)) {
                throw new Error('The argument must be string!');
            }
            // var output = win.decodeURI(win.atob(str));
            var output = win.decodeURIComponent(win.atob(win.decodeURIComponent(str)));

            if (Util.getFrameSysParam('security_urlparam_encode_with_loginid')) {
                var index = output.indexOf("@epoint_user_loginid=");
                if (index > -1) {
                    output = output.replace('@epoint_user_loginid=', '&@epoint_user_loginid=');
                }
            }

            return output;
        },
        /**
         * 获取url上的参数
         *
         * @param {String} url 要处理的url
         * @param {String} prop 要获取的属性名，省略时获取所有参数
         * @returns {String | Object | undefined}
         */
        _getUrlParams: function (url, prop) {
            if (!url) {
                url = location.search;
            } else {
                url = Util.removeHash(url);
            }

            var idx = url.indexOf('?');
            if (idx === -1) {
                return prop ? undefined : {};
            }

            var query = url.substr(idx + 1);

            if (!query.length) {
                return prop ? undefined : {};
            }

            var params = urlParams2Obj(query);

            var result;

            // 如果url是加密的 尝试需要先解密
            if (params[Util.URL_ENCRYPT_PARAM_NAME]) {
                var decryptStr = Util.decrypt(params[Util.URL_ENCRYPT_PARAM_NAME]);
                // 将加密参数解密 并合并到 普通参数中
                delete params[Util.URL_ENCRYPT_PARAM_NAME];
                result = assignUrlParams(params, urlParams2Obj(decryptStr));
            } else {
                result = params;
            }

            return prop ? result[prop] : result;

            function urlParams2Obj(queryStr) {
                var params = {};
                $.each(queryStr.split('&'), function (i, item) {
                    // base64 编码情况下 base64尾部可能是有 0~2个 = 的 不能直接split
                    var splitIdx = item.indexOf('=');
                    var k, v;
                    if (splitIdx !== -1) {
                        k = item.substr(0, splitIdx);
                        v = win.decodeURIComponent(item.substr(splitIdx + 1));
                    } else {
                        k = item;
                        v = '';
                    }
                    var type = Util._getType(params[k]);

                    if (type == 'undefined') {
                        params[k] = v;
                    } else if (type == 'string') {
                        params[k] = [params[k], v];
                    } else if (type == 'array') {
                        params[k].push(v);
                    }
                });
                return params;
            }
        },
        getUrlParams: function (prop) {
            return Util._getUrlParams(location.search, prop);
        },
        /**
         * 对 ajax 请求的参数加密
         *
         * @param {string} url 请求地址
         * @param {Object} data 请求的数据
         * @returns
         */
        encryptAjaxParams: function (url, data) {
            // 需要加密
            if (needEncrypt(url)) {
                var d = {};
                var encryptStr;
                if (window.useSm2Encrypt) {
                    encryptStr = 'encbody_' + Util.encryptSM2(JSON.stringify(data));
                } else {
                    encryptStr = Util.encrypt(JSON.stringify(data));
                }
                d[Util.BODY_ENCRYPT_PARAM_NAME] = encryptStr;
                return d;
            }

            return data;
        },
        /**
         * 对url上的参数进行加密 返回加密后的url
         * @param {string | undefined} url 要处理的 url 为空时取当前页面url
         * @returns 对参数加密后的url
         */
        encryptUrlParams: function (url, force) {
            if (!url) {
                url = location.href;
            }
            var hash = Util.getHash(url);
            url = Util.removeHash(url);

            var idx = url.indexOf('?');
            // 无参数
            // 框架已经加密的不再加密
            if (idx === -1 || /complexUrlSecretParam/i.test(url)) {
                return url + hash;
            }

            // 检查是否要加密
            if (!needEncrypt(url) && !force) {
                var index = url.indexOf("@epoint_user_loginid=");
                if (index > -1) {
                    url = url.substr(0, index);
                }
                return url + hash;
            }

            var params = Util._getUrlParams(url);

            // 若空参数 非强制则不处理
            if ($.isEmptyObject(params)) {
                return url + hash;
            }

            // 对参数进行加密处理
            var encryptedParams = Util.URL_ENCRYPT_PARAM_NAME + '=' + Util.encrypt(Util._joinUrlParams(params));

            // 重组url
            var baseUrl = url.substring(0, idx);
            return baseUrl + '?' + encryptedParams + hash;
        },
        /**
         * 解密 url参数 返回
         * @param {string | undefined} url 要处理的 url 为空时取当前页面url
         * @returns 将参数进行解密后的url
         */
        decryptUrlParams: function (url) {
            if (!url) {
                url = location.href;
            }
            var hash = Util.getHash(url);
            url = Util.removeHash(url);
            // 未加密 直接返回
            if (!Util._hasUrlEncryptedReg.test(url)) {
                return url + hash;
            }
            
            var params = Util._getUrlParams(url);
            
            return url.substr(0, url.indexOf('?') + 1) + Util._joinUrlParams(params) + hash;
        },
        /**
         * 在url上新增参数 内部会自动处理加密逻辑
         *
         * @param {String} url 要处理的url
         * @param {Object} params 要新增的参数 ，键值对形式
         * @param {String} mode 重名参数处理方式 可选值 normal、 replace、 ignore
         * 默认为 normal 即 URLSearchParams 标准规范规则 重名参数构成数组
         * replace 用新参数替换原有重名参数
         * ignore 存在重名参数时保留之前的值，忽略新加入的
         * @returns {String} 处理完成后的url
         */
        addUrlParams: function (url, params, mode, noEncryption) {
            if ('string' != Util._getType(url)) {
                throw new Error('The first argument [url] must be string!');
            }
            if ('object' != Util._getType(params)) {
                throw new Error('The second argument [params] must be object!');
            }
            var hash = Util.getHash(url);
            url = Util.removeHash(url);
            // 获取原有参数
            var originParams = Util._getUrlParams(url) || {},
                isEncrypted = Util._hasUrlEncryptedReg.test(url);

            // 与新参数合并
            switch (mode) {
                case 'replace':
                    originParams = $.extend(originParams, params);
                    break;
                case 'ignore':
                    originParams = $.extend({}, params, originParams);
                    break;
                default:
                    originParams = assignUrlParams(originParams, params);
                    break;
            }

            var paramsStr = '';
            // 如果为加密 则需要重新加密
            if (!noEncryption && (needEncrypt(url) || isEncrypted)) {
                // var obj = {};
                // obj[Util.URL_ENCRYPT_PARAM_NAME] = Util.encrypt(Util._joinUrlParams(originParams));
                // paramsStr = Util._joinUrlParams(obj);

                paramsStr = Util.URL_ENCRYPT_PARAM_NAME + '=' + Util.encrypt(Util._joinUrlParams(originParams));
            } else {
                paramsStr = Util._joinUrlParams(originParams);
            }

            var idx = url.indexOf('?'),
                newBaseUrl = idx !== -1 ? url.substring(0, idx) : url;

            return newBaseUrl + '?' + paramsStr + hash;
        }
    });
    var encodeParam = Util.getFrameSysParam('security_urlparam_encode_enable')

    function needEncrypt(url) {
        // 未开启 则不用处理
        if (!encodeParam) {
            return false;
        }
        if (!_skipEncodeUrlArr) {
            _skipEncodeUrlArr = win.Config.security ? win.Config.security.skipUrl ?
                win.Config.security.skipUrl
                .replace(/^;+|;+$/g, '')
                .split(';') : [] : [];
        }
        // 相对路径 【./ 或者 ../】
        if (/^(?:\.\/|\.\.\/)/.test(url)) {
            return !inList();
        }
        // 绝对路径
        // 同域名 检查配置
        // 不同域 直接不加密
        if (/^(http|https|ftp|data|ws|wss)/.test(url)) {
            var matchArr = url.match(/^(http|https|ftp|data|ws|wss):\/\/((?:\w|\.|-)+?)(:\d+)?\//) || [];
            // 三个组 协议 、 域名 、端口号
            var c = location.protocol + location.host;
            var p1 = matchArr[1] || '',
                h1 = (matchArr[2] || '') + (matchArr[3] || '');

            // 跨域 直接false
            if (c != p1 + ':' + h1) {
                return false;
            }
        }
        // 其他情况直接检查 是否在不需要处理的列表中
        return !inList();

        // 是否在配置的列表中
        function inList() {
            var res = false;
            $.each(_skipEncodeUrlArr, function (i, item) {
                if (url.indexOf(item) !== -1) {
                    res = true;
                    return false;
                }
            });
            return res;
        }
    }


    // 如果启用了加密  直接重新win.open方法 对传入url进行预处理
    win.originOpen = win.open;
    var supportApply = typeof win.open.apply === 'function';
    if (encodeParam) {
        win.open = supportApply ?
            function (url) {
                url = Util.encryptUrlParams(url);
                var extArgs = [].slice.call(arguments, 1);

                return win.originOpen.apply(win, [url].concat(extArgs));
            } :
            function (url) {
                url = Util.encryptUrlParams(url);
                var extArgs = [].slice.call(arguments, 1);
                if (extArgs[1] !== void 0) {
                    return win.originOpen(url, extArgs[0], extArgs[1]);
                }
                if (extArgs[0] !== void 0) {
                    return win.originOpen(url, extArgs[0]);
                }
                return win.originOpen(url);
            };
    }
})(this, Zepto);
/*
 * @Author: guotq
 * @Date: 2018-04-20 14:44:48
 * @Last Modified by: guotq
 * @Last Modified time: 2018-07-05 09:58:38
 * @Description: 关于 base64 的一些操作
 * 比如 base64 转换为 blob 对象
 * 或者 blob 对象转换成 base64
 * 去除 base64 url 部分
 * 获取 base64 url 部分
 * 获取 base64 的 mime 类型
 */

(function (exports) {
    'use strict';
    /**
     * 获取 Url 上的 hash
     *
     * @param {string} url url值
     * @returns hash
     */
    exports.getHash = function (url) {
        var idx = (url || location.href).indexOf('#');
        return idx === -1 ? '' : url.substr(idx);
    }
    /**
     * 移除 url 上的hash
     *
     * @param {string} url url值
     * @returns 移除 hash 后的 url值
     */
    exports.removeHash = function (url) {
        var idx = url.indexOf('#');
        return idx === -1 ? url : url.substring(0, idx);
    }
    /**
     * 解密 url参数 返回
     * @param {string | undefined} url 要处理的 url 为空时取当前页面url
     * @returns {string} 将参数进行解密后的url
     */
    exports.decryptUrlParams = function (url) {
        if (!url) {
            url = location.href;
        }
        var hash = Util.getHash(url);

        url = Util.removeHash(url);
        // 未加密 直接返回
        if (!Util._hasUrlEncryptedReg.test(url)) {
            return url + hash;
        }
        var params = Util._getUrlParams(url);
        return url.substr(0, url.indexOf('?') + 1) + Util._joinUrlParams(params) + hash;
    };
}(Util));