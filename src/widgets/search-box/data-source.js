/**
 * 数据源控件，可以设置缓存
 * @author 梁冬<aloysiousliang@gmail.com>
 * @date 2016-05-12
 */
var $ = require('browserify-zepto');

/**
 * cfg.paramName
 * cfg.allowEmpty
 * cfg.isCached
 * cfg.parse
 * cfg.ajaxCfg
 */
function DataSource(cfg) {
	this.cfg = cfg;
	this.caches = {};
}
	
DataSource.prototype = {

	fetchData: function(inputVal, callback, context) {
		var that = this,
				paramName = this.cfg.paramName || 'key',
				allowEmpty = this.cfg.allowEmpty || false,
				isCached = this.cfg.isCached || false,
				parse = this.cfg.parse,
				v;

		if (this.ajax) {
			this.ajax.abort();
			this.ajax = null;
		}

		if (!inputVal && allowEmpty !== true) {
			return callback.call(context, []);
		}

		if (isCached) {
			if (v = this.caches[inputVal]) {
				return callback.call(context, v);
			}
		}

		var ajaxCfg = this.cfg.ajaxCfg;
		ajaxCfg.data = ajaxCfg.data || {};
		ajaxCfg.data[paramName] = inputVal;
		// TODO
		ajaxCfg.data.timestamp = new Date().getTime();
		ajaxCfg.success = function(data) {
			if (parse) {
				data = parse(inputVal, data);
			}
			if (isCached) {
				that.caches[inputVal] = data;
			}
			callback.call(context, data);
		};
		ajaxCfg.error = function(xhr, type) {
			console.log('$.ajax error: ' + type);
		};

		that.ajax = $.ajax(ajaxCfg);

		return undefined;
	},

	setAjaxCfg: function(cfg) {
		$.extend(this.cfg.ajaxCfg, cfg);	
	}
};

module.exports = DataSource;
