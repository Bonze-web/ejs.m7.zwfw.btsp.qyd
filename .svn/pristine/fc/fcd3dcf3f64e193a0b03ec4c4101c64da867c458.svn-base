/**
 * 作者：彭屹尧
 * 创建时间：2019-11-20 08:56:59
 * 版本：[1.0, 2019-05-13]
 * 版权：江苏国泰新点软件有限公司
 * 描述：执法人员添加
 **/

;(function (d, $) {
  'use strict'

  var isshowsearch = 0,
    token,
    keyword = '',
    chosenitem,
    chosenname = '',
    chosenvalue = ''

  var lawobjlist = Util.getExtraDataByKey('lawobjlist') || []

  Util.loadJs(
    // 下拉刷新
    'js/widgets/minirefresh/minirefresh.css',
    'js/widgets/minirefresh/minirefresh.js',
    'js/widgets/minirefresh/themes/native/minirefresh.theme.native.js',
    'js/widgets/minirefresh/minirefresh.bizlogic.js',
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
    getPersonList()
  }

  /**
   * 初始化事件监听
   */
  function initListeners() {
    // 选中
    $('#listdata').on('tap', '.listitem', function (e) {
      // 改变样式
      if (this.classList.contains('active')) {
        $(this).removeClass('active')
      } else {
        $(this).addClass('active')
      }

      var chosenitem = $('#listdata').find('.active')
      chosenitem.forEach(function (ele) {
        nameStr += ele.innerHTML + ';'
        valueStr += ele.dataset.value + ';'
      })
    })

    //搜索关键字
    ejs.navigator.setRightBtn({
      isShow: 1,
      imageUrl: '../common/img/default/img_search_nav_btn.png',
      which: 1,
      success: function (result) {
        // 显示搜索
        if (isshowsearch === 0) {
          isshowsearch = 1
          ejs.navigator.showSearchBar({
            success: function (result) {
              keyword = result.keyword
              getPersonList().refresh()
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

    //提交
    ejs.navigator.setRightBtn({
      isShow: 1,
      text: '提交',
      which: 0,
      success: function (result) {
        // 至少选中一项
        var choosedList = $("input[name='checkbox1']:checked")

        if (choosedList.length < 1) {
          ejs.ui.toast('请至少选中一项')

          return false
        }

        ejs.ui.confirm({
          title: '提示',
          message: '确定选中内容吗',
          buttonLabels: ['取消', '确定'],
          cancelable: 1,
          success: function (result) {
            if (result.which === 1) {
              //   var nameStr = '',
              //     valueStr = ''

              //   activeList.forEach(function (ele) {
              //     nameStr += ele.innerHTML + ';'
              //     valueStr += ele.dataset.value + ';'
              //   })

              //   console.log(nameStr, valueStr)

              //   ejs.page.close({
              //     // 也支持传递字符串
              //     resultData: {
              //       lawname: nameStr,
              //       lawvalue: valueStr,
              //     },
              //     success: function (result) {},
              //     error: function (error) {},
              //   })

              var lawobjlist = []

              Array.prototype.forEach.call(choosedList, function (item, index) {
                // ounamelist.push(item.dataset.ouname);
                // ouguidlist.push(item.dataset.ouguid);
                lawobjlist.push({
                  itemname: item.dataset.value,
                  itemguid: item.dataset.guid,
                })
              })
              //   ounamelist.forEach(function (item, index) {
              //     ounamestring += item + ";";
              //   });
              //   console.log(ounamestring);

              //   console.log(JSON.stringify({ lawobjlist: lawobjlist }))
              ejs.page.close(JSON.stringify({ lawobjlist: lawobjlist }))
            }
          },
        })
      },
      error: function (error) {},
    })
  }

  function getPersonList() {
    console.log('123')

    Util.ajax({
      url: Config.serverUrl + 'checkInfo/getLepList',
      data: {
        token: Config.validate,
        params: JSON.stringify({
          currentpageindex: '1',
          pagesize: '999',
          keyword: keyword,
        }),
      },
      contentType: 'application/json',
      success: function (result) {
        d.getElementById('listdata').innerHTML = Mustache.render(
          d.getElementById('listdata-person-tpl').innerHTML,
          {
            item: result.custom.personlist,
          }
        )

        var inputlist = $("input[name='checkbox1']")
        Array.prototype.forEach.call(inputlist, function (item, index) {
          var ele = item
          lawobjlist.forEach(function (item, index) {
            if (ele.dataset.guid === item.itemguid) {
              $(ele).prop('checked', true)
            }
          })
        })
      },
      error: function (error) {
        ejs.ui.toast(Config.TIPS_II)
      },
    })
  }
})(document, Zepto)
