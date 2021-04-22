// 限制ios端回弹
ejs.device.setBounce({
  isEnable: 0,
});

var WorkFlowAttach = function (dom) {
  WorkFlowAttach.super.constructor.call(this, dom);
};

MControl.extend(WorkFlowAttach, MControl.control, {
  type: "workflowattach",
  _init: function () {
    this.onitemclick = this.getAttribute("onitemclick");
    this.action = this.getAttribute("action");

    var self = this;

    mui(this.el).on("tap", ".download", function () {
      var itemClick = window[self.onitemclick];

      if (itemClick && typeof itemClick === "function") {
        itemClick(
          self.el,
          this.getAttribute("materialguid"),
          this.getAttribute("materialname")
        );
      }
    });
  },
  setData: function (data) {
    this.data = typeof data === "string" ? JSON.parse(data) : data;
    this.renderAttach();
  },
  renderAttach: function () {
    var data = this.data.data;
    var _tpl = this._templ;
    var item = "";

    if (Array.isArray(data)) {
      data.forEach(function (e) {
        item += Mustache.render(_tpl, e);
      });
      this.el.innerHTML = '<ul class="mui-table-view">' + item + "</ul>";
    }
  },
  _templ:
    '<li class="mui-table-view-cell clearfix"><div class="l"><div class="attach-name">{{materialname}}</div><p class="hidden">更新时间 | 文件大小</p></div><div class="download r" materialname="{{materialname}}" materialguid="{{materialguid}}"><img src="./images/img_download.png" alt=""></div></li>',
  getModule: function () {
    // 展示类的控件，不需要把value传回后台
    return {
      id: this.id,
      type: this.type,
      action: this.action,
    };
  },
});

MControl.register(WorkFlowAttach, "ep-mui-workflowattach");
MControl.init();
