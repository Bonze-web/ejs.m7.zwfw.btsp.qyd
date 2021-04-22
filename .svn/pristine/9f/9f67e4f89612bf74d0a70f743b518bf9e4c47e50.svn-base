/*
 * @Author: 吴松泽
 * @Date: 2018-08-30 13:42:27
 * @Last Modified by: 吴松泽
 * @Last Modified time: 2018-12-10 10:49:42
 * @Description:  人员图片失效，显示为姓名加背景
 */

'use strict';

Util.loadJs(
    'pages/common/namedavatar.js', // https://github.com/joaner/namedavatar
    function () {
        namedavatar.config({
            nameType: 'lastTwoName',
            // backgroundColors: ['#3c80e6'],
            backgroundColors: ['#FA7976', '#B7A0F1', '#6890F3', '#57BAB3', '#61C7F1', '#FAA77D'],
            width: 40,
            height: 40
        });
    });

// 显示默认头像，头像为背景色加姓
function commonImgError(img) {
    // 个性化处理
    if (Zepto(img).attr('alt') == '') {
        img.src = './img/img_man_head_bg.png';
        img.onerror = null; // 如果错误图片也不存在就
    } else {
        // 姓名文字+背景处理
        namedavatar.setImgs(Zepto(img), 'alt');

    }
}
// 默认加载背景文字头像
function srcLoad(img) {
    namedavatar.setImgs(Zepto(img), 'alt');

}
// 图片加载成功后显示头像
function commonImgLoad(img) {
    // 模拟加载头像，加载成功后赋值在列表头像上
    var image = new Image();

    image.addEventListener('load', function listener() {
        Zepto(img).attr('src', Zepto(img).attr('data-src'));
        this.removeEventListener('load', listener);
    });
    image.src = Zepto(img).attr('data-src');
    img.onload = null;
}