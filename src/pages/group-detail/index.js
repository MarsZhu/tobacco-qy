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
			url: config.api.GET_RETAIL_GROUP_DETAIL,
			dataType: 'jsonp',
			data: {
				groupId: util.getQueryString('groupId')
			},
			success: function(data) {
				if (data.code != 0) {
					errorMsg.show(data.msg, config.debug);
				} else {
					that._renderGroupDetail(data.data);
					that._renderGroupMember(data.data);
					that.bindUI();
				}
				Loading.hide();
			},
			error: function(chr, type) {
				Loading.hide();
				errorMsg.show(type, config.debug);
			}
		});
	},

	bindUI: function() {
		var that = this;
		$('.to-group-member').on('touchend', function() {
			that._showGroupMember();
		});
		$('.btn-return').on('touchend', function() {
			that._hideGroupMember();
		});

		$('.member-main-wrap').on('touchmove', function(e) {
			if ($('.weui_actionsheet_toggle').length > 0) {
				e.stopPropagation();
			}
		});
	},

	_renderGroupDetail: function(data) {
		var tpl = $('#group-detail-tpl').html();
		$('.container').prepend($(util.render(tpl, data)));
	},

	_renderGroupMember: function(data) {
		var tpl = $('#group-member-tpl').html();
		$('.member-main').html(util.render(tpl, data));
	},
	
	_showGroupMember: function() {
		var maskNode = $('.weui_mask_transition');	
		var filterSelectorNode = $('.weui_actionsheet');
		filterSelectorNode.addClass('weui_actionsheet_toggle');
		
		maskNode.show()
		.focus()//加focus是为了触发一次页面的重排(reflow or layout thrashing),使mask的transition动画得以正常触发
		.addClass('weui_fade_toggle').one('touchend', function () {
			that._hideGroupMember();
		});

		maskNode.unbind('transitionend').unbind('webkitTransitionEnd');
	},

	_hideGroupMember: function() {
		var maskNode = $('.weui_mask_transition');	
		var filterSelectorNode = $('.weui_actionsheet');
		
		filterSelectorNode.removeClass('weui_actionsheet_toggle');
		maskNode.removeClass('weui_fade_toggle');
		maskNode.on('transitionend', function () {
			maskNode.hide();
		}).on('webkitTransitionEnd', function () {
			maskNode.hide();
		})
	}
};

Page.init();
