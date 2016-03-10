function debug(value) {
	if (arguments.length > 1) 
	{
		console.log(arguments);
	}
	else 
	{
		console.log(value);
	}
}

var ___isArray = function(v) {
	if (typeof v === "object") 
	{
		if (typeof v.length == "undefined") 
		{
			return false;
		}
		return true;
	}
	return false;
}
var __applyToAll = function(name, method) {
	Array.prototype[name] = method;
	String.prototype[name] = method;
	Number.prototype[name] = method;
	Date.prototype[name] = method;
	Function.prototype[name] = method;
	RegExp.prototype[name] = method;
	Boolean.prototype[name] = method;
}

var __applyTo = function(toName, name, method) {
	if (toName.match(/,/i)) 
	{
		ex = toName.split(/,/i);
		for (i = 0; i < ex.length; i++) 
		{
			__apply(ex[i], name, method);
		}
	}
	else 
	{
		__apply(toName, name, method);
	}
}
var __apply = function(toName, name, method) {
	if (toName == "Array") 
	{
		Array.prototype[name] = method;
	}
	else if (toName == "String") 
	{
		String.prototype[name] = method;
	}
	else if (toName == "Number") 
	{
		Number.prototype[name] = method;
	}
	else if (toName == "Date") 
	{
		Date.prototype[name] = method;
	}
	else if (toName == "Function") 
	{
		Function.prototype[name] = method;
	}
	else if (toName == "RegExp") 
	{
		RegExp.prototype[name] = method;
	}
	else if (toName == "Boolean") 
	{
		Boolean.prototype[name] = method;
	}
}

__apply("Array", "isIn", function(notValues) {
	if (!___isArray(notValues)) 
	{
		var ex = notValues.toString().split(/,/g);
	}
	else 
	{
		var ex = notValues;
	}
	arr = this.valueOf();
	for (var i = 0; i < arr.length; i++) 
	{
		arrValue = arr[i];
		for (var e = 0; e < ex.length; e++) 
		{
			exValue = ex[e];
			if (exValue == arrValue) 
			{
				return true;
			}
		}
	}
	return false;
});

function __isNumeric(value) {
	if (value === null) 
	{
		return false;
	}
	if (value === undefined) 
	{
		return false;
	}
	if (value == "") 
	{
		return false;
	}
	value = value.toString().replace(/,/g, ".");
	if (isNaN(value) == true) 
	{
		return false;
	}
	else 
	{
		return true;
	}
}

function __toNumber(v) {
	if (typeof v == "undefined") 
	{
		v = this.valueOf();
	}
	if (v == undefined) 
	{
		return false;
	}
	v = v.toString().replace(/,/g, ".");
	if (__isNumeric(v)) 
	{
		if (v.match(/\./)) 
		{
			return parseFloat(v);
		}
		else 
		{
			return parseInt(v);
		}
	}
	return 0;
}

__applyToAll("toNumber", __toNumber);
var __toNegative = function() {
	var v = __toNumber(this.valueOf());
	if (v <= 0) 
	{
		return v;
	}
	return v * -1;
}
__applyToAll("toNegative", __toNegative);

if (!String.prototype.trim) 
{
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	};
}
if (!Array.prototype.compare) 
{
	Array.prototype.compare = function(array) {
		// if the other array is a falsy value, return
		if (!array) 
			return false;
		
		// compare lengths - can save a lot of time
		if (this.length != array.length) 
			return false;
		
		for (var i = 0; i < this.length; i++) 
		{
			// Check if we have nested arrays
			if (this[i] instanceof Array && array[i] instanceof Array) 
			{
				// recurse into the nested arrays
				if (!this[i].compare(array[i])) 
					return false;
			}
			else if (this[i] != array[i]) 
			{
				// Warning - two different object instances will never be equal: {x:20} != {x:20}
				return false;
			}
		}
		return true;
	}
}

var __toPositive = function() {
	var v = __toNumber(this.valueOf());
	if (v <= 0) 
	{
		v = v * (-1);
	}
	return v;
}
__applyToAll("toPositive", __toPositive);

function __toArray(v) {
	if (___isArray(v)) 
	{
		return v;
	}
	return this.valueOf().toString().trim().split(/,/g);
}

__applyToAll("toArray", __toArray);

var __toJSON = function(obj) {
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
				v = __toJSON(v);
			json.push((arr ? "" : '"' + n + '":') + String(v));
		}
		return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
	}
}
String.prototype.toJSON = __toJSON;

var __toBool = function() {
	var v = this.valueOf();
	if (v === "1" || v === 1 || v === "true" || v == true) 
	{
		return true;
	}
	return false;
}
__applyToAll("toBool", __toBool);
/**
 * Useful javascript extensions
 * @author gen Taliaru
 */
var __mathString = function(string) {
	if (!this.valueOf().toNumber) 
	{
		console.trace()
	}
	var origValue = this.valueOf().toNumber();
	string = string.replace(" ", "");
	$op = string.substring(0, 1);
	mathValue = __toNumber(string.substring(1));
	newValue = mathValue;
	if ($op == "+") 
	{
		newValue = origValue + mathValue;
	}
	else if ($op == "*") 
	{
		newValue = origValue * mathValue;
	}
	else if ($op == "-") 
	{
		newValue = origValue - mathValue;
	}
	else if ($op == "%") 
	{
		newValue = (origValue * mathValue) / 100;
	}
	else if ($op == "/" || $op == ":") 
	{
		newValue = origValue / mathValue;
	}
	return newValue;
	
}
__applyTo("String,Number", "math", __mathString);

Function.prototype.eBind = function(obj, args, appendArgs) {
	var fn = this;
	return function() {
		var callArgs = args || arguments;
		if (appendArgs === true) 
		{
			callArgs = Array.prototype.slice.call(arguments, 0);
			callArgs = callArgs.concat(args);
		}
		else if (typeof appendArgs === 'number' && isFinite(appendArgs)) 
		{
			callArgs = Array.prototype.slice.call(arguments, 0);
			// copy arguments first
			var applyArgs = [appendArgs, 0].concat(args);
			// create method call params
			Array.prototype.splice.apply(callArgs, applyArgs);
			// splice them in
		}
		return fn.apply(obj || window, callArgs);
	};
};

Function.prototype.delay = function(time, scope, callArgs) {
	var fn = this;
	var callArgs = callArgs || [];//Array.prototype.slice.call(arguments, 2);
	if (scope) 
	{
		var newFn = fn.eBind(scope, callArgs);
	}
	else 
	{
		var newFn = fn;
	}
	if (time <= 0)
	{
		newFn();
	}
	else
	{
		window.setTimeout(newFn, time);
	}
	return newFn;
};


String.prototype.toCamelCase = function() {
	return this.replace(/-([a-z])/g, function($0, $1) {
		return $1.toUpperCase();
	}).replace('-', '');
};
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

__toFloat = function() {
	return parseFloat(this.valueOf());
};

__applyToAll("toFloat", __toFloat);

__toInt = function() {
	return parseInt(this.valueOf());
};
__applyToAll("toInt", __toInt);


