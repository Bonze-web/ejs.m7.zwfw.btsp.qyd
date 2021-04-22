/**
 * 作者： 张金锁
 * 创建时间： 2021/04/09 13:41:36
 * 版本： [1.0]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：编辑留样
 */
(function (doc, Util) {
    'use strict';
    var title = Util.getExtraDataByKey('title') || '';
    var pripid = Util.getExtraDataByKey('pripid') || '';
    var isAdd = Util.getExtraDataByKey('isAdd') || ''; //1：新增  0：修改
    var time = Util.getExtraDataByKey('time') || '';
    var updateHandler = Util.getExtraDataByKey('handler') || '';
    var rowguid = Util.getExtraDataByKey('rowguid') || '';
    var remain_img = Util.getExtraDataByKey('remain_img') || ''; //留样图片(附件地址)
    var remainDate = Util.getExtraDataByKey('remainDate') || ''; //获取日期

    var mealtimes = ''; //餐次
    var handler = ''; //留样人
    var remain_date = ''; //留样时间
    var foodList = []; //菜名、留样数量的列表

    var addUuid = Util.uuid();

    var imgguid = '';

    Util.loadJs(
        ['js/widgets/fileinput/fileinput.js', 'js/utils/util.charset.js', 'js/utils/util.string.js'],
        function () {
            initPage();
        }
    );

    /*
     * @description 初始化页面
     */
    function initPage() {
        ejs.navigator.setTitle(Util.charset.base64.decode(title));
        title = Util.charset.base64.decode(title);
        if (isAdd == 0) {
            //修改食品留样
            $('.em-time').text(time);
            $('.em-time').addClass('em-time-chosen');
            // $('.em-handlername').val(Util.charset.base64.decode(updateHandler));
            $('.em-handlername').val(updateHandler);
            // console.log(Util.charset.base64.decode(updateHandler));
            getFlavaData();
            fileUpload(remain_img);
        } else {
            //新增食品留样
            fileUpload(addUuid);
        }
        initListeners();
        getImg();
    }

    /*
     * @description 点击事件
     */
    function initListeners() {
        $('body')
            //选择留样时间
            .on('tap', '.em-choosetime', function () {
                var nowTime = getNowTime();
                ejs.ui.pickTime({
                    title: 'pickTime',
                    datetime: nowTime,
                    h5UI: false, // 是否强制使用H5-UI效果，默认false
                    success: function (result) {
                        $('.em-time').text(result.time);
                        $('.em-time').addClass('em-time-chosen');
                    },
                    error: function (err) {}
                });
            })
            //留样菜品新增
            .on('tap', '.em-btn', function () {
                var addFlava =
                    '<li class="em-item"><img src="./image/img_delete.png" class="em-delete" /><div class="em-item-detial em-border-bottom"><div class="em-title"><span>菜名</span></div><div class="em-content"><input class="em-content-input foodname" placeholder="请输入菜名" /></div></div><div class="em-item-detial"><div class="em-title"><span>留样数量</span></div><div class="em-content"><input class="em-content-input amount" placeholder="请输入具体数字" /><span class="em-time-chosen">g</span></div></div></li>';
                $('.em-list').append(addFlava);
            })
            //留样菜品删除
            .on('tap', '.em-delete', function (item) {
                var rowguid = $(this).parent().attr('rowguid');
                ejs.ui.confirm({
                    title: '确认删除',
                    message: '确认删除？',
                    buttonLabels: ['取消', '确定'],
                    cancelable: 1,
                    h5UI: false,
                    success: function (result) {
                        //点击确定
                        if (result.which == 1) {
                            getDeleteFood(rowguid);
                        }
                    },
                    error: function (err) {}
                });
            })
            //删除留样图片
            .on('tap', '.em-attach-delete', function (item) {
                var attachguid = $(this).parent().attr('attachguid');
                ejs.ui.confirm({
                    title: '确认删除',
                    message: '确认删除？',
                    buttonLabels: ['取消', '确定'],
                    cancelable: 1,
                    h5UI: false,
                    success: function (result) {
                        //点击确定
                        if (result.which == 1) {
                            item.target.parentNode.remove();
                            if (isAdd == 0) {
                                //修改
                                attachDelete(remain_img, attachguid);
                            } else {
                                //新增
                                attachDelete(addUuid, attachguid);
                            }
                        }
                    },
                    error: function (err) {}
                });
            })
            //保存
            .on('tap', '.em-save', function () {
                var array = document.getElementById('em-list').getElementsByTagName('li');
                $.each(array, function (index, item) {
                    var foodguid = $(item).attr('rowguid');
                    var foodName = $(item).find('.foodname').val();
                    var amount = $(item).find('.amount').val();
                    if (foodguid == undefined) {
                        foodguid = Util.uuid({
                            len: 36,
                            radix: 10
                        });
                    }
                    foodList.push({
                        foodguid: foodguid,
                        foodName: foodName,
                        amount: amount
                    });
                });
                var hasData = true;
                $.each(foodList, function (index, item) {
                    if (item.foodName == '' || item.amount == '') {
                        hasData = false;
                    }
                });
                if (hasData) {
                    if (isAdd == 1) {
                        //新增
                        addData();
                    } else {
                        //修改
                        saveData();
                    }
                    foodList = [];
                } else {
                    foodList = [];
                }
            });
    }

    /*
     * @description 获取留样图片
     */
    function getImg() {
        ejs.storage.getItem({
            key: 'key',
            success: function (result) {
                var list = JSON.parse(result.key);
                $.each(list, function (indexInArray, valueOfElement) {
                    if (valueOfElement.mealtimes == title) {
                        var imgList = valueOfElement.remain_img_attach;
                        $.each(imgList, function (index, item) {
                            $('.em-img-list').append(
                                Mustache.render($('#template-attach').html(), {
                                    b64: item.attachUrl,
                                    attachguid: item.attachguid
                                })
                            );
                        });
                    }
                });

                ejs.storage.removeItem({
                    key: 'key',
                    success: function (result) {},
                    error: function (error) {}
                });
            },
            error: function (error) {}
        });
    }

    /*
     * @description 获取留样菜名及数量
     */
    function getFlavaData() {
        Util.ajax({
            url: Config.serverUrl + 'foodopt/getfoodoptremainfoodinfo',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    remainguid: rowguid
                }
            }),
            headers: { 'Content-Type': 'application/json' },
            success: function (result) {
                if (result.custom.code == 1) {
                    var tmpInfo = result.custom.foodoptremainfoodinfo,
                        template = document.getElementById('template').innerHTML,
                        html = '';
                    if (tmpInfo && Array.isArray(tmpInfo) && tmpInfo.length > 0) {
                        $.each(tmpInfo, function (index, item) {
                            item.index = index;
                            html += Mustache.render(template, item);
                        });
                    } else {
                        ejs.ui.toast('数据不存在或返回数据的格式错误！');
                    }
                    document.getElementById('em-list').innerHTML = html;
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
     * @description 附件上传初始化
     */
    function fileUpload(addUuid) {
        new FileInput({
            container: '#file1',
            isMulti: false,
            type: 'Image_Camera',
            success: function (b64, file, detail) {
                upLoadAttaches(b64, file.name, addUuid, file);
            },
            error: function (error) {
                console.error(error);
            }
        });
    }

    /*
     * @description 新增食品留样
     */
    function addData() {
        if (title == '早餐') {
            mealtimes = '1';
        } else if (title == '午餐') {
            mealtimes = '2';
        } else {
            mealtimes = '3';
        }
        handler = $('.em-handlername').val();
        remain_date = $('.em-time').text();
        var remaintime = remainDate + ' ' + remain_date + ':00';
        if (foodList.length == 0) {
            remain_img = Util.uuid();
        } else {
            remain_img = imgguid;
        }
        Util.ajax({
            url: Config.serverUrl + 'foodopt/getfoodoptremainadd',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    mealtimes: mealtimes,
                    handler: handler,
                    remain_date: remaintime,
                    remain_img: remain_img,
                    foodList: foodList,
                    pripid: pripid
                }
            }),
            headers: { 'Content-Type': 'application/json' },
            success: function (result) {
                if (result.custom.code == 1) {
                    ejs.ui.toast('新增成功！');
                    ejs.page.close();
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
     * @description 修改食品留样
     */
    function saveData() {
        if (title == '早餐') {
            mealtimes = '1';
        } else if (title == '午餐') {
            mealtimes = '2';
        } else {
            mealtimes = '3';
        }
        handler = $('.em-handlername').val();
        remain_date = $('.em-time').text();
        var remaintime = remainDate + ' ' + remain_date + ':00';
        Util.ajax({
            url: Config.serverUrl + 'foodopt/getfoodoptremainupdate',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    rowguid: rowguid,
                    mealtimes: mealtimes,
                    handler: handler,
                    remain_date: remaintime,
                    remain_img: remain_img,
                    foodList: foodList,
                    pripid: pripid
                }
            }),
            headers: { 'Content-Type': 'application/json' },
            success: function (result) {
                if (result.custom.code == 1) {
                    ejs.ui.toast('修改成功！');
                    ejs.page.close();
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
     * @description 删除留样菜名及数量
     */
    function getDeleteFood(rowguid) {
        Util.ajax({
            url: Config.serverUrl + 'foodopt/getfoodoptremainfooddelete',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    rowguid: rowguid
                }
            }),
            headers: { 'Content-Type': 'application/json' },
            success: function (result) {
                if (result.custom.code == 1) {
                    ejs.ui.toast('删除成功！');
                    getFlavaData();
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
     * @description 附件上传
     */
    function upLoadAttaches(b64, attachname, addUuid, file) {
        var guid = addUuid;
        if (remain_img != 'undefined') {
            guid = remain_img;
        }
        imgguid = guid;
        var data = {
            clientguid: guid,
            attachname: file.name
        };
        var url = Util.getFullUrlByParams(Config.serverUrl + 'commonInter/attachUpload', data);
        console.log('clientguid:' + guid);
        Util.upload({
            url: url,
            data: data,
            files: [
                {
                    name: file.name,
                    file: file
                }
            ],
            beforeSend: function () {},
            success: function (response, status, xhr) {
                ejs.ui.closeWaiting();
                var attachguid = response.custom.attachguid;
                $('.em-img-list').append(
                    Mustache.render($('#template-attach').html(), {
                        b64: b64,
                        attachguid: attachguid
                    })
                );
                ejs.ui.toast('上传成功');
            },
            error: function (xhr, status, statusText) {
                ejs.ui.closeWaiting('上传失败！');
            },
            uploading: function (percent, speed, status) {
                console.log('上传中:' + percent + ',speed:' + speed + ',msg:' + status);
                console.log(parseInt(percent));
            }
        });
    }

    /*
     * @description 附件删除
     */
    function attachDelete(addUuid, attachguid) {
        Util.ajax({
            url: Config.serverUrl + 'commonInter/attachDelete',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    attachguid: attachguid
                }
            }),
            headers: { 'Content-Type': 'application/json' },
            success: function (result) {
                if (result.status.code == 1) {
                    ejs.ui.toast('删除成功！');
                } else {
                    ejs.ui.toast(result.status.text);
                }
            },
            error: function (error) {
                console.log('返回结果：' + JSON.stringify(error));
            }
        });
    }

    /*
     * @description 获取当前时间
     */
    function getNowTime() {
        var date = new Date(),
            hour = date.getHours(),
            minutes = date.getMinutes();

        if (hour >= 0 && hour <= 9) {
            hour = '0' + hour;
        }
        if (minutes >= 0 && minutes <= 9) {
            minutes = '0' + minutes;
        }
        var nowtime = hour + ':' + minutes;
        return nowtime;
    }
})(document, window.Util);
