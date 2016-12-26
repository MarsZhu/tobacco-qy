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
			url: config.api.GET_STORE_GRANTS_DETAIL,
			dataType: 'jsonp',
			data: {
				storeId: util.getQueryString('storeId')
			},
			success: function(data) {
				if (data.code != 0) {
					errorMsg.show(data.msg, config.debug);
				} else {
					that._renderGrantDetail(data.data);
				}
				Loading.hide();
			},
			error: function(chr, type) {
				Loading.hide();
				errorMsg.show(type, config.debug);
			}
		});
	},

	_renderGrantDetail: function(data) {
		var tpl = $('#grant-detail-tpl').html();
		$.each(data.records, function(i ,r) {
			var g = r.grantChange;
			if (g >= 0) {
				r.grantChange = '获得' + r.grantChange;
			} else {
				r.grantChange = '扣除' + Math.abs(r.grantChange);
			}
		});
		$('.container').html(util.render(tpl, data));
	}
};

Page.init();
