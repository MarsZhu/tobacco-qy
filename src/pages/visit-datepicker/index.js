var $ = require('browserify-zepto');
var config = require('../../common/js/config');
var Loading = require('../../widgets/loading');
var util = require('../../common/js/util');

var Page = {
	init: function() {
		this.renderUI();
		this.bindUI();
	},

	renderUI: function() {
		this._renderSelect();
		this._renderDatePicker();
	},

	bindUI: function() {
		var that = this;

		$('#year').on('change', function() {
			that._renderDatePicker();	
		});
		$('.selector-main-year .selector-btn-left').on('touchend', function() {
			var v = +$('#year').val();
			v--;
			if ($('#year option[value="' + v + '"]').length) {
				$('#year').val(v + '').change();
			}
		});
		$('.selector-main-year .selector-btn-right').on('touchend', function() {
			var v = +$('#year').val();
			v++;
			if ($('#year option[value="' + v + '"]').length) {
				$('#year').val(v + '').change();
			}
		});

		$('#month').on('change', function() {
			that._renderDatePicker();	
		});
		$('.selector-main-month .selector-btn-left').on('touchend', function() {
			var v = +$('#month').val();
			v--;
			if ($('#month option[value="' + v + '"]').length) {
				$('#month').val(v + '').change();
			}
		});
		$('.selector-main-month .selector-btn-right').on('touchend', function() {
			var v = +$('#month').val();
			v++;
			if ($('#month option[value="' + v + '"]').length) {
				$('#month').val(v + '').change();
			}
		});
	
	},

	_renderSelect: function() {
		var date = new Date(),
				currYear = date.getFullYear(),
				currMonth = date.getMonth() + 1,
				yearSelNode = $('#year'),
				monthSelNode = $('#month'),
				startYear = config.startYear;

		for (var i = currYear; i >= startYear; i--) {
			yearSelNode.append('<option value="' + i + '">' + i + '</option>');
		}
		monthSelNode.find('option[value="' + currMonth + '"]').prop('selected', true);
	},

	_renderDatePicker: function() {
		var that = this;
		Loading.show();
		$.ajax({
			url: config.api.GET_MY_VISITING_STATUS,
			dataType: 'jsonp',
			data: {
				year: $('#year').val(),
				month: $('#month').val()
			},
			success: function(data) {
				if (data.code != 0) {
				} else {
					if (data.data) {
						var wrapNode = $('.date-picker-wrap'),
								tpl = $('#datepicker-tpl').html(),
								formatedData = that._formatDatePicker(data.data);

						wrapNode.html(util.render(tpl, {
							weeks: formatedData
						}));
					}	
				}
				Loading.hide();
			},
			error: function(xhr, type) {
				Loading.hide();
			}
		});	
	},

	_formatDatePicker: function(data) {
		var year = +data.year,
				month = +data.month,
				status = data.status,
				firstDateWeek = new Date(+year, +(month-1), 1).getDay(),  // 当月首日是星期几，0为星期日
				prevMonthLastDate,    // 上月最后一天是几号
				lastDateWeek,         // 当月最后一日是星期几
				formatedArr = [],
				isMarketer = util.getQueryString('role') === 'marketer' ? true : false;

		switch(month) {
			case 1:
			case 2:
			case 4:
			case 6:
			case 8:
			case 9:
			case 11:
				prevMonthLastDate = 31;
				break;
			case 5:
			case 7:
			case 10:
			case 12:
				prevMonthLastDate = 30;
				break;
			case 3:
				if (year % 4 === 0) {
					prevMonthLastDate = 29;
				} else {
					prevMonthLastDate = 28;
				}
				break;
		}

		// 补全上月的几天
		for (var i = firstDateWeek - 1; i >= 0; i--) {
			var tmpDate = {
				disable: true,
				date: prevMonthLastDate
			};
			formatedArr.unshift(tmpDate);
			prevMonthLastDate--;
		}

		for (var j = 0, k = status.length; j < k; j++) {
			var date = j +1,
					tmpDate = {
						date: date
					},
					today = new Date();
			if (month < 10) {
				tmpDate.fullDate = year + '0' + month;
			} else {
				tmpDate.fullDate = year + '' + month;
			}
			if (date < 10) {
				tmpDate.fullDate += '0' + date;
			} else {
				tmpDate.fullDate += '' + date;
			}

			if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth() + 1) {
				tmpDate.current = true;
				this.currentDate = tmpDate.fullDate;
			}

			if (!this.currentDate || +tmpDate.fullDate < +this.currentDate) {
				tmpDate.isFuture = false;
			} else {
				tmpDate.isFuture = true;
			}

			if (status[j] == 1/* && !tmpDate.isFuture*/) {
				tmpDate.done = true;
			}
			if (status[j] == 2/* && !tmpDate.isFuture*/) {
				tmpDate.fail = true;
			}

			tmpDate.isMarketer = isMarketer;

			formatedArr.push(tmpDate);
		}

		// 补全下月的几天
		var lastDateWeek = new Date(+year, +(month-1), status.length).getDay(),
				nextMonthFirstDate = 1;
		for (var i = lastDateWeek + 1; i <= 6; i++) {
			var tmpDate = {
				disable: true,
				date: nextMonthFirstDate
			};
			formatedArr.push(tmpDate);
			nextMonthFirstDate++;
		}
		
		var returnArr = [];
		for (var x = 0, y = formatedArr.length; x < y; x++) {
			var rowNum = Math.floor(x / 7);
			returnArr[rowNum] = returnArr[rowNum] || [];
			returnArr[rowNum].push(formatedArr[x]);
		}

		return returnArr;
	}
};

Page.init();
