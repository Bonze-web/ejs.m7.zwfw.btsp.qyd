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
        userGuid = '',
        resultGuid = '';

    var fileArray = [],
        uuid = Util.uuid();

    Util.loadJs(
        'js/widgets/fileinput/fileinput.js',
        function () {
            ejs.config({
                jsApiList: []
            });

            ejs.ready(function () {
                rowGuid = Util.getExtraDataByKey('guid') || '111';
                userGuid = Util.getExtraDataByKey('userguid');
                resultGuid = Util.getExtraDataByKey('checkresultguid');

                initListeners()
            });
        }
    );

    /**
     * 初始化事件监听
     */
    function initListeners() {
        $('#choosefile').on('tap', function () {
            $('#fileBtn').click();
        })

        // 删除附件
        $('#filecontainer').on('tap', '.deletefile', function () {
            var index = $(this).parent().index();

            fileArray.forEach(function (item, childindex) {
                if (childindex == index) {
                    fileArray.splice(1, childindex);
                }
            })

            $(this).parent().remove();
        })

        $('#cancel').on('tap',function(){
            ejs.page.close();
        })

        // 填写，先提交附件
        $('#submit').on('tap', function () {
            if ($('#rectifycontent').val() == '') {
                ejs.ui.toast('请先填写整改内容')
            } else {
                ejs.ui.showWaiting();
                if (fileArray.length > 0) {
                    uploadFile();
                } else {
                    submitInfo();
                }
            }
        })
        // 选择文件的事件
        new FileInput({
            container: '#fileBtn',
            isMulti: false,
            type: 'Image_Camera',
            success: function (b64, file, detail) {

                fileArray.push({
                    name: file.name,
                    file: file
                })

                var output = Mustache.render(document.getElementById('file-litem').innerHTML, {
                    img: b64
                });
                $('#filecontainer').append(output)
            },
            error: function (error) {
                console.error(error);
            }
        });
    }

    function uploadFile() {

        var data = {
            token: 'Epoint_WebSerivce_**##0601',
            params: {
                clientguid: uuid
            }
        }

        Util.upload({
            url: Config.serverUrl + "commonInter/attachUpload", // 请求的地址
            // contentType: 'application/json',
            data: data,
            files: fileArray,
            beforeSend: function () {

            },
            success: function (response, status, xhr) {
                console.log(response);
                
                submitInfo();
            },
            error: function (xhr, status, statusText) {
                ejs.ui.closeWaiting('上传失败！');
            },
            uploading: function (percent, speed, status) {
                console.log("上传中:" + percent + ',speed:' + speed + ',msg:' + status);
                console.log(parseInt(percent));
            }
        });
    }

    function submitInfo() {
        Util.ajax({
            url: Config.serverUrl + 'task/saveRTF',
            data: JSON.stringify({
                token: 'Epoint_WebSerivce_**##0601',
                params: {
                    checkresultguid: resultGuid,
                    rectifyatc: uuid,
                    isoptupload: 0,
                    rectifycontent: $('#rectifycontent').val()
                }
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                ejs.ui.closeWaiting();

                if (res.status.code != 200) {
                    ejs.ui.toast('获取数据失败');
                    return;
                }

                if (res.custom.code == 0) {
                    ejs.ui.toast(res.custom.text)
                } else {
                    ejs.ui.toast('提交成功');

                    setTimeout(function(){
                        ejs.page.close();
                    },1000)
                }

            },
            error: function (err) {
                ejs.ui.toast(err)
            }
        });
    }


})(document, Zepto);