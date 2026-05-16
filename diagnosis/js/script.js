$(function () {
    var wow = new WOW(
		{
			boxClass: 'wow', // default
			animateClass: 'animated', // default
			offset: 0, // アニメーションをスタートさせる距離
			delay: '0.2s',
			duration: '0.8s',
			mobile: true,
			live: true,
			callback: function (box) {
				box.classList.add('wow-finished')
			},
		}
	);
	wow.init();
	$('a[href^="#"]').click(function() {
		var speed = 800;
		var adjust = $('#siteHeader').height();
		var href= $(this).attr("href");
		var target = $(href == "#" || href == "" ? 'html' : href);
		var position = target.offset().top - adjust;
		$('body,html').animate({scrollTop:position}, speed, 'swing');
		return false;
	});
});