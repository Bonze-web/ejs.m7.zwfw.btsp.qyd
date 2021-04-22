var HandleControls = function (dom) {
  HandleControls.super.constructor.call(this, dom);
};

MControl.extend(HandleControls, MControl.control, {
  type: "handlecontrols",
  _init: function () {
    var self = this;
    this.action = this.getAttribute("action");
    this.workflowPageUrl = this.getAttribute("workflowpageurl") || "";
    this.submitBefore = this.getAttribute("submitbefore");
    this.pviGuid = "";
    this.operationGuid = "";
    this.transitionGuid = "";
    this.workitemGuid = "";
    this.afterbtn = null;

    var messageitemguid = Util.getExtraDataByKey("MessageItemGuid") || "";
    this.backEvent(function () {
      self.CloseMe({
        messageitemguid: messageitemguid,
      });
    });
  },
  backEvent: function (event) {
    ejs.navigator.hookSysBack({
      success: function (result) {
        event();
      },
      error: function (error) {},
    });
    ejs.navigator.hookBackBtn({
      success: function (result) {
        event();
      },
      error: function (error) {},
    });
  },
  setData: function (data) {
    data = typeof data === "string" ? JSON.parse(data) : data;
    this.data = data;
    this.lockStatus = false; // 流程是否被锁定，锁定则无法点击右上角

    var workitemGuid =
      data.workitemguid || Util.getExtraDataByKey("WorkItemGuid");
    var pviguid =
      data.pviguid || Util.getExtraDataByKey("ProcessVersionInstanceGuid");
    var messageitemguid = Util.getExtraDataByKey("MessageItemGuid") || "";
    var canhandle = Util.getExtraDataByKey("canhandle") || "";
    var self = this;

    this.workitemGuid = workitemGuid;
    this.pviGuid = pviguid;
    this.messageitemguid = messageitemguid;

    // 按钮操作集合
    this.btns = data.btn;

    this.acthtml = data.acthtml || "提交";

    if (data.lockdttm) {
      Util.ejs.ui.alert("当前流程已锁定");
      this.lockStatus = true;
      self.setControlsDisabled();
    } else {
      // 如果是 ejs 环境
      if (false) {
      } else {
        if (self.btns.length > 0) {
          // 设置右侧按钮
          this.canhandle = 1;
          self.bottomBtn();
        }
      }

      if (data && data.message) {
        Util.ejs.ui.toast(data.message);
        return;
      }
    }
  },
  bottomBtn: function () {
    var self = this;

    self.compBtns();
    document.querySelector("html").insertAdjacentHTML(
      "beforeend",
      `
                    <style>
                        .mui-content {
                            margin-bottom: 44px;
                        }

                        .em-hand-btn-div {
                            position: fixed;
                            bottom: 0;
                            left: 0;
                            width: 100%;
                            height: 44px;
                            background-color: #fff;
                            display: flex;
                            align-items: center;
                            justify-content: space-around;
                            box-shadow: 0px 1px 8px 0px #999;
                        }

                        .em-hand-btn-span {
                            position: relative;
                            width: 100%;
                            height: 100%;
                            line-height: 44px;
                            text-align: center;
                            color: #3c80e6;
                        }

                        .em-hand-btn-span:active {
                            background-color: #eee;
                        }

                        .em-hand-btn-span+.em-hand-btn-span::after {
                            content: '';
                            position: absolute;
                            width: 1px;
                            height: 22px;
                            top: 50%;
                            transform: translateY(-50%);
                            background-color: #ccc;
                            left: 0;
                        }
                    </style>
                    <div class="em-hand-btn-div" id="em-hand-id">
                    </div>
                    <script type="text/template" id="tpl-hand-btn">
                        <span class="em-hand-btn-span em-normal-btn"
                        operationguid="{{operationguid}}"
                        transitionguid="{{transitionguid}}"
                        operationtype="{{operationtype}}"
                        beforeact="{{beforeact}}"
                        afteract="{{afteract}}"
                        isrequireopinion="{{isrequireopinion}}"
                        >{{text}}</span>
                    </script>
                    `
    );
    // 渲染送下一步按钮
    var jsonstr = self.btns;
    var template = document.getElementById("tpl-hand-btn").innerHTML; //HTML 模板
    var output = "";
    mui.each(jsonstr, function (key, value) {
      if (value.text == "更多") {
        output += Mustache.render(
          '<span class="em-hand-btn-span em-more-btns">更多</span>',
          value
        );
      } else {
        output += Mustache.render(template, value);
      }
    });
    document.getElementById("em-hand-id").innerHTML = output; //渲染节点

    // 点击送下一步按钮
    self.normalBtnEvent();
    // 点击更多按钮
    self.moreBtnEvent();
  },
  // 处理按钮
  compBtns: function () {
    var self = this;

    self.btns = self.btns.filter(function (item) {
      return item.operationtype != "Custom";
    });

    if (self.btns.length > 4) {
      self.moreBtn = self.btns.splice(3);
      self.btns.unshift({
        text: "更多",
      });
    }
  },
  renderBtns: function () {},
  // 点击送下一步按钮
  normalBtnEvent: function () {
    var self = this;

    // 按钮增加点击事件
    mui("#em-hand-id").off("tap", ".em-normal-btn");
    mui("#em-hand-id").on("tap", ".em-normal-btn", function () {
      //点击送下一步按钮时，失焦所有input，防止安卓软键盘弹起
      var inputs = document.querySelectorAll("input");

      if (inputs) {
        for (var i = 0; i < inputs.length; i++) {
          inputs[i].blur();
        }
      }

      var operationguid = this.getAttribute("operationguid");
      var transitionguid = this.getAttribute("transitionguid");
      var operationtype = this.getAttribute("operationtype");
      var beforeact = this.getAttribute("beforeact");
      var afteract = this.getAttribute("afteract");
      var isrequireopinion = this.getAttribute("isrequireopinion");
      self.btn = {
        operationguid: operationguid,
        transitionguid: transitionguid,
        operationtype: operationtype,
        beforeact: beforeact,
        afteract: afteract,
        isrequireopinion: isrequireopinion,
      };

      var submitBefore = window[self.submitBefore];

      if (submitBefore && typeof submitBefore === "function") {
        submitBefore(function () {
          epointm.execute("submit", "", function () {
            self.AjaxOperation(
              operationguid,
              transitionguid,
              operationtype,
              beforeact,
              afteract,
              isrequireopinion
            );
          });
        });
      } else {
        epointm.execute("submit", "", function () {
          self.AjaxOperation(
            operationguid,
            transitionguid,
            operationtype,
            beforeact,
            afteract,
            isrequireopinion
          );
        });
      }
    });
  },
  // 点击更多按钮
  moreBtnEvent: function () {
    var self = this;

    // 点击更多按钮
    mui("#em-hand-id").off("tap", ".em-more-btns");
    mui("#em-hand-id").on("tap", ".em-more-btns", function () {
      //点击更多按钮时，失焦所有input，防止安卓软键盘弹起
      var inputs = document.querySelectorAll("input");

      if (inputs) {
        for (var i = 0; i < inputs.length; i++) {
          inputs[i].blur();
        }
      }

      var btns = self.moreBtn.map(function (e) {
        return e.text;
      });

      var submitBefore = window[self.submitBefore];

      if (submitBefore && typeof submitBefore === "function") {
        submitBefore(function () {
          ejs.ui.actionSheet({
            items: btns,
            success: function (result) {
              if (result.which != "-1") {
                // 先提交表单，然后在送下一步
                // console.log(btns);
                // console.log(btns[result.which]);

                epointm.execute("submit", "", function () {
                  var btn = self.moreBtn[result.which];

                  self.btn = btn;
                  self.AjaxOperation(
                    btn.operationguid,
                    btn.transitionguid,
                    btn.operationtype,
                    btn.beforeact,
                    btn.afteract,
                    btn.isrequireopinion
                  );
                });
              }
            },
          });
        });
      } else {
        ejs.ui.actionSheet({
          items: btns,
          success: function (result) {
            if (result.which != "-1") {
              // 先提交表单，然后在送下一步
              // console.log(btns);
              // console.log(btns[result.which]);

              epointm.execute("submit", "", function () {
                var btn = self.moreBtn[result.which];

                self.btn = btn;
                self.AjaxOperation(
                  btn.operationguid,
                  btn.transitionguid,
                  btn.operationtype,
                  btn.beforeact,
                  btn.afteract,
                  btn.isrequireopinion
                );
              });
            }
          },
        });
      }
    });
  },
  setControlsDisabled: function () {
    var controls = mui('[class*="ep-mui-"]');

    $.each(controls, function (i, e) {
      var tagName = e.tagName;

      switch (tagName) {
        case "INPUT":
        case "TEXTAREA":
          e.disabled = true;
          break;

        case "DIV":
          e.style.cssText = "pointer-events: none;";
          break;
      }
    });
  },
  getPermissions: function (callback) {
    var self = this;

    ejs.storage.getBusinessRestUrl({
      success: function (result) {
        var url = result["business-rest-url"] + "handledetail_base_v7";

        Util.ajax({
          url: url,
          data: {
            params: JSON.stringify({
              messageitemguid: self.messageitemguid,
              pviguid: self.pviguid,
              type: 1,
              filetype: "",
            }),
          },
          success: function (result) {
            if (callback && typeof callback === "function") {
              callback(result.custom.canhandle);
            }
          },
          error: function (err) {
            Util.ejs.ui.toast(url + " 接口请求失败");
          },
        });
      },
      error: function () {},
    });
  },
  setRightBtn: function (isShow) {
    var self = this;
    var handBtnNode = document.querySelector("#em-hand-id");

    // TODO: 如果当前流程被锁定或者无权限处理，直接返回
    if (this.lockStatus || this.canhandle != "1") {
      return;
    }

    if (handBtnNode) {
      if (isShow) {
        handBtnNode.classList.remove("mui-hidden");
      } else {
        handBtnNode.classList.add("mui-hidden");
      }
    }
    // ejs.navigator.setRightBtn({
    //     isShow: isShow ? 1 : 0,
    //     text: this.acthtml,
    //     success: function () {
    //         var submitBefore = window[self.submitBefore];

    //         if (submitBefore && typeof submitBefore === 'function') {
    //             submitBefore(function () {
    //                 self.showActionSheet();
    //             });
    //         } else {
    //             self.showActionSheet();
    //         }
    //     }
    // });
  },
  showActionSheet: function () {
    var self = this;
    var btns = [];

    this.btns.map(function (e) {
      if (e.operationtype !== "Custom") {
        btns.push(e);
      }
    });

    ejs.ui.actionSheet({
      items: btns.map(function (e) {
        return e.text;
      }),
      success: function (result) {
        if (result.which != "-1") {
          // 先提交表单，然后在送下一步
          // console.log(btns);
          // console.log(btns[result.which]);

          return;
        }
      },
    });
  },
  AjaxOperation: function (
    OperationGuid,
    TransitionGuid,
    OperationType,
    btnbefore,
    btnafter,
    isrequireopinion
  ) {
    this.operationGuid = OperationGuid;
    this.transitionGuid = TransitionGuid;
    this.afterbtn = btnafter;

    var batchHandleGuid = null;

    try {
      batchHandleGuid = document.getElementById("hidIsBatchHandle").value;
    } catch (error) {}

    if (btnbefore) {
      try {
        var btnSubmit = null;

        if (batchHandleGuid) {
          btnSubmit = this.getButton(batchHandleGuid);
        } else {
          btnSubmit = getButton(btnbefore);
        }

        if (btnSubmit) {
          btnSubmit.click();
        }
      } catch (error) {
        this.HandleNextStep(
          OperationGuid,
          TransitionGuid,
          OperationType,
          btnbefore,
          btnafter
        );
      }
    } else {
      this.HandleNextStep(
        OperationGuid,
        TransitionGuid,
        OperationType,
        btnbefore,
        btnafter
      );
    }
  },
  HandleNextStep: function (
    OperationGuid,
    TransitionGuid,
    OperationType,
    btnbefore,
    btnafter
  ) {
    // 点击下一步后就隐藏按钮体验不好，不再隐藏按钮
    // this.ShowTdOperate(false);
    var batchHandleGuid = null;
    var self = this;

    try {
      batchHandleGuid = document.getElementById("hidIsBatchHandle").value;
    } catch (error) {}

    if (OperationType === "Save" || OperationType == 60) {
      var btnId = "btnSaveFrom";
      // 点击保存按钮不隐藏操作按钮，仍可留在此页面进行其他操作
      this.ShowTdOperate(true);

      if (batchHandleGuid != null && batchHandleGuid != "") {
        btnId = "btnSaveBatchHandle";
      }
      try {
        var saveBtn = this.getButton(btnId);
        if (saveBtn != null) {
          saveBtn.click();
        } else {
          this.HeaderSubmit();
        }
      } catch (er) {
        this.HeaderSubmit();
      }
    } else if (OperationType == "Custom" || OperationType == 1) {
      eval(btnafter);
    } else if (
      OperationType == "Pass" ||
      OperationType == "Pass_Transition" ||
      OperationType == 10 ||
      OperationType == 15
    ) {
      // 先执行个性化的业务逻辑
      var btnId = "btnSubmit";
      if (batchHandleGuid) {
        btnId = "btnSubmitBatchHandle";
      }

      try {
        var btnSubmit = this.getButton(btnId);
        if (btnSubmit != null) {
          btnSubmit.click();
        } else {
          this.HeaderSubmit();
        }
      } catch (err) {
        this.HeaderSubmit();
      }
    } else if (OperationType == "DrawBack" || OperationType == 50) {
      ejs.ui.confirm({
        message: "确认收回已发待办事项？",
        buttonLabels: ["取消", "确定"],
        success: function (result) {
          // 点击确定
          if (result.which == 1) {
            self.HeaderSubmit();
          } else {
            self.ShowTdOperate(true);
          }
        },
      });
    } else {
      this.HeaderSubmit();
    }
  },
  HeaderSubmit: function () {
    var self = this;

    this.transitionGuid = this.transitionGuid || "";

    var params = {
      transitionguid: this.transitionGuid,
      operationguid: this.operationGuid,
      pviguid: this.pviGuid,
      workitemguid: this.workitemGuid,
    };

    epointm.execute(
      "getPageUrlOfOperate",
      "@none",
      epm.encodeUtf8(epm.encodeJson(params)),
      self.AjaxOperationHd.bind(self)
    );
  },
  // 通用的ajax方法返回结果处理
  AjaxOperationHd: function (response) {
    var self = this;

    if (response) {
      var response = epm.decodeJson(response);
      if (response.isdefoperation) {
        var operationname = "送下一步";

        if (response.operationname) {
          operationname = response.operationname;
        }

        // 弹出带签署意见框的确认框
        ejs.ui.prompt({
          title: "执行" + operationname + "操作",
          hint: "这里可以签署意见",
          buttonLabels: ["取消", "确定"],
          cancelable: 0,
          success: function (result) {
            if (result.which == 1) {
              if (result.content) {
                // 如果有意见
                response.opinion = result.content;
              }
              epointm.execute(
                "getoperate",
                "@none",
                epm.encodeUtf8(epm.encodeJson(response)),
                self.AjaxOperationHd.bind(self)
              );
            } else {
              self.ShowTdOperate(true);
            }
          },
        });
      } else if (response.url) {
        // 返回url需要打开操作处理页面
        // url: frame/pages/epointworkflow/client/commonoperationhandlepassopinion?workItemGuid=e45d1a78-de8e-4c41-a448-679463efd049&operationGuid=7327f758-4f81-4c34-bb20-919bf795e653&processVersionInstanceGuid=a85eb358-03c7-4cce-957a-6173bdb857fd&stepguid=e01ae006-76bb-448a-855f-a31a874666e8&transitionGuid=
        var url = response.url;

        var pageUrl =
          Util.getProjectBasePath() +
          this.workflowPageUrl.substring(this.workflowPageUrl.indexOf("frame"));

        ejs.page.open({
          pageUrl:
            pageUrl +
            url.substring(url.indexOf("?")) +
            "&operationtype=" +
            self.btn.operationtype +
            "&MessageItemGuid=" +
            self.messageitemguid,
          success: function (result) {
            if (result && result.resultData.message) {
              self.ShowTdOperate(false);
              self.DefaultOperateHd(result.resultData.message);
            } else {
              self.ShowTdOperate(true);
            }
          },
          error: function (err) {
            console.log(err);
          },
        });
      } else if (
        response.operationtype &&
        (response.operationtype == 25 ||
          response.operationtype == "SendToSign") &&
        (!response.message || response.message == "Success")
      ) {
        this.AfterClick();
        this.ShowTdOperate(true);
      } else if (!response.message || response.message == "Success") {
        this.AfterClick();

        ejs.ui.alert({
          title: "流程处理",
          message: "流程处理完成！",
          cancelable: 0,
          success: function (result) {
            ejs.ui.closeWaiting();
            var messageitemguid =
              Util.getExtraDataByKey("MessageItemGuid") || "";

            self.CloseMe({
              messageitemguid: messageitemguid,
            });
          },
        });
      } else if (response.message) {
        Util.ejs.ui.alert(response.message);
        this.ShowTdOperate(true);
      }
    } else {
      this.ShowTdOperate(true);
    }
  },
  DefaultOperateHd: function (json) {
    epointm.execute(
      "getoperate",
      "@none",
      epm.encodeUtf8(epm.encodeJson(json)),
      this.AjaxOperationHd.bind(this)
    );
  },
  beforeUnlock: function () {
    var workitemGuid = this.workitemGuid;
    var pviGuid = this.pviGuid;

    if (workitemGuid && pviGuid) {
      epointm.execute(
        "workItem_Unlock",
        "@none",
        [pviGuid, workitemGuid, "norm"],
        this.UnlockCallBack
      );
    }
  },
  UnlockCallBack: function (msg) {
    try {
      if (msg && msg == "refresh") {
        epointm.refresh();
      }
      if (msg.message && msg.message == "refresh") {
        epointm.refresh();
      }
    } catch (err) {}
  },
  AfterClick: function () {
    var afterbtn = this.afterbtn;

    if (afterbtn) {
      try {
        var btnSubmit = this.getButton(afterbtn);
        if (btnSubmit != null) {
          btnSubmit.click();
        }
      } catch (err) {}
    }
  },
  // 按钮区域的显隐控制
  ShowTdOperate: function (Is_Show) {
    if (Is_Show) {
      this.setRightBtn(true);
    } else {
      this.setRightBtn(false);
    }
  },
  CloseMe: function (data) {
    ejs.page.close({
      resultData: data || {},
    });
  },
  getButton: function (id) {
    return document.querySelector("#" + id);
  },
  getModule: function () {
    return {
      id: this.id,
      type: this.type,
      action: this.action,
    };
  },
});

MControl.register(HandleControls, "ep-mui-handlecontrols");
MControl.init();
