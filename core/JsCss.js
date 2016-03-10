var JsCss = new function() {

	this.init = function() {
		if (document.styleSheets && document.styleSheets.length <= 0) 
		{
			var cssNode = document.createElement('style');
			cssNode.type = 'text/css';
			cssNode.rel = 'stylesheet';
			cssNode.media = 'screen';
			cssNode.title = 'dynamicSheet';
			document.getElementsByTagName("head")[0].appendChild(cssNode);
		}
	}
	
	this.getRuleSelectors = function(rule) {
		rule = rule.trim().toLowerCase();
		if (rule.charAt(0) == "." || rule.charAt(0) == "#") 
		{
			rule = rule.substr(1);
		}
		var sp = rule.split(",");
		var r = new Array();
		for (var i = 0; i < sp.length; i++) 
		{
			var val = sp[i].trim();
			if (val.charAt(0) == "." || val.charAt(0) == "#") 
			{
				val = val.substr(1);
			}
			r.push(val.replace(/(#|\.| )+/g, "[SPACE]").split(/\[SPACE\]/));
		}
		for (var i = 0; i < r.length; i++) 
		{
			r[i] = r[i].sort();
		}
		return r;
	}
	
	this.getCSSRule = function(ruleName, deleteFlag) { // Return requested style obejct
		ruleName = ruleName.toLowerCase(); // Convert test string to lower case.
		var ruleSp = this.getRuleSelectors(ruleName);
		if (document.styleSheets) 
		{ // If browser can play with stylesheets
			for (var i = 0; i < document.styleSheets.length; i++) 
			{ // For each stylesheet
				var styleSheet = document.styleSheets[i]; // Get the current Stylesheet
				var ii = 0; // Initialize subCounter.
				var cssRule = false; // Initialize cssRule. 
				do 
				{ // For each rule in stylesheet
					try 
					{
						if (styleSheet.cssRules.item) 
						{ // Browser uses cssRules?
							cssRule = styleSheet.cssRules.item(ii); // Yes --Mozilla Style
						}
						else if (styleSheet.cssRules) 
						{ // Browser uses cssRules?
							cssRule = styleSheet.cssRules[ii]; // Yes --Mozilla Style
						}
						else 
						{ // Browser usses rules?
							cssRule = styleSheet.rules[ii]; // Yes IE style. 
						} // End IE check.
					} 
					catch (e) 
					{
					}
					
					if (cssRule) 
					{ // If we found a rule...
						var isSpOk = false;
						if (typeof cssRule.selectorText != "undefined") 
						{
							var selSp = this.getRuleSelectors(cssRule.selectorText);
							if (selSp.compare(ruleSp)) 
							{
								isSpOk = true;
							}
						}
						if (typeof cssRule.selectorText != "undefined" && (cssRule.selectorText.toLowerCase() == ruleName || isSpOk)) 
						{ //  match ruleName?
							if (deleteFlag == 'delete') 
							{ // Yes.  Are we deleteing?
								if (styleSheet.cssRules) 
								{ // Yes, deleting...
									styleSheet.deleteRule(ii); // Delete rule, Moz Style
								}
								else 
								{ // Still deleting.
									styleSheet.removeRule(ii); // Delete rule IE style.
								} // End IE check.
								return true; // return true, class deleted.
							}
							else 
							{ // found and not deleting.
								return cssRule; // return the style object.
							} // End delete Check
						} // End found rule name
					} // end found cssRule
					ii++; // Increment sub-counter
				}
				while (cssRule) // end While loop
			} // end For loop
		} // end styleSheet ability check
		return false; // we found NOTHING!
	}
	
	
	
	this.killCSSRule = function(ruleName) { // Delete a CSS rule   
		return this.getCSSRule(ruleName, 'delete'); // just call getCSSRule w/delete flag.
	}
	
	
	this.addRule = function(ruleName) { // Create a new css rule
		if (document.styleSheets) 
		{ // Can browser do styleSheets?
			if (!this.getCSSRule(ruleName)) 
			{ // if rule doesn't exist...
				if (document.styleSheets[0].addRule) 
				{ // Browser is IE?
					document.styleSheets[0].addRule(ruleName, null, 0); // Yes, add IE style
				}
				else 
				{ // Browser is IE?
					document.styleSheets[0].insertRule(ruleName + ' { }', 0); // Yes, add Moz style.
				} // End browser check
			} // End already exist check.
		} // End browser ability check.
		return this.getCSSRule(ruleName); // return rule we just created.
	}
	
	this.addRuleStyle = function(ruleName, styles) {
		var newRule = this.addRule(ruleName);
		for (i in styles) 
		{
			newRule.style[i] = styles[i];
		}
	}
}
