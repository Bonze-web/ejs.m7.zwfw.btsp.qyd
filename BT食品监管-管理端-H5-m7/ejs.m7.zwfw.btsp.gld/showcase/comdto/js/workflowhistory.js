var WorkFlowHistory = function (dom) {
  WorkFlowHistory.super.constructor.call(this, dom);
};

MControl.extend(WorkFlowHistory, MControl.control, {
  type: "workflowhistory",
  _init: function () {
    this.action = this.getAttribute("action");
  },
  setData: function (data) {
    var currData = typeof data === "string" ? JSON.parse(data) : data;
    this.data = currData.useropinionlist
      ? currData.useropinionlist.data
      : currData;
    // this.data = typeof data === "string" ? JSON.parse(data) : data;
    this.renderHistory();
  },
  renderHistory: function () {
    var data = this.data.data;
    var _tpl = this._templ;
    var item = "";

    if (Array.isArray(data)) {
      var rootPath = epm.getRootPath();

      this.el.innerHTML = "";
      console.log("data", data);
      data.forEach(function (e) {
        e.opiniondate = e.opiniondate ? e.opiniondate : e.operatedate;
        e.opiniontext = e.opiniontext ? e.opiniontext : e.opinion;
        e.addusername = e.addusername ? e.addusername : e.sendername;
        let userguid=e.operatorguid?e.operatorguid:e.operatorfordisplayguid
        e.photoUrl =
          rootPath +
          "rest/readpictureaction/getUserPicture?isCommondto=true&userGuid=" +
          userguid + "&isMobile=true&md5=";
        item += Mustache.render(_tpl, e);
      });

      this.el.innerHTML = item;
      // if (!e.photoUrl) {
      this._setDefaultImg();
      // }
    }
  },
  _setDefaultImg: function () {
    $.each($(".timeline-photo img"), function (i, e) {
      e.onerror = setDefaultImg;
    });
  },
  _templ:
    '<div class="em-timeline"><div class="em-timeline-item"><div class="em-timeline-node {{^opiniondate}}unhandle{{/opiniondate}}"></div><div class="em-timeline-panel"><div class="timeline-photo"><img src="{{photoUrl}}" alt=""></div><div class="em-timeline-title clearfix"><div class="timeline-name l">{{addusername}}</div><div class="timeline-activityname r">{{activityname}}</div></div><p class="em-timeline-content">{{{opiniontext}}}</p></div></div><span class="em-timeline-date">{{opiniondate}}</span></div>',
  getModule: function () {
    // 展示类的控件，不需要把value传回后台
    return {
      id: this.id,
      type: this.type,
      action: this.action,
    };
  },
});

MControl.register(WorkFlowHistory, "ep-mui-workflowhistory");
MControl.init();
