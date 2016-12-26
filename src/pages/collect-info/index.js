var $ = require('browserify-zepto');
var config = require('../../common/js/config');
var Loading = require('../../widgets/loading');
var errorMsg = require('../../widgets/error-msg');
var Toast = require('../../widgets/toast');

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
			url: config.api.LIST_COLLECT_INFO,
			dataType: 'jsonp',
			success: function(data) {
				if (data.code != 0) {
					console.log('$.ajax response error: ' + ( data.msg || 'unknown error' ));
					errorMsg.show(data.msg, config.debug);
				} else {
					if (data.data && data.data.infoList) {
						that._drawTable(data.data.infoList);
						that.bindUI();
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

	bindUI: function() {
		var that = this;
		$('#container').on('touchend', '.btn-collect', function() {
			var p = $(this).parent('td'),
					clientCode = p.attr('data-clientcode');
			that._doCollect(clientCode, p);
		});
	},

	_doCollect: function(clientCode, node) {
		Loading.show('采集提交中');
		$.ajax({
			url: config.api.LIST_COLLECT_INFO_SUBMIT,
			dataType: 'jsonp',
			data: {
				clientCode: clientCode
			},
			success: function(data) {
				Loading.hide();
				if (data.code != 0) {
					console.log('$.ajax response error: ' + ( data.msg || 'unknown error' ));
					alert('系统错误，请稍后重试！');
				} else {
					Toast.show('操作成功');
					node.html('已采集');
				}
			},
			error: function(xhr, type) {
				Loading.hide();
				console.log('$.ajax error: ' + type);
				alert('网络错误，请稍后重试！');
			}
		});
	
	},

	_drawTable: function(data) {
		var tb = $('#dataEndpoint table'),
				isNotCollectTotal = 0;
		tb.html('');
		tb.append('<tr><th>客户编码</th><th>客户名称</th><th>采集周期</th><th>是否采集</th></tr>');
		for (var i = 0, j = data.length; i < j; i++) {
			var collectText = '';
			if (!data[i].isCollect) {
				isNotCollectTotal++;
				collectText = '<a href="javascript:;" class="weui_btn weui_btn_primary btn-collect">采集</a>';
			} else {
				collectText = '已采集';
			}
			tb.append('<tr><td>' + data[i].clientCode +'</td><td>' 
								+ data[i].clientName + '</td><td>' 
								+ data[i].collectPeriod + '</td><td data-clientcode="' + data[i].clientCode + '" width="50">' 
								+ collectText + '</td></tr>');
		}
		$('.txt').html('您还有' + isNotCollectTotal + '个未采集的客户，请及时把采集数据录入到V3系统中！');
	}
};

Page.init();
