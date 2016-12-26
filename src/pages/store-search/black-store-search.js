var FilterSearchBox = require('../../widgets/search-box/filter-search-box');
var DataSource = require('../../widgets/search-box/data-source');
var Util = require('../../common/js/util');
var $ = require('browserify-zepto');
var escapeHtml = require('escape-html');
var config = require('../../common/js/config');

var remoteDataSource = new DataSource({
	paramName: 'key',
	allowEmpty: true,
	parse: function(q, data) {
		var resList = data.data && data.data.storeList;
		if (!resList) return [];
		return resList;
	},
	ajaxCfg: {
		dataType: 'jsonp',
		url: config.api.SEARCH_BLACK_STORE,
		data: {
			size: 100
		}
	}
});

var tpl = $('#store-record-tpl').html();

var filterSearchBox = new FilterSearchBox({
	container: '.search-box-container',
	placeHolder: '搜索',
	defaultTips: '可选择特定条件进行搜索。',
	fitlerName: 'field',
	filters: [
		{name: '搜店铺', value: '0'},
		{name: '搜工商人员', value: '1'},
		{name: '搜客户编码', value: '2'}
	],
	dataSource: remoteDataSource,
	format: function(q, data) {
		var ret = [];
		for (var i = 0; i < data.length; i++) {
			var d = data[i];
			if (q) {
				q = q.replace(/[\-#$\^*()+\[\]{}|\\,.?\s]/g, '\\$&');
				ret[i] = {
					content: Util.render(tpl, {
						storeId: d.storeId,
						shopName: escapeHtml(d.shopName + '').replace(new RegExp(q, "g"), "<b>$&</b>"),
						keeperName: escapeHtml(d.keeperName + '').replace(new RegExp(q, "g"), "<b>$&</b>"),
						administratorName: escapeHtml(d.administratorName + '').replace(new RegExp(q, "g"), "<b>$&</b>"),
						managerName: escapeHtml(d.managerName + '').replace(new RegExp(q, "g"), "<b>$&</b>"),
						catchpoler: escapeHtml(d.catchpoler + '').replace(new RegExp(q, "g"), "<b>$&</b>")
					}),
					value: d.storeId
				};
			} else {
				ret[i] = {
					content: Util.render(tpl, d),
					value: d.storeId
				};
			}
		}
		return ret;
	}
});
