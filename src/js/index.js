let $ = require('jquery');

$(document).ready(function() {
	$('#top-menu a').click(function(e) {
		e.preventDefault();

		var id = $(e.target).attr("href");
		if (!id) {
			id = $(e.target).find("[href]").attr("href");
		}

		$("html, body").animate({scrollTop: $("#"+id.slice(1)).offset().top}, 800);

		return false;
	});	
})
