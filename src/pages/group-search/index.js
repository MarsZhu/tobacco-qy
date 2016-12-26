var SearchBox = require('../../widgets/search-box');
var DataSource = require('../../widgets/search-box/data-source');
var Util = require('../../common/js/util');
var $ = require('browserify-zepto');
var escapeHtml = require('escape-html');
var config = require('../../common/js/config');

var remoteDataSource = new DataSource({
	paramName: 'key',
	allowEmpty: true,
	isCached: true,
	parse: function(q, data) {
		var resList = data.data && data.data.retailGroupList;
		if (!resList) return [];
		return resList;
	},
	ajaxCfg: {
		dataType: 'jsonp',
		url: config.api.SEARCH_RETAIL_GROUP,
		data: {
			size: 100,
			isRecommend: Util.getQueryString('isRecommend') || 0
		}
	}
});

var tpl = $('#group-record-tpl').html();

var searchBox = new SearchBox({
	container: '.search-box-container',
	placeHolder: '搜索',
	defaultTips: '可输入小组名称、组长名字、市管员名字进行搜索。',
	dataSource: remoteDataSource,
	format: function(q, data) {
		var ret = [];
		for (var i = 0; i < data.length; i++) {
			var d = data[i];
			if (q) {
				q = q.replace(/[\-#$\^*()+\[\]{}|\\,.?\s]/g, '\\$&');
				ret[i] = {
					content: Util.render(tpl, {
						groupId: d.groupId,
						groupName: escapeHtml(d.groupName + '').replace(new RegExp(q, "g"), "<b>$&</b>"),
						supervisorName: escapeHtml(d.supervisorName + '').replace(new RegExp(q, "g"), "<b>$&</b>"),
						leaderName: escapeHtml(d.leaderName + '').replace(new RegExp(q, "g"), "<b>$&</b>")
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
