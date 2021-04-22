/**
 * 作者：顾家昊
 * 创建时间：2019-09-05
 * 版本：[1.0, 2019-09-05]
 * 版权：江苏国泰新点软件有限公司
 * 描述：检查任务-搜索
 **/

;(function (d, $) {
  'use strict'

  var guid = '' //主键

  Util.loadJs(function () {
    Config.configReady(
      [],
      function () {
        guid = Util.getExtraDataByKey('guid') || ''
        getDetail()
        initListeners()
      },
      function (err) {}
    )
  })

  /**
   * 初始化事件监听
   */
  function initListeners() {
    $('#attach').on('tap', '.attach-item', function (e) {
      var url = this.id
      var name = this.dataset.name
      console.log(url, name)

      ejs.io.downloadFile({
        url: url,
        fileName: name,
        isBackground: 0,
        reDownloaded: 0,
        success: function (result) {},
        error: function (error) {
          ejs.ui.closeWaiting()
        },
      })
    })
  }

  /**
   *@description 搜索
   */
  function getDetail() {
    ejs.ui.showWaiting()

    var url = Config.serverUrl + 'exceptionlistinfo/getLhcjInfoDetail',
      data = JSON.stringify({
        token: Config.validate,
        params: {
          lhcjguid: guid,
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
        result = result.custom.record
        var basicdata = result.basic
        basicdata.typeval = basicdata.type
        basicdata.type = basicdata.type == '01' ? '个人' : '企业'

        var baseinfotemp = document.getElementById('baseinfo-temp').innerHTML
        var basicrender = Mustache.render(baseinfotemp, {
          items: basicdata,
        })

        document.getElementById('baseinfo').innerHTML = basicrender

        var attacharr = result.attach
        for (var i in attacharr) {
          attacharr[i].png = attacharr[i].attachname.split('.')[1]
        }
        var attachtemp = document.getElementById('attach-temp').innerHTML
        var attachrender = Mustache.render(attachtemp, {
          items: attacharr,
        })

        document.getElementById('attach').innerHTML = attachrender

        if (basicdata.type === '个人') {
          $('#baseinfo').find('.qiye').addClass('mui-hidden')
        }
      },
      error: function (error) {
        ejs.ui.toast('接口有误，请联系管理员')
      },
      complete: function () {
        ejs.ui.closeWaiting({})
      },
    })
  }
})(document, Zepto)
