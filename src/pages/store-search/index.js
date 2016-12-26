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
		url: config.api.SEARCH_STORE,
		data: {
			size: 500
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
		{name: '搜持证人', value: '1'},
		{name: '搜市管员', value: '2'},
		{name: '搜客户经理', value: '3'},
		{name: '搜许可证', value: '4'},
		{name: '搜客户编码', value: '5'},
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
						storeName: escapeHtml(d.storeName + '').replace(new RegExp(q, "g"), "<b>$&</b>"),
						ownerName: escapeHtml(d.ownerName + '').replace(new RegExp(q, "g"), "<b>$&</b>"),
						supervisorName: escapeHtml(d.supervisorName + '').replace(new RegExp(q, "g"), "<b>$&</b>"),
						marketerName: escapeHtml(d.marketerName + '').replace(new RegExp(q, "g"), "<b>$&</b>"),
						licenceCode: escapeHtml(d.licenceCode + '').replace(new RegExp(q, "g"), "<b>$&</b>"),
						customerCode: escapeHtml(d.customerCode + '').replace(new RegExp(q, "g"), "<b>$&</b>")
					}),
					value: d.groupId
				};
			} else {
				ret[i] = {
					content: Util.render(tpl, d),
					value: d.groupId
				};
			}
		}
		return ret;
	}
});
