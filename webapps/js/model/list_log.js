var $table=$("#table-log");$table.bootstrapTable({method:"post",contentType:"application/x-www-form-urlencoded",url:APIUrl+"findAllClientLogs.action",dataType:"json",striped:!0,toolbar:"#toolbar",uniqueId:"id",pagination:!0,singleSelect:!1,search:!0,sortable:!1,sidePagination:"server",columns:[{title:"\u65f6\u95f4",field:"name",align:"center",valign:"middle"},{title:"\u65e5\u5fd7\u7c7b\u578b",field:"pic",align:"center",valign:"middle"},{title:"\u65e5\u5fd7\u8be6\u60c5",field:"jg",align:"center",valign:"middle"}]});