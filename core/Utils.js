/**
 * Some usefule functions
 */
var Utils = new function() {

	/**
	 * Clone object
	 * @param {Object} obj
	 * @return Object
	 */
	this.clone = function(obj) {
		if (obj == null || !Is.object(obj)) 
		{
			return obj;
		}
		
		var temp = {};
		
		for (var key in obj) 
		{
			if (obj.hasOwnProperty(key)) 
			{
				temp[key] = Utils.clone(obj[key]);
			}
		}
		return temp;
	}
	
	/**
	 * DefaultValue for functions like php function($value = "2") in js you use like this
	 * var test = function(value) { value = Utils.defaultValue(value,1);}
	 * @param {Mixed} value
	 * @param {Object} _default
	 * @return {Mixed} 
	 */
	this.defaultValue = function(value, _default) {
		_default = (!Is.defined(_default)) ? false : _default;
		if (!Is.defined(value)) 
		{
			return _default;
		}
		return value;
	}
	
	/**
	 * Convert object to JSON String
	 * @param {Object} obj
	 * @return {Mixed}
	 */
	this.toJSONString = function(obj) {
		var t = typeof(obj);
		if (t != "object" || obj === null) 
		{
			// simple data type
			if (t == "string") 
				obj = '"' + obj + '"';
			return String(obj);
		}
		else 
		{
			// recurse array or object
			var n, v, json = [], arr = (obj && obj.constructor == Array);
			for (n in obj) 
			{
				v = obj[n];
				t = typeof(v);
				if (t == "string") 
					v = '"' + v + '"';
				else if (t == "object" && v !== null) 
					v = this.toJSONString(v);
				json.push((arr ? "" : '"' + n + '":') + String(v));
			}
			return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
		}
	}
	
	/**
	 * Trim the string
	 * @param {String} str
	 * @param {String} chars
	 * @return {String}
	 */
	this.trim = function(str, chars) {
		var ltrim = function(str, chars) {
			str = str.toString();
			chars = chars || "\\s";
			return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
		}
		
		var rtrim = function(str, chars) {
			str = str.toString();
			chars = chars || "\\s";
			return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
		}
		if (str) 
		{
			return ltrim(rtrim(str.toString(), chars), chars);
		}
		return str;
	}
	
	/**
	 * Function to round numbers
	 * @param integer num -
	 * @param integer dec - how many decimals after comma
	 */
	this.roundNumber = function(number, dec) {
		var result = Math.round(number * Math.pow(10, dec)) / Math.pow(10, dec);
		return result;
	}
	
	
	
	this.calcNewImageSize = function(srcWidth, srcHeight, newWidth, newHeight,ratio) {
		finalHeight = newHeight;
		finalWidth = newWidth;
		if (!Is.defined(ratio))
		{
			var ratio = false;
			if (srcWidth > srcHeight) 
			{
				ratio = "W";
			}
			else if (srcWidth < srcHeight) 
			{
				ratio = "H";
			}
			else 
			{
				ratio = "H";
			}
			
			if (newWidth == "auto") 
			{
				ratio = "H";
			}
			if (newHeight == "auto") 
			{
				ratio = "W";
			}
		}
		
		if (ratio == 'H') 
		{
			/**
			 * Calculate the new size to be proportional Vertical.
			 */
			newWidth = Utils.roundNumber(newHeight * (srcWidth / srcHeight), 0);
			newHeight = finalHeight;
		}
		else if (ratio == 'W') 
		{
			/**
			 * Calculate the new size to be proporcional V.
			 */
			newHeight = Utils.roundNumber(newWidth * (srcHeight / srcWidth), 0);
			newWidth = finalWidth;
		}
		return {
			ratio: ratio,
			h: newHeight,
			w: newWidth
		}
	}
};

