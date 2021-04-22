/**
 * 作者: 戴荔春
 * 创建时间: 2017/12/11
 * 版本: [1.0, 2017/12/11 ]
 * 版权: 江苏国泰新点软件有限公司
 * 描述: 配置文件，可以用来放置一些业务相关配置代码（仍然是基于config的拓展）
 * cssboot中需开启isUseConfig（否则不会引入）
 * 注意⚠️：一些通用全局配置在cssboot中
 * 这个文件中也可以拓展自己项目的相关业务配置
 */
(function(exports) {
	/**
	 * 这里是ajax的全局变量，影响所有请求，当然了，每次请求时，可以单独覆盖一些配置，只影响单次请求
	 * Util.ajax中的参数优先级要大于全局配置
	 */
	exports.ajax = {
		// 是否默认处理错误返回信息
		// 如果开启，框架会处理一些默认的返回错误,并提示（非200情况下），处理的错误码如下
		// 400，401，403，404，500，503
		isAutoDealError: true,
		// 是否开启自动弹窗提示，isAutoDealError为true时才生效
		isAutoToast: true,
		// 每次 ajax时，也可以增加isAutoProxy:false，来让本次请求不代理
		// 是否自动代理，如果开启，所有的请求会默认带上用户相关信息，h5是cookie中，app是headers中
		// 如果非新点标准后台，请关闭，否则会影响正常请求
		// 登陆地址譬如：http://218.4.136.114:8089/oarest9V7/fui/pages/themes/dream/dream
		isAutoProxy: true
	};

	/**
	 * v6中针对ejs.oauth.getToken接口的定制
	 * 可以修改getToken返回的值，方便v6中调试
	 * v7中开发人员无需关注token（通过ajax自动代理进行设置）
	 */
	exports.token = {
		// token的过期时间，防止页面的token过期，单位为秒
		// H5下动态获取时才会有缓存
		duration: 7200,
		// 可以是字符串，也可以是方法
		// 字符串的话直接可以使用，函数的话 通过success回调返回
		// 只是H5下有效，ejs下默认就是容器的token，不容改变
		getToken: function(success) {
			success('RXBvaW50X1dlYlNlcml2Y2VfKiojIzA2MDE=');
		}
	};

	/**
	 * 设置在非EJS容器环境下
	 * EJS的配置项的一些默认值，存在localStorage中
	 * 通过ejs.storage.getItem获取的
	 * 用来方便开发
	 */
	exports.webEjsEnvStore = {
		oaName: '移动研发部'
	};
	
	/**
     * 配置个性化功能模块开关
     * 0:关闭，1:打开
     * 代理日程 agent
     * 内页搜索 pageSearch
     * 底部操作下一步 newBar
     * 附件显示下载按钮 showDown
     * 是否打开原生工作流组件 openEpointWorkflow
     * 是否启用百度SDK定位
     */
    exports.customize = {
        agent: '1',
        pageSearch: '1',
        newBar: '1',
        showDown: '0',
        openEpointWorkflow: '0',
        isCustomLocation : '1',
        isAttachEdit: '0'
    };

	/**
	 * commondto的配置
	 * 用于适配基于f9的业务action
	 */
	var comdto = {
		// 是否使用配置，使用的话使用配置里的rootUrl，否则使用f9默认的
		isUseConfig: true,
		isRestFul: true,
		rootUrl: './',
		// 是否模拟数据
		isMock: true,
		// ajax请求方式，'post'/'get'
		requestMethod: ''
	};

	if(comdto.isRestFul) {
		comdto.rootUrl += 'rest/';
	}

	exports.comdto = comdto;

	/**
	 * 业务接口相关的配置
	 */
	var bizlogic = {
		// 是否是正式
		isFormal: false,
		// 正式的接口地址
		serverUrlFormal: 'http://221.131.80.146:8088/zjjgpt/rest/',
		// 测试的接口地址
		// serverUrlTest: 'http://192.168.210.20:8088/audit-jgapp-web/rest/',
		serverUrlTest: 'http://192.168.204.46:8040/audit-ydjg-web/rest/',
		
		// 正式的接口地址
		serverFileUrlFormal: 'http://221.131.80.146:8088/zjjgpt/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=',
		// 测试的接口地址
		serverFileUrlTest: 'http://192.168.210.20:8088/audit-jgapp-web/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid='
	};

	exports.serverUrl = bizlogic.isFormal ? bizlogic.serverUrlFormal : bizlogic.serverUrlTest;
	exports.urlstr = bizlogic.isFormal ? bizlogic.serverFileUrlFormal : bizlogic.serverFileUrlTest;
	exports.validate = 'Epoint_WebSerivce_**##0601';
	exports.areacode = '320000';

	/**
	 *初始化校验，必须调用
	 *注，如果没有组件API需要注册，可以传空，注册组件时，必须容器支持对应组件才能注册成功
	 */
	exports.configReady = function(jsApiList, successCallback, errorCallback) {
		var tmpApiList = jsApiList || [];
		ejs.config({
			// 注，jsApiList中key代表模块，其中value为对应类的包名，Android和iOS下有区别
			jsApiList: tmpApiList

		});
		ejs.error(function(error) {
			// 说明: 可以捕获相应的错误，例如，验证失败会触发error，原生容器捕获到异常错误也会触发
			//ejs.ui.toast("ejs register error: " + JSON.stringify(error));
			if(errorCallback && typeof(errorCallback) == "function") {
				errorCallback(error);
			}
		});
		ejs.ready(function() {
			// 执行成功回调
			successCallback && successCallback();
		});

	};

	/**
	 * ======================================================
	 *  错误提示信息
	 * 日志、网络错误，提示
	 * ======================================================
	 */
	exports.TIPS_I = "网络连接超时，请检查...";
	exports.TIPS_II = "网络连接超时， 请联系管理员！";
	exports.TIPS_III = "服务器正在维护中，请稍后访问...";
})(Config);