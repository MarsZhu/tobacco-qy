var Slide = require('../../widgets/slide');
var $ = require('browserify-zepto');
var Loading = require('../../widgets/loading');
var config = require('../../common/js/config');
var util = require('../../common/js/util');
var errorMsg = require('../../widgets/error-msg');

var Page = {
	init: function() {
		this.renderUI();		
	},

	renderUI: function() {
		var that = this;

		Loading.show();
		$.ajax({
			url: config.api.GET_BLACK_STORE_DETAIL,
			dataType: 'jsonp',
			data: {
				storeId: util.getQueryString('storeId')
			},
			success: function(data) {
				if (data.code != 0) {
					errorMsg.show(data.msg, config.debug);
				} else {
					that._renderStoreDetail(data.data.store);
					//that._renderSlide();
					//that._renderStoreMember(data.data);
					that._renderStoreAddress(data.data.store);
					that.bindUI();
				}
				Loading.hide();
			},
			error: function(xhr, type) {
				Loading.hide();
				errorMsg.show(type, config.debug);
			}
		});
	},

	bindUI: function() {
		var that = this;
		$('.to-store-member').on('touchend', function() {
			that._showStoreMember();
		});
		$('.member-btn-return').on('touchend', function() {
			that._hideStoreMember();
		});

		$('.member-main-wrap').on('touchmove', function(e) {
			if ($('.weui_actionsheet_toggle').length > 0) {
				e.stopPropagation();
			}
		});
	
		$('.to-store-address').on('touchend', function() {
			that._showStoreAddress();
		});
		$('.address-btn-return').on('touchend', function() {
			that._hideStoreAddress();
		});

		$('.address-main-wrap').on('touchmove', function(e) {
			if ($('.weui_actionsheet_toggle').length > 0) {
				e.stopPropagation();
			}
		});
	},

	_renderStoreDetail: function(data) {
		var tpl = $('#store-detail-tpl').html();
		$('.container').prepend($(util.render(tpl, data)));
	},

	_renderSlide: function() {
		$('#J_slide li').css('width', $('body').width());
		var slider = new Slide($('#J_slide'), {
			trigger: $('#J_slide_status'),
			hasTrigger: true,
			interval: 5000,
			visible : 1,
			loop: true,
			play: true
		});
	},

	_renderStoreMember: function(data) {
		var tpl = $('#store-member-tpl').html();
		$('.member-main').html(util.render(tpl, data));
	},


	_showStoreMember: function() {
		var maskNode = $('.member-mask');	
		var filterSelectorNode = $('.member-actionsheet');
		filterSelectorNode.addClass('weui_actionsheet_toggle');
		
		maskNode.show()
		.focus()//加focus是为了触发一次页面的重排(reflow or layout thrashing),使mask的transition动画得以正常触发
		.addClass('weui_fade_toggle').one('touchend', function () {
			that._hideStoreMember();
		});

		maskNode.unbind('transitionend').unbind('webkitTransitionEnd');
	},

	_hideStoreMember: function() {
		var maskNode = $('.member-mask');	
		var filterSelectorNode = $('.member-actionsheet');
		
		filterSelectorNode.removeClass('weui_actionsheet_toggle');
		maskNode.removeClass('weui_fade_toggle');
		maskNode.on('transitionend', function () {
			maskNode.hide();
		}).on('webkitTransitionEnd', function () {
			maskNode.hide();
		})
	},
	
	_renderStoreAddress: function(data) {
		var tpl = $('#store-address-tpl').html();
		$('.address-main').html(util.render(tpl, data));
		
		var map = new BMap.Map("allmap");
		var point = new BMap.Point(data.longitude, data.latitude);
		var marker = new BMap.Marker(point);  // 创建标注
		map.addOverlay(marker);              // 将标注添加到地图中
		map.centerAndZoom(point, 15);
		var opts = {
			width : 200,     // 信息窗口宽度
			height: 100,     // 信息窗口高度
			title : data.storeName, // 信息窗口标题
			//enableMessage:true,//设置允许信息窗发送短息
			//message:"亲耐滴，晚上一起吃个饭吧？戳下面的链接看下地址喔~"
		}
		var infoWindow = new BMap.InfoWindow('地址：' + data.address, opts);  // 创建信息窗口对象 
		marker.addEventListener("click", function(){          
			console.log('haha');
			map.openInfoWindow(infoWindow,point); //开启信息窗口
		});
	},

	_showStoreAddress: function() {
		var maskNode = $('.address-mask');	
		var filterSelectorNode = $('.address-actionsheet');
		filterSelectorNode.addClass('weui_actionsheet_toggle');
		
		maskNode.show()
		.focus()//加focus是为了触发一次页面的重排(reflow or layout thrashing),使mask的transition动画得以正常触发
		.addClass('weui_fade_toggle').one('touchend', function () {
			that._hideStoreAddress();
		});

		maskNode.unbind('transitionend').unbind('webkitTransitionEnd');
		filterSelectorNode.css({
			position: 'absolute'
		});
	},

	_hideStoreAddress: function() {
		var maskNode = $('.address-mask');	
		var filterSelectorNode = $('.address-actionsheet');
		
		filterSelectorNode.removeClass('weui_actionsheet_toggle');
		maskNode.removeClass('weui_fade_toggle');
		maskNode.on('transitionend', function () {
			maskNode.hide();
		}).on('webkitTransitionEnd', function () {
			maskNode.hide();
		})
		filterSelectorNode.css({
			position: 'fixed'
		});
	},
};

Page.init();
