/**
 * 作者： 张金锁
 * 创建时间： 2021/04/06 14:57:36
 * 版本： [1.0]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：食品留样
 */
(function (doc, Util) {
    'use strict';
    var remainDate = Util.getExtraDataByKey('date') || '2021-02-21';
    var pripid = '';

    //如果是新增食品留样，附件地址是随机数
    var uuid = Util.uuid();

    //1：新增 0：修改
    var isAdd = 1;

    //留样图片
    var attacharray = [];

    Util.loadJs(['pages/common/common.js', 'js/utils/util.charset.js'], function () {
        initPage();
    });

    /*
     * @description 获取pripid
     */
    function initPage() {
        common.commGetUserInfo(function (res) {
            console.log('🚀 ~ file: news_index.js ~ line 30 ~ res', res);
            pripid = res.loginid;
            initListeners();
            getData();
        });
    }

    /*
     * @description 点击事件
     */
    function initListeners() {
        $('body')
            //点击进入详情
            .on('tap', '.em-li', function () {
                var title = $(this).find('.breakfast_title').text();
                var length = $(this).find('.breakfast_detailed_list').children('li').length;
                if (length <= 0) {
                    //新增
                    isAdd = 1;
                } else {
                    //修改
                    isAdd = 0;
                }
                var time = $(this).find('.em-time').text();
                var handler = $(this).find('.em-handler').text();
                var rowguid = $(this).attr('remainguid');
                var remain_img = $(this).attr('remain_img');
                ejs.page.open('./samples_detail.html', {
                    title: Util.charset.base64.encode(title),
                    uuid: uuid,
                    isAdd: isAdd,
                    time: time,
                    handler: Util.charset.base64.encode(handler),
                    rowguid: rowguid,
                    pripid: pripid,
                    remain_img: remain_img,
                    remainDate: remainDate
                });
            });
    }

    /*
     * @description 获取数据
     */
    function getData() {
        var remiantime = remainDate + ' 00:00:00';
        Util.ajax({
            url: Config.serverUrl + 'foodopt/getfoodoptremaininfo',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    pripid: pripid,
                    remainDate: remiantime
                }
            }),
            headers: { 'Content-Type': 'application/json' },
            success: function (result) {
                if (result.custom.code == 1) {
                    var tmpInfo = result.custom,
                        template = document.getElementById('template').innerHTML,
                        html = '';
                    var tmp = tmpInfo.foodoptremaininfo[0].remain_img_attach;
                    $.each(tmp, function (index, item) {
                        attacharray.push({
                            attachUrl: item.attachUrl,
                            attachName: item.attachName,
                            attachguid: item.attachguid
                        });
                    });
                    console.log(tmpInfo.foodoptremaininfo);
                    ejs.storage.setItem({
                        key: JSON.stringify(tmpInfo.foodoptremaininfo),
                        success: function (result) {},
                        error: function (error) {}
                    });
                    html = Mustache.render(template, tmpInfo);
                    document.getElementById('content').innerHTML = html;
                    var array = document.querySelectorAll('.em-ul li');
                    $.each(array, function (indexInArray, valueOfElement) {
                        var remainguid = $(valueOfElement).attr('remainguid');
                        getListData(remainguid, remainguid);
                    });
                    var x = 0,
                        y = 0,
                        z = 0;
                    if (array.length < 3) {
                        for (let index = 0; index < 3; index++) {
                            var atext = Zepto(array[index]).find('.breakfast_title').text();
                            if (atext == '早餐') {
                                x = 1;
                            } else if (atext == '午餐') {
                                y = 1;
                            } else if (atext == '晚餐') {
                                z = 1;
                            }
                        }
                        if (x == 0) {
                            $('.em-breakfast').removeClass('hidden');
                        }
                        if (y == 0) {
                            $('.em-lunch').removeClass('hidden');
                        }
                        if (z == 0) {
                            $('.em-dinner').removeClass('hidden');
                        }
                    }
                } else {
                    ejs.ui.toast(result.custom.text);
                }
            },
            error: function (error) {
                console.log('返回结果：' + JSON.stringify(error));
            }
        });
    }

    /*
     * @description 获取食品留样内容
     */
    function getListData(remainguid, key) {
        Util.ajax({
            url: Config.serverUrl + 'foodopt/getfoodoptremainfoodinfo',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    remainguid: remainguid
                }
            }),
            headers: { 'Content-Type': 'application/json' },
            success: function (result) {
                if (result.custom.code == 1) {
                    var tmpInfo = result.custom.foodoptremainfoodinfo,
                        template = document.getElementById('template-food').innerHTML,
                        html = '';
                    if (tmpInfo && Array.isArray(tmpInfo) && tmpInfo.length > 0) {
                        $.each(tmpInfo, function (index, item) {
                            html += Mustache.render(template, item);
                        });
                    } else {
                        ejs.ui.toast('数据不存在或返回数据的格式错误！');
                    }
                    document.getElementById('listdata-food' + key).innerHTML = html;
                } else {
                    ejs.ui.toast(result.custom.text);
                }
            },
            error: function (error) {
                console.log('返回结果：' + JSON.stringify(error));
            }
        });
    }
})(document, window.Util);
