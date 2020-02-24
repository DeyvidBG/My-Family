window.addEventListener('DOMContentLoaded', () => {
    var form = document.querySelector('form')

    form.addEventListener('submit', (e) => {
        e.preventDefault()

        var name = $('#familyName').val()

        // Sending POST request to our server with client's data
        $.ajax({
            url: '/createFamily/create',
            type: 'POST',
            data: {
                'name': name
            },
            success: (data) => {

                // waiting for response
                // 1 - success
                // 2 - fail

                if(data.code === 1) {
                    window.location.assign('/dashboard')
                } else {
                    // Do something
                }

            }
        })
    })

    $(".digit").keyup(function () {
        if (this.value.toString().length === this.maxLength) {
            $(this)
            .closest('.digits')
            .next('.digits')
            .find('input')
            .focus()
        }
    })

    $('.getIn').on('click', () => {
        var number = []

        $('.digit').map((index, element) => {
            number.push(element.value)
        })

        var sixDigitNumber = number.join('')

        $.ajax({
            url: '/createFamily/accessFamily',
            type: 'POST',
            data: {
                'number': sixDigitNumber
            },
            success: (data) => {

                // waiting for response
                // 1 - success
                // 2 - fail

                if(data.code === 1) {
                    window.location.assign('/dashboard')
                } else {
                    // Do something
                }

            }
        })

    })

})
