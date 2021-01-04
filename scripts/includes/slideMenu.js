function trim (str) {
	if ((typeof(str) != 'string') || (str == null)) return '';
	var	str = str.replace(/^\s\s*/, ''),
		ws = /\s/,
		i = str.length;
	while (ws.test(str.charAt(--i)));
	return str.slice(0, i + 1);
}

//make sure there is an appropriate indexOf function for an array, since IE including ver 8 doesn't include it
if (!Array.prototype.indexOf) {

Array.prototype.indexOf = function(obj, start) {
     for (var i = (start || 0), j = this.length; i < j; i++) {
         if (this[i] === obj) { return i; }
     }
     return -1;
}

}

//slidemenu
(function($){
    //Attach this new method to jQuery
    $.fn.extend({
        slideMenu: function(options) {
			if ((typeof(this['_init_']) != 'undefined') && (this['_init_'] != null)) 
				if (this._init_)
					return this;
		
			this._init_=false;
			
            var defaults = {
				'animate': 'height',
				'event':'click',
				'effect': 'slide',
				'collapse':'open,all',
				'nocollapse': 'trail',
				'itemLink': true,
				'setTrail': true,
				'hoverTrail': false,
				'cookie': '',
				'speed' : 'slow',				
            };
             			
            this.settings = $.extend(defaults, options);
			this.settings.collapse=this.settings.collapse.split(',').slice(0);
			this.totalItems=0;			
			this.currentTrail=new Array();
			this.classSelector=$(this).attr('class');
			
			var that=this;
            
			this._init = function() {
				//cleanup any issues in case of user error
				$(that).find('.collapsed').removeClass('expanded');
				$(that).find('.expanded').removeClass('collapsed');				
								
				//setup any leaf nodes (those with child menus)
				$(that).find('ul').parent('li').each(function() {
					$(this).addClass('leaf');
				});
				
				//collapse those which don't have menus
				$(that).find('li:not(.leaf)').addClass('collapsed');
								
				//last ditch effort to cleanup anything wrong
				$(that).find('li:not(.leaf,.expanded,.collapsed)').removeClass('expanded').removeClass('collapsed').removeClass('leaf');
				
				//make sure all active trails have their parents also set to activetrail to complete the full trail
				if (that.settings.setTrail) {
					$(that).find('.activeTrail').parents('li:not(.activeTrail)').addClass('activeTrail');
				}
				
				//number all menu items
				var m=$(that).find('li').each(function() {
					$(this).attr('data-slideMenuID', that.totalItems++);					
				});

				$(that).find('li a').each(function() {
					//any that aren't set, are set to expanded since they would be expanded
					$(this).parent('li.leaf:not(.expanded,.collapsed)').addClass('expanded');
										
					switch (that.settings.event) {
						case 'hover':
							//setup a click handler
							if (that.settings.itemLink) {
								$(this).parent('li.leaf').hover(that.clickHandler, that.clickHandler);
							}
						break;
						default:
							//setup a click handler
							if (that.settings.itemLink) {
								$(this).parent('li.leaf').click(that.clickHandler);
							}					
							$(this).click(that.clickHandler);					
						break;
					}
				});

				//setup the current trail knowledge, so we dont have to do it again
				$(that).find('.leaf.expanded.activeTrail').each(function() {
					that.currentTrail.push($(this).attr('data-slideMenuID'));
				});
								
				if (that.settings.collapse.indexOf('open') != -1) {
					var ignore=new Array();
					if (that.settings.animate != 'width') {
						if (that.settings.nocollapse.indexOf('trail') != -1)
							ignore=that.currentTrail;
							
						if (that.settings.nocollapse.indexOf('expanded') != -1) {
							$(this).find('li.leaf:is(.expanded)').each(function() {
								var id=$(this).attr('data-slideMenuID');
								if (ignore.indexOf(id) != -1)
									ignore.push(id);
							});
						}						
					}
					
					that.collapseAll({ 'effect': 'none', 'nocollapse':that.settings.nocollapse, 'ignore':ignore, 'speed': 0 });
				}

				that._init_=true;
			}
			
			this.clickHandler=function(e) {
				e.preventDefault();
				var obj=this;
				var p='';
				
				if (that.settings.hoverTrail)
					that.removeHoverTrail();
				
				if ($(this).hasClass('leaf')) {
					obj=$(this).find('a:first');
					p=this;
				} else {
					p=$(this).parent('li');
					var l=$(this).attr('href');
					if ((l.length > 0) && (l != '#')) {
						window.location.href=l;
						return false;
					}
				}
									
				if (!$(p).hasClass('leaf')) {
					return false;
				} else {
					var s=that.settings;							
					s.ignore=that.currentTrail.slice(0);
					$(obj).parents('li').each(function() {
						s.ignore.push($(this).attr('data-slideMenuID'));
					});
					that.collapseAll(s);
					
					that.toggleMenu(that.settings, p);
					if (that.settings.hoverTrail)
						that.setHoverTrail(p);
				}

				
				return false;
			}
						
			this.collapseAll = function(config) {
				$(that).find('.leaf.expanded').each(function() {
					var ignore=(typeof(config['ignore']) != 'undefined') ? config.ignore : '';
					var id=$(this).attr('data-slideMenuID');

					if (ignore.indexOf(id) == -1)
						that.toggleMenu(config, this);
				});
			}
			
			this.setHoverTrail = function (li) {
				$(this).find('li.leaf.expanded').addClass('hover');
			}
			
			this.removeHoverTrail = function() {
				$(that.classSelector).find('li.leaf.hover').removeClass('hover');	
			}
			
			this.toggleMenu = function (settings, li) {
				//alert($(li).html());
				var menu=$(li).find('ul:first');
				var c=$(li).hasClass('expanded') ? 'expanded' : ($(li).hasClass('collapsed') ? 'collapsed' : '');
				var v='';
				var status='';
				
				if (c == 'expanded') {
					$(li).removeClass('expanded').removeClass('hover').addClass('collapsed');
					v='none';
					status='hide';
				} else if (c == 'collapsed') {
					$(li).removeClass('collapsed').addClass('expanded');
					v='block';
					status='show';
				}
				
				if (settings.effect == 'none') {
					if (status == 'hide') {
						$(menu).stop(true, true).hide();
					} else {
						$(menu).stop(true, true).show();
					}
				} else {
					switch (that.settings.animate) {
						case 'width':
							$(menu).stop(true, true).animate({'width': status, 'opacity': status}, that.settings.speed);
						break;
						default:
							$(menu).animate({'height': status, 'opacity': status}, that.settings.speed);
						break;					
					}
					//$(menu).slideToggle(settings.speed);
				}
			}

			this._init();
        }
    });
})(jQuery);
