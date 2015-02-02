(function($) {
	var showSection = function(section) {
		var hash = section || window.location.hash;
		if(hash !== 'undefined')
		{
			$(hash).fadeIn();
		}
	};
	showSection();

	var sections = $('section:not(#warning)');
	$('nav a').click(function(e){
		e.preventDefault();
		var section = $(this).attr('href');
		if($(section).is(':visible')) {
			sections.fadeOut(400);
		} else {
			sections.hide();
			showSection(section);
		}
		//sections.fadeOut(400,function(){
		//	showSection(section);
		//});
	});

	$('h1').css('cursor','pointer').click(function(){
		sections.fadeOut(400);
	});
})(jQuery);