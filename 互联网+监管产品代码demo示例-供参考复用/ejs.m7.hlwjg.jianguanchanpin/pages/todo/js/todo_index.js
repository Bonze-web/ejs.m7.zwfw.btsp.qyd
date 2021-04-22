/**
 * 作者：解宇
 * 创建时间：2019-09-05
 * 版本：[1.0, 2019-09-05]
 * 版权：江苏国泰新点软件有限公司
 * 描述：检查任务-列表
 **/

;(function (d, $) {
  'use strict'

  var token,
    isshowsearch = 0,
    keyword = '',
    minirefreshObj = null, // 下拉刷新实例
    flag = '0', // 1为扫码进入，其他均为正常进去
    dutyguid = '' // 任务标识

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
          dutyguid = Util.getExtraDataByKey('dutyguid') || ''
          flag = Util.getExtraDataByKey('flag') || '0'

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
    // 当页面重新可见并可以交互时
    ejs.event.registerEvent({
      key: 'resume',
      success: function (result) {
        /**
         * 对应事件发生时会触发回调
         */
        minirefreshObj.refresh()
      },
      error: function (error) {},
    })

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
  }

  /**
   * 下拉刷新
   * @param {String} url 接口地址
   */
  function pullToRefresh() {
    minirefreshObj = new MiniRefreshBiz({
      url: Config.serverUrl + 'checkInfo/getWaitHandleCheckTaskList',
      initPageIndex: 1,
      contentType: 'application/json',
      //   theme: MiniRefreshTools.theme.defaults,
      dataRequest: function (currPage) {
        var requestData = {
          flag: flag,
          dutyguid: dutyguid,
          title: keyword,
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
        console.log(res)
        if (res.status.code != 1) {
          ejs.ui.toast(res.status.text)

          return
        }

        return res.custom.waithandlelist
      },
      itemClick: function (e) {
        console.log(this.dataset.mobilehandleurltype)
        var linkurl = ''
        var status = ''

        //				if(this.dataset.canhandle == '0') {
        //					ejs.ui.toast('请在pc端处理');
        //					return;
        //				}

        switch (this.dataset.mobilehandleurltype) {
          case '1': // 任务接收
            linkurl = '../inspection/inspection_detail_done.html'
            status = '30'
            break
          case '2': // 任务反馈
            linkurl = '../inspection/inspection_detail.html'
            status = ''
            break
          case '3': // 简易案件登记
            linkurl = '../easycase/easycase_todo_register.html'
            status = ''
            break
          case '4': // 任务整改
            linkurl = '../reform/reform_detail.html'
            status = ''
            break
          default:
            break
        }

        if (this.dataset.mobilehandleurltype == '3') {
          ejs.page.open({
            pageUrl: linkurl,
            pageStyle: 1,
            orientation: 1,
            data: {
              rowguid: this.dataset.rowguid,
              pviguid: this.dataset.pviguid,
            },
            success: function (result) {
              //							minirefreshObj.refresh();
            },
            error: function (error) {},
          })
        } else if (this.dataset.mobilehandleurltype == '4') {
          ejs.page.open({
            pageUrl: linkurl,
            pageStyle: 1,
            orientation: 1,
            data: {
              infotype: '0',
              rowguid: this.dataset.rowguid,
            },
            success: function (result) {
              //							minirefreshObj.refresh();
            },
            error: function (error) {},
          })
        } else {
          ejs.page.open({
            pageUrl: linkurl,
            pageStyle: 1,
            orientation: 1,
            data: {
              status: status,
              rowguid: this.dataset.rowguid,
            },
            success: function (result) {
              //							minirefreshObj.refresh();
            },
            error: function (error) {},
          })
        }
      },
    })
  }
})(document, Zepto)
