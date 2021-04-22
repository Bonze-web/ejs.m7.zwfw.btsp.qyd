/**
 * 作者：解宇
 * 创建时间：2019-09-05
 * 版本：[1.0, 2019-09-05]
 * 版权：江苏国泰新点软件有限公司
 * 描述：检查任务-添加监管行为
 **/

;(function (d, $) {
  'use strict'

  var checkres = [],
    checkitemres = [],
    itemguid = '', // 监管事项唯一标识
    rowguid = '', // 监管行为唯一标识
    dutyguid = '', // 任务标识
    objguid = '', // 对象标识
    objtype = '', // 对象类别
    objname = '', // 检查对象名称
    checkdate = '', // 检查时间
    checknum = 0, // 检查内容数量
    checklist = [], // 检查内容
    checkresval = '', // 检查结果状态
    nowdate = '', // 当前日期
    tmpAttachList = [], // 临时选择上传成功的附件
    attachcount = '0', // 附件数量
    checkresultatc = '', // 附件clientguid
    // 监管事项信息
    supervisionEle = document.getElementById('actionList'),
    supervisionTpl = document.getElementById('template').innerHTML,
    // 检查内容详情
    popoverEle = document.getElementById('popoverDetail'),
    popoverTpl = document.getElementById('popover-template').innerHTML

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

  function initPage() {
    dutyguid = Util.getExtraDataByKey('dutyguid') || ''
    itemguid = Util.getExtraDataByKey('itemguid') || ''
    rowguid = Util.getExtraDataByKey('rowguid') || ''
    objguid = Util.getExtraDataByKey('objguid') || ''
    objtype = Util.getExtraDataByKey('objtype') || ''
    objname = Util.getExtraDataByKey('objname') || ''
    checkdate = Util.getExtraDataByKey('checkdate') || ''
    console.log('dutyguid=' + dutyguid)
    console.log('itemguid=' + itemguid)
    console.log('rowguid=' + rowguid)
    console.log('objguid=' + objguid)
    console.log('objtype=' + objtype)
    console.log('objname=' + objname)
    console.log('checkdate=' + checkdate)

    checkresultatc = Util.uuid2()

    Zepto('#em-zgqx').val(checkdate) // 整改期限初始化

    // 获取检查内容
    getCheckInfo()

    // 获取检查结果
    getCheckRes()

    // 检查项检查结果
    getCheckItemRes()
  }

  /**
   * 初始化事件监听
   */
  function initListeners() {
    selectFiles()

    // 初始化监听
    mui.init({
      gestureConfig: {
        longtap: true, // 默认为false
      },
    })

    // 检查结果状态
    Zepto('#em-jcjgzt').on('tap', function () {
      ejs.ui.popPicker({
        layer: 1,
        data: checkres,
        success: function (result) {
          console.log(result)
          Zepto('#em-jcjgzt').val(result.items[0].text)
          checkresval = result.items[0].value

          if (checkresval == '02') {
            // 发现问题作出责令改正等行政命令（需填写整改期限）
            Zepto('.wrap-zgqx')[0].classList.remove('mui-hidden')
          } else {
            Zepto('.wrap-zgqx')[0].classList.add('mui-hidden')
            Zepto('#em-zgqx').val('')
          }
        },
        error: function (err) {},
      })
    })

    // 检查事项-检查结果
    Zepto('#actionList').on('tap', '.action-item-result', function (e) {
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

    // 检查内容-选择合格、不合格...
    Zepto('#actionList').on('tap', '.action-item-chooseitem', function (e) {
      var list = e.target
      //判断list的tagName
      var classList = list.classList
      // 保存所有的li
      var lists = list.parentElement.children
      // 先手动删除所有li的item-active样式
      for (var i = 0; i < lists.length; i++) {
        lists[i].classList.remove('sel-active')
      }
      // 然后给当前选中的li添加item-active样式
      classList.add('sel-active')
    })

    // 整改期限
    Zepto('#em-zgqx').on('tap', function () {
      ejs.ui.pickDate({
        title: 'pickDate',
        datetime: checkdate,
        success: function (result) {
          Zepto('#em-zgqx').val(result.date)
        },
        error: function (err) {},
      })
    })

    // 保存
    Zepto('#btn-save').on('tap', function () {
      if (validate()) {
        ejs.ui.confirm({
          title: '提示',
          message: '确认保存吗？',
          buttonLabels: ['取消', '确定'],
          cancelable: 1,
          success: function (result) {
            // 点击任意一个按钮都会回调
            if (result.which == 1) {
              uploadFile()
            }
          },
          error: function (err) {},
        })
      }
    })

    // 展示检查项目详情信息
    Zepto('#actionList').on('tap', '.action-item-title a', function () {
      console.log(this.dataset.rowguid)
      getCheckInfoDetail(this.dataset.rowguid)
    })

    // 关闭检查项目详情信息弹框
    Zepto('.close-wrap').on('tap', function () {
      mui('#check-info').popover(
        'toggle',
        document.getElementById('popoverDetail')
      )
    })

    // 长按删除附件
    // 绑定监听
    Zepto('.em-attach-view').on('longtap', 'li', function (e) {
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
  }

  /**
   * @description 获取检查内容
   */
  function getCheckInfo() {
    var url = Config.serverUrl + 'checkInfo/getCheckContentList',
      data = JSON.stringify({
        token: Config.validate,
        params: {
          itemguid: itemguid,
          currentpageindex: '1',
          pagesize: '999',
        },
      })

    console.log('获取检查内容：', url, data)

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

        checknum = result.custom.checkcontentlist.length // 获取检查内容数量

        // 渲染数据
        supervisionEle.innerHTML = Mustache.render(supervisionTpl, {
          supervisionInfo: result.custom.checkcontentlist,
        })
      },
      error: function (error) {
        console.log(JSON.stringify(error))
        ejs.ui.toast('接口有误，请联系管理员')
        ejs.ui.closeWaiting({})
      },
      complete: function () {
        ejs.ui.closeWaiting({})
      },
    })
  }

  /**
   * @description 获取检查内容详情
   */
  function getCheckInfoDetail(guid) {
    var url = Config.serverUrl + 'checkInfo/getCheckContentDetail',
      data = JSON.stringify({
        token: Config.validate,
        params: {
          checkcontentguid: guid,
        },
      })

    console.log('获取检查内容详情：', url, data)

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

        // 渲染数据
        popoverEle.innerHTML = Mustache.render(popoverTpl, {
          popoverInfo: result.custom,
        })
      },
      error: function (error) {
        console.log(JSON.stringify(error))
        ejs.ui.toast('接口有误，请联系管理员')
        ejs.ui.closeWaiting({})
      },
      complete: function () {
        ejs.ui.closeWaiting({})
      },
    })
  }

  /**
   * @description 获取检查结果
   */
  function getCheckRes() {
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
          checkres.push({
            text: item.itemtext,
            value: item.itemvalue,
          })
        })

        // 初始化事件监听
        initListeners()
      },
      error: function (error) {
        console.log(JSON.stringify(error))
        ejs.ui.toast('接口有误，请联系管理员')
        ejs.ui.closeWaiting({})
      },
      complete: function () {
        ejs.ui.closeWaiting({})
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
          codename: '检查项检查结果',
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
      },
      error: function (error) {
        console.log(JSON.stringify(error))
        ejs.ui.toast('接口有误，请联系管理员')
        ejs.ui.closeWaiting({})
      },
      complete: function () {
        ejs.ui.closeWaiting({})
      },
    })
  }

  /**
   * @description 保存
   */
  function save() {
    var url = Config.serverUrl + 'checkInfo/addCheckBehaviorInfo',
      data = JSON.stringify({
        token: Config.validate,
        params: {
          dutyguid: dutyguid,
          objguid: objguid,
          behaviorobjguid: rowguid,
          ItemGuid: itemguid,
          objtype: objtype,
          objname: objname,
          checkdate: checkdate,
          checkresultstatus: checkresval,
          checkresult: Zepto('#em-jcjg').val(),
          checkresultatc: checkresultatc,
          rectifyenddate: Zepto('#em-zgqx').val(),
          checkcontentlist: checklist,
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
        ejs.page.close(
          JSON.stringify({
            rowguid: rowguid,
            ismodify: '0',
          })
        )
      },
      error: function (error) {
        console.log(JSON.stringify(error))
        ejs.ui.toast('接口有误，请联系管理员')
        ejs.ui.closeWaiting({})
      },
      complete: function () {
        ejs.ui.closeWaiting({})
      },
    })
  }

  /**
   * @description 提交验证
   */
  function validate() {
    /******************处理检查内容数据************************/
    var flag = 1
    checklist = []

    Zepto('#actionList li').each(function (index, val) {
      var contentguid = $(val).data('rowguid'),
        result = Zepto(val).data('checkval')

      checklist.push({
        contentguid: contentguid,
        result: result,
      })
    })

    // 判断检查结果状态
    if (!Zepto('#em-jcjgzt').val()) {
      ejs.ui.toast('请选择检查结果状态')
      return false
    }

    // 判断检查结果是否为空
    if (!Zepto('#em-jcjg').val()) {
      ejs.ui.toast('请输入检查结果')
      return false
    }

    // 检查结果状态为'02'时，需要选择整改期限
    if (checkresval == '02' && !Zepto('#em-zgqx').val()) {
      ejs.ui.toast('请选择整改期限')
      return false
    }

    // 判断检查内容是否完善
    checklist.forEach(function (item, index) {
      if (item.result == '' || item.result == undefined) {
        flag = 0
        return
      }
      flag = 1
    })
    if (flag != 1) {
      ejs.ui.toast('检查内容存在尚未检查项，请完善')
      return false
    }

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
        // console.log("选择:" + b64);
        // console.log("fileName:" + file.name);
        var files = [
          {
            name: file.name,
            file: file,
          },
        ]

        appendFileWrappper(files, file)
      },
      error: function (error) {
        ejs.ui.toast(JSON.stringify(error))
      },
    })
  }

  /**
   * 附件上传（带二进制流）
   */
  function uploadFile() {
    var uploadAttach = function (index) {
      return new Promise(function (resolve, reject) {
        var url = Config.serverUrl + 'commonInter/attachUpload'
        var data = {
          // 注：此接口参数不需要以json字符串格式传递，只需和以下参数名对应即可。
          attachfilename: tmpAttachList[i].fileObj.name, // 附件名
          contenttype: tmpAttachList[i].fileObj.type, // 文件类型
          // 文档类型(文件后缀名，如:.png/.jpg；如此参数不传，则attachfilename必须带后缀名)
          documenttype: '',
          clienttag: '', // 业务tag
          clientinfo: '', // 业务info
          clientguid: checkresultatc, // 业务标识
          attachguid: '',
        }

        url = Util.getFullUrlByParams(url, data)
        // ejs.ui.showDebugDialog(url);
        Util.upload({
          url: url,
          data: {},
          files: tmpAttachList[i].files,
          beforeSend: function () {
            console.log('准备上传')
          },
          success: function (response, status, xhr) {
            if (response.status.code == '1') {
              // 上传成功渲染
              resolve('1')
            } else {
              ejs.ui.toast('不允许上传此类型文件')
            }
          },
          error: function (xhr, status, statusText) {
            console.log(xhr, status)
          },
          uploading: function (percent, speed, status) {
            console.log(
              '上传中:' + percent + ',speed:' + speed + ',msg:' + status
            )
            console.log(parseInt(percent))
          },
        })
      })
    }

    var promiseArray = []
    var len = tmpAttachList.length
    for (var i = 0; i < len; i++) {
      promiseArray.push(uploadAttach(i))
    }

    if (promiseArray.length == 0) {
      save()
    } else {
      Promise.all(promiseArray)
        .then(function () {
          console.log('上传成功')
        })
        .catch(function (error) {
          console.log('上传失败')
        })
        .finally(function () {
          console.log('结束')
          save()
        })
    }
  }

  /**
   *  附件渲染（新增时）
   */
  function appendFileWrappper(files, fileObj) {
    tmpAttachList.push({
      files: files,
      fileObj: fileObj,
      attachicon: FormatFile.getFileIcon(fileObj.name),
      attachname: fileObj.name,
      attachsize: FormatFile.getKMByByte(fileObj.size),
    })
    // 显示附件个数
    document.querySelector('.em-attach-count').innerText = tmpAttachList.length

    // 展开附件
    document.querySelector('.em-attach-wrapper').style.height = '105px'

    // refresh 渲染附件列表
    refreshRender()
  }

  /**
   * 删除附件
   */
  function deleteAttach(attachindex, _parentNode, _this) {
    _parentNode.removeChild(_this)
    tmpAttachList.splice(attachindex, 1)
    // 刷新附件个数
    document.querySelector('.em-attach-count').innerText = tmpAttachList.length
    // 刷新附件列表
    refreshRender()

    if (tmpAttachList.length == 0) {
      // 隐藏附件
      document.querySelector('.em-attach-wrapper').style.height = '0px'
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
      document.querySelector('.em-attach-view').innerHTML = html
      // 动态计算长度至可以滑动
      var wid = tmpAttachList.length * 170 + 'px'

      document.querySelector('.em-attach-view.mui-table-view').style.width = wid
      // 关闭上传附件进度条
      mui('body').progressbar().hide()
    }
  }
})(document, Zepto)
