/**
 * 作者：解宇
 * 创建时间：2019-09-05
 * 版本：[1.0, 2019-09-05]
 * 版权：江苏国泰新点软件有限公司
 * 描述：检查任务-列表
 **/

;(function (d, $) {
  'use strict'

  var type = '1', // tab状态
    sectype = '00', // 二级tab
    isshowsearch = 0,
    minirefreshObj = null // 下拉刷新实例

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
    $('#listdata').on('tap', 'li', function (e) {
      var id = this.id
      if (type == '3') {
        ejs.page.open('./unusual_detail.html', {
          guid: id,
        })
      }
    })

    ejs.navigator.setRightBtn({
      isShow: 1,
      imageUrl: '../common/img/default/img_search_nav_btn.png',
      which: 0,
      success: function (result) {
        ejs.page.open('./unusual_search.html')
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
      console.log('type=' + type)

      if (type == '3') {
        Zepto('#second')[0].classList.remove('mui-hidden')
        console.log(Zepto('#second')[0].classList)
      } else {
        Zepto('#second')[0].classList.add('mui-hidden')
      }

      minirefreshObj.refresh()
    })

    // 二级tab切换
    $('#second').on('tap', '.seconditem', function (e) {
      // 改变样式
      $('#second').find('.secondactive').removeClass('secondactive')
      $(this).addClass('secondactive')

      // 刷新列表
      sectype = this.dataset.sectype
      console.log('sectype=' + sectype)

      minirefreshObj.refresh()
    })

    $('#listdata').on('tap', '.collapse-txt', function (e) {
      e.stopPropagation()
      if ($(this).hasClass('status-open')) {
        //展开
        $(this)
          .removeClass('status-open')
          .addClass('status-close')
          .parents('.collapse-btn')
          .siblings('.collapse-wrap')
          .removeClass('mui-hidden')
        $(this).children('.statustxt').text('收起')
      } else {
        $(this)
          .removeClass('status-close')
          .addClass('status-open')
          .parents('.collapse-btn')
          .siblings('.collapse-wrap')
          .addClass('mui-hidden')
        $(this).children('.statustxt').text('展开')
      }
    })
  }

  /**
   * 下拉刷新
   * @param {String} url 接口地址
   */
  function pullToRefresh() {
    minirefreshObj = new MiniRefreshBiz({
      url: Config.serverUrl + 'exceptionlistinfo/getExceptionList',
      initPageIndex: 1,
      contentType: 'application/json',
      template: getTemp,
      dataRequest: function (currPage) {
        var requestData = {
          type: type,
          currentpageindex: currPage.toString(),
          pagesize: '10',
        }

        if (type == '3') {
          requestData.lhcjtype = sectype
        }

        requestData = JSON.stringify(requestData)
        var data = JSON.stringify({
          token: Config.validate,
          params: requestData,
        })
        console.log(
          data,
          Config.serverUrl + 'exceptionlistinfo/getExceptionList'
        )
        return data
      },
      dataChange: function (res) {
        if (res.status.code != 1) {
          ejs.ui.toast(res.status.text)

          return
        }

        var arr = res.custom.recordlist

        if (type == '3') {
          for (var i in arr) {
            if (arr[i].type == '01') {
              arr[i].name = '身份证号码：'
              arr[i].nameval = arr[i].idnumber
              arr[i].status = 'status2'
              arr[i].statusname = '个人'
            } else {
              arr[i].name = '统一信用代码：'
              arr[i].nameval = arr[i].socialcode
              arr[i].status = 'status1'
              arr[i].statusname = '企业'
            }
          }
        }

        return res.custom.recordlist
      },
      itemClick: function (e) {
        e.stopPropagation()
      },
    })
  }

  function getTemp() {
    var temp = ''
    if (type == '1' || type == '2') {
      temp = document.getElementById('item-template1').innerHTML
    } else {
      temp = document.getElementById('item-template3').innerHTML
    }
    return temp
  }
})(document, Zepto)
