/**
    作者 :lujun
    创建时间 :2021/03/31
    版本 :[1.0, 2021/03/31]
    版权：江苏国泰新点软件有限公司
    描述：风险分级评定超期预警
 **/

(function (d, $) {
    'use strict';

    var listname = Util.getExtraDataByKey('listname') || '';
    listname = decodeURI(listname);
    console.log(listname)
    var objstatelist = [];


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
        ejs.navigator.setTitle(listname + '搜索');
        // 初始化事件监听
        initListeners();
        getCodeName('食品监管对象主体状态', 'choose');
        getCodeName('主体业态');
        if (listname == '食品生产企业') {
            $('#nameSet label').text('生产者名称');
            $('#nameSet input')[0].id = 'producter';
            $('#tuanSet input')[0].id = 'organization';
            $('.jystyle').addClass('hidden');
        }
    }

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('body')
            // 点击tab切换
            .on('tap', '.check-result-choose div', function (e) {
                $('.active').removeClass('active');
                $(this).addClass('active');
            })
            // 点击主体业态
            .on('tap', '#objstate', function (e) {
                var input = $(this).find('input')
                ejs.ui.popPicker({
                    layer: 1,
                    data: objstatelist,
                    success: function (result) {
                        input.val(result.items[0].text);
                        input[0].dataset.objstate = result.items[0].value;
                    },
                    error: function (err) { }
                });

            })
            // 点击搜索
            .on('tap', '#search', function (e) {
                var arr = [];
                $('#form .mui-input-row').forEach((ele, i) => {
                    if (!$(ele).hasClass('hidden')) {
                        var input = $(ele).find('input'),
                            placeholder = input[0].placeholder;
                        arr.push({
                            text: $(ele).find('label').text(),
                            field: input[0].id,
                            value: placeholder == '请选择' ? input[0].dataset[input[0].id] : input.val()
                        })
                    }
                })
                arr.push({
                    text: '状态',
                    field: 'status',
                    valuetext: $('.active').text(),
                    value: $('.active')[0].dataset.value || ''
                })
                console.log(arr)
                localStorage.setItem('market_searchresult', JSON.stringify(arr));

                ejs.page.open('./market_searchresult.html', {
                    listname: encodeURI(listname)
                });

            })
            // 点击重置
            .on('tap', '#reset', function (e) {
                $('#form input').forEach((ele, i) => {
                    $(ele).val('');
                })
                $('.active').removeClass('active');
                $('#choose-all').addClass('active');
            })
    }
    /**
* @description 获取代码项
*/
    function getCodeName(codename, id) {
        Util.ajax({
            url: Config.serverUrl + 'commonInter/getCodeInfoList',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    codename: codename
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
                if (codename == '食品监管对象主体状态') {
                    var output = Mustache.render(document.getElementById('choose-tpl').innerHTML, {
                        list: res.custom.codelist
                    });

                    $(`#${id}`).append(output);
                }
                else if (codename == '主体业态') {
                    console.log(11)
                    res.custom.codelist.map((ele, i) => {
                        if (ele.itemvalue.length <= 2) {
                            objstatelist.push({
                                text: ele.itemtext,
                                value: ele.itemvalue
                            })
                        }
                    })
                    console.log(objstatelist)
                    // objstatelist = res.custom.codelist;
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