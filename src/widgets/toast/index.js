var $ = require('browserify-zepto');

var Toast = {
	show: function(text) {
		if (!this.toastNode) {
			this._renderToastNode();
		}

		var that = this;

		this.toastNode.find('.weui_toast_content').html(text || '已完成');
		this.toastNode.show();
		setTimeout(function() {
			that.hide();
		}, 2000);
	},

	hide: function() {
		if (this.toastNode) {
			this.toastNode.hide();
		}
	},

	_renderToastNode: function() {
		var html = '<div id="toast" style="display: none;">'
							+ '<div class="weui_mask_transparent"></div>'
							+ '<div class="weui_toast">'
								+ '<i class="weui_icon_toast"></i>'
								+ '<p class="weui_toast_content"></p>'
							+ '</div>'
						+ '</div>';
		
		$('body').append(html);
		$('.weui_mask_transparent').css({
			zIndex: 999
		});
		$('.weui_toast').css({
			zIndex: 999
		});
		this.toastNode = $('#toast');
	}
};

module.exports = Toast;
