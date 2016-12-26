var $ = require('browserify-zepto');
var config = require('../../common/js/config');

var Page = {
	init: function() {
		this.con = '#container';
		this.renderUI();
	},

	renderUI: function() {
		this._getWxApi();
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
			jsApiList: ['scanQRCode']
		});

		wx.ready(function() {
			that._enableScan();	
		});

		wx.error(function(res) {
			console.log(res);
			alert(JSON.stringify(res));
		});
	},

	_enableScan: function() {
		$('.scan-btn')
		.removeClass('weui_btn_disabled')
		.on('click', function() {
			wx.scanQRCode({
				desc: '扫卷烟条码进行核价',
				needResult: 1,
				scanType: ['barCode'],
				success: function(res) {
					var resList = res.resultStr.split(','),
							boxBar = resList[1] || resList[0];
					window.location.href= config.host + '/pages/product-detail/index.html?boxBar=' + boxBar;
				}
			});
		});

	}

}

Page.init();
