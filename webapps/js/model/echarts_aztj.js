function EchartsShow(t,a,e){var i=echarts.init(document.getElementById(t),"macarons");option={title:{text:a,x:"center",y:"center",textStyle:{fontSize:"30",fontWeight:"bold"}},tooltip:{trigger:"item",formatter:"{b} : {c} ({d}%)"},series:[{name:"-",type:"pie",radius:["50%","70%"],itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"},normal:{label:{show:!0,formatter:"{b} : \n{c} ({d}%)"},labelLine:{show:!0}}},data:e}]},i.hideLoading(),i.setOption(option)}function queryInstallStatistics(){var t=echarts.init(document.getElementById("echarts_1"),"macarons");t.showLoading({text:"\u6b63\u5728\u52aa\u529b\u7684\u8bfb\u53d6\u6570\u636e\u4e2d..."});var t=echarts.init(document.getElementById("echarts_2"),"macarons");t.showLoading({text:"\u6b63\u5728\u52aa\u529b\u7684\u8bfb\u53d6\u6570\u636e\u4e2d..."});var a=$("#RailwayBureau").val(),e=$("#RailwayStation").val(),i=$("#TrainShop").val(),o="trainBureauId="+a+"&trainStationId="+e+"&trainShopId="+i;$.ajax({type:"post",url:"installStatistics/queryInstallStatistics.action",timeout:6e4,dataType:"json",data:o,success:function(t){EchartsShow("echarts_1",t.describeDistribution,t.installDistribution),EchartsShow("echarts_2",t.describeInstall,t.installStatistics)},error:function(t,a,e){"timeout"==a&&BootstrapDialog.show({title:"\u7cfb\u7edf\u63d0\u793a",message:"\u8bf7\u6c42\u8d85\u65f6\uff01",buttons:[{label:"\u5173\u95ed",action:function(t){t.close()}}]})}})}function queryInstallStatusStatistics(){var t=echarts.init(document.getElementById("echarts_3"),"macarons");t.showLoading({text:"\u6b63\u5728\u52aa\u529b\u7684\u8bfb\u53d6\u6570\u636e\u4e2d..."});var t=echarts.init(document.getElementById("echarts_4"),"macarons");t.showLoading({text:"\u6b63\u5728\u52aa\u529b\u7684\u8bfb\u53d6\u6570\u636e\u4e2d..."});var a=$("#RailwayBureau2").val(),e=$("#RailwayStation2").val(),i=$("#TrainShop2").val(),o="trainBureauId="+a+"&trainStationId="+e+"&trainShopId="+i;$.ajax({type:"post",url:"installStatistics/queryInstallStatusStatistics.action",timeout:6e4,dataType:"json",data:o,success:function(t){EchartsShow("echarts_3",t.describeDistribution,t.installDistribution),EchartsShow("echarts_4",t.describeInstall,t.installStatistics)},error:function(t,a,e){"timeout"==a&&BootstrapDialog.show({title:"\u7cfb\u7edf\u63d0\u793a",message:"\u8bf7\u6c42\u8d85\u65f6\uff01",buttons:[{label:"\u5173\u95ed",action:function(t){t.close()}}]})}})}$('a[data-toggle="tab"]').on("shown.bs.tab",function(t){var a=$(t.target).text();$(t.relatedTarget).text();"\u72b6\u6001\u7edf\u8ba1"==a&&(queryInstallStatusStatistics(),$.ajax({type:"post",url:"selectObject/getRailwayBureau.action",contentType:"application/json",dataType:"json",success:function(t){$("#RailwayBureau2").html('<option value="">\u9009\u62e9\u914d\u5c5e\u5c40</option>'),$.each(t,function(t,a){$("#RailwayBureau2").append('<option value="'+a.value+'">'+a.text+"</option>")}),$(".selectpicker").selectpicker("refresh")},error:function(){errorNotify(null,"\u65e0\u6cd5\u83b7\u53d6\u914d\u5c5e\u5c40\u4fe1\u606f\uff01")}}),$("#RailwayBureau2").change(function(){if(""!=$(this).val()){var t="";t="trainBureauId="+$(this).val(),$.ajax({type:"post",contentType:"application/x-www-form-urlencoded",url:"selectObject/getRailwayStation.action",dataType:"json",data:t,success:function(t){$("#RailwayStation2").html('<option value="">\u9009\u62e9\u914d\u5c5e\u6bb5</option>'),$("#TrainShop2").html('<option value="">\u9009\u62e9\u914d\u5c5e\u8f66\u95f4</option>'),$.each(t,function(t,a){$("#RailwayStation2").append('<option value="'+a.value+'">'+a.text+"</option>")}),$(".selectpicker").selectpicker("refresh")},error:function(){errorNotify(null,"\u65e0\u6cd5\u83b7\u53d6\u914d\u5c5e\u6bb5\u4fe1\u606f\uff01")}})}else $("#RailwayStation2").html('<option value="">\u9009\u62e9\u914d\u5c5e\u6bb5</option>'),$("#TrainShop2").html('<option value="">\u9009\u62e9\u914d\u5c5e\u8f66\u95f4</option>'),$(".selectpicker").selectpicker("refresh")}),$("#RailwayStation2").change(function(){if(""!=$(this).val()){var t="";t="trainBureauId="+$("#RailwayBureau").val()+"&trainStationId="+$(this).val(),$.ajax({type:"post",contentType:"application/x-www-form-urlencoded",url:"selectObject/getRailwayShop.action",dataType:"json",data:t,success:function(t){$("#TrainShop2").html('<option value="">\u9009\u62e9\u914d\u5c5e\u8f66\u95f4</option>'),$.each(t,function(t,a){$("#TrainShop2").append('<option value="'+a.value+'">'+a.text+"</option>")}),$(".selectpicker").selectpicker("refresh")},error:function(){errorNotify(null,"\u65e0\u6cd5\u83b7\u53d6\u914d\u5c5e\u8f66\u95f4\u4fe1\u606f\uff01")}})}else $("#TrainShop2").html('<option value="">\u9009\u62e9\u914d\u5c5e\u8f66\u95f4</option>'),$(".selectpicker").selectpicker("refresh")}))}),queryInstallStatistics(),$("#serach_button").click(function(){queryInstallStatistics()}),$("#serach_button2").click(function(){queryInstallStatusStatistics()}),$.ajax({type:"post",url:"selectObject/getRailwayBureau.action",contentType:"application/json",dataType:"json",success:function(t){$("#RailwayBureau").html('<option value="">\u9009\u62e9\u914d\u5c5e\u5c40</option>'),$.each(t,function(t,a){$("#RailwayBureau").append('<option value="'+a.value+'">'+a.text+"</option>")}),$(".selectpicker").selectpicker("refresh")},error:function(){errorNotify(null,"\u65e0\u6cd5\u83b7\u53d6\u914d\u5c5e\u5c40\u4fe1\u606f\uff01")}}),$("#RailwayBureau").change(function(){if(""!=$(this).val()){var t="";t="trainBureauId="+$(this).val(),$.ajax({type:"post",contentType:"application/x-www-form-urlencoded",url:"selectObject/getRailwayStation.action",dataType:"json",data:t,success:function(t){$("#RailwayStation").html('<option value="">\u9009\u62e9\u914d\u5c5e\u6bb5</option>'),$("#TrainShop").html('<option value="">\u9009\u62e9\u914d\u5c5e\u8f66\u95f4</option>'),$.each(t,function(t,a){$("#RailwayStation").append('<option value="'+a.value+'">'+a.text+"</option>")}),$(".selectpicker").selectpicker("refresh")},error:function(){errorNotify(null,"\u65e0\u6cd5\u83b7\u53d6\u914d\u5c5e\u6bb5\u4fe1\u606f\uff01")}})}else $("#RailwayStation").html('<option value="">\u9009\u62e9\u914d\u5c5e\u6bb5</option>'),$("#TrainShop").html('<option value="">\u9009\u62e9\u914d\u5c5e\u8f66\u95f4</option>'),$(".selectpicker").selectpicker("refresh")}),$("#RailwayStation").change(function(){if(""!=$(this).val()){var t="";t="trainBureauId="+$("#RailwayBureau").val()+"&trainStationId="+$(this).val(),$.ajax({type:"post",contentType:"application/x-www-form-urlencoded",url:"selectObject/getRailwayShop.action",dataType:"json",data:t,success:function(t){$("#TrainShop").html('<option value="">\u9009\u62e9\u914d\u5c5e\u8f66\u95f4</option>'),$.each(t,function(t,a){$("#TrainShop").append('<option value="'+a.value+'">'+a.text+"</option>")}),$(".selectpicker").selectpicker("refresh")},error:function(){errorNotify(null,"\u65e0\u6cd5\u83b7\u53d6\u914d\u5c5e\u8f66\u95f4\u4fe1\u606f\uff01")}})}else $("#TrainShop").html('<option value="">\u9009\u62e9\u914d\u5c5e\u8f66\u95f4</option>'),$(".selectpicker").selectpicker("refresh")});