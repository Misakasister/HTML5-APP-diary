			// 插件初始化
			mui.init();
			// 当h5+的插件加载完毕
			//后退退出应用
			mui.back = function(event) {
				plus.runtime.quit();
				return false;
			}
			mui.plusReady(function() {

				document.getElementById("mynotes").addEventListener('tap', function() {
					mui.openWindow({
						url: '../index.html',
						id: 'index'
					});
					event.stopPropagation();
				});

				document.getElementById("new").addEventListener('tap', function() {
					mui.openWindow({
						url: 'new.html',
						id: 'new',
					});
					event.stopPropagation();
				});

				(function($) {
					$(".mui-scroll-wrapper").scroll({
						bounce: false, //滚动条是否有弹力默认是true
						indicators: false, //是否显示滚动条,默认是true
					});
				})(mui);

				//a 链接的跳转
				mui('body').on('tap', 'a', function() {
					document.location.href = this.href;
				});
			});