/**
 * 作者：彭屹尧
 * 创建时间：2019-11-20 08:56:59
 * 版本：[1.0, 2019-05-13]
 * 版权：江苏国泰新点软件有限公司
 * 描述：随机检查 列表
 **/

;(function (d, $) {
  'use strict'

  var minirefreshObj = null // 下拉刷新实例

  Util.loadJs(
    // 下拉刷新
    'js/widgets/minirefresh/minirefresh.css',
    'js/widgets/minirefresh/minirefresh.js',
    // 'js/widgets/minirefresh/themes/native/minirefresh.theme.native.js',
    'js/widgets/minirefresh/minirefresh.bizlogic.js',
    function () {
      ejs.auth.getToken({
        success: function (result) {
          console.log(result.access_token)
        },
        error: function (error) {},
      })

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
    // 新增跳转
    $('body').on('tap', '.add', function(e) {
		ejs.page.open({
			pageUrl: './temporary_add.html',
			pageStyle: 1,
			orientation: 1,
			data: {
				// status: this.dataset.status,
				rowguid: this.dataset.rowguid,
			},
			success: function(result) {
				minirefreshObj.refresh()
			},
			error: function(error) {},
		})
	})
}
  
  /**
   * 下拉刷新
   * @param {String} url 接口地址
   */
  function pullToRefresh() {
    console.log(123)

    minirefreshObj = new MiniRefreshBiz({
      url: Config.serverUrl + 'checkInfo/randomdtylist',
      initPageIndex: 1,
      contentType: 'application/json',
      // theme: MiniRefreshTools.theme.defaults,
      dataRequest: function (currPage) {
        var requestData = {
          check_action_name: '',
          check_action_code: '',
          administrative_cp: '',
          currentpageindex: currPage,
          pagesize: '20',
        }

        var data = JSON.stringify({
          token: Config.validate,
          params: requestData,
        })

        console.log(data)

        return data
      },
      dataChange: function (res) {
        console.log(res)
        return res.custom.randomdtyList
      },
      itemClick: function (e) {
        ejs.page.open({
          pageUrl: './temporary_details.html',
          pageStyle: 1,
          orientation: 1,
          data: {
            status: this.dataset.status,
            rowguid: this.dataset.rowguid,
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
