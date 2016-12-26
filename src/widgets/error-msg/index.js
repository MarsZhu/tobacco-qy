var $ = require('browserify-zepto');

module.exports = {
	show: function(msg, isDebug) {
		if (!isDebug) {
			msg = '请稍后刷新页面重试';
		}
		var html = '<div class="weui_msg">'
							+ '<div class="weui_icon_area"><i class="weui_icon_warn weui_icon_msg"></i></div>'
							+ '<div class="weui_text_area">'
									+ '<h2 class="weui_msg_title">读取失败</h2>'
									+ '<p class="weui_msg_desc">' + msg + '</p>'
							+ '</div>'
						+ '</div>';

		$('body').html(html);
	}
};
