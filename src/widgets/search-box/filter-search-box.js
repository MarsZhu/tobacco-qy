/**
 * 带条件筛选的搜索框控件，可以配置数据源
 * @author 梁冬<aloysiousliang@gmail.com>
 * @date 2016-05-15
 */
var $ = require('browserify-zepto');
var SearchBox = require('./index');

var FilterSearchBox = SearchBox.extend({
	/**
	 * cfg.container
	 * cfg.placeHolder
	 * cfg.defaultTips
	 * cfg.dataSource
	 * cfg.format
	 * cfg.filterName
	 * cfg.filters
	 *     - name
	 *     - value
	 */
	init: function(cfg) {
		this.filterName = cfg.filterName || 'field';
		this.filters = cfg.filters || [];
		this._super(cfg);

	},

	renderUI: function() {
		this._super();

		var that = this;

		this.filterNode = $(this.con + ' .search-filter');
		this.filterTextNode = $(this.con + ' .search-filter span');
		this.filterSelectorMenuNode = $(this.con + ' .weui_actionsheet_menu');

		if (this.filters.length > 0) {
			this._setFilterNode(this.filters[0]);
			this.filterNode.show();

			$.each(this.filters, function(i, f) {
				var n = $('<div class="weui_actionsheet_cell"></div>');
				n.attr('data-filter-type', f.value);
				n.html(f.name);
				that.filterSelectorMenuNode.append(n);
			});
		}
	},

	bindUI: function() {
		var that = this;

		this._super();

		this.filterNode.on('click', function(e) {
			that._showFilterSelector();
		});
		
		$(this.con + ' .search-filter-cancel').on('click', function() {
			that._hideFilterSelector();
		});

		this.filterSelectorMenuNode.on('click', '.weui_actionsheet_cell', function(e) {
			var n = $(this),
					f = {
						name: n.html(),
						value: n.attr('data-filter-type')
					};
			that._setFilterNode(f);
			that._hideFilterSelector();

			// 每次切换筛选条件，触发一次查询
			that.sendRequest(that.val);
		});

	},

	_showFilterSelector: function() {
		var that = this;

		this.maskNode = $(this.con + ' .weui_mask_transition');	
		this.filterSelectorNode = $(this.con + ' .weui_actionsheet');
		this.filterSelectorNode.addClass('weui_actionsheet_toggle');
		
		this.maskNode.show()
		.focus()//加focus是为了触发一次页面的重排(reflow or layout thrashing),使mask的transition动画得以正常触发
		.addClass('weui_fade_toggle').one('click', function () {
			that._hideFilterSelector();
		});
		

		this.maskNode.unbind('transitionend').unbind('webkitTransitionEnd');
	},

	_hideFilterSelector: function() {
		var that = this;

		this.filterSelectorNode.removeClass('weui_actionsheet_toggle');
		this.maskNode.removeClass('weui_fade_toggle');
		this.maskNode.on('transitionend', function () {
			that.maskNode.hide();
		}).on('webkitTransitionEnd', function () {
			that.maskNode.hide();
		})
	},

	_setFilterNode: function(f) {
		this.filterNode.attr('data-filter-type', f.value);
		this.filterTextNode.html(f.name);
		
		// 构建过滤条件参数
		var d = {};
		d[this.filterName] = f.value;
		this.dataSource.setAjaxCfg({
			data: d
		});
	}

});

module.exports = FilterSearchBox;
