
jQuery.easing.easeInExpo = function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	};
 jQuery.easing.easeOutExpo = function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	};
 
var Slider = {
    	lastSlide: new Date().valueOf() - 4000,
        interval: 5000,
        speed: 1000,
        easingOut: "easeOutExpo",
        easingIn: "easeInExpo",
        allowAutoSlide: true,
        selector: "#slideShow",
        btnBar: "#buttons",
        buttons: {},
        
        Init: function() {
            var $this = $(Slider.selector);
            
            $this.hover(function() {
                Slider.allowAutoSlide = false;
            }, function() {
                Slider.allowAutoSlide = true;
            });
            
            $this.children(":first-child").addClass("active");
            if($this.children(".active").is(":last-child")) $this.children(":first-child").addClass("next");
            else $this.children(".active").next().addClass("next");
            
            Slider.BuildButtons();
            
            if(Slider.interval) {
                setInterval("Slider.slideAuto();", 500);
            }
        },
        setActiveBtn: function(id) {
            var $btnBar = $(Slider.btnBar);
            $btnBar.children(".active").removeClass("active");
            $(Slider.buttons[id]).addClass("active");
        },
        NextSlide: function() {
            $("#backShadowContainer").fadeIn("slow");
            $("#frontShadowContainer").fadeIn("slow",function(){
                var $this = $(Slider.selector);
                $this.children(".active").animate({top: "315px"},Slider.speed,Slider.easingIn,function(){
                    Slider.setActiveBtn($this.children(".next").attr('id'));
                    $this.children(".next").animate({top: "0px"},Slider.speed,Slider.easingOut,function(){
                         $(this).removeClass("next");
                         $("#backShadowContainer").fadeOut("slow");
                         $("#frontShadowContainer").fadeOut("slow");
                         
                         $(this).addClass("active");
                         
                         if($this.children(".active").is(":last-child")) $this.children(":first-child").addClass("next");
                         else $this.children(".active").next().addClass("next");
                         
                         Slider.lastSlide = new Date().valueOf();
                    });
                }).removeClass("active");
            });  
        },
        SlideTo: function(id)
        {
            var $this = $(Slider.selector);
            if($this.children(".next").is(":animated")) {
                $this.children(":animated").stop();
                $this.children(".next").addClass("active");
            }
            $this.children(".next").removeClass("next");
            $this.children("#"+id).addClass("next");
            
            Slider.NextSlide();
            
        },  
        BuildButtons: function()
        {
            var $btnBar = $(Slider.btnBar);
            var $this = $(Slider.selector);
            var i =0;
            $this.children("li").each(function() {
                i++;
                var curr = $(this);
                var li = document.createElement("li");
                if(curr.is('.active')) $(li).addClass('active');
                $btnBar.append(li);
                $(li).click(function() {
                    if(!$(this).is('.active'))
                        Slider.SlideTo(curr.attr('id'));
                });
                Slider.buttons[$(this).attr('id')] = li;
            });
            $btnBar.css('width', (i * 14)+'px').fadeIn("fast");
        }, 
        slideAuto: function() {
    		var n = new Date().valueOf();
            if((n-Slider.lastSlide) > Slider.interval && Slider.allowAutoSlide) {
                Slider.NextSlide();
            }
    		else if(!Slider.allowAutoSlide) {
    			Slider.lastSlide = new Date().valueOf();
    		}
        }
    }