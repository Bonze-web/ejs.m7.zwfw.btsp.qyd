/**
 * 作者： 袁莉
 * 创建时间： 2019/07/05
 * 版本： [1.0, 2019/07/05]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：领导批示-详情页
 */

;(function (doc, Util) {
  'use strict'

  var feedbackText = '',
    personName = '',
    isclose = '',
    personname = '',
    personGuid = '',
    projectGuid = Util.getExtraDataByKey('rowGuid'),
    feedbackguid = Util.uuid()
  var attachlist = {
    attachlist: [],
  }

  Util.loadJs(
    ['js/widgets/fileinput/fileinput.js', 'pages/common/formatfile.min.js'],
    function () {
      ejs.config({
        jsApiList: [],
      })
      ejs.ready(function () {
        details()
      })
    }
  )

  function initListeners() {
    Zepto('body').on('tap', '.list-item', function () {
      var downurl = $(this).attr('data-path'),
        downname = $(this).attr('data-name')
      ejs.io.downloadFile({
        url: downurl,
        fileName: downname,
        reDownloaded: 0,
        success: function (result) {
          var path = result.filePath
          console.log(path)
          ejs.audio.stopPlay({
            path: path,
            success: function (result) {},
            error: function (error) {},
          })
          ejs.audio.startPlay({
            path: path,
            success: function (result) {
              console.log(123)
            },
            error: function (error) {
              console.log('这是一个error')
              console.log(error)
            },
          })
          // ejs.ui.toast('附件下载成功,请在我的文件中查看。');
        },
        error: function (error) {},
      })
    })
    //查看处理人详情
    $('#btn-deal-people').on('tap', function () {
      $('#mask').removeClass('mui-hidden')
      $('#mask-people').removeClass('mui-hidden')
    })

    //点击蒙版空白部分关闭蒙版
    $('#mask').on('tap', function (e) {
      var target = e.target
      if (target.id == 'mask') {
        closeMask()
      }
    })

    //附件上传按钮点击
    $('#btn-feedback-file').on('tap', function () {
      $('#attach').click()
    })

    //反馈列表附件点击下载
    $('.listfile-fk').on('tap', function () {
      var downurl = $(this).attr('data-url'),
        downname = $(this).attr('data-name')

      console.log(downurl + '***' + downname)
      ejs.io.downloadFile({
        url: downurl,
        fileName: downname,
        reDownloaded: 0,
        success: function (result) {
          ejs.ui.toast('附件下载成功,请在我的文件中查看。')
        },
        error: function (error) {},
      })
    })

    //页面底部按钮
    $('#footer')
      .on('tap', '#footer-fk', function () {
        //反馈
        $('#mask').removeClass('mui-hidden')
        $('#mask-feedback').removeClass('mui-hidden')
      })
      .on('tap', '#footer-bj', function () {
        //办结
        ejs.ui.confirm({
          title: '提示',
          message: '是否确认办结？',
          buttonLabels: ['取消', '确定'],
          cancelable: 1,
          success: function (result) {
            isclose = '1'
            var chooseType = result.which

            if (chooseType == 1) {
              //TODO 刷新反馈列表
              handlerBj()
            } else {
              return false
            }
          },
          error: function (err) {
            console.log(err)
          },
        })
      })
      .on('tap', '#footer-zj', function () {
        //转交

        ejs.util.invokePluginApi({
          path: 'workplatform.provider.openNewPage',
          dataMap: {
            method: 'goSelectPerson',
            issingle: 1,
          },
          success: function (result) {
            console.log(result)
            //TODO 执行转交方法 刷新反馈列表
            personName = result.resultData[0].username
            personGuid = result.resultData[0].userguid

            ejs.ui.confirm({
              title: '提示',
              message: '确认转交给' + personName,
              buttonLabels: ['取消', '确定'],
              cancelable: 1,
              success: function (result) {
                var chooseType = result.which
                isclose = '1'
                if (chooseType == 1) {
                  personname = personName
                  zjInstraction()
                } else {
                  return false
                }
              },
              error: function (err) {
                console.log(err)
              },
            })
          },
          error: function (err) {},
        })
      })

    //蒙版内反馈按钮
    $('#mask-feedback')
      .on('tap', '#btn-feedback-cancel', function () {
        //取消
        $('#feedback-text').val('')
        closeMask()
      })
      .on('tap', '#btn-feedback-submit', function () {
        //反馈
        feedbackText = $('#feedback-text').val()
        if (feedbackText == '') {
          ejs.ui.toast('请输入反馈内容!')
          return false
        } else {
          //TODO 调用反馈接口
          uploadAttach()
          console.log($('#feedback-text').val())
          ejs.ui.toast('反馈成功：' + feedbackText)

          closeMask()
        }
      })

    Zepto('body').on('tap', '.attach-item', function (e) {
      if (Zepto(e.target).hasClass('delete')) {
        var parent = Zepto(this).parent()[0]
        var attachguid = Zepto(this).attr('data-guid')
        var isupload = Zepto(this).attr('data-isupload')

        //TODO
        if (isupload === '1') {
          deleteAttach(attachguid).then(function () {
            ejs.ui.toast('删除成功')
            delRenderAttach(parent, attachguid)
          })
        } else {
          ejs.ui.toast('删除成功')
          delRenderAttach(parent, attachguid)
        }
      }
    })

    new FileInput({
      container: '#attach',
      isMulti: false,
      type: 'All',
      success: function (b64, file, detail) {
        var filename = file.name
        var filesize = FormatFile.getKMByByte(file.size)
        var fileicon = FormatFile.getFileIcon(filename)

        if (attachlist.attachlist.length < 3) {
          attachlist.attachlist.push({
            fileurl: fileicon,
            path: b64,
            filename: filename,
            filesize: filesize,
            fileicon: fileicon,
            file: file,
            isupload: '0',
            attachGuid: Util.uuid(),
          })
        } else {
          ejs.ui.toast('最多只能上传三个附件')
        }
        renderAttach()
      },
      error: function (error) {
        console.error(error)
      },
    })
  }
  /**
   * 关闭蒙版
   */
  function closeMask() {
    $('#mask').addClass('mui-hidden')
    $('#mask-people').addClass('mui-hidden')
    $('#mask-feedback').addClass('mui-hidden')
  }

  /**
   * 设置附件列表格式
   */
  function renderAttach() {
    if (attachlist.attachlist.length > 0) {
      Zepto('.filelist').removeClass('mui-hidden')
    } else {
      Zepto('.filelist').addClass('mui-hidden')
    }
    // dom.attachnum.html(attachlist.attachlist.length);
    var outHtml = Mustache.render(Zepto('#attachtemplate').html(), attachlist)

    Zepto('.filelist').html(outHtml)
  }
  /**
   * 批示办结
   */
  function handlerBj() {
    var url = Config.serverUrl + 'projectLibraryService/instructionsbanjie',
      requestData = {},
      paramsData = {
        rowguid: projectGuid,
      }

    requestData = JSON.stringify(paramsData)
    requestData = {
      params: requestData,
    }
    Util.ajax({
      url: url,
      data: requestData,
      contentType: 'application/x-www-form-urlencoded',
      success: function (result) {
        if (result.custom.code == '0') {
          ejs.ui.toast(result.custom.text)
        } else {
          ejs.ui.alert({
            title: '提示',
            message: '办结成功',
            buttonName: '确定',
            cancelable: 1,
            success: function (result) {
              // 点击 alert的按钮后回调
              ejs.page.close()
            },
            error: function (err) {},
          })
        }
      },
      error: function (result) {},
      complete: function () {
        // addFeedback();
      },
    })
  }
  /**
   * 批示详情接口
   */
  function details() {
    var url = Config.serverUrl + 'projectLibraryService/instructionsdetail',
      names = '',
      requestData = {},
      paramsData = {
        rowguid: projectGuid,
      }

    requestData = JSON.stringify(paramsData)
    requestData = {
      params: requestData,
    }
    Util.ajax({
      url: url,
      data: requestData,
      success: function (result) {
        console.log(result)
        for (var i = 0; i < result.custom.person.length; i++) {
          names = names + result.custom.person[i].username + ';'
          result.custom.person[i].photo = result.custom.person[
            i
          ].username.substr(result.custom.person[i].username.length - 2, 2)
          if (result.custom.person[i].status == '处理中') {
            result.custom.person[i].color = 'wbj'
          } else {
            result.custom.person[i].color = 'ybj'
          }
        }
        for (var i = 0; i < result.custom.feedback.length; i++) {
          result.custom.feedback[i].photo = result.custom.feedback[
            i
          ].username.substr(result.custom.feedback[i].username.length - 2, 2) //头像名称
          if (result.custom.feedback[i].uploadattachList.length != '0') {
            for (
              var j = 0;
              j < result.custom.feedback[i].uploadattachList.length;
              j++
            ) {
              result.custom.feedback[i].uploadattachList[
                j
              ].icon = FormatFile.getFileIcon(
                result.custom.feedback[i].uploadattachList[j].attachFileName
              )
            }
          }
        }

        console.log(result)
        // ileicon = FormatFile.getFileIcon(filename);
        for (var i = 0; i < result.custom.uploadattachList.length; i++) {
          result.custom.uploadattachList[i].attachFileName = decodeURI(
            result.custom.uploadattachList[i].attachFileName
          )
        }

        var outdata = result.custom || '',
          litemplate1 = Mustache.render($('#info-template').html(), outdata),
          litemplate2 = Mustache.render($('#fk-template').html(), outdata),
          litemplate3 = Mustache.render($('#mask-template').html(), outdata)

        doc.getElementById('listdata').innerHTML = litemplate1
        doc.getElementById('fklist').innerHTML = litemplate2
        doc.getElementById('mask-people').innerHTML = litemplate3

        Zepto('.deal-people').text(names)
        Zepto('.mask-people-title').text(
          '全部处理人员' + '(' + result.custom.person.length + ')'
        )
      },
      complete: function () {
        initListeners()
      },
    })
  }

  /**
   * 反馈接口
   */
  function addFeedback() {
    var feedbackContent = $('#feedback-text').val()

    console.log(feedbackContent)
    console.log(feedbackText)
    console.log(feedbackguid)
    var url = Config.serverUrl + 'projectLibraryService/instructionsfeedback',
      requestData = {},
      paramsData = {
        rowguid: projectGuid,
        content: feedbackContent,
        feedbackguid: feedbackguid,
      }

    requestData = JSON.stringify(paramsData)
    requestData = {
      params: requestData,
    }
    console.log(requestData)
    Util.ajax({
      url: url,
      data: requestData,
      success: function (result) {
        console.log(result)
        $('#feedback-text').val('')
        ejs.page.reload()
      },
      error: function () {},
      complete: function () {
        if (isclose == '1') {
          ejs.page.close()
        }
      },
    })
  }

  /**
   * 批示转交
   */

  function zjInstraction() {
    var url = Config.serverUrl + 'projectLibraryService/instructionszhuanjiao',
      requestData = {},
      paramsData = {
        rowguid: projectGuid,
        userguid: personGuid,
        username: personName,
      }

    requestData = JSON.stringify(paramsData)
    requestData = {
      params: requestData,
    }
    console.log(requestData)
    Util.ajax({
      url: url,
      data: requestData,
      success: function (result) {
        if (result.custom.code == '0') {
          ejs.ui.toast(result.custom.text)
        } else {
          ejs.ui.alert({
            title: '提示',
            message: '转交成功',
            buttonName: '确定',
            cancelable: 1,
            success: function (result) {
              // 点击 alert的按钮后回调
              ejs.page.close()
            },
            error: function (err) {},
          })
        }
      },
      error: function () {},
      complete: function () {},
    })
  }

  /**
   * 获取用户基本信息
   */
  function requestInfo() {
    var url = Config.serverUrl + 'getsqbase',
      requestData = {},
      paramsData = {
        wxid: '12345',
      }

    paramsData = JSON.stringify(paramsData)

    requestData = {
      params: paramsData,
    }

    console.log(requestData, url)

    Util.ajax({
      url: url,
      data: requestData,
      success: function (result) {
        var outdata = result.custom || '',
          litemplate = Mustache.render($('#self-template').html(), outdata)

        console.log(JSON.stringify(outdata))

        doc.getElementById('listdata').innerHTML = litemplate
      },
    })
  }
  /**
   * 下拉刷新
   */
  function pullToRefresh() {
    var url = Config.serverUrl + 'getapplylist'

    minirefreshObj = new MiniRefreshBiz({
      url: url,
      delay: 0,
      initPageIndex: 1,
      template: '#item-template',
      dataRequest: function (currPage) {
        var requestData = {},
          paramsData = {
            type: type,
            wxid: openId,
            pagesize: PAGE_SIZE,
            currentpageindex: currPage,
          }

        paramsData = JSON.stringify(paramsData)

        requestData = {
          params: paramsData,
        }

        console.log('请求参数：' + paramsData + url)

        return requestData
      },
      dataChange: function (response) {
        console.log(JSON.stringify(response))

        listData = response.custom || ''
        return listData
      },

      itemClick: function (e) {},
      success: function () {},
      error: function (response) {
        console.log(response)
      },
    })
  }
  //附件上传
  function uploadAttach() {
    var list = attachlist.attachlist
    var files = []

    for (var i = 0; i < list.length; i++) {
      var item = list[i]

      files.push({
        name: item.filename,
        file: item.file,
      })
    }

    return Util.upload({
      url: Config.serverUrl + 'commonService/reportattachstorage',
      data: {
        filename: '',
        clientguid: feedbackguid,
        cliengtag: 'upload',
      },
      files: files,
      success: function (response, status, xhr) {
        console.log(response)
        addFeedback()
      },
      uploading: function (percent, speed, status) {
        console.log('上传中:' + percent + ',speed:' + speed + ',msg:' + status)
      },
    })
  }

  function delRenderAttach(parent, attachguid) {
    var list = []
    var i = 0
    var item = null

    for (i = 0; i < attachlist.attachlist.length; i++) {
      item = attachlist.attachlist[i]

      if (item.attachGuid !== attachguid) {
        list.push(item)
      }
    }
    attachlist.attachlist = list
    renderAttach()
  }
})(document, window.Util)
