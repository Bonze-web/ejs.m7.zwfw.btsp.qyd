/**
 * 作者：彭屹尧
 * 创建时间：2019-11-20 08:56:59
 * 版本：[1.0, 2019-05-13]
 * 版权：江苏国泰新点软件有限公司
 * 描述：执法人员添加
 **/

;(function (d, $) {
  'use strict'
  var token
  // 定义模板
  var minirefreshObj = null,
    keyword = ''
  var objecttype = Util.getExtraDataByKey('objecttype') || 'com'
  Util.loadJs(
    [
      'js/widgets/minirefresh/minirefresh.css',
      'js/widgets/minirefresh/minirefresh.js',
    ],
    'js/widgets/minirefresh/minirefresh.bizlogic.js',
    // 'js/widgets/minirefresh/themes/native/minirefresh.theme.native.js',
    function () {
      Config.configReady(
        [],
        function () {
          ejs.auth.getToken({
            success: function (result) {
              token = result.access_token
              // 初始化页面信息
              initPage()
            },
          })
        },
        function (err) {}
      )
    }
  )

  // 初始化页面信息
  function initPage() {
    // 初始化事件监听
    initListeners()
    pullToRefresh()
  }

  /**
   * 初始化事件监听
   */
  function initListeners() {
    $('body')
      .on('change', '.em-srhbar-input', function () {
        keyword = $(this).val()
        minirefreshObj.refresh()
      })
      .on('tap', '.listitem', function () {
        var itemname = this.dataset.itemname
        var itemguid = this.dataset.itemguid
        ejs.page.close({
          // 也支持传递字符串
          resultData: {
            itemname: itemname,
            itemguid: itemguid,
          },
          success: function (result) {},
          error: function (error) {},
        })
      })
  }

  // 列表下拉刷新
  function pullToRefresh() {
    minirefreshObj = new MiniRefreshBiz({
      url: Config.serverUrl + 'checkInfo/getCheckObjList',
      initPageIndex: 1,
      //   theme: MiniRefreshTools.theme.defaults,
      dataRequest: function (currPage) {
        var requestData = {
          token: Config.validate,
          params: JSON.stringify({
            currentpageindex: currPage.toString(),
            pagesize: 10,
            objecttype: objecttype,
            keyword: keyword,
          }),
        }
        return requestData
      },
      dataChange: function (res) {
        if (res.status.code != 1) {
          ejs.ui.toast(res.status.text)
          return
        }
        return res.custom.objectlist
      },
      success: function () {},
      itemClick: function () {},
    })
  }
})(document, Zepto)
