require('../scss/main.scss');
require('./resizer.js');
require('./charts/sankey-chart.js');
require('./sponsor-table.js');

$('.scroll-to').click(function(e) {
	let isMobile = $(window).width() < 768;
	if (isMobile) {
		var offset = $('.list-helper-text').offset().top;
	} else {
		var offset = $('.sankey-helper-text').offset().top;
	}
	$('html, body').animate({
        scrollTop: offset
    }, 2000);
});

window.$('.icon-facebook').click((e) => {
  e.preventDefault();
  const uri = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${uri}`);
});

window.$('.icon-twitter').click((e) => {
  e.preventDefault();
  const uri = window.location.href;
  const status = encodeURIComponent(`${window.tweetText} ${uri}`);
  window.open(`https://twitter.com/home?status=${status}`);
});

