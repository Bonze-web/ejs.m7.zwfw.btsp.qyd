/*
 * 作者: 吴松泽
 * 创建时间: 2020-11-13 17:06:57
 * 修改时间: 2020-11-13 17:08:15
 * 最后修改: 吴松泽
 * 版本: [1.0]
 * 版权: 国泰新点软件股份有限公司
 * 描述:
 */
 'use strict';

 Util.loadJs(initPage);

 function initPage() {
     var url = './test.pdf';

     pdfjsLib.getDocument(url)
         .then((pdf) => {
             return pdf.getPage(1);
         })
         .then((page) => {
             // 设置展示比例
             var scale = 1.5;
             // 获取pdf尺寸
             var viewport = page.getViewport(scale);
             // 获取需要渲染的元素
             var canvas = document.getElementById('pdf-canvas');
             var context = canvas.getContext('2d');
             canvas.height = viewport.height;
             canvas.width = viewport.width;

             var renderContext = {
                 canvasContext: context,
                 viewport: viewport,
             };

             page.render(renderContext);
         });
 }
