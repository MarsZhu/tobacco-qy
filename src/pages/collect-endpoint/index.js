var $ = require('browserify-zepto');
var config = require('../../common/js/config');
var Loading = require('../../widgets/loading');
var errorMsg = require('../../widgets/error-msg');

var Page = {
	init: function() {
		this.con = '#container';
		this.renderUI();
	},

	renderUI: function() {
		this._renderEndpointList();
	},

	_renderEndpointList: function() {
		var that = this;

		Loading.show();
		$.ajax({
			url: config.api.LIST_ENDPOINT,
			dataType: 'jsonp',
			success: function(data) {
				if (data.code != 0) {
					console.log('$.ajax response error: ' + ( data.msg || 'unknown error' ));
					errorMsg.show(type, config.debug);
				} else {
					if (data.data) {
						that._drawTable(data.data);
					}
				}
				Loading.hide();
			},
			error: function(xhr, type) {
				console.log('$.ajax error: ' + type);
				Loading.hide();
				errorMsg.show(type, config.debug);
			}
		});
	},

	_drawTable: function(data) {
		var tb = $('#dataEndpoint table');
		tb.html('');
		tb.append('<tr><th>客户编码</th><th>客户名称</th><th>消费者档案数</th><th>购买记录</th><th>上传天数</th><th>多品扫码</th></tr>');
		for (var i = 0, j = data.length; i < j; i++) {
			tb.append('<tr><td>' + data[i].clientCode +'</td><td>' 
								+ data[i].clientName + '</td><td>' 
								+ data[i].consumerFile + '</td><td>' 
								+ data[i].weekRecord + '</td><td>' 
								+ data[i].weekUpload + '</td><td>' 
								+ data[i].todayScan + '</td></tr>');
		}	
	}
};

Page.init();
