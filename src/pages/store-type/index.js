var $ = require('browserify-zepto');
var config = require('../../common/js/config');
var util = require('../../common/js/util');
var Loading = require('../../widgets/loading');

var MONTH = [
	'一', '二', '三', '四', '五', '六',
	'七', '八', '九', '十', '十一', '十二'
];

var Page = {
	init: function() {
		this.con = '#container';
		this.renderUI();
		this.bindUI();
	},

	renderUI: function() {
		this._renderStoreTypeList();
	},

	bindUI: function() {
		var that = this;
		$('#year').on('change', function() {
			that._renderStoreTypeList();
		});
		$('.selector-main .selector-btn-left').on('touchend', function() {
			var v = +$('#year').val();
			v--;
			if ($('#year option[value="' + v + '"]').length) {
				$('#year').val(v + '').change();
			}
		});
		$('.selector-main .selector-btn-right').on('touchend', function() {
			var v = +$('#year').val();
			v++;
			if ($('#year option[value="' + v + '"]').length) {
				$('#year').val(v + '').change();
			}
		});
	},

	_renderStoreTypeList: function() {
		Loading.show();
		$.ajax({
			url: config.api.GET_STORE_TYPE,
			dataType: 'jsonp',
			data: {
				storeId: util.getQueryString('storeId'),   // TODO
				year: $('#year').val(),
				timestamp: new Date().getTime()
			},
			success: function(data) {
				if (data.code != 0) {
					console.log('$.ajax response error: ' + ( data.msg || 'unknown error' ));
				} else {
					if (data.data && data.data.typeList) {
						var searchResultNode = $('#searchResult'),
								tpl = $('#store-type-record-tpl').html();
						searchResultNode.empty();
						$.each(data.data.typeList, function(i, v) {
							searchResultNode.append(util.render(tpl, {
								month: MONTH[i] + '月份', 
								type: v ? (v + '类') : '-'
							}));
						});
					}	
				}
				Loading.hide();
			},
			error: function(xhr, type) {
				console.log('$.ajax error: ' + type);
				Loading.hide();
			}
		});	
	}
};

Page.init();
