ymaps.ready(function(){
	// Указывается идентификатор HTML-элемента.
	var egyptMap = new ymaps.Map("egypt-map", {
		center: [26.86, 32.42],// [широта, долгота] — используется по умолчанию;
		zoom: 7.2,
		controls: []
	});

	egyptMap.behaviors.disable('scrollZoom');
});
