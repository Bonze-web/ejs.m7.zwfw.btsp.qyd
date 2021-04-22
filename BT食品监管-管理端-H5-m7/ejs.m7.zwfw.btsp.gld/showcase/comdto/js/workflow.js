/**
 * 作者: guotq
 * 时间: 2019-6-18
 * 描述: 事项处理页面
 */

var M = Mustache,
  HandlePassServerUrl = window.handlePassServerUrl;

var steplistdata = [], // 步骤列表
  issinglecheck = false, // 允许单选还是多选
  isShowSms = false, // 是否显示短信区域
  smscontext = ""; // 短信内容

var opinioncontent = document.getElementById("opinioncontent"),
  curropEl = document.getElementById("cur-op"), // 当前意见
  currstepEl = document.getElementById("cur-step"); // 当前步骤

var $curActivity = $("#cur-activity"), // 当前分支
  $popwindowBranch = $("#popwindow-branch"), // 分支弹窗
  $branchGroup = $("#branch-group"), // 当前分支组
  $actper = $("#actper"), // 人员 container
  $sms = $("#sms"); // 短信 switch

var tplSingleBranch = document.getElementById("tpl-singlebranch").innerHTML, // 单选模板
  tplMultiBranch = document.getElementById("tpl-multibranch").innerHTML, // 多选模板
  tplActper = document.getElementById("tpl-actper").innerHTML, // 选人模板
  tplActperItem =
    '<div class="actper-item" data-handlerguid="{{handlerguid}}" data-handlername="{{handlername}}" data-ouguid="{{ouguid}}">{{handlername}}</div>';

var workitemguid = Util.getExtraDataByKey("workItemGuid"), // 当前工作项标识
  processVersionInstanceGuid = Util.getExtraDataByKey(
    "processVersionInstanceGuid"
  ), // 当前流程版本实例标识
  operationguid = Util.getExtraDataByKey("operationGuid"); // 当前按钮标识

var operationtype = Util.getExtraDataByKey("operationtype") || "";
var messageitemguid = Util.getExtraDataByKey("MessageItemGuid") || "";
var is_ShowAdvicetab = false;
var is_NeedOpinion = false;
var stepCustom = [];

/**
 * 删除字符串结尾的分号
 * @param {String} str 字符串
 * @param {String} separator 分隔符号
 * @returns {String} 删除分号后的字符串
 */
var delsemiforstring = function (str, separator) {
  separator = separator || ";";
  var reg = new RegExp(separator + "$");

  return str.replace(reg, "");
};

ejs.navigator.hookSysBack({
  success: function (result) {
    ejs.page.close("key");
  },
  error: function (error) {},
});

ejs.navigator.hookBackBtn({
  success: function (result) {
    ejs.page.close("key");
  },
  error: function (error) {},
});

// 分支选择
(function (win) {
  // 初始化页面
  epointm.execute(
    HandlePassServerUrl.handleactionInitPageUrl,
    "",
    function (data) {
      render(data);
      epm.hidePageLoading();

      if (operationtype != "Back") {
        $actper.removeClass("hidden");
      }
      getMsg(function () {
        branchHandler(win);
      });
    }
  );

  // 点击事件监听
  initListeners();

  /**
   * 渲染頁面
   * @param {String} jsonStr JSON字符串数据
   */
  function render(jsonStr) {
    var data = epm.decodeJson(jsonStr);

    curropEl.value = data.operationname;
    currstepEl.value = data.activityname;
    is_ShowAdvicetab = data.is_ShowAdvicetab;
    is_NeedOpinion = data.opinion.required;

    // 初始化分支 nextsteplist
    var steplist = data.nextsteplist;

    if (!steplist || (!steplist.data && typeof nextsteplist !== "undefined")) {
      if (typeof is_ShowAdvicetab !== "undefined" && !is_ShowAdvicetab) {
        Util.ejs.ui.alert("没有可选择步骤！");
      }
      return;
    }

    var stepname = "";
    var stepguid = "";
    issinglecheck = steplist.issinglecheck;
    if (steplist.data) {
      steplistdata = JSON.parse(JSON.stringify(steplist.data));
      $("#select-branch").removeClass("hidden");
    } else {
      return;
    }
    steplistdata.forEach(function (e) {
      // e.checked = true;
      if (e.checked) {
        stepname += e.stepname + ";";
        stepguid += e.stepguid + ";";

        // 获取对应分支的处理人
        win.getBranchActPer(e.stepguid, e.stepname, e.stepguid);
      }
    });

    stepguid = delsemiforstring(stepguid);
    if (stepguid) {
      $curActivity.html(
        '<span data-stepguid="' +
          stepguid +
          '">' +
          delsemiforstring(stepname) +
          "</span>"
      );
    } else {
      $curActivity.html("");
    }
    // oneList(steplistdata)
  }

  function oneList(steplistdata) {
    if (steplistdata.length > 0) {
      var stepguid = steplistdata[0].stepguid;
      var stepname = steplistdata[0].stepname;

      window.getBranchActPer(stepguid, stepname, stepguid);
    }
  }
  /**
   * 点击事件监听
   */
  function initListeners() {
    $(".em-watch-flow").on("tap", function () {
      ejs.page.open({
        pageUrl: "./canvasflow/showflow.html",
        pageStyle: 1,
        orientation: 1,
        data: {
          id: messageitemguid,
        },
        success: function (result) {},
      });
    });
    // 短信提醒
    $("#sms").on("tap", function () {
      this.classList.toggle("mui-active");
    });

    // 点击选择分支
    $("#select-branch").on("tap", function () {
      // 单选、多选分支模板
      var tpl = issinglecheck ? tplSingleBranch : tplMultiBranch;
      var item = "";

      steplistdata.forEach(function (e) {
        item += M.render(tpl, e);
      });

      setTimeout(function () {
        $branchGroup.html(item);
        showPopWindowBranch();
        epm.showMask();
      }, 200);
    });

    // 确认分支
    $("#branch-confirm").on("tap", function () {
      var stepname = "";
      var stepguid = "";

      // 清空分支
      $actper.html("");
      $.each($branchGroup.find("input"), function (i, e) {
        var checked = e.checked;
        var item = steplistdata[i];
        var _stepguid = item.stepguid;
        var stepEl = document.getElementById(_stepguid);

        item.checked = checked;

        if (checked) {
          stepname += item.stepname + ";";
          stepguid += _stepguid + ";";

          // 选中状态下 如果没有这个步骤的选人界面则需要加载
          if (!stepEl) {
            window.getBranchActPer(_stepguid, item.stepname, _stepguid);
          }
        } else {
          stepEl && stepEl.remove();
        }
      });

      stepguid = delsemiforstring(stepguid);
      if (stepguid) {
        $curActivity.html(
          '<span data-stepguid="' +
            stepguid +
            '">' +
            delsemiforstring(stepname) +
            "</span>"
        );
      } else {
        $curActivity.html("");
      }

      // 隐藏相关区域
      hidePopWindowBranch();
      epm.hideMask();
    });

    // 取消分支
    $("#branch-cancel").on("tap", function () {
      hidePopWindowBranch();
      epm.hideMask();
    });

    // 关闭遮罩的时候关闭分支选择
    $("body").on("tap", ".mui-backdrop", function () {
      hidePopWindowBranch();
    });
  }

  /**
   * 展示弹窗分支
   */
  function showPopWindowBranch() {
    $popwindowBranch.removeClass("hidden");
  }

  /**
   * 隐藏弹窗分支
   */
  function hidePopWindowBranch() {
    $popwindowBranch.addClass("hidden");
  }
})(window);

/**
 * 获取各个分支的处理人 getStepInfo
 * @param {String} stepguid 流程id
 * @param {String} stepname 步骤name
 */
function getBranchActPer(stepguid, stepname, stepguid) {
  // 后端要求stepguid放在url上
  // 且针对预选处理人范围的情况，新增isshowfilterhandler=true参数进行分辨
  var url =
    HandlePassServerUrl.getStepInfoPageUrl +
    "?isshowfilterhandler=true&stepguid=" +
    stepguid;
  epointm.execute(url, "@none", [workitemguid, stepguid], function (data) {
    render(data, stepname, stepguid);
    epm.hidePageLoading();
  });
}
/**
 * 渲染页面数据
 * @param {String} jsonStr json字符串
 */
function render(jsonStr, stepname, stepguid) {
  var data = epm.decodeJson(jsonStr);

  if (data.handlermode === "workflow") {
    // 获取预选处理人范围
    var userlist = [];
    data.filterhandlerlist.forEach(function (element) {
      userlist.push({
        ouguid: element.ouguid,
        username: element.handlername,
        userguid: element.handlerguid,
      });
    });
    stepCustom.push({
      stepguid: stepguid,
      custom: {
        userlist: userlist,
      },
    });
  }

  data.count = data.handlerlist.length;

  isShowSms = data.smsvisible;
  smscontext = data.smscontext;

  if (data.smsvisible) {
    $("#sms-container").removeClass("hidden");
  }

  if (data.smschecked) {
    $sms.addClass("mui-active");
  }

  data.stepname = stepname;
  data.stepguid = stepguid;
  $actper.html($actper.html() + M.render(tplActper, data));
}

function branchHandler(win) {
  /**
   * 获取各个分支的处理人 getStepInfo
   * @param {String} stepguid 流程id
   * @param {String} stepname 步骤name
   */
  // win.getBranchActPer = function (stepguid, stepname, stepguid) {
  //     epointm.execute(HandlePassServerUrl.getStepInfoPageUrl, '@none', [workitemguid, stepguid],
  //         function (data) {
  //             render(data, stepname, stepguid);
  //             epm.hidePageLoading();
  //         });
  // };

  // 添加人员
  $actper.on("tap", ".actper-add", function () {
    var parent = $(this).parents(".actper-con");
    var $actperItems = $(parent).find(".actper-items");
    var $actperCount = $(parent).find(".actper-count");
    var $actperItem = $actperItems.find(".actper-item");
    var selectedusers = [];
    var dataMap = null;
    var stepguid = parent.attr("id");

    $.each($actperItem, function (i, e) {
      var dataset = e.dataset;

      selectedusers.push({
        userguid: dataset.handlerguid,
        username: dataset.handlername,
        ouguid: dataset.ouguid,
      });
    });

    dataMap = {
      method: "goSelectPerson",
      selectedusers: selectedusers,
      issingle: 0,
    };

    if (stepCustom.length > 0) {
      stepCustom.forEach(function (element) {
        if (element.stepguid === stepguid) {
          dataMap.custom = element.custom;
        }
      });
    }

    ejs.util.invokePluginApi({
      path: "workplatform.provider.openNewPage",
      dataMap: dataMap,
      f9action:
        "sformdesigncommonaction.getCommonTreeModel(all,people,true,bindname)",
      f9controlid: epm.generateId(),
      success: function (result) {
        var resultData = result.resultData;
        var item = "";

        // 清空选人列表
        $actperItems.html();

        $.each(resultData, function (i, e) {
          item += M.render(tplActperItem, {
            handlername: e.username,
            handlerguid: e.userguid,
            ouguid: e.ouguid,
          });
        });

        $actperCount.html(resultData.length);
        $actperItems.html(item);
      },
      error: function (err) {
        console.error(err);
      },
    });
  });
}
// 获取意见模板
function getMsg(callback) {
  var commonopinionlist = null, // 公共意见模板
    useropinionlist = null; // 个人意见模板

  /**
   * 获取意见模板
   */
  function getOperationTpl(cb) {
    epointm.execute(
      HandlePassServerUrl.opinionCtrlForOperationPageUrl,
      "",
      "2",
      function (data) {
        var json = epm.decodeJson(data);

        commonopinionlist = json.commonopinionlist;
        useropinionlist = json.useropinionlist;
        cb && cb();
      }
    );
  }

  /**
   * 意见模板点击事件
   */
  function initListeners() {
    // 点击公共意见模板
    $("#operation")
      .on("tap", ".common-operation", function () {
        if (!commonopinionlist || commonopinionlist.total <= 0) {
          Util.ejs.ui.toast("暂无公共意见模板");
          return;
        }

        var data = commonopinionlist.data.map(function (e) {
          return {
            text: e.opiniontext,
            value: e.opinionguid,
          };
        });

        // 显示意见
        showPicker(data);
      })
      .on("tap", ".user-operation", function () {
        // 点击个人意见模板
        if (!commonopinionlist || useropinionlist.total <= 0) {
          Util.ejs.ui.toast("暂无个人意见模板");
          return;
        }

        var data = useropinionlist.data.map(function (e) {
          return {
            text: e.opiniontext,
            value: e.opinionguid,
          };
        });

        // 显示意见
        showPicker(data);
      });
  }

  /**
   * 显示弹窗
   * @param {Array} data 选项
   */
  function showPicker(data) {
    ejs.ui.popPicker({
      layer: 1,
      data: data,
      success: function (result) {
        opinioncontent.value = result.items[0].text;
      },
      error: function (err) {},
    });
  }

  // 获取意见模板
  getOperationTpl(function () {
    callback && callback();
  });
  initListeners();
}

// 设置右上角提交按钮 && 执行提交
(function () {
  var userguid = "", // 用户 userguid
    displayname = ""; // 当前用户的名字

  // 获取当前用户信息
  // ejs.auth.getUserInfo({
  //     success: function (result) {
  //         var userInfo = JSON.parse(result.userInfo);

  //         displayname = userInfo.displayname;
  //         userguid = userInfo.userguid;
  //     }
  // });

  // 设置右上角按钮并且提交代码
  ejs.navigator.setRightBtn({
    isShow: 1,
    text: "提交",
    success: function () {
      var params = {
        pviguid: processVersionInstanceGuid,
        workitemguid: workitemguid,
        operationguid: operationguid,
        userguid: userguid,
        displayname: displayname,
      };

      // 判断是否填写了意见
      if (!opinioncontent.value && is_NeedOpinion) {
          Util.ejs.ui.toast('请签署意见！');
          return;
      }

      // 拼接签署意见
      params.opinion = opinioncontent.value;

      // 是否有选中分支
      if (!$curActivity.children().length) {
        if (
          !$curActivity.children().length &&
          !is_ShowAdvicetab &&
          typeof is_ShowAdvicetab === "undefined"
        ) {
          Util.ejs.ui.alert("请选择分支！");
          return;
        }
      }

      // 拼接分支信息
      params.nextsteplist = [];

      if (operationtype != "Back") {
        for (var i = 0, len = steplistdata.length; i < len; i++) {
          var item = steplistdata[i];

          if (item.checked) {
            var stepguid = item.stepguid,
              $el = $("#" + stepguid),
              $actperitem = $el.find(".actper-items").children();

            var texts = "",
              values = "";

            if (!$actperitem.length) {
              Util.ejs.ui.toast("请选择分支 " + item.stepname + " 的处理人");
              return;
            }

            $.each($actperitem, function (_i, _e) {
              values += _e.dataset.handlerguid + ",";
              texts += _e.textContent + ",";
            });

            texts = delsemiforstring(texts, ",");
            values = delsemiforstring(values, ",");

            params.nextsteplist.push({
              stepguid: stepguid,
              handlerlist: {
                texts: texts,
                values: values,
              },
            });
          }
        }
      }

      // 全局设置是否发送短信时，拼接是否发送短信
      if (isShowSms) {
        params.sendsms = $sms.hasClass("mui-active");
        params.smscontext = epm.encodeUtf8(smscontext);
        params.sendsms_jjcd = "";
      }

      // 关闭页面回到上一个页面做操作
      ejs.page.close({
        resultData: {
          message: params,
        },
      });
    },
  });
})();
