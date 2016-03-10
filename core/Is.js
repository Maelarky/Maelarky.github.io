/**
 * Useful class to check variable type casting
 * @author gen Taliaru
 */
var Is = new function() {
	this.object = function(v) {
		return String(v) === '[object Object]';
	}
	
	this.defined = function(v) {
		return typeof v !== "undefined";
	}
	
	this.array = function(v) {
		if (typeof v === "object") 
		{
			if (typeof v.length == "undefined") 
			{
				return false;
			}
			return true;
		}
		return false;
		//return String(v) === '[object Array]';
	}
	
	this.number = function(v) {
		return typeof v === 'number' && isFinite(v);
	}
	
	this.string = function(v) {
		return typeof v === 'string';
	}
	
	this.func = function(v) {
		return typeof v == 'function';
	}
	
	this.cssSelector = function(v) {
		if (Is.string(v)) 
		{
			if (v == "#") 
			{
				return false;
			}
			if (v.substr(0, 1) == "#" || v.substr(0, 1) == ".") 
			{
				return true;
			}
		}
		return false;
	}
	
	
	this.between = function(what, from, to, op) {
		var _isBetween = function(w, f, t) {
			if (w >= f && w <= t) 
			{
				return true;
			}
			return false;
		}
		if ($.isArray(what)) 
		{
			var ok = false;
			if (op == "and") 
			{
				$.each(what, function(i, v) {
					if (!_isBetween(v, from, to)) 
					{
						ok = false;
						return false;
					}
				})
			}
			else 
			{
				$.each(what, function(i, v) {
					if (_isBetween(v, from, to)) 
					{
						ok = true;
						return false;
					}
				})
			}
			return ok;
		}
		else 
		{
			return _isBetween(what, from, to);
		}
		return false;
	}
};

