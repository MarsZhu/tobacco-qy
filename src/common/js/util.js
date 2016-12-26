var Handlebars = require('handlebars');

module.exports = {
	substitute: function(str, data) {
		var keys = Object.keys(data);
		for (var i = 0; i < keys.length; i++) {
			var k = keys[i];
    	str = str.replace(new RegExp("\\{" + k + "\\}", "g", 'g'), data[k]);
		}
		return str;
	},

	/**
	 * handlebars compile
	 */
	render: function(str, data) {
		var tpl = Handlebars.compile(str);
		return tpl(data);
	},

	getQueryString: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
		var r = window.location.search.substr(1).match(reg);

		if (r!=null) return unescape(r[2]); return null;
	}
}
