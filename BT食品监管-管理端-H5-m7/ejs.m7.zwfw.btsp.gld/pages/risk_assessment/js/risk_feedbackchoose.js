/**
    作者 :lujun
    创建时间 :2021/03/31
    版本 :[1.0, 2021/03/31]
    版权：江苏国泰新点软件有限公司
    描述：选择检查项及内容
 **/

(function (d, $) {
    'use strict';

    var dutyguid = Util.getExtraDataByKey('dutyguid') || '';

    var checkitemlist = [];

    Util.loadJs(
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
        getContentListByItemID();
    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('body')
            // 点击头部
            .on('tap', '.checktitle span', function (e) {
                if ($(this).text() == '检查项') {
                    $('#checkitem').removeClass('hidden');
                    $('#checkcontent,.surebtn').addClass('hidden');
                    $('.checktitle').html('<span>检查项</span>')
                }
            })
            // 点击检查项
            .on('tap', '#checkitem li', function (e) {
                if ($('.checktitle span').length < 2) {
                    console.log(this.dataset.guid)
                    console.log($(this).find('a').text())
                    $('.checktitle').append(`<span class="checktitle-right"></span>
                    <span id="checkitemtext" data-checkitem=${this.dataset.checkitem}>${$(this).find('a').text()}</span>`)
                }
                $('#checkitem').addClass('hidden');
                $('#checkcontent,.surebtn').removeClass('hidden');

                checkitemlist.map((ele, i) => {
                    if (ele.idx == this.dataset.idx && ele.checkitem == this.dataset.checkitem) {
                        console.log(ele)
                        var html = Mustache.render($('#checkcontent-tpl').html(), ele);
                        $('#checkcontent').html(html);
                    }
                })
            })
            // 点击检查内容
            .on('tap', '#checkcontent li', function (e) {
                if ($(this).hasClass('childlist-choose')) {
                    $(this).removeClass('childlist-choose').addClass('childlist-unchoose');
                } else {
                    if (!dutyguid) {//单选
                        $('.childlist-choose').removeClass('childlist-choose').addClass('childlist-unchoose')
                        $(this).addClass('childlist-choose');
                        return;
                    }
                    $(this).removeClass('childlist-unchoose').addClass('childlist-choose');
                }
            })
            // 点击 确定 按钮
            .on('tap', '.surebtn', function (e) {
                var checkitem = $('#checkitemtext').text(), checkcontent = '', checkguids = '';

                $('#checkcontent .childlist-choose').forEach((ele, i) => {
                    checkguids = checkguids + ele.dataset.guid + ';';
                    checkcontent = checkcontent + $(ele).find('.flex-1').text() + ';';
                })
                console.log(checkitem, checkguids, checkcontent)
                // return;
                console.log({
                    checkitem: checkitem,
                    checkcontentguid: checkguids,
                    checkcontent: checkcontent,
                })
                // return;
                ejs.page.close({
                    // popPageNumber: 1,
                    // 也支持传递字符串
                    resultData: {
                        checkitem: encodeURI(checkitem),
                        checkcontentguid: checkguids,
                        checkcontent: encodeURI(checkcontent),
                    },
                    success: function (result) {
                    },
                    error: function (error) { }
                });
                // ejs.page.close(JSON.stringify({ checkitem: checkitem, checkguids: checkguids, checkcontent: checkcontent }));
            })

    }

    /**
 * @description 检查内容列表
 */
    function getContentListByItemID() {
        Util.ajax({
            url: Config.serverUrl + 'risktask/getContentListByItemID',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                }
            }),
            contentType: 'application/json',
            success: function (res) {
                console.log(res)

                res.custom.checkitemlist.map((ele, i) => {
                    ele.idx = i + 1;
                    ele.checkcontentlist.map((item, j) => {
                        item.idx = i + '.' + j + 1;
                    })
                })
                checkitemlist = res.custom.checkitemlist;

                var html = Mustache.render($('#item-tpl').html(), res.custom);
                $('#checkitem').html(html);

                // 处理数据
                if (res.status.code != 200) {
                    ejs.ui.toast(res.status.text);
                    return false;
                }

            },
            error: function (error) {
                ejs.ui.toast(JSON.stringify(error));
                console.log(error);
                ejs.ui.closeWaiting({});
            },
            complete: function () {
                ejs.ui.closeWaiting({});
            }
        });
    }

})(document, Zepto);