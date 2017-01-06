(function (){
	var isTest = /^10.10|127.0.0.1/.test(window.location.host)?'http://139.217.29.222/dmc/':'';
	var SEARCHDATA = getSearch();
	var DEVMAC = SEARCHDATA.devMac;
	var CARTYPE = getCookie('car_type') || SEARCHDATA.carType;  

	Vue.filter('format',function (str){
		return format(str,'YYYY年MM月DD日');
	});
	Vue.filter('timemat',function (time){
		var h = time/3600|0;
		var m = (time-3600*h)/60|0;
		return h==0?(m==0?m:m+'分钟'):h+'小时'+m+'分钟';
	});
	Vue.filter('clean',function (str){
		return str==''?'--':str;
	});
	Vue.filter('ztoMB',function (z){
		return (z/1024/1024).toFixed(2)+'MB';
	});

	var connectID = document.getElementById('tab-connect');
	var timesID = document.getElementById('tab-times');
	var flowId = document.getElementById('tab-flow');
	var flowechart = echarts.init(flowId);

	new Vue({
		el: "#tab-vue",
		data: {
			carType: CARTYPE, 	// 1火车sn 2大巴mac
			datatime: Date.now(),
			devMac: DEVMAC,
			contentVerison: '', // Portal版本
			equBrand: '', // 设备厂商
			bureauName: '', // 所在路局
			cbOrgName: '', // 所在运企
			cbPlateNum: '', // 车牌号
			cbBrand: '', // 车牌品牌
			cbModel: '', // 车牌类型
			cbPathStart: '', // 线路起点
			cbPathEnd: '', // 线路终点
			lineName: '', // 车次
			totalConnectTime: '', // 当日累计在线时长(s)
			devOnline: '', // 当日活跃时长(s)
			avgConnectUserTime: '', // 用户平均访问时长(s)
			userNum1: '', // 连接用户数
			userNum2: '', // 自弹页用户
			userNum3: '', // 进入首页用户
			userNum4: '', // 验证码请求用户
			userNum5: '', // 验证码成功用户
			userNum6: '', // 产生流量用户
            insideCount: '', // 内网访问人数
            outsideCount: '', // 外网访问人数
            userFlow: '', // 用户端消耗流量(字节)
            serverFlow: '', // 服务端消耗流量(字节)
            hostList: '', // 外网访问
            timeShow: false,
            connectID: connectID,
            timesID: timesID,
            colorArr: ['#1A9AFB','#149866','#DA9341','#FC5FC3','#24D2F4','#8FC971','#FE61F8','#32FEFD','#FEFD41','#31A4FB','#2BA275','#DD9E54','#FC6FC9'],
			chartData: {
				connect: {ready:false,show:false,data:{},id: connectID},
				times1: {ready:false,show:false,data:{},id: timesID},
				times2: {ready:false,show:false,data:{},id: timesID}
			}
		},
		computed: {
			totalFlow: function () {
      			return Number(this.userFlow) + Number(this.serverFlow);
    		}
		},
		watch: {
			'chartData.connect.ready': function (now,last){
				now && this.isReady(this.chartData.connect);
			},
			'chartData.times1.ready': function (now,last){
				now && this.isReady(this.chartData.times1);
			},
			'chartData.times2.ready': function (now,last){
				now && this.isReady(this.chartData.times2);
			}
		},
		ready: function (){
			// 请求失败，继续请求3次
			this.getInstall(3);
			this.getPortal(3);
			this.getActiveTime(3);
			this.getUser1(3);
			this.getUser6(3);
			this.getEveryone(3);
			this.getVisited(3);
			this.getMB(3);

			this.getUserDetail(3);
			this.getEveryClick(3);

			flowechart.showLoading();
		},
		methods: {
			// 获取设备安装信息接口
			getInstall: function (times){
				var _this = this;
				$.ajax({
					url: isTest + "devIpMac/getTrainOrBusDeviceInstallDetail.action",
					data: {
						carType: _this.carType,
						devMac: _this.devMac
					},
					dataType: 'json',
					success: function (data){
						_this.equBrand = data.equBrand;
						_this.cbPlateNum = data.cbPlateNum;
						_this.cbBrand = data.cbBrand;
						_this.cbModel = data.cbModel;
						_this.cbPathStart = data.cbPathStart;
						_this.cbPathEnd = data.cbPathEnd;
						_this.cbOrgName = data.cbOrgName;
						_this.bureauName = data.bureauName;
						_this.lineName = data.lineName;
					},
					error: function (){
						console.warn('获取设备安装信息接口失败，正在重新获取……');
						if (times) {
							_this.getInstall(times-1);
						}
						
					}
				});
			},
			// 获取设备portal版本号信息
			getPortal: function (times){
				var _this = this;
				$.ajax({
					url: isTest + 'devRealtimeInfo/getDevRealtimeInfoDetail.action',
					data: {
						devMac: _this.devMac
					},
					dataType: 'json',
					success: function (data){
						_this.contentVerison = data.contentVerison;
					},
					error: function (){
						console.warn('获取设备portal版本号信息失败，正在重新获取……');
						if (times) {
							_this.getPortal(times-1);
						}
						
					}
				});
			},
			// 获取设备当天活跃时间
			getActiveTime: function (times){
				var _this = this;
				$.ajax({
					url: isTest + 'devIpMac/selectTracfficByMacToday.action',
					data: {
						"devMacs": _this.devMac
					},
					dataType: 'json',
					success: function (data){
						_this.devOnline = data.devOnline;
					},
					error: function (){
						console.warn('获取设备当天活跃时间失败，正在重新获取……');
						if (times) {
							_this.getActiveTime(times-1);
						}
						
					}
				});
			},
			// 获取设备当天连接用户数量
			getUser1: function (times){
				var _this = this;
				$.ajax({
					url: isTest + 'devIpMac/getDevTodayConnectUserNum.action',
					data: {
						devMacs: _this.devMac
					},
					dataType: 'json',
					success: function (data){
						_this.userNum1 = data || 0;
					},
					error: function (){
						console.warn('获取设备当天连接用户数量失败，正在重新获取……');
						if (times) {
							_this.getUser1(times-1);
						}
						
					}
				});
			},
			// 获取设备当天产生流量用户数量
			getUser6: function (times){
				var _this = this;
				$.ajax({
					url: isTest + 'devIpMac/getDevTodayConnectTraUserNum.action',
					data: {
						devMacs: _this.devMac
					},
					dataType: 'json',
					success: function (data){
						_this.userNum6 = data || 0;
					},
					error: function (){
						console.warn('获取设备当天产生流量用户数量失败，正在重新获取……');
						if (times) {
							_this.getUser6(times-1);
						}
					}
				});
			},
			// 查询设备每个页面的访问用户数量
			getEveryone: function (times){
				var _this = this;
				$.ajax({
					url: isTest + 'devIpMac/getDevHitUserNumInfo.action',
					data: {
						devMacs: _this.devMac
					},
					dataType: 'json',
					success: function (data){
						_this.userNum2 = _this.userNum4 = _this.userNum5 = 0;
						for (var i = 0; i < data.length; i++) {
							switch(data[i].hitID){
								case "自弹页":
									_this.userNum2 = data[i].counts || 0;
									break;
								case "获取验证码点击":
									_this.userNum4 = data[i].counts || 0;
									break;
								case "认证成功":
									_this.userNum5 = data[i].counts || 0;
									break;
								default:
									break;
							}
						};
					},
					error: function (){
						console.warn('查询设备每个页面的访问用户数量失败，正在重新获取……');
						if (times) {
							_this.getEveryone(times-1);
						}
					}
				});
			},
			// 获取设备当日内网访问人数，外网访问人数，首页访问人数，观看电影人数等信息
			getVisited: function (times){
				var _this = this;
				$.ajax({
					url: isTest + 'devIpMac/getDevAccessInfo.action',
					data: {
						devMac: _this.devMac
					},
					dataType: 'json',
					success: function (data){
						_this.insideCount = data.insideCount || 0;
						_this.outsideCount = data.outsideCount || 0;
						_this.userNum3 = data.homePageCount || 0;
					},
					error: function (){
						console.warn('获取设备当日内网访问人数，外网访问人数，首页访问人数，观看电影人数等信息失败，正在重新获取……');
						if (times) {
							_this.getVisited(times-1);
						}
					}
				});
			},
			// 获取每台设备上累计流量、服务端流量、用户端流量、总连接时长、平均每个用户连接时长、播放电影
			getMB: function (times){
				var _this = this;
				$.ajax({
					url: isTest + 'devIpMac/selectDeviceConnectInfo.action',
					data: {
						devMac: _this.devMac
					},
					dataType: 'json',
					success: function (data){
						_this.userFlow = data.userFlow;
						_this.serverFlow = data.serverFlow;
						_this.avgConnectUserTime = data.avgConnectUserTime;
						_this.totalConnectTime = data.totalConnectTime;
						
						// 外网访问次数
						_this.hostList = data.hostList;
						_this.setChart(data,2);
						_this.setChart(data,3);
					},
					error: function (){
						console.warn('获取每台设备上累计流量、服务端流量、用户端流量、总连接时长、平均每个用户连接时长、播放电影失败，正在重新获取……');
						if (times) {
							_this.getMB(times-1);
						}
						
					}
				});
			},

			// 获取设备当天连接用户设备数量信息
			getUserDetail: function (times){
				var _this = this;
				$.ajax({
					url: isTest + 'devIpMac/getDevTodayConnectUser.action',
					data: {
						devMacs: _this.devMac
					},
					dataType: 'json',
					success: function (data){
						_this.setChart(data,0);
					},
					error: function (){
						console.warn('获取设备当天链接用户设备数量信息失败，正在重新获取……');
						if (times) {
							_this.getUserDetail(times-1);
						}
						
					}
				});
			},
			setChart: function (data,type){
				var nameArr = [];
				var vauleArr = [];
				var _this = this;
				// 第一个图表
				if (type==0) {
					var n = -1;
					for(var name in data){
						nameArr.push(name);
						vauleArr.push({
				            name:name,
				            type:'bar',
				            data: [data[name]],
				            itemStyle: {
			                    normal:{
			                    	color: _this.colorArr[(n++)%_this.colorArr.length]
			                	}
			                },
			                label: {
				                normal: {
				                    show: true,
				                    position: 'top'
				                }
				            }
				        });
					};
					// 显示前十个
					nameArr = nameArr.slice(0,10);
					vauleArr = vauleArr.slice(0,10);

					var option = {
						title : {
					        text: '手机品牌访问TOP10',
					        x: "center",
					        y: "10px",
					        textStyle: {
					        	fontSize: 16
					        }
					    },
					    grid: {
					    	width: '73%',
					    	height: 330,
					    },
					    tooltip : {
					        trigger: 'axis'
					    },
					    calculable : true,
					    legend: {
				            data: nameArr,
				            top: '400px',
				        },
					    xAxis : [
					        {
					            type : 'category',
					            data : [''],
					            name: '手机品牌'
					        }
					    ],
					    yAxis : [
					        {
				                type: 'value',
				                name: '人数',
				                axisLabel: {
				                    formatter: '{value}'
				                }
				            }
					    ],
					    series : vauleArr 
					};

					this.chartData.connect.ready = true;
					this.chartData.connect.data = option;
				
				}else if(type==1){// 第二个图表1
					for (var i = 0; i < data.length; i++) {
						nameArr.push(data[i].hitID);
						vauleArr.push({
				            name:data[i].hitID,
				            type:'bar',
				            data: [data[i].counts],
				            itemStyle: {
			                    normal:{
			                    	color: _this.colorArr[i%_this.colorArr.length]
			                	}
			                },
			                label: {
				                normal: {
				                    show: true,
				                    position: 'top'
				                }
				            }
				        });
					};
					var option = {
						grid: {
					    	width: '73%',
					    	height: 150,
					    },
					    title : {
					        text: '内网频道访问次数',
					        x: "center",
					        y: "top",
					        textStyle: {
					        	fontSize: 16
					        }
					    },
					    tooltip : {
					        trigger: 'axis'
					    },
					    calculable : true,
					    legend: {
				            data: nameArr,
				            top: '220px'
				        },
					    xAxis : [
					        {
					            type : 'category',
					            name: '频道',
					            data : ['']
					        }
					    ],
					    yAxis : [
					        {
				                type: 'value',
				                name: '访问次数',
				                axisLabel: {
				                    formatter: '{value}'
				                }
				            }
					    ],
					    series : vauleArr 
					};
					
					this.chartData.times1.ready = true;
					this.chartData.times1.data = option;
				}else if(type==2){// 第二个图表2

					var arr = this.hostList.split('|');
					for (var i = 0; i < arr.length; i++) {
						var arr2 = arr[i].split(',');
						if (arr2[0]==='') {
							continue;
						};
						nameArr.push(arr2[0]);
						vauleArr.push({
				            name:arr2[0],
				            type:'bar',
				            data: [arr2[1]],
				            itemStyle: {
			                    normal:{
			                    	color: _this.colorArr[i%_this.colorArr.length]
			                	}
			                },
			                label: {
				                normal: {
				                    show: true,
				                    position: 'top'
				                }
				            }
				        });
					};
					if (arr.length == 1 && arr[0] === '') {
						vauleArr = [{
							name: '',
				            type:'bar',
				            data: [''],
				            itemStyle: {
			                    normal:{
			                    	color: _this.colorArr[0]
			                	}
			                },
			                label: {
				                normal: {
				                    show: true,
				                    position: 'top'
				                }
				            }
				        }];
					}

					var option = {
					    title : {
					        text: 'TOP10外网地址访问次数',
					        x: "center",
					        y: "top",
					        textStyle: {
					        	fontSize: 16
					        }
					    },
					    grid: {
					    	width: '73%',
					    	height: 150,
					    },
					    tooltip : {
					        trigger: 'axis'
					    },
					    calculable : true,
					    legend: {
				            data: nameArr,
				            top: '220px'
				        },
					    xAxis : [
					        {
					            type : 'category',
					            name: '外网网站',
					            data : ['']
					        }
					    ],
					    yAxis : [
					        {
				                type: 'value',
				                name: '访问次数',
				                axisLabel: {
				                    formatter: '{value}'
				                }
				            }
					    ],
					    series : vauleArr 
					};

					this.chartData.times2.ready = true;
					this.chartData.times2.data = option;
				}else if(type==3){// 第三个图表 - 流量消耗
					var userFlow = this.z2MB(this.userFlow);
					var serverFlow = this.z2MB(this.serverFlow);
					
					var option = {
						title: {
							name: '流量消耗图（MB）'
						},
					    tooltip: {
					        trigger: 'item',
					        formatter: "{a} <br/>{b}: {c} ({d}%)"
					    },
					    legend: {
					        orient: 'vertical',
					        x: 'left',
					        data:['用户端','服务端']
					    },
					    series: [
					        {
					            name:'流量消耗',
					            type:'pie',
					            radius: ['30%', '50%'],
					            data:[
					                {
					                	value:userFlow,
					                	name:'用户端',
					                	itemStyle: {
							                normal:{
							                    color: '#149866'
							                }
							           }
							        },
							        {
					                	value:serverFlow,
					                	name:'服务端',
					                	itemStyle: {
							                normal:{
							                    color: '#1A9AFB'
							                }
							           }
							        }
					            ]
					        }
					    ]
					};
					flowechart.hideLoading();
					flowechart.setOption(option);
				};
			},
			// 查询设备每个页面的点击次数
			getEveryClick: function (times){
				var _this = this;
				$.ajax({
					url: isTest + 'devIpMac/getDevHitInfo.action',
					data: {
						devMacs: _this.devMac
					},
					dataType: 'json',
					success: function (data){
						_this.setChart(data,1);
					},
					error: function (){
						console.warn('查询设备每个页面的点击次数失败，正在重新获取……');
						if (times) {
							_this.getEveryClick(times-1);
						}
					}
				});
			},
			openChart: function (num){
				switch(num){
					case "1":
					case 1:
						this.chartData.connect.show = true;
						this.$nextTick(function () {
							this.isReady(this.chartData.connect);
						});
						break;
					case "2":
					case 2:
						this.timeShow = true;
						this.chartData.times1.show = true;
						this.$nextTick(function () {
							this.isReady(this.chartData.times1);
						});
						break;
					case "3":
					case 3:
						this.timeShow = true;
						this.chartData.times2.show = true;
						this.$nextTick(function () {
							this.isReady(this.chartData.times2);
						});
						break;
				}
			},
			isReady: function (t){
				var e = echarts.init(t.id);
				if (!t.ready || !t.show) {
					e.showLoading();
				}else{
					e.hideLoading();
					e.setOption(t.data);
				};
			},
			z2MB: function (z){
				return (z/1024/1024).toFixed(2);
			}
		}
	});


	//获取地址栏参数(允许同名name、无=、值为空)
	function getSearch(url){
		url = url?url.substr(url.indexOf('?')):window.location.search;	
		var str = url.substr(1);
		if (!str) {return {};};
		var json = {};
		var arr1 = str.split('&');
		var arr2 = [];
		for (var i = 0; i < arr1.length; i++) {
			arr2 = arr1[i].split('=');
			if (arr2.length === 1) {
				arr2[1] = undefined; // or arr[1] = null;
			};
			if (arr2[0] in json) {
				//判断上一个是单个值 还是数组
				var last = json[arr2[0]];
				last = (last == null || typeof last === 'string')?[last] : last;
				last = last.concat([arr2[1]]);
				json[arr2[0]] = last;
			}else{
				json[arr2[0]] = arr2[1];
			};
		};
		return json;
	};
	// 获取cookie
	function getCookie(name){ 
	    var strCookie = document.cookie; 
	    var arrCookie = strCookie.split("; "); 

	    for(var i = 0;i < arrCookie.length;i++){ 
	        var arr = arrCookie[i].split("="); 
	        if(arr[0] == name) return unescape(arr[1]);
	    }
	    return ""; 
	};

	function format(time,formatStr){
	    var nowDate = new Date(time);
	    var str = formatStr;
	    var Week = ['日', '一', '二', '三', '四', '五', '六'];
	    str = str.replace(/yyyy|YYYY/, nowDate.getFullYear());
	    str = str.replace(/yy|YY/, (nowDate.getYear() % 100) > 9 ? (nowDate.getYear() % 100).toString() : '0' + (nowDate.getYear() % 100));
	    str = str.replace(/MM/, (nowDate.getMonth() + 1) > 9 ? (nowDate.getMonth() + 1).toString() : '0' + (nowDate.getMonth() + 1));
	    str = str.replace(/M/g, (nowDate.getMonth() + 1));
	    str = str.replace(/w|W/g, Week[nowDate.getDay()]);
	    str = str.replace(/dd|DD/, nowDate.getDate() > 9 ? nowDate.getDate().toString() : '0' + nowDate.getDate());
	    str = str.replace(/d|D/g, nowDate.getDate());
	    str = str.replace(/hh|HH/, nowDate.getHours() > 9 ? nowDate.getHours().toString() : '0' + nowDate.getHours());
	    str = str.replace(/h|H/g, nowDate.getHours());
	    str = str.replace(/mm/, nowDate.getMinutes() > 9 ? nowDate.getMinutes().toString() : '0' + nowDate.getMinutes());
	    str = str.replace(/m/g, nowDate.getMinutes());
	    str = str.replace(/ss|SS/, nowDate.getSeconds() > 9 ? nowDate.getSeconds().toString() : '0' + nowDate.getSeconds());
	    str = str.replace(/s|S/g, nowDate.getSeconds());
	    return str;
	}

})();