$("#password_button").click(function(){$("#FormValidator").bootstrapValidator("validate"),$("#FormValidator").data("bootstrapValidator").isValid()?BootstrapDialog.confirm({title:"\u4fee\u6539\u5bc6\u7801\u786e\u8ba4\u63d0\u9192",message:"\u662f\u5426\u786e\u8ba4\u4fee\u6539\u5bc6\u7801\uff1f",closable:!0,draggable:!0,btnCancelLabel:"\u53d6\u6d88",btnOKLabel:"\u786e\u8ba4",callback:function(a){if(a){var s="";s="id="+UID+"&oldPassword="+$("#U_Password_Old").val()+"&password="+$("#U_Password").val(),$.ajax({type:"post",contentType:"application/x-www-form-urlencoded",url:"system/user/userCenterUpdatePassword.action",timeout:6e4,dataType:"json",data:s,success:function(a){var s="";s=600009==a.result?a.message:ConfigCN[a.result],600005==a.result&&BootstrapDialog.show({title:"\u7cfb\u7edf\u63d0\u793a",message:ConfigCN[a.result],buttons:[{label:"\u5173\u95ed",action:function(a){a.close(),LoginOut()}}]})},error:function(a,s,e){"timeout"==s&&BootstrapDialog.show({title:"\u7cfb\u7edf\u63d0\u793a",message:"\u8bf7\u6c42\u8d85\u65f6\uff01",buttons:[{label:"\u5173\u95ed",action:function(a){a.close()}}]})}})}}}):BootstrapDialog.alert({title:"\u9a8c\u8bc1\u5931\u8d25",message:"\u8bf7\u786e\u8ba4\u8f93\u5165\u5185\u5bb9\u683c\u5f0f\u662f\u5426\u6b63\u786e\uff01",type:BootstrapDialog.TYPE_DANGER,buttonLabel:"\u786e\u8ba4"})}),$("#FormValidator").bootstrapValidator({message:"This value is not valid",feedbackIcons:{valid:"glyphicon glyphicon-ok",invalid:"glyphicon glyphicon-remove",validating:"glyphicon glyphicon-refresh"},fields:{U_Password_Old:{message:"\u65e7\u5bc6\u7801\u65e0\u6548",validators:{notEmpty:{message:"\u65e7\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a"},stringLength:{min:6,max:20,message:"\u65b0\u5bc6\u7801\u957f\u5ea6\u5fc5\u987b\u5927\u4e8e\u7b49\u4e8e6\u4f4d\u6570\u4e14\u5c0f\u4e8e\u7b49\u4e8e20\u4f4d\u6570"}}},U_Password:{message:"\u65b0\u5bc6\u7801\u65e0\u6548",validators:{notEmpty:{message:"\u65b0\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a"},stringLength:{min:6,max:20,message:"\u65b0\u5bc6\u7801\u957f\u5ea6\u5fc5\u987b\u5927\u4e8e\u7b49\u4e8e6\u4f4d\u6570\u4e14\u5c0f\u4e8e\u7b49\u4e8e20\u4f4d\u6570"},different:{field:"U_Password_Old",message:"\u4e0d\u80fd\u548c\u65e7\u5bc6\u7801\u76f8\u540c"}}},U_Password2:{message:"\u786e\u8ba4\u65b0\u5bc6\u7801\u65e0\u6548",validators:{notEmpty:{message:"\u65b0\u786e\u8ba4\u65b0\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a"},stringLength:{min:6,max:20,message:"\u65b0\u5bc6\u7801\u957f\u5ea6\u5fc5\u987b\u5927\u4e8e\u7b49\u4e8e6\u4f4d\u6570\u4e14\u5c0f\u4e8e\u7b49\u4e8e20\u4f4d\u6570"},identical:{field:"U_Password",message:"\u4e24\u6b21\u5bc6\u7801\u4e0d\u4e00\u81f4"},different:{field:"U_Password_Old",message:"\u4e0d\u80fd\u548c\u65e7\u5bc6\u7801\u76f8\u540c"}}}}});