var $ = require('browserify-zepto');
var config = require('../../common/js/config');
var Loading = require('../../widgets/loading');
var Toast = require('../../widgets/toast');
var util = require('../../common/js/util');
var SearchBox = require('../../widgets/search-box');
var DataSource = require('../../widgets/search-box/data-source');
var escapeHtml = require('escape-html');

var Page = {
	init: function() {
		this.con = '#container';
		this.date = util.getQueryString('date'); 
		this.renderUI();
		this.bindUI();
	},

	renderUI: function() {
		this._renderTitle();
		this._getVisitPlanList();
		if (location.href.indexOf('future-date') !== -1) {
			this._renderSearchBox();
		}
	},

	bindUI: function() {
		
		var that = this;

		$(this.con).on('touchend', '.weui_navbar_item', function () {
			var index = $(this).attr('data-nav-index'); 
			$(this).addClass('weui_bar_item_on').siblings('.weui_bar_item_on').removeClass('weui_bar_item_on');
			$('.tab-body-' + index).addClass('tab-body-on').siblings('.tab-body-on').removeClass('tab-body-on');
			if (index == 1) {
				that._resetSearch();
			} else {
				that._getVisitPlanList();
			}
		});

		$(this.con).on('touchend', '.btn-add', function(e) {
			var node = $(this);
			that._addVisitStore(node);
		});

		$(this.con).on('touchend', '.btn-remove', function(e) {
			var node = $(this);
			that._removeVisitStore(node);
		});
	},

	_renderTitle: function() {
		document.title = this.date + '巡访计划';
	},

	_addVisitStore: function(node) {
		var storeId = node.attr('data-storeid'),
				date = this.date,
				that = this;

		Loading.show('添加中，请稍候');
		$.ajax({
			url: config.api.ADD_VISITING_PLAN,
			dataType: 'jsonp',
			data: {
				storeId: storeId,
				date: date
			},
			success: function(data) {
				Loading.hide();
				if (data.code != 0) {
					console.log('$.ajax response error: ' + ( data.msg || 'unknown error' ));
					alert('系统错误，请稍后重试！');
				} else {
					Toast.show('添加计划成功');
					that._setRecordToAdded(node);
				}
			},
			error: function(xhr, type) {
				Loading.hide();
				console.log('$.ajax error: ' + type);
				alert('网络错误，请稍后重试！');
			}
		});
	},

	_removeVisitStore: function(node) {
		var planId = node.attr('data-planid'),
				that = this;

		Loading.show('删除中，请稍候');
		$.ajax({
			url: config.api.REMOVE_VISITING_PLAN,
			dataType: 'jsonp',
			jsonpCallback: 'cb',
			data: {
				planId: planId,
			},
			success: function(data) {
				Loading.hide();
				if (data.code != 0) {
					console.log('$.ajax response error: ' + ( data.msg || 'unknown error' ));
					alert('系统错误，请稍后重试！');
				} else {
					Toast.show('删除计划成功');
					node.parents('.weui_cell').remove();
				}
			},
			error: function(xhr, type) {
				Loading.hide();
				console.log('$.ajax error: ' + type);
				alert('网络错误，请稍后重试！');
			}
		});
	},

	_setRecordToAdded: function(node) {
		node.removeClass('weui_btn_primary');
		node.removeClass('btn-add');
		node.addClass('weui_btn_disabled');
		node.addClass('weui_btn_default');
		node.html('已添加');
	},

	_renderSearchBox: function() {
		var remoteDataSource = new DataSource({
			paramName: 'key',
			allowEmpty: true,
			isCached: false,
			parse: function(q, data) {
				var resList = data.data && data.data.storeList;
				if (!resList) return [];
				return resList;
			},
			ajaxCfg: {
				dataType: 'jsonp',
				url: config.api.SEARCH_MY_SUPERVISED_STORE,
				data: {
					date: this.date,
					size: 500
				}
			}
		});

		var tpl = $('#visit-record-tpl').html();

		this.searchBox = new SearchBox({
			container: '.search-box-container',
			placeHolder: '搜索',
			defaultTips: '可输入零售户店铺名称进行搜索。',
			dataSource: remoteDataSource,
			format: function(q, data) {
				var ret = [];
				for (var i = 0; i < data.length; i++) {
					var d = data[i];
					if (q) {
						q = q.replace(/[\-#$\^*()+\[\]{}|\\,.?\s]/g, '\\$&');
						ret[i] = {
							content: util.render(tpl, {
								storeId: d.storeId,
								storeName: escapeHtml(d.storeName + '').replace(new RegExp(q, "g"), "<b>$&</b>"),
								address: d.address,
								hasAdd: d.status == 1 ? true : false
							}),
							value: d.storeId
						};
					} else {
						ret[i] = {
							content: util.render(tpl, {
								storeId: d.storeId,
								storeName: d.storeName,
								address: d.address,
								hasAdd: d.status == 1 ? true : false
							}),
							value: d.storeId
						};
					}
				}
				return ret;
			}
		});
	
	},

	_getVisitPlanList: function() {
		var that = this;
		Loading.show();
		$.ajax({
			url: config.api.GET_VISITING_PLAN_LIST,
			dataType: 'jsonp',
			data: {
				date: this.date 
			},
			success: function(data) {
				if (data.code != 0) {
					alert('系统错误，请稍后重试！');
				} else {
					that._renderVisitPlanList(data.data);
				}
				Loading.hide();
			},
			error: function(xhr, type) {
				Loading.hide();
				alert('网络错误，请稍后重试！');
			}

		});	
	},

	_renderVisitPlanList: function(data) {
		var planList = data.planList || [];
		var tpl = $('#added-record-tpl').html();

		if (planList.length === 0) {
			$('.visit-plan-list-wrap').html('<div class="plan-empty">没有添加巡访计划！</div>');
			return;
		}

		$.each(planList, function(index, plan) {
			plan.isMarketer = util.getQueryString('role') === 'marketer' ? true : false;
			plan.hasVisited = plan.planStatus == 1 ? true : false;
			plan.date = data.date;
			plan.formatStoreName = escape(encodeURI(plan.storeName));
		});
		$('.visit-plan-list-wrap').html(util.render(tpl, {
			planList: planList
		}))
	},

	_resetSearch: function() {
		this.searchBox._onReset();
	}
}

Page.init();
