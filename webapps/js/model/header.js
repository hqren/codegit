function SystemSelect(){var e=Date.parse(new Date),t=JSON.parse(localStorage.getItem("userCenter_authType"));if(t.list.length>0){var a=t.list[0].value;top.location.href=a+"?"+e}}function LoginOut(){var e=Date.parse(new Date);$.session.clear();try{var t=JSON.parse(localStorage.getItem("userCenter_login"));if(localStorage.clear(),t.list.length>0){var a=t.list[0].value;top.location.href=a+"?"+e}else top.location.href="../login.html?"+e}catch(o){console.error("\u83b7\u53d6\u5b57\u5178\u8868\u9519\u8bef\uff0c\u8fd4\u56de\u9ed8\u8ba4\u767b\u9646\u9875URL\uff01"),top.location.href="../login.html?"+e}}var carType=localStorage.getItem("carType"+localStorage.getItem("SystemID"));car_type=$.cookie("car_type"),""!=car_type&&void 0!=car_type||"1,2"!=carType||(car_type=0);var TempTab=0;2==car_type&&(TempTab=0),0!=car_type&&1!=car_type||(TempTab=1),$("#UserName").html($.cookie("loginName")+" \u6b22\u8fce\u60a8\uff01"),"1,2"==carType&&$("#nav_authType").show(),void 0==car_type&&(car_type=null),void 0!=car_type&&(TempTab=parseInt(TempTab),$("label").removeClass("active"),$("label").eq(TempTab).addClass("active"),$(".radioItem").removeAttr("checked"),$(".radioItem").eq(TempTab).attr("checked","checked")),$(".radioItem").change(function(){var e=Date.parse(new Date);$.cookie("car_type",$(this).val()),console.log($(this).val()),$(".radioItem").removeAttr("checked"),$(this).attr("checked","checked"),parent.menu.location.href="./menu.html?"+e,parent.main.location.href="./echarts.html?"+e}),$("#SystemSelect").click(function(){SystemSelect()}),$("#OutLogin").click(function(){$.ajax({type:"post",contentType:"application/x-www-form-urlencoded",url:"system/auth/loginOut.action",dataType:"json",success:function(e){LoginOut()},error:function(){LoginOut()}})});