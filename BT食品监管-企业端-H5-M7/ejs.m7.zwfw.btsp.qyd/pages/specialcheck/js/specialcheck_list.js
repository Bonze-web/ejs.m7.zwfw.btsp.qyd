/**
 * 作者：范周静
 * 创建时间：2019-05-13 08:56:59
 * 版本：[1.0, 2019-05-13]
 * 版权：江苏国泰新点软件有限公司
 * 描述：列表
 **/

(function (d, $) {
    'use strict';

    var status = '95',
        minirefreshObj = null; // 下拉刷新实例

    Util.loadJs(
        // 下拉刷新
        'js/widgets/minirefresh/minirefresh.css',
        'js/widgets/minirefresh/minirefresh.js',
        'js/widgets/minirefresh/minirefresh.bizlogic.js',
        function () {
            ejs.config({
                jsApiList: []
            });

            ejs.ready(function () {
                initPage()
            });
        }
    );

    // 初始化页面信息
    function initPage() {
        // 初始化事件监听
        initListeners();
        // 下拉刷新
        pullToRefresh();
    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('#dailytab').on('tap', 'div', function () {
            $(this).siblings().removeClass('active');

            $(this).addClass('active');
            status = $(this).data('status');

            minirefreshObj.refresh();
        })
    }

    /**
     * 下拉刷新
     * @param {String} url 接口地址
     */
    function pullToRefresh() {
        minirefreshObj = new MiniRefreshBiz({
            url: Config.serverUrl + 'btjgxx/getObjCheckInfoList',
            template: function () {
                var template = '';

                if (status == '95') {
                    template = d.getElementById('item-template').innerHTML;
                } else if (status == '50') {
                    template = d.getElementById('item-template2').innerHTML;
                } else {
                    template = d.getElementById('item-template2').innerHTML;
                }

                return template;
            },
            listContainer: '#listdata',
            contentType: 'application/json;charset=UTF-8',
            // contentType: 'application/x-www-form-urlencoded',
            dataRequest: function (currPage) {
                var requestData = JSON.stringify({
                    token: 'Epoint_WebSerivce_**##0601',
                    params: {
                        optguid: 'c631311e-7a86-465f-9a2f-60de6f9c7c5b',
                        checkform: '02',
                        status: status,
                        checkactionname: '',
                        pageIndex: currPage.toString(),
                        pageSize: '10'
                    }
                });

                // console.log(requestData);

                return requestData;
            },
            dataChange: function (res) {
                console.log(JSON.stringify(res), res);

                $('#waittotal').text('(' + res.custom.dzgcount + ')');
                $('#waitchecktotal').text('(' + res.custom.dshcount + ')');
                $('#overtotal').text('(' + res.custom.ybjcount + ')');

                if (status == '95') {

                    // 需要处理下时间以及状态
                    res.custom.checklist.forEach(item => {
                        var restTime = dateCompare(item.checkendtime);

                        if (restTime < 0) {
                            item.timestatus = 'overtime';
                            item.timestatustext = '已超期' + restTime + '天';
                        } else if (restTime >= 0 && restTime < 3) {
                            item.timestatus = 'resttime';
                            item.timestatustext = '剩余' + restTime + '天';
                        } else {
                            item.timestatus = 'lesttime';
                            item.timestatustext = '';
                        }
                    })
                } 

                return res.custom.checklist;
            },
            success: function (res) {
                // 数据为空时！
                var dataLength = document.getElementById("listdata").querySelectorAll("li").length;
                if (parseInt(dataLength) > 0) {
                    document.querySelector('.upwrap-tips').style.display = "block";
                    document.querySelector('.em-tips').style.display = "none";
                } else {
                    //显示空盒子
                    document.querySelector('.upwrap-tips').style.display = "none";
                    document.querySelector('.em-tips').style.display = "block";
                }
            },
            itemClick: function (e) {

            },
            error: function (err) {
                ejs.ui.toast(JSON.stringify(err));
            }
        });
    }

    function dateCompare(date) {
        let startTime = new Date(); // 开始时间
        let endTime = new Date(date); // 结束时间
        let usedTime = endTime - startTime; // 相差的毫秒数
        let days = Math.floor(usedTime / (24 * 3600 * 1000)); // 计算出天数
        // let leavel = usedTime % (24 * 3600 * 1000); // 计算天数后剩余的时间
        // let hours = Math.floor(leavel / (3600 * 1000)); // 计算剩余的小时数
        // let leavel2 = leavel % (3600 * 1000); // 计算剩余小时后剩余的毫秒数
        // let minutes = Math.floor(leavel2 / (60 * 1000)); // 计算剩余的分钟数
        //return days + '天' + hours + '时' + minutes + '分';

        return days;
    }
})(document, Zepto);