/**
 * 作者：丁力
 * 创建时间：2019-9-7 20:58:354
 * 版本：[1.0, 2019-9-7]
 * 版权：江苏国泰新点软件有限公司
 * 描述：添加整改复查
 **/
'use strict'

var clientguid = Util.uuid({
  len: 36,
})

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
    customBiz.configReady()
  }
)

/**
 * @description 所有业务处理
 */
var customBiz = {
  // 初始化校验，必须调用
  // 注，如果没有组件API需要注册，可以传空，注册组件时，必须容器支持对应组件才能注册成功
  configReady: function () {
    var self = this

    Config.configReady(
      null,
      function () {
        self.initListeners()
        self.getCode()
      },
      function (error) {}
    )
  },
  initListeners: function () {
    var self = this
    //标识
    self.isupload = Util.getExtraDataByKey('isupload') || ''
    self.rowguid = Util.getExtraDataByKey('rowguid') || ''
    self.dutyguid = Util.getExtraDataByKey('dutyguid') || ''
    self.behaviorguid = Util.getExtraDataByKey('behaviorguid') || ''
    self.behaviorobjguid = Util.getExtraDataByKey('behaviorobjguid') || ''

    console.log('更新1', self.isupload)
    console.log('每条数据behaviorguid', self.behaviorguid)
    console.log('rowguid', self.rowguid)

    if (self.isupload === '1' || self.isupload === 1) {
      self.detailguid = self.behaviorguid
    } else {
      self.detailguid = self.rowguid
    }

    //检查时间
    self.checkdate = ''
    //整改结果状态
    self.checkresultstatus = ''
    // 临时选择上传成功的附件
    self.tmpAttachList = []
    //附件数量
    self.attachcount = '0'

    self.getDetail()

    // 初始化监听
    mui.init({
      gestureConfig: {
        longtap: true, // 默认为false
      },
    })

    // 区域滚动
    mui('.mui-scroll-wrapper').scroll({
      indicators: true, // 是否显示滚动条
      deceleration: 0.0006, // flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    })
    // 选择文件
    self.selectFiles()

    // 长按删除附件
    // 绑定监听
    mui('.em-attach-view').on('longtap', 'li', function (e) {
      e.stopPropagation()
      var _this = this
      var attachindex = _this.getAttribute('attachindex')
      var _parentNode = _this.parentNode
      var attachguid = Zepto(this).attr('attachguid')

      ejs.ui.confirm({
        title: '温馨提示',
        message: '是否确认删除此附件？',
        buttonLabels: ['取消', '确定'],
        cancelable: 1,
        success: function (result) {
          if (result.which == '1') {
            self.deleteAttach(attachindex, _parentNode, _this, attachguid)
          }
        },
        error: function (err) {},
      })
    })

    //时间选择
    //      mui('.mui-content').on('tap', '.timebox', function(){
    //      	ejs.ui.pickDate({
    //			    title: '请选择时间',
    //			    datetime: self.checkdate,
    //			    success: function(result) {
    //			        self.checkdate = result.date;
    //			        Zepto('#checkdate').val(self.checkdate);
    //			    },
    //			    error: function(err) {}
    //			});
    //      })

    //状态选择
    mui('.mui-content').on('tap', '.statusbox', function () {
      ejs.ui.popPicker({
        layer: 1,
        data: self.checkData,
        success: function (result) {
          console.log(result)

          var res = result.items[0]
          self.checkresultstatus = res.value
          Zepto('#checkresultstatusname').val(res.text)
        },
        error: function (err) {},
      })
    })

    // 监听输入框,键盘弹起隐藏按钮
    var oHeight = document.documentElement.clientHeight
    Zepto(window).resize(function () {
      var height = document.documentElement.clientHeight
      if (height < oHeight) {
        Zepto('.em-save').addClass('mui-hidden')
      } else {
        Zepto('.em-save').removeClass('mui-hidden')
      }
    })

    //保存
    mui('.mui-content').on('tap', '.em-save', function () {
      Zepto('input').blur()

      if (self.checkInputFormat()) {
        if (self.tmpAttachList.length > 0) {
          ejs.ui.showWaiting()
          self.uploadFile()
        } else {
          console.log(self.isupload)

          if (self.isupload === '1' || self.isupload === 1) {
            self.uploadReform()
          } else {
            self.addReform()
          }
        }
      }
    })
  },
  //代码项
  getCode: function () {
    var self = this

    common.ajax(
      {
        url: Config.serverUrl + 'commonInter/getCodeInfoList',
        data: {
          codename: '检查结果',
        },
        // 考虑到网络不佳情况下，业务是否手动显示加载进度条
        isShowWaiting: false,
      },
      function (result) {
        if (result.status.code == '1') {
          var tmp = result.custom.codelist
          self.checkData = []
          mui.each(tmp, function (key, value) {
            self.checkData.push({
              text: value.itemtext,
              value: value.itemvalue,
            })
          })
        } else {
          ejs.ui.toast(result.status.text)
        }
      },
      function (error) {
        ejs.ui.toast(Config.TIPS_II)
      },
      {
        isDebug: true,
      }
    )
  },
  //获取数据
  getDetail: function () {
    var self = this

    common.ajax(
      {
        url: Config.serverUrl + 'checkInfo/getCheckBehaviorDetail',
        data: {
          behaviorguid: self.detailguid,
        },
        // 考虑到网络不佳情况下，业务是否手动显示加载进度条
        isShowWaiting: false,
      },
      function (result) {
        console.log('result', result)

        if (result.status.code != '1') {
          ejs.ui.toast(result.status.text)
        } else {
          var tmpInfo = result.custom,
            outdata = result.custom.checkresultatclist

          //判断是新增还是更新 更新用返回的参数
          if (self.isupload === '0' || self.isupload === 0) {
            outdata = []
          }

          self.objguid = tmpInfo.objguid
          self.objtype = tmpInfo.objtypevalue
          self.objname = tmpInfo.objname
          self.itemguid = tmpInfo.itemguid
          Zepto('#objtype').val(tmpInfo.objtype)
          Zepto('#objname').val(self.objname)
          self.checkdate =
            DateUtil.getDate('', 'yyyy-mm-dd') +
            ' ' +
            DateUtil.getTime('', 'hh:mm:ss')
          Zepto('#checkdate').val(self.checkdate)
          Zepto('#checkresultstatusname').val(tmpInfo.checkresultstatustext)
          Zepto('#checkresult').val(tmpInfo.checkresult)
          Zepto('.mui-content').removeClass('mui-hidden')
          self.checkresultstatus = tmpInfo.checkresultstatus

          // 显示附件个数
          document.querySelector('.em-attach-count').innerText = outdata.length

          if (outdata.length != 0) {
            // 展开附件
            document.querySelector('.em-attach-wrapper').style.height = '105px'

            // 渲染
            var template = document.querySelector('#em-attach-view').innerHTML
            var html = ''

            if (outdata && Array.isArray(outdata)) {
              mui.each(outdata, function (key, value) {
                value.attachindex = key // 附件索引
                value.attachicon = FormatFile.getFileIcon(value.attachfilename)
                html += Mustache.render(template, value)
              })
              // 赋值渲染
              document.querySelector('.em-attach-view').innerHTML = html
              // 动态计算长度至可以滑动
              var wid = outdata.length * 170 + 'px'

              document.querySelector(
                '.em-attach-view.mui-table-view'
              ).style.width = wid
            }

            self.tmpAttachList = outdata
          }

          //判断是新增还是更新 更新用返回的参数
          if (self.isupload === '1' || self.isupload === 1) {
            clientguid = tmpInfo.checkresultatc
          }
        }
      },
      function (error) {
        ejs.ui.toast(Config.TIPS_II)
      },
      {
        isDebug: true,
      }
    )
  },
  //	新增
  addReform: function () {
    var self = this

    common.ajax(
      {
        url: Config.serverUrl + 'checkInfo/addCheckBehaviorInfo',
        data: {
          dutyguid: self.dutyguid,
          objguid: self.objguid,
          behaviorobjguid: self.behaviorobjguid,
          itemguid: self.itemguid,
          objtype: self.objtype,
          objname: self.objname,
          checkdate: self.checkdate,
          checkresultstatus: self.checkresultstatus,
          checkresult: Zepto('#checkresult').val(),
          checkresultatc: clientguid,
          iszgfc: '1',
        },
        // 考虑到网络不佳情况下，业务是否手动显示加载进度条
        isShowWaiting: false,
      },
      function (result) {
        ejs.ui.closeWaiting()
        if (result.status.code == '1') {
          ejs.ui.toast('添加成功')
          setTimeout(function () {
            ejs.page.close('value2')
          }, 500)
        } else {
          ejs.ui.toast(result.status.text)
        }
      },
      function (error) {
        ejs.ui.toast(Config.TIPS_II)
      },
      {
        isDebug: true,
      }
    )
  },
  //更新
  uploadReform: function () {
    var self = this

    common.ajax(
      {
        url: Config.serverUrl + 'checkInfo/updateCheckBehaviorInfo',
        data: {
          behaviorguid: self.behaviorguid,
          checkdate: self.checkdate,
          checkresultstatus: self.checkresultstatus,
          checkresult: Zepto('#checkresult').val(),
          checkresultatc: clientguid,
        },
        // 考虑到网络不佳情况下，业务是否手动显示加载进度条
        isShowWaiting: false,
      },
      function (result) {
        ejs.ui.closeWaiting()
        if (result.status.code == '1') {
          ejs.ui.toast('更新成功')
          setTimeout(function () {
            ejs.page.close('')
          }, 500)
        } else {
          ejs.ui.toast(result.status.text)
        }
      },
      function (error) {
        ejs.ui.toast(Config.TIPS_II)
      },
      {
        isDebug: true,
      }
    )
  },
  /**
   * 选择文件
   */
  selectFiles: function () {
    var self = this

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
        var ext = file.name.substr(file.name.lastIndexOf('.') + 1)
        var filetypeList = [
          'doc',
          'docx',
          'txt',
          'rar',
          'zip',
          'jpg',
          'jpeg',
          'pdf',
          'xls',
          'xlsx',
          'gif',
          'bmp',
          'png',
        ]
        if (filetypeList.indexOf(ext) === -1) {
          ejs.ui.toast('不允许上传此类型文件')
        } else {
          self.appendFileWrappper(files, file)
        }

        document.getElementById('showFileChoose_all').value= '';
      },
      error: function (error) {
        ejs.ui.toast(JSON.stringify(error))
      },
    })
  },
  /**
   * 附件上传（带二进制流）
   */
  uploadFile: function () {
    var self = this

    var uploadAttach = function (index) {
      return new Promise(function (resolve, reject) {
        var url = Config.serverUrl + 'commonInter/attachUpload'
        var data = {
          // 注：此接口参数不需要以json字符串格式传递，只需和以下参数名对应即可。
          attachfilename: self.tmpAttachList[i].fileObj.name, // 附件名
          contenttype: self.tmpAttachList[i].fileObj.type, // 文件类型
          // 文档类型(文件后缀名，如:.png/.jpg；如此参数不传，则attachfilename必须带后缀名)
          documenttype: '',
          clienttag: '', // 业务tag
          clientinfo: '', // 业务info
          clientguid: clientguid, // 业务标识
          attachguid: '',
        }

        url = Util.getFullUrlByParams(url, data)
        // ejs.ui.showDebugDialog(url);
        Util.upload({
          url: url,
          data: {},
          files: self.tmpAttachList[i].files,
          beforeSend: function () {
            console.log('准备上传')
          },
          success: function (response, status, xhr) {
            if (response.status.code == '1') {
              // 上传成功渲染
              resolve('1')
            } else {
              ejs.ui.toast(response.status.text)
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
    var len = self.tmpAttachList.length
    for (var i = 0; i < len; i++) {
      promiseArray.push(uploadAttach(i))
    }

    Promise.all(promiseArray)
      .then(function () {
        console.log('上传成功')
      })
      .catch(function (error) {
        console.log('上传失败')
      })
      .finally(function () {
        console.log('结束')

        if (self.isupload === '1' || self.isupload === 1) {
          self.uploadReform()
        } else {
          self.addReform()
        }
      })
  },
  /**
   *  附件渲染（新增时）
   */
  appendFileWrappper: function (files, fileObj) {
    var self = this

    self.tmpAttachList.push({
      files: files,
      fileObj: fileObj,
      attachicon: FormatFile.getFileIcon(fileObj.name),
      attachfilename: fileObj.name,
      attachlength: FormatFile.getKMByByte(fileObj.size),
    })
    // 显示附件个数
    document.querySelector('.em-attach-count').innerText =
      self.tmpAttachList.length

    // 展开附件
    document.querySelector('.em-attach-wrapper').style.height = '105px'

    // refresh 渲染附件列表
    self.refreshRender()
  },
  /**
   * 删除附件
   */
  deleteAttach: function (attachindex, _parentNode, _this, attachguid) {
    var self = this
    _parentNode.removeChild(_this)

    if (attachguid == '' || attachguid == null) {
      self.tmpAttachList.splice(attachindex, 1)

      // 刷新附件个数
      document.querySelector('.em-attach-count').innerText =
        self.tmpAttachList.length
      // 刷新附件列表
      self.refreshRender()

      if (self.tmpAttachList.length == 0) {
        // 隐藏附件
        document.querySelector('.em-attach-wrapper').style.height = '0px'
      }
    } else {
      common.ajax(
        {
          url: Config.serverUrl + 'commonInter/attachDelete',
          data: {
            clientguid: '',
            attachguid: attachguid,
          },
          // 考虑到网络不佳情况下，业务是否手动显示加载进度条
          isShowWaiting: false,
        },
        function (result) {
          ejs.ui.closeWaiting()
          if (result.status.code == '1') {
            ejs.ui.toast('删除成功')

            self.tmpAttachList.splice(attachindex, 1)

            // 刷新附件个数
            document.querySelector('.em-attach-count').innerText =
              self.tmpAttachList.length
            // 刷新附件列表
            self.refreshRender()

            if (self.tmpAttachList.length == 0) {
              // 隐藏附件
              document.querySelector('.em-attach-wrapper').style.height = '0px'
            }
          } else {
            ejs.ui.toast(result.status.text)
          }
        },
        function (error) {
          ejs.ui.toast(Config.TIPS_II)
        },
        {
          isDebug: true,
        }
      )
    }
  },
  /**
   * 刷新渲染附件列表
   */
  refreshRender: function () {
    var self = this
    // 渲染
    var template = document.querySelector('#em-attach-view').innerHTML
    var html = ''

    // console.log("XXX" + JSON.stringify(self.tmpAttachList));
    if (self.tmpAttachList && Array.isArray(self.tmpAttachList)) {
      mui.each(self.tmpAttachList, function (key, value) {
        value.attachindex = key // 附件索引
        html += Mustache.render(template, value)
      })
      // 赋值渲染
      document.querySelector('.em-attach-view').innerHTML = html
      // 动态计算长度至可以滑动
      var wid = self.tmpAttachList.length * 170 + 'px'

      document.querySelector('.em-attach-view.mui-table-view').style.width = wid
      // 关闭上传附件进度条
      mui('body').progressbar().hide()
    }
  },
  /**
   * 校验表单数据
   */
  checkInputFormat: function () {
    var self = this // 流程的guid
    var flag = true

    if (!self.checkdate) {
      ejs.ui.toast('请选择整改时间')

      return
    } else if (!self.checkresultstatus) {
      ejs.ui.toast('请选择整改结果状态')

      return
    } else if (!Zepto('#checkresult').val()) {
      ejs.ui.toast('请填写整改结果')

      return
    }

    return flag
  },
}
