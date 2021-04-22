/**
 * 作者： 袁莉
 * 创建时间： 2019/10/16
 * 版本： [1.0, 2019/10/16]
 * 版权： 江苏国泰新点软件有限公司
 * 描述：简易案件-待登记-添加相关材料
 */

(function(doc, Util) {
	"use strict";

	var checkresultatc = '', //附件唯一标识
		fileName = '',
		caseguid = Util.getExtraDataByKey('caseguid') || '',
		tmpAttachList = [];
	
	var num = 0;
	Util.loadJs([
		'js/widgets/fileinput/fileinput.js',
		'pages/common/formatfile.js'
	], function() {
		Config.configReady([], function() {
			checkresultatc = Util.uuid();
			initPage();
			initListeners();

		}, function(err) {});
	});

	function initPage() {
		// 初始化文件选择
		new FileInput({
			container: '#fileslect',
			isMulti: false,
			type: 'All',
			success: function(b64, file, detail) {
				// console.log("选择:" + b64);
				// console.log("fileName:" + file.name);
				if(num == 1){
					ejs.ui.toast('最多上传一个附件');
					return;
				}
				var index = Util.uuid();
				var outPut = {
					picSrc: b64,
					attachicon: FormatFile.getFileIcon(file.name),
					attachname: file.name,
					attachsize: FormatFile.getKMByByte(file.size),
					index: index
				};

				var files = [{
					name: file.name,
					file: file
				}];

				tmpAttachList.push({
					'files': files,
					fileObj: file,
					attachicon: FormatFile.getFileIcon(file.name),
					attachname: file.name,
					attachsize: FormatFile.getKMByByte(file.size),
					index: index
				});

				var template = Mustache.render($("#pic-template").html(), outPut);

				$('#files-listdata').prepend(template);
				
				num++;

				return false;
			},
			error: function(error) {
				console.error(error);
			}
		});
	}

	function initListeners() {
		$('body')
			.on('tap', '.file-del', function() {
				var self = this,
					index = self.dataset.index;

				ejs.ui.confirm({
					title: "",
					message: "是否删除",
					buttonLabels: ['取消', '确定'],
					cancelable: 1,
					success: function(result) {
						if(result.which == 1) {
							$.each(tmpAttachList, function(i, val) {
								if(val.index == index) {
									tmpAttachList.splice(i, 1);
								}
							});
							$(self.parentNode).remove();
							num--;
						}
					}
				});
			})
			.on('tap', '#btn-save', function() {
				if($('#tip-text').val() == '') {
					ejs.ui.toast('请输入材料说明！');
					return false;
				} else {
					uploadFile();
				}
			});
	}

	/**
	 * 附件上传（带二进制流）
	 */
	function uploadFile() {

		var uploadAttach = function(index) {
			return new Promise(function(resolve, reject) {
				var url = Config.serverUrl + 'commonInter/attachUpload';

				fileName = tmpAttachList[i].fileObj.name;

				var data = {
					// 注：此接口参数不需要以json字符串格式传递，只需和以下参数名对应即可。
					attachfilename: tmpAttachList[i].fileObj.name, // 附件名
					contenttype: tmpAttachList[i].fileObj.type, // 文件类型
					// 文档类型(文件后缀名，如:.png/.jpg；如此参数不传，则attachfilename必须带后缀名)
					documenttype: '',
					clienttag: '', // 业务tag
					clientinfo: '', // 业务info
					clientguid: checkresultatc, // 业务标识
					attachguid: '',
				};

				url = Util.getFullUrlByParams(url, data);
				// ejs.ui.showDebugDialog(url);
				Util.upload({
					url: url,
					data: {},
					files: tmpAttachList[i].files,
					beforeSend: function() {
						console.log('准备上传');
					},
					success: function(response, status, xhr) {
						if(response.status.code == '1') {
							// 上传成功渲染
							resolve(response);
							save(response.custom.attachguid);
						} else {
							ejs.ui.toast(response.status.text);
						}
					},
					error: function(xhr, status, statusText) {
						console.log(xhr, status);
					},
					uploading: function(percent, speed, status) {
						console.log('上传中:' + percent + ',speed:' + speed + ',msg:' + status);
						console.log(parseInt(percent));
					}
				});
			});
		}

		var promiseArray = [];
		var len = tmpAttachList.length;
		for(var i = 0; i < len; i++) {
			promiseArray.push(uploadAttach(i));
		}

		if(promiseArray.length == 0) {
			save();
		} else {
			Promise.all(promiseArray).then(function(res) {
				console.log("上传成功");
				console.log(res);
			}).catch(function(error) {
				console.log("上传失败");
			}).finally(function(res) {
				console.log("结束");
				//				save();
			});
		}

	}

	function save(guid) {
		var data = {
			caseguid: caseguid,
			clientinfo: $('#tip-text').val(),
			filename: fileName,
			attachguid: guid,
			flag: '1'
		}
		var url = Config.serverUrl + 'checkInfo/addPunishCaseAttach',
			data = JSON.stringify({
				token: Config.validate,
				params: data
			});

		console.log('案件详情：', url, data);

		Util.ajax({
			url: url,
			data: data,
			contentType: 'application/json',
			beforeSend: function() {
				ejs.ui.showWaiting();
			},
			success: function(result) {
				if(result.status.code != 1) {
					ejs.ui.toast(result.status.text);
					return;
				}
				ejs.ui.toast('新增成功！');

				ejs.page.close(JSON.stringify({
					key: 'addfile'
				}));
			},
			error: function(error) {
				console.log(JSON.stringify(error));
				ejs.ui.toast('接口有误，请联系管理员');
				ejs.ui.closeWaiting({});
			},
			complete: function() {
				ejs.ui.closeWaiting({});
			}
		});
	}

})(document, window.Util);