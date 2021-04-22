/*
 * @作者: 杨宗标
 * @创建时间: 2021-04-07 15:02:39
 * @修改时间: 2021-04-20 18:54:58
 * @版本: [1.0]
 * @版权: 国泰新点软件股份有限公司
 * @描述:
 */



(function(){

    "use strict";

    var calendar;
    var self = {};
    Util.loadJs([
            'pages/common/common.js',
            // 下拉刷新
            'js/widgets/minirefresh/minirefresh.css',
            'js/widgets/minirefresh/minirefresh.js',
            'js/widgets/calendar/calendar.js',
            'js/widgets/calendar/calendar.css',
        ],
        'js/widgets/minirefresh/minirefresh.bizlogic.js',
        function () {
            common.commGetUserInfo(function (res) {
                self.myLoginid = res.loginid;
                // 用来记录全部变量
                // 用来记录当前页
                self.currPage = 0;
                self.is_deal = 0;
                self.warning_level = 1;
                self.template1 = document.getElementById("template1").innerHTML;
                // 控制搜索框
                self.setRightBtnFlag = 1;
                initListeners();
                initPage();
            })

        });

    function initPage() {
        // var data = {
        //     token: 'Epoint_WebSerivce_**##0601',
        //     params: {
        //         currentpage: 0,
        //         pagesize: 999,
        //         is_deal: 0
        //     }
        // };
        // Util.ajax({
        //     url: Config.serverUrl + 'tyzfxxfb/warning/getWaitHandleList',
        //     data: JSON.stringify(data),
        //     contentType: 'application/json',
        //     success: function(result) {
        //        console.log(result);
        //         // 食品安全
        //         var data3 = {
        //             // list: result.custom.aqglyList
        //             list: [
        //                 {
        //                     sex: "女",
        //                     cert_num: "419249174172",
        //                     administrator: "杨"
        //                 }
        //             ]
        //         }
        //         var temple1 = Zepto('#foodstuff').html();
        //         var output = Mustache.render(temple1, data3);
        //         Zepto('#food_security').html(output);
        //     },
        //     error: function(error) {
        //             ejs.ui.toast(error);
        //     }
        // });
        // var data3 = {
        //     list: [
        //         {gou: ""},
        //         {gou: ""},
        //         {gou: ""},
        //         {gou: ""},
        //         {gou: ""},
        //         {gou: ""},
        //         {gou: ""},
        //         {gou: ""},
        //         {gou: ""},
        //         {gou: ""},
        //         {gou: ""},
        //         {gou: ""},
        //     ]
        // }
        // var temple1 = Zepto('#template1').html();
        // var output = Mustache.render(temple1, data3);
        // Zepto('#listdata1').html(output);
    }

    /**
     * @description 初始化监听
     */
    function initListeners() {
        ejs.navigator.setMultiTitle({
            titles: ['待办', '已办'],
            success: function(result) {
                console.log(result.which);
                if(result.which == 0){
                    self.is_deal = 0;
                    self.PullToRefreshToolObj.instance.triggerDownLoading('noAnim');
                }
                else if(result.which == 1) {
                    self.is_deal = 1;
                    self.PullToRefreshToolObj.instance.triggerDownLoading('noAnim');
                }
                /**
                 * 每一次点击tab都会触发
                 * {
                        which: 0
                   }
                 */
            },
            error: function(error) {}
        });

        ejs.navigator.setRightBtn({
            isShow: 1,
            // 设置图片的优先级会较高
            imageUrl: './image/wait.png',
            which: 0, // 每一个按钮的回调是独立返回
            success: function(result) {
                console.log(self.setRightBtnFlag);
                if(self.setRightBtnFlag == 1) {
                    ejs.navigator.showSearchBar({
                        success: function(result) {


                            self.title = result.keyword;
                            self.PullToRefreshToolObj.instance.triggerDownLoading('noAnim');

                            /**
                             * 每一次触发搜索栏的搜索功能都会回调
                             * {
                                    keyword: 'ss' // 搜索的值
                               }
                             */
                        },
                        error: function(error) {}
                    });
                    self.setRightBtnFlag = 0;
                } else if(self.setRightBtnFlag == 0) {
                    ejs.navigator.hideSearchBar({
                        success: function(result) {

                        },
                        error: function(error) {}
                    });
                    self.setRightBtnFlag = 1;
                }

                /**
                 * 按钮点击后回调，result回调不需要判断result.which返回值
                 */
            },
            error: function(error) {}
        });


        initPullRefreshList();
        // 即将超期
        mui('.page_bg').on('tap', "#gonna", function(){
            self.warning_level = 0;
            self.PullToRefreshToolObj.instance.triggerDownLoading('noAnim');
        })
        // 已经超期
        mui('.page_bg').on('tap', "#already", function(){
            self.warning_level = 1;
            self.PullToRefreshToolObj.instance.triggerDownLoading('noAnim');
        })
        // 列表详情
        mui('.page_bg').on('tap', '.exceed_list', function(){
           ejs.page.open("./wait_details.html",{warningguid: Zepto(this).attr("warningguid")});
        })
    }
    /**
     * 下拉刷新
     */
    function initPullRefreshList() {

        var urlFunc = function() {
            var url = Config.serverUrl + 'tyzfxxfb/warning/getWaitHandleList';
            return url;
        };

        // 请求参数
        var dataRequestFunc = function(currPage) {
            // 其他
            var data = {
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    title: self.title,
                    currentpage: currPage,
                    pagesize: 10,
                    is_deal: self.is_deal,
                    warning_level: self.warning_level,
                    loginid: self.myLoginid
                }
            };
            return JSON.stringify(data);
        };
        // 改变数据
        var dataChangeFunc = function(response) {
            var outData = null;
            if(response.custom.code == '1') {
                outData = response.custom.waithandlelist;
                if(self.warning_level == 0) {
                    outData.forEach(function(ele, idx){
                        outData[idx].gou = true;
                    })
                } else if(self.warning_level == 1){
                    outData.forEach(function(ele, idx){
                        outData[idx].gou = false;
                    })
                }

            }

            return outData;
        };

        // 模板
        var templateFunc = function(value) {
            // var template = null;

            // if (type === '1') {
            //     template = document.getElementById("tmp02").innerHTML;
            // } else {
            //     template = document.getElementById("tmp01").innerHTML;
            // }

            return self.template1;
        };

        // 点击
        var itemClickFunc = function(e) {};

        self.PullToRefreshToolObj = new MiniRefreshBiz({
            // 可以主动传入theme，而不是使用默认的 MiniRefresh
            // h5下使用默认主题，native下使用native主题
            // theme: ejs.os.ejs ? MiniRefreshTools.theme.natives : MiniRefreshTools.theme.defaults,
            // theme: MiniRefreshTools.theme.defaults,
            type: 'POST',
            contentType: 'application/json',
            isDebug: false,
            container: '#minirefresh1',
            // 默认的列表数据容器选择器
            listContainer: '#listdata1',
            // 默认的请求页面,根据不同项目服务器配置而不同,正常来说应该是0
            isDebug: false,
            delay: 0,
            initPageIndex: 0,
            // isAutoRender: true,
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
            success: function() {
                console.log("请求成功");

                // 数据为空时！

                // var dataLength = document.getElementById('listdata').querySelectorAll('.list-item').length;

                // var dataLength = Zepto("#listdata .list-item").length;

                // if(parseInt(dataLength) > 0) {
                //     document.querySelector('.upwrap-tips').style.display = 'block';
                //     document.querySelector('.em-tips').style.display = 'none';
                // } else {
                //     // 显示空盒子
                //     document.querySelector('.upwrap-tips').style.display = 'none';
                //     document.querySelector('.em-tips').style.display = 'block';
                // }
            }
        });
    }
})(window)