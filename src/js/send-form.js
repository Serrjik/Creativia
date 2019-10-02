$(document).ready(function() {

	// jQuery Validate JS
	$("#form").validate({
		rules: {
			name: { required: true },
			email: { required: true, email: true },
			subject: { required: true },
			// skype:  { required: true },
			// phone:  { required: true },
			message: { required: true }
		},

		messages: {
			name: "Please enter your name",
			email: {
				required: "Please enter your email",
				email: "Email address should be in the format name@domain.com. Perhaps you entered an email with an error."
			},
			subject: "Please enter a subject for the message.",
			message: "Please enter a message"
		},

		submitHandler: function(form) {
		  ajaxFormSubmit();
		}

	})

	// Функция AJAX запроса на сервер
	function ajaxFormSubmit(){
		var string = $("#form").serialize(); // Сохраняем данные введенные в форму в строку. 

		// Формируем ajax запрос
		$.ajax({
			type: "POST", // Тип запроса - POST
			url: "http://serjik.zzz.com.ua/portfolio/php/mail.php", // Куда отправляем запрос
			data: string, // Какие даные отправляем, в данном случае отправляем переменную string
			
			// Функция если все прошло успешно
			success: function(html){
				$("#form").slideUp(800);
				$('#answer').html(html);
			}
		});

		// Чтобы по Submit больше ничего не выполнялось - делаем возврат false чтобы прервать цепочку срабатывания остальных функций
		return false; 
	}

});