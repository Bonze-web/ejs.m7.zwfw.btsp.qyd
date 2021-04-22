/**
 * 作者：彭屹尧
 * 创建时间：2019-11-20
 * 版本：[1.0, 2019-11-20]
 * 版权：江苏国泰新点软件有限公司
 * 描述：随机检查 新增
 **/

;(function (d, Util, $) {
  'use strict'

  var personclasslist = [], //相对人类别列表
    personlist = [], //相对人列表
    list = [], //列表变量
    acguid = '',
    actype = '', //行政相对人类别com
    personclass = '', //行政相对人类别内容
    personnature = '', //行政相对人性质
    personcard = '', //行政相对人证件类型
    personnumber = '', //行政相对人证件编码
    thingname = '',
    thingvalue = '', //监管事项主键
    lawname = '',
    lawvalue = '', //执法人员主键
    objguid = '',
    objname = '',
    objtype = '',
    objtypeText = '',
    dutyguid = '', //随机生成uuid
    choosetype = '', //选择按钮类别
    taskname = '',
    issaveflag = '', //任务名称
    rowguid = '',
    personnaturetype = '',
    personcardtype = '',
    // 监管事项信息
    supervisionEle = document.getElementById('supervisionList'),
    supervisionTpl = document.getElementById('supervision-template').innerHTML

  var jgobjlist = [],
    lawobjlist = []

  Util.loadJs(
    'js/widgets/mui.poppicker/mui.poppicker.css',
    'js/widgets/mui.picker/mui.picker.css',
    'js/widgets/mui.poppicker/mui.poppicker.js',
    'js/widgets/mui.picker/mui.picker.js',
    function () {
      initPage()
    }
  )

  function initPage() {
    dutyguid = Util.uuid2() // 生成36位唯一标识

    // TODO
    getCheckBehaviorList()
    //初始化
    initListeners()
    //获取行政相对人类别
    getPersonClass()
  }

  function initListeners() {
    $('body')
      .on('tap', '#personclass', function (e) {
        $('#personclass').empty()
        $('#person').empty()
        $('#personnature').empty()
        $('#personcard').empty()
        $('#personnumber').empty()

        // 选择行政相对人类别

        var self = this

        if (personclasslist.length < 1) {
          ejs.ui.toast('数据加载中...')

          return false
        }

        ejs.ui.popPicker({
          layer: 1,
          data: personclasslist,
          success: function (result) {
            self.value = result.items[0].text
            actype = result.items[0].value
            objname = result.items[0].text
            // getPerson()
            $('#person').val('')
          },
          error: function (err) {},
        })
      })
      .on('tap', '#person', function (e) {
        personclass = $('#personclass').val() || ''

        if (!personclass) {
          ejs.ui.toast('请选择行政相对人类别')
          return false
        }
        // 选择行政相对人
        console.log(this)

        var self = this

        // if (personlist.length < 1) {
        //   ejs.ui.toast('数据加载中...')

        //   return false
        // }

        ejs.page.open({
          pageUrl: './choose_obj.html',
          pageStyle: 1,
          orientation: 1,
          data: {
            objecttype: actype,
          },
          success: function (result) {
            /**
                 * 目标页面关闭后会触发这个回调，参数是页面通过close传递过来的参数
                 * {
                        resultData: '可能是json，也可能是普通字符串，要看怎么传参的'
                   }
                 */
            console.log(result.resultData)
            self.value = result.resultData.itemname
            acguid = result.resultData.itemguid
            objtypeText = result.resultData.itemname
            getAutocontent()
          },
          error: function (error) {},
        })
      })
      .on('tap', '#btn-thing', function (e) {
        // 获取监管事项
        ejs.page.open({
          pageUrl: './multiple_selection_thing.html',
          pageStyle: 1,
          orientation: 1,
          data: {
            jgobjlist: jgobjlist,
          },
          success: function (result) {
            console.log('上页数据', result.resultData.jgobjlist)

            jgobjlist = []
            jgobjlist = result.resultData.jgobjlist
            thingname = ''
            thingvalue = ''
            jgobjlist.forEach(function (item, index) {
              thingname += item.itemname + ';'
              thingvalue += item.itemguid + ';'
            })

            $('#thingname').html(thingname)
            console.log(thingvalue)
            // getJgThings()
            // thingname = result.resultData.thingname
            // thingvalue = result.resultData.thingvalue
            // console.log(thingname)
            // $('#thingname').html(thingname)
          },
          error: function (error) {},
        })
      })
      .on('tap', '#btn-law', function (e) {
        // 获取执法人员
        ejs.page.open({
          pageUrl: './multiple_selection_law.html',
          pageStyle: 1,
          orientation: 1,
          data: {
            lawobjlist: lawobjlist,
          },
          success: function (result) {
            console.log('上页数据', result.resultData.lawobjlist)

            lawobjlist = []
            lawobjlist = result.resultData.lawobjlist
            lawname = ''
            lawvalue = ''
            lawobjlist.forEach(function (item, index) {
              lawname += item.itemname + ';'
              lawvalue += item.itemguid + ';'
            })

            $('#lawname').html(lawname)
            console.log(lawvalue)

            // console.log('上页数据', result, result.resultData)
            // lawname = result.resultData.lawname
            // lawvalue = result.resultData.lawvalue
            // $('#lawname').html(lawname)
          },
          error: function (error) {},
        })
      })
  }

  //   获取监管事项
  //   function getJgThings() {
  //     Util.ajax({
  //       url: Config.serverUrl + 'checkInfo/getRandomItemList',
  //       data: {
  //         token: Config.validate,
  //         params: JSON.stringify({
  //           dutyguid: dutyguid,
  //         }),
  //       },
  //       contentType: 'application/json',
  //       success: function (result) {
  //         if (result.status.code !== 1) {
  //           ejs.ui.toast(result.status.text)
  //           return
  //         }
  //         console.log(result)
  //         thingname = result.custom.superviseitems
  //         thingvalue = result.custom.cimguids
  //         $('#thingname').html(thingname)
  //       },
  //       error: function (error) {
  //         ejs.ui.toast(Config.TIPS_II)
  //       },
  //     })
  //   }

  // 获取相对人类别
  function getPersonClass() {
    console.log(112)
    Util.ajax({
      url: Config.serverUrl + 'commonInter/getCodeInfoList',
      data: {
        token: Config.validate,
        params: JSON.stringify({
          codename: '行政相对人类别',
        }),
      },
      contentType: 'application/json',
      success: function (result) {
        console.log(result)
        personlist = []

        list = result.custom.codelist || []

        for (let i = 0; i < list.length; i++) {
          personclasslist.push({
            value: list[i].itemvalue,
            text: list[i].itemtext,
          })
        }
      },
      error: function (error) {
        ejs.ui.toast(Config.TIPS_II)
      },
    })
  }

  // 获取相对人
  function getPerson() {
    Util.ajax({
      url: Config.serverUrl + 'checkInfo/getCheckObjList',
      data: {
        token: Config.validate,
        params: JSON.stringify({
          currentpageindex: '1',
          pagesize: '999',
          objecttype: actype,
        }),
      },
      contentType: 'application/json',
      success: function (result) {
        personlist = []
        list = result.custom.objectlist || []
        for (let i = 0; i < list.length; i++) {
          personlist.push({
            text: list[i].titlename,
            value: list[i].rowguid,
          })
        }
      },
      error: function (error) {
        ejs.ui.toast(Config.TIPS_II)
      },
    })
  }

  // 获取自动填写字段
  function getAutocontent() {
    Util.ajax({
      url: Config.serverUrl + 'checkInfo/getxzxdrinfo',
      data: {
        token: Config.validate,
        params: JSON.stringify({
          actype: actype,
          acguid: acguid,
        }),
      },
      contentType: 'application/json',
      success: function (result) {
        console.log(result)

        personnature = result.custom.administrativecpnastr
        personnaturetype = result.custom.administrativecpna
        personcard = result.custom.administrativecpcetypestr
        personcardtype = result.custom.administrativecpcetype
        personnumber = result.custom.administrativecpuicode
        console.log(personnumber)

        autoFocus()
      },
      error: function (error) {
        ejs.ui.toast(Config.TIPS_II)
      },
    })
  }

  // 自动填写字段
  function autoFocus() {
    console.log('自动填写成功')
    $('#personnature').html(personnature)
    $('#personcard').html(personcard)
    $('#personnumber').html(personnumber)
  }

  // 添加监管行为
  Zepto('#btn-addaction').on('tap', function () {
    console.log(thingvalue)
    if (actype == '') {
      ejs.ui.toast('请选择行政相对人类别')
      return false
    }
    if (acguid == '') {
      ejs.ui.toast('请选择行政相对人')
      return false
    }
    if (thingvalue == '') {
      ejs.ui.toast('请选择监管事项')
      return false
    }
    ejs.page.open({
      pageUrl: './temporary_supervision_add.html',
      pageStyle: 1,
      orientation: 1,
      data: {
        thingvalue: thingvalue,
        dutyguid: dutyguid,
        objname: objname,
        objtypeText: objtypeText,
        objtype: actype,
        objguid: acguid,
      },
      success: function (result) {
        console.log('监管行为主键', result)
        console.log('监管行为主键' + result.resultData.dutyguid)
        rowguid = result.resultData.dutyguid

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
      pageUrl: './temporary_supervision_detail.html',
      pageStyle: 1,
      orientation: 1,
      data: {
        behavobjguid: behaviorobjguid,
        thingvalue: thingvalue,
        dutyguid: dutyguid,
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

  /**
   * @description 获取监管行为信息
   */
  function getCheckBehaviorList() {
    console.log(rowguid + '监管信息主键')

    var url = Config.serverUrl + 'checkInfo/getCheckObjBehaviorList',
      data = JSON.stringify({
        token: Config.validate,
        params: {
          dutyguid: rowguid,
          currentpageindex: '1',
          pagesize: '100',
          flag: '1',
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

        console.log('添加监管行为', list)

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

  // 保存
  Zepto('#btn-save').on('tap', function () {
    taskname = $('#taskname').val()

    if (taskname == '') {
      ejs.ui.toast('请填写任务名称')
      return false
    }
    if (actype == '') {
      ejs.ui.toast('请选择行政相对人类别')
      return false
    }
    if (acguid == '') {
      ejs.ui.toast('请选择行政相对人')
      return false
    }
    if (thingvalue == '') {
      ejs.ui.toast('请选择监管事项')
      return false
    }
    if (lawvalue == '') {
      ejs.ui.toast('请选择执法人员')
      return false
    }
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
          handleItem()
        }
      },
      error: function (err) {},
    })
  })

  function handleItem() {
    if (thingvalue.substr(thingvalue.length - 1, 1) === ';') {
      thingvalue = thingvalue.substring(0, thingvalue.length - 1)
    }

    if (lawvalue.substr(lawvalue.length - 1, 1) === ';') {
      lawvalue = lawvalue.substring(0, lawvalue.length - 1)
    }

    console.log(thingvalue, lawvalue)
    console.log(taskname)

    var url = Config.serverUrl + 'checkInfo/randomdtyadd',
      data = JSON.stringify({
        token: Config.validate,
        params: {
          dtyguid: dutyguid, //任务标识
          checkactionname: taskname, //必填 任务名称
          actype: actype, //必填 行政相对人类别
          acguid: acguid, //必填 行政相对人主键
          objname: objtypeText, // objname, //必填 行政相对人名称
          administrativecpna: personnaturetype, //必填 行政相对人性质
          administrativecpuicode: personnumber, //必填行政相对人编码
          administrativecpcetype: personcardtype, //必填行政相对人证件类别
          cimguid: thingvalue, //必填 监管事项唯一标识（多个以分号分隔）
          lepsguid: lawvalue, // 必填 执法人员唯一标识（多个以分号分隔）
        },
      })

    console.log('办结/保存：', url, data);

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
        ejs.ui.toast(result.status.text)

        ejs.page.close(
          JSON.stringify({
            key: '111',
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

  // 返回
  $('body').on('tap', '#btn-handle', function (e) {
    ejs.page.close(JSON.stringify({}))
  })
})(document, window.Util, Zepto)
