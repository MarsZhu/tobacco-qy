var $ = require('browserify-zepto');
var config = require('../../common/js/config');
var SearchBox = require('../../widgets/search-box');
var DataSource = require('../../widgets/search-box/data-source');
var Util = require('../../common/js/util');
var escapeHtml = require('escape-html');
var Loading = require('../../widgets/loading');
var Toast = require('../../widgets/toast');

var Page = {
	init: function() {
		this.pannelNode = $('.pannel-container');
		this.caches = {};
		this.renderUI();
		this.bindUI();
	},

	renderUI: function() {
		this._renderSearchBox();
		this._renderContactCount();
	},

	bindUI: function() {
		var that = this;

		$('.get-contactbook').on('touchend', function() {
			that._showContactBook();	
		});

		$('#container').on('change', '.weui_check', function(e) {
			if ($(this).prop('checked')) {
				that._addSelectedContact($(this).parents('.contact-item'));
			} else {
				that._removeSelectedContact($(this).parents('.contact-item'));
			}
		});

		$('#container').on('touchend', '.selected-item-delete', function() {
			var id = $(this).attr('data-user-id'),
					role = $(this).attr('data-role');
			that._handleRemoveSelectedContact(id, role);
		});

		$('.btn-confirm').on('touchend', function() {
			that._hideContactBook();
			var hasContact = that._renderGetContactBook();
			if (hasContact) {
				that._hideSendMsgError();
			}
		});

		$('.contactbook-main').on('touchend', '.weui_cell_ft', function(e) {
			var p = $(this).parents('.contact-item'),
					role = p.attr('data-role');

			e.stopPropagation();

			p = p.parents('.weui_cells');
			if (p.hasClass('list-on')) {
				that._hideContactList(p);
			} else {
				that._showContactList(p, role);
			}
		});

		$(document).on('searchBox:focus', function() {
			$('.contact-list-wrap').empty();
			$('.contact-collection-wrap').hide();
		});
		
		$(document).on('searchBox:reset', function() {
			$('.contact-collection-wrap').show();
		});

		$('.weui_textarea').on('input', function() {
			if ($(this).val()) {
				that._hideSendMsgError();
			}
		});

		$('.btn-send').on('touchend', function() {
			that._sendMessage();
		});
		
		$('.contactbook-main-wrap').on('touchmove', function(e) {
			if ($('.weui_actionsheet_toggle').length > 0) {
				e.stopPropagation();
			}
		});
	},

	_sendMessage: function() {
		var supervisorIds = $('#supervisorIds').val().substring(1),
				marketerIds = $('#marketerIds').val().substring(1),
				retailGroupIds = $('#retailGroupIds').val().substring(1),
				storeIds = $('#storeIds').val().substring(1),
				catchpolerIds = $('#catchpolerIds').val().substring(1),
				content = $('.weui_textarea').val(),
				that = this;

		if (supervisorIds === '' && marketerIds === '' &&
			 	retailGroupIds === '' && storeIds === '' && catchpolerIds === '') {
			this._showSendMsgError('发送对象不能为空！');
			return;
		}

		if (content === '') {
			this._showSendMsgError('发送消息内容不能为空！');
			return;
		}

		Loading.show('消息发送中');
		$.ajax({
			url: config.api.SEND_MESSAGE,
			dataType: 'jsonp',
			data: {
				supervisorIds: supervisorIds,
				marketerIds: marketerIds,
				retailGroupIds: retailGroupIds,
				storeIds: storeIds,
				catchpolerIds: catchpolerIds,
				content: content
			},
			//type: 'POST',
			success: function(data) {
				Loading.hide();
				if (data.code != 0) {
					console.log('$.ajax response error: ' + ( data.msg || 'unknown error' ));
					that._showSendMsgError('系统错误，请稍后重试！')
				} else {
					Toast.show('消息发送成功');	
				}
			},
			error: function(xhr, type) {
				Loading.hide();
				console.log('$.ajax error: ' + type);
				that._showSendMsgError('网络错误，请稍后重试！')
			}
		});

	},

	_showSendMsgError: function(text) {
		$('.error-text').html(text).show();	
	},

	_hideSendMsgError: function() {
		$('.error-text').hide();
	},

	_renderGetContactBook: function() {
		var node = $('.get-contactbook'),
				str = '';
		$.each($('.pannel-container .selected-item'), function(i ,n) {
			str += $(n).find('.selected-item-name').html() + ' ';
		});
		node.find('p').html(str);

		if (str) return true;
		return false;
	},

	_hideContactList: function(node) {
		node.find('.contact-list-wrap').empty();
		node.removeClass('list-on');
	},

	_showContactList: function(node, role) {
		node.addClass('list-on');
		
		var listWrapNode = node.find('.contact-list-wrap'),
				url = '',
				that = this;

		switch(role) {
			case '0':
				url = config.api.GET_STORE_LIST;
				break;
			case '1':
				url = config.api.GET_SUPERVISOR_LIST;
				break;
			case '2':
				url = config.api.GET_MARKETER_LIST;
				break;
			case '3':
				url = config.api.GET_RETAIL_GROUP_LIST;
				break;
			case '4':
				url = config.api.GET_CATCHPOLER_LIST;
				break;
		}

		if (this.caches[role]) {
			this._renderContactList(listWrapNode, this.caches[role], role);
		} else {
			Loading.show();
			$.ajax({
				url: url,
				dataType: 'jsonp',
				success: function(data) {
					if (data.code != 0) {
						console.log('$.ajax response error: ' + ( data.msg || 'unknown error' ));
					} else {
						var list = (data.data && data.data.list) ? data.data.list : [];
						that._renderContactList(listWrapNode, list, role);
						that.caches[role] = list;
					}
					Loading.hide();
				},
				error: function(xhr, type) {
					console.log('$.ajax error: ' + type);
					Loading.hide();
				}
			});
		}
	},

	_renderContactList: function(wrapNode, list, role) {
		var tpl = $('#message-record-tpl').html(),
				that = this;

		$.each(list, function(i, d) {
			var userId = d.userId || d.groupId || d.storeId;
			wrapNode.append(Util.render(tpl, {
					userId: userId,
					avatar: d.avatar || '../../common/img/pic_txl_drx.png',
					rawName: d.name || d.ownerName,
					name: d.name || d.ownerName,
					role: role,
					description: d.storeName || '',
					checked: that._isItemSelected(userId, role + ''),
					disabled: that._isItemDisabled(userId, role + '')
			}));
		});
	},

	_renderContactCount: function() {
		$.ajax({
			url: config.api.GET_MY_CONTACT_COUNT,
			dataType: 'jsonp',
			success: function(data) {
				if (data.code != 0) {
					console.log('$.ajax response error: ' + ( data.msg || 'unknown error' ));
				} else {
					data = data.data || {};
					if (data.catchpolerCount && data.catchpolerCount != 0) {
						$('.contact-item-catchpoler .weui_cell_ft').html(data.catchpolerCount + '人');
					} else {
						$('.contact-item-catchpoler').parent('.weui_cells').empty();
					}
					if (data.supervisorCount && data.supervisorCount != 0) {
						$('.contact-item-supervisor .weui_cell_ft').html(data.supervisorCount + '人');
					} else {
						$('.contact-item-supervisor').parent('.weui_cells').empty();
					}
					if (data.marketerCount && data.marketerCount != 0) {
						$('.contact-item-marketer .weui_cell_ft').html(data.marketerCount + '人');
					} else {
						$('.contact-item-marketer').parent('.weui_cells').empty();
					}
					if (data.retailGroupCount && data.retailGroupCount != 0) {
						$('.contact-item-group .weui_cell_ft').html(data.retailGroupCount + '组');
					} else {
						$('.contact-item-group').parent('.weui_cells').empty();
					}
					if (data.storeCount && data.storeCount != 0) {
						$('.contact-item-store .weui_cell_ft').html(data.storeCount + '人');
					} else {
						$('.contact-item-store').parent('.weui_cells').empty();
					}
				}
			},
			error: function(xhr, type) {
				console.log('$.ajax error: ' + type);
			}
		});	
	},

	_addSelectedContact: function(itemNode) {
		var tpl = $('#message-selected-item-tpl').html(),
				userId = itemNode.attr('data-user-id'),
				role = itemNode.attr('data-role'),
				html = Util.render(tpl, {
					userId: userId,
					avatar: itemNode.attr('data-avatar'),
					name: itemNode.attr('data-name'),
					role: role
				}),
				that = this;

				this.pannelNode.append($(html));

				if (userId === 'all') {
					// 删除pannel的子记录
					var nodeId = this._getRoleNodeId(role),
							idList = $('#' + nodeId).val().split('|');
					$.each(idList, function(i, id) {
						that._handleRemoveSelectedContact(id, role);
					});
					
					this._checkAndDisableSubItem(role);
				}
				
				this._addUserData(userId, role);
				this._checkPannelHeight();
	},

	_addUserData: function(id, role) {
		var nodeId = this._getRoleNodeId(role);
		var newVal = $('#' + nodeId).val() + '|' + id;
		$('#' + nodeId).val(newVal);
	},

	_removeUserData: function(id, role) {
		var nodeId = this._getRoleNodeId(role);
		var val = $('#' + nodeId).val();
		val = val.replace(new RegExp('\\|' + id + '(?=\\|)|\\|' + id + '$', 'g'), '');
		$('#' + nodeId).val(val);
	},

	_getRoleNodeId: function(role) {
		var nodeId = '';
		switch(role) {
			// 零售户
			case '0':
				nodeId = 'storeIds';
				break;
			// 专卖
			case '1':
				nodeId = 'supervisorIds';
				break;
			// 客户经理
			case '2':
				nodeId = 'marketerIds';
				break;
			case '3':
				nodeId = 'retailGroupIds';
				break;
			case '4':
				nodeId = 'catchpolerIds';
				break;
		}

		return nodeId;
	},

	_isItemSelected: function(id, role) {
		var nodeId = this._getRoleNodeId(role),
				val = $('#' + nodeId).val(),
				reg = new RegExp('\\|' + id + '(?=\\|)|\\|' + id + '$', 'g');

		if (val.indexOf('all') !== -1) return true;

		return reg.test(val);
	},

	_isItemDisabled: function(id, role) {
		var nodeId = this._getRoleNodeId(role),
				val = $('#' + nodeId).val();

		if (val.indexOf('all') !== -1) return true;
		
		return false;
	},

	_removeSelectedContact: function(itemNode) {
		var userId = itemNode.attr('data-user-id'),
				role = itemNode.attr('data-role');
		this._handleRemoveSelectedContact(userId, role);
	},

	_handleRemoveSelectedContact: function(userId, role) {
		var n = $('.selected-item[data-user-id="' + userId + '"]')
			.filter('[data-role="' + role + '"]');
		n.remove();	
		$('.contact-item[data-user-id="' + userId + '"]')
			.filter('[data-role="' + role + '"]')
			.find('.weui_check').prop('checked', false);

		if (userId === 'all') {
			this._uncheckAndEnableSubItem(role);
		}
		
		this._removeUserData(userId, role);
		this._checkPannelHeight();
	},

	_checkAndDisableSubItem: function(role) {
		var nodeList = $('.contact-item-sub[data-role="' + role + '"]');
		$.each(nodeList, function(i, n) {
			n = $(n).find('.weui_check');
			n.prop('checked', true);
			n.prop('disabled', true);
		});
	},

	_uncheckAndEnableSubItem: function(role) {
		var nodeList = $('.contact-item-sub[data-role="' + role + '"]');
		$.each(nodeList, function(i, n) {
			n = $(n).find('.weui_check');
			n.prop('checked', false);
			n.prop('disabled', false);
		});
	},

	_checkPannelHeight: function() {
		var h = this.pannelNode.height();
		$('.search-show').css({
			'margin-top': h + 'px'
		});
	},

	_renderSearchBox: function() {
		var remoteDataSource = new DataSource({
			paramName: 'key',
			allowEmpty: false,
			isCached: true,
			parse: function(q, data) {
				var resList = data.data && data.data.contactList;
				if (!resList) return [];
				return resList;
			},
			ajaxCfg: {
				dataType: 'jsonp',
				url: config.api.SEARCH_CONTACT
			}
		});

		var tpl = $('#message-record-tpl').html();

		var that = this;

		var searchBox = new SearchBox({
			container: '.search-box-container',
			placeHolder: '搜索',
			//defaultTips: '可输入小组名称、组长名字、市管员名字进行搜索。',
			dataSource: remoteDataSource,
			format: function(q, data) {
				var ret = [];
				for (var i = 0; i < data.length; i++) {
					var d = data[i];
					if (q) {
						q = q.replace(/[\-#$\^*()+\[\]{}|\\,.?\s]/g, '\\$&');
						ret[i] = {
							content: Util.render(tpl, {
								userId: d.userId,
								avatar: d.avatar || '../../common/img/pic_txl_drx.png',
								rawName: d.name,
								name: escapeHtml(d.name + '').replace(new RegExp(q, "g"), "<b>$&</b>"),
								role: d.role,
								description: d.role == 0 ? ('零售户 ' + d.storeName) : (d.role == 1 ? '专卖员' : '客户经理'),
								checked: that._isItemSelected(d.userId, d.role + ''),
								disabled: that._isItemDisabled(d.userId, d.role + '')
							}),
							value: d.userId
						};
					} else {
						ret[i] = {
							content: Util.render(tpl, {
								userId: d.userId,
								avatar: d.avatar || '../../common/img/pic_txl_drx.png',
								rawName: d.name,
								name: d.name,
								role: d.role,
								description: d.role == 0 ? ('零售户 ' + d.storeName) : (d.role == 1 ? '专卖员' : '客户经理'),
								checked: that._isItemSelected(d.userId, d.role + ''),
								disabled: that._isItemDisabled(d.userId, d.role + '')
							}),
							value: d.userId
						};
					}
				}
				return ret;
			}
		});
	
	},

	_showContactBook: function() {
		var maskNode = $('.weui_mask_transition');	
		var filterSelectorNode = $('.weui_actionsheet');
		filterSelectorNode.addClass('weui_actionsheet_toggle');
		
		maskNode.show()
		.focus()//加focus是为了触发一次页面的重排(reflow or layout thrashing),使mask的transition动画得以正常触发
		.addClass('weui_fade_toggle').one('touchend', function () {
			_hideContactBook();
		});

		maskNode.unbind('transitionend').unbind('webkitTransitionEnd');
	},

	_hideContactBook: function() {
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
