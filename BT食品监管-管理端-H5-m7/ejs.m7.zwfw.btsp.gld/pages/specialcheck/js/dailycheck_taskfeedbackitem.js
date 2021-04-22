/**
 * 作者：范周静
 * 创建时间：2019-05-13 08:56:59
 * 版本：[1.0, 2019-05-13]
 * 版权：江苏国泰新点软件有限公司
 * 描述：列表
 **/

(function (d, $) {
    'use strict';

    var rowGuid = '',
        value = '', // 前一个页面的代码项
        optguid = '',
        userGuid = '';

    var checkResultValue,
        checkWayValue;

    var minirefreshObj;

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
                rowGuid = Util.getExtraDataByKey('guid');
                value = Util.getExtraDataByKey('value');
                optguid = Util.getExtraDataByKey('optguid');
                userGuid = Util.getExtraDataByKey('userguid');
                initPage()
            });
        }
    );

    // 初始化页面信息
    function initPage() {
        // 初始化事件监听
        initListeners();

        $('#checktime').text(getTime());

        // 获取已保存检查项
        getCheckItem();

        Promise.all([getCodeName('企业检查结果'), getCodeName('结果处理方式')]).then(arr => {
            console.log(arr)

            var output = Mustache.render(d.getElementById('item-template1').innerHTML, {
                list: arr[0].custom.codelist
            })
            $('#checkresult').html(output);

            var output = Mustache.render(d.getElementById('item-template1').innerHTML, {
                list: arr[1].custom.codelist
            })
            $('#checkWay').html(output)
        }).then(() => {
            // 获取已保存结果
            getSaveResult();
        })


    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        // 修改检查项
        $('#listdata').on('tap', 'li', function () {
            var checkitemguid = $(this).data('checkitemguid'),
                checkcontentguid = $(this).data('checkcontentguid'),
                checkcontent = $(this).data('checkcontent'),
                checkitem = $(this).data('checkitem');

            ejs.page.open("./dailycheck_taskfeedbackaddcheck.html", {
                guid: rowGuid,
                userguid: userGuid,
                checkitemguid: checkitemguid,
                checkcontentguid: checkcontentguid,
                checkitem: encodeURIComponent(checkitem),
                checkcontent: encodeURIComponent(checkcontent)
            });
        })

        // 检查时间选择
        $('.checkitem-time').on('tap', function () {
            ejs.ui.pickDate({
                title: '日期选择',
                datetime: getTime(),
                h5UI: false, // 是否强制使用H5-UI效果，默认false
                success: function (result) {
                    $('#checktime').text(result.date);
                },
                error: function (err) {}
            });
        })

        // 检查结果
        $('#checkresult').on('tap', 'div', function () {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');

            checkResultValue = $(this).data('value');
        })

        $('#checkWay').on('tap', 'div', function () {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');

            checkWayValue = $(this).data('value');
        })

        //保存按钮
        $('#savebtn').on('tap',function(){
            if(checkResultValue == ''){
                ejs.ui.toast('请选择检查结果')
            }else if(checkWayValue == ''){
                ejs.ui.toast('请选择处理方式')
            }else{
                submitItem()
            }
        })
    }

    /**
     * @description 获取代码项
     */
    function getCodeName(name) {
        return new Promise(function (resolve, reject) {
            Util.ajax({
                url: Config.serverUrl + 'commonInter/getCodeInfoList',
                data: JSON.stringify({
                    token: 'Epoint_WebSerivce_**##0601',
                    params: {
                        codename: name
                    }
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function (res) {
                    console.log(res);
                    if (res.status.code != 1) {
                        ejs.ui.toast('获取数据失败');
                        return;
                    }

                    resolve(res);

                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    }

    // 获取已保存结果
    function getSaveResult() {
        Util.ajax({
            url: Config.serverUrl + 'task/getSaveCheckResult',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dutyguid: rowGuid,
                    optguid: optguid,
                    checktable: value
                }
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                console.log(res);
                if (res.status.code != 200) {
                    ejs.ui.toast('获取数据失败');
                    return;
                }

                if (res.custom.code != 0) {

                    $('#checktime').text(res.custom.checktime);

                    checkResultValue = res.custom.checkresult;
                    checkWayValue = res.custom.dealway;

                    // 渲染检查结果和处理方式
                    $('#checkresult').find('div').each(function (key, value) {
                        if ($(this).data('value') == res.custom.checkresult) {
                            $(this).addClass('active');
                        }
                    })

                    $('#checkWay').find('div').each(function (key, value) {
                        if ($(this).data('value') == res.custom.dealway) {
                            $(this).addClass('active');
                        }
                    })
                }


            },
            error: function (err) {
                ejs.ui.toast(err);
            }
        });
    }

    /**
     * 下拉刷新
     * @param {String} url 接口地址
     */
    function getCheckItem() {
        minirefreshObj = new MiniRefreshBiz({
            url: Config.serverUrl + 'task/getSelectedCheckItemList',
            listContainer: '#listdata',
            contentType: 'application/json;charset=UTF-8',
            // contentType: 'application/x-www-form-urlencoded',
            dataRequest: function (currPage) {
                var requestData = JSON.stringify({
                    token: 'Epoint_WebSerivce_**##0601',
                    params: {
                        checktable: value,
                        dutyguid: rowGuid,
                        currentpageindex: currPage.toString(),
                        pagesize: '10'
                    }
                });

                // console.log(requestData);

                return requestData;
            },
            dataChange: function (res) {

                return res.custom.taskinfolist;
            },
            success: function (res) {
                // 数据为空时！
                // var dataLength = document.getElementById("listdata").querySelectorAll("li").length;
                // if (parseInt(dataLength) > 0) {
                //     document.querySelector('.upwrap-tips').style.display = "block";
                //     document.querySelector('.em-tips').style.display = "none";
                // } else {
                //     //显示空盒子
                //     document.querySelector('.upwrap-tips').style.display = "none";
                //     document.querySelector('.em-tips').style.display = "block";
                // }
            },
            itemClick: function (e) {

            },
            error: function (err) {
                ejs.ui.toast(JSON.stringify(err));
            }
        });
    }

    function submitItem(){
        Util.ajax({
            url: Config.serverUrl + 'task/saveCheckResult',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    dutyguid: rowGuid,
                    optguid: optguid,
                    checktable: value,
                    checkresult: checkResultValue,
                    dealway: checkWayValue,
                    operator: userGuid,
                    checktime: $('#checktime').text(),
                    bz: ''
                }
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                console.log(res);
                if (res.status.code != 200) {
                    ejs.ui.toast('获取数据失败');
                    return;
                }

                if (res.custom.code != 0) {
                    ejs.ui.toast('保存成功');

                    ejs.page.close();
                }


            },
            error: function (err) {
                ejs.ui.toast(err);
            }
        });
    }

    function getTime() {
        var date = new Date();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var currentdate = '';
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }

        var currentdate = date.getFullYear() + '-' + month + '-' + strDate;
        return currentdate;
    }

})(document, Zepto);