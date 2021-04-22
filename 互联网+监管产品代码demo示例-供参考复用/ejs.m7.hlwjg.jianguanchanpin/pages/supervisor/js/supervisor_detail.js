/**
 * 作者：丁力
 * 创建时间：2019-9-7 20:58:354
 * 版本：[1.0, 2019-9-7]
 * 版权：江苏国泰新点软件有限公司
 * 描述：监管对象详细信息
 **/
'use strict';

Util.loadJs([
    'pages/common/common.js',
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
        
        self.objguid = Util.getExtraDataByKey('objguid') || '';
        self.objtype = Util.getExtraDataByKey('objtype') || '';
        self.objecttypename = Util.getExtraDataByKey('objecttypename') || '';
        if (self.objecttypename == '个体工商户' || self.objecttypename == '农专社' || self.objecttypename == '企业') {
        	Zepto('.em-objname').text(self.objecttypename);
        } else{
        	Zepto('.em-tab-list').addClass('mui-hidden');
        	
        }
        self.type = '1';
        self.getDetail();
        
        
        // 头部切换
		Zepto('.em-tab-list').on('tap','li',function(){
            var _this = this;
            self.type = Zepto(_this).attr('type');
            Zepto(_this).addClass('em-active').siblings().removeClass('em-active');
            self.getDetail();
        });

    },
//	获取详情
	getDetail: function () {
		var self = this;
		
        common.ajax({
            url: Config.serverUrl + 'checkInfo/getCheckObjDetail',
            data: {
				"objguid": self.objguid,
				"objecttype": self.objtype,
				"searchtype": self.type
			},
            // 考虑到网络不佳情况下，业务是否手动显示加载进度条
            isShowWaiting: false
        },
        function (result) {
            if (result.status.code == "1") {
                var tmp = result.custom.itemlist;
                var template = document.getElementById("template").innerHTML;
                var html = '';
                mui.each(tmp, function(key, value) {
                	html += Mustache.render(template, value);
                })
                document.getElementById("listdata").innerHTML = html;
                Zepto('.mui-content').removeClass('mui-hidden');
            }
        },
        function (error) {
            ejs.ui.toast(Config.TIPS_II);
        }, {
            isDebug: true
        });
	},
    
};