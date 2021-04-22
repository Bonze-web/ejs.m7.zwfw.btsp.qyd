/**
 * 作者：解宇
 * 创建时间：2019-09-05
 * 版本：[1.0, 2019-09-05]
 * 版权：江苏国泰新点软件有限公司
 * 描述：检查任务-任务详情（进行中）
 **/

;(function (d, $) {
  'use strict'
  var issignnum = 0,
    isphotonum = 0,
    userguid = '',
    rowguid = '', // 主键guid
    token = '',
    pviguid = '',
    areaList = [], // 行政区划代码项
    areanumber = '',
    isfeedback = '0', // 是否处罚
    punishcode = '', // 处罚项
    issaveflag = '',
    objguid = '',
    objname = '',
    objtype = '',
    objtypeText = '',
    // 基本信息
    baseEle = document.getElementById('baseList'),
    baseTpl = document.getElementById('base-template').innerHTML,
    // 监管事项信息
    supervisionEle = document.getElementById('supervisionList'),
    supervisionTpl = document.getElementById('supervision-template').innerHTML,
    // 执法人员签名信息
    signEle = document.getElementById('signList'),
    signTpl = document.getElementById('sign-template').innerHTML

  Util.loadJs(
    [
      'js/widgets/mui.picker/mui.picker.css',
      'js/widgets/mui.poppicker/mui.poppicker.css',
      'js/widgets/mui.picker/mui.picker.js',
      'js/widgets/mui.poppicker/mui.poppicker.js',
    ],
    function () {
      var className = ejs.os.android
        ? 'com.epoint.app.restapi.EjsApi'
        : 'SZEJSApi'
      var jsApiList = [
        {
          moduleName: className,
        },
      ]
      Config.configReady(
        jsApiList,
        function () {
          ejs.auth.getUserInfo({
            success: function (result) {
              console.log('--------------')
              console.log(result)
              var userinfo = JSON.parse(result.userInfo)
              userguid = userinfo.userguid
              console.log('userguid=' + userguid)

              ejs.auth.getToken({
                success: function (result) {
                  token = result.access_token
                  // 初始化
                  initPage()
                },
                error: function (error) {},
              })
            },
            error: function (error) {},
          })
        },
        function (err) {}
      )
    }
  )

  /**
   * 初始化事件监听
   */
  function initPage() {
    rowguid = Util.getExtraDataByKey('rowguid') || ''
    pviguid = Util.getExtraDataByKey('pviguid') || ''

    getDetail() // 获取详情
    getCheckBehaviorList() // 获取监管行为信息
    //      getAreaInfo(); // 获取行政区划
    sign() // 签名
  }

  /**
   * 初始化事件监听
   */
  function initListeners() {
    // 返回顶部按钮实现
    $('.top_btn').hide()
    $(function () {
      $(window).scroll(function () {
        if ($(window).scrollTop() > 100) {
          $('.top_btn').show(1500)
        } else {
          $('.top_btn').hide(1500)
        }
      })
      //当点击跳转链接后，回到页面顶部位置
      $('.top_btn').click(function () {
        $('body,html').scrollTop(0)
        return false
      })
    })

    // 保存
    Zepto('#btn-save').on('tap', function () {
      ejs.ui.confirm({
        title: '提示',
        message: '是否确认保存该任务？',
        buttonLabels: ['取消', '确定'],
        cancelable: 1,
        success: function (result) {
          // 点击任意一个按钮都会回调
          console.log(result)
          if (result.which == 1) {
            issaveflag = '1'
            handleItem('40', '0')
          }
        },
        error: function (err) {},
      })
    })

    // 行政相对人导航
    Zepto('.mui-content').on('tap', '#nav', function () {
      console.log(this.dataset.lat)
      console.log(this.dataset.lng)
      var lat = this.dataset.lat,
        lng = this.dataset.lng,
        name = this.dataset.name
      if (lat == '' || lng == '') {
        ejs.ui.toast('暂无定位信息')
        return
      }

      ejs.callApi({
        // 该组件下的任意api
        name: 'showNavigation',
        mudule: 'moduleName',
        // 是否长期回调，为0时可以省略
        isLongCb: 0,
        data: {
          name: name,
          lat: lat,
          lng: lng,
        },
        success: function (result) {},
        error: function (error) {
          // 处理失败
        },
      })
    })

    // 行政相对人电话
    Zepto('.mui-content').on('tap', '#dzxdr-tel', function () {
      var contacttel = this.dataset.tel
      console.log(contacttel)

      if (contacttel == '') {
        ejs.ui.toast('当前行政相对人暂无电话信息')
        return
      }

      ejs.ui.confirm({
        title: '提示',
        message: '确认拨打电话：' + contacttel,
        buttonLabels: ['取消', '确定'],
        cancelable: 1,
        success: function (result) {
          // 点击任意一个按钮都会回调
          console.log(result)
          if (result.which == 1) {
            ejs.device.callPhone(contacttel)
          }
        },
        error: function (err) {},
      })
    })

    // 反馈
    Zepto('#btn-handle').on('tap', feedbackCallback)

    // 点击查看修改监管行为
    Zepto('#supervisionList').on('tap', '.edit-action', function (e) {
      e.stopPropagation()
      var behaviorobjguid = $(this).attr('data-behaviorobjguid')

      var objguid = this.dataset.objguid
      var objname = this.dataset.objname
      var objtype = this.dataset.objtype
      var objtypevalue = this.dataset.objtypevalue

      console.log(behaviorobjguid)
      ejs.page.open({
        pageUrl: './inspection_supervision_detail.html',
        pageStyle: 1,
        orientation: 1,
        data: {
          behavobjguid: behaviorobjguid,
          rowguid: rowguid,
          objguid: objguid,
          objname: objname,
          objtype: objtypevalue,
          objtypeText: objtype,
        },
        success: function (result) {
          getCheckBehaviorList()
        },
        error: function (error) {},
      })
    })

    // 添加监管行为
    Zepto('#btn-addaction').on('tap', function () {
      ejs.page.open({
        pageUrl: './inspection_supervision_add.html',
        pageStyle: 1,
        orientation: 1,
        data: {
          rowguid: rowguid,
          objguid: objguid,
          objname: objname,
          objtype: objtype,
          objtypeText: objtypeText,
        },
        success: function (result) {
          getCheckBehaviorList()
        },
        error: function (error) {},
      })
    })

    // 删除监管行为
    Zepto('#supervisionList').on('tap', '.del-action', function (e) {
      var self = this
      e.preventDefault()
      var delguid = this.dataset.rowguid
      ejs.ui.confirm({
        title: '提示',
        message: '确认删除该条监管行为记录吗？',
        buttonLabels: ['取消', '确定'],
        cancelable: 1,
        success: function (result) {
          // 点击任意一个按钮都会回调
          console.log(result)
          if (result.which == 1) {
            $(self).parent().parent().parent().remove()
            deleteAction(delguid)
          }
        },
        error: function (err) {},
      })
    })
  }

  /**
   * @description 反馈
   */
  function feedbackCallback() {
    var punishstatus = ''
    if (Zepto('#supervisionList').find('li').length > 0) {
      if (issignnum > 0) {
        if (isphotonum > 0) {
          if (validate()) {
            console.log('反馈')
            handleItem('50', '0')
          } else {
            // ejs.ui.actionSheet({
            //     items: ['简易案件', '一般案件'],
            //     cancelable: 1,
            //     success: function (result) {
            //         console.log(result);
            //         if (result.which == -1) { // 取消

            //         } else {
            //             if (result.which == 0) {
            //                 punishstatus = '1';
            //             } else {
            //                 punishstatus = '2';
            //             }
            //             handleItem('90', punishstatus);
            //         }
            //     },
            //     error: function (err) { }
            // });

            ejs.ui.confirm({
              title: '',
              message: '是否走简易案件',
              buttonLabels: ['取消', '确定'],
              cancelable: 1,
              h5UI: false, // 是否强制使用H5-UI效果，默认false
              success: function (result) {
                // 点击任意一个按钮都会回调
                if (result.which == 0) {
                  // 不走简易案件
                  handleItem('50', '0')
                } else {
                  handleItem('60', '1')
                }
              },
              error: function (err) {},
            })
          }
        } else {
          ejs.ui.toast('请执法人员上传自拍')
        }
      } else {
        ejs.ui.toast('请执法人员签字')
      }
    } else {
      ejs.ui.toast('请添加监管行为信息')
    }
  }

  /**
   * @description 获取详情
   */
  function getDetail() {
    var url = Config.serverUrl + 'checkInfo/getCheckTaskDetail',
      data = JSON.stringify({
        token: Config.validate,
        params: {
          dutyguid: rowguid,
          pviguid: pviguid,
        },
      })

    console.log('获取详情：', url, data)

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

        objguid = result.custom.objguid
        objname = result.custom.objname
        objtype = result.custom.objtype
        objtypeText = result.custom.objtypeText

        var signlist = result.custom.sings
        signlist.forEach(function (item, index) {
          if (item.attachguid == '') {
            item.isshow = '0'
          } else {
            item.isshow = '1'
          }
          // 判断是否为当前登录者
          if (item.lepguid == userguid) {
            // 当前登录者
            item.isshowsub = '0'
          } else {
            item.isshowsub = '1'
          }
        })

        // 渲染数据-基本信息
        baseEle.innerHTML = Mustache.render(baseTpl, {
          baseInfo: result.custom,
        })

        // 渲染数据-签名人员信息
        signEle.innerHTML = Mustache.render(signTpl, {
          signionfo: signlist,
        })

        var $sign = $('#signList .check-sub')
        console.log($sign)
        $sign.each(function (index, val) {
          if (
            $(val).find('.showimg')[0].innerHTML.trim() != '' &&
            $(val).find('.showimg')[0].innerHTML.trim() !=
              '<img src="" alt="" id="personsignimg" data-id="">'
          ) {
            issignnum = issignnum + 1
          }

          if (
            $(val).find('.showimg-camera')[0].innerHTML.trim() != '' &&
            $(val).find('.showimg-camera')[0].innerHTML.trim() !=
              '<img src="" alt="" id="camerasignimg" data-id="">'
          ) {
            isphotonum = isphotonum + 1
          }
        })

        initListeners() // 事件监听
      },
      error: function (error) {
        console.log(JSON.stringify(error))
        ejs.ui.toast('接口有误，请联系管理员')
        ejs.ui.closeWaiting()
      },
      complete: function () {
        ejs.ui.closeWaiting()
      },
    })
  }

  /**
   * @description 获取监管行为信息
   */
  function getCheckBehaviorList() {
    var url = Config.serverUrl + 'checkInfo/getCheckObjBehaviorList',
      data = JSON.stringify({
        token: Config.validate,
        params: {
          dutyguid: rowguid,
          currentpageindex: '1',
          pagesize: '100',
          pviguid: '',
        },
      })

    console.log('获取监管行为信息：', url, data)

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

        var list = result.custom.behaviorobjlist
        list.forEach(function (item, index) {
          if (
            item.checkresultvalue == '01' ||
            item.checkresultvalue == '02' ||
            item.checkresultvalue == '03'
          ) {
            item.checkstatus = '1'
          }
        })

        // 渲染数据
        supervisionEle.innerHTML = Mustache.render(supervisionTpl, {
          supervisionfo: list,
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
   * @description 办结/保存
   */
  function handleItem(status, punishstatus) {
    var url = Config.serverUrl + 'checkInfo/updateCheckInfo',
      data = JSON.stringify({
        token: Config.validate,
        params: {
          dutyguid: rowguid,
          status: status,
          addressregistered: '',
          addressoperating: '',
          areanumber: '',
          entrustdept: '',
          entrustdeptcode: '',
          checktype: '',
          checkmode: '',
          ispunish: punishstatus,
          issave: issaveflag,
        },
      })

    console.log('办结/保存：', url, data)

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

        if (status == '40') {
          ejs.ui.toast('保存成功')
        } else {
          ejs.ui.toast('反馈成功')
        }

        ejs.page.close(
          JSON.stringify({
            rowguid: rowguid,
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
   * @description 删除监管行为
   */
  function deleteAction(guid) {
    var url = Config.serverUrl + 'checkInfo/deleteCheckBhvObjInfo',
      data = JSON.stringify({
        token: Config.validate,
        params: {
          rowguid: guid,
        },
      })

    console.log('删除监管行为：', url, data)

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
   * @description 所属行政区划
   */
  function getAreaInfo() {
    var url = Config.serverUrl + 'commonInter/getAreaInfoList',
      data = JSON.stringify({
        token: Config.validate,
        params: {
          areacode: Config.areacode,
        },
      })

    console.log('所属行政区划：', url, data)

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
        result.custom.areainfolist.forEach(function (item, index) {
          areaList.push({
            text: item.areaname,
            value: item.areacode,
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
   * @description 控制value的值
   */
  function chk(v, name) {
    var s = Zepto('input[name=' + name + ']')
    console.log(s)
    for (var i = 0; i < s.length; i++) {
      if (s[i].value == v) {
        console.log('匹配')
        s[i].checked = 'checked'
        return
      }
    }
  }

  /**
   * @description 提交验证
   */
  function validate() {
    var flag = 1
    var num = 0

    Zepto('#supervisionList li').each(function (index, val) {
      var result = Zepto(val).data('checkresultstatusvalue')
      console.log('result=' + result)
      if (result == '04' || result == '05' || result == '06') {
        // 包含处罚决定或强制决定
        flag = 0

        return false
      }
      flag = 1
    })

    if (flag == 0) {
      return false
    }

    return true
  }

  // 签名-拍照
  function sign() {
    var className = ejs.os.android
        ? 'com.epoint.epointhandwrite.EpointSignPadActivity'
        : 'EPTHandWriteSignViewController',
      signguid = ''
    // 签名
    $('#signList').on('tap', '.check-sub-item-sign', function (e) {
      console.log(this)
      var self = this.parentNode
      console.log(self)
      var attachguid = self.dataset.attachguid
      var personguid = self.dataset.personguid
      console.log('personguid=' + personguid)

      //			console.log(Zepto(this).find('#personsignimg'));

      if (
        Zepto(self).find('.showimg')[0].innerHTML.trim() != '' &&
        Zepto(self).find('.showimg')[0].innerHTML.trim() !=
          '<img src="" alt="" id="personsignimg" data-id="">'
      ) {
        ejs.ui.toast('已签名')
        return
      }

      ejs.page.openLocal({
        className: className,
        isOpenExist: 0,
        data: {},
        success: function (result) {
          ejs.ui.showWaiting('正在加载...')

          var data = {
            token: Config.validate,
            params: {
              attachguid: attachguid,
            },
          }
          ejs.storage.getItem({
            key: 'SignFilePath',
            success: function (data) {
              ejs.ui.closeWaiting()

              // 附件名称
              var signname = data.SignFilePath
              signname = signname.split('/')
              signname = signname[signname.length - 1]
              // 附件类型
              var signtype = signname.split('.')
              signtype = signtype[signtype.length - 1]

              ejs.stream.uploadMultipartFile({
                // 目前如果有额外参数，请拼接到url中
                url: Config.serverUrl + 'commonInter/attachUpload',
                file: {
                  path: data.SignFilePath,
                  name: signname,
                },
                headers: {
                  accept: '*/*',
                  Authorization: 'Bearer ' + token,
                },
                dataForm: {
                  attachfilename: signname, // 附件名
                  contenttype: 'image/' + signtype, // 文件类型
                  // 文档类型(文件后缀名，如:.png/.jpg；如此参数不传，则attachfilename必须带后缀名)
                  documenttype: '',
                  clienttag: '', // 业务tag
                  clientinfo: '', // 业务info
                  clientguid: rowguid, // 业务标识
                  attachguid: '',
                },
                success: function (result) {
                  var result = JSON.parse(result.data)
                  console.log(result)
                  Zepto(self)
                    .find('#personsignimg')
                    .attr('src', Config.urlstr + result.custom.attachguid)
                  console.log(Zepto(self).find('#personsignimg'))

                  Zepto(self).find('#personsign')[0].classList.add('mui-hidden')
                  //									Zepto(self).find('.tip-camera')[0].classList.remove('mui-hidden');
                  //									Zepto(self).find('.showimg-camera')[0].classList.remove('mui-hidden');

                  issignnum = issignnum + 1
                  signguid = result.custom.attachguid
                  //									signadd(result.custom.attachguid, personguid); // 签名之后保存入库接口
//              	signadd(signguid, "", personguid) // 签名之后保存入库接口
                },
                error: function (error) {},
              })
            },
            error: function (error) {},
          })
        },
      })
    })

    // 拍照
    $('#signList').on('tap', '.mui-icon-camera', function (e) {
      if (issignnum == 0) {
        ejs.ui.toast('请先完成签字')
        return
      }

      console.log('拍照')
      var self = this.parentElement.parentElement.parentElement.parentElement
      var personguid = self.dataset.personguid
      console.log(personguid)

      if (
        Zepto(self).find('.showimg-camera')[0].innerHTML.trim() != '' &&
        Zepto(self).find('.showimg-camera')[0].innerHTML.trim() !=
          '<img src="" alt="" id="camerasignimg" data-id="">'
      ) {
        ejs.ui.toast('已拍照')
        return
      }

      // 拍照获取照片
      ejs.util.cameraImage({
        width: 720,
        quality: 70,
        defaultCamera: '1',
        success: function (result) {
          console.log(result.resultData)

          ejs.ui.closeWaiting()

          // 附件名称
          var signname = result.resultData
          signname = signname.split('/')
          signname = signname[signname.length - 1]
          // 附件类型
          var signtype = signname.split('.')
          signtype = signtype[signtype.length - 1]

          ejs.stream.uploadMultipartFile({
            // 目前如果有额外参数，请拼接到url中
            url: Config.serverUrl + 'commonInter/attachUpload',
            file: {
              path: result.resultData,
              name: signname,
            },
            headers: {
              accept: '*/*',
              Authorization: 'Bearer ' + token,
            },
            dataForm: {
              attachfilename: signname, // 附件名
              contenttype: 'image/' + signtype, // 文件类型
              // 文档类型(文件后缀名，如:.png/.jpg；如此参数不传，则attachfilename必须带后缀名)
              documenttype: '',
              clienttag: '', // 业务tag
              clientinfo: '', // 业务info
              clientguid: rowguid, // 业务标识
              attachguid: '',
            },
            success: function (result) {
              var result = JSON.parse(result.data)
              console.log(Zepto(self).find('#camerasignimg'))
              console.log(Config.urlstr + result.custom.attachguid)
              Zepto(self)
                .find('#camerasignimg')
                .attr('src', Config.urlstr + result.custom.attachguid)

              isphotonum = isphotonum + 1
              signadd(signguid, result.custom.attachguid, personguid) // 签名之后保存入库接口
            },
            error: function (error) {},
          })
        },
        error: function (error) {},
      })
    })
  }

  // 请求
  function ajax(url, data, success) {
    var data = JSON.stringify(data)
    var url = Config.serverUrl + url

    ejs.ui.showWaiting()
    Util.ajax({
      url: url,
      data: data,
      contentType: 'application/json',
      success: function (result) {
        success(result)
        ejs.ui.closeWaiting()
      },
      error: function (res) {
        console.log(JSON.stringify(res))
      },
    })
  }

  // 签名/拍照之后保存入库接口
  function signadd(attachguid, pictureguid, personguid) {
    console.log('----------------------------------')
    console.log('attachguid=' + attachguid)
    console.log('pictureguid=' + pictureguid)

    var url = Config.serverUrl + 'checkInfo/signadd',
      data = JSON.stringify({
        token: Config.validate,
        params: {
          dutyguid: rowguid,
          lepguid: personguid,
          attachguid: attachguid,
          pictureguid: pictureguid,
        },
      })

    console.log('签名/拍照：', url, data)

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
        ejs.ui.toast('上传成功')
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
})(document, Zepto)
