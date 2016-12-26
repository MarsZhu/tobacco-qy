var $ = require('browserify-zepto');
var config = require('../../common/js/config');
var util = require('../../common/js/util');
var Loading = require('../../widgets/loading');
var Toast = require('../../widgets/toast');

var Page = {
	init: function() {
		this.planId = util.getQueryString('planId');
		this.date = util.getQueryString('date');
		this.latitude = this.longitude = null;
		this.renderUI();
		this.bindUI();
	},

	renderUI: function() {
		this._getWxApi();
		this._renderVisitDetail();
	},

	bindUI: function() {
		var that = this;
		$('#container').on('touchend', '.record-icon', function(e) {
			that._checkContent($(this));
		});

		$('.btn-submit').on('touchend', function() {
		if ($(this).hasClass('weui_btn_disabled')) {
				return;
			}
			if (!that.isWxReady) {
				alert('请在零售户店铺有效范围内提交巡访！');
			} else {
				wx.getLocation({
					type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
					success: function (res) {
						that.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
						that.longitude = res.longitude ; // 经度，浮点数，范围为180 ~ -180。
						that._submitVisitPlan();
					},
					error: function() {
						alert('请在零售户店铺有效范围内提交巡访！');
					}
				});
			}
		});
	},
	
	_getWxApi: function() {
		var that = this;

		$.ajax({
			url: config.api.GET_WX_JS_SDK_CONFIG,
			dataType: 'jsonp',
			data: {
				url: window.location.href
				//url: 'http://qy.iyiplus.com'
			},
			success: function(data) {
				if (data.code == 0) {
					that._enableWxJsSdk(data.data);
				} 
			},
			error: function(xhr, type) {}
		});
	},

	_enableWxJsSdk: function(data) {
		var that = this;

		wx.config({
			debug: config.debug,
			appId: data.appId,
			timestamp: +data.timestamp,
			nonceStr: data.nonceStr,
			signature: data.signature,
			jsApiList: ['getLocation']
		});

		wx.ready(function() {
			that.isWxReady = true;	
		});

		wx.error(function(res) {
			console.log(res);
			alert(JSON.stringify(res));
		});
	},

	_submitVisitPlan: function() {
		var content = $('.weui_textarea').val(),
				that = this;

		Loading.show('巡访提交中');
		$.ajax({
			url: config.api.SUBMIT_VISITING_PLAN,
			dataType: 'jsonp',
			data: {
				planId: this.planId,
				extWork: content,
				latitude: this.latitude,
				longitude: this.longitude
			},
			success: function(data) {
				Loading.hide();
				if (data.code != 0) {
					console.log('$.ajax response error: ' + ( data.msg || 'unknown error' ));
					if (data.code == 951) {
						alert('请在零售户店铺有效范围内提交巡访！');
					} else {
						alert('系统错误，请稍后重试！')
					}
				} else {
					Toast.show('巡访提交成功');
					setTimeout(function() {
						location.href = config.host + '/pages/visit-list/future-date.html?date=' + that.date;
					}, 1000);
				}
			},
			error: function(xhr, type) {
				Loading.hide();
				console.log('$.ajax error: ' + type);
				alert('网络错误，请稍后重试！')
			}
		});
		
	},

	_checkContent: function(node) {
		node.toggleClass('record-icon-on');
		if (node.hasClass('record-icon-on')) {
			node.siblings('.check-text').html('已完成');			
		} else {
			node.siblings('.check-text').html('未完成');			
		}

		this._checkCanSubmit();
	},

	_checkCanSubmit: function() {
		var contentList = $('.record-icon'),
				canSubmit = false;
		$.each(contentList, function(i, n) {
			if ($(n).hasClass('record-icon-on')) {
				canSubmit = true;
				return false;
			}
		});
		if (canSubmit) {
			$('.btn-submit').removeClass('weui_btn_disabled');			
		} else {
			$('.btn-submit').addClass('weui_btn_disabled');			
		}
	},

	_renderVisitDetail: function() {
		var storeName = decodeURI(util.getQueryString('storeName'));

		$('.visit-detail').html(this.date + ' ' + storeName + '的巡访计划');
	}
};

Page.init();
