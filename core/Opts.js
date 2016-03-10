/**
 * Class to handle plugin options
 * @param {Object} opts
 * @param {Object} jq
 */
var Opts = function(opts, jq) {
	this.opts = opts;
	this.jq = jq;
}
Opts.prototype = 
{
	/**
	 * Just get options
	 * @param {String} name
	 */
	get: function(name) {
		return this.parse(this.opts[name]);
	},
	/**
	 * Just get options
	 * @param {String} name
	 */
	set: function(name,value) {
		this.opts[name] = value;
		return this;
	},
	
	/**
	 * Just get options
	 * @param {String} name
	 */
	string: function(name) {
		return this.parse(this.opts[name], true);
	},
	
	/**
	 * Get option value as number
	 * @param {String} name
	 */
	number: function(name) {
		return parseFloat(this.get(name));
	},
	
	/**
	 * Get option value as number
	 * @param {String} name
	 */
	bool: function(name) {
		var v = this.get(name);
		if (v == "1" || v === true) 
		{
			return true;
		}
		return false;
	},
	
	/**
	 * Get option selector jquery object
	 * @param {String} name
	 */
	selector: function(name) {
		return this.jq(this.get(name));
	},
	
	
	/**
	 * Get option selector jquery object
	 * @param {String} name
	 */
	func: function(name) {
		return this.parse(this.opts[name], true, true);
	},
	
	/**
	 * Private function parse option value
	 * @param {Object} val
	 * @param {Boool} voidCssSelector
	 */
	parse: function(val, voidCssSelector, voidFunctionCall) {
		if (typeof val == "undefined") 
		{
			return "";
		}
		var v = val.valueOf();
		if (typeof v == "function") 
		{
			if (voidFunctionCall == true) 
			{
				return v;
			}
			return v();
		}
		else if (Is.cssSelector(v) && voidCssSelector !== true) 
		{
			var $th = this.jq(v);
			if ($th.size() <= 0)
			{
				debug("Opts.parse "+ v +" not found");
				return falese;
			}
			var isCheckbox = ($th.get(0).tagName == "INPUT" && $th.attr("type").toString().toLowerCase() == "checkbox");
			if (isCheckbox) 
			{
				return $th.is(":checked");
			}
			return $th.val();
		}
		else 
		{
			return v;
		}
	}
};
