window.addEventListener('DOMContentLoaded', () => {
    var form = document.querySelector('form')

    form.addEventListener('submit', (e) => {
        e.preventDefault() 

        var html = ''

        var name = $('#firstName').val()
        var phone = $('#phone').val()
        var email = $('#email').val()
        var bday = $('#bday').val()
        var pass = $('#password').val()

        if(validation.passwordValidator(pass) && validation.dateValidator(bday) && validation.emailValidator(email)) {
            
            // If error message is on, turn it off
            if($('.errorMessage').is(':visible')) {
                $('.errorMessage').hide()
            }

            // Sending POST request to our server with client's data
            $.ajax({
                url: '/registration',
                type: 'POST',
                data: {
                    'name': name, 'bday': bday, 'phone': phone, 'pass': pass, 'email': email
                },
                success: (data) => {

                    // waiting for response
                    // 0 - password, date or email doesnt match the given pattern
                    // 1 - success
                    // 2 - fail
                    // 3 - already registered email

                    console.log(data.code)

                    if(data.code === 1) {
                        window.location.assign('/createFamily')
                    }
                    
                }
            })

        } else {

            if(!validation.passwordValidator(pass)) {
                html += '<li>Вашата парола трабва да съдържа една главна, една малка буква,\
                        едно число и да е поне 10 символа.</li>'
            }

            // if(!phoneValidator(phone)) {
            //     html += '<li>Телефонният номер трябва да\
            //             е с +359 и още 9 цифри.</li>'
            // }

            if(!validation.dateValidator(bday)) {
                html += '<li>Датата на раждане трябва да отговаря на\
                        следния формат ден/месец/година, където ако едноцифрено число слагате 0\
                        пред него.</li>'
            }

            if(!validation.emailValidator(email)) {
                html += '<li>Вашият имейл не отговаря на международните изисквания.</li>'
            }

            // Showing error message
            $('.errorMessage').html('<h3>Срещнахме проблем! Проверете данните си за дадените изисквания!</h3><ul></ul>')
            $('.errorMessage ul').html(html)
            $('.errorMessage').show()

        }

    })
})