//make sure there is an appropriate indexOf function for an array, since IE including ver 8 doesn't include it
if (!Array.prototype.indexOf) {

Array.prototype.indexOf = function(obj, start) {
     for (var i = (start || 0), j = this.length; i < j; i++) {
         if (this[i] === obj) { return i; }
     }
     return -1;
}

}

//accordionmenu
(function($){
    //Attach this new method to jQuery
    $.fn.extend({
        accordion: function(options) {
			if ((typeof(this['_init_']) != 'undefined') && (this['_init_'] != null)) 
				if (this._init_)
					return this;
		
			this._init_=false;
			
            var defaults = {
				'effect': 'slide',
				'collapse':'open,all',
				'speed' : 'slow',
				'usetag': false,
            };
             			
            this.settings = $.extend(defaults, options);
			this.settings.collapse=this.settings.collapse.split(',').slice(0);
			this.totalItems=0;			
			this.currentTrail=new Array();
			
			var that=this;
            
			this._init = function() {
				//cleanup any issues in case of user error
				$(that).find('.collapsed').removeClass('expanded').removeClass('inactive').removeClass('active');
				$(that).find('.expanded').removeClass('collapsed').removeClass('inactive').removeClass('active');
				
				//number all menu items
				$(that).find('div.slice').each(function() {
					$(this).attr('data-accordianMenuID', that.totalItems++);
					var c=$(this).hasClass('expanded') ? 'expanded' : ($(this).hasClass('collapsed') ? 'collapsed' : '');
					if (c == '')
						$(this).addClass('collapsed');
											
										
					$(this).find('div.content').hide();
					$(this).find('.title').each(function() {						
						$(this).click(function(e) {
							e.preventDefault();
							var obj=this;
							var p=$(this).parent();
									
							var s=that.settings;							
							s.ignore=that.currentTrail.slice(0);
							var t='';
							$(p).each(function() {
								s.ignore.push($(this).attr('data-accordianMenuID'));
								t = t  + ',' + $(this).attr('data-accordianMenuID');
							});

							
							that.collapseAll(s);
							that.toggleMenu(that.settings, p);						
							return false;
						});		
					});
				});
				
				if (this.settings.usetag !== false) {
					var tag=document.URL.split('#')[1];
					if (tag == undefined) url = '';
					if (tag != '') {
						if (tag.indexOf(this.settings.usetag) == 0) {
							this.openTag(tag);
						}
					}					
				}

				that._init_=true;
			}
						
			this.openTag = function (tagname) {
				var el=$(that).find('.slice[id="' + tagname +'"]');
				//alert('.slice[id="' + tagname + '"]');
				this.toggleMenu(that.settings, el);
			};
						
			this.collapseAll = function(config) {
				$(that).find('.slice.expanded').each(function() {
					var ignore=(typeof(config['ignore']) != 'undefined') ? config.ignore : '';
					var id=$(this).attr('data-accordianMenuID');

					if (ignore.indexOf(id) == -1)
						that.toggleMenu(config, this);
				});
			}
			
			this.toggleMenu = function (settings, obj) {
				var menu=$(obj).find('div.content');
				var c=$(obj).hasClass('expanded') ? 'expanded' : ($(obj).hasClass('collapsed') ? 'collapsed' : '');
				var v='';
				var h='';
				
				if (c == 'expanded') {
					$(obj).removeClass('expanded').addClass('collapsed').addClass('inactive');
					v='none';
					h='hide';
				} else if (c == 'collapsed') {
					$(obj).removeClass('collapsed').addClass('expanded').addClass('active');
					v='block';
					h='show';
				}
				
				$(obj).parent().find('div.slice.collapsed').removeClass('active').addClass('inactive');
				$(obj).parent().find('div.slice.expanded').removeClass('inactive').addClass('active');
				
				var slices=0;
				var inactive=0;
				$(obj).parent().find('div.slice').each(function() {
					slices++;
					if ($(this).hasClass('inactive'))
						inactive++;
				});
				
				if (inactive == slices)
					$(obj).parent().find('div.slice').removeClass('inactive').removeClass('active');
				
				$(menu).animate({'height': h, 'opacity': h}, that.settings.speed, that.settings.effect);
			}

			this._init();
        }
    });
})(jQuery);
