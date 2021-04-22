/**
 * 作者：顾家昊
 * 创建时间：2019-09-05
 * 版本：[1.0, 2019-09-05]
 * 版权：江苏国泰新点软件有限公司
 * 描述：检查任务-搜索
 **/

;(function (d, $) {
  'use strict'

  var type = '',
    keysarr = []

  Util.loadJs(
    // 下拉刷新
    'js/widgets/minirefresh/minirefresh.css',
    'js/widgets/minirefresh/minirefresh.js',
    function () {
      Config.configReady(
        [],
        function () {
          // 初始化事件监听
          ejs.storage.getItem({
            key: 'keysarr', // 或者 ['key1', 'akey2']
            success: function (result) {
              if (result.keysarr && result.keysarr != '') {
                keysarr = JSON.parse(result.keysarr)
                console.log(JSON.stringify(keysarr))
              }
              initListeners()
              renderKey()
            },
          })
        },
        function (err) {}
      )
    }
  )

  /**
   *@description 渲染热key
   */
  function renderKey() {
    var temp = document.getElementById('keytemp').innerHTML
    var rendered = Mustache.render(temp, {
      items: keysarr,
    })

    if (keysarr[0] && keysarr != '') {
      document.getElementById('history-ul').innerHTML = rendered
    } else {
      document.getElementById('history-ul').innerHTML = ''
    }
  }

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

    $('#blacklist').on('tap', 'li', function (e) {
      var id = this.id

      ejs.page.open('./unusual_detail.html', {
        guid: id,
      })
    })

    var _input = document.getElementById('keyword')

    $('#history-ul').on('tap', 'li', function (e) {
      _input.value = this.innerText
      $('#searchcont').addClass('mui-hidden')
      search(_input.value)
    })

    $(_input).on('change', function (e) {
      var ishsa = -1
      for (var i in keysarr) {
        if (keysarr[i].val == _input.value.trim()) {
          ishsa = 1
          break
        }
      }

      if (_input.value.trim() != '' && ishsa == -1) {
        if (keysarr.length > 2) {
          keysarr.pop()
        }
        keysarr.unshift({
          val: _input.value,
        })

        ejs.storage.setItem({
          keysarr: JSON.stringify(keysarr),
          success: function (result) {
            $('#cont').removeClass('mui-hidden')
            $('#searchcont').addClass('mui-hidden')
            renderKey()
            search(_input.value)
          },
          error: function (error) {},
        })
      }

      if (ishsa == 1) {
        $('#cont').removeClass('mui-hidden')
        $('#searchcont').addClass('mui-hidden')
        renderKey()
        search(_input.value)
      }
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

    $('#illegalmsglist').on('tap', '.collapse-txt', function (e) {
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

    $('#exceptionlist').on('tap', '.collapse-txt', function (e) {
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

    //记录搜索
    $('.choose').on('tap', '.choose-item', function (e) {
      var name = this.innerText,
        ishsa = -1
      type = this.dataset.type

      $('#sel').removeClass('mui-hidden')

      for (var i in keysarr) {
        if (keysarr[i].val == _input.value.trim()) {
          ishsa = 1
          break
        }
      }

      if (_input.value.trim() != '' && ishsa == -1) {
        if (keysarr.length > 2) {
          keysarr.pop()
        }
        keysarr.unshift({
          val: _input.value,
        })

        ejs.storage.setItem({
          keysarr: JSON.stringify(keysarr),
          success: function (result) {
            $('#cont').removeClass('mui-hidden')
            $('#searchcont').addClass('mui-hidden')
            $('#unisialtit').text(name)
            renderKey()
            search(_input.value)
          },
          error: function (error) {},
        })
      }

      if (ishsa == 1 || _input.value.trim() == '') {
        $('#cont').removeClass('mui-hidden')
        $('#searchcont').addClass('mui-hidden')
        $('#unisialtit').text(name)
        renderKey()

        if (_input.value.trim() != '') {
          search(_input.value)
        }
      }
    })
    // input取消
    $('#chanel').on('tap', function (e) {
      console.log(1111)
      _input.value = ''
      type = ''
      if (!$('#cont').hasClass('mui-hidden')) {
        $('#cont').addClass('mui-hidden')
        $('#searchcont').removeClass('mui-hidden')
      }
      if (!$('#all').hasClass('mui-hidden')) {
        $('#all').addClass('mui-hidden')
        $('#searchcont').removeClass('mui-hidden')
      }
      document.getElementById('illegalmsglist').innerHTML = ''
      document.getElementById('blacklist').innerHTML = ''
      document.getElementById('exceptionlist').innerHTML = ''
      document.getElementById('listdata').innerHTML = ''

      setTimeout(function () {
        ejs.page.close()
      }, 400)
    })

    $('.del').on('tap', function (e) {
      _input.value = ''
      keysarr = []
      ejs.storage.setItem({
        keysarr: '',
        success: function (result) {
          renderKey()
        },
      })
    })
  }

  /**
   *@description 搜索
   */
  function search(v) {
    ejs.ui.showWaiting()

    var url = Config.serverUrl + 'exceptionlistinfo/getExceptionListbyKey',
      data = JSON.stringify({
        token: Config.validate,
        params: {
          key: v,
          type: type,
        },
      })

    console.log('案件详情：', url, data)

    Util.ajax({
      url: url,
      data: data,
      contentType: 'application/json',
      beforeSend: function () {
        ejs.ui.showWaiting()
      },
      success: function (result) {
        console.log(JSON.stringify(result))
        ejs.ui.closeWaiting({})
        if (result.status.code != 1) {
          ejs.ui.toast(result.status.text)
          return
        }

        if (type == '') {
          $('#all').removeClass('mui-hidden')
          $('#sel').addClass('mui-hidden')
          renderAll(result.custom.recode)
          return
        } else {
          $('#sel').removeClass('mui-hidden')
          $('#all').addClass('mui-hidden')
        }

        var template = getTemp()
        var data = ''
        if (type == '1') {
          data = result.custom.recode.exceptionlist
        } else if (type == '2') {
          data = result.custom.recode.illegalMsglist
        } else {
          var arr = result.custom.recode.blacklist

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
          data = arr
        }
        var rendered = Mustache.render(template, {
          items: data,
        })
        document.getElementById('listdata').innerHTML = rendered
      },
      error: function (error) {
        ejs.ui.toast('接口有误，请联系管理员')
      },
      complete: function () {
        ejs.ui.closeWaiting({})
      },
    })
  }

  function getTemp(t) {
    var t = t || type
    var temp = ''
    if (t == '1') {
      temp = document.getElementById('item-template1').innerHTML
    } else if (t == '2') {
      temp = document.getElementById('item-template1').innerHTML
    } else {
      temp = document.getElementById('item-template2').innerHTML
    }
    return temp
  }

  function renderAll(recode) {
    console.log(JSON.stringify(recode) + 'saa')

    var template = getTemp('1')
    var data = ''
    data = recode.exceptionlist

    var rendered = Mustache.render(template, {
      items: data,
    })

    document.getElementById('exceptionlist').innerHTML = rendered

    template = getTemp('2')
    data = recode.illegalMsglist
    rendered = Mustache.render(template, {
      items: data,
    })
    document.getElementById('illegalmsglist').innerHTML = rendered

    template = getTemp('3')
    var arr = recode.blacklist
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
    data = arr

    rendered = Mustache.render(template, {
      items: data,
    })
    document.getElementById('blacklist').innerHTML = rendered
  }
})(document, Zepto)
