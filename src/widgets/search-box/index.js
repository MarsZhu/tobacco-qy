/**
 * 搜索框控件，可以配置数据源
 * @author 梁冬<aloysiousliang@gmail.com>
 * @date 2016-05-12
 */
var $ = require('browserify-zepto');
var Base = require('../../common/js/base');

var SearchBox = Base.extend({
	/**
	 * cfg.container
	 * cfg.placeHolder
	 * cfg.defaultTips
	 * cfg.dataSource
	 * cfg.format
	 */
	init: function(cfg) {
		this.con = cfg.container;
		this.placeHolder = cfg.placeHolder; 
		this.defaultTips = cfg.defaultTips;
		this.dataSource = cfg.dataSource;
		this.format = cfg.format;
		this.val = '';
		this.searchBarNode = $(this.con + ' .weui_search_bar');
		this.searchTextNode = $(this.con + ' .weui_search_text');
		this.searchListNode = $(this.con + ' .search-show');
		this.renderUI();
		this.bindUI();
	},

	renderUI: function() {
		this.inputNode = $(this.con + ' .weui_search_input');
		this.inputNode.attr('placeholder', this.placeHolder);

		this.tipsNode = $(this.con + ' .search-tips');
		//this._showTips(this.defaultTips);
		this._hideTips();
		this.sendRequest('');
	},

	bindUI: function() {
		var that = this;
		
		this.inputNode.on('focus', function(e) {
			that.searchBarNode.addClass('weui_search_focusing');
			// ugly
			$(document).trigger('searchBox:focus');
		});
		this.inputNode.on('blur', function(e) {
			that.searchBarNode.removeClass('weui_search_focusing');
			if ($(this).val()) {
				that.searchTextNode.hide();
			} else {
				that.searchTextNode.show();
				$(document).trigger('searchBox:reset');
			}
		});

		// TODO 搜索
		this.inputNode.on('input', function(e) {
			/*
			if (that.val = $(this).val()) {
				that._hideTips();
			} else {
				that._showTips(that.defaultTips);
			}
			*/
		 	that.val = $(this).val();
			if (that.timer) clearTimeout(that.timer);
			that.timer = setTimeout(function() {
				that.sendRequest(that.val);
			}, 300);
		});

		$(this.con + ' .weui_icon_clear').on('touchend', function(e) {
			that._onReset();
		});		
		$(this.con + ' .weui_search_cancel').on('touchend', function(e) {
			that._onReset();
		});		
	},

	_showTips: function(text) {
		this.tipsNode.html(text);
		this.tipsNode.show();
	},

	_hideTips: function() {
		this.tipsNode.hide();
	},

	// 重置搜索框和搜索列表
	// TODO
	_onReset: function() {
		this.inputNode.val('');
		this.val = '';
		//this._showTips(this.defaultTips);
		this._hideTips();
		this.sendRequest('');
		$(document).trigger('searchBox:reset');
	},

	sendRequest: function(value) {
		this.dataSource.fetchData(value, this._renderData, this);
	},

	_renderData: function(data) {
		var that = this;

		data = this._normalizeData(data);
		this.searchListNode.empty();
		$.each(data, function(i, d) {
			that.searchListNode.append(d.content);
		});
		if (data.length === 0) {
			that.searchListNode.append('<div class="search-list-empty">没有查询到结果！</div>')
		}
	},

	_normalizeData: function(data) {
		var contents = [],
				v, i, c;

		if (data && data.length) {
			if (this.format) {
				contents = this.format.call(this, this.val, data);
			} else {
				contents = [];
			}
			for (i = 0; i < data.length; i++) {
				v = data[i];
				c = contents[i] = $.extend({
					content: v,
					textContent: v,
					value: v
				}, contents[i]);
			}
			return contents;
		}
		return contents;
	}
});

module.exports = SearchBox;
