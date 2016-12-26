/**
 * @fileoverview ATV.Base 基础类
 * @author 首作<aloysious.ld@taobao.com>
 * @date 2015-05-16
 */

'use strict';

var initializing = false, fnTest = /var xyz/.test(function () { var xyz; }) ? /\b_super\b/ : /.*/;

function Base() {}

/**
 * 定义一个继承于Base的类
 * @param prop {Object} 扩展的原型属性或方法
 */
Base.extend = function(prop) {

	var _super = this.prototype;

	initializing = true;
	var proto = new this();
	initializing = false;

	for (var name in prop) {
		proto[name] = typeof prop[name] === "function" &&
			typeof _super[name] == "function" && fnTest.test(prop[name]) ?
				(function(name, fn) {
					return function() {
						var tmp = this._super;
						this._super = _super[name];

						var ret = fn.apply(this, arguments);
						this._super = tmp;

						return ret;
					};
				
				})(name, prop[name]) : prop[name];
	}

	var newClass = function() {
		if (!initializing && this.init) {
			this.init.apply(this, arguments);
		}
	};

	newClass.prototype = proto;
	proto.constructor = newClass;

	newClass.extend = Base.extend;

	return newClass;
}

module.exports = Base;
