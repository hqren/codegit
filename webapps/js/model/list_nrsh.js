function nrsh_read(o){var a="";a="id="+o,$.ajax({type:"post",url:"downloadexJob/getDownloadexAuditJob.action",data:a,dataType:"json",success:function(a){a=a.rows[0];var t="",l="";t+='<div class="table row"><div class="form-horizontal">',t+='<br><div class="form-group"><label class="col-sm-2 control-label">\u4e0b\u53d1\u7c7b\u578b</label><div class="col-sm-4"><p class="form-control-static">'+auditDownTypeCN(a.downType)+'</p></div><label class="col-sm-2 control-label">\u4e0b\u53d1\u4f4d\u7f6e</label><div class="col-sm-4"><p class="form-control-static">'+a.downPosition+"</p></div></div>",t+='<div class="form-group"><label class="col-sm-2 control-label">\u4e0b\u53d1\u8303\u56f4</label><div class="col-sm-4"><p class="form-control-static">'+a.downRange+"</p></div></div>",""!=a.resourceurl&&(l='<button class="btn btn-primary" type="submit" onclick="nrsh_download(\''+a.resourceurl+"');\">\u8d44\u6e90\u5305\u4e0b\u8f7d</button>"),t+='<div class="form-group"><label class="col-sm-2 control-label">\u7d20\u6750\u9884\u89c8</label>'+l+"</div>";var e=a.localresourceurl.split(",");""!=a.localresourceurl&&e.length>0&&(t+='<br><div class="form-group col-sm-12">',$.each(e,function(o,a){t+='<div class="col-sm-1"></div><div class="col-sm-5 localresourceurl"><img src="/dmc_downloadex_img/'+a+'"><span class="badge">'+parseInt(o+1)+"</span></div>"}),t+="</div>"),t+="</div></div>",BootstrapDialog.show({size:BootstrapDialog.SIZE_WIDE,title:"\u4e0b\u53d1\u4efb\u52a1\u67e5\u770b",message:t,onshown:function(o){},buttons:[{label:"\u4e0b\u53d1",cssClass:"btn-primary",action:function(a){BootstrapDialog.confirm({title:"\u4e0b\u53d1\u786e\u8ba4\u63d0\u9192",message:"\u662f\u5426\u786e\u8ba4\u4e0b\u53d1\uff1f",closable:!0,draggable:!0,btnCancelLabel:"\u53d6\u6d88",btnOKLabel:"\u786e\u8ba4",callback:function(t){if(t){var l="";l="id="+o+"&state=1",$.ajax({type:"post",contentType:"application/x-www-form-urlencoded",url:"downloadexJob/updateDownloadexAuditJob.action",timeout:6e4,dataType:"json",data:l,success:function(o){var t="";t=600009==o.result?o.message:ConfigCN[o.result],$("#table-nrsh").bootstrapTable("refresh"),a.close(),BootstrapDialog.show({title:"\u7cfb\u7edf\u63d0\u793a",message:t,buttons:[{label:"\u5173\u95ed",action:function(o){o.close()}}]})},error:function(o,a,t){"timeout"==a&&BootstrapDialog.show({title:"\u7cfb\u7edf\u63d0\u793a",message:"\u8bf7\u6c42\u8d85\u65f6\uff01",buttons:[{label:"\u5173\u95ed",action:function(o){o.close()}}]})}})}}})}},{label:"\u62d2\u7edd\u4e0b\u53d1",action:function(a){a.close();var t="";t+='<div class="table row"><div id="FormValidator" class="form-horizontal">',t+='<br><div class="form-group"><label class="col-sm-3 control-label">\u62d2\u7edd\u7406\u7531</label><div class="col-sm-8"><textarea id="refuseReason" name="refuseReason" class="form-control" rows="2"></textarea></div></div>',t+="</div></div>",BootstrapDialog.show({title:"\u62d2\u7edd\u4e0b\u53d1",message:t,onshown:function(o){$("#FormValidator").bootstrapValidator({message:"This value is not valid",feedbackIcons:{valid:"glyphicon glyphicon-ok",invalid:"glyphicon glyphicon-remove",validating:"glyphicon glyphicon-refresh"},fields:{refuseReason:{message:"\u62d2\u7edd\u7406\u7531\u65e0\u6548",validators:{notEmpty:{message:"\u62d2\u7edd\u7406\u7531\u4e0d\u80fd\u4e3a\u7a7a"}}}}})},buttons:[{label:"\u786e\u8ba4",action:function(a){if($("#FormValidator").bootstrapValidator("validate"),$("#FormValidator").data("bootstrapValidator").isValid()){var t="";t="id="+o+"&refuseReason="+encodeURIComponent($("#refuseReason").val())+"&state=2",$.ajax({type:"post",contentType:"application/x-www-form-urlencoded",url:"downloadexJob/updateDownloadexAuditJob.action",timeout:6e4,dataType:"json",data:t,success:function(o){var t="";t=600009==o.result?o.message:ConfigCN[o.result],$("#table-nrsh").bootstrapTable("refresh"),a.close(),BootstrapDialog.show({title:"\u7cfb\u7edf\u63d0\u793a",message:t,buttons:[{label:"\u5173\u95ed",action:function(o){o.close()}}]})},error:function(o,a,t){"timeout"==a&&BootstrapDialog.show({title:"\u7cfb\u7edf\u63d0\u793a",message:"\u8bf7\u6c42\u8d85\u65f6\uff01",buttons:[{label:"\u5173\u95ed",action:function(o){o.close()}}]})}})}else BootstrapDialog.alert({title:"\u9a8c\u8bc1\u5931\u8d25",message:"\u8bf7\u786e\u8ba4\u8f93\u5165\u5185\u5bb9\u683c\u5f0f\u662f\u5426\u6b63\u786e\uff01",type:BootstrapDialog.TYPE_DANGER,buttonLabel:"\u786e\u8ba4"})}},{label:"\u5173\u95ed",action:function(o){o.close()}}]})}},{label:"\u5173\u95ed",action:function(o){o.close()}}]})}})}function nrsh_read2(o){var a="";a="id="+o,$.ajax({type:"post",url:"downloadexJob/getDownloadexAuditJob.action",data:a,dataType:"json",success:function(o){o=o.rows[0];var a="",t="";a+='<div class="table row"><div class="form-horizontal">',a+='<br><div class="form-group"><label class="col-sm-2 control-label">\u4e0b\u53d1\u7c7b\u578b</label><div class="col-sm-4"><p class="form-control-static">'+auditDownTypeCN(o.downType)+'</p></div><label class="col-sm-2 control-label">\u4e0b\u53d1\u4f4d\u7f6e</label><div class="col-sm-4"><p class="form-control-static">'+o.downPosition+"</p></div></div>",a+='<div class="form-group"><label class="col-sm-2 control-label">\u4e0b\u53d1\u8303\u56f4</label><div class="col-sm-4"><p class="form-control-static">'+o.downRange+"</p></div></div>",""!=o.resourceurl&&(t='<button class="btn btn-primary" type="submit" onclick="nrsh_download(\''+o.resourceurl+"');\">\u8d44\u6e90\u5305\u4e0b\u8f7d</button>"),a+='<div class="form-group"><label class="col-sm-2 control-label">\u7d20\u6750\u9884\u89c8</label>'+t+"</div>";var l=o.localresourceurl.split(",");""!=o.localresourceurl&&l.length>0&&(a+='<br><div class="form-group col-sm-12">',$.each(l,function(o,t){a+='<div class="col-sm-1"></div><div class="col-sm-5 localresourceurl"><img src="/dmc_downloadex_img/'+t+'"><span class="badge">'+parseInt(o+1)+"</span></div>"}),a+="</div>"),a+="</div></div>",BootstrapDialog.show({size:BootstrapDialog.SIZE_WIDE,title:"\u4e0b\u53d1\u4efb\u52a1\u67e5\u770b",message:a,onshown:function(o){},buttons:[{label:"\u5173\u95ed",action:function(o){o.close()}}]})}})}function nrsh_xf(o){BootstrapDialog.confirm({title:"\u4e0b\u53d1\u786e\u8ba4\u63d0\u9192",message:"\u662f\u5426\u786e\u8ba4\u4e0b\u53d1\uff1f",closable:!0,draggable:!0,btnCancelLabel:"\u53d6\u6d88",btnOKLabel:"\u786e\u8ba4",callback:function(a){if(a){var t="";t="id="+o+"&state=1",$.ajax({type:"post",contentType:"application/x-www-form-urlencoded",url:"downloadexJob/updateDownloadexAuditJob.action",timeout:6e4,dataType:"json",data:t,success:function(o){var a="";a=600009==o.result?o.message:ConfigCN[o.result],$("#table-nrsh").bootstrapTable("refresh"),BootstrapDialog.show({title:"\u7cfb\u7edf\u63d0\u793a",message:a,buttons:[{label:"\u5173\u95ed",action:function(o){o.close()}}]})},error:function(o,a,t){"timeout"==a&&BootstrapDialog.show({title:"\u7cfb\u7edf\u63d0\u793a",message:"\u8bf7\u6c42\u8d85\u65f6\uff01",buttons:[{label:"\u5173\u95ed",action:function(o){o.close()}}]})}})}}})}function nrsh_download(o){window.open(o)}function queryParams_nrsh(o){var a={limit:o.limit,offset:o.offset,downloadex_job_id:JobID,car_type:car_type};return a}var $table=$("#table-nrsh");$table.bootstrapTable({method:"post",contentType:"application/x-www-form-urlencoded",url:"downloadexJob/getDownloadexAuditJob.action",dataType:"json",striped:!0,toolbar:"#toolbar",uniqueId:"id",pagination:!0,singleSelect:!1,singleSelect:!0,sortable:!1,sidePagination:"server",queryParams:queryParams_nrsh,columns:[{title:"\u5e8f\u53f7",field:"id",align:"center",valign:"middle",formatter:function(o,a,t){return t+1}},{title:"\u65e5\u671f",field:"createTime",align:"center",valign:"middle"},{title:"\u63cf\u8ff0",field:"description",align:"center",valign:"middle"},{title:"\u72b6\u6001",field:"state",align:"center",valign:"middle",formatter:function(o,a,t){var l="";return"2"==o?l+='<span class="failError">'+auditStateCN(o)+"</span>":"1"==o||"3"==o?l+='<span class="failSuccess">'+auditStateCN(o)+"</span>":l=auditStateCN(o),l}},{title:"\u6267\u884c\u8bbe\u5907\u6570",field:"devExNum",align:"center",valign:"middle",formatter:function(o,a,t){var l="";return l+=o+"%"}},{title:"\u64cd\u4f5c",field:"cz",align:"center",valign:"middle",formatter:function(o,a,t){var l="";return 0==a.state?(l+='<button class="btn btn-primary" type="submit" onclick="nrsh_read('+a.id+');">\u67e5\u770b</button>',l+=' <button class="btn btn-primary" type="submit" onclick="nrsh_xf('+a.id+');">\u4e0b\u53d1</button>'):l+='<button class="btn btn-primary" type="submit" onclick="nrsh_read2('+a.id+');">\u67e5\u770b</button>',l}}]});