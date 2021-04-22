/*
 * @作者: 杨宗标
 * @创建时间: 2021-04-15 15:18:36
 * @修改时间: 2021-04-21 10:51:45
 * @版本: [1.0]
 * @版权: 国泰新点软件股份有限公司
 * @描述:
 */




(function(){

    "use strict";

    var calendar;
    var self = {};
    Util.loadJs([
            // 下拉刷新
            'js/widgets/minirefresh/minirefresh.css',
            'js/widgets/minirefresh/minirefresh.js',
            'js/widgets/calendar/calendar.js',
            'js/widgets/calendar/calendar.css',
        ],
        'js/widgets/minirefresh/minirefresh.bizlogic.js',
        function () {

            // 用来记录全部变量
            // 用来记录当前页
            self.currPage = 0;
            self.is_deal = 0;
            self.warning_level = 1;
            self.template1 = document.getElementById("template1").innerHTML;
            initListeners();
            initPage();
        });

    function initPage() {
        mui(".page_bg").on("tap","#exceed_list",function(){
            ejs.page.open("./news_detail.html",{rowguid: Zepto(this).attr("rowguid")});
        })
    }

    /**
     * @description 初始化监听
     */
    function initListeners() {


        initPullRefreshList();

    }

    function transferDate(date) {
        // 年
        var year = date.getFullYear();
        // 月
        var month = date.getMonth() + 1;
        // 日
        var day = date.getDate();

        if(month >= 1 && month <= 9) {

            month = "0" + month;
        }
        if(day >= 0 && day <= 9) {

            day = "0" + day;
        }

        var dateString = year + '-' + month + '-' + day;
        return dateString;

    };
    /**
     * 下拉刷新
     */
    function initPullRefreshList() {

        var urlFunc = function() {
            var url = Config.serverUrl + 'tyzfxxfb/getTyzfxxfListBySslf';
            return url;
        };

        // 请求参数
        var dataRequestFunc = function(currPage) {
            // 其他
            var data = {
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    sslf: 2,
                    pagesize: 10,
                    currentpage: currPage,
                    infotype: '02'
                }
            };
            return JSON.stringify(data);
        };
        // 改变数据
        var dataChangeFunc = function(response) {
            var outData = null;
            if(response.custom.code == '1') {
                outData = response.custom.tyzfxxfblist;
                if(outData instanceof Array && outData.length>0) {
                    outData.forEach((ele,idx)=>{
                        outData[idx].pubdate = transferDate(new Date(ele.pubdate));
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
        var itemClickFunc = function(e) {

        };

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
                var dataLength = Zepto("#listdata1 .list-item").length;

                if(parseInt(dataLength) > 0) {
                    document.querySelector('#minirefresh1').style.display = 'block';
                    document.querySelector('.em-tips1').style.display = 'none';
                } else {
                    // 显示空盒子
                    document.querySelector('#minirefresh1').style.display = 'none';
                    document.querySelector('.em-tips1').style.display = 'block';
                }
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