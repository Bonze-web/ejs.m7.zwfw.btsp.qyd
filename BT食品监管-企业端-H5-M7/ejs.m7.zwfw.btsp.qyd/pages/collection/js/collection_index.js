/*
 * @作者: 杨宗标
 * @创建时间: 2021-04-01 14:17:51
 * @修改时间: 2021-04-20 18:27:03
 * @版本: [1.0]
 * @版权: 国泰新点软件股份有限公司
 * @描述:
 */


(function() {
    "use strict";

    Util.loadJs([
        'pages/common/common.js',
        // 下拉刷新
		'js/widgets/minirefresh/minirefresh.css',
		'js/widgets/minirefresh/minirefresh.js',
    ],
    'js/widgets/minirefresh/minirefresh.bizlogic.js',
    function() {
        customBiz.configReady();
    });

    var customBiz = {
        configReady: function() {
            var self = this;
            common.commGetUserInfo(function (res) {
                self.myLoginid = res.loginid;
                self.currPage = 0;
                var jsApiList = [{

                }];
                self.initListeners();
                self.eventAdd();
                self.initPullRefreshList();
                self.initPullRefreshList_news();
                self.initPullRefreshList_regulations();
                self.initPullRefreshList_download();
            })

        },
        initListeners: function() {
            var self = this;
            // //  基本信息
            // var data1 = {
            //     imgArr: [
            //         {srcUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=153960715,2502274764&fm=26&gp=0.jpg'}
            //     ]
            // }
            // var temple1 = Zepto('#template_img').html();
            // var output = Mustache.render(temple1, data1);
            // Zepto('.photo_box').html(output);



            // 注册收藏页面点击事件
            mui(".mui-content").on("tap","#listdata1 li",function() {
                ejs.page.open(Zepto(this).attr("collectionurl"),{});
            });
            // 点击取消收藏页面-- 通知公告
            mui(".mui-content").on("tap",".collection",function(item) {
                var that = this;

                var data = {
                    token: 'Epoint_WebSerivce_**##0601',
                    params: {
                        collectionguid: Zepto(this).attr("collectionguid")
                    }
                };
                Util.ajax({
                    url: Config.serverUrl + 'btjgxx/deleteCollection',
                    data: JSON.stringify(data),
                    contentType: 'application/json;charset=UTF-8',
                    success: function(result) {
                        if(result.custom.code == '1') {
                            // self.initPullRefreshList();
                            // console.log(Zepto(item.target).parents("#minirefresh4"));
                            console.log(Zepto(item.target).parents("#minirefresh1"));
                            if(Zepto(item.target).parents("#minirefresh1").length>0) {
                                self.PullToRefreshToolObj_collect.instance.triggerDownLoading('noAnim');
                            } else if(Zepto(item.target).parents("#minirefresh2").length>0) {
                                self.PullToRefreshToolObj_collect.instance.triggerDownLoading('noAnim');
                            } else if(Zepto(item.target).parents("#minirefresh3").length>0) {
                                self.PullToRefreshToolObj_collect.instance.triggerDownLoading('noAnim');
                            } else if(Zepto(item.target).parents("#minirefresh4").length>0) {
                                self.PullToRefreshToolObj_collect.instance.triggerDownLoading('noAnim');
                            }
                            ejs.ui.toast(result.custom.text);
                        } else {
                            ejs.ui.toast(result.status.text);
                        }
                    },
                    error: function(error) {
                        ejs.ui.toast(error);
                    }
                });
            })
        },
        eventAdd() {
            var self = this;
            var swiper1 = new Swiper('#swiper-photo', {
                slidesPerView: 'auto',
                // 这个地方如果不设置为自动,就会显示不全
                spaceBetween: 30,
                // freeMode: true,
                on:{
                    slideChange: function(){
                        Zepto(".em-tabview-head .em-tabview-title").eq(this.activeIndex).addClass("cur").siblings().removeClass("cur");
                        console.log(this.activeIndex);
                        Zepto(".em-tips").css("display","none");
                        if(this.activeIndex == 0) {
                            self.PullToRefreshToolObj_collect.instance.triggerDownLoading('noAnim');
                        } else if(this.activeIndex == 1) {
                            self.PullToRefreshToolObj_news.instance.triggerDownLoading('noAnim');
                        } else if(this.activeIndex == 2) {
                            self.PullToRefreshToolObj_regulations.instance.triggerDownLoading('noAnim');
                        } else if(this.activeIndex == 3) {
                            self.PullToRefreshToolObj_download.instance.triggerDownLoading('noAnim');
                        }
                    //   alert('改变了，activeIndex为'+this.activeIndex);
                    },
                },
            });
            mui(".em-tabview-head").on("tap",".em-tabview-title",function(){
                swiper1.slideTo(Zepto(this).index());
                Zepto(this).addClass("cur").siblings().removeClass("cur");
            })
        },
        /**
         *  通知公告下拉刷新
         */
        initPullRefreshList() {
            var self = this;
            var urlFunc = function() {
                var url = Config.serverUrl + 'btjgxx/getCollectionList';
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
                        clienttype: '01',
                        loginid: self.myLoginid
                    }
                };
                return JSON.stringify(data);
            };
            // 改变数据
            var dataChangeFunc = function(response) {
                var outData = null;
                // console.log(response.custom.collectionList);
                if(response.custom.code == '1') {
                    outData = response.custom.collectionList;
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

                return document.getElementById("template1").innerHTML;
            };

            // 点击
            var itemClickFunc = function(e) {};

            self.PullToRefreshToolObj_collect = new MiniRefreshBiz({
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
                success: function() {
                    console.log("请求成功");

                    // 数据为空时！


                    var dataLength = Zepto("#listdata1 .list-item").length;

                    if(parseInt(dataLength) > 0) {
                        document.querySelector('#minirefresh1').style.display = 'block';
                        document.querySelector('.em-tips1').style.display = 'none';
                    } else {
                        // 显示空盒子
                        document.querySelector('#minirefresh1').style.display = 'none';
                        document.querySelector('.em-tips1').style.display = 'block';
                    }
                }
            });
        },

        // 新闻资讯下拉刷新
        initPullRefreshList_news() {
            var self = this;
            var urlFunc = function() {
                var url = Config.serverUrl + 'btjgxx/getCollectionList';
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
                        clienttype: '02',
                        loginid: self.myLoginid
                    }
                };
                return JSON.stringify(data);
            };
            // 改变数据
            var dataChangeFunc = function(response) {
                var outData = null;
                // console.log(response.custom.collectionList);
                if(response.custom.code == '1') {
                    outData = response.custom.collectionList;
                }

                return outData;
            };

            // 模板
            var templateFunc = function(value) {
                return document.getElementById("template2").innerHTML;
            };

            // 点击
            var itemClickFunc = function(e) {};

            self.PullToRefreshToolObj_news = new MiniRefreshBiz({
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
                success: function() {
                    console.log("请求成功");

                    // 数据为空时！

                    // var dataLength = document.getElementById('listdata').querySelectorAll('.list-item').length;

                    var dataLength = Zepto("#listdata2 .list-item").length;

                    if(parseInt(dataLength) > 0) {
                        document.querySelector('#minirefresh2').style.display = 'block';
                        document.querySelector('.em-tips1').style.display = 'none';
                    } else {
                        // 显示空盒子
                        document.querySelector('#minirefresh2').style.display = 'none';
                        document.querySelector('.em-tips1').style.display = 'block';
                    }
                }
            });
        },

        // 政策法规
        initPullRefreshList_regulations() {
            var self = this;
            var urlFunc = function() {
                var url = Config.serverUrl + 'btjgxx/getCollectionList';
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
                        clienttype: '03',
                        loginid: self.myLoginid
                    }
                };
                return JSON.stringify(data);
            };
            // 改变数据
            var dataChangeFunc = function(response) {
                var outData = null;
                // console.log(response.custom.collectionList);
                if(response.custom.code == '1') {
                    outData = response.custom.collectionList;
                }

                return outData;
            };

            // 模板
            var templateFunc = function(value) {
                return document.getElementById("template3").innerHTML;
            };

            // 点击
            var itemClickFunc = function(e) {};

            self.PullToRefreshToolObj_regulations = new MiniRefreshBiz({
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
                success: function() {
                    console.log("请求成功");

                    // 数据为空时！

                    var dataLength = Zepto("#listdata3 .list-item").length;

                    if(parseInt(dataLength) > 0) {
                        document.querySelector('#minirefresh3').style.display = 'block';
                        document.querySelector('.em-tips1').style.display = 'none';
                    } else {
                        // 显示空盒子
                        document.querySelector('#minirefresh2').style.display = 'none';
                        document.querySelector('.em-tips1').style.display = 'block';
                    }
                }
            });
        },
        // 资料下载
        initPullRefreshList_download() {
            var self = this;
            var urlFunc = function() {
                var url = Config.serverUrl + 'btjgxx/getCollectionList';
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
                        clienttype: '04',
                        loginid: self.myLoginid
                    }
                };
                return JSON.stringify(data);
            };
            // 改变数据
            var dataChangeFunc = function(response) {
                var outData = null;
                // console.log(response.custom.collectionList);
                if(response.custom.code == '1') {
                    outData = response.custom.collectionList;
                }

                return outData;
            };

            // 模板
            var templateFunc = function(value) {
                return document.getElementById("template4").innerHTML;
            };

            // 点击
            var itemClickFunc = function(e) {};

            self.PullToRefreshToolObj_download = new MiniRefreshBiz({
                // 可以主动传入theme，而不是使用默认的 MiniRefresh
                // h5下使用默认主题，native下使用native主题
                // theme: ejs.os.ejs ? MiniRefreshTools.theme.natives : MiniRefreshTools.theme.defaults,
                // theme: MiniRefreshTools.theme.defaults,
                type: 'POST',
                contentType: 'application/json',
                isDebug: false,
                container: '#minirefresh4',
                // 默认的列表数据容器选择器
                listContainer: '#listdata4',
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
                success: function() {
                    // var dataLength = Zepto("#listdata4 .list-item").length;
                    // console.log(dataLength);
                    // if(parseInt(dataLength) > 0) {
                    //     document.querySelector('.upwrap-tips').style.display = 'block';
                    //     document.querySelector('.em-tips4').style.display = 'none';
                    // } else {
                    //     // 显示空盒子
                    //     document.querySelector('.upwrap-tips').style.display = 'none';
                    //     document.querySelector('.em-tips4').style.display = 'block';
                    // }
                    var dataLength = Zepto("#listdata4 .list-item").length;

                    if(parseInt(dataLength) > 0) {
                        document.querySelector('#minirefresh4').style.display = 'block';
                        document.querySelector('.em-tips1').style.display = 'none';
                    } else {
                        // 显示空盒子
                        document.querySelector('#minirefresh4').style.display = 'none';
                        document.querySelector('.em-tips1').style.display = 'block';
                    }
                }
            });
        }
    }


})(window)