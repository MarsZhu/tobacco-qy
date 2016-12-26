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
		var that = this,
				productId = util.getQueryString('productId'),
				boxBar = util.getQueryString('boxBar'),
				data = {};

		if (productId) {
			data.productId = productId;
		} else {
			data.boxBar = boxBar;
		}

		Loading.show();
		$.ajax({
			url: config.api.GET_PRODUCT_DETAIL,
			dataType: 'jsonp',
			data: data,
			success: function(data) {
				if (data.code != 0) {
					errorMsg.show(data.msg, config.debug);
				} else {
					that._renderProductDetail(data.data);
				}
				Loading.hide();
			},
			error: function(chr, type) {
				Loading.hide();
				errorMsg.show(type, config.debug);
			}
		});
	},

	_renderProductDetail: function(data) {
		var tpl = $('#product-detail-tpl').html();
		$('.container').html(util.render(tpl, data));
	}
};

Page.init();
