/**
 * 作者：解宇
 * 创建时间：2019-09-05
 * 版本：[1.0, 2019-09-05]
 * 版权：江苏国泰新点软件有限公司
 * 描述：检查任务-修改监管行为
 **/

;(function (d, $) {
  'use strict'

  var nowdate = '', //当前日期
    dutyguid = '',
    checkitemres = [],
    supervisedata = [], // 监管对象类别
    superviseguid = '',
    superviseObjData = [], // 监管对象
    superviseObjguid = '',
    objname = '',
    objtypeText = '',
    rowguid = '', // 监管行为唯一标识
    checklist = [],
    tmpAttachList = [], // 临时选择上传成功的附件
    attachcount = '0', // 附件数量
    checkresultatc = '', // 附件clientguid
    curridx = '',
    addsupervisenum = 0,
    // 监管事项信息
    supervisionEle = document.getElementById('listData'),
    supervisionTpl = document.getElementById('template').innerHTML,
    thingvalue = '',
    behaviorobjguid = '' //监管对象行为唯一标识;

  Util.loadJs(
    [
      'pages/common/common.js',
      'pages/common/preview.js',
      'pages/common/formatfile.js',
      'js/widgets/fileinput/fileinput.js',
      'js/widgets/mui.picker/mui.picker.css',
      'js/widgets/mui.poppicker/mui.poppicker.css',
      'js/widgets/mui.picker/mui.picker.js',
      'js/widgets/mui.poppicker/mui.poppicker.js',
    ],
    function () {
      Config.configReady(
        [],
        function () {
          initPage()
        },
        function (err) {}
      )
    }
  )

  /**
   * 初始化
   */
  function initPage() {
    behaviorobjguid = Util.getExtraDataByKey('behavobjguid') || ''
    dutyguid = Util.getExtraDataByKey('dutyguid') || ''
    superviseObjguid = Util.getExtraDataByKey('objguid') || ''
    objname = Util.getExtraDataByKey('objname') || ''
    superviseguid = Util.getExtraDataByKey('objtype') || ''
    objtypeText = Util.getExtraDataByKey('objtypeText') || ''
    thingvalue = Util.getExtraDataByKey('thingvalue') || ''

    Zepto('#em-jgdx').val(objname)
    Zepto('#em-jgdxlb').val(objtypeText)

    rowguid = Util.uuid2() // 生成36位唯一标识

    // 获取当前日期
    getNowDate()

    // 获取检查结果

    getCheckItemRes()

    // 获取监管对象类别
    getSuperviseType()

    // checkresultatc = Util.uuid2();

    // 刷新监管事项信息
    getSuperviseInfo()
  }

  /**
   * 初始化事件监听
   */
  function initListeners() {
    selectFiles()

    // 舰艇返回按钮及系统返回按钮
    ejs.navigator.hookSysBack({
      success: function (result) {
        ejs.page.close(
          JSON.stringify({
            rowguid: rowguid,
          })
        )
      },
      error: function (error) {},
    })

    ejs.navigator.hookBackBtn({
      success: function (result) {
        ejs.page.close(
          JSON.stringify({
            rowguid: rowguid,
          })
        )
      },
      error: function (error) {},
    })

    // 监管对象类别
    Zepto('#em-jgdxlb').on('tap', chooseObjTypeCallback)

    // 监管对象
    Zepto('#em-jgdx').on('tap', function () {
      ejs.page.open({
        pageUrl: './choose_obj.html',
        pageStyle: 1,
        orientation: 1,
        data: {
          objecttype: superviseguid,
        },
        success: function (result) {
          /**
                       * 目标页面关闭后会触发这个回调，参数是页面通过close传递过来的参数
                       * {
                              resultData: '可能是json，也可能是普通字符串，要看怎么传参的'
                         }
                       */
          console.log(result.resultData)

          Zepto('#em-jgdx').val(result.resultData.itemname)
          superviseObjguid = result.resultData.itemguid
          console.log('----------------')
          console.log(superviseObjguid)
        },
        error: function (error) {},
      })
    })

    // 检查时间
    Zepto('#em-jcsj').on('tap', chooseDataCallback)

    // 检查事项-检查结果
    Zepto('#listData').on('tap', '.action-item-result', function (e) {
      ejs.ui.popPicker({
        layer: 1,
        data: checkitemres,
        success: function (result) {
          Zepto(e.target).val(result.items[0].text)
          Zepto(e.target)
            .parent()
            .parent()
            .parent()
            .parent()
            .attr('data-checkval', result.items[0].value)
        },
        error: function (err) {},
      })
    })

    // 点击不检查，隐藏检查结果和相关附件
    $('body').on('click', "input[type='radio']", function () {
      console.log($(this).val())
      if ($(this).val() === '不检查') {
        $(this)
          .parents('.action-item-ischeck')
          .siblings('.action-item-res,.add-attach,.em-attach-wrapper')
          .addClass('mui-hidden')
      } else {
        $(this)
          .parents('.action-item-ischeck')
          .siblings('.action-item-res,.add-attach,.em-attach-wrapper')
          .removeClass('mui-hidden')
      }
    })

    // 添加附件
    Zepto('#listData').on('tap', '.add-attach', function (e) {
      curridx = this.dataset.idx
      checkresultatc = this.dataset.attachtag
    })

    // 长按删除附件
    // 绑定监听
    Zepto('#listData').on('tap', '.attach-items', function (e) {
      curridx = this.dataset.idx
      e.stopPropagation()
      var _this = this
      var attachindex = _this.getAttribute('attachindex')
      var _parentNode = _this.parentNode
      ejs.ui.confirm({
        title: '温馨提示',
        message: '是否确认删除此附件？',
        buttonLabels: ['取消', '确定'],
        cancelable: 1,
        success: function (result) {
          if (result.which == '1') {
            deleteAttach(attachindex, _parentNode, _this)
          }
        },
        error: function (err) {},
      })
    })

    // 保存并关闭
    Zepto('#btn-save').on('tap', function () {
      if (validate()) {
        ejs.ui.confirm({
          title: '提示',
          message: '确认保存并关闭吗？',
          buttonLabels: ['取消', '确定'],
          cancelable: 1,
          success: function (result) {
            // 点击任意一个按钮都会回调
            if (result.which == 1) {
              saveInfo(1)
            }
          },
          error: function (err) {},
        })
      }
    })
  }

  /**
   * 对象类别事件监听回调函数
   */
  function chooseObjTypeCallback() {
    ejs.ui.popPicker({
      layer: 1,
      data: supervisedata,
      success: function (result) {
        Zepto('#em-jgdxlb').val(result.items[0].text)
        superviseguid = result.items[0].value
        console.log('---------')
        console.log(superviseguid)
        Zepto('#em-jgdx').val('')
        superviseObjguid = ''

        // getSuperviseObj(superviseguid)
      },
      error: function (err) {},
    })
  }

  /**
   * 监管对象事件监听回调函数
   */
  function chooseObjCallback() {
    if (superviseguid == '') {
      ejs.ui.toast('请先选择监管对象类别')
      return
    }
    console.log(superviseObjData)
    ejs.ui.popPicker({
      layer: 1,
      data: superviseObjData,
      success: function (result) {
        Zepto('#em-jgdx').val(result.items[0].text)
        superviseObjguid = result.items[0].value

        // 刷新监管事项信息
        getSuperviseInfo()
      },
      error: function (err) {},
    })
  }

  /**
   * 检查时间事件监听回调函数
   */
  function chooseDataCallback() {
    ejs.ui.pickDate({
      title: '检查时间',
      datetime: nowdate,
      success: function (result) {
        var choosedate = result.date
        var nowdate = getNowDate()

        console.log(choosedate)
        console.log(nowdate)
        console.log('------')
        console.log(choosedate.replace(/-/g, ''))
        console.log(nowdate.replace(/-/g, ''))

        choosedate = parseInt(choosedate.replace(/-/g, ''))
        nowdate = parseInt(nowdate.replace(/-/g, ''))

        if (choosedate > nowdate) {
          ejs.ui.toast('检查时间不能超过当前时间')
          return
        }
        Zepto('#em-jcsj').val(result.date)
      },
      error: function (err) {},
    })
  }

  /**
   * 获取当前日期
   */
  function getNowDate() {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    if (month < 10) {
      month = '0' + month
    }
    if (day < 10) {
      day = '0' + day
    }
    nowdate = year + '-' + month + '-' + day
    Zepto('#em-jcsj').val(nowdate)
    return nowdate
  }

  /**
   * @description 保存修改并更新
   */
  function saveInfo() {
    var url = Config.serverUrl + 'checkInfo/updateCheckBhvObjInfo',
      data = JSON.stringify({
        token: Config.validate,
        params: {
          behaviorobjguid: behaviorobjguid,
          objtype: superviseguid,
          objguid: superviseObjguid,
          objname: Zepto('#em-jgdx').val(),
          checkdate: Zepto('#em-jcsj').val(),
          remark: Zepto('#em-remark').val(),
          behaviorlist: checklist,
        },
      })

    console.log('保存：', url, data)

    Util.ajax({
      url: url,
      data: data,
      contentType: 'application/json',
      beforeSend: function () {
        ejs.ui.showWaiting()
      },
      success: function (result) {
        console.log(result)
        if (result.status.code != 1) {
          ejs.ui.toast(result.status.text)

          return
        }

        ejs.ui.toast('保存成功')

        // 保存并关闭
        ejs.page.close(
          JSON.stringify({
            rowguid: rowguid,
          })
        )
      },
      error: function (error) {
        ejs.ui.toast('接口有误，请联系管理员')
        ejs.ui.closeWaiting()
      },
      complete: function () {
        ejs.ui.closeWaiting()
      },
    })
  }

  /**
   * @description 获取监管对象类别
   */
  function getSuperviseType() {
    var url = Config.serverUrl + 'commonInter/getObjectTypeList',
      data = JSON.stringify({
        token: Config.validate,
        params: {},
      })

    console.log('获取监管对象类别：', url, data)

    Util.ajax({
      url: url,
      data: data,
      contentType: 'application/json',
      beforeSend: function () {
        ejs.ui.showWaiting()
      },
      success: function (result) {
        if (result.status.code != 1) {
          ejs.ui.toast(result.status.text)

          return
        }
        supervisedata = []
        result.custom.codelist.forEach(function (item, index) {
          supervisedata.push({
            text: item.itemtext,
            value: item.itemvalue,
          })
        })

        // 初始化事件监听
        initListeners()
      },
      error: function (error) {
        ejs.ui.toast('接口有误，请联系管理员')
        ejs.ui.closeWaiting()
      },
      complete: function () {
        ejs.ui.closeWaiting()
      },
    })
  }

  /**
   * @description 获取监管事项信息
   */
  function getSuperviseInfo() {
    var url = Config.serverUrl + 'checkInfo/getCheckObjBehaviorDetail',
      data = JSON.stringify({
        token: Config.validate,
        params: {
          behaviorobjguid: behaviorobjguid,
        },
      })

    console.log('获取监管事项信息：', url, data)

    Util.ajax({
      url: url,
      data: data,
      contentType: 'application/json',
      beforeSend: function () {
        ejs.ui.showWaiting()
      },
      success: function (result) {
        if (result.status.code != 1) {
          ejs.ui.toast(result.status.text)

          return
        }

        $('#em-remark').val(result.custom.remark)

        var superviseguidother = result.custom.objtypevalue
        getSuperviseObj(superviseguidother)

        var list = result.custom.behaviorlist
        addsupervisenum = 0

        var attachlist = []

        list.forEach(function (item, index) {
          checkitemres.forEach(function (e, i) {
            if (item.checkresultstatus === e.value) {
              item.checktxt = e.text
            }
          })
          attachlist.push(item.checkresultatclist)
          item.idx = index
          item.ischeck = true
          if (item.checkresultstatus === '') {
            item.ischeck = false
          }
        })

        console.log(attachlist)

        // 渲染数据
        supervisionEle.innerHTML = Mustache.render(supervisionTpl, {
          supervisionInfo: list,
        })
        // 附件列表初始化
        attachlist.forEach(function (item, index) {
          item.forEach(function (val, i) {
            val.attachicon = FormatFile.getFileIcon(val.attachfilename)
            val.idx = index
          })

          Zepto('.attach-view' + index).html(
            Mustache.render(
              document.getElementById('old-attach-view').innerHTML,
              {
                itemInfo: item,
              }
            )
          )

          // 展开附件
          if (item.length != 0) {
            document.querySelector('.em-attach-wrap' + index).style.height =
              '105px'
          }

          // 获取附件数量
          document.querySelector('.em-attach-count' + index).innerText =
            item.length
        })

        // 如果checkresultstatus为空，则默认显示不检查
        Zepto('#listData .supervise-item').each(function (index, val) {
          var isradiocheck = $(val).data('ischeck')
          // console.log(isradiocheck)
          if (isradiocheck) {
            $(val).find('#ischeck').val('检查')
            $(val).find('#ischeck').attr('checked', true)
            $(val)
              .find('#nocheck')
              .parents('.action-item-ischeck')
              .siblings('.action-item-res,.add-attach,.em-attach-wrapper')
              .removeClass('mui-hidden')
          } else {
            $(val).find('#nocheck').val('不检查')
            $(val).find('#nocheck').attr('checked', true)
            $(val)
              .find('#nocheck')
              .parents('.action-item-ischeck')
              .siblings('.action-item-res,.add-attach,.em-attach-wrapper')
              .addClass('mui-hidden')
          }
        })
      },
      error: function (error) {
        ejs.ui.toast('接口有误，请联系管理员')
        ejs.ui.closeWaiting()
      },
      complete: function () {
        ejs.ui.closeWaiting()
      },
    })
  }

  /**
   * @description 获取监管对象
   */
  function getSuperviseObj(guid) {
    var url = Config.serverUrl + 'checkInfo/getCheckObjList',
      data = JSON.stringify({
        token: Config.validate,
        params: {
          objecttype: guid,
          currentpageindex: '1',
          pagesize: '999',
        },
      })

    console.log('获取监管事项信息：', url, data)

    Util.ajax({
      url: url,
      data: data,
      contentType: 'application/json',
      beforeSend: function () {
        ejs.ui.showWaiting()
      },
      success: function (result) {
        console.log(result)
        if (result.status.code != 1) {
          ejs.ui.toast(result.status.text)

          return
        }

        superviseObjData = []
        result.custom.objectlist.forEach(function (item, index) {
          superviseObjData.push({
            text: item.titlename,
            value: item.rowguid,
          })
        })
      },
      error: function (error) {
        ejs.ui.toast('接口有误，请联系管理员')
        ejs.ui.closeWaiting()
      },
      complete: function () {
        ejs.ui.closeWaiting()
      },
    })
  }

  /**
   * @description 检查项检查结果
   */
  function getCheckItemRes() {
    var url = Config.serverUrl + 'commonInter/getCodeInfoList',
      data = JSON.stringify({
        token: Config.validate,
        params: {
          codename: '检查结果',
        },
      })

    console.log('获取检查结果：', url, data)

    Util.ajax({
      url: url,
      data: data,
      contentType: 'application/json',
      beforeSend: function () {
        ejs.ui.showWaiting()
      },
      success: function (result) {
        if (result.status.code != 1) {
          ejs.ui.toast(result.status.text)

          return
        }

        result.custom.codelist.forEach(function (item, index) {
          checkitemres.push({
            text: item.itemtext,
            value: item.itemvalue,
          })
        })

        console.log(checkitemres)
      },
      error: function (error) {
        ejs.ui.toast('接口有误，请联系管理员')
        ejs.ui.closeWaiting()
      },
      complete: function () {
        ejs.ui.closeWaiting()
      },
    })
  }

  /**
   * @description 提交验证
   */
  function validate() {
    var num = 0
    checklist = []
    var ishaveresult = 0
    var checklistnum = 0
    var nochecklistnum = 0
    Zepto('#listData .supervise-item').each(function (index, val) {
      var itemguid = $(val).data('itemguid') || '',
        result = Zepto(val).data('checkval') || ''
      var behaviorbscguid = Zepto(val).data('rowguid')
      checkresultatc = Zepto(val).data('attachtag')

      var istocheck = $(val).find('#ischeck').prop('checked')

      if (istocheck) {
        if ($(val).find('.action-item-result').val()) {
          checklist.push({
            behaviorbscguid: behaviorbscguid,
            itemguid: itemguid,
            checkdate: Zepto('#em-jcsj').val(),
            checkresultstatus: result || '',
            checkresultatc: checkresultatc,
          })
          ishaveresult++
        }
        checklistnum++
      } else {
        checklist.push({
          behaviorbscguid: behaviorbscguid,
          itemguid: itemguid,
          checkdate: Zepto('#em-jcsj').val(),
          checkresultstatus: '',
          checkresultatc: checkresultatc,
        })
        nochecklistnum++
      }
    })

    console.log('999999999999999')
    console.log(ishaveresult)
    console.log(checklistnum)

    if (!Zepto('#em-jgdxlb').val()) {
      ejs.ui.toast('请选择监管对象类别')
      return false
    }

    if (!Zepto('#em-jgdx').val()) {
      ejs.ui.toast('请选择监管对象')
      return false
    }

    // 判断检查内容是否完善
    checklist.forEach(function (item, index) {
      if (item.checkresultstatus != '') {
        num++
      }
    })
    var list = []
    Zepto('#listData .supervise-item').each(function (index, val) {
      var isnocheck = $(val).find('#nocheck').prop('checked')
      list.push(isnocheck)
    })

    if (num == 0) {
      for (var i = 0; i < list.length; i++) {
        if (list[i] == false) {
          ejs.ui.toast('请至少添加一条检查结果')
          return false
        }
      }
    }
    if (nochecklistnum === Zepto('#listData .supervise-item').length) {
      ejs.ui.toast('请至少添加一条检查结果')
      return false
    }

    if (ishaveresult !== checklistnum) {
      ejs.ui.toast('请添加对应事项的检查结果')
      return false
    }

    // if (num == 0) {
    //     ejs.ui.toast('请至少添加一条检查结果');
    //     return false;
    // }

    return true
  }

  /**
   * 选择文件
   */
  function selectFiles() {
    new FileInput({
      container: '#showFileChoose_all',
      isMulti: false,
      type: 'All',
      success: function (b64, file, detail) {
        var files = {
          name: file.name,
          file: file,
          url: b64,
          attachsize: file.size,
        }

        uploadFile(files, file)
      },
      error: function (error) {
        ejs.ui.toast(JSON.stringify(error))
      },
    })
  }

  /**
   * 附件上传（带二进制流）
   */
  function uploadFile(files, file) {
    var url = Config.serverUrl + 'commonInter/attachUpload'
    var data = {
      // 注：此接口参数不需要以json字符串格式传递，只需和以下参数名对应即可。
      attachfilename: file.name, // 附件名
      contenttype: file.type, // 文件类型
      // 文档类型(文件后缀名，如:.png/.jpg；如此参数不传，则attachfilename必须带后缀名)
      documenttype: '',
      clienttag: '', // 业务tag
      clientinfo: '', // 业务info
      clientguid: checkresultatc, // 业务标识
      attachguid: '',
    }

    url = Util.getFullUrlByParams(url, data)

    Util.upload({
      url: url,
      data: {},
      files: files,
      beforeSend: function () {
        console.log('准备上传')
      },
      success: function (response, status, xhr) {
        if (response.status.code == '1') {
          // 上传成功渲染
          console.log('上传成功')
          appendFileWrappper(files, file, response.custom.attachguid)
        } else {
          ejs.ui.toast(response.status.text)
        }
      },
      error: function (xhr, status, statusText) {
        console.log(xhr, status)
      },
      uploading: function (percent, speed, status) {
        console.log('上传中:' + percent + ',speed:' + speed + ',msg:' + status)
        console.log(parseInt(percent))
      },
    })
  }

  /**
   *  附件渲染（新增时）
   */
  function appendFileWrappper(files, fileObj, attachguid) {
    var $ulDom = $('.attach-view' + curridx)

    files.attachguid = attachguid
    files.attachicon = FormatFile.getFileIcon(files.name)
    files.attachsize = FormatFile.getKMByByte(fileObj.size)
    files.idx = curridx
    console.log(files)
    $ulDom.prepend(
      Mustache.render(
        document.getElementById('em-attach-view').innerHTML,
        files
      )
    )

    // 显示附件个数
    document.querySelector('.em-attach-count' + curridx).innerText =
      $ulDom[0].children.length

    // 展开附件
    document.querySelector('.em-attach-wrap' + curridx).style.height = '105px'
  }

  /**
   * 删除附件
   */
  function deleteAttach(attachindex, _parentNode, _this) {
    _parentNode.removeChild(_this)

    dealAttach(attachindex)

    // 刷新附件个数
    document.querySelector('.em-attach-count' + curridx).innerText =
      _parentNode.children.length

    if (_parentNode.children.length == 0) {
      // 隐藏附件
      document.querySelector('.em-attach-wrap' + curridx).style.height = '0px'
    }
  }

  /**
   * 刷新渲染附件列表
   */
  function refreshRender() {
    // 渲染
    var template = document.querySelector('#em-attach-view').innerHTML
    var html = ''

    if (tmpAttachList && Array.isArray(tmpAttachList)) {
      mui.each(tmpAttachList, function (key, value) {
        value.attachindex = key // 附件索引
        html += Mustache.render(template, value)
      })
      // 赋值渲染
      document.querySelector('.attach-view' + curridx).innerHTML = html
      // 动态计算长度至可以滑动
      var wid = tmpAttachList.length * 60 + 'px'

      document.querySelector(
        '.em-attach-view.attach-view' + curridx
      ).style.width = wid
      // 关闭上传附件进度条
      mui('body').progressbar().hide()
    }
  }

  /**
   * 附件删除
   */
  function dealAttach(guid) {
    var url = Config.serverUrl + 'commonInter/attachDelete',
      data = JSON.stringify({
        token: Config.validate,
        params: {
          clientguid: checkresultatc,
          attachguid: guid,
        },
      })

    console.log('获取监管事项信息：', url, data)

    Util.ajax({
      url: url,
      data: data,
      contentType: 'application/json',
      beforeSend: function () {
        ejs.ui.showWaiting()
      },
      success: function (result) {
        console.log(result)
        if (result.status.code != 1) {
          ejs.ui.toast(result.status.text)

          return
        }

        ejs.ui.toast('删除成功')
      },
      error: function (error) {
        ejs.ui.toast('接口有误，请联系管理员')
        ejs.ui.closeWaiting({})
      },
      complete: function () {
        ejs.ui.closeWaiting({})
      },
    })
  }
})(document, Zepto)
