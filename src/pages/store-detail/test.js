var $ = require('browserify-zepto');

$('.btn').on('click', function(e) {
	$.ajax({
		//url: 'http://qy.iyiplus.com/phone/shopkeeper/searchStore.action',
		url: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6f600b9ac74ca162&redirect_uri=http://qy.iyiplus.com/phone/shopkeeper/searchStore.action?_=1464830566977&callback=jsonp1&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1',
		type: 'get',
		dataType: 'jsonp',
		success: function(data) {
			alert('success');
		},
		error: function(xhr, type, error) {
			console.log(error);
			alert(JSON.stringify(error));
		},
		complete: function(xhr, status) {
			console.log(status);
			alert(status);
		},
		beforeSend: function(xhr) {
			console.log(xhr);
		}
	});
});
