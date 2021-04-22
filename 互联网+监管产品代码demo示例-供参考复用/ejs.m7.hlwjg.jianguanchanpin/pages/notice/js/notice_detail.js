/**
 * 作者:孙尊路
 * 创建时间:2017/08/26 14:36:53
 * 版本:[1.0, 2017/8/26]
 * 版权:江苏国泰新点软件有限公司
 * 描述:通知公告详情
 */
'use strict';
Util.loadJs([
    'js/utils/util.charset.js',
    'js/utils/util.storage.js',
    'pages/common/common.js',
    'pages/common/preview.js',
    'pages/common/formatfile.js',
    'pages/common/util.string_extend.js',
    'pages/common/qr_add_longtap_event.js',
    'pages/notice/js/notice_detail_util.js',
    'pages/common/libs/wangEditor.js',

    // 滚动到顶部插件
    'pages/common/libs/jquery-3.2.1.min.js',
    'pages/common/libs/gotop.js',
], function () {
    customBiz.configReady();
});

/**
 * @description 所有业务处理
 */
var customBiz = {
    // 初始化校验，必须调用
    // 注，如果没有组件API需要注册，可以传空，注册组件时，必须容器支持对应组件才能注册成功
    configReady: function () {
        var self = this;

        Config.configReady(null, function () {
            self.initListeners();
        }, function (error) {});
    },

    initListeners: function () {
        var self = this;
        
        self.infoid = Util.getExtraDataByKey('infoid') || '',
        self.getNoticeDetail();
    },
    /**
     * @description 获取基本详情
     * @param {Object} infoguid 信息唯一GUid
     */
    getNoticeDetail: function () {
        var self = this;

        common.ajax({
            url: Config.serverUrl + 'centerInfo/getInfoDetail',
            data: {
                'infoid': self.infoid // 唯一标识
            },
            // 考虑到网络不佳情况下，业务是否手动显示加载进度条
            isShowWaiting: false
        },
        function (result) {
            if (result.status.code == '1') {
                Zepto('.mui-content').css('display', 'block');
                var tmpInfo = result.custom;
                // 顶部标题、发布人、发布时间等信息
                var topTemplate = document.getElementById('top-Template').innerHTML;
                var topOutput = Mustache.render(topTemplate, tmpInfo);

                Zepto('#topContent').html(topOutput);
                if (tmpInfo.infocontent && tmpInfo.infocontent != '') {
                    Zepto('.em-content').html(tmpInfo.infocontent);
                } else {
                    Zepto('.em-content').css('display', 'none');
                }
                // 详情中图片预览处理
                var contentNode = document.querySelector('.em-content');

                // 手动处理富文本信息
                NoticeDetailUtil.handleRichContent(contentNode, {
                    'isPrevImage': true // 支持预览
                });

                // 正文里是否有图片
                var imgLength = Zepto('.mui-scroll-wrapper img').length;
            } else {
            	ejs.ui.toast(result.status.text);
            }
        },
        function (error) {
            ejs.ui.toast(Config.TIPS_II);
        }, {
            isDebug: true
        });

    },

};