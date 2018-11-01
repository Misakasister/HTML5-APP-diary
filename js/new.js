//时间戳

function time(){
	var time = new Date();
	year = time.getFullYear();
	month = time.getMonth() + 1;
	day = time.getDate();
	h = time.getHours();
	min = time.getMinutes();
	s = time.getSeconds();
	document.getElementById("time").innerText = year + '-' + month + '-' + day + ' ' + h + ':' + min + ':' + s;
}
time();
setInterval(time, 1000);
// 插件初始化
mui.init({
	keyEventBind: {
		backbutton: true //关闭back按键监听
	}
});

//后退退出应用
mui.back = function(event) {
	plus.runtime.quit();
	return false;
}

// 当h5+的插件加载完毕
mui.plusReady(function() {

	document.getElementById("mynotes").addEventListener('tap', function() {
		mui.openWindow({
			url: '../main.html',
			id: 'main'
		});
		event.stopPropagation();
	});
	document.getElementById("allnotes").addEventListener('tap', function() {
		mui.openWindow({ //打开新界面
			url: 'allnotes.html',
			id: 'allnotes'
		});
		event.stopPropagation();
	});
});



// 语音识别
mui.ready(function() {
	mui('.mui-input-row textarea').input();
});

//从相册中选择图片
document.getElementById('Image').addEventListener('tap', function() {
	if (mui.os.plus) {
		var a = [{
			title: "拍照"
		}, {
			title: "从手机相册选择"
		}];
		plus.nativeUI.actionSheet({
			title: "上传图片",
			cancel: "取消",
			buttons: a
		}, function(b) { /*actionSheet 按钮点击事件*/
			switch (b.index) {
				case 0:
					break;
				case 1:
					getImage(); /*拍照*/
					break;
				case 2:
					galleryImg(); /*打开相册*/
					break;
				default:
					break;
			}
		})
	}
}, false);

//拍照
function getImage() {
	var c = plus.camera.getCamera();
	c.captureImage(function(e) {
		plus.io.resolveLocalFileSystemURL(e, function(entry) {
			var s = entry.toLocalURL() + "?version=" + new Date().getTime();
			uploadHead(s); /*上传图片*/
		}, function(e) {
			console.log("读取拍照文件错误：" + e.message);
		});
	}, function(s) {
		console.log("error" + s);
	}, {
		filename: "_doc/head.png"
	})
};
//本地相册选择
function galleryImg() {
	plus.gallery.pick(function(a) {
		plus.io.resolveLocalFileSystemURL(a, function(entry) {
			plus.io.resolveLocalFileSystemURL("_doc/", function(root) {
				root.getFile("head.png", {}, function(file) {
					//文件已存在
					file.remove(function() {
						console.log("file remove success");
						entry.copyTo(root, 'head.png', function(e) {
								var e = e.fullPath + "?version=" + new Date().getTime();
								uploadHead(e); /*上传图片*/
								//变更大图预览的src
								//目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现
							},
							function(e) {
								console.log('copy image fail:' + e.message);
							});
					}, function() {
						console.log("delete image fail:" + e.message);
					});
				}, function() {
					//文件不存在
					entry.copyTo(root, 'head.png', function(e) {
							var path = e.fullPath + "?version=" + new Date().getTime();
							uploadHead(path); /*上传图片*/
						},
						function(e) {
							console.log('copy image fail:' + e.message);
						});
				});
			}, function(e) {
				console.log("get _www folder fail");
			})
		}, function(e) {
			console.log("读取拍照文件错误：" + e.message);
		});
	}, function(a) {}, {
		filter: "image"
	})
};

//判断是否公开
var para = document.createElement("p");
var node = document.createTextNode("您的日记将会被公开,且提交后不可更改为只自己可见");
para.appendChild(node);
para.className = "hint";
document.getElementById("mySwitch").addEventListener("toggle", function(event) {
	if (event.detail.isActive) {
		document.getElementsByClassName("mui-input-row")[0].insertBefore(para, document.getElementsByClassName("btn")[0]);
	} else {
		para.remove();
	}
})
