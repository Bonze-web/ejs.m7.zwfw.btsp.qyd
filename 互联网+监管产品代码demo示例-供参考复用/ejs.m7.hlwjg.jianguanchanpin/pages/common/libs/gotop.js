(function(root,factory,plugName){
	factory(root,plugName);
})(window,function(root,plugName){
	var Go = function(config){
		if(!root['$']||!root['jQuery']){
			console.error('很抱歉我们插件是依赖jQuery;请你先引入jQuery');
		}
		//console.log('插件的名字是'+plugName);
		this.hide = config.hide || false;//当页面不滚动时 是否隐藏
		this.url = config.url || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACdUlEQVRoQ+2Z0XEaMRCGtcPdPbuD2BU4VBDowK4gcQU2D0iPcZ4YLQ/EFZgO7FQQOjCuIO4g5BUeNrOZw/FgQCvd3tjMSC/MoD1pv139Wp0OzIE3OHD/TasAiPiRiE6rqvoxGAwWbQSrNQBE/GKMua2dnhtjLqy1/KvaWgHYcP6fw0T0VFVVVzsT6gC8bIwxP40xR1tCPbPW9jVToAowmUyOlsvlAwAc73Hyxlp7pQWhCuC9vwOAM4FzrIepwC5oogbgvb8GgK/BGf8bdDVErQIwHo97RMTrPqYtyrI8aSrqxgCj0ei40+k87BBtCGhure2GjPb1NwJg0a5WK4487zypbWqtvUh9uBEAInKh4oLVqBHRwDn3PWWQZIBtxSrFgfUzANAfDoez2DGSAOpixetes/FZqR+7M0UD1Ov+V6JoQ8Dzsiz7MTtTNAAismh7IU9S+4no3jl3Ln0+CgARWWiX0sEb2ImPG2IAbdGG4Ijo3Dl3H7ITAbS87nf5KKrUIgDv/RUATELR0O6XbK1SgDMAuNN2cN94RPRYVVUvtCOJAHgiPvMURfHqnE9E/B9X408xgET0BwA4s0+bzxVFMQ85/lwAYybdZVtr5HfkWCrvBOIMhJxDRD4GiLMgWd+hObk/A6yjlDMgWS9bbPISWgfFez8FgM/SQL47EcfeSmSAOtVqGsgZkIpnwy5n4MUuFHW1mEX81iKWvjKGpPFmGiCib86565CDof4MkCrinIEWRBx1c9HkRvqlLtQ0EPuV5t3VAY4KIvINw4fQzsFXJs65Jh9FnqdQywCPWN9O8Na4y7kFEc1SP2ZsC4wqQCjybfQfPMBfLskvQNEhCIkAAAAASUVORK5CYII=";
		this.state = config.state || 'bottom';//出现的位置
		this.height = config.height || '40px';//定义元素的高
		this.width = config.width || '40px'; //定义元素的宽
		this.time = config.time || 500;//滚动到顶部需要时间 ms
		this.scrollTop = config.scrollTop || 400;//滚动到什么位置显示 px
		this.aimation = config.aimation || 'show';//出现动画
		this.toTop = config.toTop;//到顶部触发事件
		this.toShow = config.toShow;// 展示触发事件
		this.toHide = config.toHide;// 隐藏触发事件
		this.go = config.go;//点击返回触发事件
		this.hidetime = config.hidetime || 2000;//设置隐藏时间 
		this.init();
	}
	Go.prototype = {
		constructor:Go,
		init:function(){
			var sate,_this = this,timer=null;
			if(this.state=='center'){
				sate='top:50%';
			}
			else if(this.state=='bottom'){
				sate= 'bottom:10%'
			}
			var dom = '<div class="GoTop-box" style="width:'+this.width+';height:'+this.height+';display:none;position:fixed;right:10px;'+sate+'"><img src='+this.url+' style="width:100%"></div>'
			$('body').append(dom);
			$(window).on('scroll',throttle(scroll,50));
			function scroll(){
				if($(window).scrollTop()>=_this.scrollTop){
					$('.GoTop-box').css('display','block').addClass(_this.aimation);
					if(_this.hide){
						clearTimeout(timer);
						timer=setTimeout(function(){
							$('.GoTop-box').css('display','none');
							_this.toHide&&_this.toHide();
						},2000)
					}
					_this.toShow&&_this.toShow();
				}else{
					if($('.GoTop-box').css('display')=='block'){
						_this.toHide&&_this.toHide();
					}
					$('.GoTop-box').hide().removeClass(_this.aimation);
					
				}
				if($(window).scrollTop()<=5){
					_this.toTop&&_this.toTop();
				}
			}
			$('.GoTop-box').on('click',function(){
				$('html,body').animate({scrollTop:0},500,function(){
					_this.toTop&&_this.toTop();
				});
				_this.go&&_this.go();
			})
			$(window).on('load',function(){
				if($(window).scrollTop()==0){
					return;
				}
				scroll();
			})
			$('.GoTop-box').on('mouseenter',function(){
				clearTimeout(timer);
				$('.GoTop-box').css('display','blcok');
			})
			$('.GoTop-box').on('mouseleave',function(){
				timer=setTimeout(function(){
					$('.GoTop-box').css('display','none');
					_this.toHide&&_this.toHide();
				},2000)
			})

		}
	}
	//公共函数  
		//节流函数
	function throttle(fn,time){
		var timer=null;
		return function(){
			var ctx=this,arg=arguments;
			clearTimeout(timer);
			timer = setTimeout(function(){fn.apply(ctx,arg)},time)
		}
	}
	root[plugName] = Go;
},'GoTop');