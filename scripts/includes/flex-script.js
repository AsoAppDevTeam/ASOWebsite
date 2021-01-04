// jQuery
(function($) {
  "use strict";
	$(document).ready(function() {
		// Main Slider
		$('.main-flexslider').flexslider({
			directionNav: true, 
			controlNav: false, 
			animation: "fade",
			slideshowSpeed: 7000,
			prevText: "",
			nextText: "",
		});

		// Styling Select elements
		Select.init({selector: '.elselect'});

		// Agents slider
		$(".owl-carousel").owlCarousel({
			items : 2,
			navigation : true,
			pagination : false,
			navigationText : ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
		});

		//Tab
		$('#myTab a').click(function (e) {
		  e.preventDefault()
		  $(this).tab('show');
		})

		// Property-Details page slider
		 $('#details-carousel').flexslider({
		    animation: "slide",
		    controlNav: false,
		    animationLoop: false,
		    slideshow: false,
		    itemWidth: 142,
		    itemMargin: 0,
		    prevText: "",
			nextText: "",
		    asNavFor: '#details-slider'
		  });
		   
		  $('#details-slider').flexslider({
		    animation: "slide",
		    controlNav: false,
		    animationLoop: false,
		    slideshow: false,
		    sync: "#details-carousel",
			directionNav: false 
		  });
		  
		  $('#details-carousel2').flexslider({
		    animation: "slide",
		    controlNav: false,
		    animationLoop: false,
		    slideshow: false,
		    itemWidth: 142,
		    itemMargin: 0,
		    prevText: "",
			nextText: "",
		    asNavFor: '#details-slider2'
		  });
		   
		  $('#details-slider2').flexslider({
		    animation: "slide",
		    controlNav: false,
		    animationLoop: false,
		    slideshow: false,
		    sync: "#details-carousel2",
			directionNav: false 
		  });
		  
		  $('#details-carousel3').flexslider({
		    animation: "slide",
		    controlNav: false,
		    animationLoop: false,
		    slideshow: false,
		    itemWidth: 142,
		    itemMargin: 0,
		    prevText: "",
			nextText: "",
		    asNavFor: '#details-slider3'
		  });
		   
		  $('#details-slider3').flexslider({
		    animation: "slide",
		    controlNav: false,
		    animationLoop: false,
		    slideshow: false,
		    sync: "#details-carousel3",
			directionNav: false 
		  });
		  
		  $('#details-carousel4').flexslider({
		    animation: "slide",
		    controlNav: false,
		    animationLoop: true,
		    slideshow: true,
		    itemWidth: 142,
		    itemMargin: 0,
		    prevText: "",
			nextText: "",
		    asNavFor: '#details-slider4'
		  });
		   
		  $('#details-slider4').flexslider({
		    animation: "slide",
		    controlNav: false,
		    animationLoop: true,
		    slideshow: true,
		    prevText: "",
			nextText: "",
		    sync: "#details-carousel4",
			directionNav: false 
		  });
	});
})(jQuery);