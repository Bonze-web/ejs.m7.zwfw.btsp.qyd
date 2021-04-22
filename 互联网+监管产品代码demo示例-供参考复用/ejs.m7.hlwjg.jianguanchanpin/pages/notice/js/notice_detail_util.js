/**
 * 作者： 孙尊路
 * 创建时间： 2017/06/16 13:27:09
 * 版本： [1.0, 2017/6/16]
 * 版权： 江苏国泰新点软件有限公司
 * 描述： 通知公告详情通用处理
 */

'use strict';

var NoticeDetailUtil = window.NoticeDetailUtil || (function(exports, undefined) {

    // 菜单配置
    exports.toggleTabbarMenu = {
        // 变量
        variable: {
            // 顶部菜单（我的日程、代理日程等菜单）
            tabarNode: document.querySelector('.em-tab-bar-list'),
            // 顶部高级搜索
            searchNode: document.querySelector('.em-advanced-search-wrapper'),
            // 遮罩
            maskNode: document.querySelector('.em-mask')
        },
        // 打开
        openTabbar: function() {
            var _this = this;

            // 展开tabar
            _this.variable.tabarNode.classList.remove('em-transition-vertical-up');
            _this.variable.tabarNode.classList.add('em-transition-vertical-down');
            _this.variable.tabarNode.style.height = '180px';
            // 其他层
            _this.variable.maskNode.style.display = 'block';

        },
        closeTabbar: function() {
            var _this = this;

            // 隐藏tabar
            _this.variable.tabarNode.classList.remove('em-transition-vertical-down');
            _this.variable.tabarNode.classList.add('em-transition-vertical-up');
            _this.variable.tabarNode.style.height = '0px';
            // 其他层
            _this.variable.maskNode.style.display = 'none';
        }
    };

    /**
	 * @description 动态拼接反馈列表内容
	 * @param {Object} tmpInfo
	 */
    exports.generateFeedListHtml = function(result) {
        var html = '';

        html += '<div class="em-mail-feedback-content">';
        html += '<div class="em-feedback-tab">';
        html += '<span>反馈</span>';
        html += '<span class="feedbackNum">' + result.custom.feedbacklist.length + '</span>';
        html += '</div>';
        html += '<ul class="em-mail-feedback-wrapper mui-table-view">';

        var tmpInfo = result.custom.feedbacklist;

        mui.each(tmpInfo, function(key, value) {
            html += '<li class="mui-table-view-cell em-table-view-cell" userguid="' + value.userguid + '" feedbackguid="' + value.feedbackguid + '" feedbackcontent="' + escape(value.feedbackcontent) + '">';
            // 反馈头像
            // if (!value.photourl) {
            // html += '<img class="em-feed-photo" src="../common/img/user/img_head_default_bg.png" />';

            // } else {
            html += '<img class="em-feed-photo" onerror="commonImgError(this)" alt="' + value.dispname + '" src="' + value.photourl + '" />';
            // html += '<img class="em-feed-photo" src="' + value.photourl + '" />';
            // }

            html += '<div class="em-feedback-rightwrapper">';

            // 反馈人员信息
            html += '<p class="em-feed-info">';
            html += '<span>' + value.dispname + '</span><span>(' + value.ouname + ')</span>';
            html += '</p>';

            // 反馈内容
            html += '<div class="em-feed-title">' + value.feedbackcontent + '</div>';

            // 反馈时间
            html += '<div class="em-feed-date">';

            // 反馈的最后修改时间如果为空，则显示第一次反馈时间，否则显示最新修改时间
            if (!value.lastupdatedate) {
                html += '<span>' + value.backtime + '</span>';
            } else {
                html += '<span>' + value.lastupdatedate + '</span>';
            }

            // 操作按钮（撤销）
            html += '<span class="em-feed-btn">';
            if (value.canedit == 'true') {
                // 允许撤销、修改
                html += '<span class="em-recall">撤回</span><span class="em-update">修改</span>';
            } else {
                html += '';
            }
            html += '</span>';

            html += '</div>';
            html += '</div>';
            html += '</li>';

        });
        html += '</ul>';

        return html;

    };
    /**
	 * @description 手动处理富文本内容（点击、处理表格溢出等问题）
	 * @param {Object} rootNode 处理的根节点，一般是正文内容
	 * @param {Object} options 是否开启图片预览功能
	 */
    exports.handleRichContent = function(rootNode, options) {
        // 严格判定
        if (!options) {
            options = {
                isPrevImage: false
            };
        }

        /**
		 * 处理表格溢出
		 */
        if (document.querySelector('table')) {
            document.querySelector('table').style.width = '100%';
        }

        /**
		 * 处理附件下载
		 */
        // 查找根节点下的所有A标签
        var aNodeList = rootNode.querySelectorAll('a');

        // 绑定监听
        for (var i = 0, len = aNodeList.length; i < len; i++) {
            aNodeList[i].onclick = function (e) {
                return false;
            };
            // 判断A标签是否存在IMG标签，存在则不去下载
            if (!aNodeList[i].querySelector('img')) {
                // 判断A标签是否是下载地址，否则直接打开
                if (aNodeList[i].getAttribute('href').match(/attach/gi) && aNodeList[i].getAttribute('href').match(/atta/gi).length > 0) {
                    // 绑定单击监听
                    aNodeList[i].addEventListener('tap', function (e) {
                        e.preventDefault();
                        var url = this.href;
                        var fileName = this.innerText.trim();

                        // 如果不开启下载功能，这边就走预览
                        if (Config.customize.showDown == 0) {
                        // if (Config.customize.showDown == 0) {
                            preview.openPreviewUrl({
                                url: url,
                                fileName: fileName
                            });
                        } else {
                            ejs.ui.select({
                                title: '',
                                items: ['在线预览', '下载'],
                                cancelable: 1,
                                success: function (result) {
                                    if (result.which == '0') {
                                        // 在线预览
                                        preview.openPreviewUrl({
                                            url: url,
                                            fileName: fileName
                                        });
                                    } else if (result.which == '1') {
                                        preview.downloadFile({
                                            url: url,
                                            fileName: fileName,
                                            reDownloaded: 1,
                                        }, function () {
                                            ejs.ui.toast('文件下载完成');
                                        });
                                    }
                                }
                            });
                        }


                    });
                } else {
                    aNodeList[i].addEventListener('tap', function (e) {
                        ejs.page.open({
                            pageUrl: this.getAttribute('href'),
                            pageStyle: 1,
                            orientation: 1,
                            data: {
                                key1: 'value1'
                            },
                            success: function (result) {}
                        });
                    });

                }
            }
        }

        /**
		 * 处理图片预览
		 */
        if (options.isPrevImage) {
            // 查找根节点下的所有img标签
            var imgNodeList = rootNode.querySelectorAll('img');
            var imgArray = [];

            for (var i = 0, len = imgNodeList.length; i < len; i++) {
                // 设置随机函数，保证每一张图片的唯一性
                // imgNodeList[i].src = imgNodeList[i].src + "?" + Math.random();

                imgArray.push(imgNodeList[i].src);
            }
            // 绑定事件
            for (var i = 0, len = imgNodeList.length; i < len; i++) {
                imgNodeList[i].addEventListener('tap', function(e) {
                    var _src = this.src;

                    for (var j = 0; j < imgArray.length; j++) {
                        if (imgArray[j] == _src) {
                            // 从当前图片索引项开始预览
                            ejs.util.prevImage({
                                // 默认显示图片序号
                                index: j,
                                // 是否显示删除按钮，1：显示，0：不显示，默认不显示。如果显示按钮则自动注册回调事件。
                                showDeleteButton: 0,
                                // 图片地址，json数组格式，item为元素本地地址， 支持本地图片(选择API选择的图片)和网络图片
                                selectedPhotos: imgArray,
                                success: function(result) {
                                    // ejs.ui.toast(JSON.stringify(result));
                                },
                                error: function(error) {
                                    ejs.ui.toast('失败:' + JSON.stringify(error));
                                }
                            });
                            /* ejs.io.selectFile({
                                success: function (result) {
                                },
                                error: function (error) {}
                            }); */
                        }
                    }
                });
            }

        }

    };

    /**
	 * 兼容require
	 */
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = exports;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function() {
            return exports;
        });
    }

    return exports;
})({});