// 插件初始化
mui.init();
// 当h5+的插件加载完毕
//后退退出应用
mui.back = function(event) {
	plus.runtime.quit();
	return false;
}
mui.plusReady(function() {

	document.getElementById("allnotes").addEventListener('tap', function() {
		mui.openWindow({ //打开新界面
			url: 'main/allnotes.html',
			id: 'main/allnotes.html'
		});
		event.stopPropagation();
	});
	document.getElementById("new").addEventListener('tap', function() {
		mui.openWindow({
			url: 'main/new.html',
			id: 'main/new.html'
		});
		event.stopPropagation();
	});

	//页面滚动
	(function($) {
		$(".mui-scroll-wrapper").scroll({
			bounce: false, //滚动条是否有弹力默认是true
			indicators: false, //是否显示滚动条,默认是true
		});
	})(mui);

	//时间筛选
	document.getElementById("pickDateBtn").addEventListener('tap', function() {
		var dDate = new Date();
		//设置当前日期（不设置默认当前日期）
		dDate.setFullYear();
		var minDate = new Date();
		//最小时间
		minDate.setFullYear(2018, 1, 1);
		var maxDate = new Date();
		//最大时间
		maxDate.setFullYear(2035, 11, 31);
		plus.nativeUI.pickDate(function(e) {
			var d = e.date;
			mui.toast('您选择的日期是:' + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());
		}, function(e) {
			mui.toast("您没有选择日期");
		}, {
			title: '请选择日期',
			date: dDate,
			minDate: minDate,
			maxDate: maxDate
		});
	});

	//上传头像
	document.getElementById('userImg').addEventListener('tap', function() {
		if (mui.os.plus) {
			var a = [{
				title: '拍照'
			}, {
				title: '从手机相册选择'
			}];
			plus.nativeUI.actionSheet({
				title: '修改头像',
				cancel: '取消',
				buttons: a
			}, function(b) {
				switch (b.index) {
					case 0:
						break;
					case 1:
						//拍照
						getImages();
						break;
					case 2:
						//打开相册
						galleryImages();
						break;
					default:
						break;
				}
			}, false);
		}
	});

	//拍照
	function getImages() {
		var mobileCamera = plus.camera.getCamera();
		mobileCamera.captureImage(function(e) {
			plus.io.resolveLocalFileSystemURL(e, function(entry) {
				var path = entry.toLocalURL() + '?version=' + new Date().getTime();
				uploadHeadImg(path);
			}, function(err) {
				console.log("读取拍照文件错误");
			});
		}, function(e) {
			console.log("er", err);
		}, function() {
			filename: '_doc/head.png';
		});
	}

	//从本地相册选择
	function galleryImages() {
		console.log("你选择了从相册选择");
		plus.gallery.pick(function(a) {
			plus.io.resolveLocalFileSystemURL(a, function(entry) {
				plus.io.resolveLocalFileSystemURL('_doc/', function(root) {
					root.getFile('head.png', {}, function(file) {
						//文件已经存在
						file.remove(function() {
							console.log("文件移除成功");
							entry.copyTo(root, 'head.png', function(e) {
								var path = e.fullPath + '?version=' + new Date().getTime();
								uploadHeadImg(path);
							}, function(err) {
								console.log("copy image fail: ", err);
							});
						}, function(err) {
							console.log("删除图片失败：（" + JSON.stringify(err) + ")");
						});
					}, function(err) {
						//打开文件失败
						entry.copyTo(root, 'head.png', function(e) {
							var path = e.fullPath + '?version=' + new Date().getTime();
							uploadHeadImg(path);
						}, function(err) {

							console.log("上传图片失败：（" + JSON.stringify(err) + ")");
						});
					});
				}, function(e) {
					console.log("读取文件夹失败：（" + JSON.stringify(err) + ")");
				});
			});
		}, function(err) {
			console.log("读取拍照文件失败: ", err);
		}, {
			filter: 'image'
		});
	};

	//上传图片
	function uploadHeadImg(imgPath) {
		//选中图片之后，头像当前的照片变为选择的照片
		var mainImg = document.getElementById('userImg');
		mainImg.src = imgPath;


		var images = new Image();
		images.src = imgPath;
		var imgData = getBase64Image(images);
		mui.ajax('http://127.0.0.1/uploadHeadImg', {
			data: {
				'imgDatas': imgData
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if (data.status == '1') {
					mui.alert('上传成功！');
				}
			},
			error: function(xhr, type, errorThrown) {
				if (type == 'timeout') {
					mui.alert('服务器连接超时，请稍后再试');
				}
			}
		});
	}


	//压缩图片转成base64
	function getBase64Image(img) {
		var canvas = document.createElement("canvas");
		var width = img.width;
		var height = img.height;
		if (width > height) {
			if (width > 100) {
				height = Math.round(height *= 100 / width);
				width = 100;
			}
		} else {
			if (height > 100) {
				width = Math.round(width *= 100 / height);
			}
			height = 100;
		}

		canvas.width = width;
		canvas.height = height;
		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, width, height);

		var dataUrl = canvas.toDataURL('image/png', 0.8);
		return dataUrl.replace('data:image/png:base64,', '');
	};
});
