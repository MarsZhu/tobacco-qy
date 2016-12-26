var Chart = require('chart.js');
var $ = require('browserify-zepto');
var config = require('../../common/js/config');
var Loading = require('../../widgets/loading');
var util = require('../../common/js/util');

var Page = {
	init: function() {
		this.con = '#container';
		this.renderUI();
		this.bindUI();
	},

	renderUI: function() {
		this._renderPurchasesAndSalesCharts();
	},

	bindUI: function() {
		var that = this,
				isRenderTab2 = false;

		$(this.con).on('touchend', '.weui_navbar_item', function () {
			var index = $(this).attr('data-nav-index'); 
			$(this).addClass('weui_bar_item_on').siblings('.weui_bar_item_on').removeClass('weui_bar_item_on');
			$('.tab-body-' + index).addClass('tab-body-on').siblings('.tab-body-on').removeClass('tab-body-on');
			if (index == 2 && !isRenderTab2) {
				isRenderTab2 = true;
				that._renderPurchasesDetailCharts();
			} 
		});

		$('#psYear').on('change', function() {
			that._renderPurchasesAndSalesCharts();	
		});
		$('.selector-main-ps-year .selector-btn-left').on('touchend', function() {
			var v = +$('#psYear').val();
			v--;
			if ($('#psYear option[value="' + v + '"]').length) {
				$('#psYear').val(v + '').change();
			}
		});
		$('.selector-main-ps-year .selector-btn-right').on('touchend', function() {
			var v = +$('#psYear').val();
			v++;
			if ($('#psYear option[value="' + v + '"]').length) {
				$('#psYear').val(v + '').change();
			}
		});

		$('#pdYear').on('change', function() {
			that._renderPurchasesDetailCharts();	
		});
		$('.selector-main-pd-year .selector-btn-left').on('touchend', function() {
			var v = +$('#pdYear').val();
			v--;
			if ($('#pdYear option[value="' + v + '"]').length) {
				$('#pdYear').val(v + '').change();
			}
		});
		$('.selector-main-pd-year .selector-btn-right').on('touchend', function() {
			var v = +$('#pdYear').val();
			v++;
			if ($('#pdYear option[value="' + v + '"]').length) {
				$('#pdYear').val(v + '').change();
			}
		});

		$('#pdMonth').on('change', function() {
			that._renderPurchasesDetailCharts();	
		});
		$('.selector-main-pd-month .selector-btn-left').on('touchend', function() {
			var v = +$('#pdMonth').val();
			v--;
			if ($('#pdMonth option[value="' + v + '"]').length) {
				$('#pdMonth').val(v + '').change();
			}
		});
		$('.selector-main-pd-month .selector-btn-right').on('touchend', function() {
			var v = +$('#pdMonth').val();
			v++;
			if ($('#pdMonth option[value="' + v + '"]').length) {
				$('#pdMonth').val(v + '').change();
			}
		});
	},

	_renderPurchasesAndSalesCharts: function() {
		var that = this,
				year = $('#psYear').val();

		Loading.show();
		$.ajax({
			url: config.api.GET_MY_STORE_PURCHASES_AND_SALES,
			dataType: 'jsonp',
			data: {
				year: year
			},
			success: function(data) {
				if (data.code != 0) {
					console.log('$.ajax response error: ' + ( data.msg || 'unknown error' ));
				} else {
					if (data.data && data.data.purchases) {
						that._drawLineChart($('#dataPurchases'), [
							"1月", "2月", "3月", "4月", "5月", "6月",
							"7月", "8月", "9月", "10月", "11月", "12月"
						], [{
							label: '卷烟购进量（条）',
							data: data.data.purchases,
							borderColor: 'rgba(255,96,0,0.5)',
							backgroundColor: 'rgba(255,96,0,0.1)'
						}]);
					}

					if (data.data && data.data.sales) {
						that._drawLineChart($('#dataSales'), [
							"1月", "2月", "3月", "4月", "5月", "6月",
							"7月", "8月", "9月", "10月", "11月", "12月"
						], [{
							label: '卷烟销售毛利（元）',
							data: data.data.sales,
							borderColor: 'rgba(51,199,0,0.5)',
							backgroundColor: 'rgba(51,199,0,0.1)'
						}]);
					}
				}
				Loading.hide();
			},
			error: function(xhr, type) {
				console.log('$.ajax error: ' + type);
				Loading.hide();
			}
		});
	},

	_drawLineChart: function(con, labels, datasets) {
		var chart = new Chart(con, {
			type: 'line',
			data: {
				labels: labels,
				datasets: datasets
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				}
			}
		});

		return chart;
	},
	
	_drawBarChart: function(con, labels, datasets) {
		var chart = new Chart(con, {
			type: 'bar',
			data: {
				labels: labels,
				datasets: datasets
			},
			options: {
				scales: {
					xAxes: [{
						barPercentage: 0.5
					}],
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				}
			}
		});

		return chart;
	},

	_renderPurchasesDetailCharts: function() {
		var that = this,
				year = $('#pdYear').val(),
				month = $('#pdMonth').val();

		Loading.show();
		$.ajax({
			url: config.api.GET_MY_STORE_PURCHASES_DETAIL,
			dataType: 'jsonp',
			data: {
				year: year,
				month: month
			},
			success: function(data) {
				if (data.code != 0) {
					console.log('$.ajax response error: ' + ( data.msg || 'unknown error' ));
				} else {
					
					if (data.data && data.data.brands) {
						var formatedData = that._formatBrandsData(data.data.brands);
						that._renderBrandsChart(formatedData);
					}

					if (data.data && data.data.totalQuantity) {
						that._drawBarChart($('#dataTotalQuantity'), [
							'当期', '同比', '环比'
						], [{
							label: '当月购进卷烟总量（条）',
							data: data.data.totalQuantity,
							borderColor: 'rgba(255,96,0,0.5)',
							backgroundColor: 'rgba(255,96,0,0.5)'
						}]);
					}
					
					if (data.data && data.data.totalAmount) {
						that._drawBarChart($('#dataTotalAmount'), [
							'当期', '同比', '环比'
						], [{
							label: '当月购进总金额（元）',
							data: data.data.totalAmount,
							borderColor: 'rgba(51,199,0,0.5)',
							backgroundColor: 'rgba(51,199,0,0.5)'
						}]);
					}
					
					if (data.data && data.data.grossProfit) {
						that._drawBarChart($('#dataGrossProfit'), [
							'当期', '同比', '环比'
						], [{
							label: '当月实现毛利（元）',
							data: data.data.grossProfit,
							borderColor: 'rgba(18,149,251,0.5)',
							backgroundColor: 'rgba(18,149,251,0.5)'
						}]);
					}
				}
				
				Loading.hide();
			},
			error: function(xhr, type) {
				console.log('$.ajax error: ' + type);
				Loading.hide();
			}
		});

	},

	_formatBrandsData: function(data) {
		var brandsName = [],
				currentData = [],
				lastYearData = [],
				lastMonthData = [];

		$.each(data, function(i, d) {
			brandsName.push(d.name);
			currentData.push(d.quantity[0]);
			lastYearData.push(d.quantity[1]);
			lastMonthData.push(d.quantity[2]);
		});

		return [brandsName, currentData, lastYearData, lastMonthData];
	},
	
	_renderBrandsChart: function(data) {
		var tb = $('#dataBrand table'),
				t1 = 0,
				t2 = 0,
				t3 = 0;
		tb.html('');
		tb.append('<tr><th>品牌</th><th>当期（条）</th><th>同比（条）</th><th>环比（条）</th></tr>');
		for (var i = 0, j = data[0].length; i < j; i++) {
			t1 += data[1][i];
			t2 += data[2][i];
			t3 += data[3][i];
			tb.append('<tr><td>' + data[0][i] +'</td><td>' 
								+ data[1][i] + '</td><td>' 
								+ data[2][i] + '</td><td>' 
								+ data[3][i] + '</td></tr>');
		}	
		tb.append('<tr><td>合计</td><td>' + t1 + '</td><td>' + t2 + '</td><td>' + t3 + '</td></tr>');
	},
	
	/*
	_renderBrandsChart: function(data) {
		var chart = new Chart($('#dataBrand'), {
			type: 'horizontalBar',
			data: {
				labels: data[0],
				datasets: [{
					label: '当期（条）',
					data: data[1],
					borderColor: 'rgba(255,96,0,0.5)',
					backgroundColor: 'rgba(255,96,0,0.5)'
				}, {
					label: '同比（条）',
					data: data[2],
					borderColor: 'rgba(51,199,0,0.5)',
					backgroundColor: 'rgba(51,199,0,0.5)'
				}, {
					label: '环比（条）',
					data: data[3],
					borderColor: 'rgba(18,149,251,0.5)',
					backgroundColor: 'rgba(18,149,251,0.5)'
				
				}],
				options: {
					responsive: true,
					legend: {
						position: 'top'
					},
					title: {
						display: true,
						text: '重点规格购进情况'
					}
				}
			}
		});	
	
		return chart;
	}
	*/
};

Page.init();
