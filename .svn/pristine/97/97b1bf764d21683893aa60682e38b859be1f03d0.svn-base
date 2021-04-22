/**
 * 作者：libo
 * 创建时间：2021-04-01
 * 版本：[1.0, 2021-04-01]
 * 版权：江苏国泰新点软件有限公司
 * 描述：日常检查
 **/

(function (d, $) {
    'use strict';

    var bMap,
        point;

    Util.loadJs(
        // 下拉刷新
        'js/widgets/baidumap/baidumap.js',
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

        // 加载百度地图
        // 加载百度地图
        bMap = new BaiduMap({
            container: '#baidumap',
            isForceDD: false,
            isForceEJS: true,
            success: function (point) {
                document.querySelector('.em-wifi').style.display = 'none';

                point = point;

                bMap.searchHotPoint({
                    // 半径为0~1000米内的POI,默认100米
                    poiRadius: radius,
                    // 列举出50个POI,默认10个
                    numPois: 10,
                    success: function (allPois) {
                        ejs.ui.closeWaiting();

                        console.log(allPois)
                    }
                });
            },
            error: function (msg) {

            }
        });
    }

    /**
     * 初始化事件监听
     */
    function initListeners() {

    }

})(document, Zepto);