var $table=$("#table-sbzx");$table.bootstrapTable({method:"post",contentType:"application/x-www-form-urlencoded",url:APIUrl+"getDevice.action",dataType:"json",striped:!0,toolbar:"#toolbar",uniqueId:"id",pagination:!0,singleSelect:!1,search:!1,sortable:!1,sidePagination:"server",queryParams:queryParams,columns:[{title:"\u5e8f\u53f7",field:"id",align:"center",valign:"middle",formatter:function(t,e,a){return a+1}},{title:"\u8bbe\u5907\u5e8f\u5217\u53f7",field:"mac",align:"center",valign:"middle"},{title:"\u8bbe\u5907\u5382\u5546",field:"factory",align:"center",valign:"middle"},{title:"\u6700\u540e\u4e0a\u62a5\u65f6\u95f4",field:"device_cur_time",align:"center",formatter:function(t,e,a){return new Date(t.replace(/-/g,"/")).format("yyyy-MM-dd HH:mm:ss")}}]});var data="";void 0!=$.cookie("car_type")&&0!=$.cookie("car_type")&&(car_type=$.cookie("car_type"),data="car_type="+car_type),$.ajax({type:"POST",url:"device/getStatisticsDevice.action",timeout:6e4,dataType:"json",data:data,success:function(t){$("#totalCount").html(t.totalCount),$("#todayonLineCount").html(t.todayonLineCount),$("#sevendaysonLineCount").html(t.sevendaysonLineCount)},error:function(t,e,a){"timeout"==e&&BootstrapDialog.show({title:"\u7cfb\u7edf\u63d0\u793a",message:"\u8bf7\u6c42\u8d85\u65f6\uff01",buttons:[{label:"\u5173\u95ed",action:function(t){t.close()}}]})}});