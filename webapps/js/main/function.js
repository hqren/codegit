function main(){
	var data = "";
    if($.cookie('car_type') != undefined && $.cookie('car_type') != 0)
    {
        car_type = $.cookie('car_type');
        data = "car_type=" + car_type;
    }
    $.ajax({
        type: "POST",
        url: "device/getStatisticsDevice.action",
        //url: "json/getStatisticsDevice.json",
        timeout: 60000,
        dataType: "json",
        data: data,
        success: function (jsonResult) {
            //jsonResult = JSON.parse(data)
            $('#totalCount').html(jsonResult['totalCount']);
            $('#todayonLineCount').html(jsonResult['todayonLineCount']);
            $('#sevendaysonLineCount').html(jsonResult['sevendaysonLineCount']);
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

function list_sbxx(){
	$.ajax({
        type: "post",
        url: "device/getDeviceCount.action",
        //url: "json/getDeviceCount.json",
        timeout: 60000,
        dataType: "json",
        success: function (jsonResult) {
            //jsonResult = JSON.parse(data)
            $('#countDev').html("设备总数：" + jsonResult['countDev']);
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
    $.ajax({
        type: "post",
        url: "device/getDeviceModel.action",
        //url: "json/getDeviceModel.json",
        contentType: "application/json",
        dataType: "json",
        //data: JSON.stringify({ "BuIds": ["1", "2", "3"] }),
        success: function (jsonResult) {
            $.each(jsonResult,function(i,item){
                $('#DeviceModel').append('<option value="'+ item["value"] + '">'+ item["text"] + '</option>');
            })
            $('.selectpicker').selectpicker('refresh');
        },
        error:function(){
            errorNotify(null,"无法获取设备型号！");
        }
    });
    $.ajax({
        type: "post",
        url: "device/getDeviceFactory.action",
        //url: "json/getDeviceFactory.json",
        contentType: "application/json",
        dataType: "json",
        //data: JSON.stringify({ "BuIds": ["1", "2", "3"] }),
        success: function (jsonResult) {
            $.each(jsonResult,function(i,item){
                $('#DeviceFactory').append('<option value="'+ item["value"] + '">'+ item["text"] + '</option>');
            })
            $('.selectpicker').selectpicker('refresh');
        },
        error:function(){
            errorNotify(null,"无法获取设备厂商！");
        }
    });
    $('#serach_button').click(function() {
        $('#table-sbxx').bootstrapTable('refresh', {
            url : APIUrl + "getDeviceInfo.action",
            queryParams: queryParams_sbxx,
        });
    });
    $('#sbxx_download').click(function() {
        var DeviceModel = $("#DeviceModel").val();
        var DeviceFactory = $("#DeviceFactory").val();
        var DevMAC = $("#DevMAC").val();
        window.open("device/exportDeviceInfo.action?dev_model=" + DeviceModel + "&dev_factory=" + DeviceFactory + "&dev_mac=" + DevMAC + "&car_type=" + car_type);
    });
}

function list_sbxx_dr(){
	var data = "";
    if($.cookie('car_type') != undefined && $.cookie('car_type') != 0)
    {
        car_type = $.cookie('car_type');
        data = "car_type=" + car_type;
    }
    $.ajax({
        type: "post",
        url: "device/getDeviceModel.action",
        //url: "json/getDeviceModel.json",
        contentType: "application/json",
        dataType: "json",
        //data: JSON.stringify({ "BuIds": ["1", "2", "3"] }),
        success: function (jsonResult) {
            $.each(jsonResult,function(i,item){
                $('#DeviceModel').append('<option value="'+ item["value"] + '">'+ item["text"] + '</option>');
            })
            $('.selectpicker').selectpicker('refresh');
        },
        error:function(){
            errorNotify(null,"无法获取设备型号！");
        }
    });

    $.ajax({
        type: "POST",
        url: "deviceImport/getDeviceImportCount.action",
        //url: "json/getStatisticsDevice.json",
        timeout: 60000,
        dataType: "json",
        data: data,
        success: function (jsonResult) {
            //jsonResult = JSON.parse(data)
            $('#countDevAssetsStatusAll').html(jsonResult['countDevAssetsStatusAll']);
            $('#countDevAssetsStatus0').html(jsonResult['countDevAssetsStatus0']);
            $('#countDevAssetsStatus1').html(jsonResult['countDevAssetsStatus1']);
            $('#countDevAssetsStatus2').html(jsonResult['countDevAssetsStatus2']);
            $('#countDevAssetsStatus3').html(jsonResult['countDevAssetsStatus3']);
            $('#countDevAssetsStatus5').html(jsonResult['countDevAssetsStatus5']);
            $('#countIsInstall1').html(jsonResult['countIsInstall1']);
            $('#countIsInstall2').html(jsonResult['countIsInstall2']);
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
    $('#serach_button').click(function() {
        $('#table-sbxx_dr').bootstrapTable('refresh', {
            url : "deviceImport/getDeviceImport.action",
            queryParams: queryParams_sbxx_dr,
        });
    });
    $('#sbxx_dr_download').click(function() {
        var DeviceModel = $("#DeviceModel").val();
        var devBatch = $("#devBatch").val();
        var devAssetsStatus = $("#devAssetsStatus").val();
        var isInstall = $("#isInstall").val();
        window.open("deviceImport/exportDeviceImport.action?devModel=" + DeviceModel + "&devBatch=" + devBatch + "&devAssetsStatus=" + devAssetsStatus + "&isInstall=" + isInstall + "&car_type=" + car_type);
    });
}

function list_llxx(){
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // 获取已激活的标签页的名称
        var activeTab = $(e.target).text(); 
        // 获取前一个激活的标签页的名称
        var previousTab = $(e.relatedTarget).text();
        /*console.log(activeTab);
        console.log(previousTab);*/
        if(activeTab=="流量统计")
        {
            //设备流量统计信息
            var $table = $('#table-lltj');
            $table.bootstrapTable({
                method: 'post',
                contentType: "application/x-www-form-urlencoded",
                url : "devFlowInfo/queryFlowInfoForBureauPage.action",
                // url: "json/getAllVersions.json",
                dataType : "json",
                striped: true,
                //toolbar : "#toolbar",
                uniqueId : "trainBureauId",
                pagination : true, // 分页
                singleSelect : false,
                //search : true,
                sortable : false,
                sidePagination : "server", // 服务端处理分页
                queryParams: queryParams_lltj,
                columns : [ {
                    title : '序号',
                    field : 'trainBureauId',
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
                    title : '总消耗流量',
                    field : 'sumDeviceTracffic',
                    align : 'center',
                    valign : 'middle',
                }, {
                    title : '联通总消耗流量',
                    field : 'sumDeviceUnicomTraffic',
                    align : 'center',
                    valign : 'middle',
                }, {
                    title : '电信总消耗流量',
                    field : 'sumDeviceTelecomTraffic',
                    align : 'center',
                    valign : 'middle',
                }, {
                    title : '移动总消耗流量',
                    field : '',
                    align : 'center',
                    valign : 'middle',
                }, {
                    title : '用户端流量',
                    field : 'sumUserTraffic',
                    align : 'center',
                    valign : 'middle',
                }, {
                    title : '后端流量',
                    field : 'sumBackendTraffic',
                    align : 'center',
                    valign : 'middle',
                }]
            });
        }
    });

    $('#serach_button').click(function() {
        $('#table-llxx').bootstrapTable('refresh', {
            url : "devFlowInfo/queryDevTracfficByPage.action",
            queryParams: queryParams_llxx,
        });
    });
    $('#llxx_download').click(function() {
        var DevMAC = $("#DevMAC").val();
        window.open("devFlowInfo/exportDevTracffic.action?mac=" + DevMAC + "&car_type=" + car_type);
    });

    $('#serach_button2').click(function() {
        $('#table-lltj').bootstrapTable('refresh', {
            url : "devFlowInfo/queryFlowInfoForBureauPage.action",
            queryParams: queryParams_lltj,
        });
    });
    $('#lltj_download').click(function() {
        var dateFlag = $("#dateFlag").val();
        window.open("devFlowInfo/exportDevTracffic.action?dateFlag=" + dateFlag + "&car_type=" + car_type);
    });
}

function list_ljxx(){
    $.ajax({
        type: "post",
        url: "selectObject/getRailwayBureau.action",
        //url: "json/getDeviceModel.json",
        contentType: "application/json",
        dataType: "json",
        //data: JSON.stringify({ "BuIds": ["1", "2", "3"] }),
        success: function (jsonResult) {
            $.each(jsonResult,function(i,item){
                $('#RailwayBureau').append('<option value="'+ item["value"] + '">'+ item["text"] + '</option>');
            })
            $('.selectpicker').selectpicker('refresh');
        },
        error:function(){
            errorNotify(null,"无法获取路局信息！");
        }
    });
    $('#RailwayBureau').change(function() {
        if($(this).val()!=""){
            var data="";
            $('#RailwayStation_div').show();
            data = "trainBureauId=" + $(this).val();
            $.ajax({
                type: "post",
                contentType: "application/x-www-form-urlencoded",
                url: "selectObject/getRailwayStation.action",
                dataType: "json",
                data: data,
                success: function (jsonResult) {
                    $('#RailwayStation').html('<option value="">选择车段</option>');
                    $.each(jsonResult,function(i,item){
                        $('#RailwayStation').append('<option value="'+ item["value"] + '">'+ item["text"] + '</option>');
                    })
                    $('#RailwayStation').selectpicker('refresh');
                },
                error:function(){
                    errorNotify(null,"无法获取车段信息！");
                }
            });
        }
        else
        {
            $('#RailwayStation_div').hide();
            $('#RailwayStation').html('');
        }
        $('#RailwayLine_div').hide();
        $('#RailwayLine').html('');
    })
    $('#RailwayStation').change(function() {
        if($(this).val()!=""){
            var data="";
            $('#RailwayLine_div').show();
            data = "trainBureauId=" + $("#RailwayBureau").val() + "&trainStationId=" + $(this).val();
            $.ajax({
                type: "post",
                contentType: "application/x-www-form-urlencoded",
                url: "selectObject/getRailwayLine.action",
                dataType: "json",
                data: data,
                success: function (jsonResult) {
                    $('#RailwayLine').html('<option value="">选择车次</option>');
                    $.each(jsonResult,function(i,item){
                        $('#RailwayLine').append('<option value="'+ item["value"] + '">'+ item["text"] + '</option>');
                    })
                    $('#RailwayLine').selectpicker('refresh');
                },
                error:function(){
                    errorNotify(null,"无法获取车次信息！");
                }
            });
        }
        else
        {
            $('#RailwayLine_div').hide();
            $('#RailwayLine').html('');
        }
    })
    $('#serach_button').click(function() {
        $('#table-ljxx').bootstrapTable('refresh', {
            url : "trainLine/queryTrainLineByPage.action",
            queryParams: queryParams_ljxx,
        });
    });
    $('#ljxx_download').click(function() {
        var trainBureauId = $("#RailwayBureau").val();
        var trainStationId = $("#RailwayStation").val();
        var trainLineId = $("#RailwayLine").val();
        if(trainBureauId==null){trainBureauId=""};
        if(trainStationId==null){trainStationId=""};
        if(trainLineId==null){trainLineId=""};
        window.open("trainLine/exportTrainLine.action?trainBureauId=" + trainBureauId + "&trainStationId=" + trainStationId + "&trainLineId=" + trainLineId + "&car_type=" + car_type);
    });
}
function list_azxx(){
    $.ajax({
        type: "post",
        url: "selectObject/getRailwayBureau.action",
        //url: "json/getDeviceModel.json",
        contentType: "application/json",
        dataType: "json",
        //data: JSON.stringify({ "BuIds": ["1", "2", "3"] }),
        success: function (jsonResult) {
            $.each(jsonResult,function(i,item){
                $('#RailwayBureau').append('<option value="'+ item["value"] + '">'+ item["text"] + '</option>');
            })
            $('.selectpicker').selectpicker('refresh');
        },
        error:function(){
            errorNotify(null,"无法获取路局信息！");
        }
    });
    $('#RailwayBureau').change(function() {
        if($(this).val()!=""){
            var data="";
            $('#RailwayStation_div').show();
            data = "trainBureauId=" + $(this).val();
            $.ajax({
                type: "post",
                contentType: "application/x-www-form-urlencoded",
                url: "selectObject/getRailwayStation.action",
                dataType: "json",
                data: data,
                success: function (jsonResult) {
                    $('#RailwayStation').html('<option value="">选择车段</option>');
                    $.each(jsonResult,function(i,item){
                        $('#RailwayStation').append('<option value="'+ item["value"] + '">'+ item["text"] + '</option>');
                    })
                    $('#RailwayStation').selectpicker('refresh');
                },
                error:function(){
                    errorNotify(null,"无法获取车段信息！");
                }
            });
        }
        else
        {
            $('#RailwayStation_div').hide();
            $('#RailwayStation').html('');
        }
        $('#RailwayLine_div').hide();
        $('#RailwayLine').html('');
    })
    $('#RailwayStation').change(function() {
        if($(this).val()!=""){
            var data="";
            $('#RailwayLine_div').show();
            data = "trainBureauId=" + $("#RailwayBureau").val() + "&trainStationId=" + $(this).val();
            $.ajax({
                type: "post",
                contentType: "application/x-www-form-urlencoded",
                url: "selectObject/getRailwayLine.action",
                dataType: "json",
                data: data,
                success: function (jsonResult) {
                    $('#RailwayLine').html('<option value="">选择车次</option>');
                    $.each(jsonResult,function(i,item){
                        $('#RailwayLine').append('<option value="'+ item["value"] + '">'+ item["text"] + '</option>');
                    })
                    $('#RailwayLine').selectpicker('refresh');
                },
                error:function(){
                    errorNotify(null,"无法获取车次信息！");
                }
            });
        }
        else
        {
            $('#RailwayLine_div').hide();
            $('#RailwayLine').html('');
        }
    })
    $('#serach_button').click(function() {
        $('#table-azxx').bootstrapTable('refresh', {
            url : "deviceInstall/getDeviceInstall.action",
            queryParams: queryParams_azxx,
        });
    });
    $('#azxx_download').click(function() {
        var isInstall = $("#isInstall").val();
        var trainBureauId = $("#RailwayBureau").val();
        var trainStationId = $("#RailwayStation").val();
        var trainLineId = $("#RailwayLine").val();
        var devSn = $("#DevSN").val();
        window.open("deviceInstall/exportDeviceInstall.action?isInstall=" + isInstall + "&trainBureauId=" + trainBureauId + "&trainStationId=" + trainStationId + "&trainLineId=" + trainLineId + "&devSn=" + devSn + "&car_type=" + car_type);
    });
}

function list_log2(){
	$('#serach_button').click(function() {
		if($("#serach_text").val()==""){
			BootstrapDialog.show({
	            title: '系统提示',
	            message: '请输入设备名称！',
	            buttons: [{
	                label: '关闭',
	                action: function(dialogItself){
	                    dialogItself.close();
	        			$("#serach_text").focus();
	                }
	            }]
	        });
		}
		else
		{
    		$('.bootstrap-table').remove();
    		$('.clearfix').remove();
    		$('.container-fluid').append('<table id="table-log2"></table>');
			var $table = $('#table-log2');
			$table.bootstrapTable({
				method: 'post',
				contentType: "application/x-www-form-urlencoded",
				url: APIUrl + "findAllClientLogs.action",
				dataType: "json",
				striped: true,
				toolbar:"#toolbar",
				height:"500",
				pagination: true, //分页
				singleSelect: false,
				search:false,
				sortable: true, 
				sidePagination: "server", //服务端处理分页
				queryParams: queryParams, //参数  
				columns: [
				{
				title: '时间',
				field: 'update_time',
				align: 'center',
				valign: 'middle',
					formatter:function(value,row,index){  
				    	return new Date(value).format("yyyy-MM-dd hh:mm:ss");
				    }
				}, 
				{
				title: '日志类型',
				field: 'type',
				align: 'center',
				},
				{
				title: '日志详情',
				field: 'msg',
				align: 'center'
				}
				]
			});
		}
		
	});
	function queryParams(params) {  //配置参数  
		var temp = { 
			limit: params.limit,
    		offset: params.offset,
			mac: $("#serach_text").val()
		};  
		return temp;  
	}
}