'use strict';

Util.loadJs([], function () {
    configReady();
    ejs.ui.showWaiting();
});

function configReady() {
    // 默认IOS,自定义关闭前一个页面
    var jsApiList = null;

    // if (Util.os.ios) {
    //     jsApiList = [{
    //         'epointtodo': 'EJSToDoApi' // 或者iOS下为 EJSPayApi
    //     }];
    // }

    // Config.configReady(jsApiList, function () {


    var cacheRequest = {}; // 缓存ajax
    var $cover = $('#cover'),
        $flLayer = $('#fl-layer'),
        $flTitle = $('.fl-title', $flLayer),
        $flInfoLis = $('#fl-info-list'),
        $flContain = $('.fl-contain', $flLayer);

    var myDiagram,
        cacheImgList = [];

    // var Util = {};

    // 获取url参数
    Util.getQueryString = function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        var context = '';

        if (r != null) {
            context = decodeURIComponent(r[2]);
        }
        reg = null;
        r = null;

        return context == null || context == '' || context == 'undefined' ? '' : context;
    };

    // 流程图
    (function (win, _$) {
        function init(nodeList) {
            var $ = go.GraphObject.make; // for conciseness in defining templates

            // 初始化整个流程图
            myDiagram =
                $(go.Diagram, 'myDiagramDiv', // must name or refer to the DIV HTML element
                    {
                        // "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                        // autoScrollRegion:0,

                        initialDocumentSpot: go.Spot.TopCenter,
                        initialViewportSpot: go.Spot.TopCenter,
                        // initialContentAlignment: go.Spot.Center,
                        allowClipboard: false,
                        allowDrop: false, // must be true to accept drops from the Palette
                        allowCopy: false,
                        allowMove: false,
                        allowDelete: false,
                        allowSelect: false,
                        // allowZoom:false,
                        allowDragOut: false,
                        allowGroup: false,
                        isReadOnly: true,
                        "toolManager.holdDelay": 3600000,
                        // initialScale:0.5,
                        // initialAutoScale: go.Diagram.Uniform,  // 全局适配视图大小
                        initialAutoScale: go.Diagram.UniformToFill, // 单方向适配大小
                        // "LinkDrawn": showLinkLabel, // this DiagramEvent listener is defined below
                        // "LinkRelinked": showLinkLabel,
                        // scrollsPageOnFocus: false,
                        // autoScale: true,
                        // "removeModelChanged": function(e) {
                        //   console.log('remove')
                        //   console.log(e)
                        //  },
                        'undoManager.isEnabled': false // enable undo & redo
                    });

            // helper definitions for node templates

            // 节点部分样式
            function nodeStyle() {
                return [
                    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify), {
                        locationSpot: go.Spot.LeftCenter
                    }
                ];
            }

            // 图标设置
            function findIconImg(icon) {
                // if (key < 0 || key > 16) return "images/HSnopic.png"; // There are only 16 images on the server
                if (!icon) {
                    return './css/images/1.jpg';
                }

                return './css/images/' + icon + '.jpg';
            }
            /**
             * [changeFill 改变填充色]
             * @param  {[type]} status [1：未开始 2：进行中 3：已完成 4：超期]
             * @return {[type]}        [description]
             */
            function changeFill(status) {
                // console.log(status);
                var color = '';

                if (status == 1) {
                    color = '#fff';
                } else if (status == 2) {
                    color = '#17b6b0';
                } else if (status == 3) {
                    color = '#3c80e6';
                } else if (status == 4) {
                    color = '#ff7800';
                }

                return color;
            }
            // 更改字体颜色
            function changeTextColor(status) {
                // console.log(status);
                var color = '';

                if (status == 1) {
                    color = '#333333';
                } else {
                    color = '#fff';
                }

                return color;
            }

            function changeTextColorBykey(key) {
                if (key == -1) {
                    return '#fff';
                }
            }

            function changeFillColorByKey(key) {
                if (key == -1) {
                    return '#9497a7';
                }
            }

            function changeFigure(status) {
                console.log(status);
                var value = '';

                if (status == 1 || status == -1) {
                    value = 'Terminator';
                } else {
                    value = 'RoundedRectangle';
                }

                return value;
            }
            // 定义节点模板，可添加多个
            var lightText = '#666666';

            myDiagram.nodeTemplate = // the default category
                $(go.Node, 'Spot', nodeStyle(), {
                        selectionAdorned: false
                        // resizable: true,
                    },
                    // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                    $(go.Panel, 'Auto',
                        $(go.Shape, 'RoundedRectangle', {
                                minSize: new go.Size(100, 40),
                                maxSize: new go.Size(100, 40),
                                // desiredSize: new go.Size(150, 32),
                                strokeDashArray: [],
                                fill: '#fff',
                                stroke: '#9497a7'
                                // strokeWidth: 1
                            },
                            new go.Binding('strokeWidth', 'status', function (v) {
                                if (v == 1) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            }),
                            new go.Binding('strokeWidth', 'type', function (v) {
                                if (v == -1) {
                                    return 0;
                                }
                            }),
                            new go.Binding('strokeDashArray', 'status', function (v) {
                                if (v == 1) {
                                    return [2, 3];
                                } else {
                                    return [];
                                }
                            }),
                            new go.Binding('fill', 'status', changeFill),
                            new go.Binding('fill', 'type', changeFillColorByKey)
                            // new go.Binding("figure", "key", changeFigure),
                        ),
                        $(go.Panel, 'Horizontal',
                            /* $(go.Picture, {
                                            name: "Picture",
                                            desiredSize: new go.Size(16, 16),
                                            margin: new go.Margin(10,10,10,15),
                                        },
                                        new go.Binding("source", "icon", findIconImg)),*/
                            $(go.TextBlock, {
                                    font: 'normal 15px Arial, sans-serif',
                                    stroke: lightText,
                                    alignment: go.Spot.Center,
                                    // margin: new go.Margin(10,0,10,0),
                                    // minSize: new go.Size(142, NaN),
                                    desiredSize: new go.Size(100, NaN),
                                    wrap: go.TextBlock.WrapFit,
                                    editable: false
                                },
                                new go.Binding('text', 'name').makeTwoWay(),
                                new go.Binding('stroke', 'status', changeTextColor),
                                new go.Binding('stroke', 'type', changeTextColorBykey)
                            )
                        )
                    )


                );

            myDiagram.addDiagramListener('ObjectSingleClicked', function (e) {
                var Select_Port = e.subject.part.data; // e.subject.part.data即获取到的data

                if (Select_Port.status == '2' || Select_Port.status == '3') {
                    if (Select_Port.detail && Select_Port.detail.length) {
                        if (Select_Port.detail.pictures && Select_Port.detail.pictures.length) {
                            cacheImgList = Select_Port.detail.pictures;
                        }
                        showLayer(Select_Port);
                    }
                }

            });

            function changeArrowColor(isdone) {
                return isdone ? '#3c80e6' : '#9497a7';
            }


            // 定义连线模板
            myDiagram.linkTemplate =
                $(go.Link, // the whole link panel
                    {
                        routing: go.Link.AvoidsNodes,
                        curve: go.Link.JumpOver,
                        corner: 0,
                        toShortLength: 4,
                        relinkableFrom: false,
                        relinkableTo: false,
                        reshapable: false,
                        // adjusting: go.Link.Stretch,
                        selectionAdorned: false,
                        resegmentable: false,
                        // mouse-overs subtly highlight links:
                        mouseEnter: function (e, link) {
                            link.findObject('HIGHLIGHT').stroke = 'rgba(30,144,255,0.1)';
                        },
                        mouseLeave: function (e, link) {
                            link.findObject('HIGHLIGHT').stroke = 'transparent';
                        }
                    },
                    new go.Binding('points').makeTwoWay(),
                    $(go.Shape, // the highlight shape, normally transparent
                        {
                            isPanelMain: true,
                            strokeWidth: 5,
                            stroke: 'transparent',
                            name: 'HIGHLIGHT'
                        }),
                    $(go.Shape, // the link path shape
                        {
                            isPanelMain: true,
                            // stroke: "#525c6f",
                            strokeWidth: 1
                        },
                        new go.Binding('stroke', 'isdone', changeArrowColor)
                    ),
                    $(go.Shape, // the arrowhead
                        {
                            toArrow: 'Triangle',
                            stroke: null,
                            fill: 'gray'
                        },
                        new go.Binding('fill', 'isdone', changeArrowColor))
                );

            // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
            myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
            myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

            load(); // load an initial diagram from some JSON text

        }

        init();

        function load() {
            var id = Util.getQueryString('id');

            if (!id) {
                console.warn('缺少流程图id');

                return false;
            }
            var data = {
                // 消息唯一标识
                'messageitemguid': id,
                // 注意：（未用到）已废弃这个参数，但必须得传一个值，否则会报“参数不合法”，实际上该参数无论传什么都不会影响返回结果，标准版维护人员须知,后面梳理后统一去除
                // 'type': '1',
                'forcechange': '1'
            };
            var url = Config.serverOA9Url + 'workflow_vmlinstancejson_v7';

            // url = url.replace(/oa9/, 'frame');
            // common.ajax({
            //     url: 'http://218.4.136.122:7777/dztmhoarest/rest/frame/workflow_vmlinstancejson_v7',
            //     data: data,
            //     // dataPath: "custom.infolist",
            // }, function (res) {
            //     if (typeof res === 'string') {
            //         res = JSON.parse(res);
            //     }

            //     if (res.custom) {
            //         var nodedataarray = res.custom.nodedataarray;

            //         nodedataarray.forEach(function (item) {
            //             if (item.key == -1) {
            //                 item.type = -1;
            //             }
            //         });

            //         var renderData = {
            //             'class': 'go.GraphLinksModel',
            //             'nodeDataArray': nodedataarray,
            //             'linkDataArray': res.custom.linkdataarray
            //         };

            //         myDiagram.model = go.Model.fromJson(renderData);
            //         ejs.device.setBounce({
            //             isEnable: 0,
            //             success: function (result) {},
            //             error: function (error) {}
            //         });
            //         ejs.ui.closeWaiting();
            //     } else if (res.status.code == 0) {
            //         ejs.ui.toast(res.status.text);
            //         ejs.ui.closeWaiting();
            //     }

            // }, function (error) {
            //     ejs.ui.closeWaiting();
            //     ejs.ui.toast(Config.TIPS_II);
            // }, {
            //     isDebug: false
            // });
            var url = Util.getProjectBasePath() + 'rest/frame/workflow_vmlinstancejson_v7';

            Util.ajax({
                url: url,
                data: {
                    params: JSON.stringify({
                        messageitemguid: id,
                        forcechange: true
                    })
                },
                success: function (res) {
                    if (typeof res === 'string') {
                        res = JSON.parse(res);
                    }

                    if (res.custom) {
                        var nodedataarray = res.custom.nodedataarray;

                        nodedataarray.forEach(function (item) {
                            if (item.key == -1) {
                                item.type = -1;
                            }
                        });

                        var renderData = {
                            'class': 'go.GraphLinksModel',
                            'nodeDataArray': nodedataarray,
                            'linkDataArray': res.custom.linkdataarray
                        };

                        myDiagram.model = go.Model.fromJson(renderData);
                        ejs.device.setBounce({
                            isEnable: 0,
                            success: function (result) {},
                            error: function (error) {}
                        });
                        ejs.ui.closeWaiting();
                    } else if (res.status.code == 0) {
                        ejs.ui.toast(res.status.text);
                        ejs.ui.closeWaiting();
                    }

                }
            })
            /* Util.ajax({
                url: apiConfig.flowData,
                data: {
                    messageitemguid: id,
                    type: '1'
                },
                success: function(res) {
                    if(typeof res === 'string') {
                        res = JSON.parse(res);
                    }

                    if(res.custom) {
                        var nodedataarray = res.custom.nodedataarray;

                        nodedataarray.forEach(function(item) {
                            if(item.key == -1) {
                                item.type = -1;
                            }
                        });

                        var renderData = {
                            "class": "go.GraphLinksModel",
                            "nodeDataArray": nodedataarray,
                            "linkDataArray": res.custom.linkdataarray
                        }
                        myDiagram.model = go.Model.fromJson(renderData);
                    }

                }
            }) */
            // myDiagram.model = go.Model.fromJson(data);
        }

    })(window, Zepto);

    (function (win, $) {
        var voiceUrl;
        var thisDiv;

        $('#sample').on('click', '#cover', function () {
            // alert(1);
            hideLayer();
        }).on('click', '.fl-close', function () {
            hideLayer();
        }).on('click', '.pic-item', function () {
            // 点击图片
            // var index = $(this).index();
            var imgList = this.parentNode.querySelectorAll('img');
            var imgUrl = [];

            [].forEach.call(imgList, function (e, n) {
                imgUrl.push(e.getAttribute('src'));
            });
            // alert(imgUrl);
            ejs.util.prevImage({
                index: 0,
                selectedPhotos: imgUrl,
                success: function (result) {},
                error: function (error) {}
            });

        }).on('click', '.audio-item', function () {
            // 点击音频
            var $this = $(this),
                audioUrl = $this.data('source');

            if (this.classList.contains('em-stop')) {
                return;
            }
            var url = audioUrl;
            var name = this.querySelector('.audio-title').innerText;
            var time;

            thisDiv = this;
            console.log(url);
            console.log(name);

            // alert(url);
            ejs.io.downloadFile({
                url: url,
                fileName: name,
                reDownloaded: 0,
                success: function (result) {
                    console.log(result.filePath);
                    voiceUrl = result.filePath;

                    // 获取音频大小估算音频时长
                    ejs.io.getFileSize({
                        path: result.filePath,
                        success: function (result) {
                            time = Math.ceil(result.size / 1665) * 1000;
                        },
                        error: function (error) {}
                    });
                    // 播放
                    ejs.audio.startPlay({
                        path: result.filePath,
                        success: function (result) {
                            thisDiv.classList.add('em-stop');
                            // ejs.ui.toast('播放');
                            // 延时停止播放
                            window.timeOut = setTimeout(function () {
                                // self.stopVoice(thisDiv);
                                // 停止播放音频
                                window.clearTimeout(window.timeOut);
                                ejs.audio.stopPlay({
                                    path: voiceUrl,
                                    success: function (result) {
                                        thisDiv.classList.remove('em-stop');
                                        // ejs.ui.toast('停止播放');
                                    },
                                    error: function (error) {}
                                });
                            }, time);
                        },
                        error: function (error) {}
                    });
                },
                error: function (error) {}
            });
        }).on('tap', '.em-stop', function () {
            // 点击停止播放
            window.clearTimeout(window.timeOut);
            ejs.audio.stopPlay({
                path: voiceUrl,
                success: function (result) {
                    thisDiv.classList.remove('em-stop');
                    // ejs.ui.toast('停止播放');
                },
                error: function (error) {}
            });
        });

        document.querySelector('#cover').addEventListener('touchmove', function () {
            hideLayer();
        });
        win.showLayer = function (data) {
            var listStr = '';

            $flTitle.html(data.name);
            var status = data.status + '',
                statusClass = '';

            switch (status) {
                case '3':
                    statusClass = 'complete';
                    break;
                case '1':
                    statusClass = 'uncomplete';
                    break;
                case '2':
                    statusClass = 'ongoing';
                    break;
                case '4':
                    statusClass = 'timeout';
                    break;
                default:
                    break;
            }

            $(data.detail).each(function (index, item) {

                var opinion = '',
                    pictures = '',
                    audios = '';

                if (item.opinion) {
                    opinion = '<div class="fl-options"><p class="fl-options-content">' + item.opinion + '</p></div>';
                } else {
                    if (item.pictures && item.pictures.length && item.audios && item.audios.length) {

                    } else {
                        opinion = '<div class="fl-options"><p class="fl-nomessage">暂未签署</p></div>';
                    }
                }

                if (item.pictures && item.pictures.length) {
                    pictures += '<div class="pic-box clearfix">';
                    for (var i = 0, len = item.pictures.length; i < len; i++) {
                        pictures += '<div class="l pic-item"><img class="pic-img" src="' + item.pictures[i].url + '" /></div>';
                    }
                    pictures += '</div>';
                }

                if (item.audios && item.audios.length) {
                    audios += '<div class="audio-box">';
                    for (var j = 0, len = item.audios.length; j < len; j++) {
                        audios += '<div class="audio-item" data-source="' + item.audios[j].url + '"><span class="audio-title">' + item.audios[j].name + '</span><span class="audio-time">' + ' ' + '</span></div>';
                    }
                    audios += '</div>';
                }

                listStr += '<li class="fl-process">' +
                    '<div class="fl-head clearfix ' + statusClass + '">' +
                    '<div class="l w-4 text-ellipsis">' +
                    '<span class="l fl-head-text">操作：</span>' +
                    '<span class="l fl-head-text operation">' + item.operationname + '</span>' +
                    '</div>' +
                    '<div class="l w-6">' +
                    '<span class="l fl-head-text text-nop"> 处理时间：</span>' +
                    '<span class="l fl-head-text em-nop">' + item.createdate.slice(0, -3) + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="fl-process-contain">' +
                    '<div class="fl-transactor">' +
                    '<div class="fl-submit l">' + item.sendername + '</div>' +
                    '<div class="fl-time">' + item.operationdate + ' </div>' +
                    '<div class="fl-handle r">' + item.transactor + '</div>' +
                    '</div>' + opinion + pictures + audios +
                    '</div>' +
                    '</li>';
            });

            $flInfoLis.html(listStr);

            $cover.show();
            $flLayer.show();
            $flContain.scrollTop(0);
        };
        win.hideLayer = function () {
            $cover.hide();
            $flLayer.hide();
        };
    })(window, Zepto);
    // });
}