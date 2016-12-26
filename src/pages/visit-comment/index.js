var $ = require('browserify-zepto');
var Loading = require('../../widgets/loading');
var config = require('../../common/js/config');
var util = require('../../common/js/util');
var errorMsg = require('../../widgets/error-msg');
var Toast = require('../../widgets/toast');

var Page = {
	init: function() {
		this.planId = util.getQueryString('planId');
		this.renderUI();		
	},

	renderUI: function() {
		var that = this;

		Loading.show();
		$.ajax({
			url: config.api.GET_VISITING_PLAN_DETAIL,
			dataType: 'jsonp',
			data: {
				planId: this.planId
			},
			success: function(data) {
				if (data.code != 0) {
					errorMsg.show(data.msg, config.debug);
				} else {
					that._renderVisitComment(data.data);
					if (!data.data.isComment) {
						that.bindUI();
					}
				}
				Loading.hide();
			},
			error: function(xhr, type) {
				Loading.hide();
				errorMsg.show(type, config.debug);
			}
		});
	},

	bindUI: function() {
		var that = this;
		$('#container').on('touchend', '.star', function() {
			var index = +$(this).attr('data-index');
			that._selectStar(index);
		});

		$('.btn-submit').on('touchend', function() {
			if (!that.star) return;
			that._submitComment();
		});
	},

	_submitComment: function() {
		var content = $('.weui_textarea').val(),
				that = this;

		Loading.show('评价提交中');
		$.ajax({
			url: config.api.SUBMIT_VISITING_PLAN_COMMENT,
			dataType: 'jsonp',
			data: {
				planId: this.planId,
				star: this.star,
				comment: content
			},
			success: function(data) {
				Loading.hide();
				if (data.code != 0) {
					console.log('$.ajax response error: ' + ( data.msg || 'unknown error' ));
					alert('系统错误，请稍后重试！')
				} else {
					Toast.show('评价提交成功');
					setTimeout(function() {
						location.href = '../visit-comment/index.html?planId=' + that.planId;
					}, 1000);
				}
			},
			error: function(xhr, type) {
				Loading.hide();
				console.log('$.ajax error: ' + type);
				alert('网络错误，请稍后重试！')
			}
		});
	
	},

	_selectStar: function(index) {
		for (var i = 0; i < 5; i++) {
			if (i <= index) {
				$('.star[data-index="' + i + '"]').addClass('star-on');
			} else {
				$('.star[data-index="' + i + '"]').removeClass('star-on');
			}
		}

		var levelText = '';
		if (index == 0) {
			levelText = '不满意';
		} else if (index == 1) {
			levelText = '一般';
		} else if (index == 2) {
			levelText = '良好';
		} else if (index == 3) {
			levelText = '满意';
		} else if (index == 4) {
			levelText = '非常满意';
		}

		$('.star-level-text').html(levelText);
		$('.btn-submit').removeClass('weui_btn_disabled');

		this.star = index + 1;
	},

	_renderVisitComment: function(data) {
		// 如果巡访计划本身没有提交，是无法评价的
		if (!data.isSubmit) {
			errorMsg.show('巡访工作还没有被提交，无法评价', config.debug);
			return;
		}

		/*
		if (data.supervisorName) {
			data.staffName = data.supervisorName + '（市管员）';
		} else if (data.marketerName) {
			data.staffName = data.marketerName + '（客户经理）';
		}
		*/
		data.staffName = data.visitorName;

		if (!data.isComment) {
			data.starVal = [false, false, false, false, false];
			data.starLevelText = '';
		} else {
			if (data.commentStar == 1) {
				data.starVal = [true, false, false, false, false];
				data.starLevelText = '不满意';
			} else if (data.commentStar == 2) {
				data.starVal = [true, true, false, false, false];
				data.starLevelText = '一般';
			} else if (data.commentStar == 3) {
				data.starVal = [true, true, true, false, false];
				data.starLevelText = '良好';
			} else if (data.commentStar == 4) {
				data.starVal = [true, true, true, true, false];
				data.starLevelText = '满意';
			} else if (data.commentStar == 5) {
				data.starVal = [true, true, true, true, true];
				data.starLevelText = '非常满意';
			} else {
				data.starVal = [false, false, false, false, false];
				data.starLevelText = '';
			}
		}

		var tpl = $('#visit-comment-tpl').html();
		$('#container').html(util.render(tpl, data));
	}
};

Page.init();
