/**
 * 作者: guotq
 * 时间: 2019-6-18
 * 描述:  定义一些控件
 */
// alert(EpFrameSysParams)

(function (exports, controlMap) {
  "use strict";
  // 每一个页面都要引入的工具类
  // 下拉刷新 PullToRefreshTools 通过脚本引入

  // class与控件的对应关系
  // var controlMap = {};

  var getControlClazz = function (control) {
    var clsName = control.className,
      clazz,
      matchs = clsName.match(/ep-mui-\w*/g);

    if (matchs.length > 0) {
      clazz = controlMap[matchs[0]];
    }

    if (!clazz) {
      console.warn("没有对应的控件类型", control);
    }

    return clazz;
  };

  // 实现对象继承
  function extend(child, parent, proto) {
    var F = function () {};

    F.prototype = parent.prototype;
    child.prototype = new F();
    child.prototype.constructor = child;
    child.super = parent.prototype;

    if (proto) {
      for (var i in proto) {
        child.prototype[i] = proto[i];
      }
    }
  }

  // 注册控件
  function register(control, className) {
    controlMap[className] = control;
  }

  // 控件基类
  var MControl = function (dom) {
    this.el = dom;

    var id = dom.id;

    // 自动生成id
    if (!id) {
      id = epm.generateId();
      dom.id = id;
    }
    this.id = id;

    this._init();
  };

  MControl.prototype = {
    constructor: MControl,

    // 控件初始化
    _init: function () {},

    value: "",

    getValue: function () {
      if (this.value === 0) {
        return this.value;
      } else if (this.value) {
        return this.value;
      } else {
        return this.el.value;
      }
    },

    setValue: function (value) {
      this.value = value;
      if (this.el.value !== undefined) {
        this.el.value = value;
      } else {
        this.el.innerText = value;
      }
    },
    // 获取控件的数据模型
    getModule: function () {
      return {
        id: this.id,
      };
    },
    getAttribute: function (attrName) {
      return this.el.getAttribute(attrName);
    },
    render: function (parent) {
      if (typeof parent === "string") {
        if (parent == "#body") {
          parent = document.body;
        } else {
          parent = document.getElementById(parent);
        }
      }
      if (!parent) {
        return;
      }

      parent.appendChild(this.el);

      this.el.id = this.id;
    },
  };

  var TextBox = function (dom) {
    TextBox.super.constructor.call(this, dom);
  };

  extend(TextBox, MControl, {
    type: "textbox",
    _init: function () {
      this.bind = this.getAttribute("bind");
      this.action = this.getAttribute("action");
      this.readonly =
        this.el.classList.contains("readonly") ||
        String(this.getAttribute("readonly"));

      if (this.readonly !== "null" && this.readonly !== "false") {
        this.el.setAttribute("readonly", "true");
        this.hideIconRight();
      } else {
        this.el.addEventListener("input", this._tapFunc);
      }

      this.el.addEventListener("touchmove", function (e) {
        if (this.offsetWidth < this.scrollWidth) {
          // 当input框内容左右滚动时，防止与tab页的滚动冲突
          e.stopPropagation();
        }
      });
    },
    _tapFunc: function (e) {
      var self = epm.get(this.id);
      self.value = self.el.value;
    },
    readonlyChange: function (isReadonly) {
      if (isReadonly) {
        this.el.setAttribute("readonly", "true");
        this.el.removeEventListener("input", this._tapFunc, false);
        this.hideIconRight();
      } else {
        this.el.removeAttribute("readonly");
        this.el.addEventListener("input", this._tapFunc, false);
      }
    },
    hideIconRight: function () {
      this.el.parentNode.classList.remove("icon-right");
    },
    getModule: function () {
      return {
        id: this.id,
        type: this.type,
        bind: this.bind,
        action: this.action,
        value: this.value,
      };
    },
  });
  register(TextBox, "ep-mui-textbox");

  var TextArea = function (dom) {
    TextArea.super.constructor.call(this, dom);
  };

  extend(TextArea, MControl, {
    type: "textarea",
    _init: function () {
      this.bind = this.getAttribute("bind");
      this.action = this.getAttribute("action");
      this.readonly =
        this.el.classList.contains("readonly") ||
        String(this.getAttribute("readonly"));

      if (this.readonly !== "null" && this.readonly !== "false") {
        this.el.setAttribute("readonly", "true");
      } else {
        this.el.addEventListener("input", this._tapFunc);
      }
    },
    _tapFunc: function (e) {
      var self = epm.get(this.id);
      self.value = self.el.value;
    },
    getModule: function () {
      return {
        id: this.id,
        type: this.type,
        bind: this.bind,
        action: this.action,
        value: this.value,
      };
    },
    readonlyChange: function (isReadonly) {
      if (isReadonly) {
        this.el.setAttribute("readonly", "true");
        this.el.removeEventListener("input", this._tapFunc, false);
      } else {
        this.el.removeAttribute("readonly");
        this.el.addEventListener("input", this._tapFunc, false);
      }
    },
  });
  register(TextArea, "ep-mui-textarea");

  var SearchBar = function (dom) {
    SearchBar.super.constructor.call(this, dom);
  };

  extend(SearchBar, MControl, {
    type: "searchbar",
    _init: function () {
      this.bind = this.getAttribute("bind");

      var onSearch = this.getAttribute("onSearch");
      var self = this;

      this.el.addEventListener("change", function (e) {
        self.value = self.el.value;

        if (window[onSearch] && typeof window[onSearch] === "function") {
          window[onSearch](self.value);
        }
      });
    },
    getModule: function () {
      return {
        id: this.id,
        type: this.type,
        bind: this.bind,
        value: this.value,
      };
    },
  });
  register(SearchBar, "ep-mui-searchbar");

  var WebUploader = function (dom) {
    WebUploader.super.constructor.call(this, dom);
  };

  extend(WebUploader, MControl, {
    type: "webuploader",
    _init: function () {
      this.action = this.getAttribute("action");
      this.isMulti = this.getAttribute("isMulti") || true;
      this.mapClass =
        this.getAttribute("mapClass") ||
        "com.epoint.basic.faces.fileupload.WebUploader";
      this.tplId = this.getAttribute("tplId");
      this.isMulti = epm.parseJSON(this.isMulti);
      this.content = this.el.querySelector(".webuploader-content-items");
      var imgUrl =
        this.getAttribute("imgUrl") ||
        Util.getProjectBasePath() +
          "frame/fmui/showcase/comdto/images/icon_file/";
      this.imgUrl =
        Util.getProjectBasePath() + imgUrl.substring(imgUrl.indexOf("frame"));
      this.mimeType = this.getAttribute("mimetype"); // mimeType input[file] accpet 类型
      this.readonly =
        this.el.classList.contains("readonly") ||
        String(this.getAttribute("readonly"));

      if (this.readonly !== "null" && this.readonly !== "false") {
        this.el.querySelector(".uploader-add").classList.add("mui-hidden");
      }
      var limitType = this.getAttribute("limitType");

      // 限制文件后缀类型，例如 jpeg jpg gif 。。
      if (limitType && limitType.length > 0 && limitType != "*") {
        limitType = limitType.split(",");
      }

      if (this.tplId) {
        this.tpl = document.getElementById(this.tplId).innerHTML;
      } else {
        if (this.readonly !== "null" && this.readonly !== "false") {
          this.tpl =
            '<div class="uploader-item l" data-attachfilename="{{attachFileName}}" data-preview-src="{{preparams}}" data-attachguid="{{attachGuid}}" data-attachlength="{{attachLength}}" data-downloadurl=“{{downloadUrl}}” data-readonly="{{readonly}}"><img src="{{icon}}" class="thumbnail" onerror="this.src=\'"{{imgUrl}}"img_default.png\'" alt=""><p>{{attachFileName}}</p></div>';
        } else {
          this.tpl =
            '<div class="uploader-item l" data-attachfilename="{{attachFileName}}" data-preview-src="{{preparams}}" data-attachguid="{{attachGuid}}" data-attachlength="{{attachLength}}" data-downloadurl=“{{downloadUrl}}” data-readonly="{{readonly}}"><img src="{{icon}}" class="thumbnail" onerror="this.src=\'"{{imgUrl}}"img_default.png\'" alt=""><em class="upload-delete">一</em><p>{{attachFileName}}</p></div>';
        }
      }

      this.input = this._createInput();

      var self = this;
      this.el.querySelector(".icon-upload") &&
        this.el
          .querySelector(".icon-upload")
          .addEventListener("tap", function () {
            self.input.click();
          });

      this.input.addEventListener("change", function () {
        var files = this.files;
        var data = self.onGetRequestData();

        for (var i = 0, len = files.length; i < len; i++) {
          var file = files[i],
            formdata = new FormData(),
            id = self.id,
            filename = file.name,
            suffix = self.getFileSuffix(filename); // 获取文件后缀名

          // 判断上传文件的类型
          if (
            Array.isArray(limitType) &&
            limitType.length > 0 &&
            limitType !== "*"
          ) {
            // 如果上传了限制文件，则直接跳过本次循环
            if (limitType.indexOf(suffix) === -1) {
              Util.ejs.ui.toast("文件：" + filename + " 禁止上传");
              continue;
            }
          }

          self.filetype = file.type;

          formdata.append("id", id);
          formdata.append("name", filename);
          formdata.append("type", file.type);
          formdata.append("size", file.size);
          formdata.append("lastModifiedDate", file.lastModifiedDate);
          formdata.append("file", file);

          if (data) {
            formdata.append("commonDto", data.commonDto);
          }

          formdata.append("".concat(id, "_action"), "upload");
          formdata.append("".concat(id, "_fileCount"), files.length);
          formdata.append("".concat(id, "_fileLoadedCount"), "0");
          // sm2加密
          // debugger
          var uid = epm.getUidSign().uid;
          formdata.append("uid", uid);
          formdata.append("sign", epm.getUidSign(uid).sign);
          self._upload(formdata);
        }
      });

      // 删除文件
      mui(this.el)
        .on("tap", ".upload-delete", function () {
          var el = this.parentElement,
            dataset = el.dataset;

          self._delete({
            attachFileName: dataset.attachfilename,
            attachGuid: dataset.attachguid,
            attachLength: dataset.attachlength,
            downloadUrl: dataset.downloadurl,
            readonly: dataset.readonly,
          });
        })
        .on("tap", ".thumbnail", function () {
          // 点击预览，没有预览地址变为下载
          // var url =
          //   Util.getProjectBasePath() +
          //   this.parentNode
          //     .getAttribute("data-downloadurl")
          //     .replace(/“|”/g, "");
          var url =
            Util.getProjectBasePath() +
            "rest/attach/downloadattach_v7?attachguid=" +
            this.parentNode.getAttribute("data-attachguid");
          var name = this.parentNode.getAttribute("data-attachfilename");

          if (!self.preventDownload && !self.preventPreview) {
            // 既能预览又能下载
            if (ejs.os.ejs) {
              ejs.io.downloadFile({
                url: url,
                fileName: name,
                reDownloaded: 0,
                isBackground: 0,
                openAfterComplete: 1,
                success: function (result) {},
                error: function (error) {
                  ejs.ui.toast(JSON.stringify(error));
                },
              });
            } else {
              ejs.page.open(url);
            }
            return;
          } else if (self.preventDownload && !self.preventPreview) {
            // 只能预览，拼接预览地址
            ejs.util.getPreviewUrl({
              success: function (res) {
                ejs.auth.getToken({
                  success: function (result) {
                    var lastUrl =
                      res.previewUrl +
                      url +
                      "&access_token=" +
                      result.access_token;
                    ejs.page.open(lastUrl);
                  },
                  error: function (error) {},
                });
              },
              error: function (error) {},
            });
          } else if (self.preventPreview && !self.preventDownload) {
            // 只能下载，不能预览
            if (ejs.os.ejs) {
              ejs.ui.showWaiting("正在下载...");
              ejs.io.downloadFile({
                url: url,
                fileName: name,
                reDownloaded: 0,
                isBackground: 1,
                openAfterComplete: 1,
                success: function (result) {
                  ejs.ui.closeWaiting();
                },
                error: function (error) {
                  ejs.ui.toast(JSON.stringify(error));
                },
              });
            } else {
              ejs.page.open(url);
            }
          }
        });

      // tab页左右滑动的情况下，解决附件滚动冲突
      this.content.parentNode.addEventListener("touchmove", function (e) {
        e.stopPropagation();
      });
    },
    readonlyChange: function (isReadonly) {
      if (isReadonly) {
        this.el.querySelector(".icon-upload").classList.add("mui-hidden");
        this.setEmpty();
        if (this.el.querySelector(".upload-delete")) {
          var deletes = this.el.querySelectorAll(".upload-delete");
          for (var i = 0; i < deletes.length; i++) {
            deletes[i].classList.add("mui-hidden");
          }
        }
      } else {
        this.el.querySelector(".icon-upload").classList.remove("mui-hidden");
        if (this.el.querySelector(".upload-delete")) {
          var deletes = this.el.querySelectorAll(".upload-delete");
          for (var i = 0; i < deletes.length; i++) {
            deletes[i].classList.remove("mui-hidden");
          }
        }
      }
    },
    setPermission: function (arr) {
      var self = this;
      arr.forEach((ele) => {
        switch (ele) {
          case "uploader":
            // 新增需求，设置控件不能上传
            self.el.querySelector(".icon-upload").classList.add("mui-hidden");
            self.setEmpty();
            break;
          case "delete":
            // 新增需求，设置控件不能删除
            if (self.el.querySelector(".upload-delete")) {
              var deletes = self.el.querySelectorAll(".upload-delete");
              for (var i = 0; i < deletes.length; i++) {
                deletes[i].classList.add("mui-hidden");
              }
            }
            break;
          case "preview":
            // 新增需求，设置控件不能预览
            self.preventPreview = true;
            break;
          case "download":
            // 新增需求，设置控件不能下载
            self.preventDownload = true;
            break;
          default:
            break;
        }
      });
    },
    _upload: function (formdata) {
      var self = this;

      Util.ajax({
        url: self.url,
        data: formdata,
        type: "post",
        processData: false,
        contentType: false,
        beforeSend: function (XMLHttpRequest) {
          console.log("准备上传", "before");
          Util.ejs.ui.showWaiting();

          var csrfcookie = epm.getCookie("_CSRFCOOKIE");
          if (csrfcookie) {
            XMLHttpRequest.setRequestHeader("CSRFCOOKIE", csrfcookie);
          }
        },
        success: function (response) {
          var res = response;
          var controls = response.controls;

          if (controls) {
            var control = controls[0];
            var data = control.data;

            // 如果上传成功
            if (data) {
              if (res.controls) {
                self.uploadSuccess && self.uploadSuccess();
                var len = res.controls.length;
                var viewData = res.controls[len - 1];

                if (viewData.id == "_common_hidden_viewdata") {
                  if (!epm.get("_common_hidden_viewdata")) {
                    this.createHiddenView(viewData);
                  }
                  epm.get("_common_hidden_viewdata").setValue(viewData.value);
                }
              }
              self.insertNode(data);
              data.filetype = self.filetype;
              self.isUploaded = true;
            } else {
              if (
                self.content.getElementsByClassName("uploader-item").length ===
                0
              ) {
                self.isUploaded = false;
              } else {
                self.isUploaded = true;
              }
              self.uploadError && self.uploadError();
              // 上传失败, 输出 failedMsg
              if (control.uploadFailed) {
                Util.ejs.ui.toast(control.failedMsg);
              }
            }
          }

          self.clearInput();
        },
        error: function (xhr, status) {
          self.clearInput();
          self.uploadError && self.uploadError();
          Util.ejs.ui.toast("上传失败");
          console.error(xhr, status);
        },
        complete: function () {
          self.uploadComplete && self.uploadComplete();
          Util.ejs.ui.closeWaiting();
        },
      });
    },
    _delete: function (extras) {
      var data = this.onGetRequestData();
      var self = this;
      var ajaxData = {
        commonDto: data.commonDto,
      };

      ajaxData[self.id + "_action"] = "delete";
      ajaxData[self.id + "_attachGuid"] = extras.attachGuid;
      Util.ajax({
        url: self.url,
        data: ajaxData,
        type: "post",
        beforeSend: function (XMLHttpRequest) {
          console.log("准备删除文件", "before");
          Util.ejs.ui.showWaiting();

          var csrfcookie = epm.getCookie("_CSRFCOOKIE");
          if (csrfcookie) {
            XMLHttpRequest.setRequestHeader("CSRFCOOKIE", csrfcookie);
          }
        },
        success: function (response) {
          document
            .querySelector(
              '.uploader-item[data-attachguid="' + extras.attachGuid + '"]'
            )
            .remove();
          self.input.value = "";
          self.content.querySelector('.uploader-add').classList.remove('mui-hidden');
          if (
            self.content.getElementsByClassName("uploader-item").length === 0
          ) {
            // 如果全部删除
            self.isUploaded = false;
            self.setEmpty();
          }
          // 删除后重新处理隐藏域的标记，防止删除附件后无法送下一步
          epm.getSecondRequestData(response);
        },
        error: function (xhr, status) {
          Util.ejs.ui.toast("删除文件失败");
          console.error(xhr, status);
        },
        complete: function () {
          Util.ejs.ui.closeWaiting();
        },
      });
    },
    setUrl: function (url) {
      // this.url = url;
      this.url = url.replace("action/", "action.action?cmd=");
    },
    _createInput: function () {
      var input = document.createElement("input"),
        mimeType = this.mimeType;

      input.type = "file";

      if (mimeType) {
        input.accept = mimeType;
      } else {
        input.accept = "*";
        // 增加ejs容器安卓input点击时可以打开本地文件
        if (Util.os.ejs && Util.os.android) {
          input.accept = "*/*";
          input.dataType = "DataUrl";
        } else if (Util.os.ejs) {
          input.accept = "*";
          input.dataType = "DataUrl";
        }
      }

      // if (this.isMulti) {
      //   input.multiple = "multiple";
      // }

      return input;
    },
    setData: function (data) {
      var files = data.files !== undefined ? data.files : data,
        self = this;

      if (Array.isArray(files) && files.length > 0) {
        files = files.reverse();
        self.insertNode(files);
      } else {
        if (this.readonly !== "null" && this.readonly !== "false") {
          this.setEmpty(true);
        }
      }
    },
    insertNode: function (file) {
      var tpl = this.tpl,
        item = "",
        self = this,
        getFileIcon = self.getFileIcon,
        content = this.content,
        imgUrl = this.imgUrl;

      if (Array.isArray(file) && file.length > 0) {
        $.each(file, function (i, e) {
          e.icon = imgUrl + getFileIcon(e.attachFileName);
          e.imgUrl = imgUrl;
          item += Mustache.render(tpl, e);
        });
      } else {
        file.icon = imgUrl + getFileIcon(file.attachFileName);
        file.imgUrl = imgUrl;
        item = Mustache.render(tpl, file);
      }

      content.insertAdjacentHTML("afterbegin", item);
      content.style.width = content.children.length * 104 + "px";

      if (this.content.getElementsByClassName("uploader-item").length === 0) {
        this.isUploaded = false;
      } else {
        this.isUploaded = true;
      }

      // 如果控件单选,隐藏上传按钮
      if(!this.isMulti && this.content.getElementsByClassName("uploader-item").length === 1){
        this.content.querySelector('.uploader-add').classList.add('mui-hidden');
      }
    },
    // 修改获取图标方法
    getFileIcon: function (filename) {
      // 截取后缀名
      if (!filename) {
        throw "[注意：获取后缀名的前提：文件名不能为空！]";
      } else if (filename.indexOf(".") == "-1") {
        throw "[注意：文件名称格式不正确！例如：“example.doc”]";
      }
      var suffix = Util.getPathSuffix(filename).toUpperCase();
      // 图标
      var fileIcon = "";

      if (suffix == "DOC" || suffix == "DOCX") {
        fileIcon = "img_word.png";
      } else if (suffix == "XLS" || suffix == "XLSX") {
        fileIcon = "img_xls.png";
      } else if (suffix == "PPT" || suffix == "PPTX") {
        fileIcon = "img_ppt.png";
      } else if (suffix == "PDF") {
        fileIcon = "img_pdf.png";
      } else if (suffix == "HTML") {
        fileIcon = "img_html.png";
      } else if (suffix == "TXT") {
        fileIcon = "img_txt.png";
      } else if (suffix == "CSS") {
        fileIcon = "img_css.png";
      } else if (suffix == "JPG" || suffix == "JPEG") {
        fileIcon = "img_jpg.png";
      } else if (suffix == "PNG") {
        fileIcon = "img_png.png";
      } else if (suffix == "GIF") {
        fileIcon = "img_gif.png";
      } else if (suffix == "ICON") {
        fileIcon = "img_icon.png";
      } else if (suffix == "TIF") {
        fileIcon = "img_tif.png";
      } else if (suffix == "ZIP") {
        fileIcon = "img_zip.png";
      } else if (suffix == "AI") {
        fileIcon = "img_ai.png";
      } else if (suffix == "RAR") {
        fileIcon = "img_zip.png";
      } else if (suffix == "DLL") {
        fileIcon = "img_dll.png";
      } else if (suffix == "EPS") {
        fileIcon = "img_eps.png";
      } else if (suffix == "PS") {
        fileIcon = "img_ps.png";
      } else if (suffix == "SVG") {
        fileIcon = "img_svg.png";
      } else if (suffix == "SWF") {
        fileIcon = "img_swf.png";
      } else if (suffix == "FILE") {
        fileIcon = "img_file.png";
      } else if (suffix == "MP3") {
        fileIcon = "img_mp3.png";
      } else {
        fileIcon = "img_default.png";
      }

      return fileIcon;
    },
    getFileSuffix: function (fileName) {
      return fileName.substring(fileName.lastIndexOf(".") + 1);
    },
    getModule: function () {
      return {
        id: this.id,
        type: this.type,
        mapClass: this.mapClass,
        action: this.action,
      };
    },
    setEmpty: function (isforce) {
      // 设置空提示
      if (
        isforce ||
        (this.el
          .querySelector(".icon-upload")
          .classList.contains("mui-hidden") &&
          this.content.getElementsByClassName("uploader-item").length === 0)
      ) {
        this.content.parentNode.classList.add("mui-hidden");
        this.el.querySelector(".webuploader-title").classList.add("nofiles");
      }
    },
    clearInput: function(){
      if(this.isMulti){
        // 是多选，上传后清空input值，以免无法重复上传同一个文件
        this.input.value = "";
      }
    }
  });
  register(WebUploader, "ep-mui-webuploader");

  var SelectContact = function (dom) {
    SelectContact.super.constructor.call(this, dom);
  };

  extend(SelectContact, MControl, {
    type: "treeselect-non-nested",
    _init: function () {
      var self = this;
      this.bind = this.getAttribute("bind");
      this.action = this.getAttribute("action");
      this.readonly =
        this.el.classList.contains("readonly") ||
        String(this.getAttribute("readonly"));

      if (this.action) {
        this.url = epm.getRightUrl(epm.dealUrl(this.action, true));
      }

      this.value = "";
      this.text = "";

      self.isouonly = epm.parseJSON(self.getAttribute("isouonly")) || false; // 是否仅选择部门 0选人，1选部门，
      self.range = epm.parseJSON(self.getAttribute("range")) || false; // 选择范围 0 所有， 1本部门， 2本单位
      self.issingle = epm.parseJSON(self.getAttribute("issingle")) || false; // 多选 0 多选， 1单选

      self
        .getCustom(self.isouonly, self.range, self.issingle)
        .then(function (custom) {
          self.el.custom = custom;
        });

      if (this.readonly !== "null" && this.readonly !== "false") {
        this.el.setAttribute("readonly", "true");
        this.hideIconRight();
      } else {
        this.el.addEventListener("tap", this._tapFunc);
      }
    },
    _tapFunc: function () {
      var self = epm.get(this.id);
      var data = self.data;
      var userguids = null;
      var usernames = null;
      var selectedusers = [];
      var selectedous = [];

      if (self.isouonly == 0) {
        if (self.value && self.text) {
          userguids = self.value.split(",");
          usernames = self.text.split(",");
        }

        $.each(userguids, function (i, e) {
          selectedusers.push({
            userguid: e,
            username: usernames[i],
          });
        });
      } else if (self.isouonly == 1) {
        if (self.value && self.text) {
          userguids = self.value.split(",");
          usernames = self.text.split(",");
        }

        $.each(userguids, function (i, e) {
          selectedous.push({
            ouguid: e,
            ouname: usernames[i],
          });
        });
      }
      // alert(JSON.stringify(custom))
      ejs.util.invokePluginApi({
        path: "workplatform.provider.openNewPage",
        dataMap: {
          method: "goSelectPerson",
          selectedusers: selectedusers,
          selectedous: selectedous,
          issingle: self.issingle ? 1 : 0,
          isouonly: self.isouonly ? 1 : 0,
          custom: self.el.custom || {},
          // isgroupenable: 1
        },
        f9action: self.action,
        f9userdata: self.data,
        f9controlid: self.id,
        success: function (result) {
          console.log(result);
          var value = "",
            text = "";

          self.value = "";
          self.text = "";
          self.el.innerHTML = "";

          // 如果只选择了部门
          if (self.isouonly) {
            result.ouData.forEach(function (e, i) {
              value += e.ouguid + ",";
              text += e.ouname + ",";
            });
          } else {
            result.resultData.forEach(function (e, i) {
              value += e.userguid + ",";
              text += e.displayname + ",";
            });
          }

          self.value = epm.delsemiforstring(value, ",");
          self.setText(epm.delsemiforstring(text, ","));
        },
      });
    },
    // 获取选人选部门范围
    getCustom: function (isouonly, range, issingle) {
      var self = this;
      var custom = {};
      return new Promise((resolve, reject) => {
        // 本部门选人范围
        if (range == 1 && isouonly == 0) {
          self.getSelfOuList(function (res) {
            var userlist = res.userlist;
            userlist.forEach(function (item) {
              item.username = item.displayname;
            });
            custom.userlist = userlist;
            resolve(custom);
          });
        } else if (range == 1 && isouonly == 1) {
          // 本部门选部门范围，只选择当前用户部门
          ejs.auth.getUserInfo({
            success: function (result) {
              var userInfo =
                typeof result.userInfo === "string"
                  ? JSON.parse(result.userInfo)
                  : result.userInfo;
              custom.oulist = [
                {
                  ouguid: userInfo.ouguid,
                  ouname: userInfo.ouname,
                  parentouguid: "root",
                  haschildou: "0",
                  haschilduser: "0",
                  usercount: "0",
                },
              ];
              resolve(custom);
            },
            error: function (error) {},
          });
        } else if (range == 2 && isouonly == 1) {
          // 本单位选部门范围，只选择当前用户部门
          self.getSelfOuList(function (res) {
            var oulist = res.oulist;
            // alert(oulist)
            oulist.forEach(function (item) {
              self.getOuListInfo(item.ouguid, function (res) {
                item.oulist = res.oulist;
                // alert(res)
              });
            });
            custom.oulist = oulist;
            resolve(custom);
          });
        } else {
          resolve({});
        }
      });
    },
    getSelfOuList: function (cb) {
      var self = this;

      this.getUserOuGuid(function (ouguid) {
        self.getOuListInfo(ouguid, function (custom) {
          // alert(JSON.stringify(custom))
          cb && cb(custom);
        });
      });
    },
    // 获取当前用户部门guid
    getUserOuGuid: function (cb) {
      ejs.auth.getUserInfo({
        success: function (result) {
          var userInfo =
            typeof result.userInfo === "string"
              ? JSON.parse(result.userInfo)
              : result.userInfo;

          cb && cb(userInfo.ouguid);
        },
        error: function (error) {},
      });
    },
    // 获取部门下信息
    getOuListInfo: function (ouguid, cb) {
      ejs.storage.getBusinessRestUrl({
        success: function (result) {
          var url =
            result["business-rest-url"] + "address_getoulistwithuser_v7";

          Util.ajax({
            url: url,
            data: {
              params: JSON.stringify({
                ouguid: ouguid,
              }),
            },
            success: function (result) {
              console.log(result);
              if (cb && typeof cb === "function") {
                cb(result.custom);
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
    setData: function (data) {
      this.data = data;
    },
    setValue: function (value) {
      this.value = value;
    },
    setText: function (text) {
      var textArr = text.split(",");
      var item = "";
      var self = this;

      if (textArr.length >= 1 && textArr[0]) {
        // textArr.forEach(function (e) {
        //     item += Mustache.render(self._templ, {
        //         username: e
        //     });
        // });

        self.el.value = text;
      } else {
        self.el.value = self.isouonly == 1 ? "请选择部门" : "请选择人员";
      }

      this.text = text;
    },
    _templ:
      '<span class="mui-badge mui-badge-primary mr10">{{username}}</span>',
    getModule: function () {
      return {
        id: this.id,
        url: this.url,
        type: this.type,
        action: this.action,
        idField: "id",
        textField: "text",
        imgField: "img",
        iconField: "iconCls",
        parentField: "pid",
        valueField: "id",
        pinyinField: "tag",
        value: this.value,
        text: this.text,
        bind: this.bind,
      };
    },
    readonlyChange: function (isReadonly) {
      if (isReadonly) {
        this.el.setAttribute("readonly", "true");
        this.el.removeEventListener("tap", this._tapFunc, false);
        this.hideIconRight();
      } else {
        this.el.removeAttribute("readonly");
        this.el.addEventListener("tap", this._tapFunc, false);
      }
    },
    hideIconRight: function () {
      this.el.parentNode.classList.remove("icon-right");
    },
  });

  register(SelectContact, "ep-mui-selectcontact");

  // TODO: treeSelect
  var TreeSelect = function (dom) {
    TreeSelect.super.constructor.call(this, dom);
  };

  extend(TreeSelect, MControl, {
    type: "treeselect-non-nested",
    _init: function () {
      this.bind = this.getAttribute("bind");
      this.action = this.getAttribute("action");
      this.treeTpl = this.getAttribute("treetpl") || "./tree.tpl";
      this.multiselect = eval(this.getAttribute("multiselect"));
      this.confirmCallback = this.getAttribute("confirmcallback");
      this.insertText = this.getAttribute("inserttext");
      this.url = this.getAttribute("url");
      this.readonly =
        this.el.classList.contains("readonly") ||
        String(this.getAttribute("readonly"));

      if (typeof this.insertText === "string") {
        this.insertText = eval(this.insertText);
      } else {
        this.insertText = true;
      }

      if (this.url) {
        this.url = epm.getRightUrl(epm.dealUrl(this.url));
      } else {
        this.url = epm.getRightUrl(epm.dealUrl(this.action));
      }

      this.rootName = this.getAttribute("rootname") || "根";

      // 如果是多选
      if (this.multiselect) {
        this._dirTempl = [
          '<div class="mui-input-row mui-checkbox mui-left tree-con-item dir" data-id="{{id}}" data-text="{{text}}" data-issubnode="{{isSubNode}}">',
          "  <span>{{text}}</span>",
          '  <input name="checkbox" {{#cls}}class="hidden"{{/cls}} type="checkbox" {{#checked}}checked{{/checked}} />',
          "</div>",
        ].join("");

        this._templ = [
          '<div class="mui-input-row mui-checkbox mui-left tree-con-item tree-item-node" data-id="{{id}}" data-text="{{text}}" data-issubnode="{{isSubNode}}">',
          "  <label>{{text}}</label>",
          '  <input name="checkbox" type="checkbox" {{#checked}}checked{{/checked}}   {{#cls}}class="hidden"{{/cls}}/>',
          "</div>",
        ].join("");
      } else {
        this._dirTempl = [
          '<div class="mui-input-row mui-radio mui-left tree-con-item dir" data-id="{{id}}" data-text="{{text}}" data-issubnode="{{isSubNode}}">',
          "  <span>{{text}}</span>",
          '  <input {{#cls}}class="hidden"{{/cls}} name="radio" type="radio" {{#checked}}checked{{/checked}} />',
          "</div>",
        ].join("");

        this._templ = [
          '<div class="mui-input-row mui-radio mui-left tree-con-item tree-item-node" data-id="{{id}}" data-text="{{text}}" data-issubnode="{{isSubNode}}">',
          "  <label>{{text}}</label>",
          '  <input name="radio" type="radio" {{#checked}}checked{{/checked}}  {{#cls}}class="hidden"{{/cls}}/>',
          "</div>",
        ].join("");
      }

      this._breadcrumbsTempl =
        '<a class="tree-breadcrumbs-item" data-id="{{nodeId}}">{{breadcrumbsName}}</a>';

      this.el.setAttribute("readonly", "true");

      if (this.readonly !== "null" && this.readonly !== "false") {
        this.hideIconRight();
      } else {
        this.el.addEventListener("tap", this._tapFunc);
        // 监听 history 状态，关闭树控件
        window.addEventListener("popstate", this.hideTree());
        // window.onpopstate = function (e) {
        //   self.hideTree();
        // };
      }
    },
    _tapFunc: function () {
      var self = epm.get(this.id);

      $(self.container)
        .find(".tree-breadcrumbs-items")
        .html(
          Mustache.render(self._breadcrumbsTempl, {
            breadcrumbsName: self.rootName,
            nodeId: "",
          })
        );

      self.showTree();
      self._render(self.initData);
      window.history.pushState({}, "", "#treeselect");
    },
    readonlyChange: function (isReadonly) {
      if (isReadonly) {
        // this.el.setAttribute("readonly", "true");
        this.el.removeEventListener("tap", this._tapFunc, false);
        window.removeEventListener("popstate", this.hideTree());
        this.hideIconRight();
      } else {
        // this.el.removeAttribute("readonly");
        this.el.addEventListener("tap", this._tapFunc, false);
        window.addEventListener("popstate", this.hideTree());
      }
    },
    showTree: function () {
      $(this.container).removeClass("hidden");
    },
    hideTree: function () {
      $.each($(".epm-tree-container"), function (i, e) {
        e.classList.add("hidden");
      });
    },
    _createTreeContainer: function () {
      var el = document.createElement("div");

      el.id = "epm-tree-" + epm.generateId();
      el.className = "hidden epm-tree-container";

      document.body.appendChild(el);
      this.container = el;
      this.loadTemplate();
    },
    loadTemplate: function () {
      var container = this.container;
      var self = this;

      $(container).load(this.treeTpl, function () {
        // 初始化滚动条
        mui(".mui-scroll-wrapper").scroll({
          scrollY: false,
          scrollX: true,
        });

        self._bindTreeListener();
      });
    },
    _bindTreeListener: function () {
      var $breadcrumbsItems = $(this.container).find(".tree-breadcrumbs-items");
      var self = this;

      // 点击 tree dir
      $(this.container)
        .on("tap", ".tree-con-item", function () {
          // 点击目录状态
          var $this = $(this);
          var issubnode = $this.data("issubnode");
          var id = $this.data("id");
          var text = $this.data("text");
          var isMultiselect = self.multiselect;

          issubnode = Boolean(issubnode);

          // 点击的如果是目录的话插入 history 记录、生成面包屑导航，并且请求相关接口
          if ($this.hasClass("dir")) {
            var preChecked = $this.find("input").prop("checked");

            setTimeout(function () {
              var checked = $this.find("input").prop("checked");
              var isCheckedDir = false;

              // 如果前后两次一样，说明点击的是文件夹，需要渲染子集，并且插入浏览记录、渲染面包屑
              if (preChecked == checked) {
                $breadcrumbsItems.html(
                  $breadcrumbsItems.html() +
                    Mustache.render(self._breadcrumbsTempl, {
                      breadcrumbsName: text,
                      nodeId: id,
                    })
                );

                self.getTreeData(id, checked, isCheckedDir);
              } else if (isMultiselect) {
                isCheckedDir = true;
                self.getTreeData(id, checked, isCheckedDir);
              } else {
                self.value = id;
                self.text = text;
              }
            }, 50);
          } else {
            // 判断当前是否重复选择，如果在 self.value 中有的话，再次点击代表删除
            if (self.value.length >= 1 && isMultiselect) {
              if (self.value.indexOf(id) !== -1) {
                var valueArr = self.value.split(",");
                var textArr = self.text.split(",");
                var index = valueArr.indexOf(id);

                valueArr.splice(index, 1);
                textArr.splice(index, 1);
                self.value = valueArr.join(",");
                self.text = textArr.join(",");
              } else {
                self.value += "," + id;
                self.text += "," + text;
              }
            } else {
              self.value = id;
              self.text = text;
            }
          }
        })
        .on("tap", ".tree-confirm", function () {
          // 点击确认按钮关闭选人控件
          self.setText(self.text);
          self.setValue(self.value);
          self.hideTree();

          var confirmCallback = self.confirmCallback;
          var callback = window[confirmCallback];

          if (callback && typeof callback === "function") {
            callback();
          }
        });

      // 点击面包屑
      $breadcrumbsItems.on("tap", ".tree-breadcrumbs-item", function () {
        var $this = $(this);
        var id = $this.data("id");

        if (!$this.next().get(0)) {
          return;
        }

        !id ? self._render(self.initData) : self.getTreeData(id, false);
        self._removeNextSiblings(this);
      });
    },
    getTreeData: function (nodeId, checkState, isCheckedDir) {
      var data = this.data;
      var self = this;

      // 根据 NODEID 添加节点
      for (var i = 0, len = data.length; i < len; i++) {
        var item = data[i];

        if (item.id === nodeId) {
          item.checked = checkState;
          this.node = item;
          break;
        }
      }

      // https://www.easy-mock.com/mock/5cb6ca44f6c8be4af31ae04d/mock/getTreeOuModel
      // https://www.easy-mock.com/mock/5cb6ca44f6c8be4af31ae04d/mock/getSingleTreeModule
      // epm.isMock ? this.action : this.url
      Util.ajax({
        url: epm.isMock ? this.action : this.url,
        type: "post",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded;charset=UTF-8",
        data: this.onGetRequestData(isCheckedDir),
        beforeSend: function () {
          ejs.ui.showWaiting();
        },
        success: function (response) {
          var control = response.controls[0];
          var data = control.data;

          // 如果 data 是数组，说明当前目录被展开了
          if (data && Array.isArray(data) && data.length >= 1) {
            self._render(data);
            self.data = self.data.concat(data);
          }
        },
        error: function (xhr) {
          console.error(xhr);
          console.error("获取下拉树失败");
        },
        complete: function () {
          ejs.ui.closeWaiting();
        },
      });
    },
    _render: function (data) {
      var dirItem = "";
      var item = "";
      var self = this;
      var value = self.value;

      $.each(data, function (i, e) {
        e.cls = e.ckr ? "" : "hidden";
        e.checked = value.indexOf(e.id) !== -1 ? true : false;

        if (!e.isLeaf) {
          dirItem += Mustache.render(self._dirTempl, e);
        } else {
          item += Mustache.render(self._templ, e);
        }
      });

      $(this.container)
        .find(".tree-con-items")
        .html(dirItem + item);
    },
    _renderBreadcrumbs: function (nodeText) {
      var $treeBreadcrumbsItem = $(this.container).find(
        ".tree-breadcrumbs-item"
      );
      var self = this;

      if ($treeBreadcrumbsItem && $treeBreadcrumbsItem.length >= 1) {
        for (var i = 0, len = $treeBreadcrumbsItem.length; i < len; i++) {
          var item = $treeBreadcrumbsItem[i];

          if (item.textContent == nodeText) {
            self._removeNextSiblings(item);
            break;
          }
        }
      }
    },
    _removeNextSiblings: function (el) {
      var $el = $(el);
      var $next = $el.next();

      if ($next.get(0)) {
        $next.remove();
        this._removeNextSiblings(el);
      }
    },
    setValue: function (value) {
      this.value = value;
    },
    setText: function (text) {
      this.text = text;
      var el = this.el;

      if (this.insertText) {
        var tagName = el.tagName;

        if (tagName === "INPUT" || tagName === "TEXTAREA") {
          el.value = text;
        } else {
          el.innerHTML = text;
        }
      }
    },
    setData: function (data) {
      this.data = JSON.parse(JSON.stringify(data));
      this.initData = JSON.parse(JSON.stringify(data));

      // 生成容器
      this._createTreeContainer();
    },
    getModule: function () {
      return {
        id: this.id,
        bind: this.bind,
        url: this.url,
        type: this.type,
        action: this.action,
        idField: "id",
        textField: "text",
        imgField: "img",
        iconField: "iconCls",
        parentField: "pid",
        valueField: "id",
        pinyinField: "tag",
        value: this.value,
        text: this.text,
        node: this.node,
      };
    },
    hideIconRight: function () {
      this.el.parentNode.classList.remove("icon-right");
    },
  });

  register(TreeSelect, "ep-mui-treeselect");

  var DatePicker = function (dom) {
    DatePicker.super.constructor.call(this, dom);
  };

  extend(DatePicker, MControl, {
    _init: function () {
      var optionsJson = this.getAttribute("data-options") || "{}";
      var options = epm.parseJSON(optionsJson);
      this.options = options;
      this.readonly =
        this.el.classList.contains("readonly") ||
        String(this.getAttribute("readonly"));

      if (options.beginDate) {
        options.beginDate = new Date(options.beginDate);
      }
      if (options.endDate) {
        options.endDate = new Date(options.endDate);
      }

      this.format =
        options.format || this.getAttribute("format") || "yyyy-MM-dd";
      this.bind = this.getAttribute("bind");
      var self = this;

      if (this.readonly === "null" || this.readonly === "false") {
        mui(this).off("tap");
        this.el.addEventListener("tap", self._tapFunc, false);
      } else {
        this.hideIconRight();
      }
    },
    type: "datepicker",
    getModule: function () {
      return {
        id: this.id,
        type: this.type,
        bind: this.bind,
        format: this.format,
        value: this.value,
      };
    },
    _tapFunc: function () {
      var self = epm.get(this.id);
      var picker = new mui.DtPicker(self.options);

      picker.show(function (rs) {
        epm.get(self.id).setValue(rs.text);
        // self.setValue(rs.text);
        picker.dispose();
      });
    },
    readonlyChange: function (isReadonly) {
      if (isReadonly) {
        this.el.setAttribute("readonly", "true");
        this.el.removeEventListener("tap", this._tapFunc, false);
        this.hideIconRight();
      } else {
        this.el.removeAttribute("readonly");
        this.el.addEventListener("tap", this._tapFunc, false);
      }
    },
    hideIconRight: function () {
      this.el.parentNode.classList.remove("icon-right");
    },
  });
  register(DatePicker, "ep-mui-datepicker");

  var DateRangePicker = function (dom) {
    DateRangePicker.super.constructor.call(this, dom);
  };

  extend(DateRangePicker, MControl, {
    _init: function () {
      var optionsJson = this.getAttribute("data-options") || "{}";
      var options = epm.parseJSON(optionsJson);
      this.options = options;
      this.readonly =
        this.el.classList.contains("readonly") ||
        String(this.getAttribute("readonly"));

      if (options.minDate) {
        this.options.beginDate = new Date(options.minDate);
      }
      if (options.maxDate) {
        this.options.endDate = new Date(options.maxDate);
      }

      this.format =
        options.format || this.getAttribute("format") || "yyyy-MM-dd";
      this.bind = this.getAttribute("bind");
      var self = this;

      if (this.readonly === "null" || this.readonly === "false") {
        mui(this).off("tap");
        this.el.addEventListener("tap", self._tapFunc, false);
      } else {
        this.hideIconRight();
      }
    },
    type: "daterangepicker",
    getModule: function () {
      return {
        id: this.id,
        type: this.type,
        bind: this.bind,
        format: this.format,
        value: this.value,
        text: this.text,
      };
    },
    _tapFunc: function () {
      var self = epm.get(this.id);
      var picker = new mui.DtPicker(self.options);
      var titleTxtTpl = document.createElement("div");
      titleTxtTpl.classList.add("dtpicker-title");
      titleTxtTpl.innerHTML = "请选择开始时间";

      var header = picker.ui.picker.querySelector(".mui-dtpicker-header");
      var brother = header.querySelector(".mui-btn-blue");

      header.insertBefore(titleTxtTpl, brother);

      picker.show(function (rs) {
        setTimeout(function () {
          titleTxtTpl.innerHTML = "请选择结束时间";
          picker.show(function (result) {
            var _this = self;
            if (_this.compareTime(rs.text, result.text)) {
              _this.setValue({
                startDate: rs.text,
                endDate: result.text,
              });
            } else {
              ejs.ui.toast("结束时间不能小于开始时间，请重新选择");
            }
            picker.dispose();
          });
        }, 500);
      });
    },
    setValue: function (value) {
      this.value = value;
      this.setText(this.value.startDate + '~' + this.value.endDate);
    },
    setText: function (text) {
      this.text = text;
      this.el.value = text;
    },
    readonlyChange: function (isReadonly) {
      if (isReadonly) {
        this.el.setAttribute("readonly", "true");
        this.el.removeEventListener("tap", this._tapFunc, false);
        this.hideIconRight();
      } else {
        this.el.removeAttribute("readonly");
        this.el.addEventListener("tap", this._tapFunc, false);
      }
    },
    hideIconRight: function () {
      this.el.parentNode.classList.remove("icon-right");
    },
    compareTime: function (time1, time2) {
      if (new Date(time1).getTime() <= new Date(time2).getTime()) {
        return true;
      } else {
        return false;
      }
    },
  });
  register(DateRangePicker, "ep-mui-daterangepicker");

  var ComboBox = function (dom) {
    ComboBox.super.constructor.call(this, dom);
  };

  extend(ComboBox, MControl, {
    type: "combobox",
    _init: function () {
      var data = this.getAttribute("data");
      this.onchange = this.getAttribute("onchange");

      this.bind = this.getAttribute("bind");
      this.action = this.getAttribute("action");
      this.readonly =
        this.el.classList.contains("readonly") ||
        String(this.getAttribute("readonly"));

      // 客户端设置数据源
      if (data) {
        data = epm.parseJSON(data);
        this.data = data;
      }

      if (this.readonly !== "null" && this.readonly !== "false") {
        this.el.setAttribute("readonly", "true");
        this.hideIconRight();
      } else {
        this.el.addEventListener("tap", this._tapFunc, false);
      }
    },
    _tapFunc: function () {
      var self = epm.get(this.id);

      ejs.ui.popPicker({
        layer: 1,
        data: self.data,
        success: function (result) {
          var item = result.items[0];
          var text = item.text;
          var value = item.value;

          if (
            window[self.onchange] &&
            typeof window[self.onchange] === "function"
          ) {
            window[self.onchange](text, value, self);
            self.text = text;
            self.value = value;
          } else {
            self.setValue(value);
            self.setText(text);
          }
        },
        error: function (err) {},
      });
    },
    getText: function () {
      return this.text;
    },
    setValue: function (value) {
      this.value = value;
    },
    setText: function (text) {
      var tagName = this.el.tagName;

      if (tagName == "INPUT" || tagName == "TEXTAREA") {
        this.el.value = text;
      } else {
        this.el.innerHTML = text;
      }

      this.text = text;
    },
    setData: function (data) {
      var result = [],
        value = this.value,
        self = this;

      if (Array.isArray(data)) {
        data.forEach(function (e, i) {
          var text = e.text,
            id = e.id;

          if (value == id) {
            self.setText(text);
          }

          result.push({
            text: text,
            value: id,
          });
        });
      }

      this.data = result;
    },
    getValue: function () {
      return this.value;
    },
    getData: function () {
      return this.data;
    },
    getModule: function () {
      return {
        id: this.id,
        type: this.type,
        bind: this.bind,
        action: this.action,
        value: this.value,
        text: this.text,
        textField: "text",
        valueField: "id",
        pinyinField: "tag",
        columns: [],
      };
    },
    readonlyChange: function (isReadonly) {
      if (isReadonly) {
        this.el.setAttribute("readonly", "true");
        this.el.removeEventListener("tap", this._tapFunc, false);
        this.hideIconRight();
      } else {
        this.el.removeAttribute("readonly");
        this.el.addEventListener("tap", this._tapFunc, false);
      }
    },
    hideIconRight: function () {
      this.el.parentNode.classList.remove("icon-right");
    },
  });
  register(ComboBox, "ep-mui-combobox");

  var RadioButtonList = function (dom) {
    RadioButtonList.super.constructor.call(this, dom);
  };

  extend(RadioButtonList, MControl, {
    type: "radiobuttonlist",
    _init: function () {
      var data = this.getAttribute("data");

      this.bind = this.getAttribute("bind");
      this.action = this.getAttribute("action");
      this.readonly =
        this.el.classList.contains("readonly") ||
        String(this.getAttribute("readonly"));

      // 客户端设置数据源
      if (data) {
        data = epm.parseJSON(data);
        this.setData(data);
      }
    },
    _templ:
      '<div class="mui-input-row mui-radio"><label>{{text}}</label><input type="radio" name="{{name}}" value="{{value}}" {{#checked}}checked="checked"{{/checked}}></div>',
    setData: function (data) {
      var html = [];
      var val = this.value;

      for (var i = 0, l = data.length; i < l; i++) {
        if (val && val === data[i].value) {
          data[i].checked = true;
        }
        data[i].name = this.id;
        html.push(Mustache.render(this._templ, data[i]));
      }
      this.el.innerHTML = html.join("");
      this.radios = mui('input[type="radio"]', this.el);

      // 绑定radio的change事件，保证value与radio的值一致
      var self = this;

      this.radios.each(function (index, item) {
        item.addEventListener("change", function (e) {
          self.value = e.target.value;
        });
      });

      if (this.readonly !== "null" && this.readonly !== "false") {
        this.readonlyChange(true);
      }
    },
    setValue: function (value) {
      this.value = value;

      var self = this;

      setTimeout(function () {
        if (self.radios) {
          var radios = self.radios;

          for (var i = 0, l = radios.length; i < l; i++) {
            if (radios[i].value == value) {
              radios[i].checked = true;
              break;
            }
          }
        }
      }, 200);
    },
    getModule: function () {
      return {
        id: this.id,
        type: this.type,
        bind: this.bind,
        action: this.action,
        value: this.value,
      };
    },
    readonlyChange: function (isReadonly) {
      if (isReadonly) {
        this.radios.each(function (index, item) {
          // item.parentNode.classList.add('mui-disabled');
          item.setAttribute("readonly", "true");
          item.setAttribute("disabled", "true");
        });
      } else {
        this.radios.each(function (index, item) {
          // item.parentNode.classList.add('mui-disabled');
          item.removeAttribute("readonly");
          item.removeAttribute("disabled");
        });
      }
    },
  });
  register(RadioButtonList, "ep-mui-radiobuttonlist");

  var CheckboxList = function (dom) {
    CheckboxList.super.constructor.call(this, dom);
  };

  extend(CheckboxList, RadioButtonList, {
    type: "checkboxlist",
    _templ:
      '<div class="mui-input-row mui-checkbox"><label>{{text}}</label><input name="checkbox" value="{{value}}" {{#checked}}checked="checked"{{/checked}} type="checkbox"></div>',
    setData: function (data) {
      var html = [];
      var val = this.value;
      this.readonly =
        this.el.classList.contains("readonly") ||
        String(this.getAttribute("readonly"));

      if (val) {
        val = "," + val + ",";
      }

      for (var i = 0, l = data.length; i < l; i++) {
        if (val && val.indexOf("," + data[i].value + ",") > -1) {
          data[i].checked = true;
        }
        html.push(Mustache.render(this._templ, data[i]));
      }
      this.el.innerHTML = html.join("");
      this.checkboxs = mui('input[type="checkbox"]', this.el);

      // 绑定checkbox的change事件，保证value与checkbox的值一致
      var self = this;

      this.checkboxs.each(function (index, item) {
        item.addEventListener("change", function (e) {
          var target = e.target,
            value;

          if (target.checked) {
            if (self.value) {
              self.value += ",";
            }

            self.value += target.value;
          } else {
            value = "," + self.value + ",";
            value = value.replace("," + target.value + ",", ",");
            self.value = value.substr(1, value.length - 2);
          }
        });
      });

      if (this.readonly !== "null" && this.readonly !== "false") {
        this.readonlyChange(true);
      }
    },
    setValue: function (value) {
      this.value = value;
      value = "," + value + ",";

      var self = this;

      setTimeout(function () {
        if (self.checkboxs) {
          var checkboxs = self.checkboxs;

          for (var i = 0, l = checkboxs.length; i < l; i++) {
            if (value.indexOf(checkboxs[i].value) > -1) {
              checkboxs[i].checked = true;
            }
          }
        }
      }, 200);
    },
    readonlyChange: function (isReadonly) {
      if (isReadonly) {
        this.checkboxs.each(function (index, item) {
          item.setAttribute("disabled", "true");
          item.setAttribute("readonly", "true");
        });
      } else {
        this.checkboxs.each(function (index, item) {
          item.removeAttribute("disabled");
          item.removeAttribute("readonly");
        });
      }
    },
  });
  register(CheckboxList, "ep-mui-checkboxlist");

  var Hidden = function (dom) {
    Hidden.super.constructor.call(this, dom);
  };

  extend(Hidden, MControl, {
    type: "hidden",
    _init: function () {
      this.bind = this.getAttribute("bind");
    },
    setValue: function (value) {
      this.value = value;
    },
    getModule: function () {
      return {
        id: this.id,
        bind: this.bind,
        type: this.type,
        value: this.value,
      };
    },
  });
  register(Hidden, "ep-mui-hidden");

  var OutputText = function (dom) {
    OutputText.super.constructor.call(this, dom);
  };

  extend(OutputText, MControl, {
    type: "outputtext",
    _init: function () {
      this.bind = this.getAttribute("bind");
      this.action = this.getAttribute("action");
      this.options = this.getAttribute("data-options");
      if (this.options) {
        this.options = epm.parseJSON(this.options);
      }
      if (this.el && this.el.tagName.toLowerCase() === "textarea") {
        this.el.readOnly = true;
      }
    },
    setValue: function (value) {
      this.value = value;
      this.el.innerHTML = value;
    },
    getModule: function () {
      // 展示类的控件，不需要把value传回后台
      return {
        id: this.id,
        type: this.type,
        bind: this.bind,
        action: this.action,
        dataOptions: this.options,
      };
    },
  });
  register(OutputText, "ep-mui-outputtext");

  var SubTable = function (dom) {
    SubTable.super.constructor.call(this, dom);
  };

  extend(SubTable, MControl, {
    type: "subtable",
    _init: function () {
      this.bind = this.getAttribute("bind");
      this.tplId = this.getAttribute("tplId");
      this.action = this.getAttribute("action");

      if (!this.tplId) {
        Util.ejs.ui.toast("子表控件id: " + this.id + "未设置 tplId 属性");

        return;
      }

      this.template = document.getElementById(this.tplId).innerHTML;
    },
    setData: function (data) {
      var template = this.template;
      var item = "";

      if (typeof template === "string") {
        data.forEach(function (e) {
          item += Mustache.render(template, e);
        });
      }

      this.el.innerHTML = item;
    },
    getModule: function () {
      return {
        id: this.id,
        type: this.type,
        bind: this.bind,
        action: this.action,
        dataOptions: this.options,
      };
    },
  });
  register(SubTable, "ep-mui-subtable");

  var List = function (dom) {
    List.super.constructor.call(this, dom);
  };

  extend(List, MControl, {
    type: "datagrid",

    _init: function () {
      var fields = this.getAttribute("fields"),
        onItemRender = this.getAttribute("onitemrender"),
        onItemClick = this.getAttribute("onitemclick");

      this.action = this.getAttribute("action");
      this.url = this.getAttribute("url");
      this.pageSize = parseInt(this.getAttribute("pageSize"));
      this.defaultPage = parseInt(this.getAttribute("defaultPage")) || 0;
      this.extraId = this.getAttribute("extraId");
      this.idField = this.getAttribute("idField");
      this.tplId = this.getAttribute("tplId") || "";
      this.requestType = this.getAttribute("requesttype") || "post";
      this.columns = [];

      var tplel = document.getElementById(this.tplId);

      if (tplel) {
        this.template = tplel.innerHTML;
      }

      // if(tplNode[0]) {
      // tplNode[0].id = '{{' + this.idField + '}}';
      // this.template = tplNode[0].outerHTML.trim();
      // }

      // 根据fields生成columns
      if (fields) {
        fields = fields.split(",");
        for (var i = 0, l = fields.length; i < l; i++) {
          this.columns.push({
            fieldName: fields[i],
          });
        }
      }

      if (onItemRender && typeof window[onItemRender] === "function") {
        this.onItemRender = window[onItemRender];
      }
      var self = this;

      if (onItemClick && typeof window[onItemClick] === "function") {
        this.onItemClick = window[onItemClick];
      } else {
        window.addEventListener("DOMContentLoaded", function () {
          if (onItemClick && typeof window[onItemClick] === "function") {
            self.onItemClick = window[onItemClick];
          }
        });
      }

      this.el.innerHTML = "";

      // 如果配置了pageSize，则说明有分页，自动绑定分页效果
      if (this.pageSize > 0) {
        var container = epm.closest(this.el, "mui-scroll-wrapper");

        // 未配置下拉刷新的容器，则自动将.mui-content设为下拉容器
        if (!container) {
          container = mui(".mui-content")[0];
          // 构建最外层容器
          if (container) {
            container.classList.add("mui-scroll-wrapper");
          }
        }
        if (!container.id) {
          container.id = epm.generateId("pullrefresh");
        }
        this.scrollId = container.id;

        // 列表外包裹.mui-scroll的div
        var div = document.createElement("div");

        div.className = "mui-scroll";

        this.el.parentNode.replaceChild(div, this.el);
        div.appendChild(this.el);

        // 绑定上拉加载事件
        this.initPullRefresh();
      }
    },
    /*
     * 设置数据 @params isRefresh 是否是刷新，为true时刷新整个列表，false则加载下一页
     */
    setData: function (data, isRefresh, ajaxResponse) {
      var html = [],
        item;
      // 页面列表实际li个数
      var domLiLength = this.el.parentNode.querySelectorAll(
        "#" + this.id + " > li"
      ).length;
      // 接口返回下拉刷新总数
      var resTotal =
        (ajaxResponse &&
          ajaxResponse.controls &&
          ajaxResponse.controls[0].total) ||
        0;

      if (resTotal !== 0 && domLiLength == resTotal && isRefresh === false) {
        return;
      }
      for (var i = 0, l = data.length; i < l; i++) {
        // if (this.leafTemplate && data[i].isLeaf) {
        // item = Mustache.render(this.leafTemplate, data[i]);
        // } else {
        // item = Mustache.render(this.template, data[i]);
        // }
        if (this.onItemRender) {
          data[i].extras = JSON.stringify(data[i]);
          item = this.onItemRender.call(this, data[i]);
        } else {
          data[i].extras = JSON.stringify(data[i]);
          item = Mustache.render(this.template, data[i]);
        }
        if (isRefresh) {
          html.push(item);
        } else {
          this.el.innerHTML += item;
        }
      }

      if (isRefresh) {
        var self = this;

        self.el.innerHTML = html.join("");
      }
    },

    setTotal: function (total) {
      this.total = total;
    },

    setUrl: function (url) {
      this.url = url;
      if (this.pullToRefresh) {
        this.pullToRefresh.options.url = url;
      }
    },
    initPullRefresh: function () {
      var self = this;
      // 获得请求参数的回调
      var getData = function (pageIndex) {
        self.pageIndex = pageIndex;

        var data = {};

        console.log("data");

        if (self.onGetRequestData) {
          data = self.onGetRequestData();
        }
        var commonDto = JSON.parse(data.commonDto);
        var index = 0;

        commonDto.forEach(function (e, n) {
          if (e.id == "_common_hidden_viewdata") {
            if (index == 0) {
              index++;
            } else {
              commonDto.splice(n);
            }
          }
        });
        console.log(commonDto);

        data.commonDto = JSON.stringify(commonDto);

        return data;
      };
      // 处理后台返回数据
      var changeResponseDataCallback = function (data) {
        data = epm.getSecondRequestData(data);

        return data;
      };
      // 数据请求成功回调
      var successRequestCallback = function (data, isRefresh, ajaxResponse) {
        var total = data.total;

        data = data.data;

        self.setTotal(total);
        self.setData(data, isRefresh, ajaxResponse);

        if (total <= self.pageSize * (self.pageIndex + 1)) {
          self.pullToRefresh.isShouldNoMoreData = false;
        }
      };

      // 点击回调
      var onClickCallback = function (e) {
        if (self.onItemClick) {
          self.onItemClick.call(
            this,
            e,
            this.id,
            JSON.parse(this.getAttribute("extras"))
          );
        }
      };

      var init = function () {
        console.log(self.url || self.action);
        self.pullToRefresh = new PullToRefreshTools.bizlogic({
          isDebug: true,
          type: self.requestType,
          url: self.url || self.action,
          initPageIndex: self.defaultPage || 0,
          template: self.template,
          dataRequest: getData,
          itemClick: onClickCallback,
          dataChange: changeResponseDataCallback,
          success: successRequestCallback,
          isAutoRender: false,
          contentType: "application/x-www-form-urlencoded",
          container: "#" + self.scrollId,
          listContainer: "#" + self.id,
          setting: {
            up: {
              auto: false,
            },
          },
        });
      };

      if (!window.PullToRefreshTools) {
        Util.loadJs(
          [
            Config.bizRootPath +
              "js/widgets/pulltorefresh/pulltorefresh.skin.default.js",
            Config.bizRootPath +
              "js/widgets/pulltorefresh/pulltorefresh.skin.css",
          ],
          Config.bizRootPath +
            "js/widgets/pulltorefresh/pulltorefresh.bizlogic.impl.js",
          init
        );
      } else {
        init();
      }
    },
    refresh: function () {
      this.el.innerHTML = "";
      this.pullToRefresh.refresh();
    },
    getModule: function () {
      var data = {
        id: this.id,
        type: this.type,
        action: this.action,
        columns: this.columns,
        idField: this.idField,
        isSecondRequest: false,
      };

      if (this.pageSize > 0) {
        data.pageSize = this.pageSize;
        data.pageIndex = this.pageIndex;
      }

      return data;
    },
  });
  register(List, "ep-mui-list");

  exports.extend = extend;
  exports.register = register;
  exports.control = MControl;

  // TODO: 扫描页面，初始化所有控件·
  exports.init = function (callback) {
    var controls = document.querySelectorAll('[class*="ep-mui-"]'),
      clazz,
      control;

    for (var i = 0, l = controls.length; i < l; i++) {
      clazz = getControlClazz(controls[i]);

      if (clazz && !epm.components[controls[i].id]) {
        control = new clazz(controls[i]);
        epm.set(control.id, control);

        if (callback) {
          callback(control);
        }
      }
    }
  };
})((window.MControl = {}), (window.controlMap = {}));

/**
 * 作者: guotq
 * 时间: 2019-6-18
 * 描述:  f9移动端适配文件
 * MControl 目前作为文件引入，全局绑定在window上
 */
(function (win, $) {
  var dio = new (function () {
    var sb = [];
    var _dateFormat = null;
    var useHasOwn = !!{}.hasOwnProperty,
      replaceString = function (a, b) {
        var c = m[b];

        if (c) {
          // sb[sb.length] = c;
          return c;
        }
        c = b.charCodeAt();

        return (
          "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16)
        );
      },
      doEncode = function (o, field) {
        if (o === null) {
          sb[sb.length] = "null";

          return;
        }
        var t = typeof o;

        if (t == "undefined") {
          sb[sb.length] = "null";

          return;
        } else if (o.push) {
          // array

          sb[sb.length] = "[";
          var b,
            i,
            l = o.length,
            v;

          for (i = 0; i < l; i += 1) {
            v = o[i];
            t = typeof v;
            if (t == "undefined" || t == "function" || t == "unknown") {
            } else {
              if (b) {
                sb[sb.length] = ",";
              }
              doEncode(v);

              b = true;
            }
          }
          sb[sb.length] = "]";

          return;
        } else if (o.getFullYear) {
          if (_dateFormat) {
            sb[sb.length] = '"';
            if (typeof _dateFormat === "function") {
              sb[sb.length] = _dateFormat(o, field);
            } else {
              sb[sb.length] = mini.formatDate(o, _dateFormat);
            }
            sb[sb.length] = '"';
          } else {
            var n;

            sb[sb.length] = '"';
            sb[sb.length] = o.getFullYear();
            sb[sb.length] = "-";
            n = o.getMonth() + 1;
            sb[sb.length] = n < 10 ? "0" + n : n;
            sb[sb.length] = "-";
            n = o.getDate();
            sb[sb.length] = n < 10 ? "0" + n : n;
            sb[sb.length] = "T";
            n = o.getHours();
            sb[sb.length] = n < 10 ? "0" + n : n;
            sb[sb.length] = ":";
            n = o.getMinutes();
            sb[sb.length] = n < 10 ? "0" + n : n;
            sb[sb.length] = ":";
            n = o.getSeconds();
            sb[sb.length] = n < 10 ? "0" + n : n;
            sb[sb.length] = '"';
          }

          return;
        } else if (t == "string") {
          if (strReg1.test(o)) {
            sb[sb.length] = '"';

            sb[sb.length] = o.replace(strReg2, replaceString);
            sb[sb.length] = '"';

            return;
          }
          sb[sb.length] = '"' + o + '"';

          return;
        } else if (t == "number") {
          sb[sb.length] = o;

          return;
        } else if (t == "boolean") {
          sb[sb.length] = String(o);

          return;
        } else {
          // object
          sb[sb.length] = "{";
          var b, i, v;

          for (i in o) {
            // if (!useHasOwn || (o.hasOwnProperty && o.hasOwnProperty(i))) {
            if (!useHasOwn || Object.prototype.hasOwnProperty.call(o, i)) {
              v = o[i];
              t = typeof v;
              if (t == "undefined" || t == "function" || t == "unknown") {
              } else {
                if (b) {
                  sb[sb.length] = ",";
                }
                doEncode(i);
                sb[sb.length] = ":";
                doEncode(v, i);

                b = true;
              }
            }
          }
          sb[sb.length] = "}";

          return;
        }
      },
      m = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\",
      },
      strReg1 = /["\\\x00-\x1f]/,
      strReg2 = /([\x00-\x1f\\"])/g;

    this.encode = (function () {
      var ec;

      return function (o, dateFormat) {
        sb = [];

        _dateFormat = dateFormat;
        doEncode(o);

        _dateFormat = null;

        return sb.join("");
      };
    })();
    this.decode = (function () {
      //        var dateRe1 = /(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})/g;
      //        var dateRe2 = new RegExp('\/Date\\(([0-9]+)\\)\/', 'g');
      // var dateRe2 = new RegExp('\/Date\((\d+)\)\/', 'g');

      // "2000-11-12 11:22:33", "2000-05-12 11:22:33", "2008-01-11T12:22:00", "2008-01-11T12:22:00.111Z"

      var dateRe1 = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2}(?:\.*\d*)?)Z*$/;
      // "\/Date(1382101422005)\/", "//Date(1034000000000)//", "/Date(1034000000000+0800)/"
      var dateRe2 = new RegExp("^/+Date\\((-?[0-9]+).*\\)/+$", "g");

      var re = /[\"\'](\d{4})-(\d{1,2})-(\d{1,2})[T ](\d{1,2}):(\d{1,2}):(\d{1,2})(\.*\d*)[\"\']/g;

      return function (json, parseDate) {
        if (json === "" || json === null || json === undefined) {
          return json;
        }

        if (typeof json === "object") {
          // 不应该序列化，应该遍历处理日期字符串
          json = this.encode(json);
        }

        function evalParse(json) {
          if (parseDate !== false) {
            // json = json.replace(__js_dateRegEx, "$1new Date($2)");

            json = json.replace(__js_dateRegEx, "$1new Date($2)");
            json = json.replace(re, "new Date($1,$2-1,$3,$4,$5,$6)");
            json = json.replace(__js_dateRegEx2, "new Date($1)");
          }

          return window["ev" + "al"]("(" + json + ")");
        }

        var data = null;

        if (window.JSON && window.JSON.parse) {
          var dateReviver = function (key, value) {
            if (typeof value === "string" && parseDate !== false) {
              // dateRe1
              dateRe1.lastIndex = 0;
              var a = dateRe1.exec(value);

              if (a) {
                value = new Date(a[1], a[2] - 1, a[3], a[4], a[5], a[6]);

                return value;
              }
              // dateRe2
              dateRe2.lastIndex = 0;
              var a = dateRe2.exec(value);

              if (a) {
                value = new Date(parseInt(a[1]));

                return value;
              }
            }

            return value;
          };

          try {
            var json2 = json.replace(__js_dateRegEx, '$1"/Date($2)/"');

            data = window.JSON.parse(json2, dateReviver);
          } catch (ex) {
            data = evalParse(json);
          }
        } else {
          data = evalParse(json);
        }

        return data;
      };
    })();
  })();
  var epm = {
    // 保存所有new出来的mui组件，用id作为索引
    components: {},
    idIndex: 0,
    generateId: function (pre) {
      return (pre || "epm-") + this.idIndex++;
    },
    // 根据id获取mui组件实例，主要用于commondto中实现建立页面dom元素与实际mui组件的联系
    get: function (id) {
      return epm.components[id] || null;
    },
    set: function (id, control) {
      epm.components[id] = control;
    },
    /**
     * 将某个对象转换成json字符串
     *
     * @param obj 对象
     */
    encodeJson: function (obj) {
      return JSON.stringify(obj);
    },
    /**
     * 将json字符串转换为对象
     *
     * @param json  要转换的json字符串
     */
    decodeJson: function (json) {
      return JSON.parse(json);
    },
    /**
     * utf-8编码函数
     *
     * @param s1  要编码的数据
     */
    encodeUtf8: function (s1) {
      var s = escape(s1);
      var sa = s.split("%");
      var retV = "";
      var Hex2Utf8 = epm.Hex2Utf8;
      var Str2Hex = epm.Str2Hex;

      if (sa[0] !== "") {
        retV = sa[0];
      }
      for (var i = 1; i < sa.length; i++) {
        if (sa[i].substring(0, 1) == "u") {
          retV += Hex2Utf8(Str2Hex(sa[i].substring(1, 5)));
          if (sa[i].length > 5) {
            retV += sa[i].substring(5);
          }
        } else {
          retV += "%" + sa[i];
        }
      }

      return retV;
    },
    Hex2Utf8: function (s) {
      var retS = "";
      var tempS = "";
      var ss = "";
      var Dig2Dec = epm.Dig2Dec;

      if (s.length == 16) {
        tempS = "1110" + s.substring(0, 4);
        tempS += "10" + s.substring(4, 10);
        tempS += "10" + s.substring(10, 16);
        var sss = "0123456789ABCDEF";

        for (var i = 0; i < 3; i++) {
          retS += "%";
          ss = tempS.substring(i * 8, (eval(i) + 1) * 8);

          retS += sss.charAt(Dig2Dec(ss.substring(0, 4)));
          retS += sss.charAt(Dig2Dec(ss.substring(4, 8)));
        }

        return retS;
      }

      return "";
    },
    Str2Hex: function (s) {
      var c = "";
      var n;
      var ss = "0123456789ABCDEF";
      var digS = "";
      var Dec2Dig = epm.Dec2Dig;

      for (var i = 0; i < s.length; i++) {
        c = s.charAt(i);
        n = ss.indexOf(c);
        digS += Dec2Dig(eval(n));
      }

      // return value;
      return digS;
    },
    Dig2Dec: function (s) {
      var retV = 0;

      if (s.length == 4) {
        for (var i = 0; i < 4; i++) {
          retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
        }

        return retV;
      }

      return -1;
    },
    Dec2Dig: function (n1) {
      var s = "";
      var n2 = 0;

      for (var i = 0; i < 4; i++) {
        n2 = Math.pow(2, 3 - i);
        if (n1 >= n2) {
          s += "1";
          n1 = n1 - n2;
        } else {
          s += "0";
        }
      }

      return s;
    },
    dealUrl: function (url, isCommondto) {
      /*
       * 不用加上页面路径了，移动端和pc端的页面路径是不一样的，而且有没有页面路径对于后台来说都是一样的 //
       * action形式的url需要加上页面路径 // 例如在
       * "/pages/login/login.xhtml"中，url为"login.autoLoad" // 则url会转换为
       * "/pages/login/login.autoLoad" url = getRequestMapping() + '/' +
       * url;
       */

      // TODO: 应根据配置项决定是否需要将"a.b"类型的url转化为"a/b"
      // 将"a.b"类型的url转化为"a/b"
      // restFul形式才需要转换
      // if (url.indexOf('.') != -1 && url.indexOf('.jspx') == -1) {
      //     if (epm.isRestFul) {
      //         url = url.replace('.', '/');
      //     } else if (url.indexOf('cmd=') < 0) {
      //         url = url.replace('.', '.action?cmd=');
      //     }
      // }

      // // 加上页面地址中的请求参数
      // var all = window.location.href;
      // var index = all.indexOf('?');
      // var hasParam = url.indexOf('?') > -1;

      // if (index != -1) {
      //     if (hasParam) {
      //         url += '&' + all.substring(index + 1);
      //     } else {
      //         url += '?' + all.substring(index + 1);
      //     }

      //     if (isCommondto) {
      //         // 加上isCommondto标识
      //         // 用来给后台区分与其他不是通过epoint中的三个方法发送的请求
      //         url += '&isCommondto=true';
      //     }

      // } else if (isCommondto) {
      //     if (hasParam) {
      //         url += '&isCommondto=true';
      //     } else {
      //         url += '?isCommondto=true';
      //     }
      // }

      // url = epm.getRightUrl('rest/' + url);

      // return url;

      // 将"a.b"类型的url转化为"a/b"
      if (url.indexOf(".") != -1 && url.indexOf(".jspx") == -1) {
        url = url.replace(".", "/");
      }
      // 加上页面地址中的请求参数
      // var all = window.location.href;
      // var index = all.indexOf('?');
      // var hasParam = url.indexOf('?') > -1;

      // if (index != -1) {
      //     if (hasParam) {
      //         url += '&' + all.substring(index + 1);
      //     } else {
      //         url += '?' + all.substring(index + 1);
      //     }

      //     // 加上isCommondto标识
      //     // 用来给后台区分与其他不是通过epoint中的三个方法发送的请求
      //     url += '&isCommondto=true';
      // } else {
      //     if (hasParam) {
      //         url += '&isCommondto=true';
      //     } else {
      //         url += '?isCommondto=true';
      //     }
      // }

      var urlParams = Util.getUrlParams();
      urlParams.isCommondto = true;

      url = Util.addUrlParams(url, urlParams);

      url = epm.getRightUrl("rest/" + url);

      return url;
    },
    encode: dio.encode,
    decode: dio.decode,
    mask: $.createMask(),
    // 显示遮罩
    showMask: function () {
      this.mask.show();
    },
    // 关闭遮罩
    hideMask: function () {
      this.mask.close();
    },
    // 处理二次请求返回的数据
    getSecondRequestData: function (data) {
      var status = data.status;

      // 处理后台返回的状态码
      if (status) {
        var code = parseInt(status.code),
          text = status.text,
          url = status.url;

        if (code >= 300) {
          if (url) {
            win.location.href = this.getRightUrl(url);
          } else {
            $.alert(text, "提示", "我知道了");
          }

          return;
        }
      }

      if (data.controls) {
        var len = data.controls.length;
        var viewData = data.controls[len - 1];

        console.log("viewData");
        console.log(viewData);

        if (viewData.id == "_common_hidden_viewdata") {
          if (!epm.get("_common_hidden_viewdata")) {
            this.createHiddenView(viewData);
          }
          epm.get("_common_hidden_viewdata").setValue(viewData.value);
        }
        data = data.controls[0];
      }

      return data;
    },

    createHiddenView: function (data) {
      var control = epm.get("_common_hidden_viewdata");

      if (control) {
        control.setValue(data.value);

        return;
      }

      var input = document.createElement("input");

      input.id = "_common_hidden_viewdata";
      input.type = "hidden";
      input.className = "ep-mui-hidden";
      control = new controlMap["ep-mui-hidden"](input);

      control.setValue(data.value);
      control.render("#body");
      epm.set(control.id, control);
    },
    // 获取框架jsboot内系统参数
    getFrameSysParam: function (name) {
      if (!win.EpFrameSysParams) {
        return;
      }

      return win.EpFrameSysParams[name];
    },
    encryptSM2: function (str, sm2PubKey) {
      sm2PubKey = sm2PubKey || epm.getFrameSysParam("security_sm2encode_pubk");
      if (!sm2PubKey) {
        throw new Error("the second param [sm2PubKey] can not be empty");
      }

      str = Util.sm2.encrypt(str, sm2PubKey, 0);
      return str;
    },
    addReplayAttackData: function (data, url) {
      function getUrlParams(url) {
        url = Util.removeHash(url);
        var idx = url.indexOf("?");
        if (idx === -1) return "";
        var query = url.substr(idx + 1);

        if (!query.length) {
          return "";
        }
        // 有加密的情况只取加密的部分
        if (query.indexOf(Util.URL_ENCRYPT_PARAM_NAME) > -1) {
          query = query.substr(
            query.indexOf(Util.URL_ENCRYPT_PARAM_NAME) +
              Util.URL_ENCRYPT_PARAM_NAME.length +
              1
          );
          if (query.indexOf("&") > -1) {
            query = query.substr(0, query.indexOf("&"));
          }
        }
        return query;
      }

      function encodeStr(str) {
        return encodeURIComponent(str)
          .replace(/\'/g, "%27")
          .replace(/!/g, "%21")
          .replace(/~/g, "%7E")
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29");
      }

      var uid = Util.uuid(),
        reqTime = Date.now(),
        urlParam = getUrlParams(url),
        dto = data.commonDto || "",
        cmdParams = data.cmdParams || "";

      $.extend(data, {
        replaynoticeid: uid,
        reqtime: reqTime,
        paramsign: Util.sm3.encrypt(
          uid + ";" + reqTime + ";" + encodeStr(urlParam)
        ),
        dtosign: Util.sm3.encrypt(
          uid +
            ";" +
            reqTime +
            ";" +
            encodeStr(dto) +
            ";" +
            encodeStr(cmdParams)
        ),
      });
      return data;
    },
    // addReplayAttackData: function (data) {
    //   var control = epm.get("_common_hidden_viewdata"),
    //     uid = Util.uuid({
    //       len: 8,
    //       type: "noline",
    //     }),
    //     key = "";

    //   if (control) {
    //     key = JSON.parse(control.getValue()).replayAttack;
    //     if (key) {
    //       data = $.extend(
    //         {},
    //         {
    //           uid: uid,
    //           sign: epm.encryptSM2(uid + ";" + key.substring(0, 32)),
    //         },
    //         data
    //       );
    //     }
    //   }
    //   return data;
    // },
    getUidSign: function (uid) {
      var control = epm.get("_common_hidden_viewdata"),
        uid =
          uid ||
          Util.uuid({
            len: 8,
            type: "noline",
          }),
        key = "";
      var data = {};
      if (control) {
          try {
            key = JSON.parse(control.getValue()).replayAttack;
          } catch (error) {

          }
        if (key) {
          data = {
            uid: uid,
            sign: epm.encryptSM2(uid + ";" + key.substring(0, 32)),
          };
        }
      } else {
        data = {
          uid: "",
          sign: "",
        };
      }
      return data;
    },
    // 返回完整的WebContent根路径
    getRootPath: function () {
      var loc = window.location,
        host = loc.hostname,
        protocol = loc.protocol,
        port = loc.port ? ":" + loc.port : "",
        path =
          (window._rootPath !== undefined
            ? _rootPath
            : "/" + loc.pathname.split("/")[1]) + "/";

      var rootPath = protocol + "//" + host + port + path;

      return rootPath;
    },

    // 返回适合的url
    // 1.url为全路径，则返回自身
    // 2.url为，则返回自身
    // 3.url为WebContent开始的路径，则补全为完整的路径
    getRightUrl: function (url) {
      if (!url) {
        return "";
      }

      // 是否是相对路径
      var isRelative = url.indexOf("./") != -1 || url.indexOf("../") != -1;

      // 全路径、相对路径直接返回
      if (/^(http|https|ftp)/g.test(url) || isRelative) {
        url = url;
      } else {
        url = this.getRootPath() + url;
      }

      return url;
    },

    _pageLoagding: $("body>.page-loading"),

    hidePageLoading: function () {
      if (this._pageLoagding && this._pageLoagding.length) {
        document.body.removeChild(this._pageLoagding[0]);
        this._pageLoagding = undefined;
      }
    },
    delsemiforstring: function (str, separator) {
      separator = separator || ";";
      var reg = new RegExp(separator + "$");

      return str.replace(reg, "");
    },
    // 解析配置参数
    // 不用JSON.parse的方法是因为JSON.parse方法要求参数为严格的json格式
    // 而控件的配置参数我们之前是可以不加引号或用单引号的
    parseJSON: function (str) {
      return eval("(" + str + ")");
    },
    // 获取class为cls的最近父元素
    closest: function (dom, cls) {
      if (!dom || !cls) {
        return;
      }
      var parent = dom.parentNode,
        className = parent.className;

      if ((" " + className + " ").indexOf(" " + cls + " ") >= 0) {
        return parent;
      } else if (parent.tagName === "BODY") {
        return;
      } else {
        return this.closest(parent, cls);
      }
    },
    getCookie: function (name) {
      var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

      if ((arr = document.cookie.match(reg))) {
        return unescape(arr[2]);
      } else {
        return null;
      }
    },
    // 拓展的方法
    extend: function () {
      var options,
        name,
        src,
        copy,
        copyIsArray,
        clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

      if (typeof target === "boolean") {
        deep = target;
        target = arguments[i] || {};
        i++;
      }
      if (typeof target !== "object" && !exports.isFunction(target)) {
        target = {};
      }
      if (i === length) {
        target = this;
        i--;
      }
      for (; i < length; i++) {
        if ((options = arguments[i]) != null) {
          for (name in options) {
            src = target[name];
            copy = options[name];
            if (target === copy) {
              continue;
            }
            if (
              deep &&
              copy &&
              (exports.isPlainObject(copy) ||
                (copyIsArray = exports.isArray(copy)))
            ) {
              if (copyIsArray) {
                copyIsArray = false;
                clone = src && exports.isArray(src) ? src : [];
              } else {
                clone = src && exports.isPlainObject(src) ? src : {};
              }

              target[name] = epm.extend(deep, clone, copy);
            } else if (copy !== undefined) {
              target[name] = copy;
            }
          }
        }
      }

      return target;
    },
    // 为下拉刷新服务
    appendHtmlChildCustom: function (targetObj, childElem) {
      if (typeof targetObj === "string") {
        targetObj = document.querySelector(targetObj);
      }
      if (
        targetObj == null ||
        childElem == null ||
        !(targetObj instanceof HTMLElement)
      ) {
        return;
      }
      if (childElem instanceof HTMLElement) {
        targetObj.appendChild(childElem);
      } else {
        // 否则,创建dom对象然后添加
        var tmpDomObk = exports.pareseStringToHtml(childElem);

        if (tmpDomObk != null) {
          targetObj.appendChild(tmpDomObk);
        }
      }
    },
    getChildElemLength: function (targetObj) {
      if (!(targetObj instanceof HTMLElement)) {
        return 0;
      }

      return targetObj.children.length;
    },

    isUseConfig:
      window.Config && window.Config.comdto && window.Config.comdto.isUseConfig,

    isRestFul:
      window.Config && window.Config.comdto && window.Config.comdto.isRestFul,

    isMock:
      window.Config && window.Config.comdto && window.Config.comdto.isMock,

    requestMethod:
      (window.Config &&
        window.Config.comdto &&
        window.Config.comdto.requestMethod) ||
      "post",
  };

  // 如果存在配置文件
  if (epm.isUseConfig) {
    // 测试时候的重写
    epm.getRootPath = function () {
      return window.Config.comdto.rootUrl;
    };
    // epm.getRightUrl = function(url) {
    // if(!url) return '';
    //
    // // 是否是相对路径
    // var isRelative = url.indexOf('./') != -1 || url.indexOf('../') != -1;
    //
    // // 全路径、相对路径直接返回
    // if(/^(http|https|ftp)/g.test(url) || isRelative) {
    // url = url;
    // } else {
    // url = this.getRootPath() + url;
    // }
    //
    // return url;
    // };
  }

  win.epm = epm;
})(window, window.mui);

(function () {
  "use strict";

  Util.loadJs(Config.bizRootPath + "js/utils/util.string.js");
  // Util.loadJs(Config.bizRootPath + 'showcase/comdto/js/handlecontrols.js');

  // epointm内容
  (function () {
    // setTimeout(function() {
    // 先初始化页面上的控件
    MControl.init(function (control) {
      var controlType = control.type;

      if (
        controlType == "datagrid" ||
        controlType == "webuploader" ||
        controlType == "treeselect-non-nested"
      ) {
        control.onGetRequestData = function (isCheckedDir) {
          // 获取自己的数据模型
          var data = null;

          data = new CommonDto(this.id).getData(true);

          if (
            controlType == "datagrid" ||
            (controlType == "treeselect-non-nested" && !isCheckedDir)
          ) {
            data[0].isSecondRequest = true;
          }

          if (isCheckedDir) {
            data[0].eventType = "checkedchanged";
          }
          // 拼上额外数据
          if (this.extraId) {
            var ids = this.extraId.split(",");

            for (var i = 0; i < ids.length; i++) {
              data = data.concat(new CommonDto(ids[i]).getData(true));
            }
          }

          return {
            commonDto: JSON.stringify(data),
          };
        };
      }
    });
    // }, 1000);

    // 属性扩展
    var extendAttr = function (base, attrs) {
      for (var key in attrs) {
        if (attrs[key]) {
          base[key] = attrs[key];
        }
      }
    };

    var CommonDto = function (scope, action, initHook, initControl) {
      this.controls = {};

      // 页面action，用于拼接url
      this.action = action;
      this.initHook = initHook;

      var self = this;
      var i, l;

      var controls = [];
      /**
       *
       * @param {String} scope 控件的id
       */
      function getControls(scope) {
        var $scope = mui("#" + scope);

        if ($scope[0] && /ep-mui-\w*/g.test($scope[0].className)) {
          // 有以"ep-mui-"开头的class，说明它本身就是要处理的控件，直接返回其本身
          // 不考虑有控件嵌套的情况
          return $scope;
        } else {
          return mui('[class*="ep-mui-"]', $scope);
        }
      }

      if (scope != "@none") {
        if (!scope || scope === "@all") {
          controls = mui('[class*="ep-mui-"]');
        } else {
          if (Array.isArray(scope)) {
            for (i = 0, l = scope.length; i < l; i++) {
              controls = controls.concat(getControls(scope[i]));
            }
          } else {
            controls = controls.concat(getControls(scope));
          }
        }
      }

      for (i = 0, l = controls.length; i < l; i++) {
        var control = controls[i],
          mcontrol = epm.get(control.id);

        if (mcontrol) {
          self.controls[mcontrol.id] = mcontrol;

          // 根据控件action设置控件的url
          // 主要用于有二次请求的控件（表格）
          if (initControl && mcontrol.action && mcontrol.setUrl) {
            mcontrol.setUrl(epm.dealUrl(this.action + "." + mcontrol.action));
          }
        }
      }
    };

    CommonDto.prototype = {
      constructor: CommonDto,
      /*
       * 获取控件数据 @params original 控制是否返回原始数据，返回原始数据是为了方便外部操作控件字段
       */
      getData: function (original) {
        var data = [],
          control,
          controlData,
          dataOptions,
          hidden;

        // 遍历所有控件
        for (var id in this.controls) {
          control = this.controls[id];

          // 把data-options加到控件数据中
          controlData = control.getModule();
          dataOptions = control.getAttribute("data-options");
          if (dataOptions) {
            controlData["dataOptions"] = epm.parseJSON(dataOptions);
          }
          data.push(controlData);
          if (id == "_common_hidden_viewdata") {
            hidden = control;
          }
        }

        if (!hidden) {
          hidden = epm.get("_common_hidden_viewdata");

          if (hidden) {
            data.push(hidden.getModule());
          } else {
            data.push({
              id: "_common_hidden_viewdata",
              type: "hidden",
              value: "",
            });
          }
        }

        if (original) {
          return data;
        } else {
          return {
            commonDto: JSON.stringify(data),
          };
        }
      },
      getCtrlData: function (original) {
        var data = [],
          control,
          controlData,
          dataOptions,
          hidden;
        var bind = {};
        var action = {};
        var newData = {};
        // 遍历所有控件
        for (var id in this.controls) {
          control = this.controls[id];
          var _bind = control.bind;
          var _id = control.id;
          var _action = control.action;
          if (_bind && _bind.indexOf(".") != "-1") {
            var _bindKeyValue = _bind.split(".");
            var _bindKey = _bindKeyValue[0];
            var _bindValue = _bindKeyValue[1];
            // debugger
            if (!bind[_bindKey]) {
              bind[_bindKey] = [];
              bind[_bindKey].push(_bindValue);
            } else {
              bind[_bindKey].push(_bindValue);
            }
            // debugger
          }
          if (!action[_id]) {
            action[_id] = _action;
          }

          // 把data-options加到控件数据中
          controlData = control.getModule();
          dataOptions = control.getAttribute("data-options");
          if (dataOptions) {
            controlData["dataOptions"] = epm.parseJSON(dataOptions);
          }
          data.push(controlData);
        }
        console.log("bind");
        console.log(bind);

        newData = {
          bind: bind,
          action: action,
        };
        console.log(newData);
        console.log(JSON.stringify(newData));
        console.log(JSON.stringify(data));

        if (original) {
          // return data;
          // return {
          //     bind:
          // };
        } else {
          return {
            commonDto: JSON.stringify(data),
          };
        }
      },
      setData: function (data, customData) {
        var id, control, item;
        // 新增需求，根据custom中的字段设置控件隐藏只读等状态
        var accessRight = customData.accessRight
          ? JSON.parse(customData.accessRight)
          : null;
        var status = {};

        if (accessRight) {
          for (let key in accessRight) {
            status[key.toLowerCase()] = accessRight[key];
          }
        }

        // 新增需求，根据 isAllowAttachWrite 字段判断附件上传的权限
        var arr = customData.isAllowAttachWrite
          ? customData.isAllowAttachWrite.split(";")
          : [];

        for (var i = 0, l = data.length; i < l; i++) {
          item = data[i];
          id = item.id;
          control = this.controls[id];

          if (id === "_common_hidden_viewdata") {
            this.createHiddenView(item);
          }

          if (!control) {
            continue;
          }

          if (item.value !== undefined && control.setValue) {
            control.setValue(item.value);
          }
          if (item.text !== undefined && control.setText) {
            control.setText(item.text);
          }
          if (item.data && control.setData) {
            control.setData(item.data);

            if (item.total && control.setTotal) {
              control.setTotal(item.total);
            }
          }

          if (
            status[control.el.name] === "hidden" ||
            status[control.id] === "hidden"
          ) {
            control.el.parentNode.style.display = "none";
          }

          if (
            status[control.el.name] === "readonly" ||
            status[control.id] === "readonly"
          ) {
            control.readonlyChange && control.readonlyChange(true);
          }

          if (control.type === "webuploader" && arr.length > 0) {
            control.setPermission(arr);
          }

          if (this.initHook) {
            this.initHook.call(this, control, item, customData);
          }
        }
      },
      createHiddenView: function (data) {
        var control = epm.get("_common_hidden_viewdata");

        if (control) {
          control.setValue(data.value);

          return;
        }

        var input = document.createElement("input");

        input.id = "_common_hidden_viewdata";
        input.type = "hidden";
        input.className = "ep-mui-hidden";
        control = new controlMap["ep-mui-hidden"](input);

        control.setValue(data.value);
        control.render("#body");
        epm.set(control.id, control);
      },
      init: function (opts) {
        var self = this;
        var data = this.getData();

        if (opts.params) {
          data.cmdParams = opts.params;
        }
        if (!opts.notShowLoading) {
          epm.showMask();
        }
        // debugger
        data = epm.addReplayAttackData(data, opts.url);

        // 如果需要加密
        data = Util.encryptAjaxParams(opts.url, data);
        // TODO: 发送请求
        Util.ajax({
          url: opts.url,
          type: epm.requestMethod,
          dataType: "json",
          contentType: "application/x-www-form-urlencoded;charset=UTF-8",
          data: data,
          beforeSend: function (XMLHttpRequest) {
            // F9框架做了csrf攻击的防御
            var csrfcookie = epm.getCookie("_CSRFCOOKIE");

            if (csrfcookie) {
              XMLHttpRequest.setRequestHeader("CSRFCOOKIE", csrfcookie);
            }
          },
          success: function (data) {
            // if (data[Util.BODY_ENCRYPT_PARAM_NAME]) {
            //     data = Util.decrypt(data[Util.BODY_ENCRYPT_PARAM_NAME]);
            //     data = epm.decode(data);
            // }
            var status = data.status,
              controls = data.controls,
              custom = data.custom || "",
              code = parseInt(status.code),
              text = status.text,
              url = status.url;

            if (code == 0) {
              if (url) {
                url = epm.getRightUrl(url);
                Util.ejs.ui.alert("错误:" + JSON.stringify(status));

                return;
                // if (status.top) {
                // top.window.location.href = url;
                // } else {
                // window.location.href = url;

                // }
              } else {
                if (opts.fail) {
                  opts.fail.call(self, text, status);
                } else {
                  Util.ejs.alert(text, "提示", "我知道了");
                }
              }
            } else if (code == 1) {
              controls.length && self.setData(controls, custom);

              opts.done && opts.done.call(self, custom);
            }
          },
          complete: function () {
            if (!opts.notShowLoading) {
              epm.hideMask();
            }
          },
        });
      },
    };

    var epointm = {
      /**
       * 初始化页面
       *
       * @param url
       *            ajax请求地址(如果不传，默认为page_Load)
       * @param ids
       *            要回传的页面元素id，是个数组['tree', 'datagrid1']
       * @param callback
       *            回调事件
       * @param opt
       *            其他参数 isPostBack 是否是回传，默认为false keepPageIndex 是否停留在当前页码
       *            默认为false initHook: 初始化时控件在setValue后的回调
       */
      initPage: function (url, ids, callback, fail, opt) {
        var initHook;

        if (typeof fail === "object" && opt === undefined) {
          opt = fail;
          fail = undefined;
        }

        opt = opt || {};
        if (typeof opt === "function") {
          initHook = opt;
          opt = {};
        } else {
          initHook = opt.initHook;
        }

        var urlArr = url.split("?"),
          subUrl = urlArr[0],
          urlParam = urlArr[1];

        var len = subUrl.indexOf("."),
          action = len > 0 ? subUrl.substr(0, len) : subUrl;

        if (!this.getCache("action")) {
          this.setCache("action", action);
          this.setCache("urlParam", urlParam);
          this.setCache("callback", callback);
        }

        // 非模拟数据情况下才需要处理url
        if (!epm.isMock) {
          if (len < 0) {
            subUrl += ".page_Load";
          }

          url = subUrl + (urlParam ? "?" + urlParam : "");
        }

        var params = {};

        if (ids && ids.constructor === Object) {
          params = ids;
          ids = undefined;
        }

        /**
         * 框架访问日志记录的时候，需要记录模块名称，目前是通过action地址反推的，有的项目如果页面地址和action地址不规范的话，可能反推不了。
         * 所以需要在初始化请求的时候，自动带上页面地址
         */
        params.pageUrl = window.location.href;
        params = JSON.stringify(params);

        // 在new CommonDto时是否需要初始化控件与action相关的属性
        // 一般只需要在initPage方法中初始化，其他方法不需要
        var initControl = opt.initControl;

        if (initControl === undefined) {
          initControl = true;
        }

        // 加载页面数据
        var commonDto = new CommonDto(ids, action, initHook, initControl);
        commonDto.init({
          url: epm.isMock ? url : epm.dealUrl(url, true),
          method: opt.method,
          params: params,
          done: function (data) {
            if (callback) {
              callback.call(this, data);
            }

            if (window.epoint_afterInit) {
              window.epoint_afterInit(data);
            }

            // 初始化完后隐藏pageloading
            epm.hidePageLoading();
          },
          fail: fail,
        });
      },

      /**
       * 刷新页面
       *
       * @param ids
       *            要回传的页面元素id，是个数组['tree', 'datagrid1'],如果不传，默认为整个form
       * @param callback
       *            回调事件
       */
      refresh: function (ids, callback) {
        var url = this.getCache("action") + ".page_Refresh";

        var urlParam = this.getCache("urlParam");

        if (urlParam) {
          url += "?" + urlParam;
        }

        if (typeof ids === "function") {
          callback = ids;
          ids = "@all";
        }

        callback = callback || this.getCache("callback");

        this.initPage(url, ids, callback, {
          initControl: false,
        });
      },

      /**
       * 提交表单数据
       *
       * @param url
       *            ajax请求地址
       * @param ids
       *            要回传的页面元素id，是个数组['tree', 'datagrid1'],如果不传，默认为整个form
       * @param callback
       *            回调事件
       * @param notShowLoading
       *            是否不显示loading效果
       */
      execute: function (url, ids, params, callback, notShowLoading) {
        var action,
          index = url.indexOf(".");

        if (!epm.isMock) {
          // url不带'.'，则表示没带action，则自动加上initPage时的action
          if (index < 0) {
            action = this.getCache("action");
            console.log("获取action, 此时的状态");
            console.log(this._cache);
            url = action + "." + url;
          } else {
            action = url.substr(0, index);
          }
        }

        var commonDto = new CommonDto(ids, action);

        if (typeof params === "function") {
          callback = params;
          params = null;
        }

        if (this.validate(commonDto.controls)) {
          commonDto.init({
            url: epm.isMock ? url : epm.dealUrl(url, true),
            params: params
              ? typeof params === "string"
                ? params
                : epm.encode(params)
              : null,
            done: callback,
            notShowLoading: notShowLoading,
          });
        }
      },
      // input验证
      validate: function (controls) {
        var vtypes = [
          "email",
          "url",
          "int",
          "float",
          "phone",
          "mobile",
          "tel",
          "postCode",
          "orgCode",
          "idCard",
        ];
        var vtypesErrMsg = {
          email: function (msg) {
            return (msg || "") + "请输入一个有效的电子邮件地址";
          },
          url: function (msg) {
            return (msg || "") + "请输入一个有效的URL";
          },
          int: function (msg) {
            return (msg || "") + "请输入一个整数";
          },
          float: function (msg) {
            return (msg || "") + "请输入一个有效号码";
          },
          phone: function () {
            return "输入的电话号码格式不正确";
          },
          mobile: function () {
            return "输入的手机号码格式不正确";
          },
          tel: function () {
            return "输入的固定电话号码格式不正确";
          },
          postCode: function () {
            return "输入的邮政编码格式不正确";
          },
          orgCode: function () {
            return "输入的组织机构代码格式不正确";
          },
          idCard: function () {
            return "输入的身份证号码格式不正确";
          },
        };

        for (var key in controls) {
          var el = controls[key].el;
          var vtype = el.getAttribute("vtype");
          var regExp = el.getAttribute("regExp");
          var maxthenId = el.getAttribute("maxthen");
          var minthenId = el.getAttribute("minthen");
          var value = el.value;

          // 先验证是否为必填
          if (el.required) {
            if (value === "") {
              var text = (
                $(el).parent().attr("label") ||
                $(el).parent().text() ||
                $(el).parent().prev().text()
              ).replace(/[:: ]$/, "");

              Util.ejs.ui.toast(
                el.getAttribute("requiredErrorText") || text + "不能为空"
              );

              return false;
            }
          }

          // 验证是否有 vtype
          if (vtype && vtypes.indexOf(vtype) !== -1) {
            var type = "is" + vtype.charAt(0).toUpperCase() + vtype.slice(1);

            if (!Util.string[type](value)) {
              if (
                vtype == "email" ||
                vtype == "url" ||
                vtype == "int" ||
                vtype == "float"
              ) {
                Util.ejs.ui.toast(
                  vtypesErrMsg[vtype](el.previousElementSibling.innerHTML)
                );
              } else {
                Util.ejs.ui.toast(vtypesErrMsg[vtype]());
              }

              return false;
            }
          }

          // 验证是否有自定义正则
          if (regExp && regExp !== "") {
            try {
              regExp = eval(regExp);
            } catch (error) {
              throw new Error(el.id + "自定义正则解析出错");
            }

            if (value.length >= 1) {
              if (!regExp.test(value)) {
                Util.ejs.ui.toast(el.getAttribute("regExpErrText"));

                return false;
              }
            }
          }

          // 验证日期 - 比大
          if (maxthenId) {
            var res = this.compare(
              maxthenId,
              el,
              ">",
              function (elText, compareObjText) {
                return compareObjText + "不能大于" + elText;
              }
            );

            if (!res) {
              return false;
            }
          }

          // 验证日期 - 比小
          if (minthenId) {
            var res = this.compare(
              minthenId,
              el,
              "<",
              function (elText, compareObjText) {
                return compareObjText + "不能小于" + elText;
              }
            );

            if (!res) {
              return false;
            }
          }
        }

        return true;
      },

      compare: function (compareId, el, operator, callback) {
        var compareObj = epm.get(compareId);
        var compareValue = (compareObj && compareObj.value) || compareId;
        var value = el.value;

        if (compareValue && value) {
          if (operator === ">" && +new Date(compareValue) > +new Date(value)) {
            Util.ejs.ui.toast(
              callback(
                el.previousElementSibling.innerHTML,
                (compareObj &&
                  compareObj.el.previousElementSibling.innerHTML) ||
                  compareId
              )
            );

            return false;
          } else if (
            operator === "<" &&
            +new Date(compareValue) < +new Date(value)
          ) {
            Util.ejs.ui.toast(
              callback(
                el.previousElementSibling.innerHTML,
                (compareObj &&
                  compareObj.el.previousElementSibling.innerHTML) ||
                  compareId
              )
            );

            return false;
          }
        }

        return true;
      },

      alert: function (message, title, callback) {
        Util.ejs.alert(message, title, "我知道了", callback);
      },

      confirm: function (message, title, okCallback, cancelCallback) {
        Util.ejs.confirm(message, title, ["确定", "取消"], function (index) {
          // 确定
          if (index === 0 && okCallback) {
            okCallback();
          } else if (cancelCallback) {
            cancelCallback();
          }
        });
      },

      // 在epoint上增加缓存操作
      _cache: {},

      setCache: function (key, value) {
        this._cache[key] = value;
      },

      getCache: function (key) {
        return this._cache[key];
      },

      delCache: function (key) {
        this._cache[key] = null;
        delete this._cache[key];
      },
      getCtrlUrl: function (url, opt) {
        var initHook;

        opt = opt || {};

        var urlArr = url.split("?"),
          subUrl = urlArr[0],
          urlParam = urlArr[1];

        var len = subUrl.indexOf("."),
          action = len > 0 ? subUrl.substr(0, len) : subUrl;

        if (!this.getCache("action")) {
          this.setCache("action", action);
          this.setCache("urlParam", urlParam);
          this.setCache("callback", callback);
        }

        // 非模拟数据情况下才需要处理url
        if (!epm.isMock) {
          if (len < 0) {
            subUrl += ".page_Load";
          }

          url = subUrl + (urlParam ? "?" + urlParam : "");
        }
        return epm.isMock ? url : epm.dealUrl(url, true);
      },
      // getCtrlUrl: function (url) {
      //     var action,
      //         index = url.indexOf('.');

      //     if (!epm.isMock) {
      //         debugger
      //         // url不带'.'，则表示没带action，则自动加上initPage时的action
      //         if (index < 0) {
      //             action = this.getCache('action');

      //             url = action + '.' + url;
      //         } else {
      //             action = url.substr(0, index);
      //         }
      //     }

      //     return epm.isMock ? url : epm.dealUrl(url, true);
      // },
      getCtrlData: function (ids, params) {
        // var controls = mui('[class*="ep-mui-"]');
        var action;
        var commonDto = new CommonDto(ids);
        var data = {};

        data = commonDto.getData();
        data.cmdParams = params || "";

        console.log("commonDto.getCtrlData");
        console.log(commonDto.getCtrlData());

        // if (this.validate(commonDto.controls)) {
        //     commonDto.init({
        //         url: epm.isMock ? url : epm.dealUrl(url, true),
        //         params: (params ? (typeof params === 'string' ? params : epm.encode(params)) : null),
        //     });
        // }
      },
      ajax: function (options) {
        var defaultOptions = {
          url: "",
          params: "",
          done: null,
          notShowLoading: null,
        };
        var data = Util.extend(true, {}, defaultOptions, options);
        if (!data.url || !data.params) {
          console.error("请检查传参完整");
          return;
        }
        commonDto.init(data);
      },
    };

    window.epointm = epointm;
  })();
})();
