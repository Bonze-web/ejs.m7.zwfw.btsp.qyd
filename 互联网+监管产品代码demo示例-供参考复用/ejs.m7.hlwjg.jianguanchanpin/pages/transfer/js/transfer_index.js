/**
 * 作者：解宇
 * 创建时间：2019-12-06
 * 版本：[1.0, 2019-12-06]
 * 版权：江苏国泰新点软件有限公司
 * 描述：抄告移交-列表
 **/

;(function (d, $) {
  'use strict'

  var token,
    type = '1', // tab状态
    status = '',
    istodo = '1',
    isshowsearch = 0,
    keyword = '',
    minirefreshObj = null, // 下拉刷新实例
    tabstatus = '1', //tab状态-判断是否显示接收按钮
    tabstatus2 = '0',
    itemstatus = '0' //事项状态-判断是否显示完成状态

  Util.loadJs(
    // 下拉刷新
    'js/widgets/minirefresh/minirefresh.css',
    'js/widgets/minirefresh/minirefresh.js',
    // 'js/widgets/minirefresh/themes/native/minirefresh.theme.native.js',
    'js/widgets/minirefresh/minirefresh.bizlogic.js',
    function () {
      Config.configReady(
        [],
        function () {
          // 初始化事件监听
          initListeners()
          // 下拉刷新
          pullToRefresh()
        },
        function (err) {}
      )
    }
  )

  /**
   * 初始化事件监听
   */
  function initListeners() {
    ejs.navigator.setRightBtn({
      isShow: 1,
      imageUrl: '../common/img/default/img_search_nav_btn.png',
      which: 0,
      success: function (result) {
        // 显示搜索
        if (isshowsearch === 0) {
          isshowsearch = 1
          ejs.navigator.showSearchBar({
            success: function (result) {
              keyword = result.keyword
              minirefreshObj.refresh()
            },
            error: function (error) {},
          })
        } else {
          // 隐藏按钮
          isshowsearch = 0
          ejs.navigator.hideSearchBar({
            success: function (result) {},
            error: function (error) {},
          })
        }
      },
      error: function (error) {},
    })

    // 头部切换
    $('#head').on('tap', '.headitem', function (e) {
      // 改变样式
      $('#head').find('.headactive').removeClass('headactive')
      $(this).addClass('headactive')

      // 刷新列表
      type = this.dataset.type

      if (type == '1') {
        istodo = '1'
      } else {
        istodo = '0'
      }

      minirefreshObj.refresh()
    })
  }

  /**
   * 下拉刷新
   * @param {String} url 接口地址
   */
  function pullToRefresh() {
    minirefreshObj = new MiniRefreshBiz({
      url: Config.serverUrl + 'copytransferinfo/getcopytransferlist',
      initPageIndex: 1,
      contentType: 'application/json',
      dataRequest: function (currPage) {
        var requestData = {
          status: '',
          type: type,
          searchkey: keyword,
          currentpageindex: currPage.toString(),
          pagesize: '10',
        }

        var data = JSON.stringify({
          token: Config.validate,
          params: requestData,
        })

        return data
      },
      dataChange: function (res) {
        if (res.status.code != 1) {
          ejs.ui.toast(res.status.text)

          return
        }

        return res.custom.taskinfolist
      },
      itemClick: function (e) {
        e.stopPropagation()

        ejs.page.open({
          pageUrl: './transfer_detail.html',
          pageStyle: 1,
          orientation: 1,
          data: {
            rowguid: this.dataset.rowguid,
            istodo: istodo,
          },
          success: function (result) {
            minirefreshObj.refresh()
          },
          error: function (error) {},
        })
      },
    })
  }
})(document, Zepto)
