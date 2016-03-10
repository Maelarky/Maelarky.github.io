/**
 * Responsive Fully Customizable jQuery Portfolio Gallery
 * @author Gen Taliaru http://www.opiescripts.com/
 * @version 1.0.5
 */
(function($) {
	"use strict";
	$.fn.OpiePortfolioGallery = function(options, args) {
	
		var defaults = 
		{
			boxSelector: ".o-box",
			innerWrapperSelector: ".o-inner-wrapper",
			bigImageSelector: "img.o-big-image",
			thumbImageSelector: "img.o-thumb-image",
			extraInfoSelector: ".o-extra-info",
			enlargeButtonSelector: ".o-enlarge",
			toolbarSelector: ".o-toolbar",
			maxBoxSize: 195,
			loaderFadeInDuration: 150,
			loaderFadeOutDuration: 450,
			boxMovementDuration: 300,
			delayIncrease: 0,
			delayStart: 0,
			maxDelay: 0,
			scrollingAid: true,
			scrollingOffset: 50,
			boxPositionEasing: "linear",
			extraInfoOpenEasing: "linear",
			extraInfoCloseEasing: "linear",
			boxOpenEasing: "linear",
			boxCloseEasing: "linear",
			boxOpenDuration: 300,
			boxCloseDuration: 300,
			filterNavSelector: false,
			
			dontResizeThumbs: false,
			useCentering: false,
			
			userCSS3Accelerate: true,
			loadMore: 12
		};
		var Opt = new Opts($.extend(defaults, options), $);
		
		var PG;
		this.each(function() {
			PG = new $.OpiePortfolioGallery(Opt, $(this), arguments);
			if (options === "initCSS3") 
			{
				IS.initCSS3.apply(PG, args);
			}
			else 
			{
				PG.init();
			}
		});
		
		return this;
	}
	
	$.OpiePortfolioGallery = function(Opt, $Wrapper, allArgs) {
	
		var me = this;
		var $Boxes;
		;
		var $Inner = $Wrapper.find(Opt.string("innerWrapperSelector"));
		var maxBoxSize = Opt.number("maxBoxSize");
		var boxSize = 0;
		var maxBottom = 0;
		var currentButtom = 0;
		var activeFilterName = false;
		var leftOverRight = 0;
		var userCSS3Accelerate = Opt.bool("userCSS3Accelerate");
		var boxCloseDuration = Opt.number("boxCloseDuration");
		var boxCloseEasing = Opt.get("boxCloseEasing");
		var boxMovementDuration = Opt.number("boxMovementDuration");
		var boxPositionEasing = Opt.get("boxPositionEasing");
		var delayIncrease = Opt.number("delayIncrease");
		var boxOpenEasing = Opt.get("boxOpenEasing");
		var boxOpenDuration = Opt.get("boxOpenDuration");
		
		this.init = function() {
		
			this.initCSS3();
			me.resetBoxes();
			
			if (Opt.string("filterNavSelector") !== false) 
			{
				var $NavItems = $(Opt.string("filterNavSelector"));
				var $ActiveFIlterNav = $NavItems.filter(".active");
				if ($ActiveFIlterNav.size() > 0) 
				{
					activeFilterName = $ActiveFIlterNav.getAttr("filter");
				}
				$NavItems.click(function(e) {
					$NavItems.removeClass("active");
					$Boxes.removeClass("doReduce doEnlarge");
					$(this).addClass("active");
					activeFilterName = $(this).getAttr("filter");
					me.fillTiles(false, true);
					e.preventDefault();
					return false;
				});
			}
			
			$Boxes.each(function() {
				var $th = $(this);
				$th.parseFilters();
				var $bigImage = $th.find(Opt.string("bigImageSelector"));
				if ($th.find(".o-big-image-wrapper").size() <= 0 && $bigImage.size() > 0) 
				{
					$bigImage.wrap('<div class="o-big-image-wrapper" />');
				}
				if ($th.find(".o-big-image-inner-wrapper").size() <= 0) 
				{
								//$th.find(".o-big-image-wrapper").children().wrapAll('<div class="o-big-image-inner-wrapper" />')
				}
				
				if ($th.find(Opt.string("extraInfoSelector")).size() > 0) 
				{
								//$th.find(".o-big-image-wrapper").append('<a href="javascript:enlarge" class="o-enlarge closed"><span>Enlarge</span></a>');
				}
				$th.setData("positionData", false);
				$th.append('<div class="loader" />');
			});
			
			
			$Boxes.find(Opt.string("toolbarSelector") + "li.o-ti a").click(function() {
				var $a = $(this);
				var $box = $(this).parents(Opt.string("boxSelector"));
				return me.anchorClick($a, $box);
			});
			$Boxes.click(function(e) {
				var $target = $(e.target);
				if ($Wrapper.hasClass("inMotion")) 
				{
					return false;
				}
				if ($target.is("a") && $target.parents(Opt.string("toolbarSelector")).size() > 0) 
				{
					return true;
				}
				var $th = $(this);
				if ($th.hasClass("o-load-more")) 
				{
					me.loadMore();
				}
				else 
				{
					$Boxes.removeClass("doReduce doEnlarge");
					
					if ($th.hasClass("active")) 
					{
						var $parent = $target.parent().parent();
						if ($parent.is("a")) //if is link
						{
							return me.anchorClick($parent, $th);
						}
						$th.removeClass("active").addClass("preDeActive");
					}
					else 
					{
						$th.addClass("preactive");
					}
					me.loader($Boxes.filter(".active"), true);
					me.loader($th, true);
					me.fillTiles(true, false);
					if (!$target.parent().is("a")) 
					{
						return false;
					}
				}
			});
			me.initSizes();
			var delay = (function() {
				var timer = 0;
				return function(callback, ms) {
					clearTimeout(timer);
					timer = setTimeout(callback, ms);
				};
			})();
			var x, y;
			var w = $(window).resize(function() {
				var newx = w.width();
				var newy = w.height();
				if (x != newx || y != newy) 
				{
					delay(function() {
						$Boxes.removeClass("active doEnlarge doReduce");
						$Boxes.find(Opt.string("bigImageSelector")).css("width", "").css("height", "");
						me.initSizes();
					}, 300);
				}
				x = newx;
				y = newy;
			});
			
		}
		
		this.initCSS3 = function() {
			if (userCSS3Accelerate && $.support.transition) 
			{
				JsCss.init();
				var transistion = "all " + (boxMovementDuration / 1000) + "s cubic-bezier(" + CSS3Easings[boxPositionEasing] + ")";
				JsCss.addRuleStyle(".opie-portfolio .o-box.moving", 
				{
					"-webkit-transition": transistion,
					"-moz-transition": transistion,
					"-o-transition": transistion,
					"-ms-transition": transistion,
					"transition": transistion
				});
				
				var transistion = "all " + (boxOpenDuration / 1000) + "s cubic-bezier(" + CSS3Easings[boxOpenEasing] + ")";
				JsCss.addRuleStyle(".opie-portfolio .o-box.opening", 
				{
					"-webkit-transition": transistion,
					"-moz-transition": transistion,
					"-o-transition": transistion,
					"-ms-transition": transistion,
					"transition": transistion
				});
			}
		}
		
		this.resetBoxes = function() {
			$Boxes = $Wrapper.find(Opt.string("boxSelector"));
		}
		
		this.initSizes = function() {
			$Boxes.setData("positionData", false);
			
			var innerWidth = $Wrapper.outerWidth(true) - ($Wrapper.outerWidth() - $Wrapper.width());
			$Inner.width(innerWidth);
			
			var op = innerWidth / maxBoxSize;
			
			var tmpSp = Utils.roundNumber(op, 2).toString().replace(/,/g, ".").split(".");
			var dontResizeThumbs = Opt.bool("dontResizeThumbs");
			if (dontResizeThumbs === false) 
			{
				if (Is.defined(tmpSp[1]) && tmpSp[1] < 50) 
				{
					var maxPerRow = Math.ceil(op);
				}
				else 
				{
					var maxPerRow = Math.floor(op);
				}
			}
			else 
			{
				var maxPerRow = tmpSp[0].toNumber();
			}
			
			
			var con = true;
			boxSize = Math.floor((((100 / maxPerRow) / 100) * innerWidth));
			if (dontResizeThumbs === false) 
			{
				while (con) 
				{
					if (boxSize > maxBoxSize) 
					{
						maxPerRow++;
						boxSize = (((100 / maxPerRow) / 100) * innerWidth);
					}
					else 
					{
						con = false;
					}
				}
			}
			if (boxSize > maxBoxSize) 
			{
				boxSize = maxBoxSize;
				var rowWidth = (maxBoxSize * maxPerRow);
				if (innerWidth > rowWidth && Opt.bool("useCentering") === true) 
				{
					leftOverRight = innerWidth - rowWidth;
					$Inner.width((innerWidth - leftOverRight));
				}
			}
			me.fillTiles(false, true);
		}
		
		
		this.anchorClick = function($a, $box) {
			var href = $a.attr("href");
			if (href == "javascript:zoom") 
			{
				me.toggleZoom($box);
				return false;
			}
			else if (href == "javascript:enlarge") 
			{
				me.toggleDetails($box);
				return false;
			}
			else 
			{
				return "void";
			}
			return true;
		}
		
		this.reduceCallBack = false;
		
		this.toggleDetails = function($box, forceClose, closeCallBack) {
			if ($Wrapper.hasClass("inMotion")) 
			{
				return false;
			}
			if ($box.hasClass("zoomed")) 
			{
				me.toggleZoom($box, true, me.toggleDetails.eBind(me, [$box]));
			}
			else 
			{
				if ($box.hasClass("doEnlarge") || forceClose === true) 
				{
					$box.replaceClass("doEnlarge", "doReduce");
					if (forceClose === true) 
					{
						me.reduceCallBack = closeCallBack;
					}
				}
				else 
				{
					$box.replaceClass("doReduce", "doEnlarge");
				}
				me.fillTiles(false, false);
			}
		}
		
		this.toggleZoom = function($box, forceClose, closeCallBack) {
			var $img = $box.find(Opt.string("bigImageSelector"));
			if ($box.hasClass("doEnlarge")) 
			{
				me.toggleDetails($box, true, me.toggleZoom.eBind(me, [$box]));
			}
			else 
			{
				if ($box.hasClass("zoomed") || forceClose === true) 
				{
					me.toolbarFeatures($box, "zoom", true);
					$Boxes.not(".active").fadeIn();
					$box.animate($box.getData("beforeZoom"));
					$img.animate($img.getData("beforeZoom"), function() {
						me.fixPortSize(true);
						$box.removeClass("zoomed");
						if (closeCallBack)
						{
							closeCallBack();
						}
					});
				}
				else 
				{
					$Boxes.not(".active").fadeOut();
					me.toolbarFeatures($box, "zoom", false);
					var wrapperWidth = $Inner.width();
					var imgOrigWidth = $img.getData("width");
					var imgOrigHeight = $img.getData("height");
					$box.addClass("zoomed");
					$img.setData("beforeZoom", 
					{
						width: $img.width(),
						height: $img.height(),
						marginLeft: $img.css("marginLeft"),
						marginTop: $img.css("marginTop")
					});
					$box.setData("beforeZoom", 
					{
						width: $box.width(),
						height: $box.height(),
						left: $box.css("left"),
						top: $box.css("top")
					});
					$box.animate(
					{
						width: wrapperWidth,
						left: 0
					});
					var boxAnimCss = 
					{
						width: wrapperWidth,
						left: 0
					}
					var imgAnimCss = 
					{
						marginTop: 0,
						marginLeft: 0,
						width: imgOrigWidth
					}
					if (wrapperWidth > imgOrigWidth) 
					{
						imgAnimCss.height = imgOrigHeight;
						imgAnimCss.width = imgOrigWidth;
						imgAnimCss.marginLeft = (wrapperWidth - imgOrigWidth) / 2;
					}
					else 
					{
						var newSize = Utils.calcNewImageSize(imgOrigWidth, $img.getData("height"), wrapperWidth, "auto");
						imgAnimCss.height = newSize.h;
						imgAnimCss.width = wrapperWidth;
					}
					boxAnimCss.height = imgAnimCss.height;
					$box.animate(boxAnimCss, 
					{
						duration: "fast",
						queue: false
					});
					$img.animate(imgAnimCss, 
					{
						queue: false
					});
					$Inner.stop().animate(
					{
						"height": imgAnimCss.height
					}, 
					{
						duration: "fast",
						queue: false
					});
				}
			}
		}
		
		this.loadThumbs = function($tuhmbs) {
			if (!Is.defined($tuhmbs)) 
			{
				$tuhmbs = $Boxes.not(".o-hidden");
			}
			$tuhmbs.each(function() {
				var $th = $(this);
				var $img = $(this).find(Opt.string("thumbImageSelector"));
				var imageLoaction = $img.getAttr("src");
				var isAuto = false;
				if (imageLoaction) 
				{
					if (imageLoaction == "auto") 
					{
						isAuto = true;
						imageLoaction = $th.find(Opt.string("bigImageSelector")).getAttr("src");
						$img.addClass("auto");
					}
					$img.unbind("load").load(function() {
						$img.delAttr("src");
						if (isAuto) 
						{
							if (this.naturalWidth > this.naturalHeight && isAuto) 
							{
								$img.addClass("height");
								$img.css("marginLeft", (this.width / 2) * -1);
							}
							else 
							{
								$img.addClass("width");
								$img.css("marginTop", (this.height / 2) * -1);
							}
						}
						$img.addClass("loaded");
						me.loader($th, false);
					}).attr("src", imageLoaction);
				}
				$th.hover(function() {
					$(this).replaceClass("mouseOut", "mouseOn");
				}, function() {
					$(this).replaceClass("mouseOn", "mouseOut");
				})
			});
		}
		
		this.loader = function($box, showHide) {
			if (showHide == true) 
			{
				$box.find("div.loader").each(function() {
					$(this).stop().fadeIn(Opt.number("loaderFadeInDuration"));
				})
			}
			else 
			{
				$box.find("div.loader").each(function() {
					$(this).stop().stop().fadeOut(Opt.number("loaderFadeOutDuration"));
				})
			}
		}
		
		this.rePosImg = function(imgWidth, imgHeight) {
			var imgAnimCss = {};
			var $img = $(this);
			var $box = (this).parents(Opt.string("boxSelector"));
			var origWidth = $img.getData("width");
			var origHeight = $img.getData("height");
			var $ImgWrapper = $img.parents(".o-big-image-wrapper");
			var wrapperWidth = $ImgWrapper.getData("initWidth")
			var wrapperHeight = $ImgWrapper.getData("initHeight");
			$ImgWrapper.width(wrapperWidth);
			$ImgWrapper.height(wrapperHeight);
			var useRatio = true;
			if (useRatio == true) 
			{
				if (origHeight < wrapperHeight) 
				{
					imgAnimCss.marginTop = (wrapperHeight - origHeight) / 2;
				}
				if (origWidth < wrapperWidth) 
				{
					imgAnimCss.marginLeft = (wrapperWidth - origWidth) / 2;
				}
				if (origWidth > wrapperWidth) 
				{
					var newSize = Utils.calcNewImageSize(origWidth, origHeight, wrapperWidth, "auto");
					imgAnimCss.width = wrapperWidth;
					imgAnimCss.height = "auto";
					//if ($img.getAttr("zoom") || $img.getAttr("zoom") == "true" || $img.getAttr("zoom") == "1")
					//{
						me.toolbarFeatures($box, "zoom", true);						
					//}
					if (newSize.h > wrapperHeight) 
					{
						imgAnimCss.marginTop = ((wrapperHeight - newSize.h) / 2).toNegative();
					}
					else 
					{
						imgAnimCss.marginTop = (wrapperHeight - newSize.h) / 2;
					}
				}
			}
			else 
			{
				if (imgWidth > wrapperWidth) 
				{
					var newSize = Utils.calcNewImageSize(imgWidth, imgHeight, (wrapperWidth - (wrapperHeight - imgHeight) * 2), "auto");
					imgWidth = newSize.w;
					imgHeight = newSize.h;
					animCss.width = imgWidth;
					animCss.height = imgHeight;
				}
				animCss.marginLeft = (wrapperWidth - imgWidth) / 2;
				animCss.marginTop = (wrapperHeight - imgHeight) / 2;
			}
			$img.css(imgAnimCss)
		}
		
		this.constructToolbar = function($box) {
			var $toolbar = $box.find(Opt.string("toolbarSelector"));
			var $bigImageWrapper = $box.find(".o-big-image-wrapper");
			if ($toolbar.size() <= 0) 
			{
				var linkLink = "javascript:link";
				var $PreactiveBigImage = $box.find(Opt.string("bigImageSelector"));
				var linkTarget = "";
				if ($PreactiveBigImage.getAttr("link-target"))
				{
					linkTarget = ' target="'+$PreactiveBigImage.getAttr("link-target")+'" ';
				}
				if ($PreactiveBigImage.getAttr("link")) 
				{
					linkLink = $PreactiveBigImage.getAttr("link");
				}
				$bigImageWrapper.append('<ul class="o-toolbar"><li class="o-ti o-zoomIn"><a href="javascript:zoom"><span>Zoom</span></a></li><li class="o-ti o-zoomOut"><a href="javascript:zoom"><span>Zoom out</span></a></li><li class="o-ti o-detailsIn"><a href="javascript:enlarge"><span>Open details</span></a></li><li class="o-ti o-detailsOut"><a href="javascript:enlarge"><span>Close details</span></a></li><li class="o-link"><a '+linkTarget+' href="' + linkLink + '"><span>Link</span></a></li></ul>');
				$box.find(Opt.string("toolbarSelector") + " li.o-ti a").click(function() {
					return me.anchorClick($(this), $box)
				})
			}
		}
		
		this.toolbarFeatures = function($box, feature, onOff) {
			me.constructToolbar($box);
			var $toolbar = $box.find(Opt.string("toolbarSelector"));
			if (onOff == "hide") 
			{
				$toolbar.find("li.o-" + feature + "In").hide();
				$toolbar.find("li.o-" + feature + "Out").hide();
			}
			else if (onOff == true) 
			{
				if (feature == "link") 
				{
					$toolbar.find("li.o-" + feature).show();
				}
				else 
				{
					$toolbar.find("li.o-" + feature + "In").show();
					$toolbar.find("li.o-" + feature + "Out").hide();
				}
			}
			else 
			{
				if (feature == "link") 
				{
					$toolbar.find("li.o-" + feature).show();
				}
				else 
				{
					$toolbar.find("li.o-" + feature + "In").hide();
					$toolbar.find("li.o-" + feature + "Out").show();
				}
			}
		}
		
		this.fillTiles = function(onlyFiltered, resetPositionData) {
			if ($Wrapper.hasClass("inMotion")) 
			{
				return false;
			}
			
			$Wrapper.addClass("inMotion");
			maxBottom = 0;
			var lTop = 0;
			var lLeft = 0;
			var i = 0;
			var innerWidth = $Inner.innerWidth();
			var activeLeft = 0;
			var activeRight = 0;
			var activeTop = 0;
			var activeBottom = 0;
			var activeCount = $Boxes.filter(".preactive,.doEnlarge,.doReduce").size();
			var maxDelay = Opt.number("maxDelay");
			if (maxDelay == 0) 
			{
				maxDelay = 999999999;
			}
			var delay = Opt.number("delayStart");
			me.resetBoxes();
			
			var fillThumbTiles = function($tmpBoxes, d) {
				var filterOutLeft = true;
				$tmpBoxes.addClass("moving");
				for (var i = 0; i < $tmpBoxes.length; i++) 
				{
				
					var $th = $($tmpBoxes[i]);
					if (!$th.hasFilter(activeFilterName)) 
					{
						$th.addClass("filterOut");
					}
					else 
					{
						$th.removeClass("filtered");
					}
					if ((!$th.hasClass("preactive") && !$th.hasClass("doEnlarge") && !$th.hasClass("doReduce")) || $th.hasClass("filterOut")) 
					{
						var animCss = 
						{
							width: boxSize,
							height: boxSize
						};
						var animConfig = {}
						if ($th.hasClass("filterOut") || $th.hasClass("filtered") || $th.hasClass("o-hidden")) 
						{
							if (!$th.hasClass("filtered")) 
							{
								if (filterOutLeft == true) 
								{
									animCss.left = (boxSize * 2).toNegative();
									filterOutLeft = false;
								}
								else 
								{
									animCss.left = (innerWidth + boxSize) * 2;
									filterOutLeft = true;
								}
								animCss.top = boxSize.toNegative();
								$th.addClass("filtered");
							}
						}
						else 
						{
							animCss.left = lLeft;
							animCss.top = lTop;
							
							var newRight = lLeft + boxSize;
							if (newRight > innerWidth) 
							{
								lTop += boxSize;
								lLeft = 0;
							}
							
							newRight = lLeft + boxSize;
							newBottom = lTop + boxSize;
							if (activeCount > 0) 
							{
								var con = true;
								while (con) 
								{
									if ((Is.between(lLeft, activeLeft, (activeRight - 1)) && Is.between(lTop, activeTop, (activeBottom - 1))) ||
									(Is.between((newRight - 1), activeLeft, (activeRight - 1)) && Is.between((newBottom - 1), activeTop, (activeBottom - 1)))) 
									{
										lLeft = activeRight;
										var newRight = lLeft + boxSize;
										if (newRight > innerWidth) 
										{
											lTop += boxSize;
											lLeft = 0;
											con = true;
										}
										else 
										{
											con = false;
										}
									}
									else 
									{
										con = false;
									}
								}
							}
							var newRight = lLeft + boxSize;
							if (newRight > innerWidth) 
							{
								lTop += boxSize;
								lLeft = 0;
							}
							
							animCss.left = lLeft;
							animCss.top = lTop;
							lLeft += boxSize;
							
							maxBottom = Math.max(maxBottom, (lTop + boxSize));
						}
						
						if ($th.hasClass("preDeActive") || $th.hasClass("active")) 
						{
							animConfig.duration = boxCloseDuration;
							animConfig.easing = boxCloseEasing;
						}
						else 
						{
							animConfig.duration = boxMovementDuration;
							animConfig.easing = boxPositionEasing;
						}
						
						animConfig.complete = function() {
							var $th = $(this);
							if ($th.hasClass("active") || $th.hasClass("o-load-more") || $th.hasClass("preDeActive")) 
							{
								me.loader($th, false);
							}
							$th.removeClass("preDeActive active moving");
							if ($th.hasClass("last")) 
							{
								me.afterLastAnimation();
							}
						}
						
						var LastAnimCss = $th.getData("LastAnimCss");
						if (resetPositionData == true) 
						{
							$th.setData("positionData", 
							{
								left: animCss.left,
								top: animCss.top
							});
						}
						
						//close extra info
						var $extraInfo = $th.find(Opt.string("extraInfoSelector"));
						$extraInfo.slideUp(
						{
							duration: Opt.number("extraInfoCloseDuration"),
							easing: Opt.number("extraInfoCloseEasing")
						});
						
						if ($th.hasClass("o-hidden")) 
						{
							$th.css(animCss);
							animConfig.complete.eBind($th)();
						}
						else 
						{
							var isChanged = true;
							if (LastAnimCss && LastAnimCss.left == animCss.left && LastAnimCss.top == animCss.top && LastAnimCss.height == animCss.height && LastAnimCss.width == animCss.width) 
							{
								isChanged = false;
							}
							
							if (isChanged == true) 
							{
								if (userCSS3Accelerate && $.support.transition) 
								{
									$th.css.eBind($th, [animCss]).delay(delay);
									animConfig.complete.eBind($th).delay((delay + animConfig.duration));
								}
								else 
								{
									animConfig.queue = false;
									$th.delay(delay).animate(animCss, animConfig);
								}
								if (delay < maxDelay) 
								{
									delay += delayIncrease;
								}
							}
							else 
							{
								animConfig.complete.eBind($th)();
							}
						}
						$th.setData("LastAnimCss", animCss);
					}
					else 
					{
						$th.removeClass("activated moving");
					}
				}
			}
			
			
			$Boxes.removeClass("filterOut");
			var tmpBoxesFilterString = ".filtered,.filterOut";
			var $loadMore = $Boxes.filter(".o-load-more");
			$Boxes.removeClass("last");
			var $tmpBoxes = (onlyFiltered) ? $Boxes.not(".filtered,.filterOut") : $Boxes;
			if ($loadMore.size() > 0) 
			{
				if ($loadMore.is(":visible")) 
				{
					$loadMore.addClass("last");
				}
				else 
				{
					$loadMore.prev().addClass("last");
				}
			}
			else 
			{
				$tmpBoxes.last().addClass("last");
			}
			
			var $Preactive = $tmpBoxes.filter(".preactive,.doEnlarge,.doReduce");
			if ($Preactive.size() > 0) 
			{
				var $PreactiveBigImage = $Preactive.find(Opt.string("bigImageSelector"));
				if ($PreactiveBigImage.getAttr("link")) 
				{
					me.toolbarFeatures($Preactive, "link", true);
				}
				var enlarge = false;
				
				if ($Preactive.hasClass("doEnlarge") || ($Preactive.getAttr("open-all") && !$Preactive.hasClass("doReduce"))) 
				{
					enlarge = true;
				}
				
				$Preactive.addClass("opening");
				var animCss = {};
				var animConfig = 
				{
					duration: boxOpenDuration
				}
				var newWidth = boxSize * 4;
				var newHeight = boxSize * 2;
				$Preactive.find(".o-big-image-wrapper").setData("initHeight", newHeight).setData("initWidth", newWidth);
				var $extraInfo = $Preactive.find(Opt.string("extraInfoSelector"));
				if ($extraInfo.size() > 0) 
				{
					me.toolbarFeatures($Preactive, "details", true);
				}
				if (enlarge) 
				{
					$Preactive.addClass("enlarged");
					if ($extraInfo.size() > 0) 
					{
						$extraInfo.width(newWidth);
						var initHeight = $extraInfo.getData("initHeight");
						if (!initHeight) 
						{
							initHeight = $extraInfo.outerHeight(true);
							$extraInfo.setData("initHeight", initHeight)
						}
						newHeight += initHeight;
						$extraInfo.slideDown(
						{
							duration: Opt.number("extraInfoOpenDuration"),
							easing: Opt.number("extraInfoOpenEasing"),
							complete: function() {
								var $box = $(this);
								me.toolbarFeatures($box.parents(Opt.string("boxSelector")), "details", false);
							}
						});
					}
				}
				else 
				{
					$extraInfo.slideUp(
					{
						duration: Opt.number("extraInfoCloseDuration"),
						easing: Opt.number("extraInfoCloseEasing"),
						complete: function() {
							var $box = $(this);
							me.toolbarFeatures($box.parents(Opt.string("boxSelector")), "details", true);
							if (typeof me.reduceCallBack == 'function') 
							{
								me.reduceCallBack();
								me.reduceCallBack = false;
							}
						}
					});
				}
				if (newWidth > innerWidth) 
				{
					newWidth = innerWidth;
				}
				
				animCss.width = newWidth;
				animCss.height = newHeight;
				
				
				var PosData = $Preactive.getData("positionData");
				if (PosData !== false) 
				{
					animCss.left = PosData.left;
					animCss.top = PosData.top;
				}
				else 
				{
					var thPos = $Preactive.position();
					animCss.left = thPos.left;
					animCss.top = thPos.top;
				}
				var newRight = animCss.left + newWidth;
				var newBottom = animCss.top + newHeight;
				if (newRight > innerWidth) 
				{
					var c = innerWidth - newWidth;
					if (c < boxSize) 
					{
						c = 0;
					}
					animCss.left = c;
					if (animCss.left < 0) 
					{
						animCss.left = 0;
					}
				}
				
				activeLeft = animCss.left;
				activeRight = activeLeft + newWidth;
				activeTop = animCss.top;
				activeBottom = activeTop + newHeight;
				
				
				
				maxBottom = Math.max(maxBottom, activeBottom);
				
				if (Opt.bool("scrollingAid")) 
				{
					var scrollTop = $(window).scrollTop();
					var innerOffset = $Inner.offset();
					
					var viewPortBottom = $(window).height() + scrollTop;
					var actualBottom = innerOffset.top + activeBottom;
					var actualTop = innerOffset.top + activeTop - Opt.number("scrollingOffset")
					
					if (actualTop < scrollTop && actualBottom > viewPortBottom) 
					{
						$('html, body').animate(
						{
							scrollTop: scrollTop - (scrollTop - actualTop)
						}, 300);
					}
					if (actualTop < scrollTop && actualBottom < viewPortBottom) 
					{
						$('html, body').animate(
						{
							scrollTop: actualTop - (newHeight / 2)
						}, 300);
					}
				}
				
				animConfig.complete = function() {
					var $box = $(this);
					var $img = $box.find(Opt.string("bigImageSelector"));
					if ($img.getAttr("src")) 
					{
						var imageLoaction = $img.getAttr("src");
						$img.unbind("load").load(function() {
							$img.setData("width", this.naturalWidth);
							$img.setData("height", this.naturalHeight);
							me.rePosImg.call($img, this.naturalWidth, this.naturalHeight);
							$box.replaceClass("preactive", "active");
							$img.delAttr("src");
							me.loader($box, false);
						}).attr("src", imageLoaction);
					}
					else 
					{
						me.rePosImg.call($img, $img.getData("width"), $img.getData("height"));
						$box.replaceClass("preactive", "active");
						me.loader($box, false);
					}
					$box.removeClass("opening").removeClass("enlarged");
					if (!enlarge) 
					{
						$box.replaceClass("doEnlarge", "doReduce");
					}
					if ($box.hasClass("last")) 
					{
						me.afterLastAnimation();
					}
				}
				
				animConfig.easing = boxOpenEasing;
				
				if (userCSS3Accelerate && $.support.transition) 
				{
					$Preactive.css.eBind($Preactive, [animCss]).delay(delay);
					animConfig.complete.eBind($Preactive).delay((delay + animConfig.duration));
				}
				else 
				{
					animConfig.queue = false;
					$Preactive.delay(delay).animate(animCss, animConfig);
				}
				
				if (!$Preactive.hasFilter(activeFilterName)) 
				{
					$Preactive.addClass("filterOut");
				}
				if (delay < maxDelay) 
				{
					delay += Opt.number("delayIncrease");
				}
				fillThumbTiles($Preactive.prevAll().reverse());
				delay = 0;
				fillThumbTiles($Preactive.nextAll(), true);
				$Preactive.setData("LastAnimCss", animCss);
				$Preactive = false;
			}
			else 
			{
				fillThumbTiles($tmpBoxes);
			}
			
			me.fixPortSize(false);
		}
		
		this.loadMore = function() {
			var loadMoreNr = Opt.number("loadMore");
			if (!loadMoreNr) 
			{
				loadMoreNr = 1;
			}
			var loadMoreThumbs = $Boxes.filter(".o-hidden").slice(0, loadMoreNr).removeClass("o-hidden");
			$Inner.append($Boxes.filter(".o-load-more"))
			me.fillTiles(false, true);
		}
		
		this.afterLastAnimation = function() {
			$Wrapper.removeClass("inMotion");
			window.setTimeout(me.loadThumbs, 100);
			me.fixPortSize(true);
			if ($Boxes.filter(".o-hidden").size() <= 0) 
			{
				$Boxes.filter(".o-load-more").hide();
			}
		}
		
		this.fixPortSize = function(calledInAnimationComplete) {
			var innerBottom = $Inner.position().top + $Inner.innerHeight();
			if (maxBottom > innerBottom) 
			{
				var animHeight = "+=" + (maxBottom - innerBottom);
			}
			else 
			{
				var animHeight = "-=" + (innerBottom - maxBottom);
				
			}
			if (calledInAnimationComplete == false && currentButtom > maxBottom) 
			{
				return false;
			}
			$Inner.stop().animate(
			{
				"height": animHeight
			}, "fast");
			currentButtom = maxBottom;
		}
		
	}
})(jQuery);
