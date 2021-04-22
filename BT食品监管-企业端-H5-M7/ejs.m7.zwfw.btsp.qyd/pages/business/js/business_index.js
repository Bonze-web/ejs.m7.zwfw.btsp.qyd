/*
 * @作者: 杨宗标
 * @创建时间: 2021-04-01 14:17:51
 * @修改时间: 2021-04-20 19:53:51
 * @版本: [1.0]
 * @版权: 国泰新点软件股份有限公司
 * @描述:
 */


(function() {
    "use strict";


    /**
     * 获取缓存信息
     * @param {Function} callback 回调函数
     */
    function getStorage(callback) {
        ejs.storage.getItem({
            key: ['token', 'opearte_rules_guid', 'opearte_imgs_guid'],
            success: function(result) {
                callback && callback(result);
            },
            error: function(error) {}
        });
    }
    Util.loadJs([
        'pages/common/common.js',
         // 下拉刷新
		'js/widgets/minirefresh/minirefresh.css',
		'js/widgets/minirefresh/minirefresh.js',
        'pages/common/common.js',
        'js/widgets/fileinput/fileinput.js',
    ],
    'js/widgets/minirefresh/minirefresh.bizlogic.js',
     function() {

        common.commGetUserInfo(function (res) {
            console.log(res);
            // self.myLoginid = res.loginid;
            // self.userguid = res.userguid;
            customBiz.configReady(res.loginid);
        })
    });

    var customBiz = {
        configReady: function(pripid) {
            var self = this;
            var jsApiList = [{

            }];
            self.myLoginid = pripid
            self.uuid1 = Util.uuid();
            self.uuid2 = Util.uuid();
            self.photoFlag = 0;
            self.initListeners();
            self.eventAdd();

        },
        initListeners: function() {
            var self = this;

            // 基本信息
            self.essential();
            // 从业人员
            self.occupation();

            // 食品安全
            self.foodSafety();


            // 自查记录
            // self.inspection();

            // var data = {
            //     information_list: [
            //         {gou: 1}
            //     ]
            // }
            // var temple1 = Zepto('#information').html();
            // var output = Mustache.render(temple1, data);
            // Zepto('#inspection').html(output);
            // 自查设置
            // var data = {

            // }
            // var temple1 = Zepto('#intercalate').html();
            // var output = Mustache.render(temple1, data);
            // Zepto('#inspection').html(output);
        },
        eventAdd() {
            var self = this;
            var swiper1 = new Swiper('#swiper-photo', {
                slidesPerView: 'auto',
                // 这个地方如果不设置为自动,就会显示不全
                spaceBetween: 30,
                initialSlide: 0,
                // freeMode: true,
                on:{
                    slideChange: function(){
                        // if(self.photoFlag === 0) {
                        //     if(confirm("请保存修改")) {
                        //         return false;
                        //     }
                        // }
                        Zepto(".em-tabview-head .em-tabview-title").eq(this.activeIndex).addClass("cur").siblings().removeClass("cur");

                        //   alert('改变了，activeIndex为'+this.activeIndex);
                        if(this.activeIndex === 1) {
                            self.PullToRefreshToolObj_occupation.instance.triggerDownLoading('noAnim');
                        } else if(this.activeIndex === 2) {
                            self.PullToRefreshToolObj_foodSafety.instance.triggerDownLoading('noAnim');
                        } else if(this.activeIndex === 3) {
                            if(self.PullToRefreshToolObj_inspection) {
                                self.PullToRefreshToolObj_inspection.instance.triggerDownLoading('noAnim');
                            }
                        }
                    },
                },
            });
            var swiper2 = new Swiper('#swiper-file', {
                slidesPerView: 'auto',
                spaceBetween: 10,
                freeMode: true,
                observer:true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents:true,//修改swiper的父元素时，自动初始化swiper
            });
            var swiper3 = new Swiper('#swiper3', {
                slidesPerView: 'auto',
                spaceBetween: 10,
                freeMode: true,
                observer:true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents:true,//修改swiper的父元素时，自动初始化swiper
            });
            mui(".em-tabview-head").on("tap",".em-tabview-title",function(){
                swiper1.slideTo(Zepto(this).index());
                Zepto(this).addClass("cur").siblings().removeClass("cur");
            });


            // 上传附件
            mui('.mui-content').on('tap', '#add_image', function(){
                Zepto('#fileBtn').click();
            });
            // 选择文件的事件
            new FileInput({
                container: '#fileBtn',
                isMulti: false,
                type: 'Image_Camera',
                success: function(b64, file, detail) {
                    ejs.ui.showWaiting('上传中');
                    self.b64 = b64;
                    self.uploadAttarch(file);
                },
                error: function(error) {
                    console.error(error);
                }
            });
            new FileInput({
                container: '#filebtn_annexes',
                isMulti: false,
                success: function(b64, file, detail) {
                    ejs.ui.showWaiting('上传中');
                    self.uploadAnnexes(file);
                },
                error: function(error) {
                    console.error(error);
                }
            });
            // 保存
            // mui('.mui-content').on('tap', '#photo_save', function(){
            //     self.savePhoto();
            // })
            // 删除附件
            mui('.mui-content').on('tap', "#delete_img", function(item){
                var attachguid = Zepto(item.target).attr("attachguid");
                self.AttarchDel(attachguid);
            })
            // 删除附件
            mui('.mui-content').on('tap', "#delete_img_box", function(item){
                var attachguid = Zepto(item.target).attr("attachguid");
                self.AttarchDel(attachguid);
            })
            // 新增从业人员
            mui('.mui-content').on('tap', ".staff_add", function(){
                ejs.page.open(Config.serverUrl.replace(/rest\//,'/') + 'frame/fmui/pages/employee/addemployee?pripid=' + self.myLoginid,{});
            })
            // 编辑从业人员
            mui('.mui-content').on('tap', ".staff_edit", function(){
                ejs.page.open(Config.serverUrl.replace(/rest\//,'/') + 'frame/fmui/pages/employee/editemployee?guid=' + Zepto(this).attr("rowguid"),{});
            })
            // 从业人员详情
            mui('.mui-content').on('tap', ".staff_resume", function(){
                ejs.page.open(Config.serverUrl.replace(/rest\//,'/') + 'frame/fmui/pages/employee/employeedetail?guid=' + Zepto(this).attr("rowguid"),{});
            })
            // 删除从业人员接口
            mui('.mui-content').on('tap', ".staff_delete", function(item){

                ejs.ui.confirm({
                    title: '是否选择',
                    message: '确定删除？',
                    buttonLabels: ['取消', '确定'],
                    cancelable: 1,
                    h5UI: false, // 是否强制使用H5-UI效果，默认false
                    success: function (result) {
                        if (result.which == 1) {
                            var data = {
                                token: 'Epoint_WebSerivce_**##0601',
                                params: {
                                    pripid:self.myLoginid,
                                    rowguid: Zepto(item.target).attr("rowguid")
                                }
                            };
                            Util.ajax({
                                url: Config.serverUrl + 'foodopt/getfoodoptemployeedetele',
                                data: JSON.stringify(data),
                                contentType: 'application/json',
                                success: function(result) {
                                   console.log(result);
                                    //    self.occupation();
                                    self.PullToRefreshToolObj_occupation.instance.triggerDownLoading('noAnim');
                                },
                                error: function(error) {
                                    ejs.ui.toast(error);
                                }
                            });
                        }
                    },
                    error: function (err) {}
                });
            })
            // 新增食品
            mui('.mui-content').on('tap', ".viands_add", function(){
                ejs.page.open(Config.serverUrl.replace(/rest\//,'/') + 'frame/fmui/pages/aqgly/addaqgly?pripid=' + self.myLoginid,{});
            })
            // 编辑食品
            mui('.mui-content').on('tap', ".viands_edit", function(){
                ejs.page.open(Config.serverUrl.replace(/rest\//,'/') + 'frame/fmui/pages/aqgly/editaqgly?guid=' + Zepto(this).attr("rowguid"),{});
            })
            // 食品详情
            mui('.mui-content').on('tap', ".viands_resume", function(){
                ejs.page.open(Config.serverUrl.replace(/rest\//,'/') + 'frame/fmui/pages/aqgly/aqglydetail?guid=' + Zepto(this).attr("rowguid"),{});
            })
            // 删除食品
            mui('.mui-content').on('tap', ".viands_delete", function(item){

                ejs.ui.confirm({
                    title: '是否选择',
                    message: '确定删除？',
                    buttonLabels: ['取消', '确定'],
                    cancelable: 1,
                    h5UI: false, // 是否强制使用H5-UI效果，默认false
                    success: function (result) {
                        if (result.which == 1) {
                            var data = {
                                token: 'Epoint_WebSerivce_**##0601',
                                params: {
                                    rowguid: Zepto(item.target).attr("rowguid")
                                }
                            };
                            Util.ajax({
                                url: Config.serverUrl + 'foodopt/getfoodoptaqglydelete',
                                data: JSON.stringify(data),
                                contentType: 'application/json',
                                success: function(result) {
                                    self.PullToRefreshToolObj_foodSafety.instance.triggerDownLoading('noAnim');
                                },
                                error: function(error) {
                                    ejs.ui.toast(error);
                                }
                            });
                        }
                    },
                    error: function (err) {}
                });

            })
            // 自查新增
            mui('.mui-content').on('tap', ".self_inspection_add", function(item){
                ejs.page.open(Config.serverUrl.replace(/rest\//,'/') + 'frame/fmui/pages/check/addcheck?pripid=' + self.myLoginid,{});
            })
            // 自查编辑
            mui('.mui-content').on('tap', "#btn_edit_info", function(item){
                ejs.page.open(Config.serverUrl.replace(/rest\//,'/') + 'frame/fmui/pages/check/editcheck?guid=' + Zepto(item.target).attr("rowguid"),{});
            })
            // 自查删除
            mui('.mui-content').on('tap', "#list_btn_delete", function(item){
                ejs.ui.confirm({
                    title: '是否选择',
                    message: '确定删除？',
                    buttonLabels: ['取消', '确定'],
                    cancelable: 1,
                    h5UI: false, // 是否强制使用H5-UI效果，默认false
                    success: function (result) {
                        if (result.which == 1) {
                            var data = {
                                token: 'Epoint_WebSerivce_**##0601',
                                params: {
                                    rowguid: Zepto(item.target).attr("rowguid")
                                }
                            };
                            Util.ajax({
                                url: Config.serverUrl + 'foodopt/getfoodoptcheckdelete',
                                data: JSON.stringify(data),
                                contentType: 'application/json',
                                success: function(result) {
                                    self.PullToRefreshToolObj_inspection.instance.triggerDownLoading('noAnim');
                                },
                                error: function(error) {
                                    ejs.ui.toast(error);
                                }
                            });
                        }
                    },
                    error: function (err) {}
                });
            })
            mui('.mui-content').on('tap', "#self_check_setup", function(item){
                ejs.page.open('../intercalate/intercalate_index.html?rowguid=' + Zepto("#self_check_setup").attr("rowguid"),{});
            })
            mui('.mui-content').on('tap', "#skip_inspection", function(item){
                ejs.page.open('../intercalate/intercalate_index.html?rowguid=' + Zepto("#skip_inspection").attr("rowguid"),{});
            })
            // 上传附件
            mui('.mui-content').on('tap', "#appendix", function(item){
               Zepto("#filebtn_annexes").click();
            })
        },
        savePhoto(){
            var self = this;
            getStorage(function(result){
                Util.ajax({
                    url: Config.serverUrl + 'foodopt/updateOpeateInfo',
                    data: JSON.stringify({
                        token: 'Epoint_WebSerivce_**##0601',
                        params: {
                            //  'opearte_imgs_guid': foodoptbasicinfo.opearte_imgs_guid,
                        // 'opearte_rules_guid': foodoptbasicinfo.opearte_rules_guid,
                            pripid: self.myLoginid,
                            opearte_imgs: result.opearte_imgs_guid || self.uuid1,
                            opearte_rules: result.opearte_rules_guid ||  self.uuid2
                        }
                    }),
                    headers: {"Content-Type":"application/json"},
                    success: function(res) {
                        // self.pictureFront.attr('src',self.b64);
                        self.essential();
                        Zepto('#fileBtn').val('');
                    },
                    error: function(error) {
                        ejs.ui.toast(error);
                    }
                });
            })

        },
         // 上传请求
        uploadAttarch: function(file) {
            var self = this;
            getStorage(function(res){
                var guid = self.uuid1;
                if (res.opearte_imgs_guid != "undefined") {
                    guid = res.opearte_imgs_guid;
                }
                // var data = {
				// 	// 注：此接口参数不需要以json字符串格式传递，只需和以下参数名对应即可。
				// 	attachfilename: tmpAttachList[i].fileObj.name, // 附件名
				// 	contenttype: tmpAttachList[i].fileObj.type, // 文件类型
				// 	// 文档类型(文件后缀名，如:.png/.jpg；如此参数不传，则attachfilename必须带后缀名)
				// 	documenttype: '',
				// 	clienttag: '', // 业务tag
				// 	clientinfo: '', // 业务info
				// 	clientguid: checkresultatc, // 业务标识
				// 	attachguid: '',
				// };


                var data = {
                    // token: 'Epoint_WebSerivce_**##0601',
                    clientguid: guid,
                    attachname: file.name
                }
                var url = Util.getFullUrlByParams(Config.serverUrl + "commonInter/attachUpload", data);
                Util.upload({
                    // url: Config.serverUrl + "commonInter/attachUpload",   // 请求的地址
                    url: url,
                    // contentType: 'application/json',
                    data: data,
                    files: [{
                        name: file.name,
                        file: file
                    }],
                    beforeSend: function() {

                    },
                    success: function(response, status, xhr) {

                            ejs.ui.closeWaiting();
                            // self.savePhoto();
                            // 更新基本信息的接口
                            self.essential();

                            ejs.ui.toast("上传成功");
                            // if (self.flag === 1) {
                            //     ejs.ui.toast('上传成功！');
                            //     self.temporaryArr.push({pdf: self.b64, attachguid: response.custom.attachguid});
                            //     var frontage_box = Zepto("#frontage_box").html();
                            //     var output = Mustache.render(frontage_box, {certList: self.temporaryArr});
                            //     Zepto('#show_img').html(output);
                            // } else if(self.flag === 0) {
                            //     var attachguid = self.resubmit.parents(".frontage").attr("attachguid");
                            //     Util.ajax({
                            //         url: Config.serverUrlNewDate + 'qrcattach/delete',
                            //         data: {
                            //             attachguid: attachguid
                            //         },
                            //         headers: {"Content-Type":"application/json"},
                            //         success: function(res) {
                            //             self.pictureFront.attr('src',self.b64);
                            //             Zepto('#fileBtn').val('');
                            //         },
                            //         error: function(error) {
                            //             ejs.ui.toast(error);
                            //         }
                            //     });

                            // }
                    },
                    error: function(xhr, status, statusText) {
                        ejs.ui.closeWaiting('上传失败！');
                    },
                    uploading: function(percent, speed, status) {
                        console.log("上传中:" + percent + ',speed:' + speed + ',msg:' + status);
                        console.log(parseInt(percent));
                    }
                });
            })

        },
        uploadAnnexes: function(file) {
            var self = this;
            getStorage(function(res){
                var guid = self.uuid1;
                if (res.opearte_rules_guid != "undefined") {
                    guid = res.opearte_rules_guid;
                }
                var data = {
                    clientguid: guid,
                    attachname: file.name
                }
                var url = Util.getFullUrlByParams(Config.serverUrl + "commonInter/attachUpload", data);
                Util.upload({
                    url: url,   // 请求的地址
                    // contentType: 'application/json',
                    data: data,
                    files: [{
                        name: file.name,
                        file: file
                    }],
                    beforeSend: function() {

                    },
                    success: function(response, status, xhr) {

                            ejs.ui.closeWaiting();
                            // self.savePhoto();
                            // 更新基本信息的接口
                            self.essential();

                            ejs.ui.toast("上传成功");
                            // if (self.flag === 1) {
                            //     ejs.ui.toast('上传成功！');
                            //     self.temporaryArr.push({pdf: self.b64, attachguid: response.custom.attachguid});
                            //     var frontage_box = Zepto("#frontage_box").html();
                            //     var output = Mustache.render(frontage_box, {certList: self.temporaryArr});
                            //     Zepto('#show_img').html(output);
                            // } else if(self.flag === 0) {
                            //     var attachguid = self.resubmit.parents(".frontage").attr("attachguid");
                            //     Util.ajax({
                            //         url: Config.serverUrlNewDate + 'qrcattach/delete',
                            //         data: {
                            //             attachguid: attachguid
                            //         },
                            //         headers: {"Content-Type":"application/json"},
                            //         success: function(res) {
                            //             self.pictureFront.attr('src',self.b64);
                            //             Zepto('#fileBtn').val('');
                            //         },
                            //         error: function(error) {
                            //             ejs.ui.toast(error);
                            //         }
                            //     });

                            // }
                    },
                    error: function(xhr, status, statusText) {
                        ejs.ui.closeWaiting('上传失败！');
                    },
                    uploading: function(percent, speed, status) {
                        console.log("上传中:" + percent + ',speed:' + speed + ',msg:' + status);
                        console.log(parseInt(percent));
                    }
                });
            })

        },
        AttarchDel(attachguid) {
            var self = this;
            ejs.ui.confirm({
                title: '是否选择',
                message: '确定删除？',
                buttonLabels: ['取消', '确定'],
                cancelable: 1,
                h5UI: false, // 是否强制使用H5-UI效果，默认false
                success: function (result) {
                    if (result.which == 1) {
                        var data = {
                            token: 'Epoint_WebSerivce_**##0601',
                            params: {
                                attachguid: attachguid
                            }
                        };
                        Util.ajax({
                            url: Config.serverUrl + 'commonInter/attachDelete',
                            data: JSON.stringify(data),
                            contentType: 'application/json',
                            success: function(result) {
                                self.essential();
                            },
                            error: function(error) {
                                ejs.ui.toast(error);
                            }
                        });
                    }
                },
                error: function (err) {}
            });
        },
        // 基本信息
        essential() {
            var self = this;
            console.log('self',self);
            var data = {
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    pripid: self.myLoginid,
                }
            };
            //  基本信息
            Util.ajax({
                url: Config.serverUrl + 'foodopt/getfoodoptbasicinfo',
                data: JSON.stringify(data),
                contentType: 'application/json;charset=UTF-8',
                success: function(result) {
                //    console.log(result.custom.foodoptbasicinfo.opearte_imgs.attachUrl);
                var foodoptbasicinfo = result.custom.foodoptbasicinfo;
                if(foodoptbasicinfo){
                    ejs.storage.setItem({
                        'opearte_imgs_guid': foodoptbasicinfo.opearte_imgs_guid,
                        'opearte_rules_guid': foodoptbasicinfo.opearte_rules_guid,
                        success: function() {},
                        error: function(error) {}
                    });
                    var data1 = {
                        imgArr: foodoptbasicinfo.opearte_imgs
                    }
                    var temple1 = Zepto('#template_img').html();
                    var output = Mustache.render(temple1, data1);
                    Zepto('#photo_box').html(output);
                    // var swiper2 = new Swiper('#swiper-file', {
                    //     slidesPerView: 'auto',
                    //     spaceBetween: 10,
                    //     freeMode: true,
                    // });
                    // 管理制度
                    var data2 = {
                        opearteRules: foodoptbasicinfo.opearte_rules
                    }
                    var temple2 = Zepto('#template_institution').html();
                    var output = Mustache.render(temple2, data2);
                    Zepto('#wrapper_institution').html(output);
                    Zepto("#annexes").html(foodoptbasicinfo.opearte_rules.length)
                    // 自查频率
                    Zepto("#self_check_setup").attr("rowguid",foodoptbasicinfo.rowguid);
                    Zepto("#skip_inspection").attr("rowguid",foodoptbasicinfo.rowguid);
                    if(foodoptbasicinfo.frequency_unit && foodoptbasicinfo.check_frequency) {
                        // if(foodoptbasicinfo.frequency_unit == 3) {
                        //     Zepto("#frequency_unit").html("每年");
                        // } else if(foodoptbasicinfo.frequency_unit == 2) {
                        //     Zepto("#frequency_unit").html("每月");
                        // } else if(foodoptbasicinfo.frequency_unit == 1) {
                        //     Zepto("#frequency_unit").html("每周");
                        // }
                        Zepto("#frequency_unit").html(foodoptbasicinfo.frequency_unit);
                        Zepto("#check_frequency").html(result.custom.foodoptbasicinfo.check_frequency);
                        Zepto("#add_frequency").addClass("mui-hidden");
                        self.inspection();
                    } else {
                        Zepto("#empty_inspection").addClass("mui-hidden");
                        Zepto("#set_up").addClass("mui-hidden");
                        Zepto("#minirefresh4").addClass("mui-hidden");
                    }
                }
                },
                error: function(error) {
                    ejs.ui.toast(error);
                }
            });
        },
        // 刷新从业人员列表
        occupation() {
            var self = this;
            var template_add_html1 = document.getElementById("template_add1").innerHTML;
            var urlFunc = function() {
                var url = Config.serverUrl + 'foodopt/getfoodoptemployeeinfo';
                return url;
            };

            // 请求参数
            var dataRequestFunc = function(currPage) {
                // 其他
                var data = {
                    token: 'Epoint_WebSerivce_**##0601',
                    params: {
                        currentpage: currPage,
                        pagesize: 10,
                        pripid: self.myLoginid
                    }
                };
                return JSON.stringify(data);
            };
            // 改变数据
            var dataChangeFunc = function(response) {
                var outData = null;
                if(response.custom.code == '1') {
                    outData = response.custom.employeeList;
                    // self.employeeList = response.custom.employeeList;
                }
                return outData;
            };

            // 模板
            var templateFunc = function(value) {
                var template = null;

                return template_add_html1;
            };

            // 点击
            var itemClickFunc = function(e) {};

            self.PullToRefreshToolObj_occupation = new MiniRefreshBiz({
                // 可以主动传入theme，而不是使用默认的 MiniRefresh
                // h5下使用默认主题，native下使用native主题
                // theme: ejs.os.ejs ? MiniRefreshTools.theme.natives : MiniRefreshTools.theme.defaults,
                // theme: MiniRefreshTools.theme.defaults,
                type: 'POST',
                contentType: 'application/json',
                isDebug: false,
                container: '#minirefresh2',
                // 默认的列表数据容器选择器
                listContainer: '#listdata2',
                // 默认的请求页面,根据不同项目服务器配置而不同,正常来说应该是0
                isDebug: false,
                delay: 0,
                // initPageIndex: 1,
                isAutoRender: true,
                // 得到模板 要求是一个函数(返回字符串) 或者字符串
                template: templateFunc,
                // 得到url 要求是一个函数(返回字符串) 或者字符串
                url: urlFunc,
                dataRequest: dataRequestFunc,
                dataChange: dataChangeFunc,
                itemClick: itemClickFunc,
                setting: {
                    // up: {
                    //     // 滚动时会提供回调，默认为null不会执行
                    //     toTop: {
                    //         isEnable: false
                    //     }
                    // }
                    // down: {
                    //     successAnim: {
                    //         isEnable: true,
                    //         duration: 800
                    //     },
                    //     offset: 45,
                    // },
                },
                success: function(res) {
                    // 数据为空时！

                    var dataLength = Zepto("#listdata2 .list_msg").length;
                    if(parseInt(dataLength) > 0) {
                        // document.querySelector('.upwrap-tips').style.display = 'block';
                        // document.querySelector('.em-tips').style.display = 'none';
                        Zepto("#minirefresh2").removeClass("mui-hidden");
                        Zepto("#empty_boxes_things").addClass("mui-hidden");

                    } else {
                        // 显示空盒子
                        // document.querySelector('.upwrap-tips').style.display = 'none';
                        // document.querySelector('.em-tips').style.display = 'block';
                        Zepto("#minirefresh2").addClass("mui-hidden");
                        Zepto("#empty_boxes_things").removeClass("mui-hidden");
                    }
                }
            });
            // var data = {
            //     token: 'Epoint_WebSerivce_**##0601',
            //     params: {
            //         currentpage: 0,
            //         pagesize: 999,
            //         pripid: Config.pripid
            //     }
            // };
            // Util.ajax({
            //     url: Config.serverUrl + 'foodopt/getfoodoptemployeeinfo',
            //     data: JSON.stringify(data),
            //     contentType: 'application/json',
            //     success: function(result) {
            //        console.log(result);
            //         // 从业人员
            //         var data2 = {
            //             list: result.custom.employeeList
            //             // list: [
            //             //     {fandou: {}}
            //             // ]
            //         }
            //         var temple1 = Zepto('#template_add').html();
            //         var output = Mustache.render(temple1, data2);
            //         Zepto('#boxes_things').html(output);
            //     },
            //     error: function(error) {
            //         ejs.ui.toast(error);
            //     }
            // });
        },
        // 刷新食品安全接口
        foodSafety() {
            var self = this;
            var template_add_html1 = document.getElementById("foodstuff").innerHTML;
            var urlFunc = function() {
                var url = Config.serverUrl + 'foodopt/getfoodoptaqglyinfo';
                return url;
            };

            // 请求参数
            var dataRequestFunc = function(currPage) {
                // 其他
                var data = {
                    token: 'Epoint_WebSerivce_**##0601',
                    params: {
                        currentpage: currPage,
                        pagesize: 10,
                        pripid: self.myLoginid
                    }
                };
                return JSON.stringify(data);
            };
            // 改变数据
            var dataChangeFunc = function(response) {
                var outData = null;
                if(response.custom.code == '1') {
                    outData = response.custom.aqglyList;
                    // self.employeeList = response.custom.employeeList;
                }
                return outData;
            };

            // 模板
            var templateFunc = function(value) {
                var template = null;
                // if (type === '1') {
                //     template = document.getElementById("tmp02").innerHTML;
                // } else {
                //     template = document.getElementById("tmp01").innerHTML;
                // }
                template = template_add_html1;
                return template;
            };

            // 点击
            var itemClickFunc = function(e) {};

            self.PullToRefreshToolObj_foodSafety = new MiniRefreshBiz({
                // 可以主动传入theme，而不是使用默认的 MiniRefresh
                // h5下使用默认主题，native下使用native主题
                // theme: ejs.os.ejs ? MiniRefreshTools.theme.natives : MiniRefreshTools.theme.defaults,
                // theme: MiniRefreshTools.theme.defaults,
                type: 'POST',
                contentType: 'application/json',
                isDebug: false,
                container: '#minirefresh3',
                // 默认的列表数据容器选择器
                listContainer: '#listdata3',
                // 默认的请求页面,根据不同项目服务器配置而不同,正常来说应该是0
                isDebug: false,
                delay: 0,
                // initPageIndex: 1,
                isAutoRender: true,
                // 得到模板 要求是一个函数(返回字符串) 或者字符串
                template: templateFunc,
                // 得到url 要求是一个函数(返回字符串) 或者字符串
                url: urlFunc,
                dataRequest: dataRequestFunc,
                dataChange: dataChangeFunc,
                itemClick: itemClickFunc,
                setting: {
                    // up: {
                    //     // 滚动时会提供回调，默认为null不会执行
                    //     toTop: {
                    //         isEnable: false
                    //     }
                    // }
                    // down: {
                    //     successAnim: {
                    //         isEnable: true,
                    //         duration: 800
                    //     },
                    //     offset: 45,
                    // },
                },
                success: function(res) {

                    // 数据为空时！

                    var dataLength = Zepto("#listdata3 .list_msg").length;
                    if(parseInt(dataLength) > 0) {
                        // document.querySelector('.upwrap-tips').style.display = 'block';
                        // document.querySelector('.em-tips').style.display = 'none';
                        Zepto("#minirefresh3").removeClass("mui-hidden");
                        Zepto("#empty_food_security").addClass("mui-hidden");

                    } else {
                        // 显示空盒子
                        // document.querySelector('.upwrap-tips').style.display = 'none';
                        // document.querySelector('.em-tips').style.display = 'block';
                        Zepto("#minirefresh3").addClass("mui-hidden");
                        Zepto("#empty_food_security").removeClass("mui-hidden");
                    }
                }
            });
            // var data = {
            //     token: 'Epoint_WebSerivce_**##0601',
            //     params: {
            //         currentpage: 0,
            //         pagesize: 999,
            //         pripid: Config.pripid
            //     }
            // };
            // Util.ajax({
            //     url: Config.serverUrl + 'foodopt/getfoodoptaqglyinfo',
            //     data: JSON.stringify(data),
            //     contentType: 'application/json',
            //     success: function(result) {
            //        console.log(result);
            //         // 食品安全
            //         var data3 = {
            //             list: result.custom.aqglyList
            //             // list: [
            //             //     {
            //             //         sex: "女",
            //             //         cert_num: "419249174172",
            //             //         administrator: "杨"
            //             //     }
            //             // ]
            //         }
            //         var temple1 = Zepto('#foodstuff').html();
            //         var output = Mustache.render(temple1, data3);
            //         Zepto('#food_security').html(output);
            //     },
            //     error: function(error) {
            //             ejs.ui.toast(error);
            //     }
            // });
        },
        // 刷新自查
        inspection(){

            var self = this;
            var template_add_html1 = document.getElementById("information").innerHTML;
            var urlFunc = function() {
                var url = Config.serverUrl + 'foodopt/getfoodoptcheckinfo';
                return url;
            };

            // 请求参数
            var dataRequestFunc = function(currPage) {
                // 其他
                var data = {
                    token: 'Epoint_WebSerivce_**##0601',
                    params: {
                        currentpage: currPage,
                        pagesize: 10,
                        pripid: self.myLoginid
                        // check_date: "2021-04-15"
                    }
                };
                return JSON.stringify(data);
            };
            // 改变数据
            var dataChangeFunc = function(response) {
                var outData = null;
                if(response.custom.code == '1') {
                    outData = response.custom.checkList;
                    // self.employeeList = response.custom.employeeList;
                }
                return outData;
            };

            // 模板
            var templateFunc = function(value) {
                var template = null;
                template = template_add_html1;
                return template;
            };

            // 点击
            var itemClickFunc = function(e) {};

            self.PullToRefreshToolObj_inspection = new MiniRefreshBiz({
                // 可以主动传入theme，而不是使用默认的 MiniRefresh
                // h5下使用默认主题，native下使用native主题
                // theme: ejs.os.ejs ? MiniRefreshTools.theme.natives : MiniRefreshTools.theme.defaults,
                // theme: MiniRefreshTools.theme.defaults,
                type: 'POST',
                contentType: 'application/json',
                isDebug: false,
                container: '#minirefresh4',
                // 默认的列表数据容器选择器
                listContainer: '#inspection',
                // 默认的请求页面,根据不同项目服务器配置而不同,正常来说应该是0
                isDebug: false,
                delay: 0,
                // initPageIndex: 1,
                isAutoRender: true,
                // 得到模板 要求是一个函数(返回字符串) 或者字符串
                template: templateFunc,
                // 得到url 要求是一个函数(返回字符串) 或者字符串
                url: urlFunc,
                dataRequest: dataRequestFunc,
                dataChange: dataChangeFunc,
                itemClick: itemClickFunc,
                setting: {
                    // up: {
                    //     // 滚动时会提供回调，默认为null不会执行
                    //     toTop: {
                    //         isEnable: false
                    //     }
                    // }
                    // down: {
                    //     successAnim: {
                    //         isEnable: true,
                    //         duration: 800
                    //     },
                    //     offset: 45,
                    // },
                },
                success: function(res) {

                    // 数据为空时！

                    var dataLength = Zepto("#inspection .list_msg").length;
                    if(parseInt(dataLength) > 0) {
                        // document.querySelector('.upwrap-tips').style.display = 'block';
                        // document.querySelector('.em-tips').style.display = 'none';
                        Zepto("#minirefresh4").removeClass("mui-hidden");
                        Zepto("#empty_inspection").addClass("mui-hidden");

                    } else {
                        // 显示空盒子
                        // document.querySelector('.upwrap-tips').style.display = 'none';
                        // document.querySelector('.em-tips').style.display = 'block';
                        Zepto("#minirefresh4").addClass("mui-hidden");
                        Zepto("#empty_inspection").removeClass("mui-hidden");
                    }
                }
            });


            // var data = {
            //     token: 'Epoint_WebSerivce_**##0601',
            //     params: {
            //         currentpage: 0,
            //         pagesize: 999,
            //         pripid: Config.pripid
            //     }
            // };
            // Util.ajax({
            //     url: Config.serverUrl + 'foodopt/getfoodoptcheckinfo',
            //     data: JSON.stringify(data),
            //     contentType: 'application/json',
            //     success: function(result) {
            //        console.log(result);
            //         // 食品安全
            //         var data3 = {
            //             list: result.custom.aqglyList
            //             // list: [
            //             //     {
            //             //         sex: "女",
            //             //         cert_num: "419249174172",
            //             //         administrator: "杨"
            //             //     }
            //             // ]
            //         }
            //         var temple1 = Zepto('#foodstuff').html();
            //         var output = Mustache.render(temple1, data3);
            //         Zepto('#food_security').html(output);
            //     },
            //     error: function(error) {
            //             ejs.ui.toast(error);
            //     }
            // });
        }
    }


})(window)