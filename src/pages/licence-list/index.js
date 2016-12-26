var $ = require('browserify-zepto');
var Loading = require('../../widgets/loading');
var config = require('../../common/js/config');
var util = require('../../common/js/util');
var errorMsg = require('../../widgets/error-msg');
var Toast = require('../../widgets/toast');

var Page = {
	init: function() {
		this.warningType = util.getQueryString('warningType');
		this.renderUI();		
	},

	renderUI: function() {
		var that = this;

		Loading.show();
		$.ajax({
			url: config.api.GET_LICENCE_WARNING_LIST,
			dataType: 'jsonp',
			jsonpCallback: 'cb',
			data: {
				warningType: this.warningType
			},
			success: function(data) {
				if (data.code != 0) {
					errorMsg.show(data.msg, config.debug);
				} else {
					that._renderLicenceList(data.data);
					that.bindUI();
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
		$('#container').on('touchend', '.btn-warn', function() {
			var storeId = $(this).attr('data-storeid');
			var date = $(this).attr('data-date');
			that._sendWarningMessage(storeId, that.warningType, date);
		});
	},

	_sendWarningMessage: function(storeId, warningType, date) {
		Loading.show('提醒消息发送中');
		$.ajax({
			url: config.api.SEND_LICENCE_WARNING_MESSAGE,
			dataType: 'jsonp',
			data: {
				storeId: storeId,
				warningType: warningType,
				date: date
			},
			success: function(data) {
				Loading.hide();
				if (data.code != 0) {
					console.log('$.ajax response error: ' + ( data.msg || 'unknown error' ));
					alert('系统错误，请稍后重试！');
				} else {
					Toast.show('提醒消息发送成功');	
				}
			},
			error: function(xhr, type) {
				Loading.hide();
				console.log('$.ajax error: ' + type);
				alert('网络错误，请稍后重试！');
			}
		});
	},

	_renderLicenceList: function(data) {
		var tpl = $('#licence-list-tpl').html(),
				tips = '',
				dateDesc = '',
				title = '',
				that = this;

		if (this.warningType == 1) {
			tips = '以下为许可证有效期不足60日的零售户信息。';
			dateDesc = '许可证到期时间';
			title = '许可证有效期预警';
		} else if (this.warningType == 2) {
			tips = '以下为所有新办证超过3个月未购进卷烟的零售户信息。';
			dateDesc = '办证日期';
			title = '新办证未经营预警';
		} else if (this.warningType == 3) {
			tips = '以下为所有停业到期的零售户信息。';
			dateDesc = '停业到期时间';
			title = '停业到期预警';
		} else if (this.warningType == 4) {
			tips = '以下为所有擅自停业超过3个月的零售户信息。';
			dateDesc = '最近购进日期';
			title= '擅自停业预警';
		}
		document.title = title;
		data.tips = tips;
		$.each(data.storeList, function(i, k) {
			k.dateDesc = dateDesc;
			k.isContact = that.warningType == 1 || that.warningType == 3 ? false : true;
		});
		$('.container').html($(util.render(tpl, data)));
	},
};

Page.init();

