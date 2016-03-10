$.extend($.easing, 
{
	def: 'easeOutQuad',
	swing: function(x, t, b, c, d) {
		//alert($.easing.default);
		return $.easing[$.easing.def](x, t, b, c, d);
	},
	easeInQuad: function(x, t, b, c, d) {
		return c * (t /= d) * t + b;
	},
	easeOutQuad: function(x, t, b, c, d) {
		return -c * (t /= d) * (t - 2) + b;
	},
	easeInOutQuad: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) 
			return c / 2 * t * t + b;
		return -c / 2 * ((--t) * (t - 2) - 1) + b;
	},
	easeInCubic: function(x, t, b, c, d) {
		return c * (t /= d) * t * t + b;
	},
	easeOutCubic: function(x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t + 1) + b;
	},
	easeInOutCubic: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) 
			return c / 2 * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t + 2) + b;
	},
	easeInQuart: function(x, t, b, c, d) {
		return c * (t /= d) * t * t * t + b;
	},
	easeOutQuart: function(x, t, b, c, d) {
		return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	},
	easeInOutQuart: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) 
			return c / 2 * t * t * t * t + b;
		return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	},
	easeInQuint: function(x, t, b, c, d) {
		return c * (t /= d) * t * t * t * t + b;
	},
	easeOutQuint: function(x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	},
	easeInOutQuint: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) 
			return c / 2 * t * t * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
	},
	easeInSine: function(x, t, b, c, d) {
		return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	},
	easeOutSine: function(x, t, b, c, d) {
		return c * Math.sin(t / d * (Math.PI / 2)) + b;
	},
	easeInOutSine: function(x, t, b, c, d) {
		return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	},
	easeInExpo: function(x, t, b, c, d) {
		return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
	},
	easeOutExpo: function(x, t, b, c, d) {
		return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
	},
	easeInOutExpo: function(x, t, b, c, d) {
		if (t == 0) 
			return b;
		if (t == d) 
			return b + c;
		if ((t /= d / 2) < 1) 
			return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
		return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function(x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
	},
	easeOutCirc: function(x, t, b, c, d) {
		return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
	},
	easeInOutCirc: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) 
			return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
		return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
	},
	easeInElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) 
			return b;
		if ((t /= d) == 1) 
			return b + c;
		if (!p) 
			p = d * 0.3;
		if (a < Math.abs(c)) 
		{
			a = c;
			var s = p / 4;
		}
		else 
			var s = p / (2 * Math.PI) * Math.asin(c / a);
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	},
	easeOutElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) 
			return b;
		if ((t /= d) == 1) 
			return b + c;
		if (!p) 
			p = d * 0.3;
		if (a < Math.abs(c)) 
		{
			a = c;
			var s = p / 4;
		}
		else 
			var s = p / (2 * Math.PI) * Math.asin(c / a);
		return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	},
	easeInOutElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) 
			return b;
		if ((t /= d / 2) == 2) 
			return b + c;
		if (!p) 
			p = d * (0.3 * 1.5);
		if (a < Math.abs(c)) 
		{
			a = c;
			var s = p / 4;
		}
		else 
			var s = p / (2 * Math.PI) * Math.asin(c / a);
		if (t < 1) 
			return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
	},
	easeInBack: function(x, t, b, c, d, s) {
		if (s == undefined) 
			s = 1.70158;
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	},
	easeOutBack: function(x, t, b, c, d, s) {
		if (s == undefined) 
			s = 1.70158;
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	},
	easeInOutBack: function(x, t, b, c, d, s) {
		if (s == undefined) 
			s = 1.70158;
		if ((t /= d / 2) < 1) 
			return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
		return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
	},
	easeInBounce: function(x, t, b, c, d) {
		return c - $.easing.easeOutBounce(x, d - t, 0, c, d) + b;
	},
	easeOutBounce: function(x, t, b, c, d) {
		if ((t /= d) < (1 / 2.75)) 
		{
			return c * (7.5625 * t * t) + b;
		}
		else if (t < (2 / 2.75)) 
		{
			return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
		}
		else if (t < (2.5 / 2.75)) 
		{
			return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
		}
		else 
		{
			return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
		}
	},
	easeInOutBounce: function(x, t, b, c, d) {
		if (t < d / 2) 
			return $.easing.easeInBounce(x, t * 2, 0, c, d) * 0.5 + b;
		return $.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
	}
});
// http://matthewlein.com/ceaser/
var CSS3Easings = 
{
	linear: "0.250, 0.250, 0.750, 0.750",
	swing: "0.000, 0.420, 1.000, 0.745",
	swing: "0.000, 0.420, 1.000, 0.745",
	easeInCubic: "0.550, 0.055, 0.675, 0.190",
	easeInQuart: "0.895, 0.030, 0.685, 0.220",
	easeInQuint: "0.755, 0.050, 0.855, 0.060",
	easeInSine: "0.470, 0.000, 0.745, 0.715",
	easeInExpo: "0.950, 0.050, 0.795, 0.035",
	easeInCirc: "0.600, 0.040, 0.980, 0.335",
	easeInBack: "0.600, -0.280, 0.735, 0.045",
	easeOutQuad: "0.250, 0.460, 0.450, 0.940",
	easeOutCubic: "0.215, 0.610, 0.355, 1.000",
	easeOutQuart: "0.165, 0.840, 0.440, 1.000",
	easeOutQuint: "0.230, 1.000, 0.320, 1.000",
	easeOutSine: "0.390, 0.575, 0.565, 1.000",
	easeOutExpo: "0.190, 1.000, 0.220, 1.000",
	easeOutCirc: "0.075, 0.820, 0.165, 1.000",
	easeOutBack: "0.175, 0.885, 0.320, 1.275",
	easeInOutQuad: "0.455, 0.030, 0.515, 0.955",
	easeInOutCubic: "0.645, 0.045, 0.355, 1.000",
	easeInOutQuart: "0.770, 0.000, 0.175, 1.000",
	easeInOutQuint: "0.860, 0.000, 0.070, 1.000",
	easeInOutSine: "0.445, 0.050, 0.550, 0.950",
	easeInOutExpo: "1.000, 0.000, 0.000, 1.000",
	easeInOutCirc: "0.785, 0.135, 0.150, 0.860",
	easeInOutBack: "0.680, -0.550, 0.265, 1.550"
}
