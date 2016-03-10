/**
 * Useful jquery extension
 * @author gen Taliaru
 */
$.support.transition = (function() {
	var thisBody = document.body || document.documentElement, thisStyle = thisBody.style, support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
	return support;
})();
jQuery.fn.doCheck = function(check) {
	this.each(function() {
		var $th = jQuery(this);
		if (typeof jQuery.fn.prop == "function") 
		{
			if (check) 
			{
				$th.prop("checked", "checked")
			}
			else 
			{
				$th.removeProp("checked")
			}
		}
		if (check) 
		{
			$th.attr("checked", "checked")
		}
		else 
		{
			$th.removeAttr("checked")
		}
		$th.get(0).checked = check;
	})
	return this;
};

jQuery.fn.sumOuterWidth = function(includeMargin) {
	if (includeMargin !== true) 
	{
		includeMargin = false;
	}
	var w = 0;
	this.each(function() {
		w += eval(jQuery(this).outerWidth(includeMargin));
	})
	return w;
};

jQuery.fn.setData = function(name, value) {
	if (String(name) === '[object Object]' && typeof value == "undefined") 
	{
		for (var i in name) 
		{
			jQuery(this).data("opie-" + i, name[i]);
		}
		return this;
	}
	else 
	{
		return jQuery(this).data("opie-" + name, value);
	}
};

jQuery.fn.call = function(name) {
	return jQuery(this).trigger(name, Array.prototype.slice.call(arguments, 1));
};
jQuery.fn.getData = function(name) {
	return jQuery(this).data("opie-" + name);
};
jQuery.fn.setAttr = function(name, value) {
	return jQuery(this).attr("data-opie-" + name, value);
};
jQuery.fn.getAttr = function(name) {
	return jQuery(this).attr("data-opie-" + name);
};
jQuery.fn.delAttr = function(name) {
	return jQuery(this).removeAttr("data-opie-" + name);
};

jQuery.fn.hasFilter = function(name) {
	if (name === false || typeof name == "undefined") 
	{
		return true;
	}
	var filters = jQuery(this).getData("filters");
	if (typeof filters[name] != "undefined") 
	{
		return true;
	}
	return false;
};

jQuery.fn.parseFilters = function(asArray) {
	var $th = jQuery(this);
	var filters = (asArray) ? [] : {};
	if ($th.getAttr("filter")) 
	{
		var sp = $th.getAttr("filter").toString().split(",");
		if (sp.length > 0) 
		{
			jQuery.each(sp, function(i, el) {
				if (asArray) 
				{
					filters.push(el);
				}
				else 
				{
					filters[el] = true;
				}
				
			})
		}
	}
	jQuery(this).setData("filters", filters);
	return $th;
};


jQuery.fn.hasClasses = function(classes) {
	hasClasses = undefined;
	var m = this;
	classes = classes.toString();
	if (classes.match(/ &.? |&+/i)) 
	{
		a = classes.split(/ &.? |&+/i);
		jQuery.each(a, function(i, cl) {
			cl = __trim(cl);
			if (!m.hasClass(cl)) 
			{
				hasClasses = false;
				return false;
			}
		})
		if (hasClasses == undefined) 
		{
			hasClasses = true;
		}
	}
	else if (classes.match(/ \|.? |\|+/i)) 
	{
		jQuery.each(classes.toString().split(/ \|.? |\|+/i), function(i, cl) {
			cl = __trim(cl);
			if (m.hasClass(cl)) 
			{
				hasClasses = true;
				return false;
			}
		})
	}
	else 
	{
		jQuery.each(classes.toString().split(","), function(i, cl) {
			cl = __trim(cl);
			if (m.hasClass(cl)) 
			{
				hasClasses = true;
				return false;
			}
		})
	}
	if (hasClasses == undefined) 
	{
		hasClasses = false;
	}
	return hasClasses;
};

jQuery.fn.replaceClass = function(from, to) {
	if (typeof to == "undefined") 
	{
		if (from.toString().indexOf("|") >= 0) 
		{
			ex = from.split("|");
			from = ex[0];
			to = ex[1];
		}
		else 
		{
			to = from;
		}
	}
	return this.removeClass(from).addClass(to);
};

jQuery.fn.ok = function() {
	return (this.size() > 0) ? true : false;
};

jQuery.fn.getID = function() {
	return this.attr("id");
};
jQuery.fn.ID = function(ID) {
	if (typeof ID != "undefined") 
	{
		return this.attr("id", ID);
	}
	return this.attr("id");
};

jQuery.fn.borderWidth = function(b) {
	if (typeof b == "undefined") 
	{
		b = "all";
	}
	var w = 0;
	if (b == "all") 
	{
		w += parseFloat(this.css("border-left-width"));
		w += parseFloat(this.css("border-top-width"));
		w += parseFloat(this.css("border-right-width"));
		w += parseFloat(this.css("border-bottom-width"));
		return w;
	}
	if (b.match(/t/)) 
	{
		w += parseFloat(this.css("border-top-width"));
	}
	if (b.match(/l/)) 
	{
		w += parseFloat(this.css("border-left-width"));
	}
	if (b.match(/r/)) 
	{
		w += parseFloat(this.css("border-right-width"));
	}
	if (b.match(/b/)) 
	{
		w += parseFloat(this.css("border-top-width"));
	}
	return w;
};

jQuery.fn.sumBorderWidth = function(b) {
	var w = 0;
	this.each(function() {
		w += eval(jQuery(this).borderWidth(b));
	})
	return w;
};

jQuery.fn.left = function(useOffset) {
	if (typeof useOffset != "undefined" && useOffset !== true && useOffset !== false) 
	{
		return this.css("left", useOffset + "px");
	}
	if (useOffset === true) 
	{
		return this.offset().left;
	}
	return this.position().left;
};

jQuery.fn.top = function(useOffset) {
	if (typeof useOffset != "undefined" && useOffset !== true && useOffset !== false) 
	{
	
		return this.css("top", useOffset + "px");
	}
	if (useOffset === true) 
	{
		return this.offset().top;
	}
	return this.position().top;
};

jQuery.fn.right = function(useOffset, includeOuterWidthMargin) {
	if (typeof useOffset != "undefined" && useOffset !== true && useOffset !== false) 
	{
		if (includeOuterWidthMargin == true) 
		{
			useOffset = useOffset - this.outerWidth(true);
		}
		else 
		{
			useOffset = useOffset - this.outerWidth();
		}
		return this.css("left", useOffset + "px");
	}
	if (useOffset === true) 
	{
		return this.offset().left + this.outerWidth(true);
	}
	return this.position().left + this.outerWidth();
};

jQuery.fn.bottom = function(v, oh) {
	if (typeof v != "undefined" && v !== true && v !== false) 
	{
		if (oh == true) 
		{
			v = v - this.outerHeight(true);
		}
		else 
		{
			v = v - this.outerHeight();
		}
		return this.css("top", v + "px");
	}
	if (v === true) 
	{
		return this.offset().top + this.outerHeight(true);
	}
	return this.position().top + this.outerHeight();
};
jQuery.fn.initTransition = function(properties, duration, delay, ease) {
	var sufix = "";
	if (jQuery.browser.webkit) 
	{
		sufix = "-webkit-";
	}
	else if (jQuery.browser.mozilla) 
	{
		sufix = "-moz-";
	}
	else if (jQuery.browser.opera) 
	{
		sufix = "-o-";
	}
	else if (jQuery.browser.msie) 
	{
		sufix = "-ms-";
	}
	var css = {};
	var computed = window.getComputedStyle(this.get(0));
	debug(computed.getPropertyValue(sufix + "transition-property"), computed.getPropertyValue(sufix + "transition-duration"), computed.getPropertyValue(sufix + "transition-delay"), computed.getPropertyValue(sufix + "timing-function"))
	css[sufix + "transition-property"] = computed.getPropertyValue(sufix + "transition-property") + "," + properties;
	css[sufix + "transition-duration"] = computed.getPropertyValue(sufix + "transition-duration") + "," + duration;
	css[sufix + "transition-delay"] = computed.getPropertyValue(sufix + "transition-delay") + "," + delay;
	css[sufix + "transition-timing-function"] = computed.getPropertyValue(sufix + "transition-timing-function") + "," + ease;
	css[sufix + "backface-visibility"] = "hidden";
	//this.css(css);
	return this;
};
jQuery.fn.reverse = [].reverse;
