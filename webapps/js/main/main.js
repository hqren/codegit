var carType = localStorage.getItem("carType" + localStorage.getItem("SystemID"));
car_type = $.cookie('car_type');
if((car_type == "" || car_type == undefined) && carType == "1,2")
{
	car_type = 0;  
}
if(car_type == 0 && carType == "1,2") 
{
	car_type = 1;
}

var TableIDArray = new Array();
var TableID = 0;
var JobID=null;
var ExecJobId=0;
var APIUrl = "device/";
$('.nav-list li a').click(function(e) {
	// $(".nav-list li a").index(this).addClass('active');
	// $(this).parent().prevAll().removeClass('active');
	// $(this).parent().nextAll().removeClass('active');
	// $(this).parent().siblings().removeClass('active').end().addClass('active');
	$('.main-nav>li').removeClass('active');
	$('.nav-list>li').removeClass('active');
	$(this).parent().addClass('active');
});
$('.main-nav>li>a').click(function(e) {
	$('.nav-list>li').removeClass('active');
	$('.main-nav>li').removeClass('active');
 	$(this).parent().eq($(this).parent().index()).addClass('active');
});

var $table = $('#table-sbzx');
$table.bootstrapTable({
	// url: "",
	method: 'post',
	contentType: "application/x-www-form-urlencoded",
	url : APIUrl + "getDevice.action",
	dataType : "json",
	striped: true,
	toolbar : "#toolbar",
	uniqueId : "id",
	pagination : true, // 分页
	singleSelect : false,
	search : false,
	sortable : false,
	sidePagination : "server", // 服务端处理分页
	queryParams: queryParams, //参数
	columns : [ {
		title : '序号',
		field : 'id',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			return index + 1;
		}
	}, {
		title : '设备序列号',
		field : 'mac',
		align : 'center',
		valign : 'middle',
	}, {
		title : '设备厂商',
		field : 'factory',
		align : 'center',
		valign : 'middle',
	}, {
		title : '最后上报时间',
		field : 'device_cur_time',
		align : 'center',
		formatter : function(value, row, index) {
			return new Date(value).format("yyyy-MM-dd HH:mm:ss");
		}
	} ]
});
var $table = $('#table-bbsj');
$table.bootstrapTable({
	method: 'post',
	contentType: "application/x-www-form-urlencoded",
	url : APIUrl + "getAllVersionResults.action",
	// url: "json/getAllVersionResults.json",
	dataType : "json",
	striped: true,
	toolbar : "#toolbar",
	uniqueId : "devClientVersionRusultId",
	pagination : true, // 分页
	singleSelect : false,
	//search : true,
	sortable : false,
	sidePagination : "server", // 服务端处理分页
	columns : [ {
		title : '序号',
		field : 'id',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			return index + 1;
		}
	}, {
		title : '执行设备',
		field : 'mac',
		align : 'center',
	}, {
		title : '设备上报版本号',
		field : 'version',
		align : 'center',
		valign : 'middle',
	}, {
		title : '下发状态',
		field : 'need_set_config',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			if (row.needSetConfig == 0) {
				return "待下发";
			}
			if (row.needSetConfig == 1) {
				return "已下发";
			}
			if (row.needSetConfig == 2) {
				return "暂停";
			}
			return "-";
		}
	}, {
		title : '升级结果',
		field : 'result',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			if (row.need_set_config == 0) {
				return "-";
			}
			if (row.result == null) {
				return "-";
			}
			if (row.result == 1) {
				return "成功";
			} else {
				return "失败";
			}
		}
	}, {
		title : '更新时间',
		field : 'updateTimeStr',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			return new Date(value).format("yyyy-MM-dd HH:mm:ss");
		}
	} ]
});
$('#sb_add').click(function() {
	var strdevVersion = '';
	$.ajax({
		method: 'post',
		contentType: "application/x-www-form-urlencoded",
		url : APIUrl + "getAllVersionsCombo.action",
		//url: "json/getAllVersionsCombo.json",
		contentType : "application/json",
		dataType : "json",
		// data: JSON.stringify({ "BuIds": ["1", "2",
		// "3"] }),
		success : function(jsonResult) {
			$.each(jsonResult, function(i, item) {
				strdevVersion += '<option value="' + item["devClientVersionId"] + '">' + item["version"] + '</option>';
			})
			var strHtml = '';
			strHtml += '<div class="row"><div class="col-sm-12"><form id="FormValidator" class="form-horizontal">';
			strHtml += '<br><div class="form-group"><label class="col-sm-3 control-label">版本号</label><div class="col-sm-6"><select id="sb_add_devClietntVersionId" class="form-control">' + strdevVersion + '</select></div></div>';
			strHtml += '<div class="form-group"><label class="col-sm-3 control-label">设备</label><div class="col-sm-8"><textarea id="sb_add_macs" name="sb_add_macs" class="form-control" rows="10"></textarea></div></div>';
			strHtml += '</form></div></div>';
			BootstrapDialog.show({
				title : '添加设备',
				message : strHtml,
				onshown : function(dialogRef) {
					$('#FormValidator').bootstrapValidator({
						message : 'This value is not valid',
						feedbackIcons : {
							valid : 'glyphicon glyphicon-ok',
							invalid : 'glyphicon glyphicon-remove',
							validating : 'glyphicon glyphicon-refresh'
						},
						fields : {
							sb_add_macs : {
								message : '设备无效',
								validators : {
									notEmpty : {
										message : '设备不能为空'
									}
								}
							}
						}
					});
				},
				buttons : [{
					label : '提交',
					cssClass : 'btn-primary',
					action : function(dialog) {
						$('#FormValidator').bootstrapValidator('validate');
						if ($('#FormValidator').data('bootstrapValidator').isValid()) {
							var strdevVersion, strdevClientUrl, strchecksum;
							strdevClietntVersionId = $('#sb_add_devClietntVersionId').val();
							strmacs = $('#sb_add_macs').val();
							data = "devClientVersionID=" + strdevClietntVersionId + "&macs=" +strmacs;
							$.ajax({
					            type: "post",
					            contentType: "application/x-www-form-urlencoded",
					            url : APIUrl + "saveDevVersionResult.action",
					            timeout: 60000,
					            dataType: "json",
					            data: data,
					            success: function (jsonResult) {
					            	$('#table-bbsj').bootstrapTable('refresh',{
										url : APIUrl + "getAllVersionResults.action"
									});
									if (jsonResult["success"]) {
										dialog.close();
									}
									BootstrapDialog.show({
				                        title: '系统提示',
				                        message: jsonResult["msg"] ,
				                        buttons: [{
				                            label: '关闭',
				                            action: function(dialogItself){
				                                dialogItself.close();
				                            }
				                        }]
				                    });
			            },
			            error: function (request, status, err) {
			                if (status == "timeout")
			                {
			                    BootstrapDialog.show({
			                        title: '系统提示',
			                        message: '请求超时！',
			                        buttons: [{
			                            label: '关闭',
			                            action: function(dialogItself){
			                                dialogItself.close();
			                            }
			                        }]
			                    });
			                }
			            }
			        });
						
						} else {
							BootstrapDialog.alert({
								title : '验证失败',
								message : '请确认输入内容格式是否正确！',
								type : BootstrapDialog.TYPE_DANGER,
								buttonLabel : '确认'
							});
						}
					}
				},
				{
					label : '重置',
					action : function(dialogItself) {
						$('#FormValidator') .data('bootstrapValidator').resetForm(true);
					}
				},
				{
					label : '关闭',
					action : function(dialogItself) {
						dialogItself.close();
					}
				} ]
			});
		}
	});

});
var $table = $('#table-bbgl');
$table.bootstrapTable({
	method: 'post',
	contentType: "application/x-www-form-urlencoded",
	url : APIUrl + "getAllVersions.action",
	// url: "json/getAllVersions.json",
	dataType : "json",
	striped: true,
	toolbar : "#toolbar",
	uniqueId : "devClientVersionId",
	pagination : true, // 分页
	singleSelect : false,
	//search : true,
	sortable : false,
	sidePagination : "server", // 服务端处理分页
	columns : [ {
		title : '序号',
		field : 'id',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			return index + 1;
		}
	}, {
		title : '版本号',
		field : 'version',
		align : 'center',
		valign : 'middle',
	}, {
		title : '描述',
		field : 'description',
		align : 'center',
		valign : 'middle',
	}, {
		title : 'URL',
		field : 'url',
		align : 'center',
		valign : 'middle',
	}, {
		title : 'MD5',
		field : 'checksum',
		align : 'center',
		valign : 'middle',
	} ]
});

$('#bb_add').click(function() {
	var strHtml = '';
	strHtml += '<div class="row"><div class="col-sm-12"><form id="FormValidator"  class="form-horizontal">';
	strHtml += '<br><div class="form-group"><label class="col-sm-3 control-label">版本号</label><div class="col-sm-6"><input type="text" id="bb_add_devVersion" name="bb_add_devVersion" class="form-control" maxlength="8" placeholder="输入版本号"></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">描述</label><div class="col-sm-6"><input type="text" id="description" name="description" class="form-control" placeholder="输入描述内容"></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">URL</label><div class="col-sm-6"><input type="url" id="bb_add_devClientUrl" name="bb_add_devClientUrl" class="form-control" placeholder="输入URL"></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">MD5</label><div class="col-sm-6"><input type="text" id="bb_add_checksum" name="bb_add_checksum" class="form-control" placeholder="输入MD5"></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">设备</label><div class="col-sm-8"><textarea id="sb_add_macs" name="sb_add_macs" class="form-control" rows="10"></textarea></div></div>';
	strHtml += '</form></div></div>';

	BootstrapDialog.show({
		title : '版本添加',
		message : strHtml,
		onshown : function(dialogRef) {
			$('#FormValidator').bootstrapValidator({
				message : 'This value is not valid',
				feedbackIcons : {
					valid : 'glyphicon glyphicon-ok',
					invalid : 'glyphicon glyphicon-remove',
					validating : 'glyphicon glyphicon-refresh'
				},
				fields : {
					bb_add_devVersion : {
						message : '版本号无效',
						validators : {
							notEmpty : {
								message : '版本号不能为空'
							},
						}
					},
					description : {
						message : '描述无效',
						validators : {
							notEmpty : {
								message : '描述不能为空'
							},
						}
					},
					bb_add_devClientUrl : {
						message : 'URL无效',
						validators : {
							notEmpty : {
								message : 'URL不能为空'
							}
						}
					},
					bb_add_checksum : {
						message : 'MD5无效',
						validators : {
							notEmpty : {
								message : 'MD5不能为空'
							}
						}
					},
					sb_add_macs : {
						message : '设备无效',
						validators : {
							notEmpty : {
								message : '设备不能为空'
							}
						}
					}
				}
			});
		},
		buttons : [{
			label : '提交',
			cssClass : 'btn-primary',
			action : function(dialog) {
			$('#FormValidator').bootstrapValidator('validate');
			if ($('#FormValidator').data('bootstrapValidator').isValid()) {
				var strdevVersion, strdevClientUrl, strchecksum,description,sb_add_macs;
				strdevVersion = $('#bb_add_devVersion').val();
				description = $('#description').val();
				strdevClientUrl = $('#bb_add_devClientUrl').val();
				strchecksum = $('#bb_add_checksum').val();
				sb_add_macs = $('#sb_add_macs').val();
				var data="";
				data = "version=" + strdevVersion + "&description=" + description + "&url=" + strdevClientUrl + "&checksum=" + strchecksum + "&macs=" + sb_add_macs;
				$.ajax({
					type : "POST",
					url : APIUrl + "saVeVersion.action",
					data : data,
					dataType : "json",
					success : function(jsonResult) {
						$('#table-bbgl').bootstrapTable('refresh', {
							url : APIUrl + 'getAllVersions.action'
						});
						if (jsonResult["success"]) {
							dialog.close();
						}
						BootstrapDialog.show({
	                        title: '系统提示',
	                        message: ConfigCN[jsonResult["result"]],
	                        buttons: [{
	                            label: '关闭',
	                            action: function(dialogItself){
	                                dialogItself.close();
	                            }
	                        }]
	                    });
					}
				});
			}
			else{
				BootstrapDialog.alert({
					title : '验证失败',
					message : '请确认输入内容格式是否正确！',
					type : BootstrapDialog.TYPE_DANGER,
					buttonLabel : '确认'
					});
				}
				}
			},
			{
				label : '重置',
				action : function(dialogItself) {
				$('#FormValidator').data(
				'bootstrapValidator')
				.resetForm(true);
			}
			}, {
				label : '关闭',
				action : function(dialogItself) {
				dialogItself.close();
			}
		} ]
	});
});

var $table = $('#table-log');
$table.bootstrapTable({
	method: 'post',
	contentType: "application/x-www-form-urlencoded",
	url : APIUrl + "findAllClientLogs.action",
	// url: "data.json",
	dataType : "json",
	striped: true,
	toolbar : "#toolbar",
	uniqueId : "id",
	pagination : true, // 分页
	singleSelect : false,
	search : true,
	sortable : false,
	sidePagination : "server", // 服务端处理分页
	columns : [ {
		title : '时间',
		field : 'name',
		align : 'center',
		valign : 'middle',
	}, {
		title : '日志类型',
		field : 'pic',
		align : 'center',
		valign : 'middle',
	}, {
		title : '日志详情',
		field : 'jg',
		align : 'center',
		valign : 'middle',
	} ]
});
var $table = $('#table-log2');
$table.bootstrapTable({
	striped: true,
	toolbar : "#toolbar",
	columns : [ {
		title : '时间',
		field : 'name',
		align : 'center',
		valign : 'middle',
	}, {
		title : '日志类型',
		field : 'pic',
		align : 'center',
		valign : 'middle',
	}, {
		title : '日志详情',
		field : 'jg',
		align : 'center',
		valign : 'middle',
	} ]
});
// 设备基础信息列表
var $table = $('#table-sbxx');
$table.bootstrapTable({
	method: 'post',
	contentType: "application/x-www-form-urlencoded",
	url : APIUrl + "getDeviceInfo.action",
	//url : "json/getDeviceBaseInfo.json",
	dataType : "json",
	striped: true,
	// toolbar:"#toolbar",
	uniqueId : "devClientVersionId",
	pagination : true, // 分页
	singleSelect : false,
	//search : true,
	sortable : false,
	sidePagination : "server", // 服务端处理分页
	queryParams: queryParams_sbxx,
	columns : [ {
		title : '序号',
		field : 'id',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			return index + 1;
		}
	}, {
		title : '设备型号',
		field : 'dev_model',
		align : 'center',
		valign : 'middle',
	}, {
		title : '设备序列号',
		field : 'dev_mac',
		align : 'center',
		valign : 'middle',
	}, {
		title : '设备厂商',
		field : 'dev_factory',
		align : 'center',
		valign : 'middle',
	}, {
		title : '总内存',
		field : 'total_memory',
		align : 'center',
		valign : 'middle',
	}, {
		title : 'SD卡容量',
		field : 'total_sdcard',
		align : 'center',
		valign : 'middle',
	}, {
		title : '硬盘容量',
		field : 'total_disk',
		align : 'center',
		valign : 'middle',
	}/*, {
		title : '最后上报时间',
		field : 'update_time',
		align : 'center',
		formatter : function(value, row, index) {
			return new Date(value).format("yyyy-MM-dd HH:mm:ss");
		}
	}*/]
});
// 远程管理
var $table = $('#table-ycgl');
$table.bootstrapTable({
	method: 'post',
	contentType: "application/x-www-form-urlencoded",
	//url : APIUrl + "getAllVersions.action",
	url : "execJob/getExecJobByPage.action",
	//url: "json/getExecJobByPage.json",
	dataType : "json",
	striped: true,
	toolbar : "#toolbar",
	uniqueId : "devClientVersionId",
	pagination : true, // 分页
	singleSelect : false,
	//search : true,
	sortable : false,
	sidePagination : "server", // 服务端处理分页
	columns : [ {
		title : '序号',
		field : 'id',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			return index + 1;
		}
	}, {
		title : '分组名称',
		field : 'groupName',
		align : 'center',
		valign : 'middle',
	}, {
		title : '设备MAC',
		field : 'macs',
		align : 'center',
		valign : 'middle',
	}, {
		title : '命令编号',
		field : 'jobId',
		align : 'center',
		valign : 'middle',
	}, {
		title : '命令内容',
		field : 'data',
		align : 'center',
		valign : 'middle',
	}, {
		title : '命令描述内容',
		field : 'jobDesc',
		align : 'center',
		valign : 'middle',
	}, {
		title : '任务状态',
		field : 'jobStatus',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
            if(value != null)
            {
                if(value=="0"){
                    return "准备中";
                }
                if(value=="1"){
                    return "准备就绪";
                }
                if(value=="2"){
                    return "下发中";
                }
                if(value=="3"){
                    return "准备就绪";
                }
            }
            return "-";
        }
	}, {
		title : '统计结果',
		field : 'countResult',
		align : 'center',
		valign : 'middle',
	}, {
		title : '添加时间',
		field : 'updateTime',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			return new Date(value).format("yyyy-MM-dd HH:mm:ss");
		}
	}, {
		title : '操作',
		field : 'cz',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			var strHtml='<button class="btn btn-primary" type="submit" onclick="ycgl_read('+ row.execJobId + ');">查看</button>';
			return strHtml;
		}
	} ]
});
function ycgl_read(execJobId)
{
	ExecJobId= execJobId;
	var strHtml = '';
	var data="";
	data="execJobId=" + execJobId;
	strHtml += '<div class="table row"><form class="form-horizontal">';
	strHtml += '<div class="form-group"><label class="col-sm-2 control-label">命令编号</label><div class="col-sm-10"><p class="form-control-static" id="execJobId"></p></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-2 control-label">命令描述内容</label><div class="col-sm-10"><p class="form-control-static" id="jobDesc"></p></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-2 control-label">命令内容</label><div class="col-sm-10"><p class="form-control-static" id="data"></p></div></div>';
	strHtml += '<div class="col-sm-12"><div class="input-group"><input type="text" id="mac" class="form-control" placeholder="请输入MAC地址"><div class="input-group-btn"><button id="serach_button2" class="btn btn-primary" type="submit"><i class="glyphicon glyphicon-search"></i></button></div></div></div>';
	strHtml += '</form></div>';
	strHtml += '<table id="table-ycgl_read"></table>';
	BootstrapDialog.show({
		size: BootstrapDialog.SIZE_WIDE,
		title : '远程管理查看',
		message : strHtml,
		onshown : function(dialogRef) {
			$.ajax({
	            type: "POST",
	            url: "execJob/getExecJobDetailById.action",
	            timeout: 60000,
	            dataType: "json",
	            data: data,
	            success: function (jsonResult) {
	                //jsonResult = JSON.parse(data)
	                $('#execJobId').html(jsonResult['execJobId']);
	                $('#jobDesc').html(jsonResult['jobDesc']);
	                $('#data').html(jsonResult['data']);
	            },
	            error: function (request, status, err) {
	                if (status == "timeout")
	                {
	                    BootstrapDialog.show({
	                        title: '系统提示',
	                        message: '请求超时！',
	                        buttons: [{
	                            label: '关闭',
	                            action: function(dialogItself){
	                                dialogItself.close();
	                            }
	                        }]
	                    });
	                }
	            }
	        });
			$('.selectpicker').selectpicker('refresh');
			var $table = $('#table-ycgl_read');
			$table.bootstrapTable({
				method: 'post',
				contentType: "application/x-www-form-urlencoded",
				//url : APIUrl + "downloadexDevJob/getDownloadexDevJob.action",
				url: "execJob/getExecDevJobDetailByPage.action",
				dataType : "json",
				striped: true,
				//toolbar : "#toolbar",
				uniqueId : "devClientVersionId",
				pagination : true, // 分页
				//search : true,
				sortable : false,
				sidePagination : "server", // 服务端处理分页
				queryParams: queryParams_ycgl,
				columns : [ {
					title : '序号',
					field : 'id',
					align : 'center',
					valign : 'middle',
					formatter : function(value, row, index) {
						return index + 1;
					}
				}, {
					title : '设备Mac',
					field : 'mac',
					align : 'center',
					valign : 'middle',
				}, {
					title : '下发状态',
					field : 'needSetConfig',
					align : 'center',
					valign : 'middle',
				}, {
					title : '下发结果',
					field : 'result',
					align : 'center',
					valign : 'middle',
					formatter : function(value, row, index) {
			            if(value != null)
			            {
			                if(value=="0"){
			                    return "失败";
			                }
			                if(value=="1"){
			                    return "成功";
			                }
			            }
			            return "-";
			        }
				}, {
					title : '执行详情',
					field : 'remarks',
					align : 'center',
					valign : 'middle',
				}, {
					title : '完成时间',
					field : 'finishTime',
					align : 'center',
					valign : 'middle',
					formatter : function(value, row, index) {
						return new Date(value).format("yyyy-MM-dd HH:mm:ss");
					}
				}, {
					title : '耗时 (毫秒)',
					field : 'timeUsed',
					align : 'center',
					valign : 'middle',
				}, {
					title : '执行时间',
					field : 'timeStamp',
					align : 'center',
					valign : 'middle',
				} ]
			});
			$('#serach_button2').click(function() {
				$('.bootstrap-dialog-message .bootstrap-table').remove();
		        $('.bootstrap-dialog-message .clearfix').remove();
		        $('.bootstrap-dialog-message').append('<table id="table-wjxf_read"></table>');
				var $table = $('#table-wjxf_read');
				$table.bootstrapTable({
					method: 'post',
					contentType: "application/x-www-form-urlencoded",
					url: "execJob/getExecDevJobDetailByPage.action",
					dataType : "json",
					striped: true,
					//toolbar : "#toolbar",
					uniqueId : "devClientVersionId",
					pagination : true, // 分页
					//search : true,
					sortable : false,
					sidePagination : "server", // 服务端处理分页
					queryParams: queryParams_ycgl,
					columns : [ {
						title : '序号',
						field : 'id',
						align : 'center',
						valign : 'middle',
						formatter : function(value, row, index) {
							return index + 1;
						}
					}, {
						title : '按日期分区',
						field : 'jobStartDate',
						align : 'center',
						valign : 'middle',
					}, {
						title : '设备mac',
						field : 'mac',
						align : 'center',
						valign : 'middle',
					}, {
						title : 'needSetConfig',
						field : 'needSetConfig',
						align : 'center',
						valign : 'middle',
					}, {
						title : '是否成功完成更新',
						field : 'result',
						align : 'center',
						valign : 'middle',
						formatter : function(value, row, index) {
				            if(value != null)
				            {
				                if(value=="0"){
				                    return "否";
				                }
				                if(value=="1"){
				                    return "是";
				                }
				            }
				            return "-";
				        }
					}, {
						title : '设备终端完成更新时间',
						field : 'finishTime',
						align : 'center',
						valign : 'middle',
						formatter : function(value, row, index) {
							return new Date(value).format("yyyy-MM-dd HH:mm:ss");
						}
					}, {
						title : '更新时间',
						field : 'updateTime',
						align : 'center',
						valign : 'middle',
						formatter : function(value, row, index) {
							return new Date(value).format("yyyy-MM-dd HH:mm:ss");
						}
					}, {
						title : '耗时 (毫秒)',
						field : 'timeUsed',
						align : 'center',
						valign : 'middle',
					}, {
						title : '执行时间',
						field : 'timeStamp',
						align : 'center',
						valign : 'middle',
					} ]
				});
				return false;
			})
		},
		buttons : [ {
			label : '关闭',
			action : function(dialogItself) {
				dialogItself.close();
			}
		}]
	});
}
$('#ycgl_add').click(function() {
	var strHtml = '';
	strHtml += '<div class="row"><div class="col-sm-12"><form class="form-horizontal" id="FormValidator">';
	strHtml += '<br><div class="form-group" id="options_zxfs"><label class="col-sm-3 control-label">执行方式</label><div class="col-sm-8"><div class="btn-group" data-toggle="buttons"><label class="btn btn-primary active"><input type="radio" name="options" id="ClickAll" value="1" checked>批量</label><label class="btn btn-primary"><input type="radio" name="options" id="ClickOne" value="2">分组</label></div></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">命令内容</label><div class="col-sm-8"><textarea id="data" name="data" class="form-control" rows="2"></textarea></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">命令描述</label><div class="col-sm-8"><textarea id="jobDesc" name="jobDesc" class="form-control" rows="2"></textarea></div></div>';
	strHtml += '<div class="form-group" id="SB_All"><label class="col-sm-3 control-label">执行设备</label><div class="col-sm-8"><textarea id="macs" name="macs" class="form-control" rows="2"></textarea></div></div>';
	strHtml += '<div class="form-group" id="SB_One" style="display:none"><label class="col-sm-3 control-label">执行设备</label><div class="col-sm-3"><select id="groupId" class="selectpicker form-control"><option value="1">全部</option><option value="2">铁路</option><option value="3">大巴</option></select></div><div class="col-sm-3" id="select_2" style="display:none;"><select id="groupId2" class="selectpicker form-control"></select></div></div>';
	strHtml += '</form></div></div>';
	BootstrapDialog.show({
		title : '添加远程命令',
		message : strHtml,
		onshown : function(dialogRef) {
			$('#FormValidator').bootstrapValidator({
				message : 'This value is not valid',
				feedbackIcons : {
					valid : 'glyphicon glyphicon-ok',
					invalid : 'glyphicon glyphicon-remove',
					validating : 'glyphicon glyphicon-refresh'
				},
				fields : {
					data : {
						message : '命令内容无效',
						validators : {
							notEmpty : {
								message : '命令内容不能为空'
							}
						}
					},
					macs : {
						message : '设备无效',
						validators : {
							notEmpty : {
								message : '设备不能为空'
							}
						}
					}
				}
			});
			$('.selectpicker').selectpicker('refresh');
			$('#ClickAll').parent().click(function() {
				$('#SB_All').show();
				$('#SB_One').hide();
			});
			$('#ClickOne').parent().click(function() {
				$('#SB_All').hide();
				$('#SB_One').show();
			});
			$('#groupId').change(function() {
				$('#groupId2').html('');
				if($(this).val()!=1){
					$('#select_2').show();
					if($(this).val()==2){
						$('#groupId2').append('<option value="2">全部</option>');
						$('#groupId2').append('<option value="4">中兴高达</option>');
					}
					if($(this).val()==3){
						$('#groupId2').append('<option value="3">全部</option>');
						$('#groupId2').append('<option value="5">锐捷</option>');
						$('#groupId2').append('<option value="5">傲天</option>');
					}
					$('#groupId2').selectpicker('refresh');
				}
				else
				{
					$('#select_2').hide();
				}
			});
		},
		buttons : [ {
			label : '提交',
			cssClass : 'btn-primary',
			action : function(dialog) {
				$('#FormValidator').bootstrapValidator('validate');
				if ($('#FormValidator').data('bootstrapValidator').isValid()) {
					var data="data=" + $("#data").val() + "&jobDesc=" + $("#jobDesc").val();
					var options_select=$('#options_zxfs input:radio:checked').val();
					groupIds = $("#groupId2").val();
					if(groupIds == null)
					{
						groupIds = $("#groupId").val();
					}
					if(options_select==2)
					{
						data += "&groupIds=" + groupIds;
					}
					if(options_select==1)
					{
						data += "&macs=" + $("#macs").val();
					}
					$.ajax({
			            type: "post",
			            //url: "http://10.10.19.109:8080/admin/execJob/addDevJob.action",
			            url: "execJob/addDevJob.action",
			            timeout: 60000,
			            dataType: "json",
			            data: data,
			            success: function (jsonResult) {
			            	$('#table-ycgl').bootstrapTable('refresh', {
								url : 'execJob/getExecJobByPage.action'
							});
			            	if(jsonResult["code"] == 0)
			            	{
			            		BootstrapDialog.show({
			                        title: '系统提示',
			                        message: jsonResult["message"] ,
			                        buttons: [{
			                            label: '关闭',
			                            action: function(dialogItself){
			                                dialogItself.close();
			                            }
			                        }]
			                    });
			                    dialog.close();
			            	}
			            	else
			            	{
			            		BootstrapDialog.show({
			                        title: '系统提示',
			                        message: jsonResult["message"] ,
			                        buttons: [{
			                            label: '关闭',
			                            action: function(dialogItself){
			                                dialogItself.close();
			                            }
			                        }]
			                    });
			                    return false;
			            	}
			            },
			            error: function (request, status, err) {
			                if (status == "timeout")
			                {
			                    BootstrapDialog.show({
			                        title: '系统提示',
			                        message: '请求超时！',
			                        buttons: [{
			                            label: '关闭',
			                            action: function(dialogItself){
			                                dialogItself.close();
			                            }
			                        }]
			                    });
			                }
			            }
			        });
				} else {
					BootstrapDialog.alert({
						title : '验证失败',
						message : '请确认输入内容格式是否正确！',
						type : BootstrapDialog.TYPE_DANGER,
						buttonLabel : '确认'
					});
				}
			}
		}, {
			label : '关闭',
			action : function(dialogItself) {
				dialogItself.close();
			}
		}]
	});

});
$('#ycgl_dr').click(function() {
	//$('#Toolbar_Upload').show();
	var strHtml="";
	strHtml+='<input id="file_excel" name="file_excel" class="file" type="file">';
	BootstrapDialog.show({
		title : '导入远程命令',
		message : strHtml,
		onshown : function(dialogRef) {
			$("#file_excel").fileinput({
				language: 'zh',
				//uploadUrl: 'http://10.10.19.109:8080/admin/execJob/importDevJob.action',
				uploadUrl: 'execJob/importDevJob.action',
				allowedFileExtensions: ['xls','xlsx'],//接收的文件后缀
				showPreview: false,
			    //showUpload: true, //是否显示上传按钮
			    //showCaption: false,//是否显示标题
			    browseClass: "btn btn-primary", //按钮样式	 
			    dropZoneEnabled: false,//是否显示拖拽区域
			    //minImageWidth: 50, //图片的最小宽度
			    //minImageHeight: 50,//图片的最小高度
			    //maxImageWidth: 1000,//图片的最大宽度
			    //maxImageHeight: 1000,//图片的最大高度
			    //maxFileSize: 0,//单位为kb，如果为0表示不限制文件大小
			    //minFileCount: 0,
			    maxFileCount: 1, //表示允许同时上传的最大文件个数
			    enctype: 'multipart/form-data',
			    validateInitialCount:false,
			    //previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
			    //msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
			});
			//导入文件上传完成之后的事件
			$("#file_excel").on("fileuploaded", function (event, data, previewId, index) {
				$('#table-ycgl').bootstrapTable('refresh', {
					url : 'execJob/getExecJobByPage.action'
				});
				var Code = data.response.code;
				var Message = data.response.message;
				BootstrapDialog.show({
                    title: '系统提示',
                    message: Message,
                    buttons: [{
                        label: '关闭',
                        action: function(dialogItself){
                            dialogItself.close();
                        }
                    }]
                });
                dialogRef.close();
			});
		}
	})
});
$('#ycgl_Template').click(function(event) {
	window.open("excelTemplate/importCmd.xls");
});
//文件下发
var $table = $('#table-wjxf');
$table.bootstrapTable({
	method: 'post',
	contentType: "application/x-www-form-urlencoded",
	url : "downloadexJob/getDownloadexJob.action",
	//url: "json/getDownloadexJob.json",
	dataType : "json",
	striped: true,
	toolbar : "#toolbar",
	uniqueId : "downloadex_job_id",
	pagination : true, // 分页
	singleSelect : false,
	//search : true,
	singleSelect : true,
	clickToSelect: true,//点击行即可选中单选/复选框  
	sortable : false,
	sidePagination : "server", // 服务端处理分页
	idField:"downloadex_job_id",
	columns : [ {
            idfield: 'state',
            checkbox: true
        },{
		title : '序号',
		field : 'id',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			return index + 1;
		}
	}, {
		title : '任务描述',
		field : 'description',
		align : 'center',
		valign : 'middle',
	}, {
		title : '文件根目录',
		field : 'sourcePath',
		align : 'center',
		valign : 'middle',
	}, {
		title : '压缩文件名',
		field : 'targetZipFileName',
		align : 'center',
		valign : 'middle',
	}, {
		title : '获取文件方式',
		field : 'sourcePathType',
		align : 'center',
		valign : 'middle',
	}, {
		title : '到哪里取文件',
		field : 'sourcePath',
		align : 'center',
		valign : 'middle',
	}, {
		title : '文件访问令牌',
		field : 'fileAccessToken',
		align : 'center',
		valign : 'middle',
	}, {
		title : '压缩文件名的MD5类型',
		field : 'md5Type',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
        if(value != null)
        {
            if(value=="0")
            {
            	return "FULL_READ";
            }
            if(value=="1")
            {
				return "PARTIAL_10MB";
            }
        }           
        return "-";
    	}
	}, {
		title : '压缩文件名的MD5',
		field : 'md5',
		align : 'center',
		valign : 'middle',
	}, {
		title : '文件夹数目',
		field : 'dirCount',
		align : 'center',
		valign : 'middle',
	}, {
		title : '有多少文件',
		field : 'fileCount',
		align : 'center',
		valign : 'middle',
	}, {
		title : '总共大小',
		field : 'fileSize',
		align : 'center',
		valign : 'middle',
	}, {
		title : '任务状态',
		field : 'downloadStatus',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			var strHtml='';
			if(value >= 0)
			{
				strHtml = downloadStatusCN[value]
			}
			else
			{
				strHtml = "未下发";
			}
			return strHtml;
		}
	}, {
		title : '操作',
		field : 'cz',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			var strHtml='<button class="btn btn-primary" type="submit" onclick="wjxf_read('+ row.downloadex_job_id + ',\'' + row.job_id+'\');">查看</button>';
			return strHtml;
		}
	} ],
	onLoadSuccess : function(row, $element)
	{
		var $table = $('#table-wjxf');
    	//遍历复选框
    	$table.find('input[name="btSelectItem"]').change(function(){
    		//console.log($(this).parent().parent().index());

    		//console.log($(this).parent().parent());
    		if($(this).prop("checked") == true){
				TableID = parseInt($(this).val());
				$('#wjxf_add').removeClass('disabled');
				$('#wjxf_add').prop('disabled', false);
			}
			else
			{
				TableID = 0;
				$('#wjxf_add').addClass('disabled');
				$('#wjxf_add').prop('disabled', true);
			}
			if(row.downloadStatus == -1)
			{
				$('#wjxf_add').addClass('disabled');
				$('#wjxf_add').prop('disabled', true);
			}


    		if(row["rows"][$(this).parent().parent().index()]["downloadStatus"] == "-1")
    		{
    			$('#wjxf_add').addClass('disabled');
				$('#wjxf_add').prop('disabled', true);
    		}
			//console.log("downloadStatus2:" + row.downloadStatus);
    	})
	},
	onClickRow : function(row, $element) {
		if(row.downloadStatus == -1)
		{
			$('#wjxf_add').addClass('disabled');
			$('#wjxf_add').prop('disabled', true);
		}
		//console.log("downloadStatus:" + row.downloadStatus);
	}
});
function wjxf_read(downloadex_job_id,job_id)
{
	JobID= downloadex_job_id;
	//console.log(JobID);
	var strHtml = '';
	strHtml += '<div class="table row"><form class="form-horizontal">';
	strHtml += '<div class="form-group"><label class="col-sm-2 control-label">任务编号</label><div class="col-sm-10"><p class="form-control-static">' + job_id + '</p></div></div>';
	strHtml += '<div class="col-sm-12"><div class="input-group"><input type="text" id="mac" class="form-control" placeholder="请输入MAC地址"><div class="input-group-btn"><button id="serach_button2" class="btn btn-primary" type="submit"><i class="glyphicon glyphicon-search"></i></button></div></div></div>';
	strHtml += '</form></div>';
	strHtml += '<table id="table-wjxf_read"></table>';
	BootstrapDialog.show({
		size: BootstrapDialog.SIZE_WIDE,
		title : '下发任务查看',
		message : strHtml,
		onshown : function(dialogRef) {
			var $table = $('#table-wjxf_read');
			$table.bootstrapTable({
				method: 'post',
				contentType: "application/x-www-form-urlencoded",
				url : "downloadexDevJob/getDownloadexDevJob.action",
				//url: "json/getDownloadexDevJob.json",
				dataType : "json",
				striped: true,
				//toolbar : "#toolbar",
				uniqueId : "devClientVersionId",
				pagination : true, // 分页
				//search : true,
				sortable : false,
				sidePagination : "server", // 服务端处理分页
				queryParams: queryParams_wjxf,
				columns : [ {
					title : '序号',
					field : 'id',
					align : 'center',
					valign : 'middle',
					formatter : function(value, row, index) {
						return index + 1;
					}
				}, {
					title : 'MAC地址',
					field : 'mac',
					align : 'center',
					valign : 'middle',
				}, {
					title : '消息',
					field : 'message',
					align : 'center',
					valign : 'middle',
				}, {
					title : '执行状态',
					field : 'status',
					align : 'center',
					valign : 'middle',
					formatter : function(value, row, index) {
                    if(value != null)
                    {
                        if(value=="0")
                        {
                        	return "任务进行中";
                        }
                        if(value=="-1")
                        {
							return "任务出错";
                        }
                    }           
                    return "-";
                	}
				}, {
					title : '文件状态',
					field : 'downloading',
					align : 'center',
					valign : 'middle',
				}, {
					title : '成功文件大小',
					field : 'fileSize',
					align : 'center',
					valign : 'middle',
				}, {
					title : '解压文件个数',
					field : 'fileCount',
					align : 'center',
					valign : 'middle',
				}, {
					title : '最小文件大小',
					field : 'minFileSize',
					align : 'center',
					valign : 'middle',
				}, {
					title : '最大文件大小',
					field : 'maxFileSize',
					align : 'center',
					valign : 'middle',
				}]
			});
			$('#serach_button2').click(function() {
				$('.bootstrap-dialog-message .bootstrap-table').remove();
		        $('.bootstrap-dialog-message .clearfix').remove();
		        $('.bootstrap-dialog-message').append('<table id="table-wjxf_read"></table>');
				var $table = $('#table-wjxf_read');
				$table.bootstrapTable({
					method: 'post',
					contentType: "application/x-www-form-urlencoded",
					url : "downloadexDevJob/getDownloadexDevJob.action",
					//url: "json/getDownloadexDevJob.json",
					dataType : "json",
					striped: true,
					//toolbar : "#toolbar",
					uniqueId : "devClientVersionId",
					pagination : true, // 分页
					//search : true,
					sortable : false,
					sidePagination : "server", // 服务端处理分页
					queryParams: queryParams_wjxf,
					columns : [ {
						title : '序号',
						field : 'id',
						align : 'center',
						valign : 'middle',
						formatter : function(value, row, index) {
							return index + 1;
						}
					}, {
						title : 'MAC地址',
						field : 'mac',
						align : 'center',
						valign : 'middle',
					}, {
						title : '消息',
						field : 'message',
						align : 'center',
						valign : 'middle',
					}, {
						title : '执行状态',
						field : 'status',
						align : 'center',
						valign : 'middle',
						formatter : function(value, row, index) {
	                    if(value != null)
	                    {
	                        if(value=="0")
	                        {
	                        	return "任务进行中";
	                        }
	                        if(value=="-1")
	                        {
								return "任务出错";
	                        }
	                    }           
	                    return "-";
	                	}
					}, {
						title : '文件状态',
						field : 'processStatus',
						align : 'center',
						valign : 'middle',
					}, {
						title : '成功文件大小',
						field : 'fileSize',
						align : 'center',
						valign : 'middle',
					}, {
						title : '解压文件个数',
						field : 'fileCount',
						align : 'center',
						valign : 'middle',
					}, {
						title : '最小文件大小',
						field : 'minFileSize',
						align : 'center',
						valign : 'middle',
					}, {
						title : '最大文件大小',
						field : 'maxFileSize',
						align : 'center',
						valign : 'middle',
					}]
				});
				return false;
			})
		},
		buttons : [ {
			label : '关闭',
			action : function(dialogItself) {
				dialogItself.close();
			}
		}]
	});
}
$('#wjxf_add_rw').click(function() {
	var strHtml = '';
	strHtml += '<div class="row"><div class="col-sm-12"><form id="FormValidator"  class="form-horizontal">';
	strHtml += '<br><div class="form-group"><label class="col-sm-3 control-label">设备分类</label><div class="col-sm-3"><select id="groupId" name="groupId" class="selectpicker form-control"><option value="">选择分类</option><option value="1">铁路</option><option value="2">大巴</option></select></div><div class="col-sm-3" id="select_2" style="display:none;"><select id="groupId2" class="selectpicker form-control"></select></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">存放路径</label><div class="col-sm-8"><input type="text" id="folder" name="folder" class="form-control" placeholder="示例：update/tmppublish/update01/wfportal"></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">任务描述</label><div class="col-sm-8"><input type="text" id="desc" name="desc" class="form-control" placeholder="输入任务描述"></div></div>';
	strHtml += '</form></div></div>';

	BootstrapDialog.show({
		title : '添加任务',
		message : strHtml,
		onshown : function(dialogRef) {
			$('.selectpicker').selectpicker('refresh');
			$('#FormValidator').bootstrapValidator({
				message : 'This value is not valid',
				feedbackIcons : {
					valid : 'glyphicon glyphicon-ok',
					invalid : 'glyphicon glyphicon-remove',
					validating : 'glyphicon glyphicon-refresh'
				},
				fields : {
					groupId : {
						message : '设备分类无效',
						validators : {
							notEmpty : {
								message : '设备分类不能为空'
							}
						}
					},
					folder : {
						message : '存放路径无效',
						validators : {
							notEmpty : {
								message : '文件存放路径不能为空'
							}
						}
					},
					desc : {
						message : '任务描述无效',
						validators : {
							notEmpty : {
								message : '任务描述不能为空'
							}
						}
					},
				}
			});
		},
		buttons : [{
			label : '提交',
			cssClass : 'btn-primary',
			action : function(dialog) {
			$('#FormValidator').bootstrapValidator('validate');
			if ($('#FormValidator').data('bootstrapValidator').isValid()) {
				var data="";
				data = "groupId=" + $("#groupId").val() + "&folder=" + $("#folder").val() + "&desc=" + $("#desc").val();
				$.ajax({
					type : "POST",
					url : "downloadexJob/addDownloadexJobByPost.action",
					data : data,
					dataType : "json",
					success : function(jsonResult) {
						var Message = "";
						if(jsonResult["result"] == 600009)
						{
							Message = jsonResult["message"];
						}
						else
						{
							Message = ConfigCN[jsonResult["result"]];
						}
						if (jsonResult["result"] == 600000) {
							dialog.close();
						}
						BootstrapDialog.show({
	                        title: '系统提示',
	                        message: Message,
	                        buttons: [{
	                            label: '关闭',
	                            action: function(dialogItself){
	                                dialogItself.close();
	                            }
	                        }]
	                    });
	                    return false;
					}
				});
			}
			else{
				BootstrapDialog.alert({
					title : '验证失败',
					message : '请确认输入内容格式是否正确！',
					type : BootstrapDialog.TYPE_DANGER,
					buttonLabel : '确认'
					});
				}
				}
			},
			{
				label : '重置',
				action : function(dialogItself) {
				$('#FormValidator').data('bootstrapValidator').resetForm(true);
				$('.selectpicker').selectpicker('refresh');
			}
			}, {
				label : '关闭',
				action : function(dialogItself) {
				dialogItself.close();
			}
		} ]
	});
});
$('#wjxf_add').click(function() {
	if(TableID == 0)
	{
		return false;
	}
	var strHtml = '';
	strHtml += '<div class="row"><div class="col-sm-12"><form class="form-horizontal" id="FormValidator">';
	strHtml += '<br><div class="form-group" id="options_zxfs"><label class="col-sm-3 control-label">执行方式</label><div class="col-sm-8"><div class="btn-group" data-toggle="buttons"><label class="btn btn-primary active"><input type="radio" name="options" id="ClickAll" value="1" checked>批量</label><label class="btn btn-primary"><input type="radio" name="options" id="ClickOne" value="2">分组</label></div></div></div>';
	strHtml += '<div class="form-group" id="SB_All"><label class="col-sm-3 control-label">执行设备</label><div class="col-sm-8"><textarea id="macs" name="macs" class="form-control" rows="2"></textarea></div></div>';
	strHtml += '<div class="form-group" id="SB_One" style="display:none"><label class="col-sm-3 control-label">执行设备</label><div class="col-sm-3"><select id="groupId" class="selectpicker form-control"><option value="1">全部</option><option value="2">铁路</option><option value="3">大巴</option></select></div><div class="col-sm-3" id="select_2" style="display:none;"><select id="groupId2" class="selectpicker form-control"></select></div></div>';
	strHtml += '</form></div></div>';
	BootstrapDialog.show({
		title : '添加执行设备',
		message : strHtml,
		onshown : function(dialogRef) {
			$('#FormValidator').bootstrapValidator({
				message : 'This value is not valid',
				feedbackIcons : {
					valid : 'glyphicon glyphicon-ok',
					invalid : 'glyphicon glyphicon-remove',
					validating : 'glyphicon glyphicon-refresh'
				},
				fields : {
					macs : {
						message : '设备无效',
						validators : {
							notEmpty : {
								message : '设备不能为空'
							}
						}
					}
				}
			});
			$('.selectpicker').selectpicker('refresh');
			$('#ClickAll').parent().click(function() {
				$('#SB_All').show();
				$('#SB_One').hide();
			});
			$('#ClickOne').parent().click(function() {
				$('#SB_All').hide();
				$('#SB_One').show();
			});
			$('#groupId').change(function() {
				$('#groupId2').html('');
				if($(this).val()!=1){
					$('#select_2').show();
					if($(this).val()==2){
						$('#groupId2').append('<option value="2">全部</option>');
						$('#groupId2').append('<option value="4">中兴高达</option>');
					}
					if($(this).val()==3){
						$('#groupId2').append('<option value="3">全部</option>');
						$('#groupId2').append('<option value="5">锐捷</option>');
						$('#groupId2').append('<option value="6">傲天</option>');
					}
					$('#groupId2').selectpicker('refresh');
				}
				else
				{
					$('#select_2').hide();
				}
			});
		},
		buttons : [ {
			label : '提交',
			cssClass : 'btn-primary',
			action : function(dialog) {
				$('#FormValidator').bootstrapValidator('validate');
				if ($('#FormValidator').data('bootstrapValidator').isValid()) {
					var data="";
					var options_select=$('#options_zxfs input:radio:checked').val();
					groupIds = $("#groupId2").val();
					if(groupIds == null)
					{
						groupIds = $("#groupId").val();
					}
					if(options_select==2)
					{
						data = "downloadex_job_id=" + TableID + "&group_ids=" + groupIds;
					}
					if(options_select==1)
					{
						data = "downloadex_job_id=" + TableID + "&macs=" + $("#macs").val();
					}
					$.ajax({
			            type: "post",
			            url: "downloadexJob/updateDownloadexJob.action",
			            //url: "json/updateDownloadexJob.json",
			            timeout: 60000,
			            dataType: "json",
			            data: data,
			            success: function (jsonResult) {
			            	if(jsonResult["code"] == 0)
			            	{
			            		$('#table-wjxf').bootstrapTable('refresh', {
									url : 'downloadexJob/getDownloadexJob.action'
								});
								TableID = 0;
								$('#wjxf_add').addClass('disabled');
								$('#wjxf_add').prop('disabled', true);
			            		BootstrapDialog.show({
			                        title: '系统提示',
			                        message: jsonResult["message"] ,
			                        buttons: [{
			                            label: '关闭',
			                            action: function(dialogItself){
			                                dialogItself.close();
			                            }
			                        }]
			                    });
			                    dialog.close();
			            	}
			            	else
			            	{
			            		BootstrapDialog.show({
			                        title: '系统提示',
			                        message: jsonResult["message"] ,
			                        buttons: [{
			                            label: '关闭',
			                            action: function(dialogItself){
			                                dialogItself.close();
			                            }
			                        }]
			                    });
			                    return false;
			            	}
			            	
			            },
			            error: function (request, status, err) {
			                if (status == "timeout")
			                {
			                    BootstrapDialog.show({
			                        title: '系统提示',
			                        message: '请求超时！',
			                        buttons: [{
			                            label: '关闭',
			                            action: function(dialogItself){
			                                dialogItself.close();
			                            }
			                        }]
			                    });
			                }
			            }
			        });
				} else {
					BootstrapDialog.alert({
						title : '验证失败',
						message : '请确认输入内容格式是否正确！',
						type : BootstrapDialog.TYPE_DANGER,
						buttonLabel : '确认'
					});
				}
			}
		}, {
			label : '关闭',
			action : function(dialogItself) {
				dialogItself.close();
			}
		}]
	});

});
//设备流量信息
var $table = $('#table-llxx');
$table.bootstrapTable({
	method: 'post',
	contentType: "application/x-www-form-urlencoded",
	url : "devFlowInfo/queryDevTracfficByPage.action",
	// url: "json/getAllVersions.json",
	dataType : "json",
	striped: true,
	//toolbar : "#toolbar",
	uniqueId : "id",
	pagination : true, // 分页
	singleSelect : false,
	//search : true,
	sortable : false,
	sidePagination : "server", // 服务端处理分页
	queryParams: queryParams_llxx,
	columns : [ {
		title : '序号',
		field : 'id',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			return index + 1;
		}
	}, {
		title : '设备型号',
		field : 'devModel',
		align : 'center',
		valign : 'middle',
	}, {
		title : '设备序列号',
		field : 'mac',
		align : 'center',
		valign : 'middle',
	}, {
		title : '设备消耗总流量',
		field : 'deviceTracffic',
		align : 'center',
		valign : 'middle',
	}, {
		title : '卡1 ICCID号',
		field : 'sim1Iccid',
		align : 'center',
		valign : 'middle',
	}, {
		title : '卡1号运营商',
		field : 'sim1Iccid',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			if(value != null)
			{
				if(value.indexOf('898600')==0 || value.indexOf('898602')==0){
				    return "中国移动";
				}
				if(value.indexOf('898601')==0 || value.indexOf('898609')==0){
				    return "中国联通";
				}
				if(value.indexOf('898603')==0 || value.indexOf('898606')==0){
				    return "中国电信";
				}
			}
			return "-";
		}
	}, {
		title : '设备上报卡1流量',
		field : 'sim1DeviceTraffic',
		align : 'center',
		valign : 'middle',
	}, {
		title : '运营商统计流量',
		field : 'sim1OperatorTraffic',
		align : 'center',
		valign : 'middle',
	}, {
		title : '卡2 ICCID号',
		field : 'sim2Iccid',
		align : 'center',
		valign : 'middle',
	}, {
		title : '卡2运营商',
		field : 'sim2Iccid',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			if(value != null)
			{
				if(value.indexOf('898600')==0 || value.indexOf('898602')==0){
				    return "中国移动";
				}
				if(value.indexOf('898601')==0 || value.indexOf('898609')==0){
				    return "中国联通";
				}
				if(value.indexOf('898603')==0 || value.indexOf('898606')==0){
				    return "中国电信";
				}
			}
			return "-";
		}
	}, {
		title : '设备上报卡2流量',
		field : 'sim2DeviceTraffic',
		align : 'center',
		valign : 'middle',
	}, {
		title : '运营商统计流量',
		field : 'sim2OperatorTraffic',
		align : 'center',
		valign : 'middle',
	}]
});
//设备运行信息
var $table = $('#table-yxxx');
$table.bootstrapTable({
	method: 'post',
	contentType: "application/x-www-form-urlencoded",
	url : APIUrl + "getDeviceRealtimeInfo.action",
	//url: "json/getDeviceRealtimeInfo.json",
	dataType : "json",
	striped: true,
	toolbar : "#toolbar",
	uniqueId : "devClientVersionId",
	pagination : true, // 分页
	singleSelect : false,
	search : true,
	sortable : false,
	sidePagination : "server", // 服务端处理分页
	queryParams: queryParams, //参数
	columns : [ {
		title : '序号',
		field : 'id',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			return index + 1;
		}
	}, {
		title : '设备型号',
		field : 'equipment_model',
		align : 'center',
		valign : 'middle',
	}, {
		title : '序列号',
		field : 'dev_mac',
		align : 'center',
		valign : 'middle',
	}, {
		title : '厂商',
		field : 'factory',
		align : 'center',
		valign : 'middle',
	}, {
		title : '联系人',
		field : 'contacts',
		align : 'center',
		valign : 'middle',
	}, {
		title : '联系电话',
		field : 'contact_phone',
		align : 'center',
		valign : 'middle',
	}, {
		title : '质保到期时间',
		field : 'warranty_expiration_time',
		align : 'center',
		valign : 'middle',
	}, {
		title : '批次',
		field : 'batch',
		align : 'center',
		valign : 'middle',
	}, {
		title : '设备状态',
		field : 'dev_status',
		align : 'center'
	}, {
		title : '安装状态',
		field : 'installation_status',
		align : 'center',
		valign : 'middle',
	}, {
		title : '设备运行状态',
		field : 'installation_status',
		align : 'center',
		valign : 'middle',
	}, {
		title : 'GPS信息',
		field : 'gpsInfo',
		align : 'center',
		valign : 'middle',
	}, {
		title : '软件版本',
		field : 'soft_version',
		align : 'center',
		valign : 'middle',
	}, {
		title : '硬件版本',
		field : 'hard_version',
		align : 'center',
		valign : 'middle',
	}, {
		title : '最后上报时间',
		field : 'device_cur_time',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			return new Date(value).format("yyyy-MM-dd HH:mm:ss");
		}
	}, {
		title : '开始时间',
		field : 'device_cur_time_from',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			return new Date(value).format("yyyy-MM-dd HH:mm:ss");
		}
	}, {
		title : '结束时间',
		field : 'device_cur_time_to',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			return new Date(value).format("yyyy-MM-dd HH:mm:ss");
		}
	}]
});
//SIM卡信息
var $table = $('#table-sim');
$table.bootstrapTable({
	method: 'post',
	contentType: "application/x-www-form-urlencoded",
	url : "deviceSim/getDeviceSim.action",
	//url: "json/getDeviceSim.json",
	dataType : "json",
	striped: true,
	toolbar : "#toolbar",
	uniqueId : "devClientVersionId",
	pagination : true, // 分页
	singleSelect : false,
	//search : true,
	sortable : false,
	sidePagination : "server", // 服务端处理分页
	queryParams: queryParams,
	columns : [ {
		title : '序号',
		field : 'id',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			return index + 1;
		}
	}, {
		title : '设备序列号',
		field : 'mac',
		align : 'center',
		valign : 'middle',
	}/*, {
		title : 'sim_number',
		field : 'sim_number',
		align : 'center',
	}*/, {
		title : '卡1 ICCID号',
		field : 'iccid1',
		align : 'center',
		valign : 'middle',
	}, {
		title : '卡1 运营商',
		field : 'iccid1',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			if(value != null)
			{
				if(value.indexOf('898600')==0 || value.indexOf('898602')==0){
				    return "中国移动";
				}
				if(value.indexOf('898601')==0 || value.indexOf('898609')==0){
				    return "中国联通";
				}
				if(value.indexOf('898603')==0 || value.indexOf('898606')==0){
				    return "中国电信";
				}
			}			
			return "-";
		}
	},{
		title : '卡1在线状态',
		field : 'sim_status',
		align : 'center',
		valign : 'middle',
	}, {
		title : '卡2 ICCID号',
		field : 'iccid2',
		align : 'center',
		valign : 'middle',
	}, {
		title : '卡2 运营商',
		field : 'iccid2',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			if(value != null)
			{
				if(value.indexOf('898600')==0 || value.indexOf('898602')==0){
				    return "中国移动";
				}
				if(value.indexOf('898601')==0 || value.indexOf('898609')==0){
				    return "中国联通";
				}
				if(value.indexOf('898603')==0 || value.indexOf('898606')==0){
				    return "中国电信";
				}
			}
			return "-";
		}
	},{
		title : '卡2在线状态',
		field : 'sim_status',
		align : 'center',
		valign : 'middle',
	}]
});
// 流量配置
var $table = $('#table-llpz');
$table.bootstrapTable({
	method: 'get',
	contentType: "application/x-www-form-urlencoded",
	// url: APIUrl + "getAllVersions.action",
	url : "data.json",
	dataType : "json",
	striped: true,
	toolbar : "#toolbar",
	uniqueId : "devClientVersionId",
	pagination : true, // 分页
	singleSelect : false,
	search : true,
	sortable : false,
	sidePagination : "server", // 服务端处理分页
	idField:"id",
	columns : [{
            idfield: 'state',
            checkbox: true
        },{
		title : '序号',
		datafield : 'id',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			return index + 1;
		}
	}, {
		title : '设备名称',
		field : 'devVersion',
		align : 'center',
		valign : 'middle',
	}, {
		title : '设备序列号',
		field : 'devClientUrl',
		align : 'center',
		valign : 'middle',
	}, {
		title : '起始IP',
		field : 'checksum',
		align : 'center',
		valign : 'middle',
	}, {
		title : '结束IP',
		field : 'checksum',
		align : 'center',
		valign : 'middle',
	}, {
		title : '上传速率',
		field : 'checksum',
		align : 'center',
		valign : 'middle',
	}, {
		title : '下载速率',
		field : 'checksum',
		align : 'center',
		valign : 'middle',
	}, {
		title : '流量限速',
		field : 'checksum',
		align : 'center',
		valign : 'middle',
	}, {
		title : '下发标记',
		field : 'checksum',
		align : 'center',
		valign : 'middle',
	}, {
		title : '操作',
		field : 'cz',
		align : 'center',
		valign : 'middle',
	}],
	onLoadSuccess : function()
	{
		var $table = $('#table-llpz');
		//全选复选框触发
		$table.find('input[name="btSelectAll"]').click(function(){
    		//判断是否选中
    		//console.log($table.find('input[name="btSelectAll"]').prop("checked"));
    		if($table.find('input[name="btSelectAll"]').prop("checked") == true)
    		{
    			$table.find('input[name="btSelectItem"]').each(function(){
		    		TableIDArray.push(parseInt($(this).val()));
		    	})
		    	TableIDArray = unique(TableIDArray);
    		}
    		else
    		{
    			$table.find('input[name="btSelectItem"]').each(function(){
    				if($(this).prop("checked") == false){
    					TableIDArray.splice(TableIDArray.indexOf(parseInt($(this).val())),1);
						//console.log(TableIDArray + "删除" + parseInt($(this).val()));
					}
					//console.log($(this).val());
    			})
    			//console.log("取消全选");
    		}

    	})
    	//遍历复选框
		$table.find('input[name="btSelectItem"]').each(function(){
			if(TableIDArray.indexOf(parseInt($(this).val())) != -1){
				$(this).attr('checked',true);
			}
			//$(this).attr('checked',true);
			//var value = $(this).attr('data-index');
			//console.log($(this).val());
			
    	})
    	$table.find('input[name="btSelectItem"]').change(function(){
    		if($(this).prop("checked") == true){
				TableIDArray.push(parseInt($(this).val()));
			}
			else
			{
				TableIDArray.splice(TableIDArray.indexOf(parseInt($(this).val())),1);
			}
    	})
    	TableIDArray = unique(TableIDArray);
		//console.log(unique(TableIDArray));
	},
	onClickRow : function(row, $element) {
		//alert(row.id)
		console.log(row.id);
	}
});
$('#llpz_add').click(function() {
	var strHtml = '';
	strHtml += '<div class="row"><div class="col-sm-12"><form class="form-horizontal">';
	strHtml += '<br><div class="form-group"><label class="col-sm-3 control-label">流量限速</label><div class="col-sm-8"><div class="btn-group" data-toggle="buttons"><label class="btn btn-primary active"><input type="radio" name="options" id="option1" autocomplete="off" checked>启用</label><label class="btn btn-primary"><input type="radio" name="options" id="option2" autocomplete="off">禁用</label></div></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">起始IP</label><div class="col-sm-8"><input type="text" id="bb_add_devVersion" name="bb_add_devVersion" class="form-control" maxlength="8" placeholder="请输入起始IP"></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">结束IP</label><div class="col-sm-8"><input type="text" id="bb_add_devVersion" name="bb_add_devVersion" class="form-control" maxlength="8" placeholder="请输入结束IP"></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">上传速率</label><div class="col-sm-8"><div class="input-group"><input type="number" class="form-control" placeholder="请输入上传速率"><span class="input-group-addon" id="basic-addon2">kbps</span></div></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">下载速率</label><div class="col-sm-8"><div class="input-group"><input type="number" class="form-control" placeholder="请输入下载速率"><span class="input-group-addon" id="basic-addon2">kbps</span></div></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">执行设备</label><div class="col-sm-8"><textarea id="sb_add_macs" class="form-control" rows="2"></textarea></div></div>';
	strHtml += '</form></div></div>';
	BootstrapDialog.show({
		title : '添加配置',
		message : strHtml,
		buttons : [ {
			label : '提交',
			cssClass : 'btn-primary',
			action : function(dialog) {

			}
		}, {
			label : '关闭',
			action : function(dialogItself) {
				dialogItself.close();
			}
		} ]
	});
});
$('#SSHConnect').click(function() {
	var data="";
	data="macs=" + $("#macs").val();
	$.ajax({
        type: "POST",
        url: APIUrl + "checkOnLineBySn.action",
    	//url: "json/error.json",
        timeout: 60000,
        dataType: "json",
        data: data,
        success: function (jsonResult) {
            if(jsonResult["code"] == 0)
        	{
				$('#macs').attr("readonly","readonly");
				errorNotify("成功：",jsonResult["message"],"success");
				$('#SSHConnect').addClass('disabled');
				$('#SSHConnect').prop('disabled', true);
				$('#SSHReturn').removeClass('disabled');
				$('#SSHReturn').prop('disabled', false);
        	}
        	else
        	{
				errorNotify("错误：",jsonResult["message"],null);
                return false;
        	}
        },
        error: function (request, status, err) {
            if (status == "timeout")
            {
                BootstrapDialog.show({
                    title: '系统提示',
                    message: '请求超时！',
                    buttons: [{
                        label: '关闭',
                        action: function(dialogItself){
                            dialogItself.close();
                        }
                    }]
                });
            }
        }
    });
});
$('#SSHReturn').click(function() {
	var data="";
	var strmacs=$("#macs").val();
	var strdata=$("#data").val();
	data="macs=" + strmacs + "&data=" + strdata;
	$.ajax({
        type: "POST",
        url: "execJob/addDevJob.action",
    	//url: "json/error.json",
        timeout: 60000,
        dataType: "json",
        data: data,
        success: function (jsonResult) {
            if(jsonResult["code"] == 0)
        	{
        		errorNotify("成功：",'命令下发成功',"success");
        		var execJobId = jsonResult["execJobId"];
				$('#data').attr("readonly","readonly");
				//$('#SSHReturn').addClass('disabled');
				//$('#SSHReturn').prop('disabled', true);
				//jsonResult["execJobId"]
				var remarks = "";
				setInterval(refresh, 10000);
				var refresh = function() {
					data="mac=" + strmacs + "&data=" + strdata + "&execJobId=" + execJobId + "&remarks=" + remarks;
					$.ajax({
				        type: "POST",
				        url: "execJob/getExecDevJobResult.action",
				    	//url: "json/error.json",
				        timeout: 60000,
				        dataType: "json",
				        data: data,
				        success: function (jsonResult) {
				            var TempArray = jsonResult["message"].split(",");
				            if(jsonResult["message"]!="")
				            {
				            	remarks = jsonResult["message"];
				        		clearInterval(refresh);
				            }
				            var strHtml = "<li>" + jsonResult["cmd"] + "</li>";
				            TempArray.forEach(function(e){
				            	if(e!="")
				                {
				                	strHtml += '<li>' + e.replace(/\n/g,'<br>') + '</li>';
				                }
				            })
				            $('#log').prepend(strHtml);
	            			//console.log(jsonResult)
				        }
				    });
				}
				refresh();

        	}
        	else
        	{
				errorNotify("错误：",jsonResult["message"],null);
                return false;
        	}
        },
        error: function (request, status, err) {
            if (status == "timeout")
            {
                BootstrapDialog.show({
                    title: '系统提示',
                    message: '请求超时！',
                    buttons: [{
                        label: '关闭',
                        action: function(dialogItself){
                            dialogItself.close();
                        }
                    }]
                });
            }
        }
    });
	
});
// 路局信息
var $table = $('#table-ljxx');
$table.bootstrapTable({
	method: 'post',
	contentType: "application/x-www-form-urlencoded",
	//url : APIUrl + "getAllVersions.action",
	url : "trainLine/queryTrainLineByPage.action",
	//url: "json/getExecJobByPage.json",
	dataType : "json",
	striped: true,
	toolbar : "#toolbar",
	uniqueId : "trainLineId",
	pagination : true, // 分页
	singleSelect : false,
	idField:"trainLineId",
	//search : true,
	sortable : false,
	sidePagination : "server", // 服务端处理分页
	queryParams: queryParams_ljxx,
	columns : [ {
            idfield: 'state',
            checkbox: true,
			valign : 'middle',
        },{
		title : '序号',
		field : 'id',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			return index + 1;
		}
	}, {
		title : '路局',
		field : 'trainBureauName',
		align : 'center',
		valign : 'middle',
	}, {
		title : '车段',
		field : 'trainStationName',
		align : 'center',
		valign : 'middle',
	}, {
		title : '车次',
		field : 'lineName',
		align : 'center',
		valign : 'middle',
	}, {
		title : '起点站',
		field : 'startStation',
		align : 'center',
		valign : 'middle',
	}, {
		title : '终点站',
		field : 'endStation',
		align : 'center',
		valign : 'middle',
	}, {
		title : '操作',
		field : 'cz',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			var strHtml='<button class="btn btn-primary" type="submit" onclick="ljxx_edit('+ row.trainLineId + ');">修改</button>';
			return strHtml;
		}
	} ],
	onLoadSuccess : function()
	{
		var $table = $('#table-ljxx');
		//全选复选框触发
		$table.find('input[name="btSelectAll"]').click(function(){
    		//判断是否选中
    		//console.log($table.find('input[name="btSelectAll"]').prop("checked"));
    		if($table.find('input[name="btSelectAll"]').prop("checked") == true)
    		{
    			$table.find('input[name="btSelectItem"]').each(function(){
		    		TableIDArray.push(parseInt($(this).val()));
		    	})
		    	TableIDArray = unique(TableIDArray);
    		}
    		else
    		{
    			$table.find('input[name="btSelectItem"]').each(function(){
    				if($(this).prop("checked") == false){
    					TableIDArray.splice(TableIDArray.indexOf(parseInt($(this).val())),1);
						//console.log(TableIDArray + "删除" + parseInt($(this).val()));
					}
					//console.log($(this).val());
    			})
    			//console.log("取消全选");
    		}

    	})
    	$table.find('input[name="btSelectAll"]').click(function(){
	    	if($table.find('input[name="btSelectAll"]').prop("checked") == true)
			{
				$('#ljxx_del').removeClass('disabled');
				$('#ljxx_del').prop('disabled', false);
			}
			else
			{
				$('#ljxx_del').addClass('disabled');
				$('#ljxx_del').prop('disabled', true);
			}
		})
    	//遍历复选框
		$table.find('input[name="btSelectItem"]').each(function(){
			if(TableIDArray.indexOf(parseInt($(this).val())) != -1){
				$(this).attr('checked',true);
			}
			//$(this).attr('checked',true);
			//var value = $(this).attr('data-index');
			//console.log($(this).val());
			
    	})
    	$table.find('input[name="btSelectItem"]').change(function(){
    		if($(this).prop("checked") == true){
				TableIDArray.push(parseInt($(this).val()));
			}
			else
			{
				TableIDArray.splice(TableIDArray.indexOf(parseInt($(this).val())),1);
			}

			if(TableIDArray.length != 0){
				$('#ljxx_del').removeClass('disabled');
				$('#ljxx_del').prop('disabled', false);
			}
			else
			{
				$('#ljxx_del').addClass('disabled');
				$('#ljxx_del').prop('disabled', true);
			}

    	})
    	TableIDArray = unique(TableIDArray);
		//console.log(unique(TableIDArray));
	}
});
$('#ljxx_add').click(function() {
	var strRailwayBureau = "";
	$.ajax({
        type: "post",
        url: "selectObject/getRailwayBureau.action",
        //url: "json/getDeviceModel.json",
        contentType: "application/json",
        dataType: "json",
        //data: JSON.stringify({ "BuIds": ["1", "2", "3"] }),
        success: function (jsonResult) {
            $.each(jsonResult,function(i,item){
                strRailwayBureau += '<option value="'+ item["value"] + '">'+ item["text"] + '</option>';
            })
            var strHtml="";
			strHtml += '<div class="row"><div class="col-sm-12"><form class="form-horizontal" id="FormValidator">';
			strHtml += '<br><div class="form-group"><label class="col-sm-3 control-label">路局</label><div class="col-sm-8"><select id="RailwayBureau2" name="RailwayBureau2" class="selectpicker form-control" data-live-search="true"><option value="">选择路局</option>' + strRailwayBureau + '</select></div></div>';
			strHtml += '<div class="form-group" id="RailwayStation_div2" style="display:none;"><label class="col-sm-3 control-label">车段</label><div class="col-sm-8"><select id="RailwayStation2" name="RailwayStation2" class="selectpicker form-control" data-live-search="true"></select></div></div>';
			strHtml += '<div class="form-group"><label class="col-sm-3 control-label">车次</label><div class="col-sm-8"><input type="text" id="RailwayLine2" name="RailwayLine2" class="form-control" placeholder="请输入车次"></div></div>';
			strHtml += '<div class="form-group"><label class="col-sm-3 control-label">起点站</label><div class="col-sm-8"><input type="text" id="startStation2" name="startStation2" class="form-control" placeholder="起点站"></div></div>';
			strHtml += '<div class="form-group"><label class="col-sm-3 control-label">终点站</label><div class="col-sm-8"><input type="text" id="endStation2" name="endStation2" class="form-control" placeholder="终点站"></div></div>';
			strHtml += '</form></div></div>';	

			BootstrapDialog.show({
				title : '添加路局信息',
				message : strHtml,
				onshown : function(dialogRef) {

					$('.selectpicker').selectpicker('refresh');

					$('#RailwayBureau2').change(function() {
						if($(this).val()!=""){
				            var data="";
				            $('#RailwayStation_div2').show();
				            data = "trainBureauId=" + $(this).val();
				            $.ajax({
				                type: "post",
				                contentType: "application/x-www-form-urlencoded",
				                url: "selectObject/getRailwayStation.action",
				                dataType: "json",
				                data: data,
				                success: function (jsonResult) {
				                    $('#RailwayStation2').html('<option value="">选择车段</option>');
				                    $.each(jsonResult,function(i,item){
				                        $('#RailwayStation2').append('<option value="'+ item["value"] + '">'+ item["text"] + '</option>');
				                    })
				                    $('#RailwayStation2').selectpicker('refresh');
				                },
				                error:function(){
				                    errorNotify(null,"无法获取车段信息！");
				                }
				            });
				        }
				        else
				        {
				            $('#RailwayStation_div2').hide();
				            $('#RailwayStation2').html('');
				        }
				    })


					$('#FormValidator').bootstrapValidator({
						message : 'This value is not valid',
						feedbackIcons : {
							valid : 'glyphicon glyphicon-ok',
							invalid : 'glyphicon glyphicon-remove',
							validating : 'glyphicon glyphicon-refresh'
						},
						fields : {
							RailwayBureau2 : {
								message : '路局无效',
								validators : {
									notEmpty : {
										message : '请选择路局'
									}
								}
							},
							RailwayStation2 : {
								message : '车段无效',
								validators : {
									notEmpty : {
										message : '请选择车段'
									}
								}
							},
							RailwayLine2 : {
								message : '车次无效',
								validators : {
									notEmpty : {
										message : '车次不能为空'
									}
								}
							}
						}
					});
				},
				buttons : [{
					label : '提交',
					cssClass : 'btn-primary',
					action : function(dialog) {
						$('#FormValidator').bootstrapValidator('validate');
						if ($('#FormValidator').data('bootstrapValidator').isValid()) {
							var data = "";
							data = "trainBureauId=" + $('#RailwayBureau2').val() + "&trainStationId=" + $('#RailwayStation2').val() + "&lineName=" + $('#RailwayLine2').val() + "&startStation=" + $('#startStation2').val() + "&endStation=" + $('#endStation2').val();
							$.ajax({
					            type: "post",
					            url: "trainLine/addTrainLine.action",
					            timeout: 60000,
					            dataType: "json",
					            data: data,
					            success: function (jsonResult) {
					            	var Message = "";
									if(jsonResult["result"] == 600009)
									{
										Message = jsonResult["message"];
									}
									else
									{
										Message = ConfigCN[jsonResult["result"]];
									}
									if (jsonResult["result"] == 600000) {
										$('#table-ljxx').bootstrapTable('refresh', {
											url : 'trainLine/queryTrainLineByPage.action'
										});
										$('#ljxx_del').addClass('disabled');
										$('#ljxx_del').prop('disabled', true);
										dialog.close();
									}
									BootstrapDialog.show({
				                        title: '系统提示',
				                        message: Message,
				                        buttons: [{
				                            label: '关闭',
				                            action: function(dialogItself){
				                                dialogItself.close();
				                            }
				                        }]
				                    });
					            },
					            error: function (request, status, err) {
					                if (status == "timeout")
					                {
					                    BootstrapDialog.show({
					                        title: '系统提示',
					                        message: '请求超时！',
					                        buttons: [{
					                            label: '关闭',
					                            action: function(dialogItself){
					                                dialogItself.close();
					                            }
					                        }]
					                    });
					                }
					            }
					        });
						
						} else {
							BootstrapDialog.alert({
								title : '验证失败',
								message : '请确认输入内容格式是否正确！',
								type : BootstrapDialog.TYPE_DANGER,
								buttonLabel : '确认'
							});
						}
					}
				},
				{
					label : '重置',
					action : function(dialogItself) {
						$('#FormValidator') .data('bootstrapValidator').resetForm(true);
						$('.selectpicker').selectpicker('refresh');
						$('#RailwayStation_div2').hide();
				        $('#RailwayStation2').html('');
				        $('#startStation2').val('');
				        $('#endStation2').val('');
					}
				},
				{
					label : '关闭',
					action : function(dialogItself) {
						dialogItself.close();
					}
				} ]
			});
        },
        error:function(){
            errorNotify(null,"无法获取路局信息！");
        }
    });
});
function ljxx_edit(trainLineId) {
	var data = "";
	data = "trainLineId=" + trainLineId;
	$.ajax({
        type: "post",
        url: "trainLine/getTrainLine.action",
        timeout: 60000,
        dataType: "json",
        data: data,
        success: function (jsonResult) {
			var trainBureauId = jsonResult["trainBureauId"];
			var trainStationId = jsonResult["trainStationId"];
			var lineName = jsonResult["lineName"];
			var startStation = jsonResult["startStation"];
			var endStation = jsonResult["endStation"];

			var strRailwayBureau = "";
			$.ajax({
		        type: "post",
		        url: "selectObject/getRailwayBureau.action",
		        //url: "json/getDeviceModel.json",
		        contentType: "application/json",
		        dataType: "json",
		        //data: JSON.stringify({ "BuIds": ["1", "2", "3"] }),
		        success: function (jsonResult) {
		            $.each(jsonResult,function(i,item){
		                strRailwayBureau += '<option value="'+ item["value"] + '">'+ item["text"] + '</option>';
		            })
		            var strHtml="";
					strHtml += '<div class="row"><div class="col-sm-12"><form class="form-horizontal" id="FormValidator">';
					strHtml += '<br><div class="form-group"><label class="col-sm-3 control-label">路局</label><div class="col-sm-8"><select id="RailwayBureau2" name="RailwayBureau2" class="selectpicker form-control" data-live-search="true"><option value="">选择路局</option>' + strRailwayBureau + '</select></div></div>';
					strHtml += '<div class="form-group" id="RailwayStation_div2"><label class="col-sm-3 control-label">车段</label><div class="col-sm-8"><select id="RailwayStation2" name="RailwayStation2" class="selectpicker form-control" data-live-search="true"></select></div></div>';
					strHtml += '<div class="form-group"><label class="col-sm-3 control-label">车次</label><div class="col-sm-8"><input type="text" id="RailwayLine2" name="RailwayLine2" class="form-control" placeholder="请输入车次" value="' + lineName + '"></div></div>';
					strHtml += '<div class="form-group"><label class="col-sm-3 control-label">起点站</label><div class="col-sm-8"><input type="text" id="startStation2" name="startStation2" class="form-control" placeholder="起点站" value="' + startStation + '"></div></div>';
					strHtml += '<div class="form-group"><label class="col-sm-3 control-label">终点站</label><div class="col-sm-8"><input type="text" id="endStation2" name="endStation2" class="form-control" placeholder="终点站" value="' + endStation + '"></div></div>';
					strHtml += '</form></div></div>';	

					BootstrapDialog.show({
						title : '修改路局信息',
						message : strHtml,
						onshown : function(dialogRef) {
							$('#RailwayBureau2').selectpicker('refresh');
							$('#RailwayBureau2').selectpicker('val', trainBureauId);
							$('#RailwayBureau2').selectpicker('refresh');
							var data="";
				            $('#RailwayStation_div2').show();
				            data = "trainBureauId=" + trainBureauId;
							$.ajax({
				                type: "post",
				                contentType: "application/x-www-form-urlencoded",
				                url: "selectObject/getRailwayStation.action",
				                dataType: "json",
				                data: data,
				                success: function (jsonResult) {
				                    $('#RailwayStation2').html('<option value="">选择车段</option>');
				                    $.each(jsonResult,function(i,item){
				                        $('#RailwayStation2').append('<option value="'+ item["value"] + '">'+ item["text"] + '</option>');
				                    })
									$('#RailwayStation2').selectpicker('refresh');
						            $('#RailwayStation2').selectpicker('val', trainStationId);
									$('#RailwayStation2').selectpicker('refresh');
				                },
				                error:function(){
				                    errorNotify(null,"无法获取车段信息！");
				                }
				            });

							$('#RailwayBureau2').change(function() {
								if($(this).val()!=""){
						            var data="";
						            $('#RailwayStation_div2').show();
						            data = "trainBureauId=" + $(this).val();
						            $.ajax({
						                type: "post",
						                contentType: "application/x-www-form-urlencoded",
						                url: "selectObject/getRailwayStation.action",
						                dataType: "json",
						                data: data,
						                success: function (jsonResult) {
						                    $('#RailwayStation2').html('<option value="">选择车段</option>');
						                    $.each(jsonResult,function(i,item){
						                        $('#RailwayStation2').append('<option value="'+ item["value"] + '">'+ item["text"] + '</option>');
						                    })
						                    $('#RailwayStation2').selectpicker('refresh');
						                },
						                error:function(){
						                    errorNotify(null,"无法获取车段信息！");
						                }
						            });
						        }
						        else
						        {
						            $('#RailwayStation_div2').hide();
						            $('#RailwayStation2').html('');
						        }
						    })


							$('#FormValidator').bootstrapValidator({
								message : 'This value is not valid',
								feedbackIcons : {
									valid : 'glyphicon glyphicon-ok',
									invalid : 'glyphicon glyphicon-remove',
									validating : 'glyphicon glyphicon-refresh'
								},
								fields : {
									RailwayBureau2 : {
										message : '路局无效',
										validators : {
											notEmpty : {
												message : '请选择路局'
											}
										}
									},
									RailwayStation2 : {
										message : '车段无效',
										validators : {
											notEmpty : {
												message : '请选择车段'
											}
										}
									},
									RailwayLine2 : {
										message : '车次无效',
										validators : {
											notEmpty : {
												message : '车次不能为空'
											}
										}
									}
								}
							});
						},
						buttons : [{
							label : '提交',
							cssClass : 'btn-primary',
							action : function(dialog) {
								$('#FormValidator').bootstrapValidator('validate');
								if ($('#FormValidator').data('bootstrapValidator').isValid()) {
									var data = "";
									data = "trainLineId=" + trainLineId + "&trainBureauId=" + $('#RailwayBureau2').val() + "&trainStationId=" + $('#RailwayStation2').val() + "&lineName=" + $('#RailwayLine2').val() + "&startStation=" + $('#startStation2').val() + "&endStation=" + $('#endStation2').val();
									$.ajax({
							            type: "post",
							            url: "trainLine/updateTrainLineById.action",
							            timeout: 60000,
							            dataType: "json",
							            data: data,
							            success: function (jsonResult) {
							            	if(jsonResult["result"] == 600005)
							            	{
							            		$('#table-ljxx').bootstrapTable('refresh', {
													url : 'trainLine/queryTrainLineByPage.action'
												});
												$('#ljxx_del').addClass('disabled');
												$('#ljxx_del').prop('disabled', true);
							            		BootstrapDialog.show({
							                        title: '系统提示',
							                        message: ConfigCN[jsonResult["result"]],
							                        buttons: [{
							                            label: '关闭',
							                            action: function(dialogItself){
							                                dialogItself.close();
							                            }
							                        }]
							                    });
							                    dialog.close();
							            	}
							            	else
							            	{
							            		BootstrapDialog.show({
							                        title: '系统提示',
							                        message: ConfigCN[jsonResult["result"]],
							                        buttons: [{
							                            label: '关闭',
							                            action: function(dialogItself){
							                                dialogItself.close();
							                            }
							                        }]
							                    });
							                    return false;
							            	}
							            	
							            },
							            error: function (request, status, err) {
							                if (status == "timeout")
							                {
							                    BootstrapDialog.show({
							                        title: '系统提示',
							                        message: '请求超时！',
							                        buttons: [{
							                            label: '关闭',
							                            action: function(dialogItself){
							                                dialogItself.close();
							                            }
							                        }]
							                    });
							                }
							            }
							        });
								
								} else {
									BootstrapDialog.alert({
										title : '验证失败',
										message : '请确认输入内容格式是否正确！',
										type : BootstrapDialog.TYPE_DANGER,
										buttonLabel : '确认'
									});
								}
							}
						},
						{
							label : '重置',
							action : function(dialogItself) {
								$('#FormValidator') .data('bootstrapValidator').resetForm(true);
								$('.selectpicker').selectpicker('refresh');
								$('#RailwayStation_div2').hide();
						        $('#RailwayStation2').html('');
						        $('#startStation2').val('');
						        $('#endStation2').val('');
							}
						},
						{
							label : '关闭',
							action : function(dialogItself) {
								dialogItself.close();
							}
						} ]
					});
		        },
		        error:function(){
		            errorNotify(null,"无法获取路局信息！");
		        }
		    });
        },
        error: function (request, status, err) {
            if (status == "timeout")
            {
                BootstrapDialog.show({
                    title: '系统提示',
                    message: '请求超时！',
                    buttons: [{
                        label: '关闭',
                        action: function(dialogItself){
                            dialogItself.close();
                        }
                    }]
                });
            }
        }
    });
	
};
$('#ljxx_del').click(function() {
	if(TableIDArray.length!=0)
	{
		BootstrapDialog.confirm({
            title: '批量删除确认提醒',
            message: '是否确认删除所选择车次信息？',
            closable: true,
            draggable: true,
            btnCancelLabel: '取消',
            btnOKLabel: '确认',
            callback: function(result) {
                if(result) {
                    var data = "";
					data = "trainLineIds=" + String(TableIDArray);
					$.ajax({
			            type: "post",
			            url: "trainLine/doDelTrainLine.action",
			            timeout: 60000,
			            dataType: "json",
			            data: data,
			            success: function (jsonResult) {
			            	if(jsonResult["result"] == 600002)
			            	{
			            		$('#table-ljxx').bootstrapTable('refresh', {
									url : 'trainLine/queryTrainLineByPage.action'
								});
								$('#ljxx_del').addClass('disabled');
								$('#ljxx_del').prop('disabled', true);
			            		BootstrapDialog.show({
			                        title: '系统提示',
			                        message: ConfigCN[jsonResult["result"]],
			                        buttons: [{
			                            label: '关闭',
			                            action: function(dialogItself){
			                                dialogItself.close();
			                            }
			                        }]
			                    });
			            	}
			            	else
			            	{
			            		BootstrapDialog.show({
			                        title: '系统提示',
			                        message: ConfigCN[jsonResult["result"]],
			                        buttons: [{
			                            label: '关闭',
			                            action: function(dialogItself){
			                                dialogItself.close();
			                            }
			                        }]
			                    });
			                    return false;
			            	}
			            	
			            },
			            error: function (request, status, err) {
			                if (status == "timeout")
			                {
			                    BootstrapDialog.show({
			                        title: '系统提示',
			                        message: '请求超时！',
			                        buttons: [{
			                            label: '关闭',
			                            action: function(dialogItself){
			                                dialogItself.close();
			                            }
			                        }]
			                    });
			                }
			            }
			        });
                }
            }
        });
		
	}
})
$('#ljxx_Template').click(function(event) {
	window.open("excelTemplate/importBureauInfo.xls");
});
//路局信息导入
$('#ljxx_dr').click(function() {
	//$('#Toolbar_Upload').show();
	var strHtml="";
	strHtml+='<input id="file_excel" name="file_excel" class="file" type="file">';
	BootstrapDialog.show({
		title : '车次信息导入',
		message : strHtml,
		onshown : function(dialogRef) {
			$("#file_excel").fileinput({
				language: 'zh',
				uploadUrl: 'trainLine/importTrainLine.action',
				allowedFileExtensions: ['xls','xlsx'],//接收的文件后缀
				showPreview: false,
			    browseClass: "btn btn-primary", //按钮样式	 
			    dropZoneEnabled: false,//是否显示拖拽区域
			    maxFileCount: 1, //表示允许同时上传的最大文件个数
			    enctype: 'multipart/form-data',
			    validateInitialCount:false,
			});
			//导入文件上传完成之后的事件
			$("#file_excel").on("fileuploaded", function (event, data, previewId, index) {
				$('#table-ycgl').bootstrapTable('refresh', {
					url : 'trainLine/importTrainLine.action'
				});
				var Message = "";
				if(data.response.result == 600009)
				{
					Message = data.response.message;
				}
				else
				{
					Message = ConfigCN[data.response.result];
				}
				BootstrapDialog.show({
                    title: '系统提示',
                    message: Message,
                    buttons: [{
                        label: '关闭',
                        action: function(dialogItself){
                            dialogItself.close();
                        }
                    }]
                });
                dialogRef.close();
			});
		}
	})
});
// 设备导入信息
var $table = $('#table-sbxx_dr');
$table.bootstrapTable({
	method: 'post',
	contentType: "application/x-www-form-urlencoded",
	//url : APIUrl + "getAllVersions.action",
	url : "deviceImport/getDeviceImport.action",
	//url: "json/getDeviceImport.json",
	dataType : "json",
	striped: true,
	toolbar : "#toolbar",
	uniqueId : "devId",
	pagination : true, // 分页
	singleSelect : false,
	idField:"devId",
	//search : true,
	sortable : false,
	sidePagination : "server", // 服务端处理分页
	queryParams: queryParams_sbxx_dr,
	columns : [{
		title : '序号',
		field : 'id',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			return index + 1;
		}
	}, {
		title : '设备型号',
		field : 'devModel',
		align : 'center',
		valign : 'middle',
	}, {
		title : '设备序列号',
		field : 'devSn',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			var strHtml = '<a onclick="sbxx_dr_read('+ row.devId + ');">' + value + '</a>'
			return strHtml;
		}
	}, {
		title : '批次',
		field : 'devBatch',
		align : 'center',
		valign : 'middle',
	}, {
		title : '设备状态',
		field : 'devAssetsStatus',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			var strHtml = devAssetsStatusCN[value]
			return strHtml;
		}
	}, {
		title : '安装状态',
		field : 'isInstall',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			var strHtml = isInstallCN[value]
			return strHtml;
		}
	} ]
});
//设备信息导入
$('#sbxx_dr').click(function() {
	//$('#Toolbar_Upload').show();
	var strHtml = '';
	strHtml += '<div class="table row"><form class="form-horizontal" id="FormValidator">';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">厂商</label><div class="col-sm-9"><select id="devFactory" name="devFactory" class="form-control"><option value="">选择厂商</option></select></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">联系人</label><div class="col-sm-9"><input type="text" id="devContacts" name="devContacts" class="form-control" placeholder="输入联系人"></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">电话</label><div class="col-sm-9"><input type="tel" id="devPhone" name="devPhone" class="form-control" placeholder="输入电话号码"></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">批次</label><div class="col-sm-9"><input type="text" id="devBatch2" name="devBatch2" class="form-control" placeholder="输入批次"></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">型号</label><div class="col-sm-9"><input type="text" id="devModel" name="devModel" class="form-control" placeholder="输入型号"></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">质保到期</label><div class="col-sm-9"><input type="text" id="devExpiredDate" name="devExpiredDate" class="form-control" placeholder="输入质保到期时间" readonly></div></div>';
	strHtml += '<div class="form-group"><label class="col-sm-3 control-label">设备清单</label><div class="col-sm-9"><input id="file_excel" name="file_excel" class="file" type="file"></div></div>';
	strHtml += '</form></div>';
	BootstrapDialog.show({
		title : '设备信息导入',
		message : strHtml,
		onshown : function(dialogRef) {
			$.ajax({
		        type: "post",
		        url: "device/getDeviceFactory.action",
		        //url: "json/getDeviceFactory.json",
		        contentType: "application/json",
		        dataType: "json",
		        //data: JSON.stringify({ "BuIds": ["1", "2", "3"] }),
		        success: function (jsonResult) {
		            $.each(jsonResult,function(i,item){
		                $('#devFactory').append('<option value="'+ item["value"] + '">'+ item["text"] + '</option>');
		            })
		            $('.selectpicker').selectpicker('refresh');
		        },
		        error:function(){
		            errorNotify(null,"无法获取设备厂商！");
		        }
		    });
		    $('#FormValidator').bootstrapValidator({
				message : 'This value is not valid',
				feedbackIcons : {
					valid : 'glyphicon glyphicon-ok',
					invalid : 'glyphicon glyphicon-remove',
					validating : 'glyphicon glyphicon-refresh'
				},
				fields : {
					devFactory : {
						message : '厂商无效',
						validators : {
							notEmpty : {
								message : '请选择厂商'
							}
						}
					},devContacts : {
						message : '联系人无效',
						validators : {
							notEmpty : {
								message : '请输入联系人'
							}
						}
					},devPhone : {
						message : '电话无效',
						validators : {
							notEmpty : {
								message : '请输入电话'
							}
						}
					},devBatch2 : {
						message : '批次无效',
						validators : {
							notEmpty : {
								message : '请输入批次'
							}
						}
					},devModel : {
						message : '型号无效',
						validators : {
							notEmpty : {
								message : '请输入型号'
							}
						}
					},
					devExpiredDate : {
						message : '质保到期无效',
						validators : {
							notEmpty : {
								message : '请选择质保到期时间'
							},  
			                date : {  
			                    format : 'YYYY-MM-DD',  
			                    message : '日期格式不正确'  
			                }
						}
					}
				}
			});
			$("#file_excel").fileinput({
				language: 'zh',
				uploadUrl: 'deviceImport/saveDeviceImport.action',
				allowedFileExtensions: ['xls','xlsx'],//接收的文件后缀
				showPreview: false,
			    browseClass: "btn btn-primary", //按钮样式	 
			    dropZoneEnabled: false,//是否显示拖拽区域
			    maxFileCount: 1, //表示允许同时上传的最大文件个数
			    enctype: 'multipart/form-data',
			    validateInitialCount:false,
				uploadExtraData:function(previewId, index) {
			        var data = {
			        	devFactory : $("#devFactory").val(),
			        	devContacts : $("#devContacts").val(),
			        	devPhone : $("#devPhone").val(),
			        	devBatch : $("#devBatch2").val(),
			        	devModel : $("#devModel").val(),
			        	devExpiredDate : $("#devExpiredDate").val(),
			        };
			        return data;
			    }
			});
			$('#file_excel').on('change', function(event) {
			    $('#FormValidator').bootstrapValidator('validate');
				if ($('#FormValidator').data('bootstrapValidator').isValid()) {

				} else {
					BootstrapDialog.alert({
						title : '验证失败',
						message : '请确认输入内容格式是否正确！',
						type : BootstrapDialog.TYPE_DANGER,
						buttonLabel : '确认'
					});
				}
			});
			//导入文件上传完成之后的事件
			$("#file_excel").on("fileuploaded", function (event, data, previewId, index) {
				$('#table-sbxx_dr').bootstrapTable('refresh', {
					url : 'deviceImport/getDeviceImport.action'
				});
				var Code = data.response.code;
				var strHtml="";
				strHtml+='<table id="table-sbxx_dr_jg">';
				strHtml+='<thead><tr><th>设备序列号</th><th>导入信息</th><th>导入结果</th></tr></thead>';
				strHtml+='<tbody>'
				data.response.result.inportInfo.forEach(function(e){
					strHtml+='<tr><td>' + e.devSn + '</td><td>'+ e.remarks +'</td><td>' + e.result + '</td></tr>'
	            })
				
				strHtml+='</tbody>';
				strHtml+='</table>';
				if(Code == 600007)
				{
					BootstrapDialog.show({
						size: BootstrapDialog.SIZE_WIDE,
						title : '导入结果查看',
						message : strHtml,
						onshown : function(dialogRef) {
							$('#table-sbxx_dr_jg').bootstrapTable({
								pagination : true,
								sidePagination : "client",
								pageSize : 10,
								columns :[{
									align : 'center',
									valign : 'middle'
								},{
									align : 'center',
									valign : 'middle'
								},{
									align : 'center',
									valign : 'middle'
								}]
							});
						},
						buttons : [
						{
							label : '下载失败设备列表',
							cssClass : 'btn-primary',
							action : function(dialog) {
								window.open("deviceImport/downloadDeviceImportFail.action");
							}
						},{
							label : '关闭',
							action : function(dialogItself) {
								dialogItself.close();
							}
						}]
					});
					dialogRef.close();
				}
				else
				{
					BootstrapDialog.show({
	                    title: '系统提示',
	                    message: ConfigCN(Code),
	                    buttons: [{
	                        label: '关闭',
	                        action: function(dialogItself){
	                            dialogItself.close();
	                        }
	                    }]
	                });
				}
			});
			$("#devExpiredDate").datetimepicker({
			    format: "yyyy-mm-dd",
			    autoclose: true,
			    minView: "month",
			    maxView: "decade",
			    language: 'zh-CN'
			}).on('hide',function(e) {  
                $('#FormValidator').data('bootstrapValidator')  
                    .updateStatus('devExpiredDate', 'NOT_VALIDATED',null)  
                    .validateField('devExpiredDate');  
            });  
		}
	})
});
function sbxx_dr_read(devId){
	var data="";
	data = "devId=" + devId;
	$.ajax({
        type: "POST",
        url: "deviceImport/getDeviceImportDetail.action",
        //url:"json/getDeviceImport.json",
        timeout: 60000,
        dataType: "json",
        data: data,
        success: function (jsonResult) {
            var strHtml="";
			strHtml += '<div class="table row"><form class="form-horizontal">';
			strHtml += '<div class="form-group"><label class="col-sm-2 control-label">设备厂商</label><div class="col-sm-2"><p class="form-control-static" id="devFactory">' + NoNull(jsonResult["devFactory"]) +'</p></div>';
			strHtml += '<label class="col-sm-2 control-label">设备型号</label><div class="col-sm-2"><p class="form-control-static" id="devModel">' + NoNull(jsonResult["devModel"]) +'</p></div>';
			strHtml += '<label class="col-sm-2 control-label">联系人</label><div class="col-sm-2"><p class="form-control-static" id="devContacts">' + NoNull(jsonResult["devContacts"]) +'</p></div></div>';
			strHtml += '<div class="form-group"><label class="col-sm-2 control-label">联系电话</label><div class="col-sm-2"><p class="form-control-static" id="devPhone">' + NoNull(jsonResult["devPhone"]) +'</p></div>';
			strHtml += '<label class="col-sm-2 control-label">批次</label><div class="col-sm-2"><p class="form-control-static" id="devBatch">' + NoNull(jsonResult["devBatch"]) +'</p></div>';
			strHtml += '<label class="col-sm-2 control-label">质保到期时间</label><div class="col-sm-2"><p class="form-control-static" id="devExpiredDate">' + NoNull(jsonResult["devExpiredDate"]) +'</p></div></div>';
			strHtml += '<div class="form-group"><label class="col-sm-2 control-label">设备状态</label><div class="col-sm-2"><p class="form-control-static" id="devAssetsStatus">' + NoNull(devAssetsStatusCN[jsonResult["devAssetsStatus"]]) +'</p></div>';
			strHtml += '<label class="col-sm-2 control-label">安装状态</label><div class="col-sm-2"><p class="form-control-static" id="isInstall">' + NoNull(isInstallCN[jsonResult["isInstall"]]) +'</p></div>';
			strHtml += '<label class="col-sm-2 control-label">更新时间</label><div class="col-sm-2"><p class="form-control-static" id="updateTime">' + NoNull(jsonResult["updateTime"]) +'</p></div></div>';
			strHtml += '</form></div>';
			BootstrapDialog.show({
				size: BootstrapDialog.SIZE_WIDE,
				title : '详细信息',
				message : strHtml,
				onshown : function(dialogRef) {
					
				},
				buttons : [ {
					label : '关闭',
					action : function(dialogItself) {
						dialogItself.close();
					}
				}]
			});
        },
        error: function (request, status, err) {
            if (status == "timeout")
            {
                BootstrapDialog.show({
                    title: '系统提示',
                    message: '请求超时！',
                    buttons: [{
                        label: '关闭',
                        action: function(dialogItself){
                            dialogItself.close();
                        }
                    }]
                });
            }
        }
    });
}
$('#sbxx_dr_Template').click(function(event) {
	window.open("excelTemplate/device_import_template.xlsx");
});

//安装信息管理
var $table = $('#table-azxx');
$table.bootstrapTable({
	method: 'get',
	contentType: "application/x-www-form-urlencoded",
	//url : APIUrl + "getAllVersions.action",
	url : "deviceInstall/getDeviceInstall.action",
	url: "json/getDeviceInstall.json",
	dataType : "json",
	striped: true,
	toolbar : "#toolbar",
	uniqueId : "devId",
	pagination : true, // 分页
	singleSelect : false,
	idField:"devId",
	//search : true,
	sortable : false,
	sidePagination : "server", // 服务端处理分页
	queryParams: queryParams_azxx,
	columns : [ {
		title : '序号',
		field : 'devId',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			return index + 1;
		}
	}, {
		title : '设备型号',
		field : 'devModel',
		align : 'center',
		valign : 'middle',
	}, {
		title : '设备序列号',
		field : 'devSn',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			var strHtml = '<a onclick="azxx_edit('+ row.devId + ');">' + value + '</a>';
			return strHtml;
		}
	}, {
		title : '安装路局',
		field : 'bureauName',
		align : 'center',
		valign : 'middle',
	}, {
		title : '车段',
		field : 'stationName',
		align : 'center',
		valign : 'middle',
	}, {
		title : '车次',
		field : 'lineName',
		align : 'center',
		valign : 'middle',
	}, {
		title : '车型',
		field : 'lineModel',
		align : 'center',
		valign : 'middle',
	}, {
		title : '车种',
		field : 'carriageType',
		align : 'center',
		valign : 'middle',
	}, {
		title : '车号',
		field : 'carriageName',
		align : 'center',
		valign : 'middle',
	}, {
		title : '卡1 ICCID号',
		field : 'iccid1',
		align : 'center',
		valign : 'middle',
	}, {
		title : '卡1号运营商',
		field : 'iccid1',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			if(value != null)
			{
				if(value.indexOf('898600')==0 || value.indexOf('898602')==0){
				    return "中国移动";
				}
				if(value.indexOf('898601')==0 || value.indexOf('898609')==0){
				    return "中国联通";
				}
				if(value.indexOf('898603')==0 || value.indexOf('898606')==0){
				    return "中国电信";
				}
			}
			return "-";
		}
	}, {
		title : '卡2 ICCID号',
		field : 'iccid2',
		align : 'center',
		valign : 'middle',
	}, {
		title : '卡2运营商',
		field : 'iccid2',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			if(value != null)
			{
				if(value.indexOf('898600')==0 || value.indexOf('898602')==0){
				    return "中国移动";
				}
				if(value.indexOf('898601')==0 || value.indexOf('898609')==0){
				    return "中国联通";
				}
				if(value.indexOf('898603')==0 || value.indexOf('898606')==0){
				    return "中国电信";
				}
			}
			return "-";
		}
	}, {
		title : '安装状态',
		field : 'isInstall',
		align : 'center',
		valign : 'middle',
		formatter : function(value, row, index) {
			var strHtml = isInstallCN[value]
			return strHtml;
		}
	} ],
	onLoadSuccess : function()
	{
		var $table = $('#table-ljxx');
		//全选复选框触发
		$table.find('input[name="btSelectAll"]').click(function(){
    		//判断是否选中
    		//console.log($table.find('input[name="btSelectAll"]').prop("checked"));
    		if($table.find('input[name="btSelectAll"]').prop("checked") == true)
    		{
    			$table.find('input[name="btSelectItem"]').each(function(){
		    		TableIDArray.push(parseInt($(this).val()));
		    	})
		    	TableIDArray = unique(TableIDArray);
    		}
    		else
    		{
    			$table.find('input[name="btSelectItem"]').each(function(){
    				if($(this).prop("checked") == false){
    					TableIDArray.splice(TableIDArray.indexOf(parseInt($(this).val())),1);
						//console.log(TableIDArray + "删除" + parseInt($(this).val()));
					}
					//console.log($(this).val());
    			})
    			//console.log("取消全选");
    		}

    	})
    	$table.find('input[name="btSelectAll"]').click(function(){
	    	if($table.find('input[name="btSelectAll"]').prop("checked") == true)
			{
				$('#ljxx_del').removeClass('disabled');
				$('#ljxx_del').prop('disabled', false);
			}
			else
			{
				$('#ljxx_del').addClass('disabled');
				$('#ljxx_del').prop('disabled', true);
			}
		})
    	//遍历复选框
		$table.find('input[name="btSelectItem"]').each(function(){
			if(TableIDArray.indexOf(parseInt($(this).val())) != -1){
				$(this).attr('checked',true);
			}
			//$(this).attr('checked',true);
			//var value = $(this).attr('data-index');
			//console.log($(this).val());
			
    	})
    	$table.find('input[name="btSelectItem"]').change(function(){
    		if($(this).prop("checked") == true){
				TableIDArray.push(parseInt($(this).val()));
			}
			else
			{
				TableIDArray.splice(TableIDArray.indexOf(parseInt($(this).val())),1);
			}

			if(TableIDArray.length != 0){
				$('#ljxx_del').removeClass('disabled');
				$('#ljxx_del').prop('disabled', false);
			}
			else
			{
				$('#ljxx_del').addClass('disabled');
				$('#ljxx_del').prop('disabled', true);
			}

    	})
    	TableIDArray = unique(TableIDArray);
		//console.log(unique(TableIDArray));
	}
});
function azxx_edit(devId) {
	var data = "";
	data = "devId=" + devId;
	$.ajax({
        type: "get",
        url: "deviceInstall/getDeviceInstallDetail.action",
        url: "json/getDeviceInstallDetail.json",
        timeout: 60000,
        dataType: "json",
        data: data,
        success: function (jsonResult) {
        	jsonResult=jsonResult["rows"][0];
			var trainBureauId = jsonResult["trainBureauId"];
			var trainStationId = jsonResult["trainStationId"];
			var trainLineId = jsonResult["trainLineId"];
			var lineName = jsonResult["lineName"];
			var startStation = jsonResult["startStation"];
			var endStation = jsonResult["endStation"];

        	console.log(trainBureauId);
        	console.log(trainStationId);
        	console.log(trainLineId);
			var strRailwayBureau = "";
			$.ajax({
		        type: "get",
		        url: "selectObject/getRailwayBureau.action",
		        url: "json/getRailwayBureau.json",
		        contentType: "application/json",
		        dataType: "json",
		        //data: JSON.stringify({ "BuIds": ["1", "2", "3"] }),
		        success: function (jsonResult) {
		            $.each(jsonResult,function(i,item){
		                strRailwayBureau += '<option value="'+ item["value"] + '">'+ item["text"] + '</option>';
		            })
		            var strHtml="";
					strHtml += '<div class="row"><div class="col-sm-12"><form class="form-horizontal" id="FormValidator">';
					strHtml += '<br><div class="form-group"><label class="col-sm-3 control-label">路局</label><div class="col-sm-8"><select id="RailwayBureau2" name="RailwayBureau2" class="selectpicker form-control" data-live-search="true"><option value="">选择路局</option>' + strRailwayBureau + '</select></div></div>';
					strHtml += '<div class="form-group"><label class="col-sm-3 control-label">车段</label><div class="col-sm-8"><select id="RailwayStation2" name="RailwayStation2" class="selectpicker form-control" data-live-search="true"></select></div></div>';
					strHtml += '<div class="form-group"><label class="col-sm-3 control-label">车次</label><div class="col-sm-8"><select id="RailwayLine2" name="RailwayLine2" class="selectpicker form-control" data-live-search="true"></select></div></div>';
					strHtml += '<div class="form-group"><label class="col-sm-3 control-label">起点站</label><div class="col-sm-8"><input type="text" id="startStation2" name="startStation2" class="form-control" placeholder="起点站" value="' + startStation + '"></div></div>';
					strHtml += '<div class="form-group"><label class="col-sm-3 control-label">终点站</label><div class="col-sm-8"><input type="text" id="endStation2" name="endStation2" class="form-control" placeholder="终点站" value="' + endStation + '"></div></div>';
					strHtml += '</form></div></div>';	

					BootstrapDialog.show({
						title : '修改路局信息',
						message : strHtml,
						onshown : function(dialogRef) {
							$('#RailwayBureau2').selectpicker('refresh');
							$('#RailwayBureau2').selectpicker('val', trainBureauId);
							$('#RailwayBureau2').selectpicker('refresh');
							var data="";
				            $('#RailwayStation_div2').show();
				            data = "trainBureauId=" + trainBureauId;
							$.ajax({
				                type: "get",
				                contentType: "application/x-www-form-urlencoded",
				                url: "selectObject/getRailwayStation.action",
				                url: "json/getRailwayStation.json",
				                dataType: "json",
				                data: data,
				                success: function (jsonResult) {
				                    $('#RailwayStation2').html('<option value="">选择车段</option>');
				                    $.each(jsonResult,function(i,item){
				                        $('#RailwayStation2').append('<option value="'+ item["value"] + '">'+ item["text"] + '</option>');
				                    })
									$('#RailwayStation2').selectpicker('refresh');
						            $('#RailwayStation2').selectpicker('val', trainStationId);
									$('#RailwayStation2').selectpicker('refresh');

									var data="";
						            data = "trainBureauId=" + $('#RailwayBureau2').val() + "&trainStationId=" + $('#RailwayStation2').val();
						            $.ajax({
						                type: "get",
						                contentType: "application/x-www-form-urlencoded",
						                url: "selectObject/getRailwayLine.action",
						                url: "json/getRailwayLine.json",
						                dataType: "json",
						                data: data,
						                success: function (jsonResult) {
						                    $('#RailwayLine2').html('<option value="">选择车次</option>');
						                    $.each(jsonResult,function(i,item){
						                        $('#RailwayLine2').append('<option value="'+ item["value"] + '">'+ item["text"] + '</option>');
						                    })
						                    $('#RailwayLine2').selectpicker('refresh');
								            $('#RailwayLine2').selectpicker('val', trainLineId);
											$('#RailwayLine2').selectpicker('refresh');
						                },
						                error:function(){
						                    errorNotify(null,"无法获取车次信息！");
						                }
						            });
				                },
				                error:function(){
				                    errorNotify(null,"无法获取车段信息！");
				                }
				            });

							$('#RailwayBureau2').change(function() {
								if($(this).val()!=""){
						            var data="";
						            data = "trainBureauId=" + $(this).val();
						            $.ajax({
						                type: "get",
						                contentType: "application/x-www-form-urlencoded",
						                url: "selectObject/getRailwayStation.action",
						                url: "json/getRailwayStation.json",
						                dataType: "json",
						                data: data,
						                success: function (jsonResult) {
						                    $('#RailwayStation2').html('<option value="">选择车段</option>');
						                    $.each(jsonResult,function(i,item){
						                        $('#RailwayStation2').append('<option value="'+ item["value"] + '">'+ item["text"] + '</option>');
						                    })
						                    $('#RailwayStation2').selectpicker('refresh');
						                    $('#RailwayLine2').html('<option value="">选择车次</option>');
						                    $('#RailwayLine2').selectpicker('refresh');
						                },
						                error:function(){
						                    errorNotify(null,"无法获取车段信息！");
						                }
						            });
						        }
						        else
						        {
						            $('#RailwayStation2').html('');
						        }
						    })
							$('#RailwayStation2').change(function() {
						        if($(this).val()!=""){
						            var data="";
						            data = "trainBureauId=" + $('#RailwayBureau2').val() + "&trainStationId=" + $(this).val();
						            $.ajax({
						                type: "get",
						                contentType: "application/x-www-form-urlencoded",
						                url: "selectObject/getRailwayLine.action",
						                url: "json/getRailwayLine.json",
						                dataType: "json",
						                data: data,
						                success: function (jsonResult) {
						                    $('#RailwayLine2').html('<option value="">选择车次</option>');
						                    $.each(jsonResult,function(i,item){
						                        $('#RailwayLine2').append('<option value="'+ item["value"] + '">'+ item["text"] + '</option>');
						                    })
						                    $('#RailwayLine2').selectpicker('refresh');
						                },
						                error:function(){
						                    errorNotify(null,"无法获取车次信息！");
						                }
						            });
						        }
						        else
						        {
						            $('#RailwayLine2').html('');
						        }
						    })

							$('#FormValidator').bootstrapValidator({
								message : 'This value is not valid',
								feedbackIcons : {
									valid : 'glyphicon glyphicon-ok',
									invalid : 'glyphicon glyphicon-remove',
									validating : 'glyphicon glyphicon-refresh'
								},
								fields : {
									RailwayBureau2 : {
										message : '路局无效',
										validators : {
											notEmpty : {
												message : '请选择路局'
											}
										}
									},
									RailwayStation2 : {
										message : '车段无效',
										validators : {
											notEmpty : {
												message : '请选择车段'
											}
										}
									},
									RailwayLine2 : {
										message : '车次无效',
										validators : {
											notEmpty : {
												message : '车次不能为空'
											}
										}
									}
								}
							});
						},
						buttons : [{
							label : '提交',
							cssClass : 'btn-primary',
							action : function(dialog) {
								$('#FormValidator').bootstrapValidator('validate');
								if ($('#FormValidator').data('bootstrapValidator').isValid()) {
									var data = "";
									data = "trainLineId=" + trainLineId + "&trainBureauId=" + $('#RailwayBureau2').val() + "&trainStationId=" + $('#RailwayStation2').val() + "&lineName=" + $('#RailwayLine2').val() + "&startStation=" + $('#startStation2').val() + "&endStation=" + $('#endStation2').val();
									$.ajax({
							            type: "post",
							            url: "trainLine/updateTrainLineById.action",
							            timeout: 60000,
							            dataType: "json",
							            data: data,
							            success: function (jsonResult) {
							            	if(jsonResult["result"] == 600005)
							            	{
							            		$('#table-ljxx').bootstrapTable('refresh', {
													url : 'trainLine/queryTrainLineByPage.action'
												});
												$('#ljxx_del').addClass('disabled');
												$('#ljxx_del').prop('disabled', true);
							            		BootstrapDialog.show({
							                        title: '系统提示',
							                        message: ConfigCN[jsonResult["result"]],
							                        buttons: [{
							                            label: '关闭',
							                            action: function(dialogItself){
							                                dialogItself.close();
							                            }
							                        }]
							                    });
							                    dialog.close();
							            	}
							            	else
							            	{
							            		BootstrapDialog.show({
							                        title: '系统提示',
							                        message: ConfigCN[jsonResult["result"]],
							                        buttons: [{
							                            label: '关闭',
							                            action: function(dialogItself){
							                                dialogItself.close();
							                            }
							                        }]
							                    });
							                    return false;
							            	}
							            	
							            },
							            error: function (request, status, err) {
							                if (status == "timeout")
							                {
							                    BootstrapDialog.show({
							                        title: '系统提示',
							                        message: '请求超时！',
							                        buttons: [{
							                            label: '关闭',
							                            action: function(dialogItself){
							                                dialogItself.close();
							                            }
							                        }]
							                    });
							                }
							            }
							        });
								
								} else {
									BootstrapDialog.alert({
										title : '验证失败',
										message : '请确认输入内容格式是否正确！',
										type : BootstrapDialog.TYPE_DANGER,
										buttonLabel : '确认'
									});
								}
							}
						},
						{
							label : '重置',
							action : function(dialogItself) {
								$('#FormValidator') .data('bootstrapValidator').resetForm(true);
						        $('#RailwayStation2').html('');
						        $('#RailwayLine2').html('');
								$('.selectpicker').selectpicker('refresh');
						        $('#startStation2').val('');
						        $('#endStation2').val('');
							}
						},
						{
							label : '关闭',
							action : function(dialogItself) {
								dialogItself.close();
							}
						} ]
					});
		        },
		        error:function(){
		            errorNotify(null,"无法获取路局信息！");
		        }
		    });
        },
        error: function (request, status, err) {
            if (status == "timeout")
            {
                BootstrapDialog.show({
                    title: '系统提示',
                    message: '请求超时！',
                    buttons: [{
                        label: '关闭',
                        action: function(dialogItself){
                            dialogItself.close();
                        }
                    }]
                });
            }
        }
    });
};
$('#azxx_Template').click(function(event) {
	window.open("excelTemplate/import_install_template.xls");
});

Date.prototype.format = function(mask) {
	var d = this;
	var zeroize = function(value, length) {
		if (!length)
			length = 2;
		value = String(value);
		for (var i = 0, zeros = ''; i < (length - value.length); i++) {
			zeros += '0';
		}
		return zeros + value;
	};

	return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g,function($0) {
		switch ($0) {
		case 'd':
			return d.getDate();
		case 'dd':
			return zeroize(d.getDate());
		case 'ddd':
			return [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri',
					'Sat' ][d.getDay()];
		case 'dddd':
			return [ 'Sunday', 'Monday', 'Tuesday',
					'Wednesday', 'Thursday', 'Friday',
					'Saturday' ][d.getDay()];
		case 'M':
			return d.getMonth() + 1;
		case 'MM':
			return zeroize(d.getMonth() + 1);
		case 'MMM':
			return [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
					'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ][d
					.getMonth()];
		case 'MMMM':
			return [ 'January', 'February', 'March', 'April',
					'May', 'June', 'July', 'August',
					'September', 'October', 'November',
					'December' ][d.getMonth()];
		case 'yy':
			return String(d.getFullYear()).substr(2);
		case 'yyyy':
			return d.getFullYear();
		case 'h':
			return d.getHours() % 12 || 12;
		case 'hh':
			return zeroize(d.getHours() % 12 || 12);
		case 'H':
			return d.getHours();
		case 'HH':
			return zeroize(d.getHours());
		case 'm':
			return d.getMinutes();
		case 'mm':
			return zeroize(d.getMinutes());
		case 's':
			return d.getSeconds();
		case 'ss':
			return zeroize(d.getSeconds());
		case 'l':
			return zeroize(d.getMilliseconds(), 3);
		case 'L':
			var m = d.getMilliseconds();
			if (m > 99)
				m = Math.round(m / 10);
			return zeroize(m);
		case 'tt':
			return d.getHours() < 12 ? 'am' : 'pm';
		case 'TT':
			return d.getHours() < 12 ? 'AM' : 'PM';
		case 'Z':
			return d.toUTCString().match(/[A-Z]+$/);
			// Return quoted strings with the surrounding quotes removed
		default:
			return $0.substr(1, $0.length - 2);
		}
	});
};
function queryParams(params) {
	if($.cookie('car_type') != undefined && $.cookie('car_type') != 0)
	{
		car_type = $.cookie('car_type');
	}
	else
	{
		car_type = null;
	}
	var temp = {
		limit: params.limit,
		offset: params.offset,
		car_type: car_type
	};  
	return temp;  
}
function queryParams_wjxf(params) {  
    var temp = {
        limit: params.limit,
        offset: params.offset,
        downloadex_job_id: JobID,
		car_type: car_type,
        mac: $("#mac").val()
    };  
    return temp;  
}
function queryParams_ycgl(params) {
    var temp = {
        limit: params.limit,
        offset: params.offset,
        execJobId: ExecJobId,
        mac: $("#mac").val()
    };  
    return temp;  
}
function queryParams_sbxx(params) {  //配置参数  
    var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
        limit: params.limit,
        offset: params.offset,
		car_type: car_type,  
        dev_model: $("#DeviceModel").val(),
        dev_factory: $("#DeviceFactory").val(),
        dev_mac: $("#DevMAC").val(),
    };  
    return temp;  
}
function queryParams_ljxx(params) {  //配置参数  
    var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
        limit: params.limit,
        offset: params.offset,
		car_type: car_type,  
        trainBureauId: $("#RailwayBureau").val(),
        trainStationId: $("#RailwayStation").val(),
        trainLineId: $("#RailwayLine").val(),
    };  
    return temp;  
}
function queryParams_sbxx_dr(params) {  //配置参数  
    var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
        limit: params.limit,
        offset: params.offset,
		car_type: car_type,  
        devModel: $("#DeviceModel").val(),
        devBatch: $("#devBatch").val(),
        devAssetsStatus: $("#devAssetsStatus").val(),
        isInstall: $("#isInstall").val(),
    };  
    return temp;  
}
function queryParams_llxx(params) {  //配置参数  
	if($.cookie('car_type') != undefined && $.cookie('car_type') != 0)
	{
		car_type = $.cookie('car_type');
	}
	else
	{
		car_type = null;
	}
	var temp = {
        limit: params.limit,
        offset: params.offset,
		car_type: car_type,  
        mac: $("#DevMAC").val(),
		car_type: car_type
    };  
    return temp;  
}
function queryParams_lltj(params) {  //配置参数  
	if($.cookie('car_type') != undefined && $.cookie('car_type') != 0)
	{
		car_type = $.cookie('car_type');
	}
	else
	{
		car_type = null;
	}
	var temp = {
        limit: params.limit,
        offset: params.offset,
		car_type: car_type,  
        dateFlag: $("#dateFlag").val(),
		car_type: car_type
    };  
    return temp;  
}
function queryParams_azxx(params) {  //配置参数  
	if($.cookie('car_type') != undefined && $.cookie('car_type') != 0)
	{
		car_type = $.cookie('car_type');
	}
	else
	{
		car_type = null;
	}
	var temp = {
        limit: params.limit,
        offset: params.offset,
		car_type: car_type,  
        isInstall: $("#isInstall").val(),
        trainBureauId: $("#RailwayBureau").val(),
        trainStationId: $("#RailwayStation").val(),
        trainLineId: $("#RailwayLine").val(),
        devSn: $("#DevSN").val(),
		car_type: car_type
    };  
    return temp;  
}
//数组去重
function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}

function errorNotify(title,message,type)
{
	if(title == null)
	{
		title="错误信息：";
	}
	if(type == null)
	{
		type = 'danger';
	}
	$.notify({
		title: title,
		message: message
	},{
		type: type,
		template: '<div data-notify="container" class="alert alert-{0}" role="alert">' +
		//'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
		'<span data-notify="icon"></span> ' +
		'<span data-notify="title">{1}</span> ' +
		'<span data-notify="message">{2}</span>' +
		'<div class="progress" data-notify="progressbar">' +
		'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
		'</div>' +
		'<a href="{3}" target="{4}" data-notify="url"></a>' +
		'</div>' 
	});
}

function NoNull(string)
{
	if (string == undefined)
	{
		return "-";
	}
	else
	{
		return string;
	}
}