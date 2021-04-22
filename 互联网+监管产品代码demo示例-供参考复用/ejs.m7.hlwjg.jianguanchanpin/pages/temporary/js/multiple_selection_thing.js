/**
 * 作者：彭屹尧
 * 创建时间：2019-11-20 08:56:59
 * 版本：[1.0, 2019-05-13]
 * 版权：江苏国泰新点软件有限公司
 * 描述：监管事项添加
 **/

;(function (d, $) {
  'use strict'

  var isshowsearch = 0,
    token,
    keyword = ''

  var jgobjlist = Util.getExtraDataByKey('jgobjlist') || []

  console.log(jgobjlist)
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
    getThingList()
  }

  /**
   * 初始化事件监听
   */
  function initListeners() {
    // 选中

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
              getThingList().refresh()
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

              //   addJgThings(valueStr)
              // 获取选中的部门
              //   var checkedlist = $("input[name='checkbox1']:checked")
              //   console.log(checkedlist)
              //   var ounamelist = [],
              //     ouguidlist = [];
              var jgobjlist = []

              Array.prototype.forEach.call(choosedList, function (item, index) {
                // ounamelist.push(item.dataset.ouname);
                // ouguidlist.push(item.dataset.ouguid);
                jgobjlist.push({
                  itemname: item.dataset.value,
                  itemguid: item.dataset.guid,
                })
              })
              //   ounamelist.forEach(function (item, index) {
              //     ounamestring += item + ";";
              //   });
              //   console.log(ounamestring);

              //   console.log(JSON.stringify({ jgobjlist: jgobjlist }))
              ejs.page.close(JSON.stringify({ jgobjlist: jgobjlist }))
            }
          },
        })
      },
      error: function (error) {},
    })
  }

  // 获取监管事项

  function getThingList() {
    Util.ajax({
      url: Config.serverUrl + 'checkInfo/getCheckCimList',
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
          d.getElementById('listdata-thing-tpl').innerHTML,
          {
            item: result.custom.objectlist,
          }
        )
        var inputlist = $("input[name='checkbox1']")
        Array.prototype.forEach.call(inputlist, function (item, index) {
          var ele = item
          jgobjlist.forEach(function (item, index) {
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

  // 提交
  //   function addJgThings(cimguid) {
  //     Util.ajax({
  //       url: Config.serverUrl + 'checkInfo/randomdtycimadd',
  //       data: {
  //         token: Config.validate,
  //         params: JSON.stringify({
  //           dtyguid: dutyguid,
  //           cimguid: cimguid,
  //         }),
  //       },
  //       contentType: 'application/json',
  //       success: function (result) {
  //         console.log(result)
  //         if (result.status.code !== 1) {
  //           ejs.ui.toast(result.status.text)
  //           return
  //         }
  //         ejs.ui.toast('添加成功')

  //         ejs.page.close({
  //           // 也支持传递字符串
  //           resultData: 'value',
  //           success: function (result) {
  //             /**
  //              * 回调内请不要做UI显示相关的事情
  //              * 因为可能刚回调页面就关闭了
  //              */
  //           },
  //           error: function (error) {},
  //         })
  //       },
  //       error: function (error) {
  //         ejs.ui.toast(Config.TIPS_II)
  //       },
  //     })
  //   }
})(document, Zepto)
