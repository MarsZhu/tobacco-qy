var SearchBox = require('../../widgets/search-box');
var DataSource = require('../../widgets/search-box/data-source');
var Util = require('../../common/js/util');
var $ = require('browserify-zepto');
var escapeHtml = require('escape-html');
var config = require('../../common/js/config');

var Page = {
	init: function() {
		this.con = '#container';
		this.renderUI();
	},

	renderUI: function() {
		this._renderSearchBox();
	},

	_renderSearchBox: function() {
		var remoteDataSource = new DataSource({
			paramName: 'key',
			allowEmpty: true,
			isCached: true,
			parse: function(q, data) {
				var resList = data.data && data.data.productList;
				if (!resList) return [];
				return resList;
			},
			ajaxCfg: {
				dataType: 'jsonp',
				url: config.api.SEARCH_PRODUCT,
				data: {
					size: 500
				}
			}
		});

		var tpl = $('#product-record-tpl').html();

		var searchBox = new SearchBox({
			container: '.search-box-container',
			placeHolder: '搜索',
			defaultTips: '可输入卷烟商品名称进行搜索。',
			dataSource: remoteDataSource,
			format: function(q, data) {
				var ret = [];
				for (var i = 0; i < data.length; i++) {
					var d = data[i];
					if (q) {
						q = q.replace(/[\-#$\^*()+\[\]{}|\\,.?\s]/g, '\\$&');
						ret[i] = {
							content: Util.render(tpl, {
								productId: d.productId,
								name: escapeHtml(d.name + '').replace(new RegExp(q, "g"), "<b>$&</b>"),
								price: d.price
							}),
							value: d.productId
						};
					} else {
						ret[i] = {
							content: Util.render(tpl, d),
							value: d.productId
						};
					}
				}
				return ret;
			}
		});
	}
}

Page.init();
