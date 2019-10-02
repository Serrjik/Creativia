$(document).ready(function(){
	// Кнопка меню "Гамбургер"
	const hamburger = $('.hamburger')
	// Блок мобильной навигации
	const navigationMobile = $('.navigation--mobile')

	// Изменение вида кнопки меню "Гамбургер" по клику
	hamburger.click(function(){
		$(this).toggleClass('hamburger--is-active');

		if ( $(this).hasClass('hamburger--is-active') ) {
			navigationMobile.show()
		} else {
			navigationMobile.hide()
		}
	})

	// Закрыть мобильную навигацию при клике по ссылке
	$('.navigation__item--mobile').on('click', function(){
		hamburger.removeClass('hamburger--is-active');
		navigationMobile.hide()

	})

	// Фон для кнопки "Гамбургер" вверху страницы при скролле и сдвиг кнопки
	$( window ).scroll(function() {
		if ($(this).scrollTop() > 13) {
			$('.hamburger__bg').show()
			$('.hamburger').addClass('hamburger--scroll')
		} else {
			$('.hamburger__bg').hide()
			$('.hamburger').removeClass('hamburger--scroll')
		}
	})

	//slide2id - плавная прокрутка по ссылкам внутри страницы
	$(".logo,.navigation__link,a[href='#top'],a[rel='m_PageScroll2id'],a.PageScroll2id,a.mouse_scroll").mPageScroll2id({
	    highlightSelector:"nav a",
	    offset:55
	});

	// слайдер шапки
	const headerSlider = $('#headerSlider')
	
	// Инициализация плагина OwlCarousel для слайдера шапки
	headerSlider.owlCarousel({
		loop: true,
		items: 1,
		smartSpeed: 2000,
		autoplay: true,
		autoplayTimeout: 30000
	})

	// Повесить события для прокрутки слайдов в шапке на кастомные кнопки
	// Go to the next item
	$('#headerSliderRight').click(function() {
	    headerSlider.trigger('next.owl.carousel')
	})
	// Go to the previous item
	$('#headerSliderLeft').click(function() {
	    headerSlider.trigger('prev.owl.carousel')
	})

	// Аккордеон
	Array.from(document.querySelectorAll('.accordion__item')).forEach(function(e, i) {
	    e.addEventListener("click", function (){
	    	$(e).siblings().removeClass('accordion__item--active')
	    	$(e).addClass('accordion__item--active')
	    })
	})

	// MixItUp - фильтрация работ в портфолио
	$('#portfolio-projects').mixItUp()
	$('.portfolio__category').on('click', function(){
		$('.portfolio__category').removeClass('portfolio__category--active')
		$(this).addClass('portfolio__category--active')
	})

	// слайдер отзывов в блоке клиентов
	const clientsReviewsSlider = $('#clientsReviewsSlider')
	
	// Инициализация плагина OwlCarousel для слайдера отзывов в блоке клиентов
	clientsReviewsSlider.owlCarousel({
		loop: true,
		items: 1,
		smartSpeed: 2000,
		autoplay: true,
		autoplayTimeout: 30000
	})

})
