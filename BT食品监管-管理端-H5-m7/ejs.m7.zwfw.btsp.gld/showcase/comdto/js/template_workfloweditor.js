(function () {
  'use strict';

  // 流程固定 guid
  var processguid = Util.getExtraDataByKey('processguid') || '1b232853-6516-4fe2-9293-6fcd2f55800b';
  // OA接口地址
  var serverUrl = window.serverUrl;
  // 当前活动 guid
  var activityguid = '';
  // 当前活动名称
  var activityname = '';
  // 当前活动显示名称
  var activityDisplayName = '';
  // 30 为单一:只能选择一个分支送达
  var splitType = '';
  // 工作项 guid
  var workitemguid = '';
  // 流程实例Guid
  var pviguid = '';
  // 流程实例Guid
  var messageitemguid = '';
  // 当前步骤是否能手写签批，1可以0不可以
  var canpdfsign = null;
  // TODO: 测试用 access_token
  var access_token = '';

  /**
   * 初始化页面
   */
  function initPage() {
    if (processguid == '') {
      Util.ejs.ui.alert('processguid 为空，请联系OA接口开发询问流程 guid');
      return;
    }

    // 新增、启动流程
    startProcess();
    // 设置原生导航栏右侧按钮
    setNativeRightBtn();
  }

  /**
   * TODO: 测试用获取身份验证
   */
  function getAutorization() {
    Util.ajax({
      url: 'http://work.epoint.com.cn:8089/epoint-sso-web/rest/oauth2/token?client_id=b6418567-5d35-4e0b-8633-9d7cc1058d54&client_secret=e4e0744d-fb41-4dea-9304-d4a49704e585&scope=basic&grant_type=password&platform=mobile&username=admin&password=112D9DBE13E25B23E65574AA6C8C0F0B69CD44FF',
      data: {},
      contentType: 'application/x-www-form-urlencoded',
      success: function (response) {
        access_token = response.custom.access_token;
        initPage();
      }
    });
  }

  /**
   * 启动工作流程
   */
  function startProcess() {
    Util.ajax({
      url: serverUrl + 'handle_startprocess_v7',
      data: {
        params: JSON.stringify({
          processguid: processguid
        })
      },
      contentType: 'application/x-www-form-urlencoded',
      dataPath: 'custom',
      headers: {
        Authorization: 'Bearer ' + access_token
      },
      timeout: 10000,
      encryptParams: true,
      success: function (response) {
        if (response.code == 1) {
          var data = response.data;

          /**
           * 活动信息
           */
          var activityinfo = data.activityinfo;

          // 当前活动Guid
          activityguid = activityinfo.activityguid;
          // 当前活动名称
          activityname = activityinfo.activityname;
          // 当前活动显示名称
          activityDisplayName = activityinfo.activitydispname;
          // 30为单一:只能选择一个分支送达
          splitType = activityinfo.splittype;
          // 当前步骤是否能手写签批，1可以0不可以
          canpdfsign = activityinfo.canpdfsign;

          /**
           * 处理代办或已办信息
           */
          var waithandleinfo = data.waithandleinfo;
          
        }
      },
      error: function () {
        Util.ejs.ui.toast('网络连接超时， 请联系管理员！');
      }
    });
  }

  /**
   * 设置原生导航栏右侧按钮
   */
  function setNativeRightBtn() {
    ejs.navigator.setRightBtn({
      which: 0,
      text: '提交',
      // 设置图片的优先级会较高
      success: function (result) {
        // 先只考虑新增的情况
        openOperation();
      }
    });
  }

  /**
   * 弹出送下一步的流程按钮 ActionSheet 
   */
  function openOperation() {

  }

  // TODO: 测试用获取身份验证
  getAutorization();
}());